import { marked } from 'marked';

export interface MermaidBlock {
  content: string;
  lineStart: number;
  lineEnd: number;
  blockIndex: number;
}

export function extractMermaidBlocks(markdownContent: string): MermaidBlock[] {
  const blocks: MermaidBlock[] = [];
  let blockIndex = 0;

  // Use marked's lexer to get tokens
  const tokens = marked.lexer(markdownContent);
  const lines = markdownContent.split('\n');
  
  for (const token of tokens) {
    if (token.type === 'code' && (token.lang === 'mermaid' || token.lang?.startsWith('mermaid'))) {
      // Find the line number where this code block starts
      const codeContent = token.text.trim();
      
      if (codeContent.length > 0) {
        // Find the code block in the original content to get accurate line numbers
        let lineStart = 0;
        let lineEnd = 0;
        
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i].trim();
          
          // Look for the start of a mermaid code block
          if (line === '```mermaid' || line.startsWith('```mermaid ')) {
            lineStart = i + 2; // Content starts on next line (1-based)
            
            // Find the end of the code block
            for (let j = i + 1; j < lines.length; j++) {
              if (lines[j].trim() === '```') {
                lineEnd = j;
                break;
              }
            }
            
            // Check if this matches our current code block
            const blockContent = lines.slice(i + 1, lineEnd).join('\n').trim();
            if (blockContent === codeContent) {
              blocks.push({
                content: codeContent,
                lineStart,
                lineEnd,
                blockIndex: blockIndex++
              });
              break;
            }
          }
        }
      }
    }
  }

  return blocks;
}
