#!/usr/bin/env node

import { Command } from 'commander';
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { validateCommand, validateMarkdownCommand } from './commands';

// Get the directory of the current module (works in ESM)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read package.json from the package's own directory (not cwd)
// The built file is at dist/index.js, so we go up one level to find package.json
const packageJsonPath = join(__dirname, '..', 'package.json');

let packageJson;
try {
  packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
} catch (error) {
  console.error(`Error: Could not read package.json from ${packageJsonPath}`);
  console.error(`This is likely a packaging issue. Please reinstall the package.`);
  process.exit(1);
}

const program = new Command();

program
  .name(packageJson.name)
  .description(packageJson.description)
  .version(packageJson.version);

program.addCommand(validateCommand);
program.addCommand(validateMarkdownCommand);

program.parse(process.argv);
