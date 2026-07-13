import React from 'react';
import { motion } from 'motion/react';
import * as Lucide from 'lucide-react';

export interface LoginScreenProps {
  loginEmail: string;
  setLoginEmail: (email: string) => void;
  loginPassword: string;
  setLoginPassword: (password: string) => void;
  loginError: string;
  handleLoginSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
  onGuestLogin: () => void; // Declarado perfeitamente nas props
}

const LoginScreen: React.FC<LoginScreenProps> = ({
  loginEmail,
  setLoginEmail,
  loginPassword,
  setLoginPassword,
  loginError,
  handleLoginSubmit,
  isLoading = false,
  onGuestLogin // <-- CORRIGIDO: Agora o componente recebe a função aqui!
}) => {
  return (
    <motion.div
      key="login-screen"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="flex-1 flex flex-col justify-center items-center bg-slate-950 p-4 relative overflow-y-auto h-full w-full"
    >
      <div className="absolute top-10 left-10 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-3xl w-full max-w-sm p-6 md:p-8 shadow-2xl relative z-10 flex flex-col items-center">
        
        <div className="flex flex-col items-center gap-3 mb-6 select-none text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20 mb-2">
            <Lucide.MessageCircleHeart size={38} className="stroke-[2.5]" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">Conecta PECS</h2>
          </div>
        </div>

        <form onSubmit={handleLoginSubmit} className="w-full flex flex-col space-y-4">
          {loginError && (
            <motion.div 
              initial={{ opacity: 0, y: -5 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="bg-rose-500/15 border border-rose-500/30 text-rose-200 text-xs py-2.5 px-3 rounded-lg text-center font-bold"
            >
              {loginError}
            </motion.div>
          )}

          <div className="space-y-1.5">
            <label className="block text-[11px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 select-none">
              <Lucide.Mail size={13} className="text-blue-500" /> E-mail
            </label>
            <input 
              type="email" 
              required 
              placeholder="Digite o e-mail..." 
              value={loginEmail} 
              onChange={(e) => setLoginEmail(e.target.value)} 
              className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-2xl py-3 px-4 text-white text-sm font-semibold focus:outline-none transition-all" 
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-[11px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 select-none">
              <Lucide.Key size={13} className="text-blue-500" /> Senha de Acesso:
            </label>
            <input 
              type="password" 
              required 
              placeholder="••••••••" 
              value={loginPassword} 
              onChange={(e) => setLoginPassword(e.target.value)} 
              className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-2xl py-3 px-4 text-white text-sm font-semibold focus:outline-none transition-all tracking-widest font-mono" 
            />
          </div>

          {/* Botão Oficial */}
          <div className="flex pt-2">
            <button 
              type="submit" 
              disabled={!loginEmail || !loginPassword || isLoading} 
              className={`w-full py-3.5 font-extrabold rounded-xl text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
                (!loginEmail || !loginPassword || isLoading) 
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20 active:scale-95'
              }`}
            >
              {isLoading ? (
                <Lucide.Loader2 size={18} className="animate-spin" />
              ) : (
                <><Lucide.LogIn size={18} /> Entrar e Parear</>
              )}
            </button>
          </div>

          {/* --- DIVISOR VISUAL INTEGRADO --- */}
          <div className="relative flex py-1 items-center select-none">
            <div className="flex-grow border-t border-slate-800/80"></div>
            <span className="flex-shrink mx-3 text-slate-500 text-[10px] font-extrabold uppercase tracking-widest">ou</span>
            <div className="flex-grow border-t border-slate-800/80"></div>
          </div>

          {/* --- NOVO: BOTÃO DO MODO DE TESTES / DEMONSTRAÇÃO --- */}
          <div className="flex">
            <button 
              type="button" // Mantém type="button" para o HTML não achar que é um submit convencional
              onClick={onGuestLogin}
              disabled={isLoading}
              className="w-full py-3 bg-slate-950 border border-slate-800/80 hover:bg-slate-800/40 text-slate-300 font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <Lucide.MonitorPlay size={15} className="text-purple-400" />
              Acessar Modo de Demonstração
            </button>
          </div>

        </form>
      </div>
    </motion.div>
  );
};

export default LoginScreen;