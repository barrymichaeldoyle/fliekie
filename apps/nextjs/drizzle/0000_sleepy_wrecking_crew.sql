CREATE TABLE IF NOT EXISTS "fliekie_collections" (
	"tmdb_collection_id" integer PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"poster_path" varchar(2048),
	"backdrop_path" varchar(2048),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "fliekie_follows" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"follower_clerk_id" varchar(255),
	"followed_clerk_id" varchar(255),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "fliekie_genres" (
	"tmdb_genre_id" integer PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "fliekie_movie_collections" (
	"tmdb_movie_id" integer NOT NULL,
	"tmdb_collection_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "fliekie_movie_genres" (
	"tmdb_movie_id" integer NOT NULL,
	"tmdb_genre_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "fliekie_movies" (
	"tmdb_movie_id" integer PRIMARY KEY NOT NULL,
	"imdb_id" varchar(255),
	"adult" boolean,
	"title" varchar(255),
	"release_date" timestamp,
	"poster_path" varchar(2048),
	"backdrop_path" varchar(2048),
	"budget" integer,
	"revenue" integer,
	"tagline" varchar(255),
	"runtime" integer,
	"original_language" varchar(255),
	"overview" varchar(2048),
	"status" varchar(255),
	"tmdb_collection_id" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "fliekie_seen_list" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clerk_id" varchar(255) NOT NULL,
	"tmdb_movie_id" integer NOT NULL,
	"seen_at" timestamp DEFAULT now() NOT NULL,
	"rating" integer,
	"review" text DEFAULT '',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "fliekie_users" (
	"clerk_id" varchar(255) PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "fliekie_watchlist" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clerk_id" varchar(255) NOT NULL,
	"tmdb_movie_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "fliekie_follows" ADD CONSTRAINT "fliekie_follows_follower_clerk_id_fliekie_users_clerk_id_fk" FOREIGN KEY ("follower_clerk_id") REFERENCES "public"."fliekie_users"("clerk_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "fliekie_follows" ADD CONSTRAINT "fliekie_follows_followed_clerk_id_fliekie_users_clerk_id_fk" FOREIGN KEY ("followed_clerk_id") REFERENCES "public"."fliekie_users"("clerk_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "fliekie_movie_collections" ADD CONSTRAINT "fliekie_movie_collections_tmdb_movie_id_fliekie_movies_tmdb_movie_id_fk" FOREIGN KEY ("tmdb_movie_id") REFERENCES "public"."fliekie_movies"("tmdb_movie_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "fliekie_movie_collections" ADD CONSTRAINT "fliekie_movie_collections_tmdb_collection_id_fliekie_collections_tmdb_collection_id_fk" FOREIGN KEY ("tmdb_collection_id") REFERENCES "public"."fliekie_collections"("tmdb_collection_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "fliekie_movie_collections" ADD CONSTRAINT "fliekie_mc_movie_fk" FOREIGN KEY ("tmdb_movie_id") REFERENCES "public"."fliekie_movies"("tmdb_movie_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "fliekie_movie_collections" ADD CONSTRAINT "fliekie_mc_coll_fk" FOREIGN KEY ("tmdb_collection_id") REFERENCES "public"."fliekie_collections"("tmdb_collection_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "fliekie_movie_genres" ADD CONSTRAINT "fliekie_movie_genres_tmdb_movie_id_fliekie_movies_tmdb_movie_id_fk" FOREIGN KEY ("tmdb_movie_id") REFERENCES "public"."fliekie_movies"("tmdb_movie_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "fliekie_movie_genres" ADD CONSTRAINT "fliekie_movie_genres_tmdb_genre_id_fliekie_genres_tmdb_genre_id_fk" FOREIGN KEY ("tmdb_genre_id") REFERENCES "public"."fliekie_genres"("tmdb_genre_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "fliekie_movie_genres" ADD CONSTRAINT "fliekie_mov_gen_movie_fk" FOREIGN KEY ("tmdb_movie_id") REFERENCES "public"."fliekie_movies"("tmdb_movie_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "fliekie_movie_genres" ADD CONSTRAINT "fliekie_mov_gen_genre_fk" FOREIGN KEY ("tmdb_genre_id") REFERENCES "public"."fliekie_genres"("tmdb_genre_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "fliekie_movies" ADD CONSTRAINT "fliekie_movies_tmdb_collection_id_fliekie_collections_tmdb_collection_id_fk" FOREIGN KEY ("tmdb_collection_id") REFERENCES "public"."fliekie_collections"("tmdb_collection_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "fliekie_movies" ADD CONSTRAINT "fliekie_movie_coll_fk" FOREIGN KEY ("tmdb_collection_id") REFERENCES "public"."fliekie_collections"("tmdb_collection_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "fliekie_seen_list" ADD CONSTRAINT "fliekie_seen_list_clerk_id_fliekie_users_clerk_id_fk" FOREIGN KEY ("clerk_id") REFERENCES "public"."fliekie_users"("clerk_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "fliekie_seen_list" ADD CONSTRAINT "fliekie_seen_list_tmdb_movie_id_fliekie_movies_tmdb_movie_id_fk" FOREIGN KEY ("tmdb_movie_id") REFERENCES "public"."fliekie_movies"("tmdb_movie_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "fliekie_watchlist" ADD CONSTRAINT "fliekie_watchlist_clerk_id_fliekie_users_clerk_id_fk" FOREIGN KEY ("clerk_id") REFERENCES "public"."fliekie_users"("clerk_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "fliekie_watchlist" ADD CONSTRAINT "fliekie_watchlist_tmdb_movie_id_fliekie_movies_tmdb_movie_id_fk" FOREIGN KEY ("tmdb_movie_id") REFERENCES "public"."fliekie_movies"("tmdb_movie_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
