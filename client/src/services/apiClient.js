import { apiService } from './databaseService';

// This file intercepts all API calls and routes them to the database service
// instead of making actual API calls to the server

class ApiClient {
  constructor(baseUrl = '') {
    this.baseUrl = baseUrl;
    console.log('ApiClient initialized');
    // Log available methods for debugging
    console.log('Available apiService methods:', Object.keys(apiService));
  }

  /**
   * Extract URL parts and query parameters
   */
  parseUrl(url) {
    const [path, queryString] = url.split('?');
    const params = {};
    
    if (queryString) {
      queryString.split('&').forEach(param => {
        const [key, value] = param.split('=');
        params[key] = value;
      });
    }
    
    return { path, params };
  }

  /**
   * Route API calls to the appropriate database service method
   */
  async fetchFromDb(url) {
    console.log('Fetching from DB:', url);
    
    try {
      // Special case for user data to ensure it works
      if (url.includes('/api/user-data')) {
        const userData = await apiService.getUserData();
        console.log('User data fetched successfully:', userData);
        return userData;
      }
      
      // Parse URL to extract path and query parameters
      const { path, params } = this.parseUrl(url);
      
      // Check if apiService is properly loaded
      if (!apiService) {
        console.error('apiService is not defined or imported correctly');
        throw new Error('Database service not available');
      }
      
      // Handle standard API endpoints
      if (path.endsWith('/api/datasets/singles')) {
        return await apiService.getSingles();
      } else if (path.endsWith('/api/datasets/albums')) {
        return await apiService.getAlbums();
      } else if (path.endsWith('/api/datasets/blog-posts')) {
        return await apiService.getBlogPosts();
      } else if (path.endsWith('/api/datasets/movies-tv-series')) {
        return await apiService.getMoviesAndTvSeries();
      } else if (path.endsWith('/api/datasets/books')) {
        return await apiService.getBooks();
      } else if (path.endsWith('/api/datasets/gallery-items')) {
        return await apiService.getGalleryItems();
      } else if (path.endsWith('/api/datasets/android-apps')) {
        return await apiService.getAndroidApps();
      } else if (path.endsWith('/api/datasets/windows-apps')) {
        return await apiService.getWindowsApps();
      } else if (path.endsWith('/api/datasets/courses')) {
        return await apiService.getCourses();
      } else if (path.endsWith('/api/analytics/summary')) {
        return await apiService.getAnalyticsSummary();
      } else if (path.endsWith('/api/health')) {
        return { status: 'ok', timestamp: new Date().toISOString() };
      } 
      
      // Handle non-standard routes with query parameters
      else if (path === '/music' || path === '/api/music') {
        if (params.type === 'song') {
          // Use singles for song type
          return await apiService.getSingles();
        } else if (params.type === 'album') {
          return await apiService.getAlbums();
        } else {
          // Default to singles if no type specified
          return await apiService.getSingles();
        }
      } else if (path === '/api/movies') {
        if (params.type === 'book') {
          // If type=book, return books data
          console.log('Fetching books for /api/movies?type=book');
          return await apiService.getBooks();
        } else if (params.type === 'movie' || params.type === 'tv') {
          return await apiService.getMoviesAndTvSeries();
        } else {
          return await apiService.getMoviesAndTvSeries();
        }
      } else {
        console.warn('Unhandled URL in fetchFromDb:', url);
        console.warn('Checking if we can deduce the correct data type from URL parts');
        
        // Try to determine data type from path segments
        if (url.includes('movie') || url.includes('tv')) {
          return await apiService.getMoviesAndTvSeries();
        } else if (url.includes('song') || url.includes('music') || url.includes('audio')) {
          return await apiService.getSingles();
        } else if (url.includes('album')) {
          return await apiService.getAlbums();
        } else if (url.includes('book')) {
          return await apiService.getBooks();
        } else if (url.includes('blog') || url.includes('post')) {
          return await apiService.getBlogPosts();
        } else if (url.includes('gallery') || url.includes('image')) {
          return await apiService.getGalleryItems();
        } else if (url.includes('android')) {
          return await apiService.getAndroidApps();
        } else if (url.includes('windows') || url.includes('desktop')) {
          return await apiService.getWindowsApps();
        } else if (url.includes('course')) {
          return await apiService.getCourses();
        }
        
        // If we still can't determine, return null
        console.error('Could not determine data type from URL:', url);
        return null;
      }
    } catch (error) {
      console.error(`Error in fetchFromDb for ${url}:`, error);
      console.error('Error stack:', error.stack);
      
      // Return empty results based on endpoint type
      if (url.includes('/api/user-data')) {
        return {
          name: 'User',
          bio: 'Profile information unavailable',
          location: '',
          profileImage: '/images/profile.jpg',
          socialLinks: []
        };
      } else if (url.includes('/api/analytics')) {
        return {
          totalClicks: 0,
          clicksToday: 0,
          growthRate: 0,
          avgClicksPerDay: 0,
          topPlatform: 'None'
        };
      } else if (url.includes('/api/health')) {
        return { status: 'error', timestamp: new Date().toISOString() };
      } else if (url.includes('movie') || url.includes('tv')) {
        return apiService.mockMoviesAndTvSeries;
      } else if (url.includes('music') || url.includes('song')) {
        return apiService.mockSingles;
      } else {
        // For dataset endpoints
        return [];
      }
    }
  }

  /**
   * Make a GET request to the API
   */
  async get(url) {
    try {
      console.log(`API GET: ${url}`);
      const result = await this.fetchFromDb(url);
      console.log(`API GET result for ${url}:`, result);
      return result;
    } catch (error) {
      console.error(`Error in API GET to ${url}:`, error);
      console.error('Error stack:', error.stack);
      // Return empty results
      if (url.includes('/api/user-data')) {
        return {
          name: 'User',
          bio: 'Profile information unavailable',
          location: '',
          profileImage: '/images/profile.jpg',
          socialLinks: []
        };
      } else if (url.includes('movie') || url.includes('tv')) {
        return apiService.mockMoviesAndTvSeries;
      } else if (url.includes('music') || url.includes('song')) {
        return apiService.mockSingles;
      } else {
        return [];
      }
    }
  }

  /**
   * Make a POST request to the API
   */
  async post(url, data) {
    // Not implemented yet - would send POST to the API
    console.warn('POST requests are not implemented yet - using direct DB connection');
    console.log(`API POST to ${url} with data:`, data);
    return {};
  }

  /**
   * Make a PUT request to the API
   */
  async put(url, data) {
    // Not implemented yet - would send PUT to the API
    console.warn('PUT requests are not implemented yet - using direct DB connection');
    console.log(`API PUT to ${url} with data:`, data);
    return {};
  }

  /**
   * Make a DELETE request to the API
   */
  async delete(url) {
    // Not implemented yet - would send DELETE to the API
    console.warn('DELETE requests are not implemented yet - using direct DB connection');
    console.log(`API DELETE: ${url}`);
    return {};
  }
}

const apiClient = new ApiClient();
export default apiClient;
export { apiClient }; 