import * as cdk from "aws-cdk-lib/core";
import { Construct } from "constructs";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as ecs from "aws-cdk-lib/aws-ecs";
import * as efs from "aws-cdk-lib/aws-efs";
import * as iam from "aws-cdk-lib/aws-iam";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as nodejs from "aws-cdk-lib/aws-lambda-nodejs";
import * as events from "aws-cdk-lib/aws-events";
import * as eventsTargets from "aws-cdk-lib/aws-events-targets";

import * as fs from "node:fs";
import * as path from "node:path";

const ProjectRoot = __dirname + "/../../../..";
export class IDEStack extends cdk.Stack {
	constructor(scope: Construct, id: string, props?: cdk.StackProps) {
		super(scope, id, props);

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
		starterFileBucket.grantRead(backendUser);
		starterFileBucket.grantWrite(backendUser);

		const ideSg = new ec2.SecurityGroup(this, "IdeSecurityGroup", {
			vpc: ideVpc,
			allowAllOutbound: true,
			description:
				"Security group for IDE containers. Allows all outbound, only Cloudflare IPs inbound.",
		});

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

		const containersRoot = `${ProjectRoot}/containers`;
		const reverseProxyImage = ecs.ContainerImage.fromAsset(
			`${containersRoot}/reverse-proxy`,
		);
		const watchDogImage = ecs.ContainerImage.fromAsset(
			`${containersRoot}/watchdog`,
		);

		const environmentDir = fs.readdirSync(`${containersRoot}/environments`);
		for (const env of environmentDir) {
			const envPath = path.join(`${containersRoot}/environments`, env);

			// ignore not dirs
			if (!fs.statSync(envPath).isDirectory()) {
				continue;
			}

			const envImage = ecs.ContainerImage.fromAsset(envPath);

			const taskDefinition = new ecs.FargateTaskDefinition(
				this,
				`${env}-env-def`,
				{
					cpu: 1024,
					memoryLimitMiB: 2048,
					runtimePlatform: {
						operatingSystemFamily: ecs.OperatingSystemFamily.LINUX,
						cpuArchitecture: ecs.CpuArchitecture.ARM64,
					},
					executionRole: environmentExecutionRole,
					taskRole: environmentTaskRole,
				},
			);

			taskDefinition.addContainer(env, {
				image: envImage,
				containerName: env,
				essential: true,
				portMappings: [
					{
						containerPort: 3000,
					},
				],
			});

			taskDefinition.addContainer("watchdog", {
				image: watchDogImage,
				containerName: "watchdog",
				essential: false,
				logging: ecs.LogDrivers.awsLogs({
					streamPrefix: "watchdog",
				}),
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

		const ideStartUpLambda = new nodejs.NodejsFunction(
			this,
			"IdeStartupFunction",
			{
				runtime: lambda.Runtime.NODEJS_LATEST,
				entry: path.join(__dirname, "../src/ide-startup/index.ts"),
				description:
					"Lambda function to start up IDE environment on ECS. Registers to CF.",
				environment: {
					// TODO: Add cf credentials
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
					clusterArn: [ideCluster.clusterArn],
				},
			},
			targets: [new eventsTargets.LambdaFunction(ideStartUpLambda)],
		});
	}

	// TODO: Add cleanup and setup lambdas
}
