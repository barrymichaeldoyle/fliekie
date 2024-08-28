"use server";

import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "~/server/db";
import { follows, users } from "~/server/db/schema";

import { type Status } from "./types";

/**
 * Server action to follow a user.
 * @param followedClerkId - The Clerk ID of the user to follow.
 * @returns Success or error message.
 */
export async function followUser(followedClerkId: string): Promise<Status> {
  const { userId: followerClerkId } = auth();

  if (!followerClerkId) {
    return { type: "error", message: "User not authenticated" };
  }

  if (followerClerkId === followedClerkId) {
    return { type: "error", message: "You cannot follow yourself" };
  }

  const followedUserExists = await db
    .select()
    .from(users)
    .where(eq(users.clerk_id, followedClerkId))
    .then((rows) => rows.length > 0);

  if (!followedUserExists) {
    return {
      type: "error",
      message: "The user you are trying to follow does not exist",
    };
  }

  const isAlreadyFollowing = await db
    .select()
    .from(follows)
    .where(
      and(
        eq(follows.follower_clerk_id, followerClerkId),
        eq(follows.followed_clerk_id, followedClerkId),
      ),
    )
    .then((rows) => rows.length > 0);

  if (isAlreadyFollowing) {
    return { type: "error", message: "You are already following this user" };
  }

  await db.insert(follows).values({
    follower_clerk_id: followerClerkId,
    followed_clerk_id: followedClerkId,
    created_at: new Date(),
  });

  revalidatePath("/following", "page");

  return { type: "success" };
}
