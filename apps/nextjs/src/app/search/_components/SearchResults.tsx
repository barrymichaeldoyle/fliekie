import Image from "next/image";
import Link from "next/link";

import {
  type TMDBMovieSearchResult,
  searchMovies,
} from "~/server/api/searchMovies";

export const dynamic = "force-dynamic";

export async function SearchResults(props: { query: string }) {
  const response = await searchMovies(props.query);

  if (response.type === "error") {
    return <div>Failed to fetch movie results</div>;
  }

  if (!response.data.results || response.data.results.length === 0) {
    return <div>No results found</div>;
  }

  return (
    <>
      <h2 className="text-3xl font-bold">
        Search results for &ldquo;{props.query}&rdquo;
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
        {response.data.results.map((movie) => (
          <SearchResult key={movie.id} movie={movie} />
        ))}
      </div>
      <div className="text-muted-foreground py-2 text-center text-lg font-semibold">
        🎉 That&apos;s all the results we have!
      </div>
    </>
  );
}

function SearchResult(props: { movie: TMDBMovieSearchResult }) {
  const posterBaseUrl = "https://image.tmdb.org/t/p/w500";

  const formattedDate = props.movie.release_date
    ? new Date(props.movie.release_date).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Unknown";

  return (
    <Link
      className="border-border bg-card text-card-foreground hover:bg-muted flex h-full flex-col overflow-hidden rounded-lg border shadow-md transition-all duration-200 ease-in-out hover:scale-105 hover:shadow-lg"
      href={`/movies/${props.movie.id}`}
    >
      <div className="flex h-full">
        {props.movie.poster_path ? (
          <Image
            src={`${posterBaseUrl}${props.movie.poster_path}`}
            alt={`${props.movie.title} poster`}
            width={150}
            height={225}
            className="h-auto w-[150px] object-cover"
          />
        ) : (
          <div className="bg-muted flex h-[225px] w-[150px] items-center justify-center">
            <span className="text-muted-foreground">No Image</span>
          </div>
        )}

        <div className="flex flex-1 flex-col justify-between p-4">
          <div>
            <h3 className="text-xl font-semibold">{props.movie.title}</h3>
            <p className="text-muted-foreground line-clamp-3 text-sm">
              {props.movie.overview}
            </p>
          </div>
          <div className="text-muted-foreground mt-2 text-sm">
            Released: {formattedDate}
          </div>
        </div>
      </div>
    </Link>
  );
}
