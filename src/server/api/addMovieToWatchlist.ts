"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "../db";
import { watchlist } from "../db/schema";

import type { Status, TMDBMovie } from "./types";
import { ensureUserExists } from "./utils/ensureUserExists";
import { getOrCreateMovie } from "./utils/getOrCreateMovie";

export async function addMovieToWatchlist(movie: TMDBMovie): Promise<Status> {
  const ensureUserExistsStatus = await ensureUserExists();

  if (ensureUserExistsStatus.type === "error") {
    return ensureUserExistsStatus;
  }

  const getOrCreateMovieStatus = await getOrCreateMovie(movie);

  if (getOrCreateMovieStatus.type === "error") {
    return getOrCreateMovieStatus;
  }

  const existingWatchlistEntry = await db
    .select()
    .from(watchlist)
    .where(
      and(
        eq(watchlist.clerk_id, ensureUserExistsStatus.clerkId),
        eq(watchlist.tmdb_movie_id, getOrCreateMovieStatus.tmdb_movie_id),
      ),
    )
    .then((rows) => rows[0]);

  if (existingWatchlistEntry) {
    return { type: "success" };
  }

  await db.insert(watchlist).values({
    clerk_id: ensureUserExistsStatus.clerkId,
    tmdb_movie_id: getOrCreateMovieStatus.tmdb_movie_id,
  });

  revalidatePath(`/movies/${movie.id}`);

  return { type: "success" };
}
