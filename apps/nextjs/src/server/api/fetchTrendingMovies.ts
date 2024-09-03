"use server";

import type { Status } from "./types";
import type { paths } from "~/tmdb/types";
import { env } from "~/env";

export type TrendingMoviesResponse =
  paths["/3/trending/movie/{time_window}"]["get"]["responses"]["200"]["content"]["application/json"];

export interface TrendingMoviesQueryParams {
  api_key: string;
  language?: string;
  page?: number;
}

export type TMDBMovieTrendingResult = NonNullable<
  TrendingMoviesResponse["results"]
>[number];

export async function fetchTrendingMovies(
  timeWindow: "day" | "week" = "day",
  page = 1,
): Promise<Status<{ data: TrendingMoviesResponse }>> {
  const searchParams: TrendingMoviesQueryParams = {
    api_key: env.TMDB_API_KEY,
    page: page,
  };

  const url = new URL(
    `https://api.themoviedb.org/3/trending/movie/${timeWindow}`,
  );

  Object.entries(searchParams).forEach(([key, value]) =>
    url.searchParams.append(key, String(value)),
  );

  const response = await fetch(url.toString());

  if (response.status !== 200) {
    return { type: "error", message: "Failed to fetch trending movies" };
  }

  const data = (await response.json()) as TrendingMoviesResponse;

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
