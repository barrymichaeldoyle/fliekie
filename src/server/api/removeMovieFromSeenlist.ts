"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "../db";
import { movies, seenlist } from "../db/schema";

import type { Status, TMDBMovie } from "./types";
import { ensureUserExists } from "./utils/ensureUserExists";
import { getOrCreateMovie } from "./utils/getOrCreateMovie";

export async function removeMovieFromSeenlist(
  movie: TMDBMovie,
): Promise<Status> {
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
    .from(seenlist)
    .innerJoin(movies, eq(seenlist.tmdb_movie_id, movies.tmdb_movie_id))
    .where(
      and(
        eq(seenlist.clerk_id, ensureUserExistsStatus.clerkId),
        eq(movies.tmdb_movie_id, getOrCreateMovieStatus.tmdb_movie_id),
      ),
    )
    .then((rows) => rows[0]);

  if (!existingSeenlistEntry) {
    return { type: "success" };
  }

  await db
    .delete(seenlist)
    .where(eq(seenlist.id, existingSeenlistEntry.seenlist.id));

  revalidatePath(`/movies/${movie.id}`);

  return { type: "success" };
}
