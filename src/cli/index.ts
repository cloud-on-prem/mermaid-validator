#!/usr/bin/env node

import { Command } from 'commander';
import { validateCommand } from './commands';

const program = new Command();

program
  .name('mermaid-validate')
  .description('A CLI to validate Mermaid diagrams')
  .version('0.0.1');

program.addCommand(validateCommand);

program.parse(process.argv);
