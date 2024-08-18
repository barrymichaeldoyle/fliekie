import { searchMovies } from "~/server/api/searchMovies";

import { MovieResult } from "./MovieResult/MovieResult";

export const dynamic = "force-dynamic";

export async function MovieResults(props: { query: string }) {
  const response = await searchMovies(props.query);

  if (response.type === "error") {
    return <div>Failed to fetch movie results</div>;
  }

  if (response.data.results.length === 0) {
    return <div>No results found</div>;
  }

  return (
    <div className="flex w-full flex-col gap-2">
      {response.data.results.map((movie) => (
        <MovieResult key={movie.id} movie={movie} />
      ))}
    </div>
  );
}
