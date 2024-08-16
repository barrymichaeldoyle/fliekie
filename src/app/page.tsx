import { db } from "~/server/db";
import { MoviesSearchInput } from "./_components/MoviesSearchInput";

export default async function HomePage({
  searchParams,
}: {
  searchParams: {
    search?: string;
  };
}) {
  const posts = await db.query.posts.findMany();
  console.log(posts);

  console.log({ searchParams });

  return (
    <main className="p-4">
      <div className="flex flex-wrap gap-4">
        <MoviesSearchInput defaultValue={searchParams.search} />
      </div>
    </main>
  );
}
