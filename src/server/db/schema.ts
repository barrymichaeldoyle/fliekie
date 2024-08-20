import {
  index,
  integer,
  pgTableCreator,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const createTable = pgTableCreator((name) => `fliekie_${name}`);

export const movies = createTable("movies", {
  id: uuid("id").primaryKey().defaultRandom(),
  tmdb_id: integer("tmdb_id").unique().notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  release_date: timestamp("release_date"),
  poster_path: varchar("poster_path", { length: 2048 }),
  overview: varchar("overview", { length: 2048 }),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const users = createTable("users", {
  clerk_id: varchar("clerk_id", { length: 255 }).primaryKey(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at")
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});

export const seenList = createTable("seen_list", {
  id: uuid("id").primaryKey().defaultRandom(),
  clerk_id: varchar("clerk_id", { length: 255 })
    .references(() => users.clerk_id)
    .notNull(),
  movie_id: uuid("movie_id")
    .references(() => movies.id)
    .notNull(),
  seen_at: timestamp("seen_at").notNull().defaultNow(),
  rating: integer("rating"),
  review: text("review").default(""),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at")
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});

export const watchlist = createTable("watchlist", {
  id: uuid("id").primaryKey().defaultRandom(),
  clerk_id: varchar("clerk_id", { length: 255 })
    .references(() => users.clerk_id)
    .notNull(),
  movie_id: uuid("movie_id")
    .references(() => movies.id)
    .notNull(),
  created_at: timestamp("created_at").notNull().defaultNow(),
});

export const follows = createTable("follows", {
  id: uuid("id").primaryKey().defaultRandom(),
  follower_clerk_id: varchar("follower_clerk_id", { length: 255 }).references(
    () => users.clerk_id,
  ),
  followed_clerk_id: varchar("followed_clerk_id", { length: 255 }).references(
    () => users.clerk_id,
  ),
  created_at: timestamp("created_at").defaultNow(),
});

export const seenListIndexes = index("seen_list_clerk_id_idx").on(
  seenList.clerk_id,
);
export const watchlistIndexes = index("watchlist_clerk_id_idx").on(
  watchlist.clerk_id,
);
export const followsIndexes = index("follows_follower_idx").on(
  follows.follower_clerk_id,
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
