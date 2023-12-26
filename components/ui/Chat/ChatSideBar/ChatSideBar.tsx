'use client';

import LoadingDots from '../../LoadingDots';
import { SideBarItem } from './SideBarItem';
import styles from './styles.module.css';
import { ChatContext } from '@/app/context/ChatContext';
import { getSessions, createSession } from '@/server/Chat';
import { ChatSession } from '@/types';
import { categorizeAndSortSessions } from '@/utils/chat';
import cn from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useContext } from 'react';
import { VscHome, VscAdd } from 'react-icons/vsc';

export const ChatSideBar = () => {
  const router = useRouter();
  const { isLoaded, chatSessions, userRef, addNewSession } =
    useContext(ChatContext);
  console.log('load', isLoaded, chatSessions);
  const newSessionHandler = async () => {
    // const newSession = await createSession(userRef);
    // if (newSession) {
    //   const newS: ChatSession = {
    //     id: newSession.id,
    //     name: newSession.attributes.name || 'Untitled',
    //     updatedAt: newSession.attributes.inserted_at,
    //     createdAt: newSession.attributes.inserted_at
    //   };

    //   router.push(`/chat/${newSession.id}`);
    // }

    const newSession = await addNewSession();
    if (newSession) {
      router.push(`/chat/${newSession.id}`);
    }
  };

  const s = categorizeAndSortSessions(chatSessions);
  return (
    <aside className={styles.sidebar}>
      <div className="space-y-4 h-full overflow-auto">
        <nav className="py-4 sticky top-0 left-0 z-40 bg-background">
          <Link href="/settings" className={cn(styles.menu_item)}>
            <VscHome className={styles.menu_icon} />
            <span className="translate-y-[0.5px] text-sm">Home</span>
          </Link>
          <div onClick={newSessionHandler} className={cn(styles.menu_item)}>
            <VscAdd className={styles.menu_icon} />
            <span className="translate-y-[0.5px] text-sm">New chat</span>
          </div>
          {/* <Link href="/chat" className={cn(styles.menu_item)}>
            <VscAdd className={styles.menu_icon} />
            <span className="translate-y-[0.5px] text-sm">New chat</span>
          </Link> */}
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
      </div>
    </aside>
  );
};
