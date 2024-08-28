import { type WebhookEvent } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { Webhook } from "svix";

import { db } from "~/server/db";
import { type Environment, users } from "~/server/db/schema";

export async function POST(request: Request) {
  const CLERK_WEBHOOK_SIGNING_SECRET =
    process.env.CLERK_WEBHOOK_SIGNING_SECRET ?? "";

  if (!CLERK_WEBHOOK_SIGNING_SECRET) {
    throw new Error(
      "Please add CLERK_WEBHOOK_SIGNING_SECRET from Clerk Dashboard to .env",
    );
  }

  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  const payload = (await request.json()) as Record<string, unknown>;
  const body = JSON.stringify(payload);

  const wh = new Webhook(CLERK_WEBHOOK_SIGNING_SECRET);

  let event: WebhookEvent;

  try {
    event = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured", {
      status: 400,
    });
  }

  const environment: Environment =
    process.env.NODE_ENV === "production" ? "prod" : "dev";

  if (event.type === "user.created") {
    const clerkId = event.data.id;

    const existingUser = await db
      .select()
      .from(users)
      .where(
        and(eq(users.clerk_id, clerkId), eq(users.environment, environment)),
      )
      .then((rows) => rows[0]);

    if (!existingUser) {
      await db.insert(users).values({ clerk_id: clerkId, environment });
    }
  } else if (event.type === "user.deleted") {
    const clerkId = event.data.id;

    if (clerkId) {
      await db
        .delete(users)
        .where(
          and(eq(users.clerk_id, clerkId), eq(users.environment, environment)),
        );
    }
  }

  return new Response("", { status: 200 });
}