import { describe, it, expect } from 'vitest';
import { extractMermaidBlocks } from '../../src/utils/markdown';

describe('markdown utils', () => {
  it('should extract mermaid blocks from markdown', () => {
    const markdown = `
# Title

Some text here.

\`\`\`mermaid
flowchart TD
    A --> B
\`\`\`

More text.

\`\`\`mermaid
sequenceDiagram
    A->>B: Hello
\`\`\`

End of document.
`;

    const blocks = extractMermaidBlocks(markdown);
    
    expect(blocks).toHaveLength(2);
    
    expect(blocks[0]).toEqual({
      content: 'flowchart TD\n    A --> B',
      lineStart: 7,
      lineEnd: 8,
      blockIndex: 0
    });
    
    expect(blocks[1]).toEqual({
      content: 'sequenceDiagram\n    A->>B: Hello',
      lineStart: 14,
      lineEnd: 15,
      blockIndex: 1
    });
  });

  it('should handle empty mermaid blocks', () => {
    const markdown = `
\`\`\`mermaid
\`\`\`

\`\`\`mermaid


\`\`\`
`;

    const blocks = extractMermaidBlocks(markdown);
    expect(blocks).toHaveLength(0);
  });

  it('should handle mermaid blocks with language specification', () => {
    const markdown = `
\`\`\`mermaid graph
flowchart TD
    A --> B
\`\`\`
`;

    const blocks = extractMermaidBlocks(markdown);
    expect(blocks).toHaveLength(1);
    expect(blocks[0].content).toBe('flowchart TD\n    A --> B');
  });

  it('should ignore non-mermaid code blocks', () => {
    const markdown = `
\`\`\`javascript
console.log('hello');
\`\`\`

\`\`\`mermaid
flowchart TD
    A --> B
\`\`\`

\`\`\`python
print('world')
\`\`\`
`;

    const blocks = extractMermaidBlocks(markdown);
    expect(blocks).toHaveLength(1);
    expect(blocks[0].content).toBe('flowchart TD\n    A --> B');
  });

  it('should handle markdown with no mermaid blocks', () => {
    const markdown = `
# Title

Some text here.

\`\`\`javascript
console.log('hello');
\`\`\`

More text.
`;

    const blocks = extractMermaidBlocks(markdown);
    expect(blocks).toHaveLength(0);
  });
});
