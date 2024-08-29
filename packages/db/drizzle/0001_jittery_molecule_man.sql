ALTER TABLE "fliekie_movie_collections" DROP CONSTRAINT "fliekie_mc_movie_fk";
--> statement-breakpoint
ALTER TABLE "fliekie_movie_collections" DROP CONSTRAINT "fliekie_mc_coll_fk";
--> statement-breakpoint
ALTER TABLE "fliekie_movie_genres" DROP CONSTRAINT "fliekie_mov_gen_movie_fk";
--> statement-breakpoint
ALTER TABLE "fliekie_movie_genres" DROP CONSTRAINT "fliekie_mov_gen_genre_fk";
--> statement-breakpoint
ALTER TABLE "fliekie_movies" DROP CONSTRAINT "fliekie_movie_coll_fk";
