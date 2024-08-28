"use server";

import { type paths } from "~/tmdb/types";

import type { Status } from "./types";

export type SearchMoviesResponse =
  paths["/3/search/movie"]["get"]["responses"]["200"]["content"]["application/json"];

export type SearchMoviesQueryParams =
  paths["/3/search/movie"]["get"]["parameters"]["query"] & { api_key: string };

export type TMDBMovieSearchResult = NonNullable<
  SearchMoviesResponse["results"]
>[number];

export async function searchMovies(
  query: string,
): Promise<Status<{ data: SearchMoviesResponse }>> {
  const searchParams: SearchMoviesQueryParams = {
    query,
    api_key: process.env.TMDB_API_KEY!,
  };

  const url = new URL("https://api.themoviedb.org/3/search/movie");

  Object.entries(searchParams).forEach(([key, value]) =>
    url.searchParams.append(key, String(value)),
  );

  const response = await fetch(url.toString());

  if (response.status !== 200) {
    return { type: "error", message: "Failed to fetch movies" };
  }

  const data = (await response.json()) as SearchMoviesResponse;

  return { type: "success", data };
}
