import { EndOfResults } from "~/components/EndOfResults";
import { SearchResult, SearchResultGrid } from "~/components/SearchResult";
import { searchMovies } from "~/server/api/searchMovies";

export const dynamic = "force-dynamic";

export async function SearchResults(props: { query: string }) {
  const response = await searchMovies(props.query);

  if (response.type === "error") {
    return <>Failed to fetch movie results</>;
  }

  if (response.data.results.length === 0) {
    return <>No results found</>;
  }

  return (
    <>
      <SearchResultGrid>
        {response.data.results.map((movie) => (
          <SearchResult key={movie.id} movie={movie} />
        ))}
      </SearchResultGrid>
      <EndOfResults />
    </>
  );
}
