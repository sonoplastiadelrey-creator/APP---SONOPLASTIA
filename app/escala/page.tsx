'use client';

import React from 'react';
import AppLayout from '@/components/AppLayout';
import { 
  Calendar, 
  Clock, 
  Settings2, 
  Monitor, 
  ShieldCheck,
  Edit
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

const days = [
  { day: 'SEG', date: '23', active: false },
  { day: 'TER', date: '24', active: false },
  { day: 'QUA', date: '25', active: false },
  { day: 'QUI', date: '26', active: true },
  { day: 'SEX', date: '27', active: false },
  { day: 'SAB', date: '28', active: false },
  { day: 'DOM', date: '29', active: false },
];

const services = [
  {
    title: 'Quinta',
    time: '19:30 — 21:00',
    live: true,
    staff: [
      { name: 'Marcus Chen', role: 'Engenheiro de Som Líder', icon: Settings2, initial: 'S' },
      { name: 'Elena Rodriguez', role: 'Operador de Datashow', icon: Monitor, initial: 'D' },
    ]
  },
  {
    title: 'Sábado',
    time: '18:00 — 20:00',
    staff: [
      { name: 'Sarah Jenkins', role: 'Técnico de Som', initial: 'S' },
      { name: 'A DEFINIR', role: 'Backup Necessário', initial: 'B', empty: true },
    ]
  },
  {
    title: 'Domingo',
    time: '09:00 — 12:00',
    staff: [
      { name: 'David Wu', role: 'Engenheiro de Som Líder', initial: 'S' },
      { name: 'Lisa Ray', role: 'Operador de Datashow', initial: 'D' },
      { name: 'Marcus Chen', role: 'Backup do Sistema', initial: 'B' },
    ]
  }
];

export default function EscalaPage() {
  return (
    <AppLayout>
      <div className="max-w-md mx-auto space-y-8">
        {/* Date Selector */}
        <section>
          <div className="flex justify-between items-end mb-4">
            <div>
              <p className="font-mono text-primary-container uppercase tracking-widest text-[10px] mb-1">PERÍODO ATUAL</p>
              <h2 className="font-sans font-bold text-lg">Outubro 2023</h2>
            </div>
            <span className="font-mono text-on-surface-variant text-xs">Semana 42</span>
          </div>
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
            {days.map((d) => (
              <div 
                key={d.date}
                className={cn(
                  "flex-shrink-0 w-14 h-20 rounded-xl flex flex-col items-center justify-center border transition-all",
                  d.active 
                    ? "bg-primary-container text-on-primary-container border-primary-container shadow-[0_0_20px_rgba(0,163,255,0.3)]" 
                    : "bg-surface-container-low border-outline-variant/10 text-on-surface"
                )}
              >
                <span className={cn("font-mono text-[10px] uppercase", d.active ? "font-bold" : "text-on-surface-variant")}>{d.day}</span>
                <span className="font-sans font-bold text-lg">{d.date}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Scheduled Services */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-4 h-4 text-primary-container" />
            <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] text-on-surface-variant font-bold">CULTOS AGENDADOS</h3>
          </div>

          {services.map((service, idx) => (
            <motion.div 
              key={service.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={cn(
                "bg-surface-container-low rounded-xl p-4 border-l-4 shadow-lg",
                service.live ? "border-primary-container" : "border-outline-variant"
              )}
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h4 className="font-sans font-extrabold text-xl tracking-tight">{service.title}</h4>
                  <div className="flex items-center gap-2 mt-1 text-on-surface-variant">
                    <Clock className="w-3 h-3" />
                    <span className="font-mono text-xs font-medium">{service.time}</span>
                  </div>
                </div>
                {service.live && (
                  <div className="bg-surface-container-highest px-3 py-1 rounded-sm border border-outline-variant/20">
                    <span className="font-mono text-[10px] font-bold text-secondary">AO VIVO</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 gap-3">
                {service.staff.map((member: any, mIdx) => (
                  <div key={mIdx} className={cn(
                    "flex items-center justify-between bg-surface-container/50 p-3 rounded-lg border border-outline-variant/10",
                    member.empty && "opacity-60"
                  )}>
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-8 h-8 rounded flex items-center justify-center font-mono font-bold text-xs",
                        member.initial === 'S' ? "bg-primary-container/10 text-primary-container" : 
                        member.initial === 'D' ? "bg-tertiary/10 text-tertiary" : "bg-outline-variant/20 text-on-surface-variant"
                      )}>
                        {member.initial}
                      </div>
                      <div>
                        <p className="text-sm font-bold">{member.name}</p>
                        <p className="text-[10px] text-on-surface-variant font-mono uppercase">{member.role}</p>
                      </div>
                    </div>
                    {member.icon && <member.icon className="w-4 h-4 text-on-surface-variant/40" />}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </section>

        {/* FAB */}
        <button className="fixed bottom-24 right-6 w-14 h-14 bg-primary-container text-on-primary-container rounded-xl shadow-[0_8px_32px_rgba(0,163,255,0.4)] flex items-center justify-center active:scale-90 transition-all z-[60]">
          <Edit className="w-6 h-6" />
        </button>
      </div>
    </AppLayout>
  );
}
