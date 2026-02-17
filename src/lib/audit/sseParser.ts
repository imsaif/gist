export interface ParsedSSEEvent {
  event: string;
  data: string;
}

export function parseSSEEvents(buffer: string): {
  events: ParsedSSEEvent[];
  remaining: string;
} {
  const events: ParsedSSEEvent[] = [];
  const lines = buffer.split('\n');
  let currentEvent = '';
  let currentData = '';
  let lastProcessedIndex = -1;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith('event: ')) {
      currentEvent = line.slice(7);
    } else if (line.startsWith('data: ')) {
      currentData = line.slice(6);
    } else if (line === '' && currentEvent && currentData) {
      events.push({ event: currentEvent, data: currentData });
      currentEvent = '';
      currentData = '';
      lastProcessedIndex = i;
    }
  }

  // Return unprocessed remainder
  const remaining =
    lastProcessedIndex >= 0 ? lines.slice(lastProcessedIndex + 1).join('\n') : buffer;

  return { events, remaining: events.length > 0 ? remaining : buffer };
}
