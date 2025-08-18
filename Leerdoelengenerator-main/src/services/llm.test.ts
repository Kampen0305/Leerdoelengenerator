import { describe, it, expect } from 'vitest';
import { parseLLMJson } from './llm';

describe('parseLLMJson', () => {
  it('parses plain JSON', () => {
    const result = parseLLMJson('{"a":1}');
    expect(result).toEqual({ a: 1 });
  });

  it('parses JSON code block', () => {
    const input = "```json\n{\"b\":2}\n```";
    const result = parseLLMJson(input);
    expect(result).toEqual({ b: 2 });
  });

  it('parses generic code block', () => {
    const input = "```\n{\"c\":3}\n```";
    const result = parseLLMJson(input);
    expect(result).toEqual({ c: 3 });
  });

  it('throws on invalid JSON', () => {
    expect(() => parseLLMJson('not json')).toThrow();
  });
});
