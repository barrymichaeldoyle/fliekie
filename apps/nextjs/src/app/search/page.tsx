import { Suspense } from "react";

import { EndOfResults } from "~/components/EndOfResults";

import { SearchResults } from "./_components/SearchResults";

export const dynamic = "force-dynamic";

export default function SearchPage(props: { searchParams: { q?: string } }) {
  const query = props.searchParams.q ?? "";

  return (
    <main className="flex-1 p-4">
      <section className="flex flex-wrap gap-4">
        <h2 className="text-3xl font-bold">
          Search results for &ldquo;{query}&rdquo;
        </h2>
        <Suspense fallback={<div>Loading...</div>}>
          <SearchResults query={query} />
        </Suspense>
        <EndOfResults />
      </section>
    </main>
  );
}
