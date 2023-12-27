'use client';

import { ChatContext } from '@/app/context/ChatContext';
import { usePathname } from 'next/navigation';
import React from 'react';

interface Props {
  sessionId: string;
}

export const ChatTitle = ({ sessionId }: Props) => {
  const { getSessionName } = React.useContext(ChatContext);
  const name = getSessionName(sessionId) || 'Ask me anything';
  return <div className="font-medium">{name}</div>;
};
