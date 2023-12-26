'use client';

import styles from './styles.module.css';
import cn from 'classnames';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

interface Props {
  sessionId: string;
  sessionName: string;
}

export const SideBarItem = ({ sessionId, sessionName }: Props) => {
  const pathname = usePathname();
  return (
    <Link
      key={sessionId}
      href={`/chat/${sessionId}`}
      className={cn(styles.menu_item, {
        [styles.active]: pathname === `/chat/${sessionId}`
      })}
    >
      <span className={styles.session_name}>{sessionName}</span>
    </Link>
  );
};
