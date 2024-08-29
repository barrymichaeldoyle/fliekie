"use server";

import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";

import type { Rating, Status, TMDBMovie } from "./types";

import { db } from "../../../../../packages/db/src";
import { ratings } from "../../../../../packages/db/src/schema";
import { ensureUserExists } from "./utils/ensureUserExists";
import { getOrCreateMovie } from "./utils/getOrCreateMovie";

export async function rateMovie(args: {
  movie: TMDBMovie;
  rating: Rating;
  review: string;
}): Promise<Status> {
  const ensureUserExistsStatus = await ensureUserExists();

  if (ensureUserExistsStatus.type === "error") {
    return ensureUserExistsStatus;
  }

  const getOrCreateMovieStatus = await getOrCreateMovie(args.movie);

  if (getOrCreateMovieStatus.type === "error") {
    return getOrCreateMovieStatus;
  }

  const existingSeenlistEntry = await db
    .select()
    .from(ratings)
    .where(
      and(
        eq(ratings.clerk_id, ensureUserExistsStatus.clerkId),
        eq(ratings.tmdb_movie_id, getOrCreateMovieStatus.tmdb_movie_id),
      ),
    )
    .then((rows) => rows[0]);

  if (existingSeenlistEntry) {
    return { type: "success" };
  }

  await db.insert(ratings).values({
    clerk_id: ensureUserExistsStatus.clerkId,
    tmdb_movie_id: getOrCreateMovieStatus.tmdb_movie_id,
    rating: Number(args.rating),
    review: args.review,
  });

  revalidatePath(`/movies/${args.movie.id}`);

  return { type: "success" };
}
