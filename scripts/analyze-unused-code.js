/**
 * Tree-shaking helper for Yunnan Taste Mini-Program
 * Identifies unused code and dependencies to reduce bundle size
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');
const { execSync } = require('child_process');

// Install required packages if not already installed
try {
  console.log('Checking for required packages...');
  execSync('npm list glob || npm install glob --save-dev');
  console.log('Required packages are installed.');
} catch (error) {
  console.error('Error installing packages:', error);
  process.exit(1);
}

// Configuration
const config = {
  // Source directories to scan
  srcDir: path.resolve(__dirname, '../src'),
  // Output report file
  reportFile: path.resolve(__dirname, '../unused-code-report.json'),
  // Extensions to analyze
  extensions: ['.ts', '.tsx', '.js', '.jsx'],
  // Directories to exclude
  excludeDirs: ['node_modules', 'dist', '.git'],
  // Import patterns to look for
  importPatterns: [
    /import\s+(?:(?:{[^}]*})|(?:[^{}\s,]+))\s+from\s+['"]([^'"]+)['"]/g,
    /import\s+['"]([^'"]+)['"]/g,
    /require\s*\(\s*['"]([^'"]+)['"]\s*\)/g
  ]
};

// Function to get all source files
function getSourceFiles() {
  const pattern = `${config.srcDir}/**/*{${config.extensions.join(',')}}`;
  return glob.sync(pattern, {
    ignore: config.excludeDirs.map(dir => `${config.srcDir}/**/${dir}/**`)
  });
}

// Function to extract imports from a file
function extractImports(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const imports = new Set();
    
    for (const pattern of config.importPatterns) {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        imports.add(match[1]);
      }
      // Reset regex state
      pattern.lastIndex = 0;
    }
    
    return Array.from(imports);
  } catch (error) {
    console.error(`Error extracting imports from ${filePath}:`, error);
    return [];
  }
}

// Function to check if a file is exported
function isExported(filePath, allFiles) {
  const relativePath = path.relative(config.srcDir, filePath).replace(/\\/g, '/');
  const fileWithoutExt = relativePath.replace(/\.[^.]+$/, '');
  
  // Check if any file imports this file
  for (const file of allFiles) {
    if (file === filePath) continue;
    
    const imports = extractImports(file);
    for (const imp of imports) {
      // Check for various import patterns
      if (imp === fileWithoutExt || 
          imp === `./${fileWithoutExt}` || 
          imp === `../${fileWithoutExt}` ||
          imp.endsWith(`/${fileWithoutExt}`)) {
        return true;
      }
    }
  }
  
  return false;
}

// Function to analyze unused exports
function analyzeUnusedExports(files) {
  const unusedFiles = [];
  
  for (const file of files) {
    // Skip entry points and special files
    if (file.includes('app.') || 
        file.includes('index.') || 
        file.includes('main.') ||
        file.includes('types.') ||
        file.includes('constants.')) {
      continue;
    }
    
    if (!isExported(file, files)) {
      unusedFiles.push({
        file: path.relative(config.srcDir, file),
        size: fs.statSync(file).size
      });
    }
  }
  
  return unusedFiles;
}

// Function to analyze unused dependencies
function analyzeUnusedDependencies(files) {
  try {
    // Get all project dependencies
    const packageJsonPath = path.resolve(__dirname, '../package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const dependencies = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies
    };
    
    // Get all imports across all files
    const allImports = new Set();
    for (const file of files) {
      const imports = extractImports(file);
      imports.forEach(imp => {
        // Only consider package imports (not relative imports)
        if (!imp.startsWith('.') && !imp.startsWith('/')) {
          // Handle submodule imports (e.g., lodash/map)
          const mainPackage = imp.split('/')[0];
          allImports.add(mainPackage);
        }
      });
    }
    
    // Find unused dependencies
    const unusedDependencies = [];
    for (const dep in dependencies) {
      if (!allImports.has(dep) && 
          !dep.startsWith('@types/') && 
          !dep.startsWith('eslint') &&
          !dep.includes('webpack') &&
          !dep.includes('babel') &&
          !dep.includes('taro')) {
        unusedDependencies.push({
          name: dep,
          version: dependencies[dep]
        });
      }
    }
    
    return unusedDependencies;
  } catch (error) {
    console.error('Error analyzing unused dependencies:', error);
    return [];
  }
}

// Main function
function main() {
  console.log('Starting unused code analysis...');
  
  const files = getSourceFiles();
  console.log(`Found ${files.length} source files to analyze.`);
  
  console.log('Analyzing unused exports...');
  const unusedFiles = analyzeUnusedExports(files);
  
  console.log('Analyzing unused dependencies...');
  const unusedDependencies = analyzeUnusedDependencies(files);
  
  // Generate report
  const report = {
    timestamp: new Date().toISOString(),
    unusedFiles: {
      count: unusedFiles.length,
      totalSize: unusedFiles.reduce((sum, file) => sum + file.size, 0),
      files: unusedFiles
    },
    unusedDependencies: {
      count: unusedDependencies.length,
      dependencies: unusedDependencies
    },
    recommendations: []
  };
  
  // Add recommendations
  if (unusedFiles.length > 0) {
    report.recommendations.push(
      'Consider removing unused files to reduce bundle size.',
      'Verify that these files are truly unused before removing them.'
    );
  }
  
  if (unusedDependencies.length > 0) {
    report.recommendations.push(
      'Consider removing unused dependencies to reduce node_modules size.',
      'Some dependencies might be used indirectly, verify before removing.'
    );
  }
  
  // Write report to file
  fs.writeFileSync(config.reportFile, JSON.stringify(report, null, 2));
  
  // Print summary
  console.log('\n--- Unused Code Analysis Summary ---');
  console.log(`Unused files: ${unusedFiles.length}`);
  console.log(`Unused dependencies: ${unusedDependencies.length}`);
  console.log(`Report saved to: ${config.reportFile}`);
  
  if (unusedFiles.length > 0) {
    console.log('\nTop 5 unused files by size:');
    unusedFiles
      .sort((a, b) => b.size - a.size)
      .slice(0, 5)
      .forEach(file => {
        console.log(`- ${file.file} (${Math.round(file.size / 1024 * 100) / 100} KB)`);
      });
  }
  
  if (unusedDependencies.length > 0) {
    console.log('\nUnused dependencies:');
    unusedDependencies
      .slice(0, 10)
      .forEach(dep => {
        console.log(`- ${dep.name}@${dep.version}`);
      });
  }
  
  console.log('\nAnalysis complete!');
}

// Run the script
main();
