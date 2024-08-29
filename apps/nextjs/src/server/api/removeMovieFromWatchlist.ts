"use server";

import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";

import type { Status, TMDBMovie } from "./types";

import { db } from "../../../../../packages/db/src";
import { movies, watchlist } from "../../../../../packages/db/src/schema";
import { ensureUserExists } from "./utils/ensureUserExists";
import { getOrCreateMovie } from "./utils/getOrCreateMovie";

export async function removeMovieFromWatchlist(
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

  const existingWatchlistEntry = await db
    .select()
    .from(watchlist)
    .innerJoin(movies, eq(watchlist.tmdb_movie_id, movies.tmdb_movie_id))
    .where(
      and(
        eq(watchlist.clerk_id, ensureUserExistsStatus.clerkId),
        eq(movies.tmdb_movie_id, getOrCreateMovieStatus.tmdb_movie_id),
      ),
    )
    .then((rows) => rows[0]);

  if (!existingWatchlistEntry) {
    return { type: "success" };
  }

  await db
    .delete(watchlist)
    .where(eq(watchlist.id, existingWatchlistEntry.watchlist.id));

  revalidatePath(`/movies/${movie.id}`);

  return { type: "success" };
}
