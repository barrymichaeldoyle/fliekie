import { env } from "~/env";

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
    next: {
      // 24 hours in seconds
      revalidate: 86_400,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch genres");
  }

  const data = (await response.json()) as GenreResponse;
  return data.genres;
}
