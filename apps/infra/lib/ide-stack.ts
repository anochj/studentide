import * as fs from "node:fs";
import * as path from "node:path";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as ecrAssets from "aws-cdk-lib/aws-ecr-assets";
import * as ecs from "aws-cdk-lib/aws-ecs";
import * as efs from "aws-cdk-lib/aws-efs";
import * as events from "aws-cdk-lib/aws-events";
import * as eventsTargets from "aws-cdk-lib/aws-events-targets";
import * as iam from "aws-cdk-lib/aws-iam";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as nodejs from "aws-cdk-lib/aws-lambda-nodejs";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as cdk from "aws-cdk-lib/core";
import type { Construct } from "constructs";

const projectRoot = path.resolve(__dirname, "../../..");
const ideContainerPlatform = ecrAssets.Platform.LINUX_ARM64;
const ideRuntimePlatform = {
	operatingSystemFamily: ecs.OperatingSystemFamily.LINUX,
	cpuArchitecture: ecs.CpuArchitecture.ARM64,
};

function requiredEnv(name: string) {
	const value = process.env[name];
	if (!value) {
		throw new Error(`Missing required environment variable: ${name}`);
	}

	return value;
}

export class IDEStack extends cdk.Stack {
	constructor(scope: Construct, id: string, props?: cdk.StackProps) {
		super(scope, id, props);

		const cloudflareZoneId = requiredEnv("CLOUDFLARE_ZONE_ID");
		const cloudflareApiToken = requiredEnv("CLOUDFLARE_API_TOKEN");
		const ideStatusWebhookSecret = requiredEnv("AWS_IDE_STATUS_WEBHOOK_SECRET");
		const ideStatusWebhookUrl = requiredEnv("IDE_STATUS_WEBHOOK_URL");

		const ideVpc = new ec2.Vpc(this, "IdeVpc", {
			maxAzs: 2,
			natGateways: 0,
			subnetConfiguration: [
				{
					name: "Public",
					subnetType: ec2.SubnetType.PUBLIC,
				},
			],
			enableDnsHostnames: true,
			enableDnsSupport: true,
		});

		const starterFileBucket = new s3.Bucket(this, "StarterFileBucket", {
			bucketName: "studentide-starter-files",
			encryption: s3.BucketEncryption.S3_MANAGED,
			publicReadAccess: false,
			blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
		});

		const backendUser = new iam.User(this, "BackendUser", {
			userName: "studentide-backend-user",
		});
		const backendAccessKey = new iam.CfnAccessKey(this, "BackendAccessKey", {
			userName: backendUser.userName,
		});
		starterFileBucket.grantRead(backendUser);
		starterFileBucket.grantWrite(backendUser);

		const ideSg = new ec2.SecurityGroup(this, "IdeSecurityGroup", {
			vpc: ideVpc,
			allowAllOutbound: true,
			description:
				"Security group for IDE containers. Allows all outbound, only Cloudflare IPs inbound.",
		});

		// TODO: Could change this to an API call instead
		const cfIps = [
			"173.245.48.0/20",
			"103.21.244.0/22",
			"103.22.200.0/22",
			"103.31.4.0/22",
			"141.101.64.0/18",
			"108.162.192.0/18",
			"190.93.240.0/20",
			"188.114.96.0/20",
			"197.234.240.0/22",
			"198.41.128.0/17",
			"162.158.0.0/15",
			"104.16.0.0/13",
			"104.24.0.0/14",
			"172.64.0.0/13",
			"131.0.72.0/22",
		];

		for (const ip of cfIps) {
			ideSg.addIngressRule(
				ec2.Peer.ipv4(ip),
				ec2.Port.tcp(80),
				`Allow Cloudflare IP ${ip}`,
			);
		}

		const ideCluster = new ecs.Cluster(this, "IdeCluster", {
			vpc: ideVpc,
			clusterName: "ide-cluster",
		});

		const ideStartUpLambda = new nodejs.NodejsFunction(
			this,
			"IdeStartupFunction",
			{
				runtime: lambda.Runtime.NODEJS_LATEST,
				entry: path.join(__dirname, "../src/ide-startup/index.ts"),
				description:
					"Lambda function to start up IDE environment on ECS. Registers to CF.",
				environment: {
					CLOUDFLARE_ZONE_ID: cloudflareZoneId,
					CLOUDFLARE_API_TOKEN: cloudflareApiToken,
				},
				bundling: {
					externalModules: ["@aws-sdk/*"],
				},
			},
		);

		ideStartUpLambda.addToRolePolicy(
			new iam.PolicyStatement({
				effect: iam.Effect.ALLOW,
				actions: ["ec2:DescribeNetworkInterfaces"],
				resources: ["*"],
			}),
		);

		new events.Rule(this, "IDEStartUp", {
			description:
				"EventBridge rule to trigger start up lambda when ECS tasks starts running.",
			eventPattern: {
				detailType: ["ECS Task State Change"],
				source: ["aws.ecs"],
				detail: {
					lastStatus: ["RUNNING"],
					desiredStatus: ["RUNNING"],
					clusterArn: [ideCluster.clusterArn],
					group: events.Match.anythingBut("family:s3-archiver"),
				},
			},
			targets: [new eventsTargets.LambdaFunction(ideStartUpLambda)],
		});

		const ideShutDownLambda = new nodejs.NodejsFunction(
			this,
			"IdeShutdownFunction",
			{
				runtime: lambda.Runtime.NODEJS_LATEST,
				entry: path.join(__dirname, "../src/ide-shutdown/index.ts"),
				description:
					"Lambda function to shut down IDE environment on ECS. Deregisters from CF.",
				environment: {
					CLOUDFLARE_ZONE_ID: cloudflareZoneId,
					CLOUDFLARE_API_TOKEN: cloudflareApiToken,
				},
			},
		);

		ideShutDownLambda.addToRolePolicy(
			new iam.PolicyStatement({
				effect: iam.Effect.ALLOW,
				actions: ["ec2:DescribeNetworkInterfaces"],
				resources: ["*"],
			}),
		);

		const webhookConnection = new events.Connection(this, "IdeStatusWebhook", {
			authorization: events.Authorization.apiKey(
				"x-webhook-secret",
				cdk.SecretValue.unsafePlainText(ideStatusWebhookSecret),
			),
			description: "Connection to external REST API",
		});

		const apiDestination = new events.ApiDestination(
			this,
			"IdeStatusWebhookDestination",
			{
				connection: webhookConnection,
				endpoint: ideStatusWebhookUrl,
				httpMethod: events.HttpMethod.POST,
				rateLimitPerSecond: 10,
			},
		);

		new events.Rule(this, "IDEStatusChange", {
			description:
				"EventBridge rule to trigger REST endpoint when ECS tasks starts running.",
			eventPattern: {
				detailType: ["ECS Task State Change"],
				source: ["aws.ecs"],
				detail: {
					lastStatus: ["RUNNING", "STOPPED"],
					clusterArn: [ideCluster.clusterArn],
					group: events.Match.anythingBut("family:s3-archiver"),
				},
			},
			targets: [
				new eventsTargets.ApiDestination(apiDestination, {
					event: events.RuleTargetInput.fromObject({
						cluster: events.EventField.fromPath("$.detail.clusterArn"),
						taskArn: events.EventField.fromPath("$.detail.taskArn"),
						status: events.EventField.fromPath("$.detail.lastStatus"),
					}),
				}),
			],
		});

		new events.Rule(this, "IDEShutDown", {
			description:
				"EventBridge rule to trigger shut down lambda when ECS tasks starts running.",
			eventPattern: {
				detailType: ["ECS Task State Change"],
				source: ["aws.ecs"],
				detail: {
					lastStatus: ["STOPPED"],
					desiredStatus: ["STOPPED"],
					clusterArn: [ideCluster.clusterArn],
					group: events.Match.anythingBut("family:s3-archiver"),
				},
			},
			targets: [new eventsTargets.LambdaFunction(ideShutDownLambda)],
		});

		const ideEfs = new efs.FileSystem(this, "IdeEfs", {
			vpc: ideVpc,
			securityGroup: ideSg,
			encrypted: true,
			lifecyclePolicy: efs.LifecyclePolicy.AFTER_14_DAYS,
			performanceMode: efs.PerformanceMode.GENERAL_PURPOSE,
			fileSystemPolicy: new iam.PolicyDocument({
				statements: [
					new iam.PolicyStatement({
						principals: [new iam.AnyPrincipal()],
						effect: iam.Effect.ALLOW,
						actions: [
							"elasticfilesystem:ClientRootAccess",
							"elasticfilesystem:ClientWrite",
							"elasticfilesystem:ClientMount",
						],
					}),
				],
			}),
		});
		ideSg.addIngressRule(
			ideSg,
			ec2.Port.tcp(2049),
			"Allow EFS access from IDE containers",
		);

		const environmentExecutionRole = new iam.Role(
			this,
			"EnvironmentExecutionRole",
			{
				assumedBy: new iam.ServicePrincipal("ecs-tasks.amazonaws.com"),
				description: "Allows Fargate to pull container images and publish logs",
			},
		);

		environmentExecutionRole.addManagedPolicy(
			iam.ManagedPolicy.fromAwsManagedPolicyName(
				"service-role/AmazonECSTaskExecutionRolePolicy",
			),
		);

		const environmentTaskRole = new iam.Role(this, "EnvironmentTaskRole", {
			assumedBy: new iam.ServicePrincipal("ecs-tasks.amazonaws.com"),
			description:
				"Allows the IDE environment to read S3 and mount its EFS Access Point",
		});
		starterFileBucket.grantRead(environmentTaskRole);

		environmentTaskRole.addToPolicy(
			new iam.PolicyStatement({
				effect: iam.Effect.ALLOW,
				actions: [
					"elasticfilesystem:ClientMount",
					"elasticfilesystem:ClientWrite",
				],
				resources: [ideEfs.fileSystemArn, `${ideEfs.fileSystemArn}/*`],
			}),
		);

		const containersRoot = path.join(projectRoot, "containers");
		const environmentsRoot = path.join(containersRoot, "environments");
		const reverseProxyImage = ecs.ContainerImage.fromAsset(
			path.join(containersRoot, "reverse-proxy"),
			{ platform: ideContainerPlatform },
		);
		const watchDogImage = ecs.ContainerImage.fromAsset(
			path.join(containersRoot, "watchdog"),
			{ platform: ideContainerPlatform },
		);

		const environmentDir = fs.readdirSync(environmentsRoot);
		for (const env of environmentDir) {
			const envPath = path.join(environmentsRoot, env);

			// ignore not dirs
			if (!fs.statSync(envPath).isDirectory()) {
				continue;
			}

			const envImage = ecs.ContainerImage.fromAsset(envPath, {
				platform: ideContainerPlatform,
			});

			const taskDefinition = new ecs.FargateTaskDefinition(
				this,
				`${env}-env-def`,
				{
					cpu: 1024,
					memoryLimitMiB: 2048,
					runtimePlatform: ideRuntimePlatform,
					executionRole: environmentExecutionRole,
					taskRole: environmentTaskRole,
				},
			);

			taskDefinition.addVolume({
				name: "student-workspace-volume",
				efsVolumeConfiguration: {
					fileSystemId: ideEfs.fileSystemId,
					transitEncryption: "ENABLED", // Highly recommended for EFS
				},
			});

			const envContainer = taskDefinition.addContainer("environment", {
				image: envImage,
				containerName: "environment",
				essential: true,
				portMappings: [
					{
						containerPort: 3000,
					},
				],
				logging: ecs.LogDrivers.awsLogs({
					streamPrefix: "environment",
				}),
			});

			envContainer.addMountPoints({
				containerPath: "/mnt/efs", // The path your IDE uses internally
				sourceVolume: "student-workspace-volume",
				readOnly: false,
			});

			const watchDogContainer = taskDefinition.addContainer("watchdog", {
				image: watchDogImage,
				containerName: "watchdog",
				essential: false,
				logging: ecs.LogDrivers.awsLogs({
					streamPrefix: "watchdog",
				}),
			});
			watchDogContainer.addMountPoints({
				containerPath: "/mnt/efs",
				sourceVolume: "student-workspace-volume",
				readOnly: false,
			});

			taskDefinition.addContainer("reverse-proxy", {
				image: reverseProxyImage,
				containerName: "reverse-proxy",
				essential: false,
				portMappings: [
					{
						containerPort: 80,
					},
				],
				logging: ecs.LogDrivers.awsLogs({
					streamPrefix: "reverse-proxy",
				}),
			});
		}

		backendUser.addToPolicy(
			new iam.PolicyStatement({
				effect: iam.Effect.ALLOW,
				actions: [
					"elasticfilesystem:CreateAccessPoint",
					"elasticfilesystem:DeleteAccessPoint",
				],
				resources: [ideEfs.fileSystemArn],
			}),
		);

		backendUser.addToPolicy(
			new iam.PolicyStatement({
				effect: iam.Effect.ALLOW,
				actions: ["ecs:RegisterTaskDefinition", "ecs:DeregisterTaskDefinition"],
				resources: ["*"],
			}),
		);

		backendUser.addToPolicy(
			new iam.PolicyStatement({
				effect: iam.Effect.ALLOW,
				actions: ["ecs:RunTask"],
				resources: ["*"],
				conditions: {
					ArnEquals: { "ecs:cluster": ideCluster.clusterArn },
				},
			}),
		);

		backendUser.addToPolicy(
			new iam.PolicyStatement({
				effect: iam.Effect.ALLOW,
				actions: ["iam:PassRole"],
				resources: [
					environmentExecutionRole.roleArn,
					environmentTaskRole.roleArn,
				],
			}),
		);

		// s3-archiver

		const archiverRole = new iam.Role(this, "S3ArchiverRole", {
			assumedBy: new iam.ServicePrincipal("ecs-tasks.amazonaws.com"),
			description:
				"Allows the S3 archiver to write to S3 and mount its EFS Access Point",
		});
		starterFileBucket.grantWrite(archiverRole);
		backendUser.addToPolicy(
			new iam.PolicyStatement({
				effect: iam.Effect.ALLOW,
				actions: ["iam:PassRole"],
				resources: [archiverRole.roleArn],
			}),
		);

		const archiverDefinition = new ecs.FargateTaskDefinition(
			this,
			`s3-archiver`,
			{
				cpu: 512,
				memoryLimitMiB: 1024,
				runtimePlatform: ideRuntimePlatform,
				executionRole: environmentExecutionRole, // do i need this? should I make another one?
				taskRole: archiverRole,
			},
		);

		archiverDefinition.addVolume({
			name: "student-workspace-volume",
			efsVolumeConfiguration: {
				fileSystemId: ideEfs.fileSystemId,
				transitEncryption: "ENABLED", // Highly recommended for EFS
			},
		});

		const archiverContainer = archiverDefinition.addContainer("s3-archiver", {
			image: ecs.ContainerImage.fromAsset(`${containersRoot}/s3-archiver`, {
				platform: ideContainerPlatform,
			}),
			containerName: "s3-archiver",
			essential: true,
			logging: ecs.LogDrivers.awsLogs({
				streamPrefix: "s3-archiver",
			}),
		});

		archiverContainer.addMountPoints({
			containerPath: "/mnt/efs",
			sourceVolume: "student-workspace-volume",
			readOnly: false,
		});

		new cdk.CfnOutput(this, "AwsRegion", {
			value: this.region,
		});

		new cdk.CfnOutput(this, "AwsS3BucketName", {
			value: starterFileBucket.bucketName,
		});

		new cdk.CfnOutput(this, "AwsS3AccessKeyId", {
			value: backendAccessKey.ref,
		});

		new cdk.CfnOutput(this, "AwsS3SecretAccessKey", {
			value: backendAccessKey.attrSecretAccessKey,
		});

		new cdk.CfnOutput(this, "AwsIdeStatusWebhookSecret", {
			value: ideStatusWebhookSecret,
		});

		new cdk.CfnOutput(this, "EfsFilesystemId", {
			value: ideEfs.fileSystemId,
		});

		new cdk.CfnOutput(this, "EcsClusterName", {
			value: ideCluster.clusterName,
		});

		new cdk.CfnOutput(this, "EcsSubnets", {
			value: ideVpc.publicSubnets.map((s) => s.subnetId).join(","),
		});

		new cdk.CfnOutput(this, "EcsSecurityGroup", {
			value: ideSg.securityGroupId,
		});

		new cdk.CfnOutput(this, "S3ArchiverTaskDefinitionArn", {
			value: archiverDefinition.taskDefinitionArn,
		});
	}

	// TODO: Add cleanup and setup lambdas
}
