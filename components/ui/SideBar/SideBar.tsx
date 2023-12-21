'use client';

import styles from './SideBar.module.css';
import cn from 'classnames';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import { VscKey, VscHistory, VscHome } from 'react-icons/vsc';

export const SideBar = () => {
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
        <div className="space-y-2">
          <div className={styles.menu_section}>Usage</div>
          <Link
            href="/settings/credit-history"
            className={cn(styles.menu_item, {
              [styles.active]: pathname === '/settings/credit-history'
            })}
          >
            <VscHistory className={styles.menu_icon} />
            <span className={styles.menu_label}>Credit History</span>
          </Link>
        </div>
        <div className="space-y-2">
          <div className={styles.menu_section}>Developers</div>
          <Link
            href="/settings/api-keys"
            className={cn(styles.menu_item, {
              [styles.active]: pathname === '/settings/api-keys'
            })}
          >
            <VscKey className={styles.menu_icon} />
            <span className={styles.menu_label}>API Keys</span>
          </Link>
        </div>
      </div>
    </aside>
  );
};
