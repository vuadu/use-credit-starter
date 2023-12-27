'use client';

import {
  getSessions,
  createSession,
  updateSessionName as syncSessionName
} from '@/server/Chat';
import { ChatSession } from '@/types';
import { categorizeAndSortSessions } from '@/utils/chat';
import { set } from 'lodash';
import React, { createContext, useState, useEffect } from 'react';

interface ChatContextType {
  userRef: string;
  chatSessions: ChatSession[];
  isLoaded: boolean;
  addNewSession: () => Promise<ChatSession | null>;
  updateSessionName: (sessionId: string, name: string) => void;
  getSessionName: (sessionId: string) => string | null;
}

// Create the initial chat context
const initialChatContext: ChatContextType = {
  userRef: '',
  chatSessions: [],
  isLoaded: false,
  addNewSession: async () => null,
  updateSessionName: () => null,
  getSessionName: () => null
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
          name: session.attributes.name || null,
          updatedAt: session.attributes.inserted_at,
          createdAt: session.attributes.inserted_at
        };
      });
      setChatSessions(s);
    });
  }, []);

  const updateSessionName = async (sessionId: string, name: string) => {
    const session = chatSessions.find((s) => s.id === sessionId);
    if (!session) return;
    if (session.name !== null) return;
    const n = name.replace(/['"]+/g, '');
    await syncSessionName(sessionId, n);
    setChatSessions((prev) =>
      prev.map((s) => {
        if (s.id === sessionId) {
          return { ...s, name: n };
        } else {
          return s;
        }
      })
    );
  };

  const getSessionName = (sessionId: string) => {
    const s = chatSessions.find((s) => s.id === sessionId);
    if (s) {
      return s.name;
    } else {
      return null;
    }
  };

  const addNewSession = async () => {
    const newSession = await createSession(userRef);
    if (newSession) {
      const newS: ChatSession = {
        id: newSession.id,
        name: newSession.attributes.name || null,
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
        updateSessionName,
        getSessionName,
        userRef,
        chatSessions,
        isLoaded
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
