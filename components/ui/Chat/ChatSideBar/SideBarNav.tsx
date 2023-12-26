'use client';

import LoadingDots from '../../LoadingDots';
import { SideBarItem } from './SideBarItem';
import styles from './styles.module.css';
import { getSessions, createSession } from '@/server/Chat';
import { ChatSession } from '@/types';
import { categorizeAndSortSessions } from '@/utils/chat';
import cn from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { VscHome, VscAdd } from 'react-icons/vsc';

interface Props {
  userId: string;
}

export const SideBarNav = ({ userId }: Props) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [sessionList, setSessionList] = useState<ChatSession[]>([]);
  const router = useRouter();
  const newSessionHandler = async () => {
    const newSessionId = await createSession(userId);
    if (newSessionId) {
      router.push(`/chat/${newSessionId}`);
    }
  };

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
      setSessionList(s);
    });
  }, []);

  const s = categorizeAndSortSessions(sessionList);

  return (
    <>
      <nav className="py-4 sticky top-0 left-0 z-40 bg-background">
        <Link href="/settings" className={cn(styles.menu_item)}>
          <VscHome className={styles.menu_icon} />
          <span className="translate-y-[0.5px] text-sm">Home</span>
        </Link>
        <div onClick={newSessionHandler} className={cn(styles.menu_item)}>
          <VscAdd className={styles.menu_icon} />
          <span className="translate-y-[0.5px] text-sm">New chat</span>
        </div>
        {/* <NewSessionButton onClick={newSessionHandler} /> */}
      </nav>
      {!isLoaded && (
        <div className="flex justify-center items-center w-full my-4">
          <LoadingDots />
        </div>
      )}
      {Object.entries(s).map(([group, sessions], idx) => (
        <div className="space-y-2" key={idx}>
          <div className={styles.group_name}>{group}</div>
          {sessions.map((session) => (
            <SideBarItem
              key={session.id}
              sessionId={session.id}
              sessionName={session.id}
            />
          ))}
        </div>
      ))}
    </>
  );
};
