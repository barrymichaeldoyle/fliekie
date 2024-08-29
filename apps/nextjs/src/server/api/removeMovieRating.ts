"use server";

import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";

import { db } from "@fliekie/db/client";
import { movies, ratings } from "@fliekie/db/schema";

import type { Status, TMDBMovie } from "./types";

import { ensureUserExists } from "./utils/ensureUserExists";
import { getOrCreateMovie } from "./utils/getOrCreateMovie";

export async function removeMovieRating(movie: TMDBMovie): Promise<Status> {
  const ensureUserExistsStatus = await ensureUserExists();

  if (ensureUserExistsStatus.type === "error") {
    return ensureUserExistsStatus;
  }

  const getOrCreateMovieStatus = await getOrCreateMovie(movie);

  if (getOrCreateMovieStatus.type === "error") {
    return getOrCreateMovieStatus;
  }

  const existingSeenlistEntry = await db
    .select()
    .from(ratings)
    .innerJoin(movies, eq(ratings.tmdb_movie_id, movies.tmdb_movie_id))
    .where(
      and(
        eq(ratings.clerk_id, ensureUserExistsStatus.clerkId),
        eq(movies.tmdb_movie_id, getOrCreateMovieStatus.tmdb_movie_id),
      ),
    )
    .then((rows) => rows[0]);

  if (!existingSeenlistEntry) {
    return { type: "success" };
  }

  await db
    .delete(ratings)
    .where(eq(ratings.id, existingSeenlistEntry.ratings.id));

  revalidatePath(`/movies/${movie.id}`);

  return { type: "success" };
}
