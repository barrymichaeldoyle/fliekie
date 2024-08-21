import { listSeenMovies } from "~/server/api/listSeenMovies";

import { MovieResult } from "./_components/MovieResult";

export default async function SeenListPage() {
  const response = await listSeenMovies();

  return (
    <main className="flex flex-1 flex-col gap-4 p-4">
      {response.type === "error" ? (
        <p>Failed to fetch seen movies</p>
      ) : response.movies.length === 0 ? (
        <p>No movies in your seen list</p>
      ) : (
        <>
          <h1 className="text-2xl font-bold">Seen List</h1>
          <div className="flex w-full flex-col gap-2">
            {response.movies.map((movie) => (
              <MovieResult key={movie.tmdb_movie_id} movie={movie} />
            ))}
          </div>
        </>
      )}
    </main>
  );
}
