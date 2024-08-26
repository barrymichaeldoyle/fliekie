import { type WebhookEvent } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { Webhook } from "svix";

import { db } from "~/server/db";
import { type Environment, users } from "~/server/db/schema";

const CLERK_WEBHOOK_SIGNING_SECRET =
  process.env.CLERK_WEBHOOK_SIGNING_SECRET ?? "";

export async function POST(request: Request) {
  const wh = new Webhook(CLERK_WEBHOOK_SIGNING_SECRET);
  const headers = Object.fromEntries(request.headers.entries());
  const rawBody = await request.text();

  const event = wh.verify(rawBody, headers) as WebhookEvent;

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

  return NextResponse.json({ received: true });
}
