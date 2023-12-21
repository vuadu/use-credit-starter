'use client';

import styles from './styles.module.css';
import { ChatSession } from '@/types';
import { categorizeAndSortSessions } from '@/utils/chat';
import cn from 'classnames';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import { VscKey, VscHistory, VscHome } from 'react-icons/vsc';

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
        </nav>
        {Object.entries(s).map(([group, sessions]) => (
          <div className="space-y-2" key={group}>
            <div className={styles.group_name}>{group}</div>
            {sessions.map((session) => (
              <Link
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
