import { SideBar } from '@/components/ui/SideBar';
import React from 'react';

const SettingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="container">
      <div className="flex gap-12">
        <SideBar />
        <main className="flex-1 pt-10 pb-[7.5rem]">{children}</main>
      </div>
    </div>
  );
};

export default SettingLayout;
