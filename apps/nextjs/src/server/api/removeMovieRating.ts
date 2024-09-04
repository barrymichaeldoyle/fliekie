"use server";

import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";

import { db } from "@fliekie/db";
import { movies, ratings } from "@fliekie/db/schema";

import type { Status } from "./types";

import { ensureUserExists } from "./utils/ensureUserExists";
import { getOrCreateMovie } from "./utils/getOrCreateMovie";

export async function removeMovieRating(
  tmdb_movie_id: number,
): Promise<Status> {
  const ensureUserExistsStatus = await ensureUserExists();

  if (ensureUserExistsStatus.type === "error") {
    return ensureUserExistsStatus;
  }

  const getOrCreateMovieStatus = await getOrCreateMovie(tmdb_movie_id);

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

  revalidatePath(`/movies/${tmdb_movie_id}`);

  return { type: "success" };
}
