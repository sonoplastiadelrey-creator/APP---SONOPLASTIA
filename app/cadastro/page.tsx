'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { supabase } from '@/lib/supabase';
import { 
  Shield, 
  Mail, 
  Lock, 
  User, 
  ChevronRight, 
  Music, 
  Tv,
  Loader2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

// --- Visual Helpers ---
function ParticleOrb({ x, y, color, delay, size = 300 }: { x: string; y: string; color: string; delay: number; size?: number }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{ left: x, top: y, width: size, height: size, background: color, filter: 'blur(100px)', opacity: 0 }}
      animate={{ opacity: [0, 0.2, 0], scale: [0.8, 1.3, 0.8], x: [0, 50, 0], y: [0, -30, 0] }}
      transition={{ duration: 12, delay, repeat: Infinity, ease: 'easeInOut' }}
    />
  );
}

export default function CadastroPage() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [funcao, setFuncao] = useState<'SONOPLASTA' | 'DATASHOW'>('SONOPLASTA');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [adminCode, setAdminCode] = useState('');

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password: password.trim(),
        options: {
          data: {
            nome,
            funcao,
            admin_code: adminCode.trim() || undefined
          }
        }
      });

      if (signUpError) throw signUpError;
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Erro ao realizar cadastro');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <main className="min-h-screen bg-[#06060a] flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 z-0 text-center">
          <img 
            src="/login-bg.png" 
            className="w-full h-full object-cover opacity-20 blur-sm"
            alt="Background"
          />
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 w-full max-w-sm bg-[#0f0f12]/80 backdrop-blur-2xl p-10 rounded-[3rem] border border-white/10 text-center shadow-[0_30px_100px_rgba(0,0,0,0.8)]"
        >
          <div className="w-20 h-20 bg-[#4ae176]/10 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-[#4ae176]/20 shadow-[0_0_30px_rgba(74,225,118,0.1)]">
             <CheckCircle2 className="w-10 h-10 text-[#4ae176]" />
          </div>
          <h2 className="font-sans font-black text-3xl text-white tracking-tighter uppercase mb-4 italic">
            ALISTAMENTO CONCLUÍDO
          </h2>
          <p className="font-mono text-white/40 text-[10px] uppercase font-black tracking-widest leading-relaxed mb-10">
            AUTENTICAÇÃO_PENDENTE: VERIFIQUE SEU E-MAIL PARA ATIVAR O PROTOCOLO DE ACESSO.
          </p>
          <Link 
            href="/login"
            className="block w-full py-5 bg-[#00a3ff] rounded-2xl font-mono text-xs font-black uppercase tracking-[0.2em] text-white shadow-[0_15px_40px_rgba(0,163,255,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            SISTEMA_LOGIN
          </Link>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#06060a] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Cinematic Background Layer */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/60 z-10" />
        <img 
          src="/login-bg.png" 
          className="w-full h-full object-cover scale-110 opacity-40 blur-[2px]"
          alt="Technical Background"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-[#06060a] via-transparent to-[#00a3ff]/10 z-20" />
        
        {/* Dynamic Light Effects */}
        <ParticleOrb x="80%" y="10%" color="#00a3ff" delay={0} size={400} />
        <ParticleOrb x="-10%" y="60%" color="#4ae176" delay={4} size={350} />
        
        {/* Scanning Line Effect */}
        <motion.div 
          animate={{ x: ['100%', '-100%'] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 opacity-[0.03] pointer-events-none z-30"
          style={{ background: 'linear-gradient(90deg, transparent, white, transparent)', width: '200%' }}
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-50 w-full max-w-md"
      >
        <div className="text-center mb-10">
           <div className="flex items-center justify-center gap-2 mb-3">
              <Shield className="w-5 h-5 text-[#00a3ff]" />
              <span className="font-mono text-[9px] text-[#00a3ff] uppercase tracking-[0.4em] font-black italic">Operação Alpha: Alistamento</span>
           </div>
           <h1 className="font-sans font-black text-5xl text-white tracking-tight uppercase italic leading-none">
             NOVO_AGENTE
           </h1>
           <div className="h-1 w-12 bg-[#00a3ff] mx-auto mt-4 rounded-full shadow-[0_0_15px_#00a3ff]" />
        </div>

        <div className="bg-[#0f0f12]/70 backdrop-blur-3xl p-10 rounded-[3rem] border border-white/10 shadow-[0_30px_100px_rgba(0,0,0,0.8)] relative overflow-hidden">
           <form onSubmit={handleSignUp} className="space-y-6 relative z-10">
              <InputGroup 
                label="NOME_COMPLETO" 
                icon={User} 
                type="text" 
                value={nome} 
                onChange={setNome} 
                placeholder="Ex: Gabriel Macedo"
              />

              <InputGroup 
                label="IDENTIDADE_EMAIL" 
                icon={Mail} 
                type="email" 
                value={email} 
                onChange={setEmail} 
                placeholder="operador@sonoplastia.com"
              />

              <InputGroup 
                label="CHAVE_ACESSO" 
                icon={Lock} 
                type="password" 
                value={password} 
                onChange={setPassword} 
                placeholder="••••••••"
              />

              <div className="space-y-3">
                <label className="text-white/20 font-mono text-[10px] font-black uppercase tracking-widest ml-1">FUNÇÃO_OPERACIONAL</label>
                <div className="grid grid-cols-2 gap-4">
                   <button
                     type="button"
                     onClick={() => setFuncao('SONOPLASTA')}
                     className={cn(
                       "flex items-center justify-center gap-3 py-5 rounded-2xl border transition-all relative overflow-hidden group",
                       funcao === 'SONOPLASTA' ? "bg-[#00a3ff]/15 border-[#00a3ff] text-white shadow-[0_0_20px_#00a3ff22]" : "bg-black/40 border-white/5 text-white/20 hover:border-white/20"
                     )}
                   >
                     <Music className={cn("w-5 h-5", funcao === 'SONOPLASTA' ? "text-[#00a3ff]" : "text-white/10")} />
                     <span className="font-mono text-[10px] font-black uppercase tracking-widest">SONOPLASTA</span>
                   </button>
                   <button
                     type="button"
                     onClick={() => setFuncao('DATASHOW')}
                     className={cn(
                       "flex items-center justify-center gap-3 py-5 rounded-2xl border transition-all relative overflow-hidden group",
                       funcao === 'DATASHOW' ? "bg-[#ffb95f]/15 border-[#ffb95f] text-white shadow-[0_0_20px_#ffb95f22]" : "bg-black/40 border-white/5 text-white/20 hover:border-white/20"
                     )}
                   >
                     <Tv className={cn("w-5 h-5", funcao === 'DATASHOW' ? "text-[#ffb95f]" : "text-white/10")} />
                     <span className="font-mono text-[10px] font-black uppercase tracking-widest">DATASHOW</span>
                   </button>
                </div>
              </div>

              <div className="pt-4 border-t border-white/5">
                <InputGroup 
                  label="CÓDIGO_DE_SEGURANÇA_ALTO_COMANDO (Apenas para Admins)" 
                  icon={Shield} 
                  type="password" 
                  value={adminCode} 
                  onChange={setAdminCode} 
                  placeholder="Deixe em branco para acesso comum"
                  required={false}
                />
              </div>

              {error && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }} 
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl text-red-500 font-mono text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-3"
                >
                  <AlertCircle className="absolute left-4 w-4 h-4" />
                  {error}
                </motion.div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-6 bg-gradient-to-r from-[#00a3ff] to-[#0070ff] rounded-2xl flex items-center justify-center gap-3 font-mono text-xs font-black uppercase tracking-[0.3em] text-white shadow-[0_15px_40px_rgba(0,163,255,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 overflow-hidden group relative"
              >
                <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    INICIAR_ALISTAMENTO <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
           </form>

           <div className="mt-10 text-center pt-8 border-t border-white/5">
              <p className="font-mono text-white/20 text-[9px] font-black uppercase tracking-widest">
                JÁ POSSUI CREDENCIAIS? <Link href="/login" className="text-[#00a3ff] hover:text-white transition-colors ml-2 font-black">LOGIN_SISTEMA</Link>
              </p>
           </div>
        </div>

        <div className="mt-12 flex justify-center items-center gap-10 text-white/10 font-mono text-[9px] uppercase tracking-[0.5em] font-black">
           <span className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-[#4ae176] shadow-[0_0_8px_#4ae176]" /> ENCRYPTION: active</span>
           <span>CMD_CTR: 27.92.1</span>
        </div>
      </motion.div>
    </main>
  );
}

function InputGroup({ label, icon: Icon, type, value, onChange, placeholder, required = true }: any) {
  return (
    <div className="space-y-3">
      <label className="text-white/20 font-mono text-[10px] font-black uppercase tracking-widest ml-1">{label}</label>
      <div className="relative group">
        <Icon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/10 group-focus-within:text-[#00a3ff] transition-all" />
        <input 
          type={type} 
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-black/40 border border-white/5 rounded-2xl py-5 pl-14 pr-6 text-sm font-sans text-white placeholder:text-white/5 focus:outline-none focus:border-[#00a3ff]/40 transition-all font-black"
        />
      </div>
    </div>
  );
}
