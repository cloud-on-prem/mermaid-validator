# Mermaid Validate CLI

A command-line tool to validate [Mermaid](https://mermaid.js.org/) diagrams.

## Installation

```bash
npm install mermaid-validate -g
```

## Usage

```bash
mermaid-validate validate <filePath> [options]
```

### Using NPX (Recommended)

```bash
npx mermaid-validate validate <filePath> [options]
```

### Development Build

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

## CI/CD & Publishing

This project uses GitHub Actions for continuous integration and automated publishing to NPM.

### GitHub Actions Workflow

The CI/CD pipeline includes:
- **Testing**: Runs tests on Node.js 18.x and 20.x
- **Linting**: Ensures code quality with ESLint
- **Building**: Compiles TypeScript to JavaScript
- **CLI Testing**: Validates the built CLI works correctly
- **Release Please**: Automated version management and changelog generation
- **NPM Publishing**: Automatic publishing to NPM when releases are created

### Setting Up for Publishing

To enable automated NPM publishing, you need to:

1. **Set up NPM Token**:
   - Create an NPM account and generate an automation token
   - Add it as `NPM_TOKEN` in your GitHub repository secrets

2. **Create Releases**:
   - Use conventional commit messages (e.g., `feat:`, `fix:`, `chore:`)
   - Release Please will automatically create release PRs
   - Merge the release PR to trigger NPM publishing

### Conventional Commits

This project uses conventional commits for automated changelog generation:
- `feat:` - New features
- `fix:` - Bug fixes
- `chore:` - Maintenance tasks
- `docs:` - Documentation updates
- `refactor:` - Code refactoring
- `perf:` - Performance improvements

## License

Apache 2.0
