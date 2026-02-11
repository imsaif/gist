// Message types
export interface IdentifiedPatternInMessage {
  patternId: string;
  reason: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  identifiedPattern?: IdentifiedPatternInMessage;
}
