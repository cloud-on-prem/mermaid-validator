import { Command } from 'commander';
import fs from 'fs';
import { validate } from '../core/validator';
import { logger } from '../utils/logger';

export const validateCommand = new Command('validate')
  .description('Validate a Mermaid diagram from file or string')
  .arguments('[input]')
  .option('-t, --type <diagramType>', 'The type of the Mermaid diagram')
  .option('-s, --string', 'Treat input as diagram string instead of file path')
  .action(async (input, options) => {
    try {
      let diagram: string;

      if (!input) {
        logger.error('Please provide either a file path or diagram string');
        process.exit(1);
      }

      if (options.string) {
        // Treat input as diagram string
        diagram = input;
      } else {
        // Treat input as file path (default behavior)
        try {
          diagram = fs.readFileSync(input, 'utf-8');
        } catch (fileError) {
          logger.error(`Error reading file: ${(fileError as Error).message}`);
          logger.info('Tip: Use --string flag if you want to validate a diagram string directly');
          process.exit(1);
        }
      }

      const result = await validate(diagram, options.type);

      if (result.isValid) {
        logger.success('Mermaid diagram is valid.');
      } else {
        logger.error('Mermaid diagram is invalid:');
        if (result.error) {
          logger.error(result.error);
        }
        process.exit(1);
      }
    } catch (error) {
      logger.error('An unexpected error occurred:');
      logger.error((error as Error).message);
      process.exit(1);
    }
  });
