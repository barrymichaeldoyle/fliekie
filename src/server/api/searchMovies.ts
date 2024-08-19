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
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
    url.searchParams.append(key, (searchParams as any)[key]),
  );

  const response = await fetch(url.toString());

  if (response.status !== 200) {
    return { type: "error", message: "Failed to fetch movies" };
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const data: SearchMoviesResponse = await response.json();

  return { type: "success", data };
}
