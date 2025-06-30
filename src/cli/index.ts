#!/usr/bin/env node

import { Command } from 'commander';
import { readFileSync } from 'fs';
import { join } from 'path';
import { validateCommand, validateMarkdownCommand } from './commands';

// Read version from package.json
const packageJsonPath = join(process.cwd(), 'package.json');
const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));

const program = new Command();

program
  .name(packageJson.name)
  .description(packageJson.description)
  .version(packageJson.version);

program.addCommand(validateCommand);
program.addCommand(validateMarkdownCommand);

program.parse(process.argv);
