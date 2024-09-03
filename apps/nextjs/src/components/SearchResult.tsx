import type { PropsWithChildren } from "react";
import Image from "next/image";
import Link from "next/link";

import type { TMDBMovieSearchResult } from "~/server/api/searchMovies";

export function SearchResult(props: {
  movie: TMDBMovieSearchResult;
  index: number;
}) {
  const posterBaseUrl = "https://image.tmdb.org/t/p/w185";

  return (
    <Link
      className="flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card text-card-foreground shadow-md transition-all duration-200 ease-in-out hover:scale-105 hover:bg-muted hover:shadow-lg"
      href={`/movies/${props.movie.id}`}
    >
      <article className="flex h-full gap-1">
        {props.movie.poster_path ? (
          <Image
            src={`${posterBaseUrl}${props.movie.poster_path}`}
            alt={`${props.movie.title} poster`}
            width={185}
            height={277.5}
            className="h-[auto] w-[185px]"
            priority={props.index < 3}
          />
        ) : (
          <div className="flex h-[277.5px] w-[185px] items-center justify-center bg-muted">
            <span className="text-muted-foreground">No Image</span>
          </div>
        )}

        <div className="flex flex-1 flex-col p-1">
          <div className="flex flex-col gap-2">
            <h3 className="line-clamp-2 text-xl font-semibold">
              {props.movie.title}
            </h3>
            <p className="line-clamp-5 text-sm text-muted-foreground">
              {props.movie.overview}
            </p>
          </div>
          <div className="flex-1" />

          <dl className="grid grid-cols-[65px_1fr] gap-x-2 gap-y-1 text-sm text-primary">
            <dt className="font-medium">Genre:</dt>
            <dd className="line-clamp-2 text-muted-foreground">
              {props.movie.genre_names.join(", ")}
            </dd>
            <dt className="font-medium">Released:</dt>
            <dd className="text-muted-foreground">
              {props.movie.release_date ?? "-"}
            </dd>
          </dl>
        </div>
      </article>
    </Link>
  );
}

export function SearchResultGrid(props: PropsWithChildren) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
      {props.children}
    </div>
  );
}
