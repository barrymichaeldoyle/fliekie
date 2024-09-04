import { env } from "~/env";

import { RevalidateTime } from "./constants/RevalidateTime";

export interface Genre {
  id: number;
  name: string;
}

export interface GenreResponse {
  genres: Genre[];
}

export async function getGenres(): Promise<Genre[]> {
  const url = `https://api.themoviedb.org/3/genre/movie/list?api_key=${env.TMDB_API_KEY}&language=en-US`;

  const response = await fetch(url, {
    next: { revalidate: RevalidateTime._24Hours },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch genres");
  }

  const data = (await response.json()) as GenreResponse;
  return data.genres;
}
