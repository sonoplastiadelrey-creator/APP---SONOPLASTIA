'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, CalendarDays, HardDrive, Users, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Início', icon: LayoutDashboard, href: '/' },
  { name: 'Escala', icon: CalendarDays, href: '/escala' },
  { name: 'Equipamentos', icon: HardDrive, href: '/equipamentos' },
  { name: 'Equipe', icon: Users, href: '/equipe' },
  { name: 'Perfil', icon: User, href: '/perfil' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col h-screen fixed left-0 top-0 w-64 bg-[#1c1b1c] border-r border-outline-variant/15 z-50">
      <div className="p-6 h-16 flex items-center border-b border-outline-variant/10">
        <span className="text-primary-container font-bold font-mono tracking-wider text-xl">SONOPLASTIA</span>
      </div>
      <nav className="flex-1 py-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-4 px-6 py-3 transition-colors font-mono text-sm uppercase tracking-wider",
                isActive 
                  ? "bg-primary-container/10 text-primary-container border-l-4 border-primary-container" 
                  : "text-on-surface/70 hover:text-on-surface hover:bg-surface-container"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="p-6 mt-auto">
        <div className="bg-surface-container-low p-4 rounded-lg border border-outline-variant/15">
          <p className="font-mono text-[10px] text-on-surface-variant uppercase mb-2">Suporte Técnico</p>
          <button className="w-full py-2 bg-surface-container-highest text-primary font-mono text-xs font-bold rounded-md border border-outline-variant/10 active:scale-95 transition-transform">
            CHAMAR TÉCNICO
          </button>
        </div>
      </div>
    </aside>
  );
}

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-20 bg-surface flex justify-around items-center px-4 z-50 border-t border-outline-variant/15 shadow-2xl">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center transition-all active:scale-90",
              isActive ? "text-primary-container" : "text-on-surface/50"
            )}
          >
            <item.icon className="w-6 h-6" />
            <span className="font-mono text-[10px] uppercase mt-1">{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export function TopBar() {
  return (
    <header className="fixed top-0 right-0 left-0 md:left-64 z-50 bg-surface text-primary-container font-sans font-black tracking-tight uppercase shadow-lg flex justify-between items-center px-6 h-16 border-b border-outline-variant/10">
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-bold tracking-widest">SONOPLASTIA</h1>
      </div>
      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-surface-container-high rounded-md">
          <span className="w-2 h-2 rounded-full bg-secondary shadow-[0_0_8px_#4ae176]"></span>
          <span className="font-mono text-xs font-bold text-on-surface">SISTEMA ONLINE</span>
        </div>
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCnG3Sj9HAcbQ47B1px3v1PAfNySTzw4D4KJH6QfO4h30UQNgX6o7_2NN5mCdSs72DDfcY5uyd1hYnJHrn5V3pS3BsfRbyPQ5Em7lPhTmeqxiseVE_RPFf9Bb3G5I6za9Ux4gL-eCeQNTktMgEASHvxGiywVTPUXh9m2n4mmvBIsUiWtSuUMXVAMrsNJJuxrOMx-XPp0IKUnZIMstDoyFAcsw_RWzQcJwC-1ILTVHIt9jDX5DgHM9MB4ES1h6Z4LfS4iGCklhV7JaE"
          alt="Avatar"
          className="w-8 h-8 rounded-full border border-primary/30"
        />
      </div>
    </header>
  );
}
