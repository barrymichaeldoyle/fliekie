"use server";

import type { Genre } from "./getGenres";
import type { Status } from "./types";
import type { paths } from "~/tmdb/types";
import { env } from "~/env";

import { RevalidateTime } from "./constants/RevalidateTime";
import { getGenres } from "./getGenres";
import { formatDate } from "./utils/formatDate";

export type TrendingMoviesResponse =
  paths["/3/trending/movie/{time_window}"]["get"]["responses"]["200"]["content"]["application/json"];

export interface TrendingMoviesQueryParams {
  api_key: string;
  language?: string;
  page?: number;
}

export type TMDBMovieTrendingResult = NonNullable<
  TrendingMoviesResponse["results"]
>[number] & { genre_names: string[] };

export type ModifiedTrendingMoviesResponse = TrendingMoviesResponse & {
  results: TMDBMovieTrendingResult[];
};

export async function getTrendingMovies(
  timeWindow: "day" | "week" = "day",
  page = 1,
): Promise<Status<{ data: ModifiedTrendingMoviesResponse }>> {
  const searchParams: TrendingMoviesQueryParams = {
    api_key: env.TMDB_API_KEY,
    page,
  };

  const url = new URL(
    `https://api.themoviedb.org/3/trending/movie/${timeWindow}`,
  );

  Object.entries(searchParams).forEach(([key, value]) =>
    url.searchParams.append(key, String(value)),
  );

  const [response, genres] = await Promise.all([
    fetch(url.toString(), { next: { revalidate: RevalidateTime._6Hours } }),
    getGenres(),
  ]);

  if (response.status !== 200) {
    return { type: "error", message: "Failed to fetch trending movies" };
  }

  const data = (await response.json()) as ModifiedTrendingMoviesResponse;

  const genreMap = new Map(
    genres.map((genre: Genre) => [genre.id, genre.name]),
  );

  data.results = data.results.map(
    (movie) =>
      ({
        ...movie,
        release_date: formatDate(movie.release_date),
        genre_names:
          movie.genre_ids?.map((id) => genreMap.get(id)).filter(Boolean) ?? [],
      }) as TMDBMovieTrendingResult,
  );

  return { type: "success", data };
}
