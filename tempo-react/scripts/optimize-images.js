#!/usr/bin/env node

/**
 * Image Optimization Script - Phase 3 Performance Enhancement
 * Optimizes images for web delivery reducing bundle size significantly
 */

import imagemin from 'imagemin';
import imageminMozjpeg from 'imagemin-mozjpeg';
import imageminPngquant from 'imagemin-pngquant';
import { promises as fs } from 'fs';
import path from 'path';
import process from 'process';

const ASSETS_DIR = 'src/assets/images';
const DIST_DIR = 'dist/assets';

/**
 * Optimize images with aggressive compression for web delivery
 */
async function optimizeImages() {
  console.log('🖼️  Starting image optimization...');

  try {
    // Create optimized images
    const files = await imagemin([`${ASSETS_DIR}/*.{jpg,jpeg,png}`], {
      destination: `${ASSETS_DIR}-optimized`,
      plugins: [
        imageminMozjpeg({
          quality: 75, // Good quality vs size balance
          progressive: true // Progressive JPEG for perceived performance
        }),
        imageminPngquant({
          quality: [0.6, 0.8] // PNG optimization
        })
      ]
    });

    console.log('✅ Images optimized:');
    files.forEach(file => {
      console.log(`   ${file.destinationPath}`);
    });

    // Get file sizes for comparison
    for (const file of files) {
      const originalPath = file.sourcePath;
      const optimizedPath = file.destinationPath;
      
      const originalStats = await fs.stat(originalPath);
      const optimizedStats = await fs.stat(optimizedPath);
      
      const originalSize = (originalStats.size / 1024 / 1024).toFixed(2);
      const optimizedSize = (optimizedStats.size / 1024 / 1024).toFixed(2);
      const savings = ((1 - optimizedStats.size / originalStats.size) * 100).toFixed(1);
      
      console.log(`📊 ${path.basename(originalPath)}:`);
      console.log(`   Original: ${originalSize} MB`);
      console.log(`   Optimized: ${optimizedSize} MB`);
      console.log(`   Savings: ${savings}%`);
    }

  } catch (error) {
    console.error('❌ Image optimization failed:', error);
    process.exit(1);
  }
}

/**
 * Replace original images with optimized versions
 */
async function replaceImages() {
  try {
    const optimizedDir = `${ASSETS_DIR}-optimized`;
    const files = await fs.readdir(optimizedDir);
    
    for (const file of files) {
      const optimizedPath = path.join(optimizedDir, file);
      const originalPath = path.join(ASSETS_DIR, file);
      
      // Backup original
      const backupPath = path.join(ASSETS_DIR, `${file}.backup`);
      await fs.copyFile(originalPath, backupPath);
      
      // Replace with optimized
      await fs.copyFile(optimizedPath, originalPath);
      console.log(`✅ Replaced ${file} with optimized version`);
    }
    
    // Clean up temporary directory
    await fs.rmdir(optimizedDir, { recursive: true });
    console.log('🧹 Cleaned up temporary files');
    
  } catch (error) {
    console.error('❌ Image replacement failed:', error);
    process.exit(1);
  }
}

// Run optimization
async function main() {
  await optimizeImages();
  
  const answer = process.argv.includes('--replace');
  if (answer) {
    await replaceImages();
    console.log('🎉 Image optimization complete!');
  } else {
    console.log('🔍 Review optimized images in src/assets/images-optimized/');
    console.log('💡 Run with --replace flag to replace originals');
  }
}

main().catch(console.error);
