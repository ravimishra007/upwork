import { Client } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL;

// Create a connection to the database
export async function query(sql, params = []) {
  const client = new Client(connectionString);
  
  try {
    await client.connect();
    const result = await client.query(sql, params);
    return result.rows;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  } finally {
    await client.end();
  }
}

// Basic storage functions
export const storage = {
  // User data
  async getSocialLinks() {
    return await query('SELECT * FROM social_links ORDER BY "order" ASC');
  },
  
  // Datasets
  async getSingles() {
    return await query('SELECT * FROM singles ORDER BY id ASC');
  },
  
  async getAlbums() {
    return await query('SELECT * FROM albums ORDER BY id ASC');
  },
  
  async getBlogPosts() {
    return await query('SELECT * FROM blog_posts ORDER BY id DESC');
  },
  
  async getMoviesAndTvSeries() {
    return await query('SELECT * FROM movies_tv_series ORDER BY id ASC');
  },
  
  async getBooks() {
    return await query('SELECT * FROM books ORDER BY id ASC');
  },
  
  async getGalleryItems() {
    return await query('SELECT * FROM gallery_items ORDER BY id ASC');
  },
  
  async getAndroidApps() {
    return await query('SELECT * FROM android_apps ORDER BY id ASC');
  },
  
  async getWindowsApps() {
    return await query('SELECT * FROM windows_apps ORDER BY id ASC');
  },
  
  // Analytics
  async getClickStats(linkId) {
    const sql = linkId 
      ? 'SELECT * FROM clicks WHERE link_id = $1 ORDER BY timestamp DESC' 
      : 'SELECT * FROM clicks ORDER BY timestamp DESC';
    const params = linkId ? [linkId] : [];
    return await query(sql, params);
  },
  
  async getClicksGroupedByPlatform() {
    const sql = `
      SELECT l.platform, COUNT(c.id) as count
      FROM clicks c
      JOIN social_links l ON c.link_id = l.id
      GROUP BY l.platform
      ORDER BY count DESC
    `;
    return await query(sql);
  },
  
  async getClicksGroupedByDay(days = 14) {
    const sql = `
      SELECT TO_CHAR(c.timestamp::date, 'YYYY-MM-DD') as date, COUNT(c.id) as count
      FROM clicks c
      WHERE c.timestamp >= NOW() - INTERVAL '${days} days'
      GROUP BY date
      ORDER BY date ASC
    `;
    return await query(sql);
  }
}; 