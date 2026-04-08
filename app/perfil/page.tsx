'use client';

import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import { 
  Camera, 
  Save, 
  Trash2, 
  ChevronLeft,
  AudioLines,
  Monitor,
  Shield,
  Loader2,
  CheckCircle2,
  Mail,
  User as UserIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/lib/supabase';

export default function PerfilPage() {
  const { user, profile, loading: authLoading, isAdmin } = useAuth();
  const [nome, setNome] = useState('');
  const [funcao, setFuncao] = useState('SONOPLASTA');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile) {
      setNome(profile.full_name || '');
      setFuncao(profile.funcao || 'SONOPLASTA');
      setAvatarUrl(profile.avatar_url || '');
      setLoading(false);
    } else if (!authLoading) {
      // Finished loading auth, whether user exists or not
      setLoading(false);
    }
  }, [profile, authLoading]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: nome,
          funcao: funcao,
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Erro ao salvar perfil:', err);
      alert('Erro ao salvar as alterações.');
    } finally {
      setIsSaving(false);
    }
  };

  if (authLoading || loading) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center py-40 gap-4 opacity-40">
           <Loader2 className="w-10 h-10 animate-spin text-[#00a3ff]" />
           <p className="font-mono text-[10px] uppercase tracking-widest font-black">Sincronizando Banco de Dados...</p>
        </div>
      </AppLayout>
    );
  }

  if (!user) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center py-40 gap-6">
           <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center border border-red-500/20">
              <Shield className="w-10 h-10 text-red-500" />
           </div>
           <div className="text-center">
             <h2 className="font-sans font-black text-2xl text-white uppercase italic">ACESSO NEGADO</h2>
             <p className="font-mono text-white/40 text-xs mt-2 mb-8">Você precisa estar autenticado para visualizar esta página.</p>
             <a 
               href="/login" 
               className="px-8 py-3 bg-[#00a3ff] text-white font-mono text-[10px] font-black uppercase tracking-widest rounded-xl shadow-[0_10px_20px_rgba(0,163,255,0.3)] hover:scale-105 transition-transform"
             >
               Ir para Login
             </a>
           </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-12 pb-20">
        {/* Orbes de luz decorativos */}
        <div className="fixed inset-0 pointer-events-none z-0">
           <div className="absolute top-[20%] right-[10%] w-[400px] h-[400px] bg-[#00a3ff]/5 blur-[120px] rounded-full" />
           <div className="absolute bottom-[20%] left-[10%] w-[300px] h-[300px] bg-[#4ae176]/5 blur-[100px] rounded-full" />
        </div>

        {/* Header Section */}
        <div className="relative z-10">
           <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-xl bg-[#00a3ff]/10 border border-[#00a3ff]/20 flex items-center justify-center">
                 <UserIcon className="w-4 h-4 text-[#00a3ff]" />
              </div>
              <span className="font-mono text-[10px] text-[#00a3ff] uppercase tracking-[0.4em] font-black italic">Identidade Operacional</span>
           </div>
           <h2 className="font-sans font-black text-5xl text-white tracking-tighter uppercase italic leading-none">PERFIL DO OPERADOR</h2>
        </div>

        <form onSubmit={handleSave} className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Coluna Esquerda: Avatar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white/5 backdrop-blur-2xl rounded-[3rem] p-8 border border-white/10 flex flex-col items-center justify-center relative group overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-b from-[#00a3ff]/10 to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative w-48 h-48 rounded-[2.5rem] border-4 border-dashed border-white/10 group-hover:border-[#00a3ff]/30 flex items-center justify-center overflow-hidden bg-black/40 transition-all duration-500">
                {avatarUrl ? (
                  <img 
                    src={avatarUrl} 
                    alt="Profile" 
                    className="absolute inset-0 w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${nome}&background=00a3ff&color=fff&size=200`;
                    }}
                  />
                ) : (
                  <div className="bg-[#00a3ff]/10 w-full h-full flex items-center justify-center">
                     <UserIcon className="w-16 h-16 text-[#00a3ff]/40" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity backdrop-blur-sm">
                   <Camera className="w-10 h-10 text-[#00a3ff] mb-2" />
                   <span className="font-mono text-[8px] text-white font-black uppercase">Alterar Foto</span>
                </div>
              </div>

              <div className="mt-8 w-full">
                 <label className="block font-mono text-[10px] uppercase font-bold text-white/20 mb-3 tracking-widest ml-2">URL DA IMAGEM</label>
                 <input 
                   type="text" 
                   value={avatarUrl}
                   onChange={(e) => setAvatarUrl(e.target.value)}
                   placeholder="https://exemplo.com/foto.jpg"
                   className="w-full bg-black/40 border border-white/5 border-dashed rounded-2xl p-4 text-xs font-mono text-white/60 focus:outline-none focus:border-[#00a3ff]/40 transition-all"
                 />
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-xl rounded-[2rem] p-6 border border-white/5 space-y-4">
               <div className="flex items-center justify-between">
                  <span className="font-mono text-[9px] text-white/30 uppercase font-black italic">Status do Perfil</span>
                  <div className="flex items-center gap-1.5 bg-[#4ae176]/10 px-2 py-0.5 rounded-full border border-[#4ae176]/20">
                     <div className="w-1.5 h-1.5 rounded-full bg-[#4ae176] shadow-[0_0_8px_#4ae176]" />
                     <span className="font-mono text-[8px] text-[#4ae176] font-black uppercase tracking-widest leading-none">Ativo</span>
                  </div>
               </div>
               <div className="flex items-center justify-between">
                  <span className="font-mono text-[9px] text-white/30 uppercase font-black italic">Privilégios</span>
                  <span className={cn(
                    "font-mono text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border",
                    isAdmin ? "bg-[#00a3ff]/10 text-[#00a3ff] border-[#00a3ff]/20" : "bg-white/5 text-white/40 border-white/5"
                  )}>
                    {isAdmin ? 'Administrador' : 'Agente Padrão'}
                  </span>
               </div>
            </div>
          </div>

          {/* Coluna Direita: Dados */}
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white/5 backdrop-blur-2xl rounded-[3rem] p-10 border border-white/10 shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                  <Shield className="w-40 h-40 text-white" />
               </div>

               <div className="space-y-8">
                  <InputGroup 
                    label="NOME COMPLETO OU APELIDO" 
                    icon={UserIcon} 
                    type="text" 
                    value={nome} 
                    onChange={setNome} 
                    placeholder="Gabriel 'Gabs' Macedo"
                  />

                  <div className="space-y-4">
                    <label className="block font-mono text-[10px] uppercase font-black text-white/20 mb-2 tracking-[0.3em] ml-2">ATRIBUIÇÃO OPERACIONAL</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <RoleOption 
                        title="Sonoplasta" 
                        sub="AUDIO_ENGINEER_MASTER" 
                        icon={AudioLines} 
                        active={funcao === 'SONOPLASTA'}
                        onClick={() => setFuncao('SONOPLASTA')}
                        color="#00a3ff"
                      />
                      <RoleOption 
                        title="Datashow" 
                        sub="VISUAL_MEDIA_SPECIALIST" 
                        icon={Monitor} 
                        active={funcao === 'DATASHOW'}
                        onClick={() => setFuncao('DATASHOW')}
                        color="#ffb95f"
                      />
                    </div>
                  </div>

                  <div className="bg-black/20 rounded-2xl p-6 border border-white/5 flex items-center justify-between">
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                           <Mail className="w-5 h-5 text-white/20" />
                        </div>
                        <div>
                           <p className="font-mono text-[10px] text-white/20 uppercase font-black leading-none mb-1">E-mail de Cadastro</p>
                           <p className="font-sans text-sm font-bold text-white/60">{user.email}</p>
                        </div>
                     </div>
                     <span className="font-mono text-[8px] text-white/10 italic">Não Alterável</span>
                  </div>
               </div>
            </div>

            {/* Ações */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                type="submit" 
                disabled={isSaving}
                className={cn(
                  "flex-1 h-16 rounded-2xl flex items-center justify-center gap-3 transition-all relative overflow-hidden group",
                  saveSuccess 
                    ? "bg-[#4ae176] text-white shadow-[0_10px_30px_rgba(74,225,118,0.4)]" 
                    : "bg-[#00a3ff] text-white shadow-[0_10px_30px_rgba(0,163,255,0.4)] hover:scale-[1.02] active:scale-[0.98]"
                )}
              >
                {isSaving ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : saveSuccess ? (
                  <>
                    <CheckCircle2 className="w-6 h-6" />
                    <span className="font-mono text-sm font-black uppercase tracking-widest">PERFIL ATUALIZADO</span>
                  </>
                ) : (
                  <>
                    <Save className="w-6 h-6" />
                    <span className="font-mono text-sm font-black uppercase tracking-widest">SALVAR ALTERAÇÕES</span>
                  </>
                )}
              </button>
              
              <button 
                type="button" 
                onClick={() => window.location.reload()}
                className="px-10 h-16 rounded-2xl font-mono text-xs font-black text-white/20 uppercase tracking-[0.2em] border border-white/5 hover:bg-white/5 transition-colors"
              >
                DESCARTAR
              </button>
            </div>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}

function InputGroup({ label, icon: Icon, type, value, onChange, placeholder }: any) {
  return (
    <div className="space-y-3">
      <label className="text-white/20 font-mono text-[10px] font-black uppercase tracking-widest ml-2">{label}</label>
      <div className="relative group">
        <Icon className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-white/10 group-focus-within:text-[#00a3ff] transition-colors" />
        <input 
          type={type} 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-black/40 border border-white/10 rounded-[2rem] py-6 pl-16 pr-8 text-lg font-sans text-white placeholder:text-white/5 focus:outline-none focus:border-[#00a3ff]/40 transition-all font-black"
        />
        <div className="absolute inset-0 rounded-[2rem] border border-[#00a3ff]/0 group-focus-within:border-[#00a3ff]/20 pointer-events-none transition-all" />
      </div>
    </div>
  );
}

function RoleOption({ title, sub, icon: Icon, active, onClick, color }: any) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative p-6 bg-black/40 rounded-[2rem] border transition-all text-left group overflow-hidden",
        active ? `border-white/20 bg-gradient-to-br from-white/5 to-transparent` : "border-white/5 hover:border-white/10"
      )}
    >
      {active && (
        <motion.div layoutId="perfilRoleGlow" className="absolute inset-0 opacity-10" style={{ backgroundColor: color }} />
      )}
      
      <div className="flex items-center gap-5 relative z-10">
        <div className={cn(
          "w-12 h-12 rounded-2xl flex items-center justify-center transition-all",
          active ? `bg-[${color}]/20 text-[${color}]` : "bg-white/5 text-white/20"
        )} style={{ backgroundColor: active ? `${color}20` : undefined, color: active ? color : undefined }}>
           <Icon className="w-6 h-6" />
        </div>
        <div>
          <span className={cn(
            "block font-sans font-black text-lg tracking-tight uppercase leading-none mb-1",
            active ? "text-white" : "text-white/40"
          )}>{title}</span>
          <span className="block font-mono text-[9px] text-white/20 font-black uppercase tracking-widest">{sub}</span>
        </div>
      </div>

      {active && (
        <div className="absolute top-4 right-4" style={{ color }}>
           <CheckCircle2 className="w-4 h-4 shadow-[0_0_10px_currentColor]" />
        </div>
      )}
    </button>
  );
}
