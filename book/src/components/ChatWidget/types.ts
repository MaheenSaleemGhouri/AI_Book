export interface Message {
  role: 'user' | 'assistant';
  content: string;
  created_at?: string;
  sources?: string[];
}

export interface ChatRequest {
  session_id: string;
  message: string;
}

export interface ChatResponse {
  answer: string;
  session_id: string;
  sources: string[];
}

export interface HistoryResponse {
  messages: Message[];
}
