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
    // Check if package-lock.json exists
    if (!fs.existsSync(PACKAGE_LOCK_PATH)) {
      console.log('No package-lock.json found, skipping registry URL fix.');
      return;
    }

    // Read the package-lock.json file
    const packageLockContent = fs.readFileSync(PACKAGE_LOCK_PATH, 'utf8');
    let fixedContent = packageLockContent;
    let hasChanges = false;

    // Fix corporate registry URLs if CORPORATE_REGISTRY is set
    if (CORPORATE_REGISTRY && packageLockContent.includes(CORPORATE_REGISTRY)) {
      console.log('Fixing corporate registry URLs in package-lock.json...');
      fixedContent = fixedContent.replace(
        new RegExp(CORPORATE_REGISTRY.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
        PUBLIC_REGISTRY
      );
      hasChanges = true;
    }

    // Fix any malformed URLs with double slashes
    const malformedUrlRegex = /https:\/\/registry\.npmjs\.org\/\/([^/]+)\//g;
    if (malformedUrlRegex.test(fixedContent)) {
      console.log('Fixing malformed registry URLs in package-lock.json...');
      fixedContent = fixedContent.replace(malformedUrlRegex, 'https://registry.npmjs.org/$1/');
      hasChanges = true;
    }

    if (!hasChanges) {
      if (!CORPORATE_REGISTRY) {
        console.log('CORPORATE_REGISTRY environment variable not set and no malformed URLs found.');
      } else {
        console.log('No corporate registry URLs or malformed URLs found in package-lock.json');
      }
      return;
    }

    // Write the fixed content back to the file
    fs.writeFileSync(PACKAGE_LOCK_PATH, fixedContent, 'utf8');

    console.log('✅ Successfully fixed registry URLs in package-lock.json');
    if (CORPORATE_REGISTRY) {
      console.log(`   Corporate registry: ${CORPORATE_REGISTRY} → ${PUBLIC_REGISTRY}`);
    }
    console.log('   Fixed malformed double-slash URLs');

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
