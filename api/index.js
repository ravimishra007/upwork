import { storage } from './db.js';

// Standalone serverless function for Vercel
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  try {
    // User data API endpoint
    if (req.url.includes('/api/user-data')) {
      try {
        const socialLinks = await storage.getSocialLinks();
        const userData = {
          name: "Stanislav Nikov",
          bio: "Web developer & graphic designer passionate about creative solutions",
          location: "📍 Germany",
          profileImage: "/profile-photo.jpg",
          socialLinks: socialLinks
        };
        return res.json(userData);
  } catch (error) {
        console.error('Error fetching user data:', error);
        return res.status(500).json({ message: 'Failed to fetch user data' });
      }
    }
    
    // Dataset API endpoints
    if (req.url.includes('/api/datasets/singles')) {
      try {
        const singles = await storage.getSingles();
        return res.json(singles);
    } catch (error) {
        console.error('Error fetching singles:', error);
        return res.status(500).json({ success: false, message: 'Failed to fetch singles' });
      }
    }
    
    if (req.url.includes('/api/datasets/albums')) {
      try {
        const albums = await storage.getAlbums();
        return res.json(albums);
    } catch (error) {
        console.error('Error fetching albums:', error);
        return res.status(500).json({ success: false, message: 'Failed to fetch albums' });
      }
    }
    
    if (req.url.includes('/api/datasets/blog-posts')) {
      try {
        const blogPosts = await storage.getBlogPosts();
        return res.json(blogPosts);
    } catch (error) {
        console.error('Error fetching blog posts:', error);
        return res.status(500).json({ success: false, message: 'Failed to fetch blog posts' });
      }
    }
    
    if (req.url.includes('/api/datasets/movies-tv-series')) {
      try {
        const moviesAndTvSeries = await storage.getMoviesAndTvSeries();
        return res.json(moviesAndTvSeries);
    } catch (error) {
        console.error('Error fetching movies and TV series:', error);
        return res.status(500).json({ success: false, message: 'Failed to fetch movies and TV series' });
      }
    }
    
    if (req.url.includes('/api/datasets/books')) {
      try {
        const books = await storage.getBooks();
        return res.json(books);
    } catch (error) {
        console.error('Error fetching books:', error);
        return res.status(500).json({ success: false, message: 'Failed to fetch books' });
      }
    }
    
    if (req.url.includes('/api/datasets/gallery-items')) {
      try {
        const galleryItems = await storage.getGalleryItems();
        return res.json(galleryItems);
    } catch (error) {
        console.error('Error fetching gallery items:', error);
        return res.status(500).json({ success: false, message: 'Failed to fetch gallery items' });
      }
    }
    
    if (req.url.includes('/api/datasets/android-apps')) {
      try {
        const androidApps = await storage.getAndroidApps();
        return res.json(androidApps);
    } catch (error) {
        console.error('Error fetching Android apps:', error);
        return res.status(500).json({ success: false, message: 'Failed to fetch Android apps' });
      }
    }
    
    if (req.url.includes('/api/datasets/windows-apps')) {
      try {
        const windowsApps = await storage.getWindowsApps();
        return res.json(windowsApps);
    } catch (error) {
        console.error('Error fetching Windows apps:', error);
        return res.status(500).json({ success: false, message: 'Failed to fetch Windows apps' });
      }
    }
    
    // Analytics API endpoints
    if (req.url.includes('/api/analytics/summary')) {
    try {
      const clicks = await storage.getClickStats();
      const platformStats = await storage.getClicksGroupedByPlatform();
        const dailyStats = await storage.getClicksGroupedByDay(7); // Last 7 days
        
        // Calculate total clicks
      const totalClicks = clicks.length;
        
        // Calculate top platform
        const topPlatform = platformStats.length > 0 ? platformStats[0] : { platform: 'none', count: 0 };
        
        // Calculate clicks today
        const today = new Date().toISOString().split('T')[0];
        const clicksToday = dailyStats.find(d => d.date === today)?.count || 0;
        
        // Calculate click growth (compare today with yesterday)
        const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        const clicksYesterday = dailyStats.find(d => d.date === yesterdayStr)?.count || 0;
        
        const growthRate = clicksYesterday === 0 
          ? 100 // If no clicks yesterday, show 100% growth
          : Math.round(((clicksToday - clicksYesterday) / clicksYesterday) * 100);
        
        // Calculate average clicks per day
      const last7DaysClicks = dailyStats.reduce((sum, day) => sum + day.count, 0);
      const avgClicksPerDay = Math.round(last7DaysClicks / 7);
        
        return res.json({
        totalClicks,
        clicksToday,
        growthRate,
        avgClicksPerDay,
        topPlatform: {
          name: topPlatform.platform,
          count: topPlatform.count
        },
        isPublic: true
      });
    } catch (error) {
        console.error('Error getting analytics summary:', error);
        return res.status(500).json({ message: 'Failed to get analytics summary' });
      }
    }
    
    // Health check endpoint
    if (req.url.includes('/api/health')) {
      return res.json({
        status: 'ok',
        timestamp: new Date().toISOString()
      });
    }
    
    // Default response for all other API routes
    return res.json({
      message: 'API endpoint not implemented yet',
      path: req.url,
      method: req.method,
      timestamp: new Date().toISOString()
    });
    } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ 
      message: 'Server error',
      error: error.message
    });
  }
} 