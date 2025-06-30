# Development Guide

This guide covers development setup, architecture, CI/CD, and corporate environment configuration for the Mermaid Validate CLI.

## Development Setup

### Prerequisites

- Node.js 18.x or 20.x
- npm or yarn
- Git

### Getting Started

```bash
# Clone the repository
git clone git@github.com:cloud-on-prem/mermaid-validator.git
cd mermaid-validator

# Install dependencies
npm install

# Run tests
npm test

# Build the project
npm run build

# Test the CLI locally
node dist/index.js validate tests/fixtures/valid.mmd
```

### Scripts

- `npm test` - Run tests
- `npm run build` - Build the CLI
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run fix-package-lock` - Fix corporate registry URLs in package-lock.json

### Testing

The project uses Vitest for testing with jsdom environment to support Mermaid's DOM requirements.

```bash
npm test
```

Test files are located in the `tests/` directory with fixtures in `tests/fixtures/`.

## Architecture

### Project Structure

```
/
├── src/
│   ├── cli/
│   │   ├── index.ts       # Entry point for the CLI
│   │   └── commands.ts    # CLI command definitions
│   ├── core/
│   │   ├── validator.ts   # Core validation logic
│   │   └── types.ts       # Custom types and interfaces
│   └── utils/
│       └── logger.ts      # Logging utilities
├── tests/
│   ├── core/
│   │   └── validator.test.ts
│   └── fixtures/
│       ├── valid.mmd
│       └── invalid.mmd
├── scripts/
│   └── fix-package-lock.cjs  # Corporate registry URL fixer
└── .husky/
    └── pre-commit        # Git pre-commit hook
```

### Core Components

- **Core Validator** (`src/core/validator.ts`) - Main validation logic using the full Mermaid library
- **CLI Interface** (`src/cli/`) - Command-line interface using Commander.js
- **Types** (`src/core/types.ts`) - TypeScript type definitions
- **Utils** (`src/utils/`) - Utility functions like logging

### Key Technical Decisions

- **Full Mermaid Library**: Uses the complete Mermaid library instead of the limited parser for comprehensive diagram support
- **DOM Environment**: Configured jsdom for tests to handle Mermaid's DOM requirements
- **Automatic Type Detection**: Leverages Mermaid's built-in type detection
- **Clean Error Handling**: Maintains consistent ValidationResult interface

## CI/CD & Publishing

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

2. **Set up GitHub Token (if needed)**:
   - The workflow uses the built-in `GITHUB_TOKEN` by default
   - If you encounter permission issues, create a Personal Access Token with `repo` permissions
   - Add it as `RELEASE_PLEASE_TOKEN` in your GitHub repository secrets
   - The workflow will automatically use it if available

3. **Create Releases**:
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

### GitHub Token Options

**Current Setup:**
```yaml
token: ${{ secrets.RELEASE_PLEASE_TOKEN || secrets.GITHUB_TOKEN }}
permissions:
  contents: write
  pull-requests: write
```

**Two Options:**
1. **Default (Recommended)**: Uses built-in `GITHUB_TOKEN` with proper permissions
2. **Fallback**: If permission issues persist, create a Personal Access Token with `repo` permissions and add as `RELEASE_PLEASE_TOKEN` secret

## Corporate Environment Support

### NPM Registry URL Fix

This project includes a pre-commit hook that automatically fixes corporate NPM registry URLs in `package-lock.json` files. This is useful when working in corporate environments where packages are downloaded from internal registries but need to be committed with public NPM registry URLs.

### How It Works

**Automatic Fix (Pre-commit Hook):**
- Runs automatically before each commit (requires Git repository)
- Replaces corporate registry URLs with public NPM registry URLs
- Automatically stages the fixed `package-lock.json`
- Uses Husky for Git hook management

**Manual Fix:**
```bash
npm run fix-package-lock
```

### Configuration

**Environment Variable (Recommended):**
Set the `CORPORATE_REGISTRY` environment variable to your corporate registry URL:
```bash
export CORPORATE_REGISTRY="https://your-corporate-registry.com/npm/"
```

You can also copy `.env.example` to `.env` and customize it:
```bash
cp .env.example .env
# Edit .env with your corporate registry URL
```

**Examples:**
```bash
# Use environment variable
CORPORATE_REGISTRY="https://your-company.com/npm/" npm run fix-package-lock

# Or set it globally in your shell profile
echo 'export CORPORATE_REGISTRY="https://your-company.com/npm/"' >> ~/.bashrc
```

### Technical Implementation

The script uses:
- **dotenv**: Loads environment variables from `.env` file
- **Husky**: Git hooks management
- **Regex replacement**: Safe URL replacement in package-lock.json
- **Error handling**: Clear feedback and graceful failures

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests (`npm test`)
5. Run linting (`npm run lint`)
6. Commit your changes using conventional commits
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

## Troubleshooting

### Common Issues

1. **Tests failing**: Ensure jsdom is installed and vite.config.ts has `environment: 'jsdom'`
2. **Build errors**: Check TypeScript configuration and dependencies
3. **Corporate registry not working**: Verify `CORPORATE_REGISTRY` environment variable is set correctly
4. **GitHub Actions permissions**: Add `RELEASE_PLEASE_TOKEN` secret if default token insufficient

### Debug Commands

```bash
# Check environment variables
echo $CORPORATE_REGISTRY

# Test corporate registry fix
npm run fix-package-lock

# Verify build output
npm run build && ls -la dist/

# Test CLI manually
node dist/index.js validate tests/fixtures/valid.mmd
