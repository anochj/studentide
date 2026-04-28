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

async function getRecordIdFromIdentifier(identifier: string): Promise<string | undefined> {
    const { CLOUDFLARE_ZONE_ID, CLOUDFLARE_API_TOKEN } = process.env;

    if (!CLOUDFLARE_ZONE_ID || !CLOUDFLARE_API_TOKEN) {
        throw new Error(
            "Cloudflare credentials are not set in environment variables",
        );
    }

    const url = new URL(`https://api.cloudflare.com/client/v4/zones/${CLOUDFLARE_ZONE_ID}/dns_records`);
    url.searchParams.append("name.startswith", identifier);

    const res = await fetch(
        url.toString(),
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${CLOUDFLARE_API_TOKEN}`,
            },
        },
    );

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Cloudflare API HTTP error: ${res.status} ${errorText}`);
    }

    const data = (await res.json()) as any;
    if (!data.success) {
        throw new Error(
            `Failed to fetch DNS records: ${JSON.stringify(data.errors)}`,
        );
    }

    return data.result[0]?.id;
}

async function deregisterFromCloudflare(recordId: string): Promise<void> {
    const { CLOUDFLARE_ZONE_ID, CLOUDFLARE_API_TOKEN } = process.env;

    if (!CLOUDFLARE_ZONE_ID || !CLOUDFLARE_API_TOKEN) {
        throw new Error(
            "Cloudflare credentials are not set in environment variables",
        );
    }

    const res = await fetch(
        `https://api.cloudflare.com/client/v4/zones/${CLOUDFLARE_ZONE_ID}/dns_records/${recordId}`,
        {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${CLOUDFLARE_API_TOKEN}`,
            },
        },
    );

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Cloudflare API HTTP error: ${res.status} ${errorText}`);
    }

    const data = (await res.json()) as any;
    if (!data.success) {
        throw new Error(
            `Failed to deregister DNS record: ${JSON.stringify(data.errors)}`,
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

        const recordId = await getRecordIdFromIdentifier(identifier);
        
        if (recordId) {
            await deregisterFromCloudflare(recordId);
            console.log(`Successfully deregistered DNS record for identifier ${identifier}`);
        } else {
            console.log(`No DNS record found for identifier ${identifier}, skipping deregistration.`);
        }

    } catch (e) {
        console.error("Error processing ECS task event:", e);
    }
};