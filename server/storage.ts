import { 
  users, 
  socialLinks, 
  clickStats,
  movies,
  music,
  type User, 
  type InsertUser, 
  type SocialLink, 
  type InsertSocialLink, 
  type ClickStat, 
  type InsertClickStat,
  type Movie,
  type InsertMovie,
  type Music,
  type InsertMusic,
  singles,
  albums,
  moviesAndTvSeries,
  books,
  blogPosts,
  readingResources,
  courses,
  galleryItems,
  androidApps,
  windowsApps
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, sql, and, gte } from "drizzle-orm";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Social links methods
  getSocialLinks(userId?: number): Promise<SocialLink[]>;
  createSocialLink(link: InsertSocialLink): Promise<SocialLink>;
  updateSocialLink(id: number, link: Partial<InsertSocialLink>): Promise<SocialLink | undefined>;
  
  // Click stats methods
  recordClick(clickData: InsertClickStat): Promise<ClickStat>;
  getClickStats(linkId?: number): Promise<ClickStat[]>;
  getClicksGroupedByPlatform(): Promise<{ platform: string; count: number }[]>;
  getClicksGroupedByDay(days?: number): Promise<{ date: string; count: number }[]>;
  resetAnalytics(): Promise<boolean>;
  
  // Settings
  getAnalyticsVisibility(): Promise<boolean>;
  setAnalyticsVisibility(isPublic: boolean): Promise<boolean>;
  
  // Movie methods
  getMovies(type?: 'movie' | 'book'): Promise<Movie[]>;
  getMovie(id: number): Promise<Movie | undefined>;
  createMovie(movie: InsertMovie): Promise<Movie>;
  updateMovie(id: number, movie: Partial<InsertMovie>): Promise<Movie | undefined>;
  deleteMovie(id: number): Promise<boolean>;
  
  // Music methods
  getMusic(type?: 'song' | 'album'): Promise<Music[]>;
  getMusicById(id: number): Promise<Music | undefined>;
  createMusic(music: InsertMusic): Promise<Music>;
  updateMusic(id: number, music: Partial<InsertMusic>): Promise<Music | undefined>;
  deleteMusic(id: number): Promise<boolean>;
  
  // Dataset methods - home page
  getSingles(): Promise<any[]>;
  getAlbums(): Promise<any[]>;
  getMoviesAndTvSeries(): Promise<any[]>;
  getBooks(): Promise<any[]>;
  
  // Dataset methods - blog page
  getReadingResources(): Promise<any[]>;
  getCourses(): Promise<any[]>;
  getBlogPosts(): Promise<any[]>;
  
  // Dataset methods - gallery & apps
  getGalleryItems(): Promise<any[]>;
  getAndroidApps(): Promise<any[]>;
  getWindowsApps(): Promise<any[]>;
}

