import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";

import { db } from "../db";
import { movies, seenList } from "../db/schema";

import type { EnrichedTMDBMovie, Status, TMDBMovie } from "./types";


export async function getMovie(
  tmdb_id: number,
): Promise<Status<{ data: EnrichedTMDBMovie }>> {
  const url = new URL(`https://api.themoviedb.org/3/movie/${tmdb_id}`);

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
    return { type: "success", data: { ...data, seen: false } };
  }

  const seenMovie = await db
    .select({ movieId: seenList.movieId })
    .from(seenList)
    .innerJoin(movies, eq(seenList.movieId, movies.id))
    .where(and(eq(seenList.clerkId, clerkId), eq(movies.tmdbId, tmdb_id)))
    .then((rows) => rows.length > 0);

  return { type: "success", data: { ...data, seen: seenMovie } };
}
