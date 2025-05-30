/**
 * Asset copy script for Yunnan Taste Mini-Program
 * Ensures all static assets are copied to the dist directory during build
 */

const fs = require('fs');
const path = require('path');

// Source and destination directories
const SRC_DIR = path.resolve(__dirname, '../src');
const DIST_DIR = path.resolve(__dirname, '../dist');
const ASSETS_DIR = path.resolve(SRC_DIR, 'assets');
const DIST_ASSETS_DIR = path.resolve(DIST_DIR, 'assets');
const ROOT_DIR = path.resolve(__dirname, '..');
const GENERATED_ICONS_DIR = ROOT_DIR;

// Create assets directory in dist if it doesn't exist
if (!fs.existsSync(DIST_ASSETS_DIR)) {
  fs.mkdirSync(DIST_ASSETS_DIR, { recursive: true });
  console.log('Created assets directory in dist');
}

// Create icons directory in dist/assets if it doesn't exist
const DIST_ICONS_DIR = path.resolve(DIST_ASSETS_DIR, 'icons');
if (!fs.existsSync(DIST_ICONS_DIR)) {
  fs.mkdirSync(DIST_ICONS_DIR, { recursive: true });
  console.log('Created icons directory in dist/assets');
}

// Copy all assets from src/assets to dist/assets if src/assets exists
if (fs.existsSync(ASSETS_DIR)) {
  copyFolderRecursive(ASSETS_DIR, DIST_ASSETS_DIR);
  console.log('Copied assets from src/assets to dist/assets');
} else {
  console.log('No src/assets directory found, creating empty structure');
}

// Copy generated Bioluminescent Forest themed icons to dist/assets/icons
const iconFiles = [
  { src: 'home_icon_normal.png', dest: 'home.png' },
  { src: 'home_icon_active.png', dest: 'home-active.png' },
  { src: 'category_icon_normal.png', dest: 'category.png' },
  { src: 'category_icon_active.png', dest: 'category-active.png' },
  { src: 'search_icon_normal.png', dest: 'search.png' },
  { src: 'search_icon_active.png', dest: 'search-active.png' },
  { src: 'user_icon_normal.png', dest: 'user.png' },
  { src: 'user_icon_active.png', dest: 'user-active.png' }
];

iconFiles.forEach(icon => {
  const sourcePath = path.join(GENERATED_ICONS_DIR, icon.src);
  const destPath = path.join(DIST_ICONS_DIR, icon.dest);
  
  if (fs.existsSync(sourcePath)) {
    fs.copyFileSync(sourcePath, destPath);
    console.log(`Copied icon: ${sourcePath} -> ${destPath}`);
  } else {
    console.log(`Warning: Icon file not found: ${sourcePath}`);
  }
});

// Function to copy a folder recursively
function copyFolderRecursive(source, destination) {
  // Check if source is a directory
  if (fs.statSync(source).isDirectory()) {
    // Create destination directory if it doesn't exist
    if (!fs.existsSync(destination)) {
      fs.mkdirSync(destination, { recursive: true });
    }

    // Get all files and folders in the source directory
    const files = fs.readdirSync(source);

    // Copy each file/folder to the destination
    files.forEach(file => {
      const sourcePath = path.join(source, file);
      const destPath = path.join(destination, file);

      if (fs.statSync(sourcePath).isDirectory()) {
        // Recursively copy subdirectories
        copyFolderRecursive(sourcePath, destPath);
      } else {
        // Copy file
        fs.copyFileSync(sourcePath, destPath);
        console.log(`Copied: ${sourcePath} -> ${destPath}`);
      }
    });
  }
}

console.log('Asset copy completed successfully');
