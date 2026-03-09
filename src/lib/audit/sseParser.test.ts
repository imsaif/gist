import { describe, it, expect } from 'vitest';
import { parseSSEEvents } from './sseParser';

describe('parseSSEEvents', () => {
  it('parses a single complete event', () => {
    const buffer = 'event: fetched\ndata: {"url":"https://example.com"}\n\n';
    const { events, remaining } = parseSSEEvents(buffer);
    expect(events).toHaveLength(1);
    expect(events[0].event).toBe('fetched');
    expect(events[0].data).toBe('{"url":"https://example.com"}');
    expect(remaining).toBe('');
  });

  it('parses multiple complete events', () => {
    const buffer = [
      'event: fetched',
      'data: {"url":"https://example.com"}',
      '',
      'event: llm_response',
      'data: {"model":"chatgpt","content":"hello"}',
      '',
    ].join('\n');
    const { events, remaining } = parseSSEEvents(buffer);
    expect(events).toHaveLength(2);
    expect(events[0].event).toBe('fetched');
    expect(events[1].event).toBe('llm_response');
    expect(remaining).toBe('');
  });

  it('keeps incomplete event in remaining buffer', () => {
    const buffer = [
      'event: fetched',
      'data: {"url":"https://example.com"}',
      '',
      'event: llm_response',
      'data: {"model":"chatgpt"',
    ].join('\n');
    const { events, remaining } = parseSSEEvents(buffer);
    expect(events).toHaveLength(1);
    expect(events[0].event).toBe('fetched');
    expect(remaining).toBe('event: llm_response\ndata: {"model":"chatgpt"');
  });

  it('returns entire buffer as remaining when no complete events', () => {
    const buffer = 'event: fetched\ndata: {"url":"test"}';
    const { events, remaining } = parseSSEEvents(buffer);
    expect(events).toHaveLength(0);
    expect(remaining).toBe(buffer);
  });

  it('handles empty buffer', () => {
    const { events, remaining } = parseSSEEvents('');
    expect(events).toHaveLength(0);
    expect(remaining).toBe('');
  });

  it('requires both event and data to emit', () => {
    // Only event line, no data, followed by blank line
    const buffer = 'event: fetched\n\n';
    const { events, remaining } = parseSSEEvents(buffer);
    expect(events).toHaveLength(0);
  });

  it('ignores lines that are not event: or data: prefixed', () => {
    const buffer = ['event: fetched', 'id: 123', 'data: {"url":"test"}', ''].join('\n');
    const { events, remaining } = parseSSEEvents(buffer);
    expect(events).toHaveLength(1);
    expect(events[0].event).toBe('fetched');
    expect(events[0].data).toBe('{"url":"test"}');
  });

  it('handles event: done with empty data object', () => {
    const buffer = 'event: done\ndata: {}\n\n';
    const { events } = parseSSEEvents(buffer);
    expect(events).toHaveLength(1);
    expect(events[0].event).toBe('done');
    expect(events[0].data).toBe('{}');
  });

  it('handles error event', () => {
    const buffer = 'event: error\ndata: {"message":"Something went wrong"}\n\n';
    const { events } = parseSSEEvents(buffer);
    expect(events).toHaveLength(1);
    expect(events[0].event).toBe('error');
    expect(JSON.parse(events[0].data).message).toBe('Something went wrong');
  });

  it('accumulates events from incremental chunks', () => {
    // Simulate streaming: first chunk has partial event
    const chunk1 = 'event: fetched\ndata: {"url":"test"}';
    const result1 = parseSSEEvents(chunk1);
    expect(result1.events).toHaveLength(0);
    expect(result1.remaining).toBe(chunk1);

    // Second chunk completes the event and starts another
    const chunk2 = result1.remaining + '\n\nevent: done\ndata: {}\n\n';
    const result2 = parseSSEEvents(chunk2);
    expect(result2.events).toHaveLength(2);
    expect(result2.events[0].event).toBe('fetched');
    expect(result2.events[1].event).toBe('done');
  });
});
