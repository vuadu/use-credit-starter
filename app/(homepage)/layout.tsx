import Footer from '@/components/ui/Footer';
import Navbar from '@/components/ui/Navbar';
import React from 'react';

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Navbar />
      <main
        id="skip"
        className="min-h-[calc(100dvh-4rem)] md:min-h[calc(100dvh-5rem)]"
      >
        {children}
      </main>
      <Footer />
    </>
  );
};

export default HomeLayout;
