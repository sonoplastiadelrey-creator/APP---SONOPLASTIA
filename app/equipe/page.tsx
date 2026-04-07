'use client';

import React from 'react';
import AppLayout from '@/components/AppLayout';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Star, 
  Edit,
  UserPlus,
  TrendingUp
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

const operators = [
  {
    id: '042-X',
    name: 'André Macedo',
    status: 'ATIVO',
    role: 'SONOPLASTA',
    level: 'Operador Sênior',
    progress: 100,
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCziscgvlxRley-miUdrjbpoTRK0h4BuREAp6dE1lpJIpS0F-08CsYwo7wcWaFsKEGcLnDniauRNFl8v5i-RoGs3n0fQwzriI5gXbOb6_5T6kMPLeHHtVhXTcRtML0evB9oIva1X-4upzGHAh3Sxtqc0ZGOyYV0kHSdE3ckgUpgomETi4s7DyQuMWDg2bdJG_rpGSnZTH2sAMSQALPCPjCOjUZtbBrMZZ5u23kJIXJ4_VXAEAiXdOhoX2i8H3GK3C-sghrMUFg67bs'
  },
  {
    id: '089-A',
    name: 'Clara Costa',
    status: 'OFFLINE',
    role: 'OPERADOR DATASHOW',
    level: 'Nível Intermédio',
    progress: 66,
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCanrq8fOWnP0I05zEcSxZOoKN2W11OXX8oU18EmCHgCJitmdwuowL4tulfiE8mojpHQawlu7PkR-EkOngs4clSO2I3KXLV-6l8QLX68jayweLiUXxY5WVKiClayXY2RnGny5cexuzezcE37q_AbRGry27C7JSBQ3Z1fRkKkLtAqeTSIoxvwoPvq2kXYleWDFoc48ohaglJCXjEdYQ3vZYTnOc1QHTVZWFrP1ZDK4uU_K2aAyhBmUO6kPuL_s57pqsm86kIQ07zqcA'
  },
  {
    id: '112-Y',
    name: 'João Pedro',
    status: 'ATIVO',
    role: 'CÂMERA 02',
    level: 'Iniciante',
    progress: 33,
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBqu7o9FU0KTKFPij3be4-S8AgcEge-NTRd5pwMKmZYWOGgJdgi5ik_0MlkOfejueCt4eSgObqq3xuYM4Xic-37bwCojDZrvQWwtrkfdroC8S0HDKqDP-r_kvVVu6nPz401kJ6gf_ZdXgJqkKFlk7Ra7xeTeJwVCOD0Efq1mUWqU65NBF1K7m6DyMsYia8NqpQ7xdqVjrqZ3IbCwu9BDeXhRY5jbm1kjpqF24H6yUF4HT9ns_dAy3mqrjFQ44Wd0OLuR-M9aS2XZ_s'
  },
  {
    id: '001-Z',
    name: 'Ricardo M.',
    status: 'ATIVO',
    role: 'LIGHTING DESIGNER',
    level: 'Líder Sênior',
    progress: 100,
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDlZfRG0X_9GcYNbG8EwTHORwrqVgNOwt1QQ0eCy27pvC7uQMJzLJUm6yVd-HAwSswXoTx852XyA574DEI0NyvDIgLVCEcU8BJLZ1bWAvCh2FxJsd7hgAJVXLYSxsVkuYZeP3GUa_KPKbHGT_X94L6u7DJRMXZP22y0H68oYBisYo_h7ADs4O15wyfQEAch5BfsrR8k7R4ECWVBEzrmyLeajovh319CrGVfKkRegPyQ1Jmxf_4bSBvzSOJKY6_SlCaChugn6sjCaR0'
  }
];

