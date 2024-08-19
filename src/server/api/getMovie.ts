import { auth } from "@clerk/nextjs/server";
import { Status } from "./types";

export async function getMovie(
  tmdb_id: number,
): Promise<Status<{ data: any }>> {
  const { userId: clerkId } = auth();

  const url = new URL(`https://api.themoviedb.org/3/movie/${tmdb_id}`);

  const searchParams = {
    api_key: process.env.TMDB_API_KEY!,
  };

  Object.keys(searchParams).forEach((key) =>
    url.searchParams.append(key, (searchParams as any)[key]),
  );

  const response = await fetch(url.toString());

  console.log(response);

  if (response.status !== 200) {
    return { type: "error", message: "Failed to fetch movie" };
  }

  const data = await response.json();

  return { type: "success", data };
}
