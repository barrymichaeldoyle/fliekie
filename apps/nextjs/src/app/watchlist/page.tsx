import { MovieResult } from "~/components/MovieResult";
import { getWatchlist } from "~/server/api/getWatchlist";

export const dynamic = "force-dynamic";

export default async function WatchlistPage() {
  const response = await getWatchlist();

  return (
    <main className="flex flex-1 flex-col gap-4 p-4">
      {response.type === "error" ? (
        <p>Failed to fetch watchlist</p>
      ) : response.movies.length === 0 ? (
        <p>No movies in your watchlist</p>
      ) : (
        <>
          <h1 className="text-2xl font-bold">Watchlist</h1>
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
