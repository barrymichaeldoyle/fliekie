"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "../db";
import { movies, seenList } from "../db/schema";

import type { Status, TMDBMovie } from "./types";
import { ensureUserExists } from "./utils/ensureUserExists";
import { getOrCreateMovie } from "./utils/getOrCreateMovie";

export async function removeMovieFromSeenList(
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

  const existingSeenListEntry = await db
    .select()
    .from(seenList)
    .innerJoin(movies, eq(seenList.tmdb_movie_id, movies.tmdb_movie_id))
    .where(
      and(
        eq(seenList.clerk_id, ensureUserExistsStatus.clerkId),
        eq(movies.tmdb_movie_id, getOrCreateMovieStatus.tmdb_movie_id),
      ),
    )
    .then((rows) => rows[0]);

  if (!existingSeenListEntry) {
    return { type: "success" };
  }

  await db
    .delete(seenList)
    .where(eq(seenList.id, existingSeenListEntry.seen_list.id));

  revalidatePath(`/movies/${movie.id}`);

  return { type: "success" };
}
