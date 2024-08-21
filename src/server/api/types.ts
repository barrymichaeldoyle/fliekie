import { type InferSelectModel } from "drizzle-orm";

import { type paths } from "~/tmdb/types";

import { type movies } from "../db/schema";

export type Status<T = object> = ErrorStatus | SuccessStatus<T>;
export type ErrorStatus = { type: "error"; message: string };
export type SuccessStatus<T> = { type: "success" } & T;

export interface Collection {
  id: number;
  name: string;
  poster_path: string | null;
  backdrop_path: string | null;
}

export type TMDBMovie =
  paths["/3/movie/{movie_id}"]["get"]["responses"]["200"]["content"]["application/json"] & {
    belongs_to_collection: Collection | null;
  };

export type Movie = InferSelectModel<typeof movies>;
