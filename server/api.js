// Server entry point for Vercel
import express from 'express';
import dotenv from 'dotenv';
import { registerRoutes } from './routes.ts';
import { createServer } from 'http';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add CORS headers
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Example data endpoint
app.get('/api/user-data', (req, res) => {
  res.json({
    message: 'API is working!',
    user: {
      id: 1,
      name: 'Test User',
      email: 'test@example.com'
    }
  });
});

// Default API response
app.all('/api/*', (req, res) => {
  res.json({
    message: 'API endpoint working! Add more routes as needed.',
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString()
  });
});

// Register all routes from routes.ts
if (process.env.NODE_ENV !== 'production') {
  // For local development, create and start HTTP server
  registerRoutes(app).then(server => {
    server.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  });
} else {
  // For production (Vercel), just register routes
  registerRoutes(app).catch(err => {
    console.error('Failed to register routes:', err);
  });
}

// Export for Vercel
export default app; 