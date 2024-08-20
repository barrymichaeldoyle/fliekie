"use server";

import { auth } from "@clerk/nextjs/server";
import { type InferSelectModel, eq } from "drizzle-orm";

import { db } from "../db";
import { movies, seenList } from "../db/schema";

import type { Status } from "./types";

export type SeenMovie = InferSelectModel<typeof movies>;

/**
 * List all movies from the current user's seen list.
 *
 * @returns A Status object containing the user's seen list movies or an error message.
 */
export async function listSeenMovies(): Promise<
  Status<{ movies: SeenMovie[] }>
> {
  const { userId: clerkId } = auth();

  if (!clerkId) {
    return { type: "error", message: "User not authenticated" };
  }

  const seenMovies = await db
    .select({ movies })
    .from(seenList)
    .innerJoin(movies, eq(seenList.tmdb_movie_id, movies.tmdb_movie_id))
    .where(eq(seenList.clerk_id, clerkId));

  return { type: "success", movies: seenMovies.map((seen) => seen.movies) };
}
