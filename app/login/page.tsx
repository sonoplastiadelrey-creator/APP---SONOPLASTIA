'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { supabase } from '@/lib/supabase';
import { 
  Shield, 
  Mail, 
  Lock, 
  ChevronRight, 
  Loader2,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (loginError) throw loginError;
      
      router.push('/');
    } catch (err: any) {
      setError('Credenciais inválidas ou acesso negado.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#06060a] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Cinematic Background Layer */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/60 z-10" /> {/* Darker overlay for better contrast */}
        <img 
          src="/login-bg.png" 
          className="w-full h-full object-cover scale-110 opacity-40 blur-[2px]"
          alt="Technical Background"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-[#06060a] via-transparent to-[#00a3ff]/10 z-20" />
        
        {/* Dynamic Light Effects */}
        <ParticleOrb x="5%" y="10%" color="#00a3ff" delay={0} size={400} />
        <ParticleOrb x="75%" y="60%" color="#4ae176" delay={4} size={350} />
        <ParticleOrb x="40%" y="-10%" color="#c77dff" delay={8} size={300} />
        
        {/* Scanning Line Effect */}
        <motion.div 
          animate={{ x: ['100%', '-100%'] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 opacity-[0.03] pointer-events-none z-30"
          style={{ background: 'linear-gradient(90deg, transparent, white, transparent)', width: '200%' }}
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-50 w-full max-w-sm"
      >
        <div className="text-center mb-12 relative">
           <motion.div 
             initial={{ opacity: 0, y: -10 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.3 }}
             className="flex items-center justify-center gap-2 mb-4"
           >
              <Shield className="w-5 h-5 text-[#00a3ff] drop-shadow-[0_0_10px_#00a3ff]" />
              <span className="font-mono text-[9px] text-[#00a3ff] uppercase tracking-[0.5em] font-black italic">Operação Alpha v4.2</span>
           </motion.div>
           <h1 className="font-sans font-black text-6xl text-white tracking-tight uppercase italic leading-none drop-shadow-2xl">
             LOGIN
           </h1>
           <div className="h-1 w-12 bg-[#00a3ff] mx-auto mt-4 rounded-full shadow-[0_0_15px_#00a3ff]" />
        </div>

        <div className="bg-[#0f0f12]/60 backdrop-blur-2xl p-10 rounded-[3rem] border border-white/10 shadow-[0_30px_100px_rgba(0,0,0,0.8)] relative overflow-hidden">
           {/* Card Interior Glow */}
           <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#00a3ff]/5 blur-[60px] rounded-full" />
           
           <form onSubmit={handleLogin} className="space-y-8 relative z-10">
              <div className="space-y-3 text-left">
                <label className="text-white/20 font-mono text-[10px] font-black uppercase tracking-widest ml-1">IDENTIDADE_OPERADOR</label>
                <div className="relative group">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/10 group-focus-within:text-[#00a3ff] transition-all" />
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@sonoplastia.com"
                    className="w-full bg-black/40 border border-white/5 rounded-2xl py-5 pl-14 pr-6 text-sm font-sans text-white placeholder:text-white/5 focus:outline-none focus:border-[#00a3ff]/40 transition-all font-black"
                  />
                </div>
              </div>

              <div className="space-y-3 text-left">
                <div className="flex justify-between items-center ml-1">
                   <label className="text-white/20 font-mono text-[10px] font-black uppercase tracking-widest">CHAVE_ACESSO</label>
                   <a href="#" className="text-[#00a3ff] font-mono text-[9px] font-black uppercase tracking-widest hover:text-white transition-colors">RECUPERAR_CHAVE</a>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/10 group-focus-within:text-[#00a3ff] transition-all" />
                  <input 
                    type="password" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-black/40 border border-white/5 rounded-2xl py-5 pl-14 pr-6 text-sm font-sans text-white placeholder:text-white/5 focus:outline-none focus:border-[#00a3ff]/40 transition-all font-black"
                  />
                </div>
              </div>

              {error && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }} 
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl text-red-500 font-mono text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-3"
                >
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </motion.div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-6 bg-gradient-to-r from-[#00a3ff] to-[#0070ff] rounded-2xl flex items-center justify-center gap-3 font-mono text-xs font-black uppercase tracking-[0.3em] text-white shadow-[0_15px_40px_rgba(0,163,255,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 group overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    AUTENTICAR <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
           </form>

           <div className="mt-10 text-center pt-8 border-t border-white/5">
              <p className="font-mono text-white/20 text-[9px] uppercase tracking-widest font-black">
                SEM ACESSO? <Link href="/cadastro" className="text-[#00a3ff] hover:text-white transition-colors ml-2">ALISTAR PROCESSO</Link>
              </p>
           </div>
        </div>

        <div className="mt-12 flex justify-center items-center gap-10 text-white/10 font-mono text-[9px] uppercase tracking-[0.5em] font-black">
           <span className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-[#4ae176] shadow-[0_0_8px_#4ae176]" /> STATUS: ONLINE</span>
           <span>CMD_CTR: 27.92.1</span>
        </div>
      </motion.div>
    </main>
  );
}
