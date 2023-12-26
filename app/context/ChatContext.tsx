'use client';

import { getSessions, createSession } from '@/server/Chat';
import { ChatSession } from '@/types';
import { categorizeAndSortSessions } from '@/utils/chat';
import React, { createContext, useState, useEffect } from 'react';

interface ChatContextType {
  userRef: string;
  chatSessions: ChatSession[];
  isLoaded: boolean;
  addNewSession: () => Promise<ChatSession | null>;
}

// Create the initial chat context
const initialChatContext: ChatContextType = {
  userRef: '',
  chatSessions: [],
  isLoaded: false,
  addNewSession: async () => null
};

// Create the chat context
export const ChatContext = createContext(initialChatContext);

// Create the chat context provider component
export const ChatContextProvider = ({
  userId,
  children
}: {
  userId: string;
  children: React.ReactNode;
}) => {
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [userRef, setUserRef] = useState<string>(userId);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    getSessions().then((res) => {
      setIsLoaded(true);
      const s: ChatSession[] = res.map((session: any) => {
        return {
          id: session.id,
          name: session.attributes.name || 'Untitled',
          updatedAt: session.attributes.inserted_at,
          createdAt: session.attributes.inserted_at
        };
      });
      setChatSessions(s);
    });
  }, []);

  const addNewSession = async () => {
    const newSession = await createSession(userRef);
    if (newSession) {
      const newS: ChatSession = {
        id: newSession.id,
        name: newSession.attributes.name || 'Untitled',
        updatedAt: newSession.attributes.inserted_at,
        createdAt: newSession.attributes.inserted_at
      };

      setChatSessions((prev) => [...prev, newS]);
      return newS;
    } else {
      return null;
    }
  };

  return (
    <ChatContext.Provider
      value={{
        addNewSession,
        userRef,
        chatSessions,
        isLoaded
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
