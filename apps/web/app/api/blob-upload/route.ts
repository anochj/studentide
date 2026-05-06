import { getServerSession } from "@/actions/utils";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";

export async function POST(request: Request): Promise<NextResponse> {
	const body = (await request.json()) as HandleUploadBody;
	const session = await getServerSession();

    if (!session) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 },
        );
    }

	try {
		const jsonResponse = await handleUpload({
			body,
			request,
			onBeforeGenerateToken: async (
				pathname,
			) => {
				if (!session) throw new Error("Not authenticated");

				return {
					allowedContentTypes: [
						"image/jpeg",
						"image/png",
						"image/webp",
						"image/gif",
						"image/heic",
						"image/heif",
						"image/avif",
					],
					maximumSizeInBytes: 10 * 1024 * 1024, // 10MB
					addRandomSuffix: true,
					tokenPayload: JSON.stringify({
						userId: session.user.id,
					}),
				};
			},
		});

		return NextResponse.json(jsonResponse);
	} catch (error) {
		return NextResponse.json(
			{ error: (error as Error).message },
			{ status: 400 }, // The webhook will retry 5 times waiting for a 200
		);
	}
}
