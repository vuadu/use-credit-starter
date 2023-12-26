import { CHAT_SESSIONS } from './sample-data';
import { ChatContextProvider } from '@/app/context/ChatContext';
import { getSession } from '@/app/supabase-server';
import { ChatSideBar } from '@/components/ui/Chat/ChatSideBar';
import React from 'react';

const ChatLayout = async ({ children }: { children: React.ReactNode }) => {
  const authSession = await getSession();

  const userId = authSession?.user.id as string;
  return (
    <div className="flex h-[100vh] bg-primary-foreground">
      <ChatContextProvider userId={userId}>
        <ChatSideBar />
        {children}
      </ChatContextProvider>
    </div>
  );
};

export default ChatLayout;
