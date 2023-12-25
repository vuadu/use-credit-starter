import { CHAT_SESSIONS } from './sample-data';
import { ChatSideBar } from '@/components/ui/Chat/ChatSideBar';
import { ChatSession } from '@/types';
import React from 'react';
import { v4 as uuidv4 } from 'uuid';

const ChatLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-[100vh] bg-primary-foreground">
      <ChatSideBar sessions={CHAT_SESSIONS} />
      {children}
    </div>
  );
};

export default ChatLayout;
