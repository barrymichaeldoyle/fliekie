import { type paths } from "~/tmdb/types";

export type Status<T = object> = ErrorStatus | SuccessStatus<T>;
export type ErrorStatus = { type: "error"; message: string };
export type SuccessStatus<T> = { type: "success" } & T;

export type SearchMoviesResponse =
  paths["/3/search/movie"]["get"]["responses"]["200"]["content"]["application/json"];

export type SearchMoviesQueryParams =
  paths["/3/search/movie"]["get"]["parameters"]["query"] & { api_key: string };

export type Movie = NonNullable<SearchMoviesResponse["results"]>[number];
