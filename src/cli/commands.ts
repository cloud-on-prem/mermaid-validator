import { Command } from 'commander';
import fs from 'fs';
import { validate } from '../core/validator';
import { logger } from '../utils/logger';

export const validateCommand = new Command('validate')
  .description('Validate a Mermaid diagram file')
  .arguments('<filePath>')
  .option('-t, --type <diagramType>', 'The type of the Mermaid diagram')
  .action(async (filePath, options) => {
    try {
      const diagram = fs.readFileSync(filePath, 'utf-8');
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
