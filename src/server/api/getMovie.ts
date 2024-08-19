import { type Status, type TMDBMovie } from "./types";

export async function getMovie(
  tmdb_id: number,
): Promise<Status<{ data: TMDBMovie }>> {
  const url = new URL(`https://api.themoviedb.org/3/movie/${tmdb_id}`);

  const searchParams = {
    api_key: process.env.TMDB_API_KEY!,
  };

  Object.entries(searchParams).forEach(([key, value]) =>
    url.searchParams.append(key, String(value)),
  );

  const response = await fetch(url.toString());

  if (response.status !== 200) {
    return { type: "error", message: "Failed to fetch movie" };
  }

  const data = (await response.json()) as TMDBMovie;

  return { type: "success", data };
}
