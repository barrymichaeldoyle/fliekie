"use server";

import type {
  SearchMoviesQueryParams,
  SearchMoviesResponse,
  Status,
} from "./types";

export async function searchMovies(
  query: string,
): Promise<Status<{ data: SearchMoviesResponse }>> {
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

  return { type: "success", data };
}
