"use server";

import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "~/server/db";
import { follows } from "~/server/db/schema";

import { type Status } from "./types";

/**
 * Server action to unfollow a user.
 * @param followedClerkId - The Clerk ID of the user to unfollow.
 * @returns Success or error message.
 */
export async function unfollowUser(followedClerkId: string): Promise<Status> {
  const { userId: followerClerkId } = auth();

  if (!followerClerkId) {
    return { type: "error", message: "User not authenticated" };
  }

  if (followerClerkId === followedClerkId) {
    return { type: "error", message: "You cannot unfollow yourself" };
  }

  const isFollowing = await db
    .select()
    .from(follows)
    .where(
      and(
        eq(follows.follower_clerk_id, followerClerkId),
        eq(follows.followed_clerk_id, followedClerkId),
      ),
    )
    .then((rows) => rows.length > 0);

  if (!isFollowing) {
    return { type: "error", message: "You are not following this user" };
  }

  await db
    .delete(follows)
    .where(
      and(
        eq(follows.follower_clerk_id, followerClerkId),
        eq(follows.followed_clerk_id, followedClerkId),
      ),
    );

  revalidatePath("/following", "page");

  return { type: "success" };
}
