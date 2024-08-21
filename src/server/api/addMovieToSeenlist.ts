"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "../db";
import { seenlist } from "../db/schema";

import type { Status, TMDBMovie } from "./types";
import { ensureUserExists } from "./utils/ensureUserExists";
import { getOrCreateMovie } from "./utils/getOrCreateMovie";

export async function addMovieToSeenlist(movie: TMDBMovie): Promise<Status> {
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
    .where(
      and(
        eq(seenlist.clerk_id, ensureUserExistsStatus.clerkId),
        eq(seenlist.tmdb_movie_id, getOrCreateMovieStatus.tmdb_movie_id),
      ),
    )
    .then((rows) => rows[0]);

  if (existingSeenlistEntry) {
    return { type: "success" };
  }

  await db.insert(seenlist).values({
    clerk_id: ensureUserExistsStatus.clerkId,
    tmdb_movie_id: getOrCreateMovieStatus.tmdb_movie_id,
    rating: null,
    review: "",
  });

  revalidatePath(`/movies/${movie.id}`);

  return { type: "success" };
}
