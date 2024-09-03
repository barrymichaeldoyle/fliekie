import { SearchResult, SearchResultGrid } from "~/components/SearchResult";
import { searchMovies } from "~/server/api/searchMovies";

export const dynamic = "force-dynamic";

export async function SearchResults(props: { query: string }) {
  const response = await searchMovies(props.query);

  if (response.type === "error") {
    return <div>Failed to fetch movie results</div>;
  }

  if (response.data.results.length === 0) {
    return <div>No results found</div>;
  }

  return (
    <SearchResultGrid>
      {response.data.results.map((movie) => (
        <SearchResult key={movie.id} movie={movie} />
      ))}
    </SearchResultGrid>
  );
}
