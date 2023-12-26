import { NewSessionButton } from './NewSessionButton';
import { SideBarItem } from './SideBarItem';
import { SideBarNav } from './SideBarNav';
import styles from './styles.module.css';
import { getSession } from '@/app/supabase-server';
import { getSessions, createSession } from '@/server/Chat';
import { ChatSession } from '@/types';
import { categorizeAndSortSessions } from '@/utils/chat';
import React from 'react';

interface Props {
  sessions: ChatSession[];
}

export const ChatSideBar = async ({ sessions }: Props) => {
  const authSession = await getSession();
  if (!authSession) {
    return null;
  }

  return (
    <aside className={styles.sidebar}>
      <div className="space-y-4 h-full overflow-auto">
        <SideBarNav userId={authSession.user.id as string} />
      </div>
    </aside>
  );
};
