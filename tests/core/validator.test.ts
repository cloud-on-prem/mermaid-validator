import { describe, it, expect } from 'vitest';
import { validate } from '../../src/core/validator';

describe('validator', () => {
  it('should return isValid: true for a valid flowchart', async () => {
    const diagram = 'flowchart TD; A-->B;';
    const result = await validate(diagram, 'flowchart');
    expect(result.isValid).toBe(true);
  });

  it('should return isValid: false for an invalid flowchart', async () => {
    const diagram = 'flowchart TD; A--B;';
    const result = await validate(diagram, 'flowchart');
    expect(result.isValid).toBe(false);
    expect(result.error).toBeDefined();
  });

  it('should validate different diagram types from strings', async () => {
    // Test sequence diagram
    const sequenceDiagram = `
      sequenceDiagram
        participant A
        participant B
        A->>B: Hello
    `;
    const sequenceResult = await validate(sequenceDiagram);
    expect(sequenceResult.isValid).toBe(true);

    // Test pie chart
    const pieChart = `
      pie title Pets adopted by volunteers
        "Dogs" : 386
        "Cats" : 85
        "Rats" : 15
    `;
    const pieResult = await validate(pieChart);
    expect(pieResult.isValid).toBe(true);
  });

  it('should handle multiline diagram strings', async () => {
    const multilineDiagram = `
      flowchart TD
        A[Start] --> B{Is it?}
        B -->|Yes| C[OK]
        B -->|No| D[End]
    `;
    const result = await validate(multilineDiagram);
    expect(result.isValid).toBe(true);
  });
});
