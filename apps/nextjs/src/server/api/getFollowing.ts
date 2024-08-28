"use server";

import {  auth, clerkClient } from "@clerk/nextjs/server";
import type { User } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

import { db } from "~/server/db";
import { follows } from "~/server/db/schema";

import type { Status } from "./types";

/**
 * Server function to get users the authenticated user is following.
 * @returns A list of users the authenticated user is following or an error message.
 */
export async function getFollowing(): Promise<Status<{ users: User[] }>> {
  const { userId: clerkId } = auth();

  if (!clerkId) {
    return { type: "error", message: "User not authenticated" };
  }

  const followedUserIds = (
    await db
      .select({ followed_clerk_id: follows.followed_clerk_id })
      .from(follows)
      .where(eq(follows.follower_clerk_id, clerkId))
  ).map((user) => user.followed_clerk_id);

  if (followedUserIds.length === 0) {
    return { type: "success", users: [] };
  }

  const followedUsers = await clerkClient().users.getUserList({
    userId: followedUserIds,
  });

  return { type: "success", users: followedUsers.data };
}
