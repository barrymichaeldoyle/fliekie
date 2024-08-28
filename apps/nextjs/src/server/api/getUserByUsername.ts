"use server";

import {  createClerkClient } from "@clerk/nextjs/server";
import type { User } from "@clerk/nextjs/server";

import { env } from '~/env';

import type { Status } from "./types";

const clerkClient = createClerkClient({
  secretKey: env.CLERK_SECRET_KEY,
});

export async function getUserByUsername(
  username: string,
): Promise<Status<{ user: User }>> {
  try {
    const users = await clerkClient.users.getUserList({
      username: [username],
    });

    if (users.data.length === 0 || !users.data[0]) {
      return { type: "error", message: "User not found" };
    }

    return { type: "success", user: users.data[0] };
  } catch (error) {
    console.error("Error fetching user:", error);
    return { type: "error", message: "Failed to fetch user" };
  }
}
