import Chat from '../page';
import { CHAT_SESSIONS } from '../sample-data';
import { getSession } from '@/app/supabase-server';
import ChatNavbar from '@/components/ui/Chat/ChatNavbar';
import React from 'react';

const ChatDetailLayout = async ({
  params,
  children
}: {
  params: { sessionId: string };
  children: React.ReactNode;
}) => {
  return (
    <div className="w-full h-full max-h-full flex flex-col">
      <ChatNavbar sessionId={params.sessionId} />
      {children}
    </div>
  );
};

export default ChatDetailLayout;
