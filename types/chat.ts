import { Request } from '@/app/hooks/use-credit';

export type ChatSession = {
  id: string;
  name: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type ChatMessage = {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  createdAt: Date;
  updatedAt: Date;
};

export type ChatSessionWithMessages = ChatSession & {
  messages: ChatMessage[];
};

export type TimeGroupedSessions = Record<string, ChatSession[]>;

export type UserChatData = {
  uid: string;
  chatData: ChatSessionWithMessages[];
};

export type Metadata = { input: string; isGettingTopic: boolean };
export type ChatRequest = Request<Metadata>;
