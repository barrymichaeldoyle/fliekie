import { SearchResult } from "~/components/SearchResult";
import { fetchTrendingMovies } from "~/server/api/fetchTrendingMovies";

export const dynamic = "force-dynamic";

export async function TrendingMovies() {
  const response = await fetchTrendingMovies();

  if (response.type === "error") {
    return <div>Failed to fetch movie results</div>;
  }

  if (!response.data.results || response.data.results.length === 0) {
    return <div>No results found</div>;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
      {response.data.results.map((movie) => (
        <SearchResult key={movie.id} movie={movie} />
      ))}
    </div>
  );
}
