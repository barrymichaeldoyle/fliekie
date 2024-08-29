"use server";

import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

import { db } from "@fliekie/db/client";
import { movies, watchlist } from "@fliekie/db/schema";

import type { Movie, Status } from "./types";

/**
 * List all movies from the current user's watch list.
 *
 * @returns A Status object containing the user's watch list movies or an error message.
 */
export async function getWatchlist(): Promise<Status<{ movies: Movie[] }>> {
  const { userId: clerkId } = auth();

  if (!clerkId) {
    return { type: "error", message: "User not authenticated" };
  }

  const watchlistMovies = await db
    .select({ movies })
    .from(watchlist)
    .innerJoin(movies, eq(watchlist.tmdb_movie_id, movies.tmdb_movie_id))
    .where(eq(watchlist.clerk_id, clerkId));

  return {
    type: "success",
    movies: watchlistMovies.map((seen) => seen.movies),
  };
}
