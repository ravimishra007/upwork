CREATE TABLE "albums" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"artist" text NOT NULL,
	"release_date" text NOT NULL,
	"genre" jsonb NOT NULL,
	"rating" integer NOT NULL,
	"image_url" text,
	"spotify_url" text,
	"apple_music_url" text,
	"description" text,
	"featured" boolean DEFAULT false,
	"tracklist" jsonb
);
--> statement-breakpoint
CREATE TABLE "android_apps" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"developer" text NOT NULL,
	"category" text NOT NULL,
	"rating" integer NOT NULL,
	"description" text NOT NULL,
	"price" text NOT NULL,
	"image_url" text,
	"tags" jsonb,
	"play_store_url" text,
	"amazon_app_store_url" text,
	"featured" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "blog_posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"excerpt" text NOT NULL,
	"content" text NOT NULL,
	"publish_date" timestamp NOT NULL,
	"last_updated" timestamp,
	"author" text NOT NULL,
	"category" text NOT NULL,
	"tags" jsonb,
	"image_url" text,
	"read_time" text,
	"featured" boolean DEFAULT false,
	"status" text DEFAULT 'draft' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "books" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"author" text NOT NULL,
	"publish_date" text NOT NULL,
	"genre" jsonb NOT NULL,
	"rating" integer NOT NULL,
	"image_url" text,
	"amazon_url" text,
	"goodreads_url" text,
	"description" text,
	"featured" boolean DEFAULT false,
	"isbn" text
);
--> statement-breakpoint
CREATE TABLE "click_stats" (
	"id" serial PRIMARY KEY NOT NULL,
	"link_id" integer NOT NULL,
	"timestamp" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "courses" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"provider" text NOT NULL,
	"url" text NOT NULL,
	"instructors" jsonb,
	"level" text NOT NULL,
	"duration_hours" integer,
	"image_url" text,
	"description" text,
	"category" text NOT NULL,
	"tags" jsonb,
	"featured" boolean DEFAULT false,
	"price" text,
	"rating" integer
);
--> statement-breakpoint
CREATE TABLE "gallery_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"category" text NOT NULL,
	"description" text NOT NULL,
	"image_url" text NOT NULL,
	"tags" jsonb,
	"year" text,
	"client" text,
	"project_url" text,
	"featured" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "movies" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"director" text NOT NULL,
	"year" text NOT NULL,
	"genre" jsonb NOT NULL,
	"rating" integer NOT NULL,
	"image_url" text,
	"type" text DEFAULT 'movie' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "movies_and_tv_series" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"director" text NOT NULL,
	"release_date" text NOT NULL,
	"genre" jsonb NOT NULL,
	"rating" integer NOT NULL,
	"image_url" text,
	"type" text NOT NULL,
	"seasons" integer,
	"netflix_url" text,
	"amazon_url" text,
	"description" text,
	"featured" boolean DEFAULT false,
	"cast" jsonb
);
--> statement-breakpoint
CREATE TABLE "music" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"artist" text NOT NULL,
	"year" text NOT NULL,
	"genre" text NOT NULL,
	"image_url" text,
	"type" text DEFAULT 'song' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reading_resources" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"url" text NOT NULL,
	"type" text NOT NULL,
	"author" text,
	"publish_date" text,
	"image_url" text,
	"description" text,
	"category" text NOT NULL,
	"tags" jsonb,
	"featured" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "singles" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"artist" text NOT NULL,
	"release_date" text NOT NULL,
	"genre" jsonb NOT NULL,
	"rating" integer NOT NULL,
	"image_url" text,
	"spotify_url" text,
	"apple_music_url" text,
	"youtube_url" text,
	"description" text,
	"featured" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "social_links" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"platform" text NOT NULL,
	"name" text NOT NULL,
	"username" text NOT NULL,
	"url" text NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"password" text DEFAULT 'password123' NOT NULL,
	"name" text,
	"bio" text,
	"location" text,
	"profile_image" text,
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "windows_apps" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"developer" text NOT NULL,
	"category" text NOT NULL,
	"rating" integer NOT NULL,
	"description" text NOT NULL,
	"price" text NOT NULL,
	"image_url" text,
	"tags" jsonb,
	"microsoft_store_url" text,
	"developer_website_url" text,
	"featured" boolean DEFAULT false
);
