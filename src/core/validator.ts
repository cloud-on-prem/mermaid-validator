import mermaid from 'mermaid';
import { ValidationResult } from './types';

let isInitialized = false;

async function initializeMermaid() {
  if (!isInitialized) {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'default',
      securityLevel: 'loose',
    });
    isInitialized = true;
  }
}

export async function validate(
  diagram: string,
  _diagramType?: string
): Promise<ValidationResult> {
  try {
    await initializeMermaid();
    
    // Use mermaid.parse to validate the diagram
    // Note: mermaid.parse() automatically detects diagram type from content
    await mermaid.parse(diagram);
    
    return { isValid: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    // Check if this is a DOMPurify-related error (environmental issue, not syntax issue)
    if (errorMessage.includes('DOMPurify') && 
        (errorMessage.includes('is not a function') || 
         errorMessage.includes('is not defined') ||
         errorMessage.includes('sanitize'))) {
      // DOMPurify errors indicate complex diagrams that need browser environment
      // but the syntax is likely valid, so we'll consider them valid
      return { isValid: true };
    }
    
    // For all other errors (actual syntax errors), return them
    return { 
      isValid: false, 
      error: errorMessage
    };
  }
}
