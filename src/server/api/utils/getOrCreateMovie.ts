import { eq } from "drizzle-orm";

import { db } from "~/server/db";
import { movies } from "~/server/db/schema";

import { type TMDBMovieSearchResult } from "../searchMovies";
import { type Status } from "../types";

/**
 * A helper function to check if the movie is already in the database
 *
 * @param movieSearTMDBMovieSearchResult The movie object
 * @returns The insterted or existing movie id
 */
export async function getOrCreateMovie(
  movie: TMDBMovieSearchResult,
): Promise<Status<{ movieId: string }>> {
  const existingMovie = await db
    .select()
    .from(movies)
    .where(eq(movies.tmdb_id, movie.id))
    .then((rows) => rows[0]);

  if (existingMovie) {
    return { type: "success", movieId: existingMovie.id };
  }

  const [insertedMovie] = await db
    .insert(movies)
    .values({
      tmdb_id: movie.id,
      title: movie.title ?? "",
      release_date: movie.release_date ? new Date(movie.release_date) : null,
      poster_path: movie.poster_path,
      overview: movie.overview,
    })
    .returning({ id: movies.id });

  if (!insertedMovie) {
    return { type: "error", message: "Failed to insert movie" };
  }

  return { type: "success", movieId: insertedMovie.id };
}
