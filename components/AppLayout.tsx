'use client';

import React from 'react';
import { Sidebar, BottomNav, TopBar } from '@/components/Navigation';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <Sidebar />
      <div className="md:pl-64">
        <TopBar />
        <main className="pt-20 pb-24 md:pb-8 px-4 md:px-8 max-w-7xl mx-auto">
          {children}
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
