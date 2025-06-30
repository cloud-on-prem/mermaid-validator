# Mermaid Validate CLI

A command-line tool to validate Mermaid diagrams.

## Installation

```bash
npm install
```

## Usage

### CLI Command

```bash
npm run build
node dist/index.js validate <filePath> [options]
```

### Programmatic Usage

```typescript
import { validate } from './src/core/validator';

const result = await validate('flowchart TD; A-->B;', 'flowchart');
console.log(result); // { isValid: true }

const invalidResult = await validate('flowchart TD; A--B;', 'flowchart');
console.log(invalidResult); // { isValid: false, error: "..." }
```

## Development

### Scripts

- `npm test` - Run tests
- `npm run build` - Build the CLI
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

### Testing

The project uses Vitest for testing with jsdom environment to support Mermaid's DOM requirements.

```bash
npm test
```

### Architecture

- **Core Validator** (`src/core/validator.ts`) - Main validation logic using the full Mermaid library
- **CLI Interface** (`src/cli/`) - Command-line interface using Commander.js
- **Types** (`src/core/types.ts`) - TypeScript type definitions
- **Utils** (`src/utils/`) - Utility functions like logging

## Supported Diagram Types

The validator supports all Mermaid diagram types including:
- Flowcharts
- Sequence diagrams
- Class diagrams
- State diagrams
- Entity relationship diagrams
- User journey diagrams
- Gantt charts
- Pie charts
- Git graphs
- And more...

## License

Apache 2.0
