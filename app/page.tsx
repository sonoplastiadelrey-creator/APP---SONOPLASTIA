'use client';

import React, { useState, useEffect, useMemo } from 'react';
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
  UserPlus,
  Zap,
  Activity,
  ShieldCheck,
  ChevronRight,
  Monitor,
  Wifi,
  BatteryMedium,
  LayoutDashboard,
  Play,
  Check,
  X,
  Volume2,
  Mic,
  Cable,
  Headphones,
  Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import { format, differenceInSeconds, parseISO, isAfter, addDays, startOfWeek, endOfWeek } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Link from 'next/link';

// --- Types ---
interface Culto {
  id: string;
  titulo: string;
  tipo: string;
  data: string;
  horario_inicio: string;
  status: string;
  ao_vivo: boolean;
  escalas?: any[];
}

interface HardwareStatus {
  id: string;
  nome: string;
  status: string;
  valor_percentual: number;
  dado_extra_esq: string;
  dado_extra_dir: string;
  tipo: string;
}

// --- Visual Helpers ---
function ParticleOrb({ x, y, color, delay, size = 180 }: { x: string; y: string; color: string; delay: number; size?: number }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{ left: x, top: y, width: size, height: size, background: color, filter: 'blur(60px)', opacity: 0 }}
      animate={{ opacity: [0, 0.15, 0], scale: [0.8, 1.2, 0.8] }}
      transition={{ duration: 10, delay, repeat: Infinity, ease: 'easeInOut' }}
    />
  );
}

export default function Dashboard() {
  const [nextCulto, setNextCulto] = useState<Culto | null>(null);
  const [weeklySchedule, setWeeklySchedule] = useState<Culto[]>([]);
  const [hardware, setHardware] = useState<HardwareStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [showChecklist, setShowChecklist] = useState(false);
  const [showDataShowChecklist, setShowDataShowChecklist] = useState(false);
  const [bustedEquipment, setBustedEquipment] = useState<any[]>([]);

  // Fetch initial data
  const fetchData = async () => {
    setLoading(true);
    try {
      const today = new Date().toISOString().split('T')[0];

      // 1. Next Culto (for countdown)
      const { data: cultos, error: cultosError } = await supabase
        .from('cultos')
        .select('*, escalas(*, operadores(*))')
        .gte('data', today)
        .order('data', { ascending: true })
        .order('horario_inicio', { ascending: true })
        .limit(4);

      if (cultosError) throw cultosError;

      if (cultos && cultos.length > 0) {
        setNextCulto(cultos[0]);
        setWeeklySchedule(cultos);
      }

      // 2. Hardware Status
      const { data: hw, error: hwError } = await supabase
        .from('hardware_status')
        .select('*')
        .order('tipo', { ascending: true });

      if (hwError) throw hwError;
      setHardware(hw || []);

      // 3. Busted Equipments
      const { data: brokenEq } = await supabase
        .from('equipamentos')
        .select('*')
        .in('status', ['DEFEITO', 'MANUTENÇÃO'])
        .limit(5);
      
      if (brokenEq) setBustedEquipment(brokenEq);

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Subscribe to Hardware changes
    const hwSubscription = supabase
      .channel('hardware-updates')
      .on('postgres_changes' as any, { event: '*', table: 'hardware_status' }, () => {
        fetchData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(hwSubscription);
    };
  }, []);

  // Countdown Ticker
  useEffect(() => {
    if (!nextCulto) return;

    const timer = setInterval(() => {
      const targetDate = parseISO(`${nextCulto.data}T${nextCulto.horario_inicio}`);
      const diff = differenceInSeconds(targetDate, new Date());
      setTimeLeft(diff > 0 ? diff : 0);
    }, 1000);

    return () => clearInterval(timer);
  }, [nextCulto]);

  const timeDisplay = useMemo(() => {
    const days = Math.floor(timeLeft / (3600 * 24));
    const hours = Math.floor((timeLeft % (3600 * 24)) / 3600);
    const mins = Math.floor((timeLeft % 3600) / 60);
    const secs = timeLeft % 60;
    return { days, hours, mins, secs };
  }, [timeLeft]);

  return (
    <AppLayout>
      <div className="space-y-8 -mt-2">
        
        {/* ── HERO BANNER: PRÓXIMO CULTO ─────────────────── */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative h-64 md:h-52 overflow-hidden rounded-3xl border border-white/10 group shadow-2xl"
        >
          {/* Background Image & Overlay */}
          <div className="absolute inset-0 bg-[#0a0a0f]" />
          <img 
            src="/_next/image?url=%2Fdashboard_hero_bg_1775591398846_1775593207342.png&w=1920&q=75" 
            className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:scale-105 transition-transform duration-[10s]"
            alt="Hero Background"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#00a3ff]/10 via-transparent to-[#4ae176]/5" />
          
          <ParticleOrb x="10%" y="-20%" color="#00a3ff" delay={0} size={250} />
          <ParticleOrb x="70%" y="40%" color="#4ae176" delay={3} size={200} />

          {/* Content */}
          <div className="absolute inset-0 flex flex-col md:flex-row justify-between items-center px-8 pb-8 pt-6">
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                <ShieldCheck className="w-4 h-4 text-[#00a3ff]" />
                <span className="font-mono text-[10px] text-[#00a3ff] uppercase tracking-[0.3em] font-black">Sistema Operacional Alpha</span>
              </div>
              <h1 className="font-sans font-black text-3xl md:text-4xl text-white tracking-tighter leading-none mb-3">
                {nextCulto ? nextCulto.titulo.toUpperCase() : 'AGUARDANDO...'}
              </h1>
              <p className="font-mono text-white/60 text-xs flex items-center justify-center md:justify-start gap-3">
                <Clock className="w-3.5 h-3.5 text-[#4ae176]" />
                {nextCulto 
                  ? `${format(parseISO(nextCulto.data), "EEEE, dd 'de' MMMM", { locale: ptBR })} — ${nextCulto.horario_inicio.slice(0,5)}` 
                  : '--'}
              </p>
            </div>

            {/* Countdown Ticker */}
            <div className="flex gap-4 md:gap-6 bg-white/5 backdrop-blur-xl px-6 py-3 rounded-2xl border border-white/10 mt-4 md:mt-0 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
               <TimeBlock value={timeDisplay.days} label="DIAS" />
               <span className="text-white/20 text-2xl font-black mt-1">:</span>
               <TimeBlock value={timeDisplay.hours} label="HRS" />
               <span className="text-white/20 text-2xl font-black mt-1">:</span>
               <TimeBlock value={timeDisplay.mins} label="MIN" />
               <span className="text-white/20 text-2xl font-black mt-1">:</span>
               <TimeBlock value={timeDisplay.secs} label="SEG" color="#00a3ff" />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-[#00a3ff] to-[#4ae176] w-full origin-left" style={{ transform: `scaleX(${loading ? 0.3 : 1})`, transition: 'transform 2s ease' }} />
        </motion.section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* ── ESCALA DA SEMANA (LISTA REAL) ──────────────── */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-[#00a3ff]" />
                <h2 className="font-sans text-xl font-black tracking-tight text-white uppercase italic">Escala Atual</h2>
              </div>
              <span className="font-mono text-[9px] text-white/40 bg-white/5 px-4 py-1.5 rounded-full border border-white/10 uppercase tracking-widest font-black">
                {format(new Date(), "'SEMANA' w", { locale: ptBR })}
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {loading ? (
                [1,2,3,4].map(i => <div key={i} className="h-48 rounded-2xl bg-white/5 animate-pulse" />)
              ) : weeklySchedule.length === 0 ? (
                <div className="col-span-full py-12 text-center rounded-3xl border-2 border-dashed border-white/5 bg-white/2">
                   <Calendar className="w-8 h-8 text-white/20 mx-auto mb-3" />
                   <p className="font-mono text-xs uppercase tracking-widest text-white/40 font-bold">Nenhuma escala programada.</p>
                </div>
              ) : weeklySchedule.map((culto, idx) => (
                <ScheduleCard key={culto.id} culto={culto} delay={idx * 0.1} />
              ))}
            </div>
          </div>

          {/* ── MONITOR DE HARDWARE (REAL-TIME) ───────────── */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center justify-between px-2">
               <div className="flex items-center gap-3">
                <Monitor className="w-5 h-5 text-[#4ae176]" />
                <h2 className="font-sans text-xl font-black tracking-tight text-white uppercase italic">Monitoring</h2>
              </div>
              <button 
                onClick={fetchData}
                className="p-2 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-all active:rotate-180 duration-500"
              >
                <RefreshCcw className="w-4 h-4 text-[#4ae176]" />
              </button>
            </div>
            
            <div className="bg-surface-container-low/40 backdrop-blur-md p-6 rounded-3xl border border-white/5 shadow-xl space-y-8 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-[#4ae176]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              {loading ? (
                 <div className="space-y-6">
                    <div className="h-10 bg-white/5 rounded-xl animate-pulse" />
                    <div className="h-10 bg-white/5 rounded-xl animate-pulse" />
                    <div className="h-10 bg-white/5 rounded-xl animate-pulse" />
                 </div>
              ) : hardware.map((hw, idx) => (
                <HardwareMetric 
                  key={hw.id} 
                  label={hw.nome} 
                  status={hw.status} 
                  value={hw.valor_percentual} 
                  color={hw.status === 'ONLINE' || hw.status === 'ESTÁVEL' ? 'success' : 'warning'} 
                  subLeft={hw.dado_extra_esq} 
                  subRight={hw.dado_extra_dir}
                  delay={idx * 0.1}
                />
              ))}

              <div className="pt-4 border-t border-white/5">
                 <div className="flex items-center gap-2 mb-4">
                    <BatteryMedium className="w-4 h-4 text-[#ffb95f]" />
                    <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest font-black">Baterias Microfones</span>
                 </div>
                 <div className="space-y-4">
                    <BatteryItem label="Líder (UHF-1)" value={94} color="success" />
                    <BatteryItem label="Palco (UHF-2)" value={62} color="success" />
                    <BatteryItem label="Retorno (IEM)" value={28} color="warning" />
                 </div>
              </div>
            </div>

            {/* Equipment Warnings */}
            {bustedEquipment.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-[#ff6b6b]/10 border border-[#ff6b6b]/30 rounded-2xl p-4 flex gap-3 shadow-[0_0_20px_rgba(255,107,107,0.15)] mb-6">
                <AlertTriangle className="w-5 h-5 text-[#ff6b6b] flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-sans font-black text-[#ff6b6b] text-sm uppercase">Aviso de Manutenção ({bustedEquipment.length})</h3>
                  <p className="font-mono text-[9px] text-white/60 mt-1 uppercase font-bold leading-relaxed">
                    {bustedEquipment.map(e => e.nome).join(', ')} precisam de reparo.
                  </p>
                </div>
              </motion.div>
            )}

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4">
              <QuickActionButton 
                icon={Play} 
                label="Sonoplastia" 
                color="#00a3ff" 
                onClick={() => setShowChecklist(true)}
              />
              <QuickActionButton 
                icon={Monitor} 
                label="Data Show" 
                color="#ffb95f" 
                onClick={() => setShowDataShowChecklist(true)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── CHECKLIST MODAL ─────────────────── */}
      <AnimatePresence>
        {showChecklist && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowChecklist(false)}
              className="absolute inset-0 bg-[#0a0a0f]/90 backdrop-blur-xl"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-[#14141a] border border-white/10 rounded-[2.5rem] shadow-[0_30px_100px_rgba(0,0,0,0.8)] overflow-hidden"
            >
              <div className="p-8 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-primary-container/5 via-transparent to-transparent">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#00a3ff]/20 flex items-center justify-center border border-[#00a3ff]/30 shadow-[0_0_20px_rgba(0,163,255,0.2)]">
                       <Settings className="w-6 h-6 text-[#00a3ff]" />
                    </div>
                    <div>
                       <h2 className="font-sans font-black text-2xl text-white tracking-tight uppercase italic">🎚️ CHECKLIST AO VIVO</h2>
                       <p className="font-mono text-[9px] text-white/40 uppercase tracking-[0.3em] font-black">Procedimento Técnico Operacional</p>
                    </div>
                 </div>
                 <button 
                   onClick={() => setShowChecklist(false)}
                   className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 transition-all text-white/40 hover:text-white"
                 >
                   <X className="w-5 h-5" />
                 </button>
              </div>

              <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                 <ChecklistSection 
                   title="Antes / Setup" 
                   icon={Cable} 
                   color="#00a3ff"
                   items={[
                     "Mesa de som ligada",
                     "Microfones testados",
                     "Cabos conferidos",
                     "Retornos (IEM) ok",
                     "Retorno dos músicos",
                     "Datashow pronto"
                   ]} 
                 />
                 <ChecklistSection 
                   title="Durante / Op" 
                   icon={Volume2} 
                   color="#4ae176"
                   items={[
                     "Som equilibrado",
                     "Sem microfonia",
                     "Voz clara/nítida"
                   ]} 
                 />
                 <ChecklistSection 
                   title="Depois / Post" 
                   icon={Headphones} 
                   color="#ffb95f"
                   items={[
                     "Equips. desligados",
                     "Mics guardados",
                     "Problemas registrados"
                   ]} 
                 />
              </div>

              <div className="p-8 bg-white/2 border-t border-white/5 flex justify-between items-center">
                 <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-[#4ae176] shadow-[0_0_8px_#4ae176] animate-pulse" />
                    <span className="font-mono text-[9px] text-white/40 uppercase font-black tracking-widest leading-none">Console Operacional Blue-X</span>
                 </div>
                 <button 
                   onClick={() => setShowChecklist(false)}
                   className="px-8 py-4 bg-[#00a3ff] rounded-2xl font-mono text-[11px] font-black uppercase tracking-[0.2em] text-white shadow-[0_10px_20px_rgba(0,163,255,0.3)] hover:scale-105 transition-transform"
                 >
                   FINALIZAR CHECKLIST
                 </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── DATASHOW CHECKLIST MODAL ─────────────────── */}
      <AnimatePresence>
        {showDataShowChecklist && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDataShowChecklist(false)}
              className="absolute inset-0 bg-[#0a0a0f]/90 backdrop-blur-xl"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-[#14141a] border border-white/10 rounded-[2.5rem] shadow-[0_30px_100px_rgba(0,0,0,0.8)] overflow-hidden"
            >
              <div className="p-8 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-[#ffb95f]/5 via-transparent to-transparent">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#ffb95f]/20 flex items-center justify-center border border-[#ffb95f]/30 shadow-[0_0_20px_rgba(255,185,95,0.2)]">
                       <Monitor className="w-6 h-6 text-[#ffb95f]" />
                    </div>
                    <div>
                       <h2 className="font-sans font-black text-2xl text-white tracking-tight uppercase italic">📺 DATASHOW</h2>
                       <p className="font-mono text-[9px] text-white/40 uppercase tracking-[0.3em] font-black">Tarefas Pré-Culto</p>
                    </div>
                 </div>
                 <button 
                   onClick={() => setShowDataShowChecklist(false)}
                   className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 transition-all text-white/40 hover:text-white"
                 >
                   <X className="w-5 h-5" />
                 </button>
              </div>

              <div className="p-8">
                 <ChecklistSection 
                   title="Checklist"
                   icon={FileText} 
                   color="#ffb95f"
                   items={[
                     "Ligar computador, tvs",
                     "Fazer abertura do culto",
                     "Verificar os hinos do dia",
                     "Post de dízimo",
                     "Post de culto verificar se temos"
                   ]} 
                 />
              </div>

              <div className="p-8 bg-white/2 border-t border-white/5 flex justify-between items-center">
                 <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-[#ffb95f] shadow-[0_0_8px_#ffb95f] animate-pulse" />
                    <span className="font-mono text-[9px] text-white/40 uppercase font-black tracking-widest leading-none">Console Data Show</span>
                 </div>
                 <button 
                   onClick={() => setShowDataShowChecklist(false)}
                   className="px-8 py-4 bg-[#ffb95f] text-black rounded-2xl font-mono text-[11px] font-black uppercase tracking-[0.2em] shadow-[0_10px_20px_rgba(255,185,95,0.3)] hover:scale-105 transition-transform"
                 >
                   FINALIZAR CHECKLIST
                 </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AppLayout>
  );
}

// --- Subcomponents ---

function ChecklistSection({ title, items, icon: Icon, color }: any) {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 pb-3 border-b border-white/5">
         <Icon className="w-4 h-4" style={{ color }} />
         <h3 className="font-mono text-[10px] font-black uppercase tracking-widest" style={{ color }}>{title}</h3>
      </div>
      <div className="space-y-4">
        {items.map((item: string, i: number) => (
          <ChecklistItem key={i} label={item} />
        ))}
      </div>
    </div>
  );
}

function ChecklistItem({ label }: { label: string }) {
  const [checked, setChecked] = useState(false);
  
  return (
    <div 
      onClick={() => setChecked(!checked)}
      className={cn(
        "flex items-center gap-3 cursor-pointer group transition-all",
        checked ? "opacity-100" : "opacity-60 hover:opacity-100"
      )}
    >
      <div className={cn(
        "w-5 h-5 rounded-lg border flex items-center justify-center transition-all",
        checked ? "bg-[#4ae176] border-[#4ae176] shadow-[0_0_10px_rgba(74,225,118,0.3)]" : "bg-black/40 border-white/10 group-hover:border-white/20"
      )}>
        {checked && <Check className="w-3 h-3 text-black stroke-[4px]" />}
      </div>
      <span className={cn(
        "font-sans text-xs font-bold transition-all",
        checked ? "text-white/40 line-through" : "text-white group-hover:translate-x-1"
      )}>
        {label}
      </span>
    </div>
  );
}

function TimeBlock({ value, label, color = "white" }: any) {
  return (
    <div className="flex flex-col items-center min-w-[3rem]">
      <motion.span 
        key={value}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="font-sans text-3xl font-black tabular-nums" 
        style={{ color: value === 0 ? 'rgba(255,255,255,0.2)' : color }}
      >
        {String(value).padStart(2, '0')}
      </motion.span>
      <span className="font-mono text-[8px] text-white/40 uppercase tracking-widest font-black leading-none">{label}</span>
    </div>
  );
}

function ScheduleCard({ culto, delay }: { culto: Culto; delay: number }) {
  const isToday = culto.data === new Date().toISOString().split('T')[0];
  
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      whileHover={{ y: -5 }}
      className={cn(
        "bg-surface-container-low/40 backdrop-blur-sm p-5 rounded-3xl border border-white/5 transition-all group relative overflow-hidden",
        isToday && "border-[#00a3ff]/40 shadow-[0_10px_30px_rgba(0,163,255,0.15)] bg-[#00a3ff]/5"
      )}
    >
      {isToday && (
        <div className="absolute top-0 right-0 p-3">
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [1, 0.6, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-2 h-2 rounded-full bg-[#00a3ff]"
          />
        </div>
      )}

      <div className="flex justify-between items-start mb-6">
        <div>
          <span className="font-mono text-[9px] text-white/30 uppercase font-black tracking-widest">
            {format(parseISO(culto.data), "dd MMM", { locale: ptBR })}
          </span>
          <h4 className="font-sans font-black text-white text-lg tracking-tight leading-tight group-hover:text-[#00a3ff] transition-colors">
            {culto.titulo.toUpperCase()}
          </h4>
        </div>
        <div className={cn(
          "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border",
          culto.status === 'AGENDADO' ? "bg-white/5 text-white/60 border-white/10" : "bg-[#4ae176]/10 text-[#4ae176] border-[#4ae176]/30"
        )}>
          {culto.status}
        </div>
      </div>

      <div className="space-y-2">
        {culto.escalas?.slice(0, 3).map((esc, idx) => (
          <div key={esc.id} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0 hover:bg-white/2 rounded-lg px-2 transition-colors">
            <span className="font-mono text-[10px] text-white/40 uppercase font-bold">{esc.funcao_no_culto}</span>
            <div className="flex items-center gap-2">
              <span className={cn(
                "font-sans text-xs font-bold",
                esc.status === 'CONFIRMADO' ? "text-white" : "text-white/40 italic"
              )}>
                {esc.operadores?.nome || 'VAGO'}
              </span>
              {esc.status === 'CONFIRMADO' ? (
                <CheckCircle2 className="w-3 h-3 text-[#4ae176]" />
              ) : (
                <Clock className="w-3 h-3 text-white/20" />
              )}
            </div>
          </div>
        ))}
      </div>

      <Link href="/escala" className="w-full mt-4 py-2 flex items-center justify-center gap-2 font-mono text-[9px] text-white/30 hover:text-[#00a3ff] transition-colors group/btn">
        DETALHES DA ESCALA <ChevronRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
      </Link>
    </motion.div>
  );
}

function HardwareMetric({ label, status, value, color, subLeft, subRight, delay }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
      className="space-y-2 group/metric"
    >
      <div className="flex justify-between text-[10px] font-mono uppercase font-black tracking-wider">
        <span className="text-white/40 group-hover/metric:text-white transition-colors">{label}</span>
        <span className={cn(color === 'success' ? "text-[#4ae176]" : "text-[#ffb95f]")}>{status}</span>
      </div>
      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          className={cn(
            "h-full rounded-full relative",
            color === 'success' ? "bg-gradient-to-r from-[#4ae176]/50 to-[#4ae176] shadow-[0_0_15px_rgba(74,225,118,0.4)]" : "bg-gradient-to-r from-[#ffb95f]/50 to-[#ffb95f]"
          )} 
        />
      </div>
      <div className="flex justify-between font-mono text-[8px] text-white/20 uppercase font-bold group-hover/metric:text-white/40 transition-colors">
        <span>{subLeft}</span>
        <span>{subRight}</span>
      </div>
    </motion.div>
  );
}

function BatteryItem({ label, value, color }: any) {
  return (
    <div className="flex justify-between items-center group/bat">
      <span className="font-mono text-[10px] text-white/40 group-hover/bat:text-white/60 transition-colors">{label}</span>
      <div className="flex items-center gap-3">
        <div className="w-10 h-3 border border-white/10 rounded-[2px] relative p-[1px] bg-black/20">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${value}%` }}
            className={cn(
              "h-full rounded-[1px]",
              value > 30 ? "bg-[#4ae176]" : "bg-[#ff6b6b] shadow-[0_0_10px_rgba(255,107,107,0.5)]"
            )} 
          />
        </div>
        <span className={cn(
          "font-mono text-[10px] font-black w-8 text-right",
          value > 30 ? "text-white/60" : "text-[#ff6b6b]"
        )}>
          {value}%
        </span>
      </div>
    </div>
  );
}

function QuickActionButton({ icon: Icon, label, color, onClick }: any) {
  return (
    <motion.button 
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="flex flex-col items-center justify-center p-4 bg-surface-container-low/40 backdrop-blur-md border border-white/5 rounded-2xl hover:bg-white/5 transition-all group overflow-hidden relative w-full"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-transparent group-hover:from-white/5 transition-all" />
      <Icon className="w-6 h-6 mb-2 group-hover:scale-110 transition-transform" style={{ color }} />
      <span className="font-mono text-[10px] uppercase font-black text-white/40 group-hover:text-white/80 tracking-widest">{label}</span>
    </motion.button>
  );
}
