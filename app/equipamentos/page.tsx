'use client';

import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import { 
  PlusCircle, 
  Search,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Clock,
  Package,
  Wrench,
  Trash2,
  Edit,
  X,
  ChevronDown,
  Camera,
  Plus,
  Check,
  Zap,
  ShieldCheck,
  Activity,
  Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/AuthProvider';
import Image from 'next/image';

// --- Types ---
type EquipmentStatus = 'BOM' | 'MANUTENÇÃO' | 'DEFEITO';
type Category = 'TODOS' | 'MICROFONES' | 'CABOS' | 'MIXER/PA' | 'GERAL';

interface Equipment {
  id: string;
  codigo: string;
  nome: string;
  categoria: string;
  quantidade: number;
  status: string;
  imagem_url?: string;
  localizacao?: string;
  observacoes?: string;
  created_at?: string;
}

// --- Visual Helpers ---
const statusConfig: Record<string, { color: string; bg: string; border: string; icon: any }> = {
  'BOM': { color: 'text-[#4ae176]', bg: 'bg-[#4ae176]/10', border: 'border-[#4ae176]/30', icon: CheckCircle2 },
  'MANUTENÇÃO': { color: 'text-[#ffb95f]', bg: 'bg-[#ffb95f]/10', border: 'border-[#ffb95f]/30', icon: Wrench },
  'DEFEITO': { color: 'text-[#ff6b6b]', bg: 'bg-[#ff6b6b]/10', border: 'border-[#ff6b6b]/30', icon: XCircle },
};

const categoryOptions: Category[] = ['TODOS', 'MICROFONES', 'CABOS', 'MIXER/PA', 'GERAL'];

function ParticleOrb({ x, y, color, delay }: { x: string; y: string; color: string; delay: number }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{ left: x, top: y, width: 180, height: 180, background: color, filter: 'blur(60px)', opacity: 0 }}
      animate={{ opacity: [0, 0.2, 0], scale: [0.8, 1.2, 0.8] }}
      transition={{ duration: 8, delay, repeat: Infinity, ease: 'easeInOut' }}
    />
  );
}

