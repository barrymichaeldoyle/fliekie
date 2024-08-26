import { type WebhookEvent } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "~/server/db";
import { users } from "~/server/db/schema";

export async function POST(request: Request) {
  const event = (await request.json()) as WebhookEvent;

  const environment = process.env.NODE_ENV === "production" ? "prod" : "dev";

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
