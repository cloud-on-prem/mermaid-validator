# Mermaid Validate CLI

A command-line tool to validate [Mermaid](https://mermaid.js.org/) diagrams.

📖 **[Development Guide](./DEVELOPMENT.md)** - Setup, architecture, CI/CD, and contributing information

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

### Examples

```bash
# Validate a single diagram
mermaid-validate validate diagram.mmd

# Using NPX
npx mermaid-validate validate flowchart.mmd
```

### Programmatic Usage

```typescript
import { validate } from 'mermaid-validate';

const result = await validate('flowchart TD; A-->B;', 'flowchart');
console.log(result); // { isValid: true }

const invalidResult = await validate('flowchart TD; A--B;', 'flowchart');
console.log(invalidResult); // { isValid: false, error: "..." }
```

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

## Corporate Environment Support

This CLI includes automatic support for corporate NPM registries. If you're working in a corporate environment where packages are downloaded from internal registries, the tool can automatically fix `package-lock.json` files to use public NPM registry URLs.

### Quick Setup

1. Copy the environment template:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` with your corporate registry URL:
   ```bash
   CORPORATE_REGISTRY=https://your-company.com/npm/
   ```

3. The pre-commit hook will automatically fix registry URLs when you commit.

For detailed configuration options, see [DEVELOPMENT.md](./DEVELOPMENT.md#corporate-environment-support).

## Development

For development setup, architecture details, CI/CD configuration, and contributing guidelines, see [DEVELOPMENT.md](./DEVELOPMENT.md).

Quick start for developers:
```bash
git clone git@github.com:cloud-on-prem/mermaid-validator.git
cd mermaid-validator
npm install
npm test
```

## License

Apache 2.0
