import { MovieResult } from "~/components/MovieResult";
import { getMyRatings } from "~/server/api/getMyRatings";

export const dynamic = "force-dynamic";

export default async function RatingsPage() {
  const response = await getMyRatings();

  return (
    <main className="flex flex-1 flex-col gap-4 p-4">
      <h1 className="text-2xl font-bold">My Ratings</h1>
      {response.type === "error" ? (
        <p>Failed to fetch your rated movies</p>
      ) : response.movies.length === 0 ? (
        <p>You haven&apos;t rated any movies yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
          {response.movies.map((movie) => (
            <MovieResult key={movie.tmdb_movie_id} movie={movie} />
          ))}
        </div>
      )}
    </main>
  );
}
