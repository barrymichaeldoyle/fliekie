"use server";

import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "../db";
import { movies, seenList, users } from "../db/schema";

import type { Movie, Status } from "./types";

/**
 * A helper function to ensure that the user exists in the database
 *
 * @param clerkId The clerk id of the user
 */
async function ensureUserExists(): Promise<Status<{ clerkId: string }>> {
  const { userId: clerkId } = auth();

  if (!clerkId) {
    return { type: "error", message: "User not authenticated" };
  }

  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.clerkId, clerkId))
    .then((rows) => rows[0]);

  if (!existingUser) {
    await db.insert(users).values({
      clerkId,
    });
  }

  return { type: "success", clerkId };
}

/**
 * A helper function to check if the movie is already in the database
 *
 * @param movie The movie object
 * @returns The insterted or existing movie id
 */
async function getOrCreateMovie(
  movie: Movie,
): Promise<Status<{ movieId: string }>> {
  const existingMovie = await db
    .select()
    .from(movies)
    .where(eq(movies.tmdbId, movie.id))
    .then((rows) => rows[0]);

  if (existingMovie) {
    return { type: "success", movieId: existingMovie.id };
  }

  const [insertedMovie] = await db
    .insert(movies)
    .values({
      tmdbId: movie.id,
      title: movie.title ?? "",
      releaseDate: movie.release_date ? new Date(movie.release_date) : null,
      posterUrl: movie.poster_path,
    })
    .returning({ id: movies.id });

  if (!insertedMovie) {
    return { type: "error", message: "Failed to insert movie" };
  }

  return { type: "success", movieId: insertedMovie.id };
}

export async function addMovieToSeenList(movie: Movie): Promise<Status> {
  const ensureUserExistsStatus = await ensureUserExists();

  if (ensureUserExistsStatus.type === "error") {
    console.log("User not authenticated when running `ensureUserExists`");
    return ensureUserExistsStatus;
  }

  const getOrCreateMovieStatus = await getOrCreateMovie(movie);

  if (getOrCreateMovieStatus.type === "error") {
    console.log("Failed to insert movie when running `getOrCreateMovie`");
    return getOrCreateMovieStatus;
  }

  const existingSeenListEntry = await db
    .select()
    .from(seenList)
    .where(
      and(
        eq(seenList.clerkId, ensureUserExistsStatus.clerkId),
        eq(seenList.movieId, getOrCreateMovieStatus.movieId),
      ),
    )
    .then((rows) => rows[0]);

  if (existingSeenListEntry) {
    console.log("Movie already in seen list, silently succeed.");
    return { type: "success" };
  }

  await db.insert(seenList).values({
    clerkId: ensureUserExistsStatus.clerkId,
    movieId: getOrCreateMovieStatus.movieId,
    rating: null,
    review: "",
  });

  revalidatePath("/");

  return { type: "success" };
}