function EquipmentCard({ eq, delay, onEdit, onDelete, isAdmin }: { eq: Equipment; delay: number; onEdit: () => void; onDelete: () => void; isAdmin: boolean }) {
  const config = statusConfig[eq.status] || statusConfig.BOM;
  return (
    <motion.div
      layoutId={eq.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="relative bg-surface-container-low rounded-2xl border border-outline-variant/5 overflow-hidden group shadow-lg"
    >
      <div className="flex h-36">
        <div className="w-32 relative flex-shrink-0 group-hover:scale-105 transition-transform duration-500">
          {eq.imagem_url ? (
            <img src={eq.imagem_url} alt={eq.nome} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-surface-container-high flex items-center justify-center">
              <Zap className="w-8 h-8 text-on-surface-variant/20" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-surface-container-low" />
          <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10">
            <p className="font-mono text-[10px] font-black text-white">QTD: {eq.quantidade}</p>
          </div>
        </div>
        <div className="flex-1 p-4 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start">
              <span className="font-mono text-[9px] text-[#00a3ff] font-black uppercase tracking-widest bg-[#00a3ff]/10 px-2 py-0.5 rounded">
                {eq.categoria}
              </span>
              {isAdmin && (
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={onEdit} className="p-1.5 hover:bg-white/5 rounded-lg text-on-surface-variant"><Edit className="w-3.5 h-3.5" /></button>
                  <button onClick={onDelete} className="p-1.5 hover:bg-red-500/10 rounded-lg text-red-500/50 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              )}
            </div>
            <h3 className="font-sans font-black text-lg text-white mt-2 leading-none uppercase tracking-tight">{eq.nome}</h3>
            <div className="flex items-center gap-1.5 mt-1 opacity-60">
              <p className="font-mono text-[9px] uppercase font-bold text-on-surface-variant">SERIAL: {eq.codigo}</p>
            </div>
          </div>
          <div className="flex justify-between items-center bg-black/20 p-2 rounded-xl border border-white/5">
            <div className="flex items-center gap-2">
              <div className={cn("w-2 h-2 rounded-full", config.color.replace('text', 'bg'))} />
              <span className={cn("font-mono text-[10px] font-black uppercase tracking-wide", config.color)}>{eq.status}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3 h-3 text-on-surface-variant" />
              <span className="text-[9px] font-mono text-on-surface-variant uppercase font-bold">Ult. Manut. 12/23</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function EquipamentosPage() {
  const [items, setItems] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<Category>('TODOS');
  const { isAdmin, signOut } = useAuth();
  
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Equipment | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [formData, setFormData] = useState({
    nome: '',
    codigo: '',
    categoria: 'GERAL',
    quantidade: 1,
    status: 'BOM',
    imagem_url: '',
    localizacao: ''
  });

  const fetchItems = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('equipamentos')
        .select('*')
        .order('nome', { ascending: true });

      if (error) throw error;
      setItems(data || []);
    } catch (err) {
      console.error('Error fetching inventory:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleOpenModal = (item?: Equipment) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        nome: item.nome,
        codigo: item.codigo,
        categoria: item.categoria,
        quantidade: item.quantidade,
        status: item.status,
        imagem_url: item.imagem_url || '',
        localizacao: item.localizacao || ''
      });
    } else {
      setEditingItem(null);
      setFormData({
        nome: '',
        codigo: `EQP-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        categoria: 'GERAL',
        quantidade: 1,
        status: 'BOM',
        imagem_url: '',
        localizacao: ''
      });
    }
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formData.nome || !formData.codigo) return;
    setIsSaving(true);
    
    try {
      if (editingItem) {
        const { error } = await supabase
          .from('equipamentos')
          .update(formData)
          .eq('id', editingItem.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('equipamentos')
          .insert([formData]);
        if (error) throw error;
      }

      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        setShowModal(false);
        fetchItems();
      }, 1500);
    } catch (err) {
      console.error('Error saving equipment:', err);
      alert('Erro ao salvar equipamento. Verifique se o código já existe.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja realmente excluir este equipamento?')) return;
    try {
      const { error } = await supabase
        .from('equipamentos')
        .delete()
        .eq('id', id);
      if (error) throw error;
      setItems(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      console.error('Error deleting item:', err);
    }
  };

  const filteredItems = activeCategory === 'TODOS' 
    ? items 
    : items.filter(item => item.categoria.toUpperCase() === activeCategory);

  const totalQty = items.reduce((acc, curr) => acc + curr.quantidade, 0);
  const healthPercent = items.length > 0 
    ? Math.round((items.filter(i => i.status === 'BOM').length / items.length) * 100) 
    : 100;

  return (
    <AppLayout>
      <div className="space-y-0 -mt-2">

        <div className="relative overflow-hidden rounded-2xl mx-0 mb-8 h-48 group">
          <div className="absolute inset-0 bg-[#0a0a0f]" />
          <div className="absolute inset-0 bg-gradient-to-br from-[#00a3ff]/10 via-transparent to-[#4ae176]/5" />
          <ParticleOrb x="10%" y="-20%" color="#00a3ff" delay={0} />
          <ParticleOrb x="70%" y="40%" color="#4ae176" delay={3} />
          
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />

          <div className="absolute -right-4 -bottom-8 select-none pointer-events-none opacity-5 group-hover:opacity-10 transition-opacity">
            <h1 className="text-9xl font-black italic">GEAR</h1>
          </div>

          <div className="absolute inset-0 flex flex-col justify-between p-6">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <div className="flex items-center gap-2 mb-1">
                <ShieldCheck className="w-4 h-4 text-[#00a3ff]" />
                <span className="font-mono text-[10px] text-[#00a3ff] uppercase tracking-[0.3em] font-bold">RECURSOS TÉCNICOS</span>
              </div>
              <h2 className="font-sans font-black text-3xl text-white tracking-tight leading-none mb-4">Inventário Geral</h2>
            </motion.div>

            <div className="flex justify-between items-end">
              <div className="flex gap-4">
                <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md px-3 py-2 rounded-xl border border-white/10">
                  <div className="w-8 h-8 rounded-lg bg-[#00a3ff]/20 flex items-center justify-center">
                    <Package className="w-4 h-4 text-[#00a3ff]" />
                  </div>
                  <div>
                    <p className="text-[9px] font-mono text-white/40 uppercase font-bold leading-none mb-1">Total Itens</p>
                    <p className="text-lg font-black text-white leading-none">{loading ? '--' : totalQty}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md px-3 py-2 rounded-xl border border-white/10">
                  <div className="w-8 h-8 rounded-lg bg-[#4ae176]/20 flex items-center justify-center">
                    <Activity className="w-4 h-4 text-[#4ae176]" />
                  </div>
                  <div>
                    <p className="text-[9px] font-mono text-white/40 uppercase font-bold leading-none mb-1">Saúde App</p>
                    <p className="text-lg font-black text-white leading-none">{loading ? '--' : `${healthPercent}%`}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 mb-6">
          {categoryOptions.map((cat, idx) => (
            <motion.button
              key={cat}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-5 py-2.5 rounded-full font-mono text-[10px] font-black uppercase tracking-wider transition-all border whitespace-nowrap",
                activeCategory === cat 
                  ? "bg-[#00a3ff] text-white border-[#00a3ff] shadow-[0_0_20px_rgba(0,163,255,0.4)]" 
                  : "bg-surface-container-low text-on-surface-variant border-outline-variant/10 hover:border-[#00a3ff]/40"
              )}
            >
              {cat}
            </motion.button>
          ))}
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 opacity-40">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-10 h-10 border-2 border-white/20 border-t-white/80 rounded-full mb-4"
              />
              <p className="font-mono text-[10px] uppercase tracking-widest">Sincronizando inventário...</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-3xl bg-white/2">
              <Package className="w-12 h-12 text-on-surface-variant/20 mx-auto mb-4" />
              <p className="text-on-surface-variant text-sm">Nenhum equipamento encontrado.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredItems.map((eq, idx) => (
                <EquipmentCard 
                  key={eq.id} 
                  eq={eq} 
                  delay={idx * 0.05} 
                  onEdit={() => handleOpenModal(eq)}
                  onDelete={() => handleDelete(eq.id)}
                  isAdmin={isAdmin}
                />
              ))}
            </div>
          )}
        </div>

        <div className="h-24" />

        {isAdmin && (
          <motion.button
            onClick={() => handleOpenModal()}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="fixed bottom-24 right-6 w-16 h-16 rounded-2xl bg-gradient-to-br from-[#00a3ff] to-[#0070ff] flex items-center justify-center shadow-[0_8px_32px_rgba(0,163,255,0.4)] z-[60] border border-white/20"
          >
            <Plus className="w-8 h-8 text-white stroke-[3px]" />
          </motion.button>
        )}
      </div>

      <AnimatePresence>
        {showModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[70]"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-[80] max-h-[90vh] overflow-y-auto"
              style={{ background: 'linear-gradient(180deg, #15151f 0%, #0f0f17 100%)' }}
            >
              <div className="h-px bg-gradient-to-r from-transparent via-[#00a3ff]/40 to-transparent" />
              <div className="flex justify-center pt-4 pb-2">
                <div className="w-12 h-1.5 rounded-full bg-white/20" />
              </div>

              <div className="px-6 pb-12 pt-4">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <p className="font-mono text-[10px] text-[#00a3ff] uppercase tracking-[0.3em] font-black mb-1">
                      {editingItem ? 'ATUALIZAR' : 'NOVO RECURSO'}
                    </p>
                    <h2 className="font-sans text-2xl font-black text-white tracking-tight uppercase">
                      {editingItem ? 'Editar Equipamento' : 'Cadastrar Equipamento'}
                    </h2>
                  </div>
                  <button onClick={() => setShowModal(false)} className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center"><X className="w-5 h-5 text-on-surface-variant" /></button>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block font-mono text-[10px] uppercase font-black text-white/40 mb-2 tracking-widest">Nome do Equipamento *</label>
                      <input
                        type="text"
                        value={formData.nome}
                        onChange={e => setFormData({...formData, nome: e.target.value})}
                        placeholder="Ex: Shure SM58"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 font-sans text-white focus:outline-none focus:border-[#00a3ff]/50 transition-all"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block font-mono text-[10px] uppercase font-black text-white/40 mb-2 tracking-widest">Código Serial *</label>
                        <input
                          type="text"
                          value={formData.codigo}
                          onChange={e => setFormData({...formData, codigo: e.target.value})}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 font-mono text-sm text-white focus:outline-none focus:border-[#00a3ff]/50 uppercase"
                        />
                      </div>
                      <div>
                        <label className="block font-mono text-[10px] uppercase font-black text-white/40 mb-2 tracking-widest">Categoria</label>
                        <div className="relative">
                          <select
                            value={formData.categoria}
                            onChange={e => setFormData({...formData, categoria: e.target.value})}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 font-sans text-white appearance-none focus:outline-none"
                          >
                            {categoryOptions.filter(c => c !== 'TODOS').map(c => <option key={c} value={c} className="bg-[#15151f]">{c}</option>)}
                          </select>
                          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block font-mono text-[10px] uppercase font-black text-white/40 mb-2 tracking-widest">Quantidade</label>
                        <input
                          type="number"
                          value={formData.quantidade}
                          onChange={e => setFormData({...formData, quantidade: parseInt(e.target.value) || 1})}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 font-sans text-white focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block font-mono text-[10px] uppercase font-black text-white/40 mb-2 tracking-widest">Status Inicial</label>
                        <div className="relative">
                          <select
                            value={formData.status}
                            onChange={e => setFormData({...formData, status: e.target.value as any})}
                            className={cn(
                              "w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 font-sans font-bold appearance-none focus:outline-none",
                              statusConfig[formData.status]?.color || 'text-white'
                            )}
                          >
                            <option value="BOM" className="bg-[#15151f] text-[#4ae176]">BOM (OK)</option>
                            <option value="MANUTENÇÃO" className="bg-[#15151f] text-[#ffb95f]">MANUTENÇÃO</option>
                            <option value="DEFEITO" className="bg-[#15151f] text-[#ff6b6b]">DEFEITO</option>
                          </select>
                          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block font-mono text-[10px] uppercase font-black text-white/40 mb-2 tracking-widest">URL da Imagem</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={formData.imagem_url}
                          onChange={e => setFormData({...formData, imagem_url: e.target.value})}
                          placeholder="https://..."
                          className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-5 py-4 font-sans text-sm text-white focus:outline-none"
                        />
                        <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                          <Camera className="w-5 h-5 text-white/20" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <motion.button
                    onClick={handleSave}
                    disabled={isSaving || !formData.nome || !formData.codigo}
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                      "w-full py-5 rounded-2xl font-sans font-black uppercase text-sm tracking-widest flex items-center justify-center gap-3 transition-all",
                      saveSuccess 
                        ? "bg-[#4ae176] text-black" 
                        : "bg-gradient-to-r from-[#00a3ff] to-[#0070ff] text-white shadow-[0_8px_32px_rgba(0,163,255,0.3)] disabled:opacity-20"
                    )}
                  >
                    {isSaving ? (
                      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }}><Zap className="w-5 h-5" /></motion.div>
                    ) : saveSuccess ? (
                      <><Check className="w-5 h-5" /> Concluído!</>
                    ) : (
                      <><PlusCircle className="w-5 h-5" /> Confirmar Cadastro</>
                    )}
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
