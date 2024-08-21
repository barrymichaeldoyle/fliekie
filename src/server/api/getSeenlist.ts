"use server";

import { auth } from "@clerk/nextjs/server";
import { type InferSelectModel, eq } from "drizzle-orm";

import { db } from "../db";
import { movies, seenlist } from "../db/schema";

import type { Status } from "./types";

export type SeenMovie = InferSelectModel<typeof movies>;

/**
 * List all movies from the current user's seenlist.
 *
 * @returns A Status object containing the user's seenlist movies or an error message.
 */
export async function getSeenlist(): Promise<Status<{ movies: SeenMovie[] }>> {
  const { userId: clerkId } = auth();

  if (!clerkId) {
    return { type: "error", message: "User not authenticated" };
  }

  const seenMovies = await db
    .select({ movies })
    .from(seenlist)
    .innerJoin(movies, eq(seenlist.tmdb_movie_id, movies.tmdb_movie_id))
    .where(eq(seenlist.clerk_id, clerkId));

  return { type: "success", movies: seenMovies.map((seen) => seen.movies) };
}
