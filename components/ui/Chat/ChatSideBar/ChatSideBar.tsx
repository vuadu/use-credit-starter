'use client';

import styles from './styles.module.css';
import { ChatSession } from '@/types';
import { categorizeAndSortSessions } from '@/utils/chat';
import cn from 'classnames';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import { VscKey, VscHistory, VscHome, VscAdd } from 'react-icons/vsc';
import { v4 as uuidv4 } from 'uuid';

interface Props {
  sessions: ChatSession[];
}

export const ChatSideBar = ({ sessions }: Props) => {
  const s = categorizeAndSortSessions(sessions);

  const pathname = usePathname();
  return (
    <aside className={styles.sidebar}>
      <div className="space-y-8">
        <nav>
          <Link
            href="/settings"
            className={cn(styles.menu_item, {
              [styles.active]: pathname === '/settings'
            })}
          >
            <VscHome className={styles.menu_icon} />
            <span className="translate-y-[0.5px] text-sm">Home</span>
          </Link>
          <Link
            href={`/chat/${uuidv4()}`}
            className={cn(styles.menu_item, {
              [styles.active]: pathname === '/settings'
            })}
          >
            <VscAdd className={styles.menu_icon} />
            <span className="translate-y-[0.5px] text-sm">New chat</span>
          </Link>
        </nav>
        {Object.entries(s).map(([group, sessions], idx) => (
          <div className="space-y-2" key={idx}>
            <div className={styles.group_name}>{group}</div>
            {sessions.map((session) => (
              <Link
                key={session.id}
                href={`/chat/${session.id}`}
                className={cn(styles.menu_item, {
                  [styles.active]: pathname === `/chat/${session.id}`
                })}
              >
                <span className={styles.session_name}>{session.name}</span>
              </Link>
            ))}
          </div>
        ))}
      </div>
    </aside>
  );
};
