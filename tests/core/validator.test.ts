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
});
