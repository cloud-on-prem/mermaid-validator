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
    return { 
      isValid: false, 
      error: error instanceof Error ? error.message : String(error)
    };
  }
}