export default function EquipePage() {
  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black text-on-surface tracking-tight font-sans">Equipe de Operadores</h2>
            <p className="text-on-surface-variant font-mono text-sm mt-1">24 Operadores Ativos | 3 em Espera</p>
          </div>
          <div className="flex gap-2">
            <div className="bg-surface-container-low px-4 py-2 rounded-md border border-outline-variant/10 flex items-center gap-2">
              <Search className="w-4 h-4 text-primary-container" />
              <input 
                type="text" 
                placeholder="Buscar especialistas..." 
                className="bg-transparent border-none focus:ring-0 text-sm font-mono text-on-surface placeholder:text-on-surface-variant/40 p-0 w-32 md:w-48"
              />
            </div>
            <button className="bg-surface-container-high text-on-surface px-3 py-2 rounded-md hover:bg-surface-container-highest transition-colors flex items-center gap-2 border border-outline-variant/15">
              <Filter className="w-4 h-4" />
              <span className="font-mono text-xs uppercase font-bold tracking-wider">FILTRAR</span>
            </button>
          </div>
        </div>

        {/* Operators Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {operators.map((op, idx) => (
            <motion.div 
              key={op.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-surface-container-low rounded-xl p-5 border border-outline-variant/5 shadow-lg group hover:border-primary-container/20 transition-all duration-300"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex gap-4">
                  <div className="relative">
                    <div className={cn(
                      "w-14 h-14 rounded-full bg-surface-container-highest p-0.5 overflow-hidden ring-2 ring-offset-2 ring-offset-surface",
                      op.status === 'ATIVO' ? "ring-secondary" : "ring-outline-variant grayscale"
                    )}>
                      <img src={op.avatar} alt={op.name} className="w-full h-full object-cover rounded-full" />
                    </div>
                    <div className={cn(
                      "absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-surface",
                      op.status === 'ATIVO' ? "bg-secondary" : "bg-outline-variant"
                    )}></div>
                  </div>
                  <div>
                    <h3 className="font-sans font-bold text-on-surface">{op.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={cn(
                        "text-[10px] font-mono font-bold px-2 py-0.5 rounded-sm uppercase tracking-tighter",
                        op.status === 'ATIVO' ? "bg-secondary/20 text-secondary" : "bg-surface-container-highest text-on-surface-variant"
                      )}>
                        {op.status}
                      </span>
                      <span className="text-on-surface-variant/60 font-mono text-[10px] uppercase">ID: {op.id}</span>
                    </div>
                  </div>
                </div>
                <button className="text-on-surface-variant hover:text-primary-container transition-colors">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-on-surface-variant/60 font-mono text-[10px] uppercase tracking-widest">FUNÇÃO PRINCIPAL</span>
                  <span className="font-sans font-black text-xs text-primary tracking-tight italic uppercase">{op.role}</span>
                </div>
                <div className="h-1 bg-surface-container-highest rounded-full overflow-hidden">
                  <div 
                    className={cn(
                      "h-full transition-all duration-1000",
                      op.progress === 100 ? "bg-primary-container shadow-[0_0_8px_#00a3ff]" : "bg-tertiary"
                    )} 
                    style={{ width: `${op.progress}%` }}
                  ></div>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-1">
                    <Star className={cn("w-3 h-3", op.progress === 100 ? "text-tertiary fill-tertiary" : "text-on-surface-variant/40")} />
                    <span className="text-on-surface font-mono text-xs">{op.level}</span>
                  </div>
                  <button className="bg-surface-container-high hover:bg-surface-container-highest text-primary-container text-[10px] font-mono font-bold uppercase py-1.5 px-3 rounded-md transition-all active:scale-95 flex items-center gap-2 border border-outline-variant/10">
                    <Edit className="w-3 h-3" /> EDITAR PERFIL
                  </button>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Coverage Summary */}
          <div className="xl:col-span-2 bg-gradient-to-br from-surface-container-low to-surface-container p-6 rounded-xl border border-outline-variant/10 flex flex-col justify-between">
            <div>
              <h4 className="font-sans font-black text-on-surface text-lg mb-4 tracking-tight uppercase">RESUMO DE COBERTURA</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <CoverageStat label="SONOPLASTIA" value={94} color="primary" />
                <CoverageStat label="DATASHOW" value={88} color="secondary" />
                <CoverageStat label="ILUMINAÇÃO" value={100} color="tertiary" />
                <CoverageStat label="CÂMERAS" value={42} color="error" />
              </div>
            </div>
            <div className="mt-6 flex items-center justify-between text-on-surface-variant text-xs font-mono">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-secondary"></span> 12 Especialistas Ativos</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-tertiary"></span> 4 Em Treinamento</span>
              </div>
              <a href="#" className="text-primary-container font-bold hover:underline">Ver Mapa de Escala</a>
            </div>
          </div>
        </div>

        {/* FAB */}
        <button className="fixed bottom-24 right-6 md:bottom-10 md:right-10 w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-r from-primary-container to-primary text-on-primary-container flex items-center justify-center shadow-[0_8px_32px_rgba(0,163,255,0.4)] hover:scale-105 active:scale-95 transition-all z-[60] border border-white/20">
          <UserPlus className="w-6 h-6 md:w-8 md:h-8" />
        </button>
      </div>
    </AppLayout>
  );
}

function CoverageStat({ label, value, color }: any) {
  return (
    <div className="bg-surface/40 p-3 rounded-lg border border-outline-variant/5">
      <p className="text-[10px] text-on-surface-variant font-mono uppercase mb-1">{label}</p>
      <p className={cn(
        "text-2xl font-black font-sans",
        color === 'primary' && "text-primary-container",
        color === 'secondary' && "text-secondary",
        color === 'tertiary' && "text-tertiary",
        color === 'error' && "text-error",
      )}>{value}%</p>
      <div className="w-full h-1 bg-surface-container-highest rounded-full mt-2">
        <div 
          className={cn(
            "h-full rounded-full",
            color === 'primary' && "bg-primary-container",
            color === 'secondary' && "bg-secondary",
            color === 'tertiary' && "bg-tertiary shadow-[0_0_8px_#ffb95f]",
            color === 'error' && "bg-error",
          )} 
          style={{ width: `${value}%` }}
        ></div>
      </div>
    </div>
  );
}
