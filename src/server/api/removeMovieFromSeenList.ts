"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "../db";
import { movies, seenList } from "../db/schema";

import type { EnrichedTMDBMovie, Status } from "./types";
import { ensureUserExists } from "./utils/ensureUserExists";
import { getOrCreateMovie } from "./utils/getOrCreateMovie";

export async function removeMovieFromSeenList(
  movie: EnrichedTMDBMovie,
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
    .innerJoin(movies, eq(seenList.movieId, movies.id))
    .where(
      and(
        eq(seenList.clerkId, ensureUserExistsStatus.clerkId),
        eq(movies.id, getOrCreateMovieStatus.movieId),
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
