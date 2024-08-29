"use server";

import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";

import { db } from "@fliekie/db";
import { users } from "@fliekie/db/schema";

import type { Status } from "../types";
import { env } from "~/env";

/**
 * A helper function to ensure that the user exists in the database
 *
 * @param clerkId The clerk id of the user
 */
export async function ensureUserExists(): Promise<Status<{ clerkId: string }>> {
  const { userId: clerkId } = auth();

  if (!clerkId) {
    return { type: "error", message: "User not authenticated" };
  }

  const environment = env.NODE_ENV === "production" ? "prod" : "dev";

  const existingUser = await db
    .select()
    .from(users)
    .where(and(eq(users.clerk_id, clerkId), eq(users.environment, environment)))
    .then((rows) => rows[0]);

  if (!existingUser) {
    await db.insert(users).values({ clerk_id: clerkId, environment });
  }

  return { type: "success", clerkId };
}
