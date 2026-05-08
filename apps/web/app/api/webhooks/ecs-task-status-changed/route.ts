import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { ideSessions } from "@/db/schema";
import { env } from "@/lib/env";

const WEBHOOK_SECRET_HEADER = "x-webhook-secret";

const ecsTaskStatusChangedPayloadSchema = z.object({
  cluster: z.string().min(1),
  taskArn: z.string().min(1),
  status: z.enum(["RUNNING", "STOPPED"]),
});

export async function POST(request: Request) {
  const expectedSecret = env.AwsIdeStatusWebhookSecret;
  const actualSecret = request.headers.get(WEBHOOK_SECRET_HEADER);

  if (actualSecret !== expectedSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON payload" },
      { status: 400 },
    );
  }

  const result = ecsTaskStatusChangedPayloadSchema.safeParse(json);
  if (!result.success) {
    return NextResponse.json(
      { error: "Invalid event payload" },
      { status: 400 },
    );
  }

  const payload = result.data;
  const status = payload.status === "RUNNING" ? "active" : "terminated";
  const endedAt = payload.status === "STOPPED" ? new Date() : null;

  const [updatedSession] = await db
    .update(ideSessions)
    .set({
      status,
      ended_at: endedAt,
    })
    .where(eq(ideSessions.task_arn, payload.taskArn))
    .returning({
      id: ideSessions.id,
      status: ideSessions.status,
    });

  if (!updatedSession) {
    return NextResponse.json(
      { error: "No IDE session found for task", taskArn: payload.taskArn },
      { status: 404 },
    );
  }

  return NextResponse.json({
    success: true,
    session: updatedSession,
  });
}
