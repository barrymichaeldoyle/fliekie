"use server";

import type { Status } from "./types";
import type { paths } from "~/tmdb/types";
import { env } from "~/env";

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
    api_key: env.TMDB_API_KEY,
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

  data.results = data.results?.map((movie) => ({
    ...movie,
    release_date: movie.release_date
      ? new Intl.DateTimeFormat("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }).format(new Date(movie.release_date))
      : undefined,
  }));

  return { type: "success", data };
}
