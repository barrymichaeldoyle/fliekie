"use server";

import type { Genre } from "./getGenres";
import type { Status } from "./types";
import type { paths } from "~/tmdb/types";
import { env } from "~/env";

import { getGenres } from "./getGenres";

export type SearchMoviesResponse =
  paths["/3/search/movie"]["get"]["responses"]["200"]["content"]["application/json"];

export type SearchMoviesQueryParams =
  paths["/3/search/movie"]["get"]["parameters"]["query"] & { api_key: string };

export type TMDBMovieSearchResult = NonNullable<
  SearchMoviesResponse["results"]
>[number] & { genre_names: string[] };

export type ModifiedSearchMoviesResponse = Omit<
  SearchMoviesResponse,
  "results"
> & {
  results: TMDBMovieSearchResult[];
};

export async function searchMovies(
  query: string,
  page = 1,
): Promise<Status<{ data: ModifiedSearchMoviesResponse }>> {
  const searchParams: SearchMoviesQueryParams = {
    query,
    api_key: env.TMDB_API_KEY,
    page,
  };

  const url = new URL("https://api.themoviedb.org/3/search/movie");

  Object.entries(searchParams).forEach(([key, value]) =>
    url.searchParams.append(key, String(value)),
  );

  const [response, genres] = await Promise.all([
    fetch(url.toString(), {
      next: {
        // 6 hours in seconds
        revalidate: 21600,
      },
    }),
    getGenres(),
  ]);

  if (response.status !== 200) {
    return { type: "error", message: "Failed to search movies" };
  }

  const data = (await response.json()) as ModifiedSearchMoviesResponse;

  const genreMap = new Map(
    genres.map((genre: Genre) => [genre.id, genre.name]),
  );

  data.results = data.results.map(
    (movie) =>
      ({
        ...movie,
        release_date: movie.release_date
          ? new Intl.DateTimeFormat("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            }).format(new Date(movie.release_date))
          : undefined,
        genre_names:
          movie.genre_ids?.map((id) => genreMap.get(id)).filter(Boolean) ?? [],
      }) as TMDBMovieSearchResult,
  );

  return { type: "success", data };
}
