import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";

import { type paths } from "~/tmdb/types";

import { db } from "../db";
import { movies, seenlist, watchlist } from "../db/schema";

import type { Status } from "./types";

export type TMDBMovie =
  paths["/3/movie/{movie_id}"]["get"]["responses"]["200"]["content"]["application/json"];

export type EnrichedTMDBMovie = TMDBMovie & {
  inSeenlist: boolean;
  inWatchlist: boolean;
};

export async function getMovie(
  tmdb_movie_id: number,
): Promise<Status<{ data: EnrichedTMDBMovie }>> {
  const url = new URL(`https://api.themoviedb.org/3/movie/${tmdb_movie_id}`);

  const searchParams = {
    api_key: process.env.TMDB_API_KEY!,
  };

  Object.entries(searchParams).forEach(([key, value]) =>
    url.searchParams.append(key, String(value)),
  );

  const response = await fetch(url.toString());

  if (response.status !== 200) {
    return { type: "error", message: "Failed to fetch movie" };
  }

  const { userId: clerkId } = auth();

  const data = (await response.json()) as TMDBMovie;

  if (!clerkId) {
    return {
      type: "success",
      data: { ...data, inSeenlist: false, inWatchlist: false },
    };
  }

  const inSeenlist = await db
    .select({ tmdb_movie_id: seenlist.tmdb_movie_id })
    .from(seenlist)
    .innerJoin(movies, eq(seenlist.tmdb_movie_id, movies.tmdb_movie_id))
    .where(
      and(
        eq(seenlist.clerk_id, clerkId),
        eq(movies.tmdb_movie_id, tmdb_movie_id),
      ),
    )
    .then((rows) => rows.length > 0);

  const inWatchlist = await db
    .select({ tmdb_movie_id: watchlist.tmdb_movie_id })
    .from(watchlist)
    .innerJoin(movies, eq(watchlist.tmdb_movie_id, movies.tmdb_movie_id))
    .where(
      and(
        eq(watchlist.clerk_id, clerkId),
        eq(movies.tmdb_movie_id, tmdb_movie_id),
      ),
    )
    .then((rows) => rows.length > 0);

  return { type: "success", data: { ...data, inSeenlist, inWatchlist } };
}
