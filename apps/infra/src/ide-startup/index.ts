import {
	EC2Client,
	DescribeNetworkInterfacesCommand,
} from "@aws-sdk/client-ec2";

const ec2 = new EC2Client({});

type EventBridgeECSTaskEvent = {
	id: string;
	detail: {
		clusterArn: string;
		taskArn: string;
		lastStatus: string;
		attachments?: Array<{
			type: string;
			details?: Array<{
				name: string;
				value: string;
			}>;
		}>;
		overrides?: {
			containerOverrides?: Array<{
				environment?: Array<{
					name: string;
					value: string;
				}>;
			}>;
		};
	};
};

async function getPublicIpFromEni(networkInterfaceId: string): Promise<string> {
	const command = new DescribeNetworkInterfacesCommand({
		NetworkInterfaceIds: [networkInterfaceId],
	});

	const eniResult = await ec2.send(command);
	const publicIp = eniResult.NetworkInterfaces?.[0]?.Association?.PublicIp;

	if (!publicIp) {
		throw new Error(
			"Public IP not found. The task may not have a public IP assigned.",
		);
	}

	return publicIp;
}

async function registerToCloudflare(
	recordName: string,
	publicIp: string,
): Promise<void> {
	const { CLOUDFLARE_ZONE_ID, CLOUDFLARE_API_TOKEN } = process.env;

	if (!CLOUDFLARE_ZONE_ID || !CLOUDFLARE_API_TOKEN) {
		throw new Error(
			"Cloudflare credentials are not set in environment variables",
		);
	}

	const res = await fetch(
		`https://api.cloudflare.com/client/v4/zones/${CLOUDFLARE_ZONE_ID}/dns_records`,
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${CLOUDFLARE_API_TOKEN}`,
			},
			body: JSON.stringify({
				name: `${recordName}-ide`,
				ttl: 1,
				type: "A",
				comment: "Registration of IDE task",
				proxied: true,
				content: publicIp,
			}),
		},
	);

	if (!res.ok) {
		const errorText = await res.text();
		throw new Error(`Cloudflare API HTTP error: ${res.status} ${errorText}`);
	}

	const data = (await res.json()) as { success: boolean; errors: unknown[] };
	if (!data.success) {
		throw new Error(
			`Failed to register DNS record: ${JSON.stringify(data.errors)}`,
		);
	}
}

function getIdentifierFromEvent(event: EventBridgeECSTaskEvent): string | null {
	const overrides = event.detail.overrides?.containerOverrides ?? [];

	for (const container of overrides) {
		const envs = container.environment ?? [];
		const identifier = envs.find((e) => e.name === "IDENTIFIER");
		if (identifier) {
			return identifier.value.toLowerCase();
		}
	}

	return null;
}

export const handler = async (event: EventBridgeECSTaskEvent) => {
	try {
		const identifier = getIdentifierFromEvent(event);
		if (!identifier) {
			console.log(
				"No identifier found in event overrides, skipping registration.",
			);
			return;
		}

		const eniAttachment = event.detail.attachments?.find(
			(a) => a.type === "eni",
		);
		const networkInterfaceId = eniAttachment?.details?.find(
			(d) => d.name === "networkInterfaceId",
		)?.value;

		if (!networkInterfaceId) {
			throw new Error(
				"Network interface ID not found in the event payload attachments.",
			);
		}

		const publicIp = await getPublicIpFromEni(networkInterfaceId);

		await registerToCloudflare(identifier, publicIp);
		console.log(`Successfully registered ${identifier}.ide to IP ${publicIp}`);
	} catch (e) {
		console.error("Error processing ECS task event:", e);
	}
};
