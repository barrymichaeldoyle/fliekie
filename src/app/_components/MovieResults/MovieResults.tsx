import { searchMovies } from "~/server/api/searchMovies";

import { MovieResult } from "./MovieResult/MovieResult";

export const dynamic = "force-dynamic";

export async function MovieResults(props: { query: string }) {
  const response = await searchMovies(props.query);

  if (response.type === "error") {
    return <div>Failed to fetch movie results</div>;
  }

  console.log(response.results[0]);

  return (
    <div className="flex w-full flex-col gap-2">
      {response.results.map((movie: any) => (
        <MovieResult key={movie.id} movie={movie} />
      ))}
    </div>
  );
}
