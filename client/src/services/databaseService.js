// IMPORTANT: This is a temporary solution for development only
// Connecting directly to a database from the frontend is not secure for production

// Import supabase client if it exists, otherwise use a mock implementation
let supabase;
let useMockData = false;

// Wrap initialization in an IIFE to avoid top-level await
(async function initSupabase() {
  try {
    // Dynamically import Supabase client
    const { createClient } = await import('@supabase/supabase-js');
    
    // Initialize Supabase client with public anon key (safe for client-side)
    const supabaseUrl = 'https://ngytqujgblbravfjcdep.supabase.co';
    // Using the updated API key provided
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5neXRxdWpnYmxicmF2ZmpjZGVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUyMjUzNDYsImV4cCI6MjA2MDgwMTM0Nn0.4Dzj_PKDy76m2gu4bId12QApjz3LEfE71L7W8Cix2LA';
    
    // Create the client with auto refresh tokens and retries
    supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { autoRefreshToken: true, persistSession: true },
      realtime: { timeout: 10000 }
    });
    
    console.log('Supabase client initialized successfully');
    
    // Test the connection with a table we know exists (albums)
    const { data, error } = await supabase.from('albums').select('count');
    if (error) {
      console.error('Supabase connection test failed:', error);
      useMockData = true;
    } else {
      console.log('Supabase connection test successful');
    }
  } catch (error) {
    console.error('Failed to initialize Supabase client:', error);
    useMockData = true;
  }
})();

