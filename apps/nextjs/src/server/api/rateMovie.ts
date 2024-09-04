"use server";

import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";

import { db } from "@fliekie/db";
import { ratings } from "@fliekie/db/schema";

import type { Rating, Status } from "./types";

import { ensureUserExists } from "./utils/ensureUserExists";
import { getOrCreateMovie } from "./utils/getOrCreateMovie";

export async function rateMovie(args: {
  tmdb_movie_id: number;
  rating: Rating;
  review: string;
}): Promise<Status> {
  const ensureUserExistsStatus = await ensureUserExists();

  if (ensureUserExistsStatus.type === "error") {
    return ensureUserExistsStatus;
  }

  const getOrCreateMovieStatus = await getOrCreateMovie(args.tmdb_movie_id);

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

  revalidatePath(`/movies/${args.tmdb_movie_id}`);

  return { type: "success" };
}
