'use client';

import React, { useState, useEffect, useMemo } from 'react';
import AppLayout from '@/components/AppLayout';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Star, 
  Edit,
  UserPlus,
  TrendingUp,
  X,
  Trash2,
  Check,
  ChevronRight,
  Shield,
  Phone,
  Mail,
  Camera,
  Hash,
  Activity,
  Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/AuthProvider';

// --- Types ---
interface Operador {
  id: string;
  codigo: string;
  nome: string;
  status: string;
  funcao: string;
  nivel: string;
  progresso: number;
  avatar_url: string;
  telefone: string;
  email: string;
}

// --- Visual Helpers ---
function ParticleOrb({ x, y, color, delay, size = 180 }: { x: string; y: string; color: string; delay: number; size?: number }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none opacity-20"
      style={{ left: x, top: y, width: size, height: size, background: color, filter: 'blur(60px)' }}
      animate={{ opacity: [0.1, 0.25, 0.1], scale: [0.8, 1.2, 0.8] }}
      transition={{ duration: 10, delay, repeat: Infinity, ease: 'easeInOut' }}
    />
  );
}

export default function EquipePage() {
  const [operadores, setOperadores] = useState<Operador[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('TODOS');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOperator, setEditingOperator] = useState<Operador | null>(null);
  const { isAdmin, signOut } = useAuth();

  // Fetch data
  const fetchOperadores = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('operadores')
        .select('*')
        .order('nome', { ascending: true });

      if (error) throw error;
      setOperadores(data || []);
    } catch (err) {
      console.error('Error fetching operators:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOperadores();
  }, []);

  // UI calculations
  const filteredOperadores = useMemo(() => {
    return operadores.filter(op => {
      const matchesSearch = op.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           op.codigo.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = filterRole === 'TODOS' || op.funcao === filterRole;
      return matchesSearch && matchesRole;
    });
  }, [operadores, searchTerm, filterRole]);

  const stats = useMemo(() => {
    const total = operadores.length;
    const ativos = operadores.filter(o => o.status === 'ATIVO').length;
    const especialistas = operadores.filter(o => o.progresso === 100).length;
    const mediaProgresso = total > 0 ? operadores.reduce((acc, curr) => acc + curr.progresso, 0) / total : 0;
    
    return { total, ativos, especialistas, mediaProgresso };
  }, [operadores]);

  // Actions
  const handleEdit = (op: Operador) => {
    setEditingOperator(op);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setEditingOperator(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja remover este membro da equipe?')) return;
    
    try {
      const { error } = await supabase.from('operadores').delete().eq('id', id);
      if (error) throw error;
      setOperadores(prev => prev.filter(op => op.id !== id));
    } catch (err) {
      alert('Erro ao excluir operador.');
    }
  };

  const handleSave = async (formData: Partial<Operador>) => {
    try {
      if (editingOperator) {
        const { data, error } = await supabase
          .from('operadores')
          .update(formData)
          .eq('id', editingOperator.id)
          .select();
        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from('operadores')
          .insert([formData])
          .select();
        if (error) throw error;
      }
      setIsModalOpen(false);
      fetchOperadores();
    } catch (err) {
      console.error('Save error:', err);
      alert('Erro ao salvar dados.');
    }
  };

  return (
    <AppLayout>
      <div className="space-y-8 -mt-2">
        
        {/* ── HERO BANNER ─────────────────── */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative h-48 md:h-44 overflow-hidden rounded-3xl border border-white/10 group shadow-2xl"
        >
          <div className="absolute inset-0 bg-[#0a0a0f]" />
          <img 
            src="/_next/image?url=%2Fteam_hero_bg_1775597705462_1775599520453.png&w=1920&q=75" 
            className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:scale-105 transition-transform duration-[10s]"
            alt="Hero Background"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent" />
          
          <ParticleOrb x="10%" y="-20%" color="#00a3ff" delay={0} size={250} />
          <ParticleOrb x="70%" y="40%" color="#ffb95f" delay={3} size={200} />

          <div className="absolute inset-0 flex flex-col md:flex-row justify-between items-center px-8">
            <div className="text-center md:text-left py-6">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                <Shield className="w-4 h-4 text-[#00a3ff]" />
                <span className="font-mono text-[10px] text-[#00a3ff] uppercase tracking-[0.3em] font-black">Elite Operators Corps</span>
              </div>
              <h1 className="font-sans font-black text-3xl md:text-4xl text-white tracking-tighter leading-none mb-2 italic">
                GESTÃO DE EQUIPE
              </h1>
              <p className="font-mono text-white/50 text-xs flex items-center justify-center md:justify-start gap-4">
                <span className="flex items-center gap-1.5"><Activity className="w-3.5 h-3.5 text-secondary" /> {stats.total} TOTAL</span>
                <span className="flex items-center gap-1.5"><Award className="w-3.5 h-3.5 text-tertiary" /> {stats.especialistas} SENIORS</span>
              </p>
            </div>

            <div className="flex flex-col items-end gap-3">
              <div className="hidden md:flex gap-8">
                <HeroStat label="CAPACIDADE" value={`${Math.round(stats.mediaProgresso)}%`} color="#00a3ff" />
                <HeroStat label="DISPONIBILIDADE" value={`${stats.ativos}`} color="#4ae176" sub="ON" />
              </div>
            </div>
          </div>
        </motion.section>

        {/* ── FILTROS E BUSCA ─────────────────── */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-surface-container-low/40 backdrop-blur-md p-4 rounded-2xl border border-white/5">
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-[#00a3ff] transition-colors" />
            <input 
              type="text" 
              placeholder="Buscar pelo nome ou ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm font-mono text-white placeholder:text-white/20 focus:outline-none focus:border-[#00a3ff]/50 transition-all"
            />
          </div>
          
          <div className="flex items-center gap-2 w-full md:w-auto">
             <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/5 flex-1 md:flex-initial">
                {['TODOS', 'SONOPLASTA', 'DATASHOW', 'CÂMERA'].map(role => (
                  <button
                    key={role}
                    onClick={() => setFilterRole(role)}
                    className={cn(
                      "px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                      filterRole === role ? "bg-[#00a3ff] text-white shadow-[0_0_15px_rgba(0,163,255,0.3)]" : "text-white/30 hover:text-white/60"
                    )}
                  >
                    {role}
                  </button>
                ))}
             </div>
             <button className="p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-colors">
                <Filter className="w-4 h-4 text-white/40" />
             </button>
          </div>
        </div>

        {/* ── GRID DE OPERADORES ─────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {loading ? (
              [1,2,3,4,5,6].map(i => (
                <div key={i} className="h-64 rounded-3xl bg-white/5 animate-pulse border border-white/5" />
              ))
            ) : filteredOperadores.length > 0 ? (
              filteredOperadores.map((op, idx) => (
                <OperatorCard 
                  key={op.id} 
                  op={op} 
                  delay={idx * 0.05} 
                  onEdit={() => handleEdit(op)}
                  onDelete={() => handleDelete(op.id)}
                  isAdmin={isAdmin}
                />
              ))
            ) : (
              <div className="col-span-full py-20 text-center">
                <div className="bg-white/5 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
                   <Search className="w-8 h-8 text-white/10" />
                </div>
                <h3 className="font-sans font-black text-white/40 text-lg uppercase">Nenhum operador encontrado</h3>
                <p className="font-mono text-white/20 text-xs mt-1">Tente ajustar seus filtros ou busca.</p>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* ── FAB ─────────────────── */}
        {isAdmin && (
          <motion.button 
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCreate}
            className="fixed bottom-24 right-6 md:bottom-10 md:right-10 w-16 h-16 rounded-3xl bg-gradient-to-br from-[#00a3ff] to-[#0066ff] text-white flex items-center justify-center shadow-[0_15px_40px_rgba(0,163,255,0.4)] z-[60] border border-white/20 group"
          >
            <UserPlus className="w-7 h-7 group-hover:rotate-12 transition-transform" />
          </motion.button>
        )}

        {/* ── MODAL ─────────────────── */}
        <MemberModal 
           isOpen={isModalOpen}
           onClose={() => setIsModalOpen(false)}
           onSave={handleSave}
           operator={editingOperator}
        />
      </div>
    </AppLayout>
  );
}

// --- Subcomponents ---

function HeroStat({ label, value, color, sub }: any) {
  return (
    <div className="flex flex-col items-end">
       <span className="font-mono text-[9px] text-white/30 uppercase tracking-[0.2em] font-black">{label}</span>
       <div className="flex items-baseline gap-1">
          <span className="font-sans font-black text-4xl text-white tracking-tighter" style={{ color }}>{value}</span>
          {sub && <span className="font-mono text-[10px] text-white/30 font-black">{sub}</span>}
       </div>
    </div>
  );
}

function OperatorCard({ op, delay, onEdit, onDelete, isAdmin }: { op: Operador; delay: number; onEdit: () => void; onDelete: () => void; isAdmin: boolean }) {
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ delay }}
      className="bg-surface-container-low/40 backdrop-blur-sm rounded-[2rem] p-6 border border-white/5 shadow-xl group hover:border-[#00a3ff]/30 transition-all duration-500 relative overflow-hidden"
    >
      {isAdmin && (
        <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
           <button onClick={onEdit} className="p-2 bg-white/5 hover:bg-[#00a3ff]/20 rounded-xl border border-white/10 text-white/40 hover:text-[#00a3ff] transition-all">
              <Edit className="w-4 h-4" />
           </button>
           <button onClick={onDelete} className="p-2 bg-white/5 hover:bg-red-500/20 rounded-xl border border-white/10 text-white/40 hover:text-red-500 transition-all">
              <Trash2 className="w-4 h-4" />
           </button>
        </div>
      )}

      <div className="flex gap-5 mb-6">
        <div className="relative">
          <div className={cn(
            "w-20 h-20 rounded-3xl bg-gradient-to-br from-white/10 to-transparent p-0.5 overflow-hidden ring-1 ring-white/10 transition-all duration-500 group-hover:rotate-6",
            op.status === 'ATIVO' ? "ring-[#4ae176]/30" : "grayscale"
          )}>
            <img 
              src={op.avatar_url || `https://i.pravatar.cc/150?u=${op.codigo}`} 
              alt={op.nome} 
              className="w-full h-full object-cover rounded-[1.4rem]" 
            />
          </div>
          <div className={cn(
            "absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-4 border-[#0a0a0f]",
            op.status === 'ATIVO' ? "bg-[#4ae176] shadow-[0_0_10px_#4ae176]" : "bg-white/20"
          )}></div>
        </div>
        
        <div className="py-1">
          <h3 className="font-sans font-black text-xl text-white tracking-tight leading-none mb-2 group-hover:text-[#00a3ff] transition-colors">
            {op.nome}
          </h3>
          <div className="flex items-center gap-2">
            <span className={cn(
              "text-[9px] font-black px-2 py-0.5 rounded-lg uppercase tracking-wider",
              op.status === 'ATIVO' ? "bg-[#4ae176]/10 text-[#4ae176]" : "bg-white/5 text-white/40"
            )}>
              {op.status}
            </span>
            <span className="text-white/20 font-mono text-[9px] font-black uppercase tracking-widest">ID: {op.codigo}</span>
          </div>
        </div>
      </div>

      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-white/20 font-mono text-[8px] uppercase tracking-[0.2em] font-black mb-1">FUNÇÃO</span>
            <span className="font-sans font-black text-xs text-white tracking-tight uppercase italic group-hover:text-[#00a3ff] transition-colors">{op.funcao}</span>
          </div>
          <div className="text-right">
             <div className="flex gap-0.5 mb-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star 
                    key={s} 
                    className={cn(
                      "w-2.5 h-2.5", 
                      s <= (op.nivel === 'Sênior' ? 5 : op.nivel === 'Intermediário' ? 3 : 1) 
                        ? "text-[#ffb95f] fill-[#ffb95f]" 
                        : "text-white/5"
                    )} 
                  />
                ))}
             </div>
             <span className="text-white/40 font-mono text-[9px] font-black uppercase">{op.nivel}</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-end">
             <span className="text-white/20 font-mono text-[8px] uppercase tracking-[0.2em] font-black">PROFICIÊNCIA</span>
             <span className="font-mono text-[10px] font-black text-[#00a3ff]">{op.progresso}%</span>
          </div>
          <div className="h-1.5 bg-black/40 rounded-full overflow-hidden border border-white/5 relative">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${op.progresso}%` }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              className={cn(
                "h-full rounded-full relative transition-all duration-500",
                op.progresso === 100 
                  ? "bg-gradient-to-r from-[#00a3ff] to-[#00f2fe] shadow-[0_0_15px_rgba(0,163,255,0.4)]" 
                  : "bg-gradient-to-r from-white/10 to-white/30"
              )} 
            />
          </div>
        </div>
        
        <div className="flex gap-3 pt-2">
           <ContactSmall icon={Phone} text={op.telefone || 'N/A'} />
           <ContactSmall icon={Mail} text={op.email || 'N/A'} />
        </div>
      </div>
    </motion.div>
  );
}

function ContactSmall({ icon: Icon, text }: any) {
  return (
    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 rounded-xl border border-white/5 group/contact cursor-pointer hover:bg-white/10 transition-colors">
       <Icon className="w-3 h-3 text-white/20 group-hover/contact:text-[#00a3ff]" />
       <span className="font-mono text-[8px] text-white/40 font-bold max-w-[80px] truncate">{text}</span>
    </div>
  );
}

// --- Modals ---

function MemberModal({ isOpen, onClose, onSave, operator }: { isOpen: boolean; onClose: () => void; onSave: (data: any) => void; operator: Operador | null }) {
  const [formData, setFormData] = useState<Partial<Operador>>({
    nome: '',
    codigo: '',
    funcao: 'SONOPLASTA',
    nivel: 'Iniciante',
    status: 'ATIVO',
    progresso: 0,
    telefone: '',
    email: '',
    avatar_url: ''
  });

  useEffect(() => {
    if (operator) {
      // Somente atualiza se o operador for diferente do atual para evitar loops
      setFormData(prev => prev.id === operator.id ? prev : operator);
    } else {
      setFormData({
        nome: '',
        codigo: '',
        funcao: 'SONOPLASTA',
        nivel: 'Iniciante',
        status: 'ATIVO',
        progresso: 0,
        telefone: '',
        email: '',
        avatar_url: ''
      });
    }
  }, [operator, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-xl bg-surface-container-high rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="px-8 pt-8 pb-4 flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-1">
               <Shield className="w-4 h-4 text-[#00a3ff]" />
               <span className="font-mono text-[9px] text-[#00a3ff] uppercase tracking-[0.3em] font-black">Operator Registration</span>
            </div>
            <h2 className="font-sans font-black text-2xl text-white tracking-tighter uppercase italic">
              {operator ? 'Editar Agente' : 'Novo Alistamento'}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors text-white/20 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
          
          {/* Main Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <InputBlock 
               label="Nome do Operador" 
               icon={UserPlus} 
               value={formData.nome} 
               onChange={(v: string) => setFormData(p => ({...p, nome: v}))}
               placeholder="Ex: Gabriel Silva"
             />
             <InputBlock 
               label="Código de ID" 
               icon={Hash} 
               value={formData.codigo} 
               onChange={(v: string) => setFormData(p => ({...p, codigo: v}))}
               placeholder="Ex: 007-X"
             />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <SelectBlock 
               label="Função Principal" 
               value={formData.funcao} 
               onChange={(v: string) => setFormData(p => ({...p, funcao: v}))}
               options={['SONOPLASTA', 'DATASHOW', 'CÂMERA 01', 'CÂMERA 02', 'LIGHTING DESIGNER', 'LIVESEQ']}
             />
             <SelectBlock 
               label="Nível Técnico" 
               value={formData.nivel} 
               onChange={(v: string) => setFormData(p => ({...p, nivel: v}))}
               options={['Iniciante', 'Intermediário', 'Sênior', 'Master']}
             />
          </div>

          {/* Progress Slider */}
          <div className="space-y-3 bg-black/20 p-5 rounded-2xl border border-white/5">
             <div className="flex justify-between items-center">
                <span className="text-white/20 font-mono text-[9px] font-black uppercase tracking-widest">Nível de Proficiência</span>
                <span className="font-mono text-xs font-black text-[#00a3ff]">{formData.progresso}%</span>
             </div>
             <input 
               type="range" 
               min="0" 
               max="100" 
               value={formData.progresso} 
               onChange={(e) => setFormData(p => ({...p, progresso: parseInt(e.target.value)}))}
               className="w-full accent-[#00a3ff] bg-white/5 h-1.5 rounded-full appearance-none cursor-pointer"
             />
          </div>

          {/* Contact */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <InputBlock 
               label="Telefone / WhatsApp" 
               icon={Phone} 
               value={formData.telefone} 
               onChange={(v: string) => setFormData(p => ({...p, telefone: v}))}
               placeholder="+55 (--) -----"
             />
             <InputBlock 
               label="E-mail" 
               icon={Mail} 
               value={formData.email} 
               onChange={(v: string) => setFormData(p => ({...p, email: v}))}
               placeholder="agente@sonoplastia.com"
             />
          </div>

          <InputBlock 
               label="URL do Avatar (Opcional)" 
               icon={Camera} 
               value={formData.avatar_url} 
               onChange={(v: string) => setFormData(p => ({...p, avatar_url: v}))}
               placeholder="https://imagem.com/foto.jpg"
             />

          <div className="flex items-center gap-2 pt-2">
             <span className="text-white/20 font-mono text-[9px] font-black uppercase tracking-widest mr-4">Status de Atividade:</span>
             <button 
               onClick={() => setFormData(p => ({...p, status: 'ATIVO'}))}
               className={cn(
                 "px-4 py-2 rounded-xl text-[10px] font-black border transition-all",
                 formData.status === 'ATIVO' ? "bg-[#4ae176]/10 text-[#4ae176] border-[#4ae176]/30" : "bg-white/5 text-white/20 border-white/5"
               )}
             >
               ATIVO
             </button>
             <button 
               onClick={() => setFormData(p => ({...p, status: 'OFFLINE'}))}
               className={cn(
                 "px-4 py-2 rounded-xl text-[10px] font-black border transition-all",
                 formData.status === 'OFFLINE' ? "bg-white/5 text-white/40 border-white/10" : "bg-white/5 text-white/20 border-white/5"
               )}
             >
               OFFLINE
             </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-white/5 bg-black/20 flex gap-4">
          <button 
            onClick={onClose}
            className="flex-1 py-4 font-mono text-xs font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors"
          >
            CANCELAR
          </button>
          <button 
            onClick={() => onSave(formData)}
            className="flex-[2] py-4 bg-[#00a3ff] rounded-2xl flex items-center justify-center gap-2 font-mono text-xs font-black uppercase tracking-widest text-white shadow-[0_10px_30px_rgba(0,163,255,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Check className="w-4 h-4" />
            {operator ? 'SALVAR ALTERAÇÕES' : 'CONCLUIR CADASTRO'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function InputBlock({ label, icon: Icon, value, onChange, placeholder }: any) {
  return (
    <div className="space-y-2">
      <label className="text-white/20 font-mono text-[9px] font-black uppercase tracking-widest ml-1">{label}</label>
      <div className="relative group">
        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/10 group-focus-within:text-[#00a3ff] transition-colors" />
        <input 
          type="text" 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-black/20 border border-white/5 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-sans text-white placeholder:text-white/5 focus:outline-none focus:border-[#00a3ff]/30 transition-all font-bold"
        />
      </div>
    </div>
  );
}

function SelectBlock({ label, value, onChange, options }: any) {
  return (
    <div className="space-y-2">
      <label className="text-white/20 font-mono text-[9px] font-black uppercase tracking-widest ml-1">{label}</label>
      <select 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-black/20 border border-white/5 rounded-2xl py-3.5 px-4 text-sm font-sans font-bold text-white focus:outline-none focus:border-[#00a3ff]/30 transition-all appearance-none cursor-pointer"
      >
        {options.map((opt: string) => (
          <option key={opt} value={opt} className="bg-[#1a1a1f]">{opt}</option>
        ))}
      </select>
    </div>
  );
}
