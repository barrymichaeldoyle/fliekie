"use server";

import { auth } from "@clerk/nextjs/server";
import { and, eq, inArray } from "drizzle-orm";

import { db } from "../db";
import { seenList, movies } from "../db/schema";
import type {
  EnrichedSearchMoviesResponse,
  SearchMoviesQueryParams,
  SearchMoviesResponse,
  Status,
} from "./types";

export async function searchMovies(
  query: string,
): Promise<Status<{ data: EnrichedSearchMoviesResponse }>> {
  const { userId: clerkId } = auth();

  const searchParams: SearchMoviesQueryParams = {
    query,
    api_key: process.env.TMDB_API_KEY!,
  };
  const url = new URL("https://api.themoviedb.org/3/search/movie");
  Object.keys(searchParams).forEach((key) =>
    url.searchParams.append(key, (searchParams as any)[key]),
  );

  const response = await fetch(url.toString());

  if (response.status !== 200) {
    return { type: "error", message: "Failed to fetch movies" };
  }

  const data: SearchMoviesResponse = await response.json();

  const emptySuccess: Status<{ data: EnrichedSearchMoviesResponse }> = {
    type: "success",
    data: { page: 0, total_pages: 0, total_results: 0, results: [] },
  };

  if (!data.results) {
    return emptySuccess;
  }

  const tmdbIds = data.results.map((movie) => movie.id);

  if (tmdbIds.length === 0) {
    return emptySuccess;
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

    const enrichedResults = data.results.map((movie) => ({
      ...movie,
      seen: seenMovieIds.has(movie.id),
    }));

    return { type: "success", data: { ...data, results: enrichedResults } };
  }

  const enrichedResults = data.results.map((movie) => ({
    ...movie,
    seen: false,
  }));

  return { type: "success", data: { ...data, results: enrichedResults } };
}
