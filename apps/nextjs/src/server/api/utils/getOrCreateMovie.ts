import { eq } from "drizzle-orm";

import { db } from "@fliekie/db";
import { collections, genres, movieGenres, movies } from "@fliekie/db/schema";

import type { Status, TMDBMovie } from "../types";

/**
 * A helper function to check if the movie is already in the database
 * and if not, it inserts the movie and related entities (genres and collections).
 *
 * @param movie The movie object from TMDB
 * @returns The inserted or existing movie id
 */
export async function getOrCreateMovie(
  movie: TMDBMovie,
): Promise<Status<{ tmdb_movie_id: number }>> {
  const existingMovie = await db
    .select()
    .from(movies)
    .where(eq(movies.tmdb_movie_id, movie.id))
    .then((rows) => rows[0]);

  if (existingMovie) {
    return { type: "success", tmdb_movie_id: existingMovie.tmdb_movie_id };
  }

  if (movie.genres && movie.genres.length > 0) {
    for (const genre of movie.genres) {
      await db
        .insert(genres)
        .values({ tmdb_genre_id: genre.id, name: genre.name ?? "Unknown" })
        .onConflictDoNothing();
    }
  }

  if (movie.belongs_to_collection) {
    await db
      .insert(collections)
      .values({
        tmdb_collection_id: movie.belongs_to_collection.id,
        name: movie.belongs_to_collection.name,
        poster_path: movie.belongs_to_collection.poster_path,
        backdrop_path: movie.belongs_to_collection.backdrop_path,
      })
      .onConflictDoNothing();
  }

  const [insertedMovie] = await db
    .insert(movies)
    .values({
      tmdb_movie_id: movie.id,
      imdb_id: movie.imdb_id ?? null,
      adult: movie.adult || null,
      title: movie.title ?? "",
      release_date: movie.release_date ? new Date(movie.release_date) : null,
      poster_path: movie.poster_path ?? null,
      backdrop_path: movie.backdrop_path ?? null,
      budget: movie.budget || null,
      revenue: movie.revenue || null,
      tagline: movie.tagline ?? null,
      runtime: movie.runtime || null,
      original_language: movie.original_language ?? null,
      overview: movie.overview ?? "",
      status: movie.status ?? "",
      tmdb_collection_id: movie.belongs_to_collection?.id ?? null,
    })
    .returning({ tmdb_movie_id: movies.tmdb_movie_id });

  if (!insertedMovie) {
    return { type: "error", message: "Failed to insert movie" };
  }

  if (movie.genres && movie.genres.length > 0) {
    for (const genre of movie.genres) {
      await db
        .insert(movieGenres)
        .values({
          tmdb_movie_id: insertedMovie.tmdb_movie_id,
          tmdb_genre_id: genre.id,
        })
        .onConflictDoNothing();
    }
  }

  return { type: "success", tmdb_movie_id: insertedMovie.tmdb_movie_id };
}
