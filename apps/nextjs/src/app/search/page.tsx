import { Suspense } from "react";

import { SearchResults } from "./_components/SearchResults";

export const dynamic = "force-dynamic";

export default function SearchPage(props: {
  searchParams: { q?: string };
}) {
  const query = props.searchParams.q ?? "";

  return (
    <main className="flex-1 p-4">
      <div className="flex flex-wrap gap-4">
        <Suspense fallback={<div>Loading...</div>}>
          <SearchResults query={query} />
        </Suspense>
      </div>
    </main>
  );
}
