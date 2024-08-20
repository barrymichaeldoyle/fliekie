import { type paths } from "~/tmdb/types";

export type Status<T = object> = ErrorStatus | SuccessStatus<T>;
export type ErrorStatus = { type: "error"; message: string };
export type SuccessStatus<T> = { type: "success" } & T;

export type TMDBMovie =
  paths["/3/movie/{movie_id}"]["get"]["responses"]["200"]["content"]["application/json"];
