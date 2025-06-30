import { Command } from 'commander';
import fs from 'fs';
import { validate } from '../core/validator';
import { logger } from '../utils/logger';
import { extractMermaidBlocks } from '../utils/markdown';

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

export const validateMarkdownCommand = new Command('validate-md')
  .description('Validate all Mermaid diagrams in a Markdown file')
  .arguments('<filePath>')
  .option('--fail-fast', 'Stop validation on first error')
  .action(async (filePath, options) => {
    try {
      let markdownContent: string;
      
      try {
        markdownContent = fs.readFileSync(filePath, 'utf-8');
      } catch (fileError) {
        logger.error(`Error reading file: ${(fileError as Error).message}`);
        process.exit(1);
      }

      const mermaidBlocks = extractMermaidBlocks(markdownContent);

      if (mermaidBlocks.length === 0) {
        logger.info('No Mermaid code blocks found in the Markdown file.');
        return;
      }

      logger.info(`Found ${mermaidBlocks.length} Mermaid code block(s) in ${filePath}`);

      let hasErrors = false;
      let validCount = 0;
      let invalidCount = 0;

      for (const block of mermaidBlocks) {
        const blockLabel = `Block ${block.blockIndex + 1} (lines ${block.lineStart}-${block.lineEnd})`;
        
        try {
          const result = await validate(block.content);
          
          if (result.isValid) {
            logger.success(`✅ ${blockLabel}: Valid`);
            validCount++;
          } else {
            logger.error(`❌ ${blockLabel}: Invalid`);
            if (result.error) {
              logger.error(`   Error: ${result.error}`);
            }
            invalidCount++;
            hasErrors = true;

            if (options.failFast) {
              logger.error('Stopping validation due to --fail-fast flag');
              break;
            }
          }
        } catch (error) {
          logger.error(`❌ ${blockLabel}: Validation failed`);
          logger.error(`   Error: ${(error as Error).message}`);
          invalidCount++;
          hasErrors = true;

          if (options.failFast) {
            logger.error('Stopping validation due to --fail-fast flag');
            break;
          }
        }
      }

      // Summary
      logger.info(`\nValidation Summary:`);
      logger.info(`  Total blocks: ${mermaidBlocks.length}`);
      logger.success(`  Valid: ${validCount}`);
      if (invalidCount > 0) {
        logger.error(`  Invalid: ${invalidCount}`);
      }

      if (hasErrors) {
        process.exit(1);
      } else {
        logger.success('All Mermaid diagrams are valid! 🎉');
      }

    } catch (error) {
      logger.error('An unexpected error occurred:');
      logger.error((error as Error).message);
      process.exit(1);
    }
  });
