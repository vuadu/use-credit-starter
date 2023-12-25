import { CHAT_SESSIONS } from '../sample-data';
import ChatNavbar from '@/components/ui/Chat/ChatNavbar';
import React from 'react';

const ChatDetailLayout = ({
  params,
  children
}: {
  params: { sessionId: string };
  children: React.ReactNode;
}) => {
  const session = CHAT_SESSIONS.find(
    (session) => session.id === params.sessionId
  );
  const title = session ? session.name : 'Chat';
  return (
    <div className="w-full h-full max-h-full flex flex-col">
      <ChatNavbar title={title} />
      {children}
    </div>
  );
};

export default ChatDetailLayout;
