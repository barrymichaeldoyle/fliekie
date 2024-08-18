"use server";

import { auth } from "@clerk/nextjs/server";
import { and, eq, inArray } from "drizzle-orm";

import { db } from "../db";
import { seenList, movies } from "../db/schema";
import type { Status } from "./types";

export async function searchMovies(
  query: string,
): Promise<Status<{ results: any[] }>> {
  const { userId: clerkId } = auth();

  const response = await fetch(
    `https://api.themoviedb.org/3/search/movie?api_key=${process.env.TMDB_API_KEY}&query=${query}`,
  );

  if (response.status !== 200) {
    return { type: "error", message: "Failed to fetch movies" };
  }

  const results = await response.json();

  const tmdbIds = results.results.map((movie: any) => movie.id);

  if (tmdbIds.length === 0) {
    return { type: "success", results: [] };
  }

  if (clerkId) {
    const seenMovies = await db
      .select({
        tmdbId: movies.tmdbId,
      })
      .from(seenList)
      .innerJoin(movies, eq(seenList.movieId, movies.id))
      .where(
        and(eq(seenList.clerkId, clerkId), inArray(movies.tmdbId, tmdbIds)),
      );

    const seenMovieIds = new Set(seenMovies.map((movie) => movie.tmdbId));

    const enrichedResults = results.results.map((movie: any) => ({
      ...movie,
      seen: seenMovieIds.has(movie.id),
    }));

    return { type: "success", results: enrichedResults };
  }

  const enrichedResults = results.results.map((movie: any) => ({
    ...movie,
    seen: false,
  }));

  return { type: "success", results: enrichedResults };
}
