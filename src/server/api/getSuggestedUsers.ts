"use server";

import { type User, auth, clerkClient } from "@clerk/nextjs/server";
import { eq, notInArray } from "drizzle-orm";

import { db } from "~/server/db";
import { follows, users } from "~/server/db/schema";

import { type Status } from "./types";

export async function getSuggestedUsers(): Promise<Status<{ users: User[] }>> {
  const { userId: clerkId } = auth();

  if (!clerkId) {
    return { type: "error", message: "User not authenticated" };
  }

  const followedUsers = await db
    .select({ followed_clerk_id: follows.followed_clerk_id })
    .from(follows)
    .where(eq(follows.follower_clerk_id, clerkId));

  const followedIds = followedUsers.map((user) => user.followed_clerk_id);

  const suggestedUserIds = (
    await db
      .select({ clerkId: users.clerk_id })
      .from(users)
      .where(notInArray(users.clerk_id, [...followedIds, clerkId]))
      /**
       * The maximum clerk can provide is 100 (accepts 100 userIds).
       * https://clerk.com/docs/references/backend/user/get-user-list#user-list-params
       * But we can do some infinite scrolling pagination techniques here later.
       */
      .limit(100)
  ).map((user) => user.clerkId);

  const suggestedUsers = await clerkClient.users.getUserList({
    userId: suggestedUserIds,
  });

  return { type: "success", users: suggestedUsers.data };
}
