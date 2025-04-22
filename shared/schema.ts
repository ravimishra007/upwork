import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Define database tables
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull().default("password123"),
  name: text("name"),
  bio: text("bio"),
  location: text("location"),
  profileImage: text("profile_image"),
});

export const socialLinks = pgTable("social_links", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  platform: text("platform").notNull(),
  name: text("name").notNull(),
  username: text("username").notNull(),
  url: text("url").notNull(),
  active: boolean("active").notNull().default(true),
  order: integer("order").notNull().default(0),
});

export const clickStats = pgTable("click_stats", {
  id: serial("id").primaryKey(),
  linkId: integer("link_id").notNull(),
  timestamp: text("timestamp").notNull(),
});

export const movies = pgTable("movies", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  director: text("director").notNull(),
  year: text("year").notNull(),
  genre: jsonb("genre").notNull().$type<string[]>(),
  rating: integer("rating").notNull(),
  imageUrl: text("image_url"),
  type: text("type").notNull().default("movie"), // 'movie' or 'book'
});

export const music = pgTable("music", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  artist: text("artist").notNull(),
  year: text("year").notNull(),
  genre: text("genre").notNull(),
  imageUrl: text("image_url"),
  type: text("type").notNull().default("song"), // 'song' or 'album'
});

// New improved tables for specific media types
export const singles = pgTable("singles", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  artist: text("artist").notNull(),
  releaseDate: text("release_date").notNull(),
  genre: jsonb("genre").notNull().$type<string[]>(),
  rating: integer("rating").notNull(),
  imageUrl: text("image_url"),
  spotifyUrl: text("spotify_url"),
  appleMusicUrl: text("apple_music_url"),
  youtubeUrl: text("youtube_url"),
  description: text("description"),
  featured: boolean("featured").default(false),
});

export const albums = pgTable("albums", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  artist: text("artist").notNull(),
  releaseDate: text("release_date").notNull(),
  genre: jsonb("genre").notNull().$type<string[]>(),
  rating: integer("rating").notNull(),
  imageUrl: text("image_url"),
  spotifyUrl: text("spotify_url"),
  appleMusicUrl: text("apple_music_url"),
  description: text("description"),
  featured: boolean("featured").default(false),
  tracklist: jsonb("tracklist").$type<string[]>(),
});

export const moviesAndTvSeries = pgTable("movies_and_tv_series", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  director: text("director").notNull(),
  releaseDate: text("release_date").notNull(),
  genre: jsonb("genre").notNull().$type<string[]>(),
  rating: integer("rating").notNull(),
  imageUrl: text("image_url"),
  type: text("type").notNull(), // 'movie' or 'tvSeries'
  seasons: integer("seasons"), // For TV series
  netflixUrl: text("netflix_url"),
  amazonUrl: text("amazon_url"),
  description: text("description"),
  featured: boolean("featured").default(false),
  cast: jsonb("cast").$type<string[]>(),
});

export const books = pgTable("books", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  author: text("author").notNull(), 
  publishDate: text("publish_date").notNull(),
  genre: jsonb("genre").notNull().$type<string[]>(),
  rating: integer("rating").notNull(),
  imageUrl: text("image_url"),
  amazonUrl: text("amazon_url"),
  goodreadsUrl: text("goodreads_url"),
  description: text("description"),
  featured: boolean("featured").default(false),
  isbn: text("isbn"),
});

export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  publishDate: timestamp("publish_date").notNull(),
  lastUpdated: timestamp("last_updated"),
  author: text("author").notNull(),
  category: text("category").notNull(),
  tags: jsonb("tags").$type<string[]>(),
  imageUrl: text("image_url"),
  readTime: text("read_time"),
  featured: boolean("featured").default(false),
  status: text("status").notNull().default("draft"), // draft, published, archived
});

export const readingResources = pgTable("reading_resources", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  url: text("url").notNull(),
  type: text("type").notNull(), // article, book, video, podcast
  author: text("author"),
  publishDate: text("publish_date"),
  imageUrl: text("image_url"),
  description: text("description"),
  category: text("category").notNull(),
  tags: jsonb("tags").$type<string[]>(),
  featured: boolean("featured").default(false),
});

