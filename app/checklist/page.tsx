'use client';

import React from 'react';
import AppLayout from '@/components/AppLayout';
import { 
  Music, 
  Video, 
  CheckCircle2, 
  Mic2, 
  AlertTriangle,
  History,
  PlayCircle,
  Lock
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

const checklistItems = [
  {
    id: 1,
    title: 'Hinos no Holyrics',
    sub: 'Verificar repertório',
    icon: Music,
    checked: false,
    primary: true
  },
  {
    id: 2,
    title: 'Aberturas e Mídia',
    sub: 'Fotos e vídeos OK?',
    icon: Video,
    checked: false
  },
  {
    id: 3,
    title: 'Mesa ligada',
    sub: 'Check às 18:45',
    icon: CheckCircle2,
    checked: true
  },
  {
    id: 4,
    title: 'Microfones testados',
    sub: 'Pendente',
    icon: Mic2,
    checked: false
  }
];

export default function ChecklistPage() {
  return (
    <AppLayout>
      <div className="max-w-md mx-auto space-y-6">
        {/* Service Info Header */}
        <section className="bg-surface-container-low rounded-xl p-5 border-l-4 border-secondary">
          <div className="flex justify-between items-start mb-2">
            <div className="space-y-1">
              <span className="font-mono text-[10px] tracking-widest text-on-surface-variant uppercase">Status do Sistema</span>
              <h2 className="font-sans font-bold text-lg leading-tight uppercase tracking-tight">Culto de Domingo</h2>
            </div>
            <div className="flex items-center gap-2 bg-secondary/10 px-3 py-1 rounded-full border border-secondary/20">
              <div className="w-2 h-2 rounded-full bg-secondary status-pulse"></div>
              <span className="font-mono font-bold text-[11px] text-secondary tracking-wider">EM ANDAMENTO</span>
            </div>
          </div>
          <div className="flex items-center gap-4 mt-4">
            <div className="flex -space-x-2">
              <div className="w-6 h-6 rounded-full border-2 border-surface-container-low bg-surface-container-highest flex items-center justify-center text-[8px] font-bold">JD</div>
              <div className="w-6 h-6 rounded-full border-2 border-surface-container-low bg-surface-container-highest flex items-center justify-center text-[8px] font-bold">AM</div>
            </div>
            <span className="text-xs text-on-surface-variant font-mono">2 Operadores Ativos</span>
          </div>
        </section>

        {/* Tabs Navigation */}
        <nav className="flex w-full bg-surface-container-lowest rounded-xl p-1 gap-1">
          <button className="flex-1 py-3 flex flex-col items-center justify-center gap-1 rounded-lg bg-surface-container-high text-primary-container shadow-sm border border-outline-variant/10">
            <History className="w-4 h-4" />
            <span className="font-mono text-[10px] font-bold tracking-widest uppercase">ANTES</span>
          </button>
          <button className="flex-1 py-3 flex flex-col items-center justify-center gap-1 rounded-lg text-on-surface-variant/60">
            <PlayCircle className="w-4 h-4" />
            <span className="font-mono text-[10px] font-bold tracking-widest uppercase">DURANTE</span>
          </button>
          <button className="flex-1 py-3 flex flex-col items-center justify-center gap-1 rounded-lg text-on-surface-variant/30 grayscale">
            <Lock className="w-4 h-4" />
            <span className="font-mono text-[10px] font-bold tracking-widest uppercase">DEPOIS</span>
          </button>
        </nav>

        {/* Checklist Items */}
        <section className="space-y-3">
          <h3 className="font-mono text-[11px] font-bold tracking-widest text-on-surface-variant uppercase px-1">Checklist Pré-Culto</h3>
          <div className="space-y-3">
            {checklistItems.map((item, idx) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={cn(
                  "flex items-center justify-between p-5 bg-surface-container rounded-xl border shadow-lg active:scale-[0.98] transition-all",
                  item.primary ? "border-l-4 border-primary-container" : "border-outline-variant/5",
                  item.checked && "opacity-60"
                )}
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center",
                    item.checked ? "bg-secondary-container text-on-secondary-container" : 
                    item.primary ? "border-2 border-primary-container text-primary-container" : "border-2 border-outline-variant/30 text-on-surface-variant"
                  )}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className={cn(
                      "font-sans font-bold text-on-surface text-lg",
                      item.checked && "line-through decoration-2"
                    )}>{item.title}</p>
                    <p className={cn(
                      "text-[10px] font-mono uppercase tracking-wider",
                      item.primary ? "text-primary" : "text-on-surface-variant"
                    )}>{item.sub}</p>
                  </div>
                </div>
                {!item.checked && <div className="w-6 h-6 rounded-full border-2 border-outline-variant/40" />}
              </motion.div>
            ))}
          </div>
        </section>

        {/* Rapid Report Button */}
        <button className="w-full mt-8 bg-tertiary text-on-tertiary py-5 rounded-xl flex items-center justify-center gap-3 active:scale-95 transition-all duration-150 shadow-[0_8px_24px_rgba(218,139,0,0.2)]">
          <AlertTriangle className="w-6 h-6" />
          <span className="font-sans font-extrabold uppercase tracking-tight text-lg">Registrar Problema</span>
        </button>
      </div>
    </AppLayout>
  );
}
