"use server";

export async function searchMovies(query?: string) {
  if (!query) {
    return { results: [] };
  }

  const response = await fetch(
    `https://api.themoviedb.org/3/search/movie?api_key=${process.env.TMDB_API_KEY}&query=${query}`,
  );

  if (response.status !== 200) {
    throw new Error("Failed to fetch movies");
  }

  const results = await response.json();

  return results;
}
