import { MovieResult } from "~/components/MovieResult";
import { getSeenlist } from "~/server/api/getSeenlist";

export default async function SeenlistPage() {
  const response = await getSeenlist();

  if (response.type === "error") {
    return <p>Failed to fetch seen movies</p>;
  }

  if (response.movies.length === 0) {
    return <p>No movies in your seenlist</p>;
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4">
      <h1 className="text-2xl font-bold">Seenlist</h1>
      <div className="flex w-full flex-col gap-2">
        {response.movies.map((movie) => (
          <MovieResult key={movie.tmdb_movie_id} movie={movie} />
        ))}
      </div>
    </main>
  );
}
