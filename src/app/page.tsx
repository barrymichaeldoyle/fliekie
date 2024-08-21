import { Suspense } from "react";

import { SearchInput } from "./_components/SearchInput";
import { SearchResults } from "./_components/SearchResults/SearchResults";

export const dynamic = "force-dynamic";

export default async function HomePage(props: {
  searchParams: { search?: string };
}) {
  const query = props.searchParams.search;

  return (
    <main className="flex-1 p-4">
      <div className="flex flex-wrap gap-4">
        <SearchInput />
        {query && (
          <Suspense fallback={<div>Loading...</div>}>
            <SearchResults query={query} />
          </Suspense>
        )}
      </div>
    </main>
  );
}