// New Database Storage implementation
export class DbStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await db.insert(users).values(user).returning();
    return result[0];
  }
  
  async getSocialLinks(userId?: number): Promise<SocialLink[]> {
    if (userId) {
      return db.select().from(socialLinks).where(eq(socialLinks.userId, userId)).orderBy(socialLinks.order);
    }
    return db.select().from(socialLinks).orderBy(socialLinks.order);
  }
  
  async createSocialLink(link: InsertSocialLink): Promise<SocialLink> {
    const result = await db.insert(socialLinks).values(link).returning();
    return result[0];
  }
  
  async updateSocialLink(id: number, link: Partial<InsertSocialLink>): Promise<SocialLink | undefined> {
    const result = await db.update(socialLinks)
      .set(link)
      .where(eq(socialLinks.id, id))
      .returning();
    return result[0];
  }
  
  async recordClick(clickData: InsertClickStat): Promise<ClickStat> {
    const result = await db.insert(clickStats).values(clickData).returning();
    return result[0];
  }
  
  async getClickStats(linkId?: number): Promise<ClickStat[]> {
    if (linkId) {
      return db.select().from(clickStats).where(eq(clickStats.linkId, linkId));
    }
    return db.select().from(clickStats);
  }
  
  async getClicksGroupedByPlatform(): Promise<{ platform: string; count: number }[]> {
    const result = await db.select({
      platform: socialLinks.platform,
      count: sql<number>`count(${clickStats.id})`,
    })
    .from(clickStats)
    .innerJoin(socialLinks, eq(clickStats.linkId, socialLinks.id))
    .groupBy(socialLinks.platform)
    .orderBy(desc(sql`count`));
    
    return result;
  }
  
  async getClicksGroupedByDay(days: number = 14): Promise<{ date: string; count: number }[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const result = await db.select({
      date: sql<string>`to_char(${clickStats.timestamp}::date, 'YYYY-MM-DD')`,
      count: sql<number>`count(${clickStats.id})`,
    })
    .from(clickStats)
    .where(gte(sql`${clickStats.timestamp}::date`, sql`${startDate.toISOString()}::date`))
    .groupBy(sql`to_char(${clickStats.timestamp}::date, 'YYYY-MM-DD')`)
    .orderBy(sql`to_char(${clickStats.timestamp}::date, 'YYYY-MM-DD')`);
    
    return result;
  }
  
  async resetAnalytics(): Promise<boolean> {
    try {
      await db.delete(clickStats);
      return true;
    } catch (error) {
      console.error('Error resetting analytics:', error);
      return false;
    }
  }
  
  // Storage of analytics visibility is not implemented in the database schema
  // This could be added to a settings table in the future
  private analyticsIsPublic = true;
  
  async getAnalyticsVisibility(): Promise<boolean> {
    return this.analyticsIsPublic;
  }
  
  async setAnalyticsVisibility(isPublic: boolean): Promise<boolean> {
    this.analyticsIsPublic = isPublic;
    return true;
  }
  
  // Movie methods
  async getMovies(type?: 'movie' | 'book'): Promise<Movie[]> {
    if (type) {
      return db.select().from(movies).where(eq(movies.type, type));
    }
    return db.select().from(movies);
  }
  
  async getMovie(id: number): Promise<Movie | undefined> {
    const result = await db.select().from(movies).where(eq(movies.id, id));
    return result[0];
  }
  
  async createMovie(movie: InsertMovie): Promise<Movie> {
    // Use explicit type casting for genre field
    const { title, director, year, rating, type, imageUrl } = movie;
    const genre = Array.isArray(movie.genre) ? movie.genre.map(g => String(g)) : [];
    
    const result = await db.insert(movies).values({
      title,
      director,
      year,
      genre,
      rating,
      type,
      imageUrl
    }).returning();
    
    return result[0];
  }
  
  async updateMovie(id: number, movie: Partial<InsertMovie>): Promise<Movie | undefined> {
    const existingMovie = await this.getMovie(id);
    if (!existingMovie) {
      return undefined;
    }
    
    // Create a new object with only the fields we want to update
    const updateData: Record<string, any> = {};
    
    if (movie.title !== undefined) updateData.title = movie.title;
    if (movie.director !== undefined) updateData.director = movie.director;
    if (movie.year !== undefined) updateData.year = movie.year;
    if (movie.rating !== undefined) updateData.rating = movie.rating;
    if (movie.type !== undefined) updateData.type = movie.type;
    if (movie.imageUrl !== undefined) updateData.imageUrl = movie.imageUrl;
    
    // Special handling for genre
    if (movie.genre !== undefined) {
      updateData.genre = Array.isArray(movie.genre) ? movie.genre.map(g => String(g)) : [];
    }
    
    const result = await db.update(movies)
      .set(updateData)
      .where(eq(movies.id, id))
      .returning();
    return result[0];
  }
  
  async deleteMovie(id: number): Promise<boolean> {
    const result = await db.delete(movies).where(eq(movies.id, id)).returning();
    return result.length > 0;
  }
  
  // Music methods
  async getMusic(type?: 'song' | 'album'): Promise<Music[]> {
    if (type) {
      return db.select().from(music).where(eq(music.type, type));
    }
    return db.select().from(music);
  }
  
  async getMusicById(id: number): Promise<Music | undefined> {
    const result = await db.select().from(music).where(eq(music.id, id));
    return result[0];
  }
  
  async createMusic(musicData: InsertMusic): Promise<Music> {
    const result = await db.insert(music).values(musicData).returning();
    return result[0];
  }
  
  async updateMusic(id: number, musicData: Partial<InsertMusic>): Promise<Music | undefined> {
    const result = await db.update(music)
      .set(musicData)
      .where(eq(music.id, id))
      .returning();
    return result[0];
  }
  
  async deleteMusic(id: number): Promise<boolean> {
    const result = await db.delete(music).where(eq(music.id, id)).returning();
    return result.length > 0;
  }
  
  // Dataset methods - home page
  async getSingles(): Promise<any[]> {
    return db.select().from(singles).where(eq(singles.featured, true)).limit(10);
  }
  
  async getAlbums(): Promise<any[]> {
    return db.select().from(albums).where(eq(albums.featured, true)).limit(10);
  }
  
  async getMoviesAndTvSeries(): Promise<any[]> {
    return db.select().from(moviesAndTvSeries).where(eq(moviesAndTvSeries.featured, true)).limit(10);
  }
  
  async getBooks(): Promise<any[]> {
    return db.select().from(books).where(eq(books.featured, true)).limit(10);
  }
  
  // Dataset methods - blog page
  async getReadingResources(): Promise<any[]> {
    return db.select().from(readingResources).where(eq(readingResources.featured, true)).limit(10);
  }
  
  async getCourses(): Promise<any[]> {
    return db.select().from(courses).where(eq(courses.featured, true)).limit(10);
  }
  
  async getBlogPosts(): Promise<any[]> {
    return db.select().from(blogPosts).where(eq(blogPosts.featured, true)).limit(10);
  }
  
  // Dataset methods - gallery & apps
  async getGalleryItems(): Promise<any[]> {
    return db.select().from(galleryItems);
  }
  
  async getAndroidApps(): Promise<any[]> {
    return db.select().from(androidApps).limit(10);
  }
  
  async getWindowsApps(): Promise<any[]> {
    return db.select().from(windowsApps).limit(10);
  }
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private socialLinks: Map<number, SocialLink>;
  private clickStats: Map<number, ClickStat>;
  private movies: Map<number, Movie>;
  private musics: Map<number, Music>;
  private currentUserId: number;
  private currentLinkId: number;
  private currentClickId: number;
  private currentMovieId: number;
  private currentMusicId: number;
  private analyticsIsPublic: boolean;

  constructor() {
    this.users = new Map();
    this.socialLinks = new Map();
    this.clickStats = new Map();
    this.movies = new Map();
    this.musics = new Map();
    this.currentUserId = 1;
    this.currentLinkId = 1;
    this.currentClickId = 1;
    this.currentMovieId = 1;
    this.currentMusicId = 1;
    this.analyticsIsPublic = true; // Default to public
    
    // Initialize with demo data
    this.initDemoData();
  }

  private initDemoData() {
    // Create demo user profile
    const user = {
      id: 1,
      username: 'stanislavnikov',
      password: 'password123',
      name: 'Stanislav Nikov',
      bio: 'Web developer & graphic designer. Passionate about creative solutions with expertise in HTML, CSS, JavaScript, and modern frameworks.',
      location: 'Germany',
      profileImage: '/profile-photo.jpg'
    };
    this.users.set(1, user);
    
    // Add Stanislav's social links
    const demoLinks: SocialLink[] = [
      {
        id: this.currentLinkId++,
        userId: 1,
        platform: "facebook",
        name: "Facebook",
        username: "eyedealist",
        url: "https://www.facebook.com/eyedealist",
        active: true,
        order: 0
      },
      {
        id: this.currentLinkId++,
        userId: 1,
        platform: "linkedin",
        name: "LinkedIn",
        username: "stanislav-nikov",
        url: "https://www.linkedin.com/in/stanislav-nikov/",
        active: true,
        order: 1
      },
      {
        id: this.currentLinkId++,
        userId: 1,
        platform: "twitter",
        name: "Twitter/X",
        username: "@StanislavMNikov",
        url: "https://x.com/StanislavMNikov",
        active: true,
        order: 2
      },
      {
        id: this.currentLinkId++,
        userId: 1,
        platform: "instagram",
        name: "Instagram",
        username: "@stansnikov",
        url: "https://www.instagram.com/stansnikov/",
        active: true,
        order: 3
      },
      {
        id: this.currentLinkId++,
        userId: 1,
        platform: "youtube",
        name: "YouTube",
        username: "@StanislavNikov",
        url: "https://www.youtube.com/@StanislavNikov",
        active: true,
        order: 4
      },
      {
        id: this.currentLinkId++,
        userId: 1,
        platform: "github",
        name: "GitHub",
        username: "StanislavNikov",
        url: "https://github.com/StanislavNikov",
        active: true,
        order: 5
      },
      {
        id: this.currentLinkId++,
        userId: 1,
        platform: "pinterest",
        name: "Pinterest",
        username: "StanislavMNikov",
        url: "https://www.pinterest.com/StanislavMNikov/",
        active: true,
        order: 6
      }
    ];
    
    demoLinks.forEach(link => {
      this.socialLinks.set(link.id, link);
    });
    
    // Add some sample click data for the past 14 days
    const now = new Date();
    const platforms = ["facebook", "linkedin", "twitter", "instagram", "youtube", "github", "pinterest"];
    
    // Generate random clicks for the past 14 days
    for (let i = 0; i < 14; i++) {
      const day = new Date(now);
      day.setDate(day.getDate() - i);
      
      // Random number of clicks per day (0-10)
      const clicksPerDay = Math.floor(Math.random() * 10);
      
      for (let j = 0; j < clicksPerDay; j++) {
        // Pick random link id (1-7)
        const linkId = Math.floor(Math.random() * 7) + 1;
        const timestamp = new Date(day);
        
        // Add some hours/minutes variation
        timestamp.setHours(Math.floor(Math.random() * 24));
        timestamp.setMinutes(Math.floor(Math.random() * 60));
        
        this.recordClick({
          linkId,
          timestamp: timestamp.toISOString()
        });
      }
    }
    
    // Add sample movies (20 entries)
    const movieSamples: InsertMovie[] = [
      // Original movies
      {
        title: "The Shawshank Redemption",
        director: "Frank Darabont",
        year: "1994",
        genre: ["Drama"],
        rating: 5,
        imageUrl: "https://m.media-amazon.com/images/M/MV5BNDE3ODcxYzMtY2YzZC00NmNlLWJiNDMtZDViZWM2MzIxZDYwXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_.jpg",
        type: "movie"
      },
      {
        title: "The Godfather",
        director: "Francis Ford Coppola",
        year: "1972",
        genre: ["Crime", "Drama"],
        rating: 5,
        imageUrl: "https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg",
        type: "movie"
      },
      {
        title: "The Dark Knight",
        director: "Christopher Nolan",
        year: "2008",
        genre: ["Action", "Crime", "Drama"],
        rating: 5,
        imageUrl: "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg",
        type: "movie"
      },
      {
        title: "The Lord of the Rings: The Return of the King",
        director: "Peter Jackson",
        year: "2003",
        genre: ["Action", "Adventure", "Drama"],
        rating: 5,
        imageUrl: "https://m.media-amazon.com/images/M/MV5BNzA5ZDNlZWMtM2NhNS00NDJjLTk4NDItYTRmY2EwMWZlMTY3XkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg",
        type: "movie"
      },
      {
        title: "Pulp Fiction",
        director: "Quentin Tarantino",
        year: "1994",
        genre: ["Crime", "Drama"],
        rating: 5,
        imageUrl: "https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzViMjE3YzI5MjljXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg",
        type: "movie"
      },
      // Additional movies to reach 20 entries
      {
        title: "Inception",
        director: "Christopher Nolan",
        year: "2010",
        genre: ["Action", "Adventure", "Sci-Fi"],
        rating: 5,
        imageUrl: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_.jpg",
        type: "movie"
      },
      {
        title: "The Matrix",
        director: "Lana Wachowski, Lilly Wachowski",
        year: "1999",
        genre: ["Action", "Sci-Fi"],
        rating: 5,
        imageUrl: "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_.jpg",
        type: "movie"
      },
      {
        title: "Goodfellas",
        director: "Martin Scorsese",
        year: "1990",
        genre: ["Biography", "Crime", "Drama"],
        rating: 5,
        imageUrl: "https://m.media-amazon.com/images/M/MV5BY2NkZjEzMDgtN2RjYy00YzM1LWI4ZmQtMjIwYjFjNmI3ZGEwXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg",
        type: "movie"
      },
      {
        title: "The Silence of the Lambs",
        director: "Jonathan Demme",
        year: "1991",
        genre: ["Crime", "Drama", "Thriller"],
        rating: 4,
        imageUrl: "https://m.media-amazon.com/images/M/MV5BNjNhZTk0ZmEtNjJhMi00YzFlLWE1MmEtYzM1M2ZmMGMwMTU4XkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_.jpg",
        type: "movie"
      },
      {
        title: "Fight Club",
        director: "David Fincher",
        year: "1999",
        genre: ["Drama"],
        rating: 5,
        imageUrl: "https://m.media-amazon.com/images/M/MV5BMmEzNTkxYjQtZTc0MC00YTVjLTg5ZTEtZWMwOWVlYzY0NWIwXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg",
        type: "movie"
      },
      {
        title: "Forrest Gump",
        director: "Robert Zemeckis",
        year: "1994",
        genre: ["Drama", "Romance"],
        rating: 4,
        imageUrl: "https://m.media-amazon.com/images/M/MV5BNWIwODRlZTUtY2U3ZS00Yzg1LWJhNzYtMmZiYmEyNmU1NjMzXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_.jpg",
        type: "movie"
      },
      {
        title: "The Godfather: Part II",
        director: "Francis Ford Coppola",
        year: "1974",
        genre: ["Crime", "Drama"],
        rating: 5,
        imageUrl: "https://m.media-amazon.com/images/M/MV5BMWMwMGQzZTItY2JlNC00OWZiLWIyMDctNDk2ZDQ2YjRjMWQ0XkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg",
        type: "movie"
      },
      {
        title: "Interstellar",
        director: "Christopher Nolan",
        year: "2014",
        genre: ["Adventure", "Drama", "Sci-Fi"],
        rating: 5,
        imageUrl: "https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg",
        type: "movie"
      },
      {
        title: "The Green Mile",
        director: "Frank Darabont",
        year: "1999",
        genre: ["Crime", "Drama", "Fantasy"],
        rating: 4,
        imageUrl: "https://m.media-amazon.com/images/M/MV5BMTUxMzQyNjA5MF5BMl5BanBnXkFtZTYwOTU2NTY3._V1_.jpg",
        type: "movie"
      },
      {
        title: "Saving Private Ryan",
        director: "Steven Spielberg",
        year: "1998",
        genre: ["Drama", "War"],
        rating: 5,
        imageUrl: "https://m.media-amazon.com/images/M/MV5BZjhkMDM4MWItZTVjOC00ZDRhLThmYTAtM2I5NzBmNmNlMzI1XkEyXkFqcGdeQXVyNDYyMDk5MTU@._V1_.jpg",
        type: "movie"
      },
      {
        title: "Spirited Away",
        director: "Hayao Miyazaki",
        year: "2001",
        genre: ["Animation", "Adventure", "Family"],
        rating: 5,
        imageUrl: "https://m.media-amazon.com/images/M/MV5BMjlmZmI5MDctNDE2YS00YWE0LWE5ZWItZDBhYWQ0NTcxNWRhXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg",
        type: "movie"
      },
      {
        title: "The Prestige",
        director: "Christopher Nolan",
        year: "2006",
        genre: ["Drama", "Mystery", "Sci-Fi"],
        rating: 4,
        imageUrl: "https://m.media-amazon.com/images/M/MV5BMjA4NDI0MTIxNF5BMl5BanBnXkFtZTYwNTM0MzY2._V1_.jpg",
        type: "movie"
      },
      {
        title: "Gladiator",
        director: "Ridley Scott",
        year: "2000",
        genre: ["Action", "Adventure", "Drama"],
        rating: 4,
        imageUrl: "https://m.media-amazon.com/images/M/MV5BMDliMmNhNDEtODUyOS00MjNlLTgxODEtN2U3NzIxMGVkZTA1L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_.jpg",
        type: "movie"
      },
      {
        title: "The Departed",
        director: "Martin Scorsese",
        year: "2006",
        genre: ["Crime", "Drama", "Thriller"],
        rating: 4,
        imageUrl: "https://m.media-amazon.com/images/M/MV5BMTI1MTY2OTIxNV5BMl5BanBnXkFtZTYwNjQ4NjY3._V1_.jpg",
        type: "movie"
      },
      {
        title: "Whiplash",
        director: "Damien Chazelle",
        year: "2014",
        genre: ["Drama", "Music"],
        rating: 5,
        imageUrl: "https://m.media-amazon.com/images/M/MV5BOTA5NDZlZGUtMjAxOS00YTRkLTkwYmMtYWQ0NWEwZDZiNjEzXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg",
        type: "movie"
      },
      {
        title: "Pride and Prejudice",
        director: "Jane Austen",
        year: "1813",
        genre: ["Romance", "Classic"],
        rating: 5,
        imageUrl: "https://m.media-amazon.com/images/I/71Q1tPupKjL._AC_UF1000,1000_QL80_.jpg",
        type: "book"
      },
      {
        title: "To Kill a Mockingbird",
        director: "Harper Lee",
        year: "1960",
        genre: ["Drama", "Classic"],
        rating: 5,
        imageUrl: "https://m.media-amazon.com/images/I/71FxgtFKcQL._AC_UF1000,1000_QL80_.jpg",
        type: "book"
      },
      {
        title: "The Great Gatsby",
        director: "F. Scott Fitzgerald",
        year: "1925",
        genre: ["Drama", "Classic"],
        rating: 5,
        imageUrl: "https://m.media-amazon.com/images/I/71FTb9X6wsL._AC_UF1000,1000_QL80_.jpg",
        type: "book"
      },
      {
        title: "1984",
        director: "George Orwell",
        year: "1949",
        genre: ["Dystopian", "Classic"],
        rating: 5,
        imageUrl: "https://m.media-amazon.com/images/I/71kxa1-0mfL._AC_UF1000,1000_QL80_.jpg",
        type: "book"
      },
      {
        title: "The Hobbit",
        director: "J.R.R. Tolkien",
        year: "1937",
        genre: ["Fantasy", "Adventure"],
        rating: 5,
        imageUrl: "https://m.media-amazon.com/images/I/710+HcoP38L._AC_UF1000,1000_QL80_.jpg",
        type: "book"
      },
      {
        title: "Don Quixote",
        director: "Miguel de Cervantes",
        year: "1605",
        genre: ["Adventure", "Satire"],
        rating: 5,
        imageUrl: "https://m.media-amazon.com/images/I/71c3lwgBJJL._AC_UF1000,1000_QL80_.jpg",
        type: "book"
      },
      {
        title: "Crime and Punishment",
        director: "Fyodor Dostoevski",
        year: "1866",
        genre: ["Psychological", "Drama"],
        rating: 5, 
        imageUrl: "https://m.media-amazon.com/images/I/81b6eSdePzL._AC_UF1000,1000_QL80_.jpg",
        type: "book"
      },
      {
        title: "Anna Karenina",
        director: "Leo Tolstoy",
        year: "1878",
        genre: ["Drama", "Romance"],
        rating: 5,
        imageUrl: "https://m.media-amazon.com/images/I/91F9WSTuWML._AC_UF1000,1000_QL80_.jpg",
        type: "book"
      },
      {
        title: "Brave New World",
        director: "Aldous Huxley",
        year: "1932",
        genre: ["Dystopian", "Sci-Fi"],
        rating: 5,
        imageUrl: "https://m.media-amazon.com/images/I/81zE42gT3xL._AC_UF1000,1000_QL80_.jpg",
        type: "book"
      }
    ];

    // Add sample music
    const musicSamples: InsertMusic[] = [
      {
        title: "Like a Rolling Stone",
        artist: "Bob Dylan",
        year: "1965",
        genre: "Rock",
        imageUrl: "https://upload.wikimedia.org/wikipedia/en/9/96/HighwayRevisited.jpg",
        type: "song"
      },
      {
        title: "Imagine",
        artist: "John Lennon",
        year: "1971",
        genre: "Rock",
        imageUrl: "https://upload.wikimedia.org/wikipedia/en/e/e5/John_Lennon_Imagine.jpg",
        type: "song"
      },
      {
        title: "What's Going On",
        artist: "Marvin Gaye",
        year: "1971",
        genre: "Soul",
        imageUrl: "https://upload.wikimedia.org/wikipedia/en/8/84/MarvinGayeWhat%27sGoingOnalbumcover.jpg",
        type: "song"
      },
      {
        title: "Respect",
        artist: "Aretha Franklin",
        year: "1967",
        genre: "Soul",
        imageUrl: "https://upload.wikimedia.org/wikipedia/en/b/b5/Aretha_Franklin_-_I_Never_Loved_a_Man_the_Way_I_Love_You.jpg",
        type: "song"
      },
      {
        title: "Smells Like Teen Spirit",
        artist: "Nirvana",
        year: "1991",
        genre: "Rock",
        imageUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/a/a2/Smells_Like_Teen_Spirit.jpg/220px-Smells_Like_Teen_Spirit.jpg",
        type: "song"
      },
      {
        title: "Bohemian Rhapsody",
        artist: "Queen",
        year: "1975",
        genre: "Rock",
        imageUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/9/9f/Bohemian_Rhapsody.png/220px-Bohemian_Rhapsody.png",
        type: "song"
      },
      {
        title: "Hotel California",
        artist: "Eagles",
        year: "1977",
        genre: "Rock",
        imageUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/4/49/Hotelcalifornia.jpg/220px-Hotelcalifornia.jpg",
        type: "song"
      },
      {
        title: "Thriller",
        artist: "Michael Jackson",
        year: "1982",
        genre: "Pop",
        imageUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/5/55/Michael_Jackson_-_Thriller.png/220px-Michael_Jackson_-_Thriller.png",
        type: "album"
      },
      {
        title: "The Dark Side of the Moon",
        artist: "Pink Floyd",
        year: "1973",
        genre: "Rock",
        imageUrl: "https://upload.wikimedia.org/wikipedia/en/3/3b/Dark_Side_of_the_Moon.png",
        type: "album"
      },
      {
        title: "Abbey Road",
        artist: "The Beatles",
        year: "1969",
        genre: "Rock",
        imageUrl: "https://upload.wikimedia.org/wikipedia/en/4/42/Beatles_-_Abbey_Road.jpg",
        type: "album"
      },
      {
        title: "Back in Black",
        artist: "AC/DC",
        year: "1980",
        genre: "Rock",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/ACDC_Back_in_Black.png/220px-ACDC_Back_in_Black.png",
        type: "album"
      },
      {
        title: "Rumours",
        artist: "Fleetwood Mac",
        year: "1977",
        genre: "Rock",
        imageUrl: "https://upload.wikimedia.org/wikipedia/en/f/fb/FMacRumours.PNG",
        type: "album"
      },
      {
        title: "Nevermind",
        artist: "Nirvana",
        year: "1991",
        genre: "Rock",
        imageUrl: "https://upload.wikimedia.org/wikipedia/en/b/b7/NirvanaNevermindalbumcover.jpg",
        type: "album"
      },
      {
        title: "Purple Rain",
        artist: "Prince",
        year: "1984",
        genre: "Pop",
        imageUrl: "https://upload.wikimedia.org/wikipedia/en/9/9c/Princepurplerain.jpg",
        type: "album"
      }
    ];
    
    // Add movies to storage
    movieSamples.forEach(movie => {
      this.createMovie(movie);
    });
    
    // Add music to storage
    musicSamples.forEach(music => {
      this.createMusic(music);
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    // Ensure all required properties are present with default values if needed
    const user: User = { 
      id, 
      username: insertUser.username,
      password: insertUser.password || '',
      name: insertUser.name || null,
      bio: insertUser.bio || null,
      location: insertUser.location || null,
      profileImage: insertUser.profileImage || null
    };
    this.users.set(id, user);
    return user;
  }
  
  async getSocialLinks(userId?: number): Promise<SocialLink[]> {
    let links = Array.from(this.socialLinks.values());
    
    // Filter by user ID if provided
    if (userId) {
      links = links.filter(link => link.userId === userId);
    }
    
    // Sort links by their order field
    return links.sort((a, b) => a.order - b.order);
  }
  
  async createSocialLink(link: InsertSocialLink): Promise<SocialLink> {
    const id = this.currentLinkId++;
    
    // Get the current max order value to assign next order
    let maxOrder = 0;
    const links = await this.getSocialLinks();
    if (links.length > 0) {
      maxOrder = Math.max(...links.map(l => l.order)) + 1;
    }
    
    // Ensure required properties have default values
    const socialLink: SocialLink = { 
      ...link, 
      id,
      active: link.active ?? true,
      order: link.order ?? maxOrder
    };
    this.socialLinks.set(id, socialLink);
    return socialLink;
  }
  
  async updateSocialLink(id: number, link: Partial<InsertSocialLink>): Promise<SocialLink | undefined> {
    const existingLink = this.socialLinks.get(id);
    if (!existingLink) {
      return undefined;
    }
    
    const updatedLink = { ...existingLink, ...link };
    this.socialLinks.set(id, updatedLink);
    return updatedLink;
  }
  
  async recordClick(clickData: InsertClickStat): Promise<ClickStat> {
    const id = this.currentClickId++;
    const clickStat: ClickStat = { ...clickData, id };
    this.clickStats.set(id, clickStat);
    return clickStat;
  }
  
  async getClickStats(linkId?: number): Promise<ClickStat[]> {
    const clicks = Array.from(this.clickStats.values());
    if (linkId) {
      return clicks.filter(click => click.linkId === linkId);
    }
    return clicks;
  }
  
  async getClicksGroupedByPlatform(): Promise<{ platform: string; count: number }[]> {
    const clicks = Array.from(this.clickStats.values());
    const platformCounts: Record<string, number> = {};
    
    // For each click, look up the associated link to get the platform
    for (const click of clicks) {
      const link = this.socialLinks.get(click.linkId);
      if (link) {
        const platform = link.platform;
        platformCounts[platform] = (platformCounts[platform] || 0) + 1;
      }
    }
    
    // Convert to array format and sort by count (descending)
    return Object.entries(platformCounts)
      .map(([platform, count]) => ({ platform, count }))
      .sort((a, b) => b.count - a.count);
  }
  
  async getClicksGroupedByDay(days: number = 14): Promise<{ date: string; count: number }[]> {
    const clicks = Array.from(this.clickStats.values());
    const dateCounts: Record<string, number> = {};
    
    // Get date range (last N days)
    const now = new Date();
    const startDate = new Date(now);
    startDate.setDate(startDate.getDate() - days);
    
    // Initialize all dates with 0 counts
    for (let i = 0; i <= days; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      dateCounts[dateStr] = 0;
    }
    
    // Count clicks by day
    for (const click of clicks) {
      const clickDate = new Date(click.timestamp).toISOString().split('T')[0];
      if (new Date(clickDate) >= startDate) {
        dateCounts[clickDate] = (dateCounts[clickDate] || 0) + 1;
      }
    }
    
    // Convert to array and sort by date
    return Object.entries(dateCounts)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }
  
  async resetAnalytics(): Promise<boolean> {
    try {
      // Clear all click stats
      this.clickStats = new Map();
      // Reset current click ID to 1
      this.currentClickId = 1;
      console.log('Analytics data has been reset successfully');
      return true;
    } catch (error) {
      console.error('Error resetting analytics:', error);
      return false;
    }
  }
  
  async getAnalyticsVisibility(): Promise<boolean> {
    return this.analyticsIsPublic;
  }
  
  async setAnalyticsVisibility(isPublic: boolean): Promise<boolean> {
    this.analyticsIsPublic = isPublic;
    return true;
  }
  
  // Movie methods
  async getMovies(type?: 'movie' | 'book'): Promise<Movie[]> {
    let movies = Array.from(this.movies.values());
    if (type) {
      movies = movies.filter(movie => movie.type === type);
    }
    return movies;
  }
  
  async getMovie(id: number): Promise<Movie | undefined> {
    return this.movies.get(id);
  }
  
  async createMovie(movie: InsertMovie): Promise<Movie> {
    const id = this.currentMovieId++;
    // Ensure genre is always a string array
    const genreArray: string[] = Array.isArray(movie.genre) 
      ? movie.genre.map(g => String(g)) 
      : [];
      
    const newMovie: Movie = {
      id,
      title: movie.title,
      director: movie.director,
      year: movie.year,
      genre: genreArray,
      rating: movie.rating,
      type: movie.type || 'movie',
      imageUrl: movie.imageUrl || null
    };
    this.movies.set(id, newMovie);
    return newMovie;
  }
  
  async updateMovie(id: number, movie: Partial<InsertMovie>): Promise<Movie | undefined> {
    const existingMovie = this.movies.get(id);
    if (!existingMovie) {
      return undefined;
    }
    
    // Handle genre specially if it exists to ensure proper type
    let genreArray: string[] = existingMovie.genre;
    if (movie.genre) {
      genreArray = Array.isArray(movie.genre) 
        ? movie.genre.map(g => String(g)) 
        : [];
    }
    
    // Create a properly typed updated movie
    const updatedMovie: Movie = {
      ...existingMovie,
      ...movie,
      genre: genreArray
    };
    
    this.movies.set(id, updatedMovie);
    return updatedMovie;
  }
  
  async deleteMovie(id: number): Promise<boolean> {
    if (!this.movies.has(id)) {
      return false;
    }
    return this.movies.delete(id);
  }
  
  // Music methods
  async getMusic(type?: 'song' | 'album'): Promise<Music[]> {
    let music = Array.from(this.musics.values());
    if (type) {
      music = music.filter(item => item.type === type);
    }
    return music;
  }
  
  async getMusicById(id: number): Promise<Music | undefined> {
    return this.musics.get(id);
  }
  
  async createMusic(music: InsertMusic): Promise<Music> {
    const id = this.currentMusicId++;
    const newMusic: Music = {
      ...music,
      id,
      type: music.type || 'song',
      imageUrl: music.imageUrl || null
    };
    this.musics.set(id, newMusic);
    return newMusic;
  }
  
  async updateMusic(id: number, music: Partial<InsertMusic>): Promise<Music | undefined> {
    const existingMusic = this.musics.get(id);
    if (!existingMusic) {
      return undefined;
    }
    
    const updatedMusic = { ...existingMusic, ...music };
    this.musics.set(id, updatedMusic);
    return updatedMusic;
  }
  
  async deleteMusic(id: number): Promise<boolean> {
    if (!this.musics.has(id)) {
      return false;
    }
    return this.musics.delete(id);
  }
  
  // Dataset methods - These are simplified for demo purposes
  // In a real application, these would connect to the database
  
  // Home page datasets
  async getSingles(): Promise<any[]> {
    return [
      {
        id: 1,
        title: "Like a Rolling Stone",
        artist: "Bob Dylan",
        releaseDate: "1965-06-20",
        genre: ["Rock", "Folk Rock"],
        rating: 5,
        imageUrl: "https://upload.wikimedia.org/wikipedia/en/9/96/HighwayRevisited.jpg",
        spotifyUrl: "https://open.spotify.com/track/3AhXZa8sUQht0UEdBJgpGc",
        appleMusicUrl: "https://music.apple.com/us/album/like-a-rolling-stone/201281514?i=201281516",
        youtubeUrl: "https://www.youtube.com/watch?v=IwOfCgkyEj0",
        description: "Bob Dylan's groundbreaking single that changed rock music forever.",
        featured: true
      },
      {
        id: 2,
        title: "Imagine",
        artist: "John Lennon",
        releaseDate: "1971-10-11",
        genre: ["Rock", "Pop"],
        rating: 5,
        imageUrl: "https://upload.wikimedia.org/wikipedia/en/6/69/ImagineCover.jpg",
        spotifyUrl: "https://open.spotify.com/track/7pKfPomDEeI4TPT6EOYjn9",
        appleMusicUrl: "https://music.apple.com/us/album/imagine/1440857781?i=1440857789",
        youtubeUrl: "https://www.youtube.com/watch?v=YkgkThdzX-8",
        description: "John Lennon's iconic peace anthem.",
        featured: true
      },
      {
        id: 3,
        title: "What's Going On",
        artist: "Marvin Gaye",
        releaseDate: "1971-01-20",
        genre: ["Soul", "R&B"],
        rating: 5,
        imageUrl: "https://upload.wikimedia.org/wikipedia/en/8/83/What%27s_Going_On_%28Marvin_Gaye_album%29_CD_cover.jpg",
        spotifyUrl: "https://open.spotify.com/track/3Um9toULmYFGCpvaIPFxup",
        appleMusicUrl: "https://music.apple.com/us/album/whats-going-on/1440785372?i=1440785645",
        youtubeUrl: "https://www.youtube.com/watch?v=H-kA3UtBj4M",
        description: "Marvin Gaye's soulful reflection on social issues.",
        featured: false
      }
    ];
  }
  
  async getAlbums(): Promise<any[]> {
    return [
      {
        id: 1,
        title: "Dark Side of the Moon",
        artist: "Pink Floyd",
        releaseDate: "1973-03-01",
        genre: ["Progressive Rock", "Psychedelic Rock"],
        rating: 5,
        imageUrl: "https://upload.wikimedia.org/wikipedia/en/3/3b/Dark_Side_of_the_Moon.png",
        spotifyUrl: "https://open.spotify.com/album/4LH4d3cOWNNsVw41Gqt2kv",
        appleMusicUrl: "https://music.apple.com/us/album/the-dark-side-of-the-moon/1065973699",
        tracklist: [
          "Speak to Me",
          "Breathe (In the Air)",
          "On the Run",
          "Time",
          "The Great Gig in the Sky",
          "Money",
          "Us and Them",
          "Any Colour You Like",
          "Brain Damage",
          "Eclipse"
        ],
        description: "Pink Floyd's iconic concept album exploring themes of conflict, greed, time, and mental illness.",
        featured: true
      },
      {
        id: 2,
        title: "Thriller",
        artist: "Michael Jackson",
        releaseDate: "1982-11-30",
        genre: ["Pop", "R&B", "Funk"],
        rating: 5,
        imageUrl: "https://upload.wikimedia.org/wikipedia/en/5/55/Michael_Jackson_-_Thriller.png",
        spotifyUrl: "https://open.spotify.com/album/2ANVost0y2y52ema1E9xAZ",
        appleMusicUrl: "https://music.apple.com/us/album/thriller/269572838",
        tracklist: [
          "Wanna Be Startin' Somethin'",
          "Baby Be Mine",
          "The Girl Is Mine",
          "Thriller",
          "Beat It",
          "Billie Jean",
          "Human Nature",
          "P.Y.T. (Pretty Young Thing)",
          "The Lady in My Life"
        ],
        description: "Michael Jackson's best-selling album that revolutionized pop music and music videos.",
        featured: true
      },
      {
        id: 3,
        title: "Abbey Road",
        artist: "The Beatles",
        releaseDate: "1969-09-26",
        genre: ["Rock", "Pop Rock"],
        rating: 5,
        imageUrl: "https://upload.wikimedia.org/wikipedia/en/4/42/Beatles_-_Abbey_Road.jpg",
        spotifyUrl: "https://open.spotify.com/album/0ETFjACtuP2ADo6LFhL6HN",
        appleMusicUrl: "https://music.apple.com/us/album/abbey-road-2019-mix/1474815798",
        tracklist: [
          "Come Together",
          "Something",
          "Maxwell's Silver Hammer",
          "Oh! Darling",
          "Octopus's Garden",
          "I Want You (She's So Heavy)",
          "Here Comes the Sun",
          "Because",
          "You Never Give Me Your Money",
          "Sun King",
          "Mean Mr. Mustard",
          "Polythene Pam",
          "She Came in Through the Bathroom Window",
          "Golden Slumbers",
          "Carry That Weight",
          "The End",
          "Her Majesty"
        ],
        description: "The Beatles' final recorded album featuring their iconic walk across Abbey Road.",
        featured: false
      }
    ];
  }
  
  async getMoviesAndTvSeries(): Promise<any[]> {
    return [
      {
        id: 1,
        title: "The Shawshank Redemption",
        director: "Frank Darabont",
        releaseDate: "1994-09-23",
        genre: ["Drama"],
        rating: 5,
        imageUrl: "https://m.media-amazon.com/images/M/MV5BNDE3ODcxYzMtY2YzZC00NmNlLWJiNDMtZDViZWM2MzIxZDYwXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_.jpg",
        cast: ["Tim Robbins", "Morgan Freeman", "Bob Gunton"],
        duration: "142 minutes",
        streamingOn: ["Netflix", "HBO Max"],
        description: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
        type: "movie"
      },
      {
        id: 2,
        title: "Breaking Bad",
        director: "Vince Gilligan",
        releaseDate: "2008-01-20",
        genre: ["Drama", "Crime", "Thriller"],
        rating: 5,
        imageUrl: "https://m.media-amazon.com/images/M/MV5BYmQ4YWMxYjUtNjZmYi00MDQ1LWFjMjMtNjA5ZDdiYjdiODU5XkEyXkFqcGdeQXVyMTMzNDExODE5._V1_.jpg",
        cast: ["Bryan Cranston", "Aaron Paul", "Anna Gunn"],
        seasons: 5,
        episodes: 62,
        streamingOn: ["Netflix"],
        description: "A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine to secure his family's future.",
        type: "tv"
      },
      {
        id: 3,
        title: "The Dark Knight",
        director: "Christopher Nolan",
        releaseDate: "2008-07-18",
        genre: ["Action", "Crime", "Drama"],
        rating: 5,
        imageUrl: "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg",
        cast: ["Christian Bale", "Heath Ledger", "Aaron Eckhart"],
        duration: "152 minutes",
        streamingOn: ["HBO Max", "Amazon Prime"],
        description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
        type: "movie"
      }
    ];
  }
  
  async getBooks(): Promise<any[]> {
    return [
      {
        id: 1,
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        releaseDate: "1960-07-11",
        genre: ["Southern Gothic", "Bildungsroman"],
        rating: 5,
        imageUrl: "https://m.media-amazon.com/images/I/71FxgtFKcQL._AC_UF1000,1000_QL80_.jpg",
        pages: 336,
        publisher: "J. B. Lippincott & Co.",
        ISBN: "978-0-06-112008-4",
        description: "The story of young Scout Finch and her father Atticus, a lawyer who defends a black man accused of raping a white woman in the Deep South of the 1930s.",
        purchaseLinks: {
          amazon: "https://www.amazon.com/Kill-Mockingbird-Harper-Lee/dp/0060935464",
          barnesAndNoble: "https://www.barnesandnoble.com/w/to-kill-a-mockingbird-harper-lee/1100151011"
        }
      },
      {
        id: 2,
        title: "1984",
        author: "George Orwell",
        releaseDate: "1949-06-08",
        genre: ["Dystopian", "Political Fiction"],
        rating: 5,
        imageUrl: "https://m.media-amazon.com/images/I/71kxa1-0mfL._AC_UF1000,1000_QL80_.jpg",
        pages: 328,
        publisher: "Secker & Warburg",
        ISBN: "978-0-452-28423-4",
        description: "A dystopian social science fiction novel that examines the consequences of totalitarianism, mass surveillance, and repressive regimentation of persons and behaviors.",
        purchaseLinks: {
          amazon: "https://www.amazon.com/1984-Signet-Classics-George-Orwell/dp/0451524934",
          barnesAndNoble: "https://www.barnesandnoble.com/w/1984-george-orwell/1100009100"
        }
      },
      {
        id: 3,
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        releaseDate: "1925-04-10",
        genre: ["Tragedy", "Social Criticism"],
        rating: 4,
        imageUrl: "https://m.media-amazon.com/images/I/71FTb9X6wsL._AC_UF1000,1000_QL80_.jpg",
        pages: 180,
        publisher: "Charles Scribner's Sons",
        ISBN: "978-0-7432-7356-5",
        description: "Set in the Jazz Age, this novel explores themes of decadence, idealism, social upheaval, and resistance to change through the story of the self-made millionaire Jay Gatsby.",
        purchaseLinks: {
          amazon: "https://www.amazon.com/Great-Gatsby-F-Scott-Fitzgerald/dp/0743273567",
          barnesAndNoble: "https://www.barnesandnoble.com/w/great-gatsby-francis-scott-fitzgerald/1116668135"
        }
      }
    ];
  }
  
  // Blog page datasets
  async getReadingResources(): Promise<any[]> {
    return [
      {
        id: 1,
        title: "Modern JavaScript Explained For Dinosaurs",
        author: "Peter Jang",
        type: "article",
        url: "https://medium.com/the-node-js-collection/modern-javascript-explained-for-dinosaurs-f695e9747b70",
        publishDate: "2017-10-05",
        tags: ["JavaScript", "Web Development", "Programming"],
        difficulty: "Intermediate",
        estimatedReadTime: 15,
        isFeatured: true,
        summary: "A comprehensive overview of the modern JavaScript ecosystem and how it evolved over time."
      },
      {
        id: 2,
        title: "You Don't Know JS",
        author: "Kyle Simpson",
        type: "book series",
        url: "https://github.com/getify/You-Dont-Know-JS",
        publishDate: "2015-03-10",
        tags: ["JavaScript", "Programming", "Deep Dive"],
        difficulty: "Advanced",
        estimatedReadTime: 1200,
        isFeatured: true,
        summary: "A series of books diving deep into the core mechanisms of the JavaScript language."
      },
      {
        id: 3,
        title: "Designing Data-Intensive Applications",
        author: "Martin Kleppmann",
        type: "book",
        url: "https://dataintensive.net/",
        publishDate: "2017-03-16",
        tags: ["Databases", "System Design", "Data Engineering"],
        difficulty: "Advanced",
        estimatedReadTime: 720,
        isFeatured: false,
        summary: "A comprehensive guide to designing systems that handle large amounts of data."
      }
    ];
  }
  
  async getCourses(): Promise<any[]> {
    return [
      {
        id: 1,
        title: "The Complete Web Developer in 2023",
        instructor: "Andrei Neagoie",
        platform: "Udemy",
        url: "https://www.udemy.com/course/the-complete-web-developer-zero-to-mastery/",
        publishDate: "2023-01-15",
        lastUpdated: "2023-08-01",
        category: ["Web Development", "Full Stack"],
        difficulty: "Beginner to Intermediate",
        duration: "36 hours",
        price: 19.99,
        rating: 4.7,
        isCertified: true,
        description: "Learn to code and become a web developer in 2023 with HTML, CSS, JavaScript, React, Node.js, Machine Learning & more."
      },
      {
        id: 2,
        title: "CS50: Introduction to Computer Science",
        instructor: "David J. Malan",
        platform: "edX",
        url: "https://www.edx.org/learn/computer-science/harvard-university-cs50-s-introduction-to-computer-science",
        publishDate: "2023-01-01",
        lastUpdated: "2023-07-15",
        category: ["Computer Science", "Programming Fundamentals"],
        difficulty: "Beginner to Intermediate",
        duration: "100 hours",
        price: 0,
        rating: 4.9,
        isCertified: true,
        description: "Harvard University's introduction to the intellectual enterprises of computer science and the art of programming."
      },
      {
        id: 3,
        title: "Machine Learning Specialization",
        instructor: "Andrew Ng",
        platform: "Coursera",
        url: "https://www.coursera.org/specializations/machine-learning-introduction",
        publishDate: "2022-06-01",
        lastUpdated: "2023-05-10",
        category: ["Machine Learning", "AI", "Data Science"],
        difficulty: "Intermediate",
        duration: "80 hours",
        price: 49,
        rating: 4.8,
        isCertified: true,
        description: "Build ML models with Python and NumPy, use supervised learning algorithms for prediction, and learn best practices for AI."
      }
    ];
  }
  
  async getBlogPosts(): Promise<any[]> {
    return [
      {
        id: 1,
        title: "Getting Started with React Hooks",
        author: "Stanislav Nikov",
        publishDate: "2023-05-15",
        lastUpdated: "2023-07-20",
        category: ["Web Development", "React", "JavaScript"],
        tags: ["hooks", "state management", "functional components"],
        content: "In this article, we'll explore the basics of React Hooks and how they've changed the way we write React components...",
        views: 3542,
        likes: 127,
        comments: 18,
        imageUrl: "https://example.com/images/react-hooks.jpg"
      },
      {
        id: 2,
        title: "Building a Real-time Chat Application with WebSockets",
        author: "Stanislav Nikov",
        publishDate: "2023-03-10",
        lastUpdated: "2023-03-15",
        category: ["Web Development", "Real-time", "Backend"],
        tags: ["websockets", "chat", "nodejs", "express"],
        content: "Learn how to create a real-time chat application using WebSockets with Node.js and Express...",
        views: 2814,
        likes: 95,
        comments: 12,
        imageUrl: "https://example.com/images/websockets-chat.jpg"
      },
      {
        id: 3,
        title: "Introduction to TypeScript: Why You Should Use It",
        author: "Stanislav Nikov",
        publishDate: "2023-02-01",
        lastUpdated: "2023-02-05",
        category: ["Web Development", "TypeScript", "JavaScript"],
        tags: ["types", "typescript", "javascript", "development"],
        content: "TypeScript has become increasingly popular in recent years. In this article, we'll look at why you might want to use TypeScript in your next project...",
        views: 4120,
        likes: 145,
        comments: 23,
        imageUrl: "https://example.com/images/typescript-intro.jpg"
      }
    ];
  }
  
  // Gallery & apps datasets
  async getGalleryItems(): Promise<any[]> {
    return db.select().from(galleryItems);
  }
  
  async getAndroidApps(): Promise<any[]> {
    return db.select().from(androidApps).limit(10);
  }
  
  async getWindowsApps(): Promise<any[]> {
    return db.select().from(windowsApps).limit(10);
  }
}

// Change this line to use the database storage
export const storage = new DbStorage();
