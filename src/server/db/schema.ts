import {
  boolean,
  foreignKey,
  index,
  integer,
  pgEnum,
  pgTableCreator,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const environmentEnum = pgEnum("environment_enum", ["dev", "prod"]);
export type Environment = "dev" | "prod";

export const createTable = pgTableCreator((name) => `fliekie_${name}`);

export const movies = createTable(
  "movies",
  {
    tmdb_movie_id: integer("tmdb_movie_id").primaryKey().notNull(),
    imdb_id: varchar("imdb_id", { length: 255 }),
    adult: boolean("adult"),
    title: varchar("title", { length: 255 }),
    release_date: timestamp("release_date"),
    poster_path: varchar("poster_path", { length: 2048 }),
    backdrop_path: varchar("backdrop_path", { length: 2048 }),
    budget: integer("budget"),
    revenue: integer("revenue"),
    tagline: varchar("tagline", { length: 255 }),
    runtime: integer("runtime"),
    original_language: varchar("original_language", { length: 255 }),
    overview: varchar("overview", { length: 2048 }),
    status: varchar("status", { length: 255 }),
    tmdb_collection_id: integer("tmdb_collection_id").references(
      () => collections.tmdb_collection_id,
    ),
    created_at: timestamp("created_at").defaultNow(),
    updated_at: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    fk_tmdb_collection: foreignKey({
      columns: [table.tmdb_collection_id],
      foreignColumns: [collections.tmdb_collection_id],
    }),
  }),
);

export const collections = createTable("collections", {
  tmdb_collection_id: integer("tmdb_collection_id").primaryKey().notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  poster_path: varchar("poster_path", { length: 2048 }),
  backdrop_path: varchar("backdrop_path", { length: 2048 }),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const genres = createTable("genres", {
  tmdb_genre_id: integer("tmdb_genre_id").primaryKey().notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const movieCollections = createTable(
  "movie_collections",
  {
    tmdb_movie_id: integer("tmdb_movie_id")
      .references(() => movies.tmdb_movie_id)
      .notNull(),
    tmdb_collection_id: integer("tmdb_collection_id")
      .references(() => collections.tmdb_collection_id)
      .notNull(),
  },
  (table) => ({
    primaryKey: { columns: [table.tmdb_movie_id, table.tmdb_collection_id] },
    fk_movie: foreignKey({
      columns: [table.tmdb_movie_id],
      foreignColumns: [movies.tmdb_movie_id],
    }),
    fk_collection: foreignKey({
      columns: [table.tmdb_collection_id],
      foreignColumns: [collections.tmdb_collection_id],
    }),
  }),
);

export const movieGenres = createTable(
  "movie_genres",
  {
    tmdb_movie_id: integer("tmdb_movie_id")
      .references(() => movies.tmdb_movie_id)
      .notNull(),
    tmdb_genre_id: integer("tmdb_genre_id")
      .references(() => genres.tmdb_genre_id)
      .notNull(),
  },
  (table) => ({
    primaryKey: { columns: [table.tmdb_movie_id, table.tmdb_genre_id] },
    fk_movie: foreignKey({
      columns: [table.tmdb_movie_id],
      foreignColumns: [movies.tmdb_movie_id],
    }),
    fk_genre: foreignKey({
      columns: [table.tmdb_genre_id],
      foreignColumns: [genres.tmdb_genre_id],
    }),
  }),
);

export const users = createTable("users", {
  clerk_id: varchar("clerk_id", { length: 255 }).primaryKey(),
  environment: environmentEnum("environment").notNull().default("prod"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at")
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});

export const seenlist = createTable("seenlist", {
  id: uuid("id").primaryKey().defaultRandom(),
  clerk_id: varchar("clerk_id", { length: 255 })
    .references(() => users.clerk_id)
    .notNull(),
  tmdb_movie_id: integer("tmdb_movie_id")
    .references(() => movies.tmdb_movie_id)
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
  tmdb_movie_id: integer("tmdb_movie_id")
    .references(() => movies.tmdb_movie_id)
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

export const movieGenresIndexes = index("movie_genres_tmdb_movie_id_idx").on(
  movieGenres.tmdb_movie_id,
);
export const seenlistIndexes = index("seenlist_clerk_id_idx").on(
  seenlist.clerk_id,
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

export const insertSeenlistSchema = createInsertSchema(seenlist);
export const selectSeenlistSchema = createSelectSchema(seenlist);

export const insertWatchlistSchema = createInsertSchema(watchlist);
export const selectWatchlistSchema = createSelectSchema(watchlist);

export const insertFollowsSchema = createInsertSchema(follows);
export const selectFollowsSchema = createSelectSchema(follows);