export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  provider: text("provider").notNull(),
  url: text("url").notNull(),
  instructors: jsonb("instructors").$type<string[]>(),
  level: text("level").notNull(), // beginner, intermediate, advanced
  durationHours: integer("duration_hours"),
  imageUrl: text("image_url"),
  description: text("description"),
  category: text("category").notNull(),
  tags: jsonb("tags").$type<string[]>(),
  featured: boolean("featured").default(false),
  price: text("price"),
  rating: integer("rating"),
});

export const galleryItems = pgTable("gallery_items", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  category: text("category").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  tags: jsonb("tags").$type<string[]>(),
  year: text("year"),
  client: text("client"),
  projectUrl: text("project_url"),
  featured: boolean("featured").default(false),
});

export const androidApps = pgTable("android_apps", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  developer: text("developer").notNull(),
  category: text("category").notNull(),
  rating: integer("rating").notNull(),
  description: text("description").notNull(),
  price: text("price").notNull(),
  imageUrl: text("image_url"),
  tags: jsonb("tags").$type<string[]>(),
  playStoreUrl: text("play_store_url"),
  amazonAppStoreUrl: text("amazon_app_store_url"),
  featured: boolean("featured").default(false),
});

export const windowsApps = pgTable("windows_apps", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  developer: text("developer").notNull(),
  category: text("category").notNull(),
  rating: integer("rating").notNull(),
  description: text("description").notNull(),
  price: text("price").notNull(),
  imageUrl: text("image_url"),
  tags: jsonb("tags").$type<string[]>(),
  microsoftStoreUrl: text("microsoft_store_url"),
  developerWebsiteUrl: text("developer_website_url"),
  featured: boolean("featured").default(false),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  name: true,
  bio: true,
  location: true,
  profileImage: true,
});

export const insertSocialLinkSchema = createInsertSchema(socialLinks).pick({
  userId: true,
  platform: true,
  name: true,
  username: true,
  url: true,
  active: true,
  order: true,
});

export const insertClickStatSchema = createInsertSchema(clickStats).pick({
  linkId: true,
  timestamp: true,
});

export const insertMovieSchema = createInsertSchema(movies).pick({
  title: true,
  director: true,
  year: true,
  genre: true,
  rating: true,
  imageUrl: true,
  type: true,
});

export const insertMusicSchema = createInsertSchema(music).pick({
  title: true,
  artist: true,
  year: true,
  genre: true,
  imageUrl: true,
  type: true,
});

// Insert schemas for new tables
export const insertSinglesSchema = createInsertSchema(singles).pick({
  title: true,
  artist: true,
  releaseDate: true,
  genre: true,
  rating: true,
  imageUrl: true,
  spotifyUrl: true,
  appleMusicUrl: true,
  youtubeUrl: true,
  description: true,
  featured: true,
});

export const insertAlbumsSchema = createInsertSchema(albums).pick({
  title: true,
  artist: true,
  releaseDate: true,
  genre: true,
  rating: true,
  imageUrl: true,
  spotifyUrl: true,
  appleMusicUrl: true,
  description: true,
  featured: true,
  tracklist: true,
});

export const insertMoviesAndTvSeriesSchema = createInsertSchema(moviesAndTvSeries).pick({
  title: true,
  director: true,
  releaseDate: true,
  genre: true,
  rating: true,
  imageUrl: true,
  type: true,
  seasons: true,
  netflixUrl: true,
  amazonUrl: true,
  description: true,
  featured: true,
  cast: true,
});

export const insertBooksSchema = createInsertSchema(books).pick({
  title: true,
  author: true,
  publishDate: true,
  genre: true,
  rating: true,
  imageUrl: true,
  amazonUrl: true,
  goodreadsUrl: true,
  description: true,
  featured: true,
  isbn: true,
});

