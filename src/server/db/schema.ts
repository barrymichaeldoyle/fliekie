import {
  integer,
  pgTableCreator,
  text,
  timestamp,
  uuid,
  varchar,
  index,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const createTable = pgTableCreator((name) => `fliekie_${name}`);

export const movies = createTable("movies", {
  id: uuid("id").primaryKey().defaultRandom(),
  tmdbId: integer("tmdb_id").unique().notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  releaseDate: timestamp("release_date"),
  posterUrl: varchar("poster_url", { length: 2048 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const users = createTable("users", {
  clerkId: varchar("clerk_id", { length: 255 }).primaryKey(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});

export const seenList = createTable("seen_list", {
  id: uuid("id").primaryKey().defaultRandom(),
  clerkId: varchar("clerk_id", { length: 255 })
    .references(() => users.clerkId)
    .notNull(),
  movieId: uuid("movie_id")
    .references(() => movies.id)
    .notNull(),
  seenAt: timestamp("seen_at").notNull().defaultNow(),
  rating: integer("rating"),
  review: text("review").default(""),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});

export const watchlist = createTable("watchlist", {
  id: uuid("id").primaryKey().defaultRandom(),
  clerkId: varchar("clerk_id", { length: 255 })
    .references(() => users.clerkId)
    .notNull(),
  movieId: uuid("movie_id")
    .references(() => movies.id)
    .notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const follows = createTable("follows", {
  id: uuid("id").primaryKey().defaultRandom(),
  followerClerkId: varchar("follower_clerk_id", { length: 255 }).references(
    () => users.clerkId,
  ),
  followedClerkId: varchar("followed_clerk_id", { length: 255 }).references(
    () => users.clerkId,
  ),
  createdAt: timestamp("created_at").defaultNow(),
});

export const seenListIndexes = index("seen_list_clerk_id_idx").on(
  seenList.clerkId,
);
export const watchlistIndexes = index("watchlist_clerk_id_idx").on(
  watchlist.clerkId,
);
export const followsIndexes = index("follows_follower_idx").on(
  follows.followerClerkId,
);

export const insertMoviesSchema = createInsertSchema(movies);
export const selectMoviesSchema = createSelectSchema(movies);

export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);

export const insertSeenListSchema = createInsertSchema(seenList);
export const selectSeenListSchema = createSelectSchema(seenList);

export const insertWatchlistSchema = createInsertSchema(watchlist);
export const selectWatchlistSchema = createSelectSchema(watchlist);

export const insertFollowsSchema = createInsertSchema(follows);
export const selectFollowsSchema = createSelectSchema(follows);
