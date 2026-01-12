// Message types
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// Brief types
export interface Decision {
  decision: string;
  rationale: string;
}

export interface ReadyToDesign {
  prompt: string;
  checklist: string[];
}

export interface Brief {
  goal: string | null;
  context: string[];
  decisions: Decision[];
  openQuestions: string[];
  readyToDesign: ReadyToDesign | null;
}

// Brief update from AI (partial)
export interface BriefUpdate {
  goal?: string | null;
  context?: string[] | null;
  decisions?: Decision[] | null;
  openQuestions?: string[] | null;
  readyToDesign?: ReadyToDesign | null;
}

// Chat state
export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}

// App state
export interface AppState {
  chat: ChatState;
  brief: Brief;
}