export const insertBlogPostsSchema = createInsertSchema(blogPosts).pick({
  title: true,
  excerpt: true,
  content: true,
  publishDate: true,
  lastUpdated: true,
  author: true,
  category: true,
  tags: true,
  imageUrl: true,
  readTime: true,
  featured: true,
  status: true,
});

export const insertReadingResourcesSchema = createInsertSchema(readingResources).pick({
  title: true,
  url: true,
  type: true,
  author: true,
  publishDate: true,
  imageUrl: true,
  description: true,
  category: true,
  tags: true,
  featured: true,
});

export const insertCoursesSchema = createInsertSchema(courses).pick({
  title: true,
  provider: true,
  url: true,
  instructors: true,
  level: true,
  durationHours: true,
  imageUrl: true,
  description: true,
  category: true,
  tags: true,
  featured: true,
  price: true,
  rating: true,
});

export const insertGalleryItemsSchema = createInsertSchema(galleryItems).pick({
  title: true,
  category: true,
  description: true,
  imageUrl: true,
  tags: true,
  year: true,
  client: true,
  projectUrl: true,
  featured: true,
});

export const insertAndroidAppsSchema = createInsertSchema(androidApps).pick({
  name: true,
  developer: true,
  category: true,
  rating: true,
  description: true,
  price: true,
  imageUrl: true,
  tags: true,
  playStoreUrl: true,
  amazonAppStoreUrl: true,
  featured: true,
});

export const insertWindowsAppsSchema = createInsertSchema(windowsApps).pick({
  name: true,
  developer: true,
  category: true,
  rating: true,
  description: true,
  price: true,
  imageUrl: true,
  tags: true,
  microsoftStoreUrl: true,
  developerWebsiteUrl: true,
  featured: true,
});

// Database types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertSocialLink = z.infer<typeof insertSocialLinkSchema>;
export type SocialLink = typeof socialLinks.$inferSelect;

export type InsertClickStat = z.infer<typeof insertClickStatSchema>;
export type ClickStat = typeof clickStats.$inferSelect;

export type InsertMovie = z.infer<typeof insertMovieSchema>;
export type Movie = typeof movies.$inferSelect;

export type InsertMusic = z.infer<typeof insertMusicSchema>;
export type Music = typeof music.$inferSelect;

// Types for new tables
export type InsertSingle = z.infer<typeof insertSinglesSchema>;
export type Single = typeof singles.$inferSelect;

export type InsertAlbum = z.infer<typeof insertAlbumsSchema>;
export type Album = typeof albums.$inferSelect;

export type InsertMovieOrTvSeries = z.infer<typeof insertMoviesAndTvSeriesSchema>;
export type MovieOrTvSeries = typeof moviesAndTvSeries.$inferSelect;

export type InsertBook = z.infer<typeof insertBooksSchema>;
export type Book = typeof books.$inferSelect;

export type InsertBlogPost = z.infer<typeof insertBlogPostsSchema>;
export type BlogPost = typeof blogPosts.$inferSelect;

export type InsertReadingResource = z.infer<typeof insertReadingResourcesSchema>;
export type ReadingResource = typeof readingResources.$inferSelect;

export type InsertCourse = z.infer<typeof insertCoursesSchema>;
export type Course = typeof courses.$inferSelect;

export type InsertGalleryItem = z.infer<typeof insertGalleryItemsSchema>;
export type GalleryItem = typeof galleryItems.$inferSelect;

export type InsertAndroidApp = z.infer<typeof insertAndroidAppsSchema>;
export type AndroidApp = typeof androidApps.$inferSelect;

export type InsertWindowsApp = z.infer<typeof insertWindowsAppsSchema>;
export type WindowsApp = typeof windowsApps.$inferSelect;

// Frontend types
export interface UserData {
  name: string;
  bio: string;
  location: string;
  profileImage: string;
  socialLinks: SocialLink[];
}

// Extended social link type for the frontend
export interface SocialLinkWithMeta extends SocialLink {
  isBeingDragged?: boolean;
}
