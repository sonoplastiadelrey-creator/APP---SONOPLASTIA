'use client';

import React from 'react';
import AppLayout from '@/components/AppLayout';
import { 
  Clock, 
  Calendar, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  RefreshCcw,
  Mic2,
  FileText,
  UserPlus
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

export default function Dashboard() {
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Próximo Culto Widget */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary-container/20 to-surface-container border border-primary/20 p-6 md:p-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h2 className="font-mono text-xs text-primary-container font-bold uppercase tracking-[0.2em] mb-1">Próximo Culto</h2>
              <h3 className="font-sans text-3xl font-black text-on-surface">DOMINGO MANHÃ</h3>
              <p className="font-mono text-on-surface-variant text-sm mt-2 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                09:00 - Celebração da Família
              </p>
            </div>
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <span className="font-sans text-4xl font-black text-primary-container">02</span>
                <span className="font-mono text-[10px] text-on-surface-variant uppercase">Dias</span>
              </div>
              <span className="text-outline-variant text-3xl font-light self-start mt-1">:</span>
              <div className="flex flex-col items-center">
                <span className="font-sans text-4xl font-black text-primary-container">14</span>
                <span className="font-mono text-[10px] text-on-surface-variant uppercase">Horas</span>
              </div>
              <span className="text-outline-variant text-3xl font-light self-start mt-1">:</span>
              <div className="flex flex-col items-center">
                <span className="font-sans text-4xl font-black text-primary-container">45</span>
                <span className="font-mono text-[10px] text-on-surface-variant uppercase">Min</span>
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 h-1 bg-primary-container w-2/3"></div>
        </motion.section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ESCALA DA SEMANA */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-sans text-xl font-bold tracking-tight text-on-surface">ESCALA DA SEMANA</h2>
              <span className="font-mono text-[10px] text-on-surface-variant bg-surface-container-high px-3 py-1 rounded-full border border-outline-variant/10">NOVEMBRO - SEMANA 03</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Quarta-Feira */}
              <ScheduleCard 
                date="15 NOV" 
                title="QUARTA-FEIRA" 
                status="Completo"
                statusType="success"
                staff={[
                  { role: 'SONOPLASTA', name: 'Ricardo Silva', icon: 'mix' },
                  { role: 'DATASHOW', name: 'Ana Paula', icon: 'screen' },
                  { role: 'BACKUP', name: 'Marcos Oliveira', icon: 'backup' },
                ]}
              />
              {/* Sábado */}
              <ScheduleCard 
                date="18 NOV" 
                title="SÁBADO (JOVENS)" 
                status="Pendente"
                statusType="warning"
                staff={[
                  { role: 'SONOPLASTA', name: 'Thiago Souza', icon: 'mix' },
                  { role: 'DATASHOW', name: 'A DEFINIR', icon: 'screen', warning: true },
                  { role: 'BACKUP', name: 'Gabriel Lima', icon: 'backup' },
                ]}
              />
              {/* Domingo Manhã */}
              <ScheduleCard 
                date="19 NOV" 
                title="DOMINGO MANHÃ" 
                status="Confirmado"
                statusType="success"
                highlight
                staff={[
                  { role: 'SONOPLASTA', name: 'Bruno Mello', icon: 'mix', confirmed: true },
                  { role: 'DATASHOW', name: 'Carla Santos', icon: 'screen', confirmed: true },
                  { role: 'BACKUP', name: 'PENDENTE', icon: 'backup', warning: true },
                ]}
              />
              {/* Domingo Noite */}
              <ScheduleCard 
                date="19 NOV" 
                title="DOMINGO NOITE" 
                status="Crítico"
                statusType="error"
                staff={[
                  { role: 'SONOPLASTA', name: 'VAGO', icon: 'mix', error: true },
                  { role: 'DATASHOW', name: 'Lucas Peixoto', icon: 'screen' },
                  { role: 'BACKUP', name: 'FALTA', icon: 'backup', error: true },
                ]}
              />
            </div>
          </div>

          {/* Hardware Status Sidebar */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-sans text-xl font-bold tracking-tight text-on-surface uppercase">Hardware</h2>
              <RefreshCcw className="w-5 h-5 text-primary-container cursor-pointer hover:rotate-180 transition-transform duration-500" />
            </div>
            
            <div className="bg-surface-container-low p-6 rounded-lg border border-outline-variant/10 space-y-6">
              <HardwareMetric label="Console Principal" status="ONLINE" value={98} color="secondary" subLeft="Latency: 2ms" subRight="Temp: 38°C" />
              <HardwareMetric label="Rede Dante" status="ESTÁVEL" value={85} color="secondary" subLeft="Sync Status: Locked" subRight="Devices: 12/12" />
              
              <div className="space-y-4">
                <p className="font-mono text-[10px] text-on-surface-variant uppercase tracking-widest border-b border-outline-variant/10 pb-2">Baterias Mics</p>
                <BatteryItem label="MIC 01 (Líder)" value={90} color="secondary" />
                <BatteryItem label="MIC 02 (Pregador)" value={45} color="tertiary" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <QuickActionButton icon={FileText} label="Ver Roteiro" />
              <QuickActionButton icon={UserPlus} label="Pedir Substituição" />
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

function ScheduleCard({ date, title, status, statusType, staff, highlight }: any) {
  return (
    <div className={cn(
      "bg-surface-container-low p-5 rounded-lg border border-outline-variant/10 hover:bg-surface-container transition-colors group",
      highlight && "border-2 border-primary-container/30 shadow-lg"
    )}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <span className="font-mono text-[10px] text-on-surface-variant uppercase font-bold">{date}</span>
          <h4 className="font-sans font-bold text-on-surface">{title}</h4>
        </div>
        <span className={cn(
          "px-2 py-0.5 font-mono text-[10px] font-bold rounded border uppercase",
          statusType === 'success' && "bg-secondary/10 text-secondary border-secondary/20",
          statusType === 'warning' && "bg-tertiary/10 text-tertiary border-tertiary/20",
          statusType === 'error' && "bg-error/10 text-error border-error/20",
        )}>
          {status}
        </span>
      </div>
      <div className="space-y-3">
        {staff.map((s: any, idx: number) => (
          <div key={idx} className={cn(
            "flex items-center justify-between p-2 rounded",
            idx === 0 && highlight ? "bg-primary-container/5" : ""
          )}>
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-on-surface-variant">{s.role}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={cn(
                "font-sans text-sm",
                s.confirmed ? "font-black text-on-surface" : "text-on-surface",
                s.warning && "text-tertiary font-bold",
                s.error && "text-error font-black uppercase text-xs"
              )}>
                {s.name}
              </span>
              {s.confirmed && <CheckCircle2 className="w-3 h-3 text-secondary" />}
              {s.warning && <AlertTriangle className="w-3 h-3 text-tertiary animate-pulse" />}
              {s.error && <XCircle className="w-3 h-3 text-error" />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function HardwareMetric({ label, status, value, color, subLeft, subRight }: any) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs font-mono uppercase">
        <span className="text-on-surface">{label}</span>
        <span className={cn("font-bold", color === 'secondary' ? "text-secondary" : "text-tertiary")}>{status}</span>
      </div>
      <div className="h-2 bg-surface-container-lowest rounded-full overflow-hidden">
        <div 
          className={cn(
            "h-full transition-all duration-1000",
            color === 'secondary' ? "bg-secondary shadow-[0_0_8px_#4ae176]" : "bg-tertiary shadow-[0_0_8px_#ffb95f]"
          )} 
          style={{ width: `${value}%` }}
        ></div>
      </div>
      <div className="flex justify-between font-mono text-[10px] text-on-surface-variant">
        <span>{subLeft}</span>
        <span>{subRight}</span>
      </div>
    </div>
  );
}

function BatteryItem({ label, value, color }: any) {
  return (
    <div className="flex justify-between items-center">
      <span className="font-mono text-xs text-on-surface">{label}</span>
      <div className="flex items-center gap-2">
        <div className="w-10 h-4 border border-outline-variant/30 rounded-sm relative p-0.5">
          <div 
            className={cn(
              "h-full rounded-sm",
              color === 'secondary' ? "bg-secondary" : "bg-tertiary"
            )} 
            style={{ width: `${value}%` }}
          ></div>
        </div>
        <span className={cn("font-mono text-[10px] font-bold", color === 'secondary' ? "text-on-surface" : "text-tertiary")}>
          {value}%
        </span>
      </div>
    </div>
  );
}

function QuickActionButton({ icon: Icon, label }: any) {
  return (
    <button className="flex flex-col items-center justify-center p-4 bg-surface-container border border-outline-variant/10 rounded-lg hover:bg-surface-container-high transition-all active:scale-95 group">
      <Icon className="w-6 h-6 text-primary-container mb-2 group-hover:scale-110 transition-transform" />
      <span className="font-mono text-[10px] uppercase font-bold text-on-surface">{label}</span>
    </button>
  );
}
