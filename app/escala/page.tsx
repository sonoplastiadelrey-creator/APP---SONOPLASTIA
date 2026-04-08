'use client';

import React, { useState, useEffect, useMemo } from 'react';
import AppLayout from '@/components/AppLayout';
import { 
  Calendar, 
  Clock, 
  Settings2, 
  Monitor, 
  Edit,
  X,
  Plus,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  User,
  Wifi,
  Radio,
  Zap,
  Edit2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

const funcaoByInitial: Record<string, string> = {
  'S': 'SONOPLASTA', 'D': 'OPERADOR DATASHOW', 'B': 'BACKUP', 'C': 'CÂMERA', 'L': 'LIGHTING',
};
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/AuthProvider';

import { format, startOfWeek, addDays, isSameDay, getWeek } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const roleColors: Record<string, { bg: string; text: string; glow: string; border: string }> = {
  S: { bg: 'bg-[#00a3ff]/15', text: 'text-[#00a3ff]', glow: 'shadow-[0_0_12px_#00a3ff55]', border: 'border-[#00a3ff]/30' },
  D: { bg: 'bg-[#ffb95f]/15', text: 'text-[#ffb95f]', glow: 'shadow-[0_0_12px_#ffb95f55]', border: 'border-[#ffb95f]/30' },
  B: { bg: 'bg-[#4ae176]/15', text: 'text-[#4ae176]', glow: 'shadow-[0_0_12px_#4ae17655]', border: 'border-[#4ae176]/30' },
  C: { bg: 'bg-[#c77dff]/15', text: 'text-[#c77dff]', glow: 'shadow-[0_0_12px_#c77dff55]', border: 'border-[#c77dff]/30' },
  L: { bg: 'bg-[#ff6b6b]/15', text: 'text-[#ff6b6b]', glow: 'shadow-[0_0_12px_#ff6b6b55]', border: 'border-[#ff6b6b]/30' },
};

const avatarImages = [
  'https://i.pravatar.cc/80?img=1',
  'https://i.pravatar.cc/80?img=5',
  'https://i.pravatar.cc/80?img=12',
  'https://i.pravatar.cc/80?img=7',
  'https://i.pravatar.cc/80?img=11',
  'https://i.pravatar.cc/80?img=15',
];

const serviceCardColors: Record<string, { border: string; glow: string; bar: string; badge: string }> = {
  blue: {
    border: 'border-[#00a3ff]/40',
    glow: 'shadow-[0_0_40px_rgba(0,163,255,0.12)]',
    bar: 'bg-gradient-to-b from-[#00a3ff] to-[#0070ff]',
    badge: 'bg-[#00a3ff]/15 text-[#00a3ff] border-[#00a3ff]/30',
  },
  amber: {
    border: 'border-[#ffb95f]/40',
    glow: 'shadow-[0_0_40px_rgba(255,185,95,0.10)]',
    bar: 'bg-gradient-to-b from-[#ffb95f] to-[#f97316]',
    badge: 'bg-[#ffb95f]/15 text-[#ffb95f] border-[#ffb95f]/30',
  },
  green: {
    border: 'border-[#4ae176]/40',
    glow: 'shadow-[0_0_40px_rgba(74,225,118,0.10)]',
    bar: 'bg-gradient-to-b from-[#4ae176] to-[#16a34a]',
    badge: 'bg-[#4ae176]/15 text-[#4ae176] border-[#4ae176]/30',
  },
};

const cultoOptions = ['Quinta-Feira', 'Sábado (Jovens)', 'Domingo Manhã', 'Domingo Noite', 'Especial'];
const funcaoOptions = ['SONOPLASTA', 'OPERADOR DATASHOW', 'BACKUP', 'CÂMERA', 'LIGHTING'];

type StaffMember = { name: string; role: string; initial: string; empty?: boolean; avatar?: string };
type Service = { id: string | number; title: string; time: string; live: boolean; color: string; staff: StaffMember[] };

function ParticleOrb({ x, y, color, delay }: { x: string; y: string; color: string; delay: number }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{ left: x, top: y, width: 180, height: 180, background: color, filter: 'blur(60px)', opacity: 0 }}
      animate={{ opacity: [0, 0.25, 0], scale: [0.8, 1.1, 0.8] }}
      transition={{ duration: 6, delay, repeat: Infinity, ease: 'easeInOut' }}
    />
  );
}

