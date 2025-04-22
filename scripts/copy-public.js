import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Create public directory if it doesn't exist
const publicDir = path.join(rootDir, 'public');
const distPublicDir = path.join(rootDir, 'dist/public');

if (!fs.existsSync(publicDir)) {
  console.log('Creating public directory...');
  fs.mkdirSync(publicDir);
}

// Function to recursively copy directory
function copyDir(src, dest) {
  // Create destination directory if it doesn't exist
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  // Read all files in the source directory
  const files = fs.readdirSync(src, { withFileTypes: true });
  
  // Copy each file/directory
  for (const file of files) {
    const srcPath = path.join(src, file.name);
    const destPath = path.join(dest, file.name);
    
    if (file.isDirectory()) {
      // Recursively copy subdirectories
      copyDir(srcPath, destPath);
    } else {
      // Copy file
      fs.copyFileSync(srcPath, destPath);
      console.log(`Copied: ${srcPath} -> ${destPath}`);
    }
  }
}

// Check if dist/public exists and copy its contents to public
if (fs.existsSync(distPublicDir)) {
  console.log('Copying files from dist/public to public...');
  copyDir(distPublicDir, publicDir);
  console.log('Copy completed successfully!');
} else {
  console.log('Warning: dist/public directory does not exist. Nothing to copy.');
} 