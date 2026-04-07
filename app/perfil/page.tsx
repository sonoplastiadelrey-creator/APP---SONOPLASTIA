'use client';

import React from 'react';
import AppLayout from '@/components/AppLayout';
import { 
  Camera, 
  Save, 
  Trash2, 
  ChevronLeft,
  AudioLines,
  Monitor
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

export default function PerfilPage() {
  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header Section */}
        <section className="mb-10 text-center md:text-left">
          <h2 className="font-sans font-black text-4xl text-on-surface mb-2 tracking-tighter uppercase">PERFIL DO OPERADOR</h2>
          <p className="font-mono text-on-surface-variant tracking-widest text-sm opacity-70">SYSTEM_UPDATE_PROTOCOL_4.0</p>
        </section>

        <form className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Photo Upload Section */}
            <div className="md:col-span-4 bg-surface-container-low rounded-xl p-8 flex flex-col items-center justify-center border border-outline-variant/15 relative group overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-50"></div>
              <div className="relative w-40 h-40 rounded-full border-4 border-dashed border-outline-variant/40 flex items-center justify-center overflow-hidden bg-surface-container-lowest">
                <img 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuD6jtFRe5qKhzBOK6djKDWrFhjyh3L8nrquEYtH2xu0FVGUgYj_vfMcRTMppdR5T0UHnhsptnlyw16nUz8P7X3n8oAn2-zpPafqpWjaO4p6zrsVJcsqddtlN2YX2JVAUfNC-xsbgFDPQ2kfgZZUkJRFi6BMFb9RZtXFv7BUxYG0O4o9aItvNuJgrdz-2xwex81hnT4FVRTxbryDwl5loXCzyBtL_o2pgG7a6UOxFWY1xI1Rfbr6OMCa9UfEuFOFYJTQ9IjoPWz8aN4" 
                  alt="Profile" 
                  className="absolute inset-0 w-full h-full object-cover opacity-50 grayscale hover:grayscale-0 transition-all duration-500"
                />
                <Camera className="w-10 h-10 text-primary-container z-10" />
              </div>
              <button type="button" className="mt-6 font-mono text-xs font-bold uppercase tracking-widest text-primary-container hover:text-white transition-colors">
                ALTERAR FOTO DE PERFIL
              </button>
            </div>

            {/* Name & Primary Role Section */}
            <div className="md:col-span-8 space-y-6">
              <div className="bg-surface-container-low rounded-xl p-6 border border-outline-variant/15">
                <label className="block font-mono text-[10px] uppercase font-bold text-primary-container mb-2 tracking-[0.2em]">NOME COMPLETO / APELIDO</label>
                <input 
                  type="text" 
                  placeholder="DIGITE O NOME..." 
                  className="w-full bg-surface-container-lowest border-none rounded-lg p-4 text-xl font-sans font-bold text-on-surface placeholder:text-on-surface-variant/20 shadow-inner focus:ring-2 focus:ring-primary-container outline-none transition-all"
                />
              </div>

              <div className="bg-surface-container-low rounded-xl p-6 border border-outline-variant/15">
                <label className="block font-mono text-[10px] uppercase font-bold text-primary-container mb-4 tracking-[0.2em]">ATRIBUIÇÃO DE FUNÇÃO PRINCIPAL</label>
                <div className="grid grid-cols-2 gap-4">
                  <RoleOption id="sonoplasta" title="Sonoplasta" sub="AUDIO_MASTER" icon={AudioLines} active />
                  <RoleOption id="datashow" title="Datashow" sub="VISUAL_ENGINEER" />
                </div>
              </div>
            </div>

            {/* Availability Section */}
            <div className="md:col-span-12 bg-surface-container-low rounded-xl p-8 border border-outline-variant/15">
              <label className="block font-mono text-[10px] uppercase font-bold text-primary-container mb-6 tracking-[0.2em]">Disponibilidade Semanal</label>
              <div className="flex flex-wrap gap-3">
                {['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB', 'DOM'].map(day => (
                  <label key={day} className="cursor-pointer">
                    <input type="checkbox" className="peer hidden" />
                    <div className="px-6 py-4 bg-surface-container-lowest rounded-xl border border-outline-variant/15 peer-checked:border-primary-container peer-checked:bg-primary-container/10 peer-checked:text-primary-container transition-all font-mono font-bold text-sm tracking-widest uppercase">
                      {day}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Action Area */}
          <div className="flex flex-col md:flex-row gap-4 pt-6">
            <button type="submit" className="flex-1 bg-gradient-to-r from-primary-container to-primary text-on-primary-container h-16 rounded-lg font-sans font-black text-lg uppercase tracking-widest shadow-[0_0_30px_rgba(0,163,255,0.3)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3">
              <Save className="w-6 h-6" /> CONFIRMAR ALTERAÇÕES
            </button>
            <button type="button" className="px-10 h-16 rounded-lg font-mono font-bold text-on-surface-variant/60 uppercase tracking-widest border border-outline-variant/20 hover:bg-surface-container-high transition-colors">
              DESCARTAR
            </button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}

function RoleOption({ id, title, sub, icon: Icon, active }: any) {
  return (
    <label className="relative group cursor-pointer">
      <input type="radio" name="role" className="peer hidden" defaultChecked={active} />
      <div className="p-4 bg-surface-container-lowest rounded-lg border border-outline-variant/10 peer-checked:border-primary-container peer-checked:bg-primary-container/10 transition-all flex items-center gap-3">
        {Icon ? <Icon className="w-5 h-5 text-on-surface-variant peer-checked:text-primary-container transition-colors" /> : <Monitor className="w-5 h-5 text-on-surface-variant peer-checked:text-primary-container transition-colors" />}
        <div>
          <span className="block font-sans font-extrabold text-sm text-on-surface">{title}</span>
          <span className="block font-mono text-[10px] text-on-surface-variant opacity-60">{sub}</span>
        </div>
      </div>
      <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary-container rounded-full opacity-0 peer-checked:opacity-100 shadow-[0_0_8px_#00a3ff]"></div>
    </label>
  );
}