export default function EscalaPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saved, setSaved] = useState(false);
  const [tick, setTick] = useState(0);
  const { isAdmin, signOut } = useAuth();

  // --- Edit state ---
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editSaved, setEditSaved] = useState(false);
  const [editCulto, setEditCulto] = useState('');
  const [editHorarioInicio, setEditHorarioInicio] = useState('');
  const [editHorarioFim, setEditHorarioFim] = useState('');
  const [editAoVivo, setEditAoVivo] = useState(false);
  const [editMembros, setEditMembros] = useState<{ nome: string; funcao: string }[]>([]);

  const addEditMembro = () => setEditMembros(prev => [...prev, { nome: '', funcao: '' }]);
  const removeEditMembro = (idx: number) => setEditMembros(prev => prev.filter((_, i) => i !== idx));
  const updateEditMembro = (idx: number, field: 'nome' | 'funcao', value: string) =>
    setEditMembros(prev => prev.map((m, i) => i === idx ? { ...m, [field]: value } : m));

  const openEditModal = (service: Service) => {
    setEditingService(service);
    setEditCulto(service.title);
    const parts = service.time.split(' — ');
    setEditHorarioInicio(parts[0] ?? '');
    setEditHorarioFim(parts[1] ?? '');
    setEditAoVivo(service.live);
    setEditMembros(service.staff.map(s => ({
      nome: s.empty ? '' : s.name,
      funcao: funcaoByInitial[s.initial] ?? '',
    })));
    setShowEditModal(true);
  };

  const handleEditSave = async () => {
    if (!editingService || !editCulto || !editHorarioInicio) return;
    
    try {
      const { error: updateError } = await supabase
        .from('cultos')
        .update({
          titulo: editCulto,
          horario_inicio: editHorarioInicio,
          horario_fim: editHorarioFim || null,
          ao_vivo: editAoVivo
        })
        .eq('id', editingService.id);

      if (updateError) throw updateError;

      await supabase.from('escalas').delete().eq('culto_id', editingService.id);
      
      const scalesToInsert = editMembros.filter(m => m.nome || m.funcao).map(m => ({
        culto_id: editingService.id,
        funcao_no_culto: m.funcao || 'Sem função',
        status: m.nome ? 'CONFIRMADO' : 'PENDENTE',
        membro_nome: m.nome || null
      }));

      if (scalesToInsert.length > 0) {
        await supabase.from('escalas').insert(scalesToInsert);
      }

      setEditSaved(true);
      setTimeout(() => {
        setEditSaved(false);
        setShowEditModal(false);
        setEditingService(null);
        fetchServices();
      }, 1200);
    } catch (err: any) {
      console.error('Error updating service:', err);
      alert('Erro ao atualizar escala: ' + (err.message || 'Erro desconhecido'));
    }
  };

  const handleDelete = async (id: string | number) => {
    if (!confirm('Tem certeza que deseja excluir esta escala?')) return;
    try {
      const { error } = await supabase.from('cultos').delete().eq('id', id);
      if (error) throw error;
      setServices(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      console.error('Error deleting service:', err);
    }
  };

  const fetchServices = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('cultos')
        .select(`
          *,
          escalas (
            *,
            operadores (*)
          )
        `)
        .order('data', { ascending: true });

      if (error) throw error;

      const formatted = data.map((c: any) => ({
        id: c.id,
        title: c.titulo || 'Culto sem título',
        time: `${(c.horario_inicio || '00:00:00').slice(0, 5)}${c.horario_fim ? ' — ' + c.horario_fim.slice(0, 5) : ''}`,
        live: !!c.ao_vivo,
        color: c.tipo === 'JOVENS' ? 'amber' : c.tipo === 'ESPECIAL' ? 'green' : 'blue',
        staff: (c.escalas || []).map((e: any) => ({
          name: e.operadores?.nome || e.membro_nome || 'A DEFINIR',
          role: e.funcao_no_culto || 'Sem função',
          initial: (e.funcao_no_culto || 'A').charAt(0).toUpperCase(),
          empty: !e.operadores && !e.membro_nome,
          avatar: e.operadores?.avatar_url || avatarImages[Math.floor(Math.random() * avatarImages.length)]
        }))
      }));

      setServices(formatted);
    } catch (err) {
      console.error('Error fetching services:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    const t = setInterval(() => setTick(p => p + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const [culto, setCulto] = useState('Domingo Manhã');
  const [currentWeek, setCurrentWeek] = useState(new Date());

  const weekDays = useMemo(() => {
    const start = startOfWeek(currentWeek, { weekStartsOn: 1 });
    return Array.from({ length: 7 }, (_, i) => {
      const d = addDays(start, i);
      return {
        day: format(d, 'EEE', { locale: ptBR }).toUpperCase().replace('.', ''),
        date: format(d, 'dd'),
        active: isSameDay(d, new Date()),
        fullDate: d
      };
    });
  }, [currentWeek]);

  const [data, setData] = useState(new Date().toISOString().split('T')[0]);
  const [horarioInicio, setHorarioInicio] = useState('09:00');
  const [horarioFim, setHorarioFim] = useState('11:30');
  const [aoVivo, setAoVivo] = useState(false);
  const [membros, setMembros] = useState([
    { nome: '', funcao: 'SONOPLASTA' },
    { nome: '', funcao: 'OPERADOR DATASHOW' }
  ]);

  const addMembro = () => setMembros([...membros, { nome: '', funcao: '' }]);
  const removeMembro = (idx: number) => setMembros(membros.filter((_, i) => i !== idx));
  const updateMembro = (idx: number, field: 'nome' | 'funcao', value: string) =>
    setMembros(membros.map((m, i) => i === idx ? { ...m, [field]: value } : m));

  const handleSave = async () => {
    console.log('Tentando salvar escala:', { culto, data, horarioInicio, membros });
    
    try {
      const { data: newCulto, error: cultoError } = await supabase
        .from('cultos')
        .insert({
          titulo: culto,
          data: data,
          horario_inicio: horarioInicio,
          horario_fim: horarioFim || null,
          ao_vivo: aoVivo,
          tipo: (culto.includes('Jovens') || culto.includes('Sábado')) ? 'JOVENS' : culto.includes('Especial') ? 'ESPECIAL' : 'REGULAR'
        })
        .select()
        .single();

      if (cultoError) {
        console.error('Erro ao inserir culto:', cultoError);
        throw cultoError;
      }

      console.log('Culto criado com ID:', newCulto.id);

      const scalesToInsert = membros.filter(m => m.nome || m.funcao).map(m => ({
        culto_id: newCulto.id,
        funcao_no_culto: m.funcao || 'Sem função',
        status: m.nome ? 'CONFIRMADO' : 'PENDENTE',
        membro_nome: m.nome || null
      }));

      if (scalesToInsert.length > 0) {
        console.log('Inserindo escalas:', scalesToInsert);
        const { error: escalasError } = await supabase.from('escalas').insert(scalesToInsert);
        if (escalasError) {
          console.error('Erro ao inserir escalas:', escalasError);
          throw escalasError;
        }
      }

      setSaved(true);
      setTimeout(() => {
        setSaved(false); 
        setShowModal(false);
        setCulto('Domingo Manhã'); 
        setData(new Date().toISOString().split('T')[0]); 
        setHorarioInicio('09:00'); 
        setHorarioFim('11:30'); 
        setAoVivo(false); 
        setMembros([{ nome: '', funcao: 'SONOPLASTA' }, { nome: '', funcao: 'OPERADOR DATASHOW' }]);
        fetchServices();
      }, 1200);
    } catch (err: any) {
      console.error('Critical Err:', err);
      alert('Erro ao salvar escala: ' + (err.message || err.details || 'Erro desconhecido. Verifique o console.'));
    }
  };

  return (
    <AppLayout>
      <div className="space-y-0 -mt-2">
        <div className="relative overflow-hidden rounded-2xl mx-0 mb-6 h-44">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('/escala/hero-bg.png')`, backgroundPosition: 'center 40%' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0f]/80 via-transparent to-transparent" />

          <ParticleOrb x="60%" y="-30%" color="#00a3ff" delay={0} />
          <ParticleOrb x="20%" y="50%" color="#4ae176" delay={2} />

          <div className="absolute inset-0 flex flex-col justify-end p-5">
            <div className="flex justify-between items-end">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <p className="font-mono text-[10px] text-[#00a3ff] uppercase tracking-[0.25em] mb-1">
                  PERÍODO ATUAL
                </p>
                <h2 className="font-sans font-black text-2xl text-white leading-none tracking-tight capitalize">
                  {format(currentWeek, 'MMMM yyyy', { locale: ptBR })}
                </h2>
              </motion.div>
              <div className="flex flex-col items-end gap-3">
                <div className="hidden md:flex gap-8">
                  <HeroStat label="TOTAL CULTOS" value={services.length} color="#00a3ff" />
                  <HeroStat label="CONFIRMADOS" value={services.length} color="#4ae176" sub="ESTA SEMANA" />
                </div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex gap-4 mt-3"
            >
              {[
                { icon: Calendar, label: `${services.length} Cultos`, color: 'text-[#00a3ff]' },
                { icon: Radio, label: `${services.filter(s => s.live).length} Ao Vivo`, color: 'text-[#4ae176]' },
                { icon: Zap, label: `Semana ${getWeek(currentWeek)}`, color: 'text-[#ffb95f]' },
              ].map((s) => (
                <div key={s.label} className="flex items-center gap-1.5 bg-white/5 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-white/10">
                  <s.icon className={cn('w-3 h-3', s.color)} />
                  <span className="font-mono text-[10px] text-white font-bold uppercase">{s.label}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-2 px-0 mb-6">
          {weekDays.map((d, idx) => (
            <motion.div
              key={d.date}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05, type: 'spring', stiffness: 400, damping: 20 }}
              className={cn(
                "relative flex-shrink-0 w-14 h-20 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all duration-300 select-none",
                d.active
                  ? "bg-gradient-to-b from-[#00a3ff] to-[#0070ff] shadow-[0_0_28px_rgba(0,163,255,0.6)] border border-[#00a3ff]/50"
                  : "bg-surface-container-low border border-outline-variant/10 hover:border-outline-variant/30 hover:bg-surface-container"
              )}
            >
              {d.active && (
                <div className="absolute inset-0 rounded-2xl overflow-hidden">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>
              )}
              <span className={cn("font-mono text-[9px] uppercase font-bold z-10", d.active ? "text-white/80" : "text-on-surface-variant")}>{d.day}</span>
              <span className={cn("font-sans font-black text-xl z-10", d.active ? "text-white" : "text-on-surface")}>{d.date}</span>
              {d.active && <div className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_6px_white]" />}
            </motion.div>
          ))}
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-lg bg-[#00a3ff]/15 border border-[#00a3ff]/30 flex items-center justify-center">
              <Calendar className="w-3 h-3 text-[#00a3ff]" />
            </div>
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-on-surface-variant font-bold">
              Cultos Agendados
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <motion.div
              className="w-2 h-2 rounded-full bg-[#4ae176]"
              animate={{ scale: [1, 1.4, 1], opacity: [1, 0.4, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <span className="font-mono text-[10px] text-[#4ae176] font-bold">AO VIVO</span>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 opacity-40">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-10 h-10 border-2 border-white/20 border-t-white/80 rounded-full mb-4"
            />
            <p className="font-mono text-[10px] uppercase tracking-widest">Sincronizando com Supabase...</p>
          </div>
        ) : services.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 border border-dashed border-white/10 rounded-3xl bg-white/2">
            <Calendar className="w-12 h-12 text-on-surface-variant/40 mb-4" />
            <p className="text-on-surface-variant text-sm font-sans">Nenhuma escala agendada para esta semana.</p>
            {isAdmin && (
              <button onClick={() => setShowModal(true)} className="mt-4 text-[#00a3ff] text-[10px] font-mono font-bold uppercase hover:underline">
                Criar primeira escala
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, idx) => {
              const colors = serviceCardColors[service.color] ?? serviceCardColors.blue;
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 24, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: idx * 0.08, type: 'spring', stiffness: 300, damping: 24 }}
                  whileHover={{ y: -2, transition: { duration: 0.2 } }}
                  className={cn(
                    "relative overflow-hidden rounded-2xl border bg-surface-container-low transition-all duration-300",
                    colors.border, colors.glow
                  )}
                >
                  <div className={cn("absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl", colors.bar)} />

                  <div className="pl-5 pr-4 pt-4 pb-4">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="font-sans font-black text-lg text-white tracking-tight leading-tight">{service.title}</h4>
                        <div className="flex items-center gap-1.5 mt-1">
                          <Clock className="w-3 h-3 text-on-surface-variant" />
                          <span className="font-mono text-[10px] text-on-surface-variant">{service.time}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {service.live && (
                          <motion.div
                            animate={{ opacity: [1, 0.5, 1] }}
                            transition={{ duration: 1.2, repeat: Infinity }}
                            className={cn("flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[10px] font-mono font-bold", colors.badge)}
                          >
                            <Wifi className="w-3 h-3" />
                            LIVE
                          </motion.div>
                        )}
                        {isAdmin && (
                          <div className="flex items-center gap-1">
                            <motion.button
                              whileHover={{ scale: 1.15 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleDelete(service.id)}
                              className="w-7 h-7 rounded-lg flex items-center justify-center bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all"
                            >
                              <X className="w-3 h-3" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.15 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => openEditModal(service)}
                              className={cn("w-7 h-7 rounded-lg flex items-center justify-center border transition-all", colors.badge)}
                            >
                              <Edit className="w-3 h-3" />
                            </motion.button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      {service.staff.map((member, mIdx) => {
                        const rc = roleColors[member.initial] ?? roleColors.S;
                        return (
                          <motion.div
                            key={mIdx}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.08 + mIdx * 0.05 }}
                            className={cn(
                              "flex items-center gap-3 bg-black/20 rounded-xl p-2 border backdrop-blur-sm transition-all hover:bg-black/30",
                              member.empty ? "opacity-50 border-dashed border-white/5" : "border-white/10"
                            )}
                          >
                            <div className={cn("relative flex-shrink-0 w-8 h-8 rounded-lg overflow-hidden border", rc.border)}>
                              {member.avatar && !member.empty ? (
                                <Image src={member.avatar} alt={member.name} width={32} height={32} className="w-full h-full object-cover" />
                              ) : (
                                <div className={cn("w-full h-full flex items-center justify-center font-mono font-black text-xs", rc.bg, rc.text)}>
                                  {member.initial}
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={cn("text-xs font-bold truncate", member.empty ? "text-white/40 italic" : "text-white")}>
                                {member.name}
                              </p>
                              <p className="text-[9px] font-mono text-on-surface-variant uppercase tracking-wider truncate">{member.role}</p>
                            </div>
                            <div className={cn("flex-shrink-0 px-2 py-0.5 rounded-lg text-[8px] font-mono font-black uppercase border", rc.bg, rc.text, rc.border)}>
                              {member.initial}
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        <div className="h-24" />
      </div>

      <AnimatePresence>
        {showEditModal && editingService && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowEditModal(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-[70]"
            />
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              className="fixed bottom-0 left-0 right-0 z-[80] max-h-[90vh] overflow-y-auto"
              style={{ background: 'linear-gradient(180deg, #15151f 0%, #0f0f17 100%)' }}
            >
              <div className="h-px bg-gradient-to-r from-transparent via-[#ffb95f]/60 to-transparent" />
              <div className="flex justify-center pt-4 pb-1">
                <div className="w-10 h-1 rounded-full bg-white/20" />
              </div>

              <div className="px-5 pb-10 pt-3">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="font-mono text-[10px] text-[#ffb95f] uppercase tracking-[0.25em] mb-1">EDITAR CULTO</p>
                    <h2 className="font-sans text-xl font-black text-white tracking-tight">{editingService.title}</h2>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowEditModal(false)}
                    className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-on-surface-variant hover:bg-white/10 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </motion.button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">Nome do Culto *</label>
                    <div className="relative">
                      <select
                        value={editCulto}
                        onChange={e => setEditCulto(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 font-sans text-sm text-white appearance-none focus:outline-none focus:border-[#ffb95f]/50 focus:ring-1 focus:ring-[#ffb95f]/20 transition-all"
                      >
                        {cultoOptions.map(o => <option key={o} value={o} className="bg-[#15151f]">{o}</option>)}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant pointer-events-none" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: 'Início *', value: editHorarioInicio, set: setEditHorarioInicio },
                      { label: 'Fim', value: editHorarioFim, set: setEditHorarioFim },
                    ].map(f => (
                      <div key={f.label}>
                        <label className="block font-mono text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">{f.label}</label>
                        <input
                          type="time"
                          value={f.value}
                          onChange={e => f.set(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 font-sans text-sm text-white focus:outline-none focus:border-[#ffb95f]/50 focus:ring-1 focus:ring-[#ffb95f]/20 transition-all"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between bg-white/5 rounded-xl px-4 py-3 border border-white/8">
                    <div>
                      <p className="font-sans text-sm font-bold text-white">Transmissão ao vivo</p>
                      <p className="font-mono text-[10px] text-on-surface-variant uppercase mt-0.5">Streamed online</p>
                    </div>
                    <button
                      onClick={() => setEditAoVivo(!editAoVivo)}
                      className={cn("relative w-12 h-6 rounded-full transition-all duration-300", editAoVivo ? "bg-[#ffb95f]" : "bg-white/10")}
                      style={editAoVivo ? { boxShadow: '0 0 16px rgba(255,185,95,0.6)' } : {}}
                    >
                      <motion.span
                        className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-lg"
                        animate={{ left: editAoVivo ? '1.75rem' : '0.25rem' }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    </button>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="font-mono text-[10px] uppercase tracking-widest text-on-surface-variant">Membros da Escala</label>
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={addEditMembro}
                        className="flex items-center gap-1.5 text-[#ffb95f] font-mono text-[10px] font-bold uppercase tracking-wider bg-[#ffb95f]/10 px-3 py-1.5 rounded-lg border border-[#ffb95f]/20 hover:bg-[#ffb95f]/20 transition-colors"
                      >
                        <Plus className="w-3 h-3" /> Adicionar
                      </motion.button>
                    </div>
                    <div className="space-y-3">
                      {editMembros.map((membro, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-white/4 rounded-xl p-3 border border-white/8 space-y-2"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <div className="w-5 h-5 rounded-md bg-[#ffb95f]/15 border border-[#ffb95f]/30 flex items-center justify-center">
                                <User className="w-3 h-3 text-[#ffb95f]" />
                              </div>
                              <span className="font-mono text-[10px] text-on-surface-variant uppercase font-bold">Membro {idx + 1}</span>
                            </div>
                            {editMembros.length > 1 && (
                              <button onClick={() => removeEditMembro(idx)} className="text-[#ff6b6b]/50 hover:text-[#ff6b6b] transition-colors">
                                <X className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                          <input
                            type="text"
                            placeholder="Nome do membro..."
                            value={membro.nome}
                            onChange={e => updateEditMembro(idx, 'nome', e.target.value)}
                            className="w-full bg-black/30 border border-white/8 rounded-lg px-3 py-2.5 font-sans text-sm text-white placeholder:text-on-surface-variant/40 focus:outline-none focus:border-[#ffb95f]/40 transition-all"
                          />
                          <div className="relative">
                            <select
                              value={membro.funcao}
                              onChange={e => updateEditMembro(idx, 'funcao', e.target.value)}
                              className="w-full bg-black/30 border border-white/8 rounded-lg px-3 py-2.5 font-sans text-sm text-white appearance-none focus:outline-none focus:border-[#ffb95f]/40 transition-all"
                            >
                              <option value="" className="bg-[#15151f]">Selecionar função...</option>
                              {funcaoOptions.map(f => <option key={f} value={f} className="bg-[#15151f]">{f}</option>)}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-on-surface-variant pointer-events-none" />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Save edit button */}
                  <motion.button
                    onClick={handleEditSave}
                    disabled={!editCulto || !editHorarioInicio}
                    whileTap={{ scale: 0.97 }}
                    className={cn(
                      "relative w-full py-4 rounded-2xl font-sans font-black uppercase tracking-tight text-sm flex items-center justify-center gap-2 transition-all overflow-hidden",
                      editSaved ? "bg-[#4ae176]" : "disabled:opacity-30 disabled:cursor-not-allowed"
                    )}
                    style={!editSaved ? {
                      background: 'linear-gradient(135deg, #ffb95f, #f97316)',
                      boxShadow: '0 8px 32px rgba(255,185,95,0.4)'
                    } : { boxShadow: '0 8px 32px rgba(74,225,118,0.4)' }}
                  >
                    <motion.div
                      className="absolute inset-0"
                      animate={{ x: ['-100%', '100%'] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                      style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)' }}
                    />
                    <AnimatePresence mode="wait">
                      {editSaved ? (
                        <motion.span key="ok" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex items-center gap-2 text-black font-black">
                          <Check className="w-5 h-5" /> Salvo!
                        </motion.span>
                      ) : (
                        <motion.span key="save" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-white">
                          <Check className="w-5 h-5" /> Salvar Alterações
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── FAB ───────────────────────────────────────────── */}
      {isAdmin && (
        <motion.button
          onClick={() => setShowModal(true)}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          className="fixed bottom-24 right-6 w-14 h-14 rounded-2xl flex items-center justify-center z-[60] overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #00a3ff, #0070ff)' }}
        >
          <div className="absolute inset-0 shadow-[0_0_30px_rgba(0,163,255,0.7)]" />
          <motion.div
            className="absolute inset-0 bg-white/20"
            animate={{ opacity: [0.1, 0.3, 0.1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <Edit className="w-6 h-6 text-white relative z-10 drop-shadow-lg" />
        </motion.button>
      )}

      {/* ── CREATION MODAL ─────────────────────────────────── */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-[70]"
            />

            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              className="fixed bottom-0 left-0 right-0 z-[80] max-h-[90vh] overflow-y-auto"
              style={{ background: 'linear-gradient(180deg, #15151f 0%, #0f0f17 100%)' }}
            >
              {/* Glow top strip */}
              <div className="h-px bg-gradient-to-r from-transparent via-[#00a3ff]/60 to-transparent" />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-16 bg-[#00a3ff]/15 blur-2xl rounded-full pointer-events-none" />

              {/* Handle */}
              <div className="flex justify-center pt-4 pb-1">
                <div className="w-10 h-1 rounded-full bg-white/20" />
              </div>

              <div className="px-5 pb-10 pt-3">
                {/* Modal header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="font-mono text-[10px] text-[#00a3ff] uppercase tracking-[0.25em] mb-1">NOVA ESCALA</p>
                    <h2 className="font-sans text-xl font-black text-white tracking-tight">Criar Escala de Culto</h2>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowModal(false)}
                    className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-on-surface-variant hover:bg-white/10 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </motion.button>
                </div>

                <div className="space-y-4">
                  {/* Culto select */}
                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">Tipo de Culto *</label>
                    <div className="relative">
                      <select
                        value={culto}
                        onChange={e => setCulto(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 font-sans text-sm text-white appearance-none focus:outline-none focus:border-[#00a3ff]/50 focus:ring-1 focus:ring-[#00a3ff]/20 transition-all"
                      >
                        <option value="" className="bg-[#15151f]">Selecionar culto...</option>
                        {cultoOptions.map(o => <option key={o} value={o} className="bg-[#15151f]">{o}</option>)}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant pointer-events-none" />
                    </div>
                  </div>

                  {/* Data */}
                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">Data</label>
                    <input
                      type="date"
                      value={data}
                      onChange={e => setData(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 font-sans text-sm text-white focus:outline-none focus:border-[#00a3ff]/50 focus:ring-1 focus:ring-[#00a3ff]/20 transition-all"
                    />
                  </div>

                  {/* Horários */}
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: 'Início *', value: horarioInicio, set: setHorarioInicio },
                      { label: 'Fim', value: horarioFim, set: setHorarioFim },
                    ].map(f => (
                      <div key={f.label}>
                        <label className="block font-mono text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">{f.label}</label>
                        <input
                          type="time"
                          value={f.value}
                          onChange={e => f.set(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 font-sans text-sm text-white focus:outline-none focus:border-[#00a3ff]/50 focus:ring-1 focus:ring-[#00a3ff]/20 transition-all"
                        />
                      </div>
                    ))}
                  </div>

                  {/* Ao vivo toggle */}
                  <div className="flex items-center justify-between bg-white/5 rounded-xl px-4 py-3 border border-white/8">
                    <div>
                      <p className="font-sans text-sm font-bold text-white">Transmissão ao vivo</p>
                      <p className="font-mono text-[10px] text-on-surface-variant uppercase mt-0.5">Streamed online</p>
                    </div>
                    <button
                      onClick={() => setAoVivo(!aoVivo)}
                      className={cn("relative w-12 h-6 rounded-full transition-all duration-300", aoVivo ? "bg-[#00a3ff]" : "bg-white/10")}
                      style={aoVivo ? { boxShadow: '0 0 16px rgba(0,163,255,0.6)' } : {}}
                    >
                      <motion.span
                        className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-lg"
                        animate={{ left: aoVivo ? '1.75rem' : '0.25rem' }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    </button>
                  </div>

                  {/* Membros */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="font-mono text-[10px] uppercase tracking-widest text-on-surface-variant">Membros da Escala</label>
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={addMembro}
                        className="flex items-center gap-1.5 text-[#00a3ff] font-mono text-[10px] font-bold uppercase tracking-wider bg-[#00a3ff]/10 px-3 py-1.5 rounded-lg border border-[#00a3ff]/20 hover:bg-[#00a3ff]/20 transition-colors"
                      >
                        <Plus className="w-3 h-3" /> Adicionar
                      </motion.button>
                    </div>

                    <div className="space-y-3">
                      {membros.map((membro, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-white/4 rounded-xl p-3 border border-white/8 space-y-2"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <div className="w-5 h-5 rounded-md bg-[#00a3ff]/15 border border-[#00a3ff]/30 flex items-center justify-center">
                                <User className="w-3 h-3 text-[#00a3ff]" />
                              </div>
                              <span className="font-mono text-[10px] text-on-surface-variant uppercase font-bold">Membro {idx + 1}</span>
                            </div>
                            {membros.length > 1 && (
                              <button onClick={() => removeMembro(idx)} className="text-[#ff6b6b]/50 hover:text-[#ff6b6b] transition-colors">
                                <X className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                          <input
                            type="text"
                            placeholder="Nome do membro..."
                            value={membro.nome}
                            onChange={e => updateMembro(idx, 'nome', e.target.value)}
                            className="w-full bg-black/30 border border-white/8 rounded-lg px-3 py-2.5 font-sans text-sm text-white placeholder:text-on-surface-variant/40 focus:outline-none focus:border-[#00a3ff]/40 transition-all"
                          />
                          <div className="relative">
                            <select
                              value={membro.funcao}
                              onChange={e => updateMembro(idx, 'funcao', e.target.value)}
                              className="w-full bg-black/30 border border-white/8 rounded-lg px-3 py-2.5 font-sans text-sm text-white appearance-none focus:outline-none focus:border-[#00a3ff]/40 transition-all"
                            >
                              <option value="" className="bg-[#15151f]">Selecionar função...</option>
                              {funcaoOptions.map(f => <option key={f} value={f} className="bg-[#15151f]">{f}</option>)}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-on-surface-variant pointer-events-none" />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Save button */}
                  <motion.button
                    onClick={handleSave}
                    disabled={!culto || !horarioInicio}
                    whileTap={{ scale: 0.97 }}
                    className={cn(
                      "relative w-full py-4 rounded-2xl font-sans font-black uppercase tracking-tight text-sm flex items-center justify-center gap-2 transition-all overflow-hidden",
                      saved ? "bg-[#4ae176]" : "disabled:opacity-30 disabled:cursor-not-allowed"
                    )}
                    style={!saved ? {
                      background: 'linear-gradient(135deg, #00a3ff, #0070ff)',
                      boxShadow: '0 8px 32px rgba(0,163,255,0.4)'
                    } : { boxShadow: '0 8px 32px rgba(74,225,118,0.4)' }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-white/10"
                      animate={{ x: ['-100%', '100%'] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                      style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)' }}
                    />
                    <AnimatePresence mode="wait">
                      {saved ? (
                        <motion.span key="ok" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex items-center gap-2 text-black font-black">
                          <Check className="w-5 h-5" /> Escala Criada!
                        </motion.span>
                      ) : (
                        <motion.span key="save" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-white">
                          <Plus className="w-5 h-5" /> Criar Escala
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </AppLayout>
  );
}

function HeroStat({ label, value, color, sub }: { label: string; value: string | number; color: string; sub?: string }) {
  return (
    <div className="flex flex-col items-center md:items-end">
      <p className="font-mono text-[9px] text-white/40 uppercase font-black tracking-[0.2em] mb-1">{label}</p>
      <div className="flex items-baseline gap-1">
        <span className="font-sans font-black text-2xl text-white tracking-tighter" style={{ color }}>{value}</span>
        {sub && <span className="font-mono text-[8px] text-white/20 font-bold uppercase">{sub}</span>}
      </div>
    </div>
  );
}
