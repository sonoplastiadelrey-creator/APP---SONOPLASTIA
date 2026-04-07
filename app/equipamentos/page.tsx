'use client';

import React from 'react';
import AppLayout from '@/components/AppLayout';
import { 
  PlusCircle, 
  Bell, 
  Search,
  CheckCircle2,
  AlertCircle,
  XCircle
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

const inventory = [
  {
    id: 'MIC-058-AX',
    name: 'Shure SM58 Dynamic',
    qty: 12,
    status: 'BOM',
    statusColor: 'secondary',
    lastMaintenance: '12 OCT 2023',
    technician: 'Rick B.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuApDU5JV-V9uAW71MpSFGCO7M3K8bTRATrhLgtLokJkV5H56RYQ3qky8mEh5hoa9w0pNWoOETULO14gnN0P-9-nHPT5O3cM7sw6CBExvPzdl6mAX93wIRoj26_yYleM_XoaTHISlCRtWgP9koYA_zy9e4LfvyMwPTqXOqgNIgB2VHY7QE672IobeGeirYQlcXgAZ0eWQTD7y16b_5eA2eHo4jO4CYjwA4IS7-FxMNzkEMx7xhOyz6DX1yf9P4n1zVPujJNTkYsgQts'
  },
  {
    id: 'MXR-SQ7-01',
    name: 'Allen & Heath SQ-7',
    qty: 1,
    status: 'MANUTENÇÃO',
    statusColor: 'tertiary',
    lastMaintenance: '04 NOV 2023',
    technician: 'Alex S.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCg8kInozNLGJ5zrqGXcyYQbIy2k9lUNq-RmFq2RQCeqFJas-wxI5AeLJDLlnrEo1-MNxP7yvSErSWpMuTJ0eIQ4L9W569yNk8kc2RLwUdRp-d2LcR3f3r9fQvuo7fqdI9zqecJpDVOKSHPP5RXWjNSzZHV0bx4XaoWjTor_KPLaPig8NT9W62e1IHgwxT0uwtZd_yHhe9ugARj_NmYYqflc5IJKwvL75C1OwM5tU1gROp-dDG4xtcfurdjC3fKx8jhFXqOiyeZGcc'
  },
  {
    id: 'CBL-XLR-10',
    name: 'XLR Cable 10m Balanced',
    qty: 48,
    status: 'DEFEITO',
    statusColor: 'error',
    lastMaintenance: '28 OCT 2023',
    technician: 'Rick B.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD2gcZx7hiEFVEQK_0Llxf7jtLIjLr63KHcx9il4ODFb16GB2AbQqDfIcaAcso3SwnkVaMsrVIrHj0ha1P-HRK81p4Scg25egmiE71myyh-5LmlsqitovgUvhaGokNXAjLF3sWOLyGXbJATFZexS86nHUgDnaToZ6-64AD1CTDJ_fHmcpkM2cQF6f29ONatgxmwuQtJoeqQ2kFKMnV-kMwHdWUwmN-d0Mnrvuh1AQGrgHe8He3ORR7-gjTumSFR81m7apSJYuJXPyQ'
  },
  {
    id: 'SPK-VTX-A12',
    name: 'JBL VTX A12 Array',
    qty: 8,
    status: 'BOM',
    statusColor: 'secondary',
    lastMaintenance: '15 SEP 2023',
    technician: 'Alex S.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC0K_V1UiZHAwDANRKUksEeE6e7GGKITTBhqxyeRqBBaIF3y5gY4BXxsJLdcBE2CD34TKsjQ3Nd04bkjieUvZ4awgDfCHL9OgRvLzh3gpJgHgalIf61s7l5UapaKSGXxwzyM4EpApVeNhwnH3eVYx3MYpv-bEZFSs5DID7Av37rkEGiFHOtLGbIhECIJn-1mRGA6R19vHOozzY0IJLN411vvQEY8CQARWewsEY0vTjaGhIe6DYTC7SgwcDwZI7nXKBOoWpeC94J9qo'
  }
];

export default function EquipamentosPage() {
  return (
    <AppLayout>
      <div className="max-w-md mx-auto space-y-8">
        {/* Header & Stats */}
        <div className="space-y-4">
          <h2 className="font-sans font-bold text-2xl tracking-tight text-on-surface uppercase">INVENTÁRIO</h2>
          <div className="flex gap-2">
            <div className="flex-1 bg-surface-container-low p-3 rounded-lg">
              <span className="block font-mono text-[10px] tracking-widest text-on-surface-variant uppercase">TOTAL DE ITENS</span>
              <span className="font-sans font-bold text-xl text-primary-container">142</span>
            </div>
            <div className="flex-1 bg-surface-container-low p-3 rounded-lg">
              <span className="block font-mono text-[10px] tracking-widest text-on-surface-variant uppercase">SAÚDE</span>
              <span className="font-sans font-bold text-xl text-secondary">94%</span>
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <nav className="flex space-x-2 overflow-x-auto pb-4 no-scrollbar">
          <button className="bg-primary-container text-on-primary-container px-4 py-2 rounded-md font-mono text-xs font-bold tracking-wider uppercase whitespace-nowrap">Todos</button>
          <button className="bg-surface-container text-on-surface-variant px-4 py-2 rounded-md font-mono text-xs font-medium tracking-wider uppercase whitespace-nowrap hover:bg-surface-container-high transition-colors">Microfones</button>
          <button className="bg-surface-container text-on-surface-variant px-4 py-2 rounded-md font-mono text-xs font-medium tracking-wider uppercase whitespace-nowrap hover:bg-surface-container-high transition-colors">Cabos</button>
          <button className="bg-surface-container text-on-surface-variant px-4 py-2 rounded-md font-mono text-xs font-medium tracking-wider uppercase whitespace-nowrap hover:bg-surface-container-high transition-colors">Mixer/PA</button>
        </nav>

        {/* Inventory List */}
        <div className="space-y-4">
          {inventory.map((item, idx) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-surface-container rounded-xl overflow-hidden group active:scale-[0.98] transition-transform border border-outline-variant/5"
            >
              <div className="flex h-32">
                <div className="w-1/3 relative">
                  <img src={item.image} alt={item.name} className={cn("w-full h-full object-cover", item.statusColor === 'tertiary' && "grayscale opacity-60")} />
                  <div className="absolute top-2 left-2 bg-surface/80 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-mono font-bold text-primary-container">QTD: {item.qty}</div>
                </div>
                <div className="w-2/3 p-4 flex flex-col justify-between border-l border-outline-variant/15">
                  <div>
                    <div className="flex justify-between items-start">
                      <h3 className="font-sans font-bold text-sm text-on-surface leading-tight">{item.name}</h3>
                      <div className={cn(
                        "w-3 h-3 rounded-full shadow-lg",
                        item.statusColor === 'secondary' && "bg-secondary shadow-secondary/50",
                        item.statusColor === 'tertiary' && "bg-tertiary shadow-tertiary/50",
                        item.statusColor === 'error' && "bg-error shadow-error/50",
                      )}></div>
                    </div>
                    <p className="font-mono text-[10px] text-on-surface-variant mt-1 uppercase tracking-tighter">ID: {item.id}</p>
                  </div>
                  <div className="flex justify-between items-end">
                    <div className="space-y-1">
                      <span className="block font-mono text-[9px] uppercase tracking-widest text-on-surface-variant/60">ÚLTIMA MANUTENÇÃO</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-medium text-on-surface">{item.lastMaintenance}</span>
                        <span className="text-[10px] font-mono text-on-surface-variant">— {item.technician}</span>
                      </div>
                    </div>
                    <span className={cn(
                      "font-mono text-[10px] font-bold uppercase",
                      item.statusColor === 'secondary' && "text-secondary",
                      item.statusColor === 'tertiary' && "text-tertiary",
                      item.statusColor === 'error' && "text-error",
                    )}>{item.status}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Add Button */}
        <button className="w-full bg-primary-container text-on-primary-container py-4 rounded-xl font-sans font-bold uppercase tracking-tight flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-lg shadow-primary-container/20">
          <PlusCircle className="w-5 h-5" /> ADICIONAR EQUIPAMENTO
        </button>
      </div>
    </AppLayout>
  );
}
