"use server";

import { auth } from "@clerk/nextjs/server";
import { type InferSelectModel, eq } from "drizzle-orm";

import { db } from "../db";
import { movies, ratings } from "../db/schema";

import type { Status } from "./types";

export type RatedMovie = InferSelectModel<typeof movies>;

/**
 * List all movies that the current user has rated.
 *
 * @returns A `Status` object containing the user's rated movies or an error message.
 */
export async function getMyRatings(): Promise<
  Status<{ movies: RatedMovie[] }>
> {
  const { userId: clerkId } = auth();

  if (!clerkId) {
    return { type: "error", message: "User not authenticated" };
  }

  const ratedMovies = await db
    .select({ movies })
    .from(ratings)
    .innerJoin(movies, eq(ratings.tmdb_movie_id, movies.tmdb_movie_id))
    .where(eq(ratings.clerk_id, clerkId));

  return { type: "success", movies: ratedMovies.map((seen) => seen.movies) };
}