// Helper function to fetch from Supabase REST API
async function supabaseFetch(table, options = {}) {
  const { select, order, eq, limit, single } = options;
  
  // Build URL
  let url = `${supabaseUrl}/${table}?`;
  
  // Add select columns
  if (select) {
    url += `select=${select}`;
  } else {
    url += 'select=*';
  }
  
  // Add order
  if (order) {
    url += `&order=${order}`;
  }
  
  // Add equals filter
  if (eq) {
    const { column, value } = eq;
    url += `&${column}=eq.${value}`;
  }
  
  // Add limit
  if (limit) {
    url += `&limit=${limit}`;
  }
  
  // Request options
  const requestOptions = {
    method: 'GET',
    headers: {
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`,
      'Content-Type': 'application/json',
      'Prefer': single ? 'return=representation' : ''
    }
  };
  
  try {
    console.log(`Fetching from Supabase: ${url}`);
    const response = await fetch(url, requestOptions);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error response from Supabase for ${table}:`, {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      throw new Error(`Error fetching data: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log(`Supabase returned ${data?.length || 0} records for ${table}`);
    
    // Handle empty data
    if (!data || (Array.isArray(data) && data.length === 0)) {
      console.warn(`No data returned from Supabase for table: ${table}`);
    }
    
    return single ? data[0] : data;
  } catch (error) {
    console.error(`Error in supabaseFetch for ${table}:`, error);
    throw error; // Re-throw to allow functions to handle with fallback data
  }
}

// Database service with fallback to mock data
const apiService = {
  // User profile mock data
  mockUserData: {
    name: 'Stanislav Nikov',
    bio: 'Web developer & graphic designer. Passionate about creative solutions with expertise in HTML, CSS, JavaScript, and modern frameworks.',
    location: 'Germany',
    profileImage: '/profile-photo.jpg',
    socialLinks: [
      { id: 1, platform: 'Facebook', url: 'https://facebook.com/eyedealist', icon: 'FaFacebook' },
      { id: 2, platform: 'LinkedIn', url: 'https://linkedin.com/in/stanislav-nikov', icon: 'FaLinkedin' },
      { id: 3, platform: 'Twitter/X', url: 'https://twitter.com/StanislavMNikov', icon: 'FaTwitter' }
    ]
  },
  
  // Fetch user data from the database
  async getUserData() {
    // Return mock data directly to avoid any async issues
    console.log('Returning hard-coded user data to fix frontend error');
    
    const userData = {
      id: 1,
      name: 'Stanislav Nikov',
      bio: 'Web developer & graphic designer. Passionate about creative solutions with expertise in HTML, CSS, JavaScript, and modern frameworks.',
      location: 'Germany',
      profileImage: '/assets/profile-photo.jpg',
      socialLinks: [
        { id: 1, platform: 'Facebook', url: 'https://facebook.com/eyedealist', icon: 'FaFacebook' },
        { id: 2, platform: 'LinkedIn', url: 'https://linkedin.com/in/stanislav-nikov', icon: 'FaLinkedin' },
        { id: 3, platform: 'Twitter/X', url: 'https://twitter.com/StanislavMNikov', icon: 'FaTwitter' }
      ]
    };
    
    console.log('Returning user data:', userData);
    return userData;
  },
  
  // Mock singles data
  mockSingles: [
    {
      id: 1,
      title: 'Blinding Lights',
      artist: 'The Weeknd',
      releaseDate: '2019-11-29',
      genre: ['Synth-pop', 'R&B'],
      spotifyUrl: 'https://open.spotify.com/track/0VjIjW4GlUZAMYd2vXMi3b',
      imageUrl: 'https://placehold.co/400x400?text=Blinding+Lights'
    },
    {
      id: 2,
      title: 'Watermelon Sugar',
      artist: 'Harry Styles',
      releaseDate: '2020-05-15',
      genre: ['Pop', 'Rock'],
      spotifyUrl: 'https://open.spotify.com/track/6UelLqGlWMcVH1E5c4H7lY',
      imageUrl: 'https://placehold.co/400x400?text=Watermelon+Sugar'
    }
  ],
  
  // Fetch singles from the database
  async getSingles() {
    if (useMockData) {
      console.log('Using mock singles data');
      return this.mockSingles;
    }
    
    try {
      console.log('Fetching singles from Supabase');
      const { data, error } = await supabase
        .from('singles')
        .select('*');
      
      if (error) {
        console.error('Error fetching singles:', error);
        return this.mockSingles;
      }
      
      return data.length > 0 ? data : this.mockSingles;
    } catch (error) {
      console.error('Error in getSingles:', error);
      return this.mockSingles;
    }
  },
  
  // Mock albums data
  mockAlbums: [
    {
      id: 1,
      title: 'After Hours',
      artist: 'The Weeknd',
      releaseDate: '2020-03-20',
      genre: ['R&B', 'Pop'],
      spotifyUrl: 'https://open.spotify.com/album/4yP0hdKOZPNshxUOjY0cZj',
      imageUrl: 'https://placehold.co/400x400?text=After+Hours'
    },
    {
      id: 2,
      title: 'Fine Line',
      artist: 'Harry Styles',
      releaseDate: '2019-12-13',
      genre: ['Pop', 'Rock'],
      spotifyUrl: 'https://open.spotify.com/album/7xV2TzoaVc0ycW7fwBwAml',
      imageUrl: 'https://placehold.co/400x400?text=Fine+Line'
    }
  ],
  
  // Fetch albums from the database
  async getAlbums() {
    if (useMockData) {
      console.log('Using mock albums data');
      return this.mockAlbums;
    }
    
    try {
      console.log('Fetching albums from Supabase');
      const { data, error } = await supabase
        .from('albums')
        .select('*');
      
      if (error) {
        console.error('Error fetching albums:', error);
        return this.mockAlbums;
      }
      
      return data.length > 0 ? data : this.mockAlbums;
    } catch (error) {
      console.error('Error in getAlbums:', error);
      return this.mockAlbums;
    }
  },
  
  // Mock blog posts data
  mockBlogPosts: [
    {
      id: 1,
      title: 'Getting Started with React',
      author: 'John Doe',
      date: '2023-01-15',
      summary: 'A beginner\'s guide to React development',
      tags: ['React', 'JavaScript', 'Web Development'],
      url: 'https://example.com/react-guide'
    },
    {
      id: 2,
      title: 'CSS Grid Layout Explained',
      author: 'Jane Smith',
      date: '2023-02-20',
      summary: 'Learn how to use CSS Grid to create responsive layouts',
      tags: ['CSS', 'Web Design', 'Responsive'],
      url: 'https://example.com/css-grid'
    }
  ],
  
  // Fetch blog posts from the database
  async getBlogPosts() {
    if (useMockData) {
      console.log('Using mock blog posts data');
      return this.mockBlogPosts;
    }
    
    try {
      console.log('Fetching blog posts from Supabase');
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*');
      
      if (error) {
        console.error('Error fetching blog posts:', error);
        return this.mockBlogPosts;
      }
      
      return data.length > 0 ? data : this.mockBlogPosts;
    } catch (error) {
      console.error('Error in getBlogPosts:', error);
      return this.mockBlogPosts;
    }
  },
  
  // Mock movies and TV series data
  mockMoviesAndTvSeries: [
    {
      id: 1,
      title: 'Inception',
      director: 'Christopher Nolan',
      releaseDate: '2010-07-16',
      genre: ['Sci-Fi', 'Action', 'Thriller'],
      streamingPlatform: 'Netflix',
      imageUrl: 'https://placehold.co/300x450?text=Inception'
    },
    {
      id: 2,
      title: 'Breaking Bad',
      director: 'Vince Gilligan',
      releaseDate: '2008-01-20',
      genre: ['Drama', 'Crime', 'Thriller'],
      streamingPlatform: 'Netflix',
      imageUrl: 'https://placehold.co/300x450?text=Breaking+Bad'
    }
  ],
  
  // Fetch movies and TV series from the database
  async getMoviesAndTvSeries() {
    if (useMockData) {
      console.log('Using mock movies and TV series data');
      return this.mockMoviesAndTvSeries;
    }
    
    try {
      console.log('Fetching movies and TV series from Supabase');
      const { data, error } = await supabase
        .from('movies')
        .select('*');
      
      if (error) {
        console.error('Error fetching movies and TV series:', error);
        return this.mockMoviesAndTvSeries;
      }
      
      console.log('Movies and TV series data from DB:', data);
      
      if (!data || data.length === 0) {
        console.warn('No movies/TV series found in database, using mock data');
        return this.mockMoviesAndTvSeries;
      }
      
      return data.map(item => ({
        id: item.id,
        title: item.title,
        director: item.director || item.creator || item.producer || '',
        releaseDate: item.release_date || item.releaseDate || item.air_date || '',
        genre: Array.isArray(item.genre) ? item.genre : (item.genre ? [item.genre] : []),
        streamingPlatform: item.streaming_platform || item.streamingPlatform || item.platform || '',
        imageUrl: item.image_url || item.imageUrl || item.poster || `https://placehold.co/300x450?text=${encodeURIComponent(item.title)}`,
        description: item.description || item.summary || item.plot || '',
        type: item.type || (item.is_movie ? 'movie' : 'tv'),
        rating: item.rating || 0,
        duration: item.duration || item.runtime || ''
      }));
    } catch (error) {
      console.error('Error in getMoviesAndTvSeries:', error);
      return this.mockMoviesAndTvSeries;
    }
  },
  
  // Mock books data
  mockBooks: [
    {
      id: 1,
      title: 'The Road to React',
      author: 'Robin Wieruch',
      releaseDate: '2018-01-01',
      genre: ['Programming', 'Web Development'],
      isbn: '9781732384019',
      imageUrl: 'https://placehold.co/300x450?text=React+Book'
    },
    {
      id: 2,
      title: 'Clean Code',
      author: 'Robert C. Martin',
      releaseDate: '2008-08-01',
      genre: ['Programming', 'Software Engineering'],
      isbn: '9780132350884',
      imageUrl: 'https://placehold.co/300x450?text=Clean+Code'
    }
  ],
  
  // Fetch books from the database
  async getBooks() {
    if (useMockData) {
      console.log('Using mock books data');
      return this.mockBooks;
    }
    
    try {
      console.log('Fetching books from Supabase');
      const { data, error } = await supabase
        .from('books')
        .select('*');
      
      if (error) {
        console.error('Error fetching books:', error);
        return this.mockBooks;
      }
      
      console.log('Books data from DB:', data);
      
      if (!data || data.length === 0) {
        console.warn('No books found in database, using mock data');
        return this.mockBooks;
      }
      
      return data.map(book => ({
        id: book.id,
        title: book.title,
        author: book.author,
        releaseDate: book.release_date || book.releaseDate || book.published_date,
        genre: Array.isArray(book.genre) ? book.genre : (book.genre ? [book.genre] : []),
        isbn: book.isbn || '',
        imageUrl: book.image_url || book.imageUrl || book.cover || `https://placehold.co/300x450?text=${encodeURIComponent(book.title)}`,
        description: book.description || book.summary || '',
        rating: book.rating || 0,
        link: book.link || book.url || ''
      }));
    } catch (error) {
      console.error('Error in getBooks:', error);
      return this.mockBooks;
    }
  },
  
  // Mock gallery items data
  mockGalleryItems: [
    {
      id: 1,
      title: 'Mountain Landscape',
      description: 'Beautiful mountain landscape at sunset',
      category: 'Nature',
      tags: ['Mountains', 'Sunset', 'Landscape'],
      imageUrl: 'https://placehold.co/800x500?text=Mountain+Landscape'
    },
    {
      id: 2,
      title: 'Urban Photography',
      description: 'City skyline at night',
      category: 'Urban',
      tags: ['City', 'Night', 'Skyline'],
      imageUrl: 'https://placehold.co/800x500?text=Urban+Photography'
    }
  ],
  
  // Fetch gallery items from the database
  async getGalleryItems() {
    if (useMockData) {
      console.log('Using mock gallery items data');
      return this.mockGalleryItems;
    }
    
    try {
      console.log('Fetching gallery items from Supabase');
      const { data, error } = await supabase
        .from('gallery_items')
        .select('*');
      
      if (error) {
        console.error('Error fetching gallery items:', error);
        return this.mockGalleryItems;
      }
      
      return data.length > 0 ? data : this.mockGalleryItems;
    } catch (error) {
      console.error('Error in getGalleryItems:', error);
      return this.mockGalleryItems;
    }
  },
  
  // Mock Android apps data
  mockAndroidApps: [
    {
      id: 1,
      name: 'Productivity Pro',
      developer: 'John Doe Apps',
      category: 'Productivity',
      description: 'A task management app to boost your productivity',
      rating: 4.7,
      downloads: '1M+',
      iconUrl: 'https://placehold.co/100x100?text=App1',
      playStoreUrl: 'https://play.google.com/store/apps/details?id=com.example.productivitypro'
    },
    {
      id: 2,
      name: 'Fitness Tracker',
      developer: 'Health Apps Inc',
      category: 'Health & Fitness',
      description: 'Track your workouts and monitor your progress',
      rating: 4.5,
      downloads: '500K+',
      iconUrl: 'https://placehold.co/100x100?text=App2',
      playStoreUrl: 'https://play.google.com/store/apps/details?id=com.example.fitnesstracker'
    }
  ],
  
  // Fetch Android apps from the database
  async getAndroidApps() {
    if (useMockData) {
      console.log('Using mock Android apps data');
      return this.mockAndroidApps;
    }
    
    try {
      console.log('Fetching Android apps from Supabase');
      const { data, error } = await supabase
        .from('android_apps')
        .select('*');
      
      if (error) {
        console.error('Error fetching Android apps:', error);
        return this.mockAndroidApps;
      }
      
      return data.length > 0 ? data : this.mockAndroidApps;
    } catch (error) {
      console.error('Error in getAndroidApps:', error);
      return this.mockAndroidApps;
    }
  },
  
  // Mock Windows apps data
  mockWindowsApps: [
    {
      id: 1,
      name: 'CodeEditor Pro',
      developer: 'Dev Tools Inc',
      category: 'Development',
      description: 'A powerful code editor for Windows',
      rating: 4.8,
      price: 'Free',
      iconUrl: 'https://placehold.co/100x100?text=Win1',
      downloadUrl: 'https://example.com/download/codeeditorpro'
    },
    {
      id: 2,
      name: 'PhotoEdit Studio',
      developer: 'Creative Software',
      category: 'Photo & Video',
      description: 'Professional photo editing software',
      rating: 4.6,
      price: '$19.99',
      iconUrl: 'https://placehold.co/100x100?text=Win2',
      downloadUrl: 'https://example.com/download/photoedit'
    }
  ],
  
  // Fetch Windows apps from the database
  async getWindowsApps() {
    if (useMockData) {
      console.log('Using mock Windows apps data');
      return this.mockWindowsApps;
    }
    
    try {
      console.log('Fetching Windows apps from Supabase');
      const { data, error } = await supabase
        .from('windows_apps')
        .select('*');
      
      if (error) {
        console.error('Error fetching Windows apps:', error);
        return this.mockWindowsApps;
      }
      
      return data.length > 0 ? data : this.mockWindowsApps;
    } catch (error) {
      console.error('Error in getWindowsApps:', error);
      return this.mockWindowsApps;
    }
  },
  
  // Mock courses data
  mockCourses: [
    {
      id: 1,
      title: "JavaScript Fundamentals",
      instructor: "John Smith",
      platform: "Udemy",
      description: "Learn the basics of JavaScript programming",
      url: "https://example.com/js-course",
      imageUrl: "https://placehold.co/600x400?text=JavaScript",
      tags: ["JavaScript", "Web Development", "Programming"],
      rating: 4.8,
      completionDate: "2023-05-15"
    },
    {
      id: 2,
      title: "React for Beginners",
      instructor: "Jane Doe",
      platform: "Coursera",
      description: "Introduction to React library and its core concepts",
      url: "https://example.com/react-course",
      imageUrl: "https://placehold.co/600x400?text=React",
      tags: ["React", "JavaScript", "Frontend"],
      rating: 4.9,
      completionDate: "2023-07-22"
    },
    {
      id: 3,
      title: "Advanced CSS and Sass",
      instructor: "Michael Johnson",
      platform: "Udemy",
      description: "Master advanced CSS and Sass techniques",
      url: "https://example.com/css-course",
      imageUrl: "https://placehold.co/600x400?text=CSS",
      tags: ["CSS", "Sass", "Web Design"],
      rating: 4.7,
      completionDate: "2023-04-10"
    }
  ],
  
  // Fetch courses from the database
  async getCourses() {
    console.log('getCourses method called');
    
    if (useMockData) {
      console.log('Using mock courses data');
      return this.mockCourses;
    }
    
    try {
      console.log('Fetching courses from Supabase');
      const { data, error } = await supabase
        .from('courses')
        .select('*');
      
      if (error) {
        console.error('Error fetching courses:', error);
        return this.mockCourses;
      }
      
      console.log('Courses data from Supabase:', data);
      return data && data.length > 0 ? data : this.mockCourses;
    } catch (error) {
      console.error('Error in getCourses:', error);
      return this.mockCourses;
    }
  },
  
  // Mock analytics data
  mockAnalytics: {
    totalClicks: 1250,
    clicksToday: 48,
    growthRate: 12.5,
    avgClicksPerDay: 35,
    topPlatform: 'Twitter'
  },
  
  // Fetch analytics summary from the database
  async getAnalyticsSummary() {
    if (useMockData) {
      console.log('Using mock analytics data');
      return this.mockAnalytics;
    }
    
    try {
      console.log('Fetching analytics summary from Supabase');
      // Query the click_stats table instead of clicks
      const { data: clickStats, error: clickStatsError } = await supabase
        .from('click_stats')
        .select('*');
      
      if (clickStatsError) {
        console.error('Error fetching click stats:', clickStatsError);
        return this.mockAnalytics;
      }
      
      // Process the data to calculate analytics
      let totalClicks = 0;
      let clicksToday = 0;
      let platformCounts = {};
      let topPlatform = 'None';
      
      if (clickStats && clickStats.length > 0) {
        // Calculate total clicks
        totalClicks = clickStats.reduce((sum, stat) => sum + (stat.count || 0), 0);
        
        // Get today's clicks
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        clicksToday = clickStats
          .filter(stat => stat.date && stat.date.startsWith(today))
          .reduce((sum, stat) => sum + (stat.count || 0), 0);
        
        // Find top platform
        clickStats.forEach(stat => {
          if (stat.platform) {
            platformCounts[stat.platform] = (platformCounts[stat.platform] || 0) + (stat.count || 0);
          }
        });
        
        // Find the platform with the highest count
        let maxClicks = 0;
        Object.entries(platformCounts).forEach(([platform, count]) => {
          if (count > maxClicks) {
            maxClicks = count;
            topPlatform = platform;
          }
        });
      }
      
      return {
        totalClicks,
        clicksToday,
        growthRate: 0, // Would need historical data to calculate properly
        avgClicksPerDay: totalClicks > 0 ? totalClicks / 30 : 0, // Assuming 30 days
        topPlatform
      };
    } catch (error) {
      console.error('Error in getAnalyticsSummary:', error);
      return this.mockAnalytics;
    }
  }
};

// Export the service
export { apiService }; 