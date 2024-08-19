"use server";

import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

import { db } from "~/server/db";
import { users } from "~/server/db/schema";

import { type Status } from "../types";

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

  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.clerkId, clerkId))
    .then((rows) => rows[0]);

  if (!existingUser) {
    await db.insert(users).values({ clerkId });
  }

  return { type: "success", clerkId };
}
