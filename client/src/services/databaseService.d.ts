declare module './databaseService' {
  interface SocialLink {
    id: number;
    platform: string;
    url: string;
    icon: string;
    order: number;
  }
  
  interface UserData {
    name: string;
    bio: string;
    location: string;
    profileImage: string;
    socialLinks: SocialLink[];
  }
  
  interface AnalyticsSummary {
    totalClicks: number;
    clicksToday: number;
    growthRate: number;
    avgClicksPerDay: number;
    topPlatform: {
      name: string;
      count: number;
    };
    isPublic: boolean;
  }
  
  interface ApiService {
    getUserData(): Promise<UserData>;
    getSingles(): Promise<any[]>;
    getAlbums(): Promise<any[]>;
    getBlogPosts(): Promise<any[]>;
    getMoviesAndTvSeries(): Promise<any[]>;
    getBooks(): Promise<any[]>;
    getGalleryItems(): Promise<any[]>;
    getAndroidApps(): Promise<any[]>;
    getWindowsApps(): Promise<any[]>;
    getAnalyticsSummary(): Promise<AnalyticsSummary>;
  }
  
  export const apiService: ApiService;
} 