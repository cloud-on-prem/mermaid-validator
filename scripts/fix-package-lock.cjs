#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Load environment variables from .env file
require('dotenv').config();

const PACKAGE_LOCK_PATH = path.join(process.cwd(), 'package-lock.json');
const CORPORATE_REGISTRY = process.env.CORPORATE_REGISTRY;
const PUBLIC_REGISTRY = 'https://registry.npmjs.org/';

function fixPackageLock() {
  try {
    // Check if CORPORATE_REGISTRY environment variable is set
    if (!CORPORATE_REGISTRY) {
      console.log('CORPORATE_REGISTRY environment variable not set, skipping registry URL fix.');
      console.log('Set CORPORATE_REGISTRY in your .env file or environment variables.');
      return;
    }

    // Check if package-lock.json exists
    if (!fs.existsSync(PACKAGE_LOCK_PATH)) {
      console.log('No package-lock.json found, skipping registry URL fix.');
      return;
    }

    // Read the package-lock.json file
    const packageLockContent = fs.readFileSync(PACKAGE_LOCK_PATH, 'utf8');
    
    // Check if corporate registry URLs are present
    if (!packageLockContent.includes(CORPORATE_REGISTRY)) {
      console.log('No corporate registry URLs found in package-lock.json');
      return;
    }

    console.log('Fixing corporate registry URLs in package-lock.json...');

    // Replace all occurrences of corporate registry with public registry
    const fixedContent = packageLockContent.replace(
      new RegExp(CORPORATE_REGISTRY.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
      PUBLIC_REGISTRY
    );

    // Write the fixed content back to the file
    fs.writeFileSync(PACKAGE_LOCK_PATH, fixedContent, 'utf8');

    console.log('✅ Successfully replaced corporate registry URLs with public NPM registry URLs');
    console.log(`   ${CORPORATE_REGISTRY} → ${PUBLIC_REGISTRY}`);

  } catch (error) {
    console.error('❌ Error fixing package-lock.json:', error.message);
    process.exit(1);
  }
}

// Run the fix if this script is executed directly
if (require.main === module) {
  fixPackageLock();
}

module.exports = { fixPackageLock };
