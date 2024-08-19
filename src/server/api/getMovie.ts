import { type Status } from "./types";

export async function getMovie(
  tmdb_id: number,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<Status<{ data: any }>> {
  const url = new URL(`https://api.themoviedb.org/3/movie/${tmdb_id}`);

  const searchParams = {
    api_key: process.env.TMDB_API_KEY!,
  };

  Object.keys(searchParams).forEach((key) =>
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
    url.searchParams.append(key, (searchParams as any)[key]),
  );

  const response = await fetch(url.toString());

  if (response.status !== 200) {
    return { type: "error", message: "Failed to fetch movie" };
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const data = await response.json();

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  return { type: "success", data };
}
