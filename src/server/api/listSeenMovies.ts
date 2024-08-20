"use server";

import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

import { db } from "../db";
import { movies, seenList } from "../db/schema";

import { type Status } from "./types";

export type SeenMovieItem = {
  id: string;
  tmdb_id: number;
  title: string;
  overview: string | null;
  release_date: Date | null;
  poster_path: string | null;
  rating: number | null;
  review: string | null;
};

/**
 * List all movies from the current user's seen list.
 *
 * @returns A Status object containing the user's seen list movies or an error message.
 */
export async function listSeenMovies(): Promise<
  Status<{ movies: SeenMovieItem[] }>
> {
  const { userId: clerkId } = auth();

  if (!clerkId) {
    return { type: "error", message: "User not authenticated" };
  }

  const seenMovies = await db
    .select({
      id: movies.id,
      tmdb_id: movies.tmdb_id,
      title: movies.title,
      overview: movies.overview,
      release_date: movies.release_date,
      poster_path: movies.poster_path,
      rating: seenList.rating,
      review: seenList.review,
    })
    .from(seenList)
    .innerJoin(movies, eq(seenList.movie_id, movies.id))
    .where(eq(seenList.clerk_id, clerkId));

  return { type: "success", movies: seenMovies };
}
