'use client';

import styles from './styles.module.css';
import React from 'react';
import { VscAdd } from 'react-icons/vsc';

interface Props {
  onClick: () => void;
}

export const NewSessionButton = ({ onClick }: Props) => {
  return (
    <div onClick={onClick}>
      <VscAdd className={styles.menu_icon} />
      <span className="translate-y-[0.5px] text-sm">New chat session</span>
    </div>
  );
};
