import React from 'react';
import { Outlet } from 'react-router-dom';
import { PublicHeader } from './PublicHeader';
import { Footer } from './Footer';

export function PublicLayout() {
  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      <PublicHeader />
      <main className="flex-1 overflow-x-hidden">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
