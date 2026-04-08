'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, CalendarDays, HardDrive, Users, User, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/components/AuthProvider';

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
                "flex items-center gap-4 px-6 py-3 transition-all font-mono text-sm uppercase tracking-wider border-l-4",
                isActive 
                  ? "bg-primary-container/10 text-primary-container border-primary-container" 
                  : "text-on-surface/70 hover:text-on-surface hover:bg-surface-container border-transparent"
              )}
            >
              <item.icon className="w-5 h-5 transition-transform group-hover:scale-110" />
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

import { useRouter } from 'next/navigation';

export function TopBar() {
  const { profile, user, signOut } = useAuth();
  const router = useRouter();
  
  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'Agente';
  const avatarUrl = profile?.avatar_url || `https://ui-avatars.com/api/?name=${displayName}&background=00a3ff&color=fff`;

  return (
    <header className="fixed top-0 right-0 left-0 md:left-64 z-50 bg-[#0f0f12]/80 backdrop-blur-xl text-white font-sans font-black tracking-tight uppercase flex justify-between items-center px-6 h-16 border-b border-white/5">
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-black tracking-widest italic text-[#00a3ff]">SONOPLASTIA</h1>
      </div>
      <div className="flex items-center gap-6">
        <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-white/5 rounded-lg border border-white/5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#4ae176] shadow-[0_0_8px_#4ae176]"></span>
          <span className="font-mono text-[9px] font-black text-white/60 tracking-widest leading-none">SISTEMA ONLINE</span>
        </div>
        
        <div className="flex items-center gap-4 group">
          <div className="text-right hidden sm:block">
             <p className="font-sans text-[11px] font-black text-white leading-none mb-0.5">{displayName.toUpperCase()}</p>
             <p className="font-mono text-[8px] text-white/20 font-black uppercase tracking-widest">{profile?.funcao || 'OPERADOR'}</p>
          </div>
          <Link href="/perfil" className="relative group">
            <img
              src={avatarUrl}
              alt="Avatar"
              className="w-9 h-9 rounded-xl border border-white/10 group-hover:border-[#00a3ff]/40 transition-all object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${displayName}&background=00a3ff&color=fff`;
              }}
            />
            <div className="absolute inset-0 rounded-xl bg-[#00a3ff]/0 group-hover:bg-[#00a3ff]/10 transition-all pointer-events-none" />
          </Link>
          <button 
            onClick={handleSignOut}
            className="p-2 hover:bg-red-500/10 rounded-lg text-white/20 hover:text-red-500 transition-all"
            title="Sair"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
