"use server";

import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";

import { db } from "@fliekie/db";
import { watchlist } from "@fliekie/db/schema";

import type { Status } from "./types";

import { ensureUserExists } from "./utils/ensureUserExists";
import { getOrCreateMovie } from "./utils/getOrCreateMovie";

export async function addMovieToWatchlist(
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

  revalidatePath(`/movies/${tmdb_movie_id}`);

  return { type: "success" };
}
