/**
 * Script to optimize images for WeChat Mini-Program
 * Reduces image file sizes while maintaining quality
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Install required packages if not already installed
try {
  console.log('Checking for required packages...');
  execSync('npm list sharp || npm install sharp --save-dev');
  console.log('Required packages are installed.');
} catch (error) {
  console.error('Error installing packages:', error);
  process.exit(1);
}

// Import sharp after ensuring it's installed
const sharp = require('sharp');

// Configuration
const config = {
  // Source directories to scan for images
  sourceDirs: [
    path.resolve(__dirname, '../src/assets'),
    path.resolve(__dirname, '../src/images'),
  ],
  // Output directory for optimized images
  outputDir: path.resolve(__dirname, '../src/optimized-assets'),
  // Image quality settings
  quality: {
    jpeg: 80,
    png: 80,
    webp: 75
  },
  // Maximum dimensions for images
  maxDimensions: {
    width: 1500,
    height: 1500
  },
  // Convert images to WebP format
  convertToWebP: true,
  // File size threshold for warning (in KB)
  fileSizeWarningThreshold: 200
};

// Create output directory if it doesn't exist
if (!fs.existsSync(config.outputDir)) {
  fs.mkdirSync(config.outputDir, { recursive: true });
}

// Function to get all image files recursively
function getImageFiles(dir) {
  let results = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      results = results.concat(getImageFiles(fullPath));
    } else {
      const ext = path.extname(fullPath).toLowerCase();
      if (['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext)) {
        results.push(fullPath);
      }
    }
  }
  
  return results;
}

// Function to optimize an image
async function optimizeImage(imagePath) {
  try {
    const ext = path.extname(imagePath).toLowerCase();
    const filename = path.basename(imagePath);
    const relativePath = path.relative(path.resolve(__dirname, '../src'), imagePath);
    const outputPath = path.join(config.outputDir, relativePath);
    
    // Create directory structure if it doesn't exist
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Get image info
    const metadata = await sharp(imagePath).metadata();
    
    // Check if image needs resizing
    const needsResize = 
      metadata.width > config.maxDimensions.width || 
      metadata.height > config.maxDimensions.height;
    
    // Start processing pipeline
    let pipeline = sharp(imagePath);
    
    // Resize if needed
    if (needsResize) {
      pipeline = pipeline.resize({
        width: Math.min(metadata.width, config.maxDimensions.width),
        height: Math.min(metadata.height, config.maxDimensions.height),
        fit: 'inside',
        withoutEnlargement: true
      });
    }
    
    // Process based on file type
    if (config.convertToWebP) {
      // Convert to WebP
      const webpOutputPath = outputPath.replace(ext, '.webp');
      await pipeline.webp({ quality: config.quality.webp }).toFile(webpOutputPath);
      
      // Also save in original format with optimization
      if (ext === '.jpg' || ext === '.jpeg') {
        await pipeline.jpeg({ quality: config.quality.jpeg }).toFile(outputPath);
      } else if (ext === '.png') {
        await pipeline.png({ quality: config.quality.png }).toFile(outputPath);
      } else {
        await pipeline.toFile(outputPath);
      }
      
      return {
        original: imagePath,
        optimized: [outputPath, webpOutputPath],
        originalSize: fs.statSync(imagePath).size,
        optimizedSize: fs.statSync(webpOutputPath).size,
        format: 'webp'
      };
    } else {
      // Optimize in original format
      if (ext === '.jpg' || ext === '.jpeg') {
        await pipeline.jpeg({ quality: config.quality.jpeg }).toFile(outputPath);
      } else if (ext === '.png') {
        await pipeline.png({ quality: config.quality.png }).toFile(outputPath);
      } else if (ext === '.webp') {
        await pipeline.webp({ quality: config.quality.webp }).toFile(outputPath);
      } else {
        await pipeline.toFile(outputPath);
      }
      
      return {
        original: imagePath,
        optimized: [outputPath],
        originalSize: fs.statSync(imagePath).size,
        optimizedSize: fs.statSync(outputPath).size,
        format: ext.substring(1)
      };
    }
  } catch (error) {
    console.error(`Error optimizing ${imagePath}:`, error);
    return {
      original: imagePath,
      error: error.message
    };
  }
}

// Main function
async function main() {
  console.log('Starting image optimization for WeChat Mini-Program...');
  
  let allImages = [];
  
  // Get all images from source directories
  for (const sourceDir of config.sourceDirs) {
    if (fs.existsSync(sourceDir)) {
      const images = getImageFiles(sourceDir);
      allImages = allImages.concat(images);
      console.log(`Found ${images.length} images in ${sourceDir}`);
    } else {
      console.log(`Source directory ${sourceDir} does not exist, skipping.`);
    }
  }
  
  console.log(`Total images to process: ${allImages.length}`);
  
  // Process all images
  const results = [];
  let totalOriginalSize = 0;
  let totalOptimizedSize = 0;
  let largeImages = [];
  
  for (let i = 0; i < allImages.length; i++) {
    const imagePath = allImages[i];
    console.log(`Processing (${i+1}/${allImages.length}): ${imagePath}`);
    
    const result = await optimizeImage(imagePath);
    results.push(result);
    
    if (!result.error) {
      totalOriginalSize += result.originalSize;
      totalOptimizedSize += result.optimizedSize;
      
      // Check if optimized image is still large
      const optimizedSizeKB = result.optimizedSize / 1024;
      if (optimizedSizeKB > config.fileSizeWarningThreshold) {
        largeImages.push({
          path: result.optimized[0],
          size: optimizedSizeKB.toFixed(2) + ' KB'
        });
      }
    }
  }
  
  // Print summary
  console.log('\n--- Optimization Summary ---');
  console.log(`Total images processed: ${results.length}`);
  console.log(`Successful optimizations: ${results.filter(r => !r.error).length}`);
  console.log(`Failed optimizations: ${results.filter(r => r.error).length}`);
  
  const originalSizeMB = (totalOriginalSize / (1024 * 1024)).toFixed(2);
  const optimizedSizeMB = (totalOptimizedSize / (1024 * 1024)).toFixed(2);
  const savingsPercent = ((1 - (totalOptimizedSize / totalOriginalSize)) * 100).toFixed(2);
  
  console.log(`\nOriginal size: ${originalSizeMB} MB`);
  console.log(`Optimized size: ${optimizedSizeMB} MB`);
  console.log(`Size reduction: ${savingsPercent}%`);
  
  if (largeImages.length > 0) {
    console.log(`\nWarning: ${largeImages.length} images are still larger than ${config.fileSizeWarningThreshold} KB:`);
    largeImages.forEach(img => {
      console.log(`- ${img.path} (${img.size})`);
    });
    console.log('\nConsider further optimizing these images or using lower resolution versions.');
  }
  
  console.log('\nOptimized images are saved in:', config.outputDir);
  console.log('\nImage optimization complete!');
}

// Run the script
main().catch(error => {
  console.error('Error in image optimization script:', error);
  process.exit(1);
});
