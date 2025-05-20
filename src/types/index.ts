
export interface Message {
  id: string;
  role: 'user' | 'system';
  content: string;
  timestamp: Date;
  widgets?: any[];
}

export interface Session {
  id: string;
  title: string;
  lastUpdated: Date;
  messages: Message[];
}
