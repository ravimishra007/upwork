import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { sendEmail } from "./utils/sendgrid2";
import fs from "fs";
import path from "path";

export async function registerRoutes(app: Express): Promise<Server> {
  // Dataset API endpoints
  app.get('/api/datasets/singles', async (req, res) => {
    try {
      const singles = await storage.getSingles();
      res.json(singles);
    } catch (error) {
      console.error('Error fetching singles:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch singles' });
    }
  });
  
  app.get('/api/datasets/albums', async (req, res) => {
    try {
      const albums = await storage.getAlbums();
      res.json(albums);
    } catch (error) {
      console.error('Error fetching albums:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch albums' });
    }
  });
  
  app.get('/api/datasets/movies-tv-series', async (req, res) => {
    try {
      const moviesAndTvSeries = await storage.getMoviesAndTvSeries();
      res.json(moviesAndTvSeries);
    } catch (error) {
      console.error('Error fetching movies and TV series:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch movies and TV series' });
    }
  });
  
  app.get('/api/datasets/books', async (req, res) => {
    try {
      const books = await storage.getBooks();
      res.json(books);
    } catch (error) {
      console.error('Error fetching books:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch books' });
    }
  });
  
  app.get('/api/datasets/reading-resources', async (req, res) => {
    try {
      const readingResources = await storage.getReadingResources();
      res.json(readingResources);
    } catch (error) {
      console.error('Error fetching reading resources:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch reading resources' });
    }
  });
  
  app.get('/api/datasets/courses', async (req, res) => {
    try {
      const courses = await storage.getCourses();
      res.json(courses);
    } catch (error) {
      console.error('Error fetching courses:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch courses' });
    }
  });
  
  app.get('/api/datasets/blog-posts', async (req, res) => {
    try {
      const blogPosts = await storage.getBlogPosts();
      res.json(blogPosts);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch blog posts' });
    }
  });
  
  // Add single blog post endpoint
  app.get('/api/datasets/blog-posts/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid blog post ID' });
      }
      
      const blogPosts = await storage.getBlogPosts();
      const blogPost = blogPosts.find(post => post.id === id);
      
      if (!blogPost) {
        return res.status(404).json({ message: 'Blog post not found' });
      }
      
      res.json(blogPost);
    } catch (error) {
      console.error('Error fetching blog post:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch blog post' });
    }
  });
  
  app.get('/api/datasets/gallery-items', async (req, res) => {
    try {
      const galleryItems = await storage.getGalleryItems();
      res.json(galleryItems);
    } catch (error) {
      console.error('Error fetching gallery items:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch gallery items' });
    }
  });
  
  app.get('/api/datasets/android-apps', async (req, res) => {
    try {
      const androidApps = await storage.getAndroidApps();
      res.json(androidApps);
    } catch (error) {
      console.error('Error fetching Android apps:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch Android apps' });
    }
  });
  
  app.get('/api/datasets/windows-apps', async (req, res) => {
    try {
      const windowsApps = await storage.getWindowsApps();
      res.json(windowsApps);
    } catch (error) {
      console.error('Error fetching Windows apps:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch Windows apps' });
    }
  });
  // Endpoint to reorder social links
  app.post('/api/social-links/reorder', async (req, res) => {
    try {
      const { linkOrder } = req.body;
      
      if (!Array.isArray(linkOrder)) {
        return res.status(400).json({ message: 'linkOrder must be an array of link IDs with new orders' });
      }
      
      // Update each link with its new order
      const updatePromises = linkOrder.map(async (item: { id: number, order: number }) => {
        return await storage.updateSocialLink(item.id, { order: item.order });
      });
      
      await Promise.all(updatePromises);
      
      // Get updated links
      const updatedLinks = await storage.getSocialLinks();
      
      res.json({ 
        success: true, 
        message: 'Links reordered successfully',
        links: updatedLinks
      });
    } catch (error) {
      console.error('Error reordering links:', error);
      res.status(500).json({ success: false, message: 'Failed to reorder links' });
    }
  });
  // User data API endpoint
  app.get('/api/user-data', async (req, res) => {
    try {
      // Get the social links from storage
      const socialLinks = await storage.getSocialLinks();
      
      // Return user data with social links
      const userData = {
        name: "Stanislav Nikov",
        bio: "Web developer & graphic designer passionate about creative solutions",
        location: "📍 Germany",
        profileImage: "/profile-photo.jpg",
        socialLinks: socialLinks.map(link => ({
          id: link.id,
          platform: link.platform,
          name: link.name,
          username: link.username,
          url: link.url,
          order: link.order,
          active: link.active
        }))
      };
      
      res.json(userData);
    } catch (error) {
      console.error('Error fetching user data:', error);
      res.status(500).json({ message: 'Failed to fetch user data' });
    }
  });

  // Click tracking API endpoint
  app.post('/api/click-tracking', async (req, res) => {
    try {
      const { platform, url, timestamp } = req.body;
      
      // Find the link ID based on the URL
      const links = await storage.getSocialLinks();
      const link = links.find(l => l.url === url);
      
      if (link) {
        // Record the click in storage
        const clickData = await storage.recordClick({
          linkId: link.id,
          timestamp: timestamp
        });
        
        console.log(`Click tracked: ${platform} - ${url} at ${timestamp}`);
        
        // Return the new click data to help client update their state if needed
        res.status(200).json({ 
          success: true,
          clickData,
          message: 'Click tracked successfully',
          timestamp: new Date().toISOString()
        });
      } else {
        console.warn(`Link not found for URL: ${url}`);
        res.status(404).json({ 
          success: false, 
          message: 'Link not found for tracking',
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Error tracking click:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to track click',
        timestamp: new Date().toISOString()
      });
    }
  });
  
  // Analytics API endpoints
  
  // Get total clicks by platform
  app.get('/api/analytics/by-platform', async (req, res) => {
    try {
      const platformStats = await storage.getClicksGroupedByPlatform();
      res.json(platformStats);
    } catch (error) {
      console.error('Error getting platform stats:', error);
      res.status(500).json({ message: 'Failed to get platform statistics' });
    }
  });
  
  // Get clicks by day (default last 14 days)
  app.get('/api/analytics/by-day', async (req, res) => {
    try {
      let days = 14; // Default
      
      // Allow specifying the number of days
      if (req.query.days && !isNaN(Number(req.query.days))) {
        days = Number(req.query.days);
      }
      
      const dailyStats = await storage.getClicksGroupedByDay(days);
      res.json(dailyStats);
    } catch (error) {
      console.error('Error getting daily stats:', error);
      res.status(500).json({ message: 'Failed to get daily statistics' });
    }
  });
  
  // Get all click data - useful for custom analytics
  app.get('/api/analytics/clicks', async (req, res) => {
    try {
      // Allow filtering by link ID
      const linkId = req.query.linkId ? Number(req.query.linkId) : undefined;
      const clicks = await storage.getClickStats(linkId);
      
      // Get links to include platform data
      const links = await storage.getSocialLinks();
      
      // Join clicks with link data
      const clicksWithData = clicks.map(click => {
        const link = links.find(l => l.id === click.linkId);
        return {
          ...click,
          platform: link ? link.platform : 'unknown',
          name: link ? link.name : 'Unknown',
          url: link ? link.url : '#'
        };
      });
      
      res.json(clicksWithData);
    } catch (error) {
      console.error('Error getting click data:', error);
      res.status(500).json({ message: 'Failed to get click data' });
    }
  });
  
  // Get analytics summary
  app.get('/api/analytics/summary', async (req, res) => {
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
      
      res.json({
        totalClicks,
        clicksToday,
        growthRate,
        avgClicksPerDay,
        topPlatform: {
          name: topPlatform.platform,
          count: topPlatform.count
        },
        isPublic: true // Always public
      });
    } catch (error) {
      console.error('Error getting analytics summary:', error);
      res.status(500).json({ message: 'Failed to get analytics summary' });
    }
  });
  
  // Reset analytics data
  app.post('/api/analytics/reset', async (req, res) => {
    try {
      const success = await storage.resetAnalytics();
      if (success) {
        res.json({ success: true, message: 'Analytics data has been reset' });
      } else {
        res.status(500).json({ success: false, message: 'Failed to reset analytics data' });
      }
    } catch (error) {
      console.error('Error resetting analytics:', error);
      res.status(500).json({ success: false, message: 'Failed to reset analytics data' });
    }
  });
  
  // Get analytics visibility setting
  app.get('/api/analytics/visibility', async (req, res) => {
    try {
      const isPublic = await storage.getAnalyticsVisibility();
      res.json({ isPublic });
    } catch (error) {
      console.error('Error getting analytics visibility:', error);
      res.status(500).json({ message: 'Failed to get analytics visibility setting' });
    }
  });
  
  // Update analytics visibility setting
  app.post('/api/analytics/visibility', async (req, res) => {
    try {
      const { isPublic } = req.body;
      if (typeof isPublic !== 'boolean') {
        return res.status(400).json({ message: 'isPublic must be a boolean value' });
      }
      
      const success = await storage.setAnalyticsVisibility(isPublic);
      if (success) {
        res.json({ success: true, isPublic });
      } else {
        res.status(500).json({ success: false, message: 'Failed to update visibility setting' });
      }
    } catch (error) {
      console.error('Error updating analytics visibility:', error);
      res.status(500).json({ message: 'Failed to update analytics visibility setting' });
    }
  });
  
  // Export analytics to CSV
  app.get('/api/analytics/export', async (req, res) => {
    try {
      // Get all click data with platform information
      const clicks = await storage.getClickStats();
      const links = await storage.getSocialLinks();
      
      // Join clicks with platform data
      const clicksWithPlatform = clicks.map(click => {
        const link = links.find(l => l.id === click.linkId);
        const platform = link ? link.platform : 'unknown';
        const date = new Date(click.timestamp).toISOString().split('T')[0];
        const time = new Date(click.timestamp).toTimeString().split(' ')[0];
        
        return {
          date,
          time,
          platform,
          url: link ? link.url : '',
          linkId: click.linkId,
          clickId: click.id
        };
      });
      
      // Create CSV header
      const csvHeader = 'Date,Time,Platform,URL,Link ID,Click ID\n';
      
      // Create CSV rows
      const csvRows = clicksWithPlatform.map(click => 
        `${click.date},${click.time},${click.platform},${click.url},${click.linkId},${click.clickId}`
      ).join('\n');
      
      // Complete CSV content
      const csvContent = csvHeader + csvRows;
      
      // Set headers for file download
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=analytics_export.csv');
      
      // Send CSV content
      res.send(csvContent);
    } catch (error) {
      console.error('Error exporting analytics:', error);
      res.status(500).json({ message: 'Failed to export analytics data' });
    }
  });
  
  // Send CV via email
  app.post('/api/send-cv', async (req, res) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ 
          success: false, 
          message: 'Email address is required' 
        });
      }
      
      // Check if SendGrid API key is available
      if (!process.env.SENDGRID_API_KEY) {
        return res.status(500).json({ 
          success: false, 
          message: 'Email service is not configured' 
        });
      }
      
      // Get the CV file as base64
      const cvPath = path.join(process.cwd(), 'public', 'StanislavNikovCV2023.pdf');
      
      // Check if file exists
      if (!fs.existsSync(cvPath)) {
        return res.status(404).json({ 
          success: false, 
          message: 'CV file not found' 
        });
      }
      
      // Read file as base64
      const cvFile = fs.readFileSync(cvPath);
      const cvBase64 = cvFile.toString('base64');
      
      // Send email with SendGrid
      const emailSent = await sendEmail({
        to: email,
        from: 'contact@stanislavnikov.com', // Update with your email
        subject: 'Stanislav Nikov - CV',
        text: 'Please find attached my CV. Thank you for your interest!',
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2>Thank you for your interest!</h2>
            <p>I've attached my CV for your review.</p>
            <p>Feel free to contact me if you have any questions.</p>
            <p>Best regards,<br>Stanislav Nikov</p>
          </div>
        `,
        attachments: [
          {
            content: cvBase64,
            filename: 'StanislavNikovCV2023.pdf',
            type: 'application/pdf',
            disposition: 'attachment'
          }
        ]
      });
      
      if (emailSent) {
        res.json({ 
          success: true, 
          message: 'CV sent successfully to your email' 
        });
      } else {
        res.status(500).json({ 
          success: false, 
          message: 'Failed to send CV. Please try again later.' 
        });
      }
    } catch (error) {
      console.error('Error sending CV via email:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to send CV. Please try again later.' 
      });
    }
  });

  // Movie data API endpoints
  app.get('/api/movies', async (req, res) => {
    try {
      const type = req.query.type as 'movie' | 'book' | undefined;
      const movies = await storage.getMovies(type);
      res.json(movies);
    } catch (error) {
      console.error('Error getting movies:', error);
      res.status(500).json({ message: 'Failed to fetch movies data' });
    }
  });

  app.get('/api/movies/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid movie ID' });
      }
      
      const movie = await storage.getMovie(id);
      if (!movie) {
        return res.status(404).json({ message: 'Movie not found' });
      }
      
      res.json(movie);
    } catch (error) {
      console.error('Error getting movie details:', error);
      res.status(500).json({ message: 'Failed to fetch movie data' });
    }
  });

  // Music data API endpoints
  app.get('/api/music', async (req, res) => {
    try {
      const type = req.query.type as 'song' | 'album' | undefined;
      const music = await storage.getMusic(type);
      res.json(music);
    } catch (error) {
      console.error('Error getting music:', error);
      res.status(500).json({ message: 'Failed to fetch music data' });
    }
  });

  app.get('/api/music/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid music ID' });
      }
      
      const music = await storage.getMusicById(id);
      if (!music) {
        return res.status(404).json({ message: 'Music not found' });
      }
      
      res.json(music);
    } catch (error) {
      console.error('Error getting music details:', error);
      res.status(500).json({ message: 'Failed to fetch music data' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
