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
  onGuestLogin: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({
  loginEmail,
  setLoginEmail,
  loginPassword,
  setLoginPassword,
  loginError,
  handleLoginSubmit,
  isLoading = false,
  onGuestLogin
}) => {
  return (
    <motion.div
      key="login-screen"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="flex-1 flex flex-col justify-center items-center bg-slate-950 p-4 relative overflow-y-auto min-h-screen w-full py-8 sm:py-12"
    >
      {/* Background Orbs Responsivos */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 sm:left-10 sm:translate-x-0 w-64 h-64 sm:w-96 sm:h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none animate-pulse duration-3000" />
      <div className="absolute bottom-10 right-1/2 translate-x-1/2 sm:right-10 sm:translate-x-0 w-64 h-64 sm:w-96 sm:h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none animate-pulse duration-3000" />

      <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl sm:rounded-3xl w-full max-w-sm p-5 sm:p-8 shadow-2xl relative z-10 flex flex-col items-center">
        
        {/* Cabeçalho do App */}
        <div className="flex flex-col items-center gap-2.5 sm:gap-3 mb-5 sm:mb-6 select-none text-center">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-blue-600 rounded-xl sm:rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20 mb-1 sm:mb-2">
            <Lucide.MessageCircleHeart className="w-8 h-8 sm:w-10 sm:h-10 stroke-[2.5]" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">Conecta PECS</h2>
          </div>
        </div>

        {/* Formulário */}
        <form onSubmit={handleLoginSubmit} className="w-full flex flex-col space-y-3.5 sm:space-y-4">
          {loginError && (
            <motion.div 
              initial={{ opacity: 0, y: -5 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="bg-rose-500/15 border border-rose-500/30 text-rose-200 text-xs py-2 px-3 rounded-lg text-center font-bold"
            >
              {loginError}
            </motion.div>
          )}

          {/* Campo E-mail */}
          <div className="space-y-1 sm:space-y-1.5">
            <label className="block text-[10px] sm:text-[11px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 select-none">
              <Lucide.Mail className="w-3.5 h-3.5 text-blue-500" /> E-mail
            </label>
            <input 
              type="email" 
              required 
              placeholder="Digite o e-mail..." 
              value={loginEmail} 
              onChange={(e) => setLoginEmail(e.target.value)} 
              className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl sm:rounded-2xl py-2.5 sm:py-3 px-3.5 sm:px-4 text-white text-base sm:text-sm font-semibold focus:outline-none transition-all" 
            />
          </div>

          {/* Campo Senha */}
          <div className="space-y-1 sm:space-y-1.5">
            <label className="block text-[10px] sm:text-[11px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 select-none">
              <Lucide.Key className="w-3.5 h-3.5 text-blue-500" /> Senha de Acesso:
            </label>
            <input 
              type="password" 
              required 
              placeholder="••••••••" 
              value={loginPassword} 
              onChange={(e) => setLoginPassword(e.target.value)} 
              className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl sm:rounded-2xl py-2.5 sm:py-3 px-3.5 sm:px-4 text-white text-base sm:text-sm font-semibold focus:outline-none transition-all tracking-widest font-mono" 
            />
          </div>

          {/* Botão Oficial */}
          <div className="flex pt-1 sm:pt-2">
            <button 
              type="submit" 
              disabled={!loginEmail || !loginPassword || isLoading} 
              className={`w-full py-3 sm:py-3.5 font-extrabold rounded-xl text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
                (!loginEmail || !loginPassword || isLoading) 
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20 active:scale-95'
              }`}
            >
              {isLoading ? (
                <Lucide.Loader2 className="w-4.5 h-4.5 animate-spin" />
              ) : (
                <>
                  <Lucide.LogIn className="w-4 h-4 sm:w-4.5 sm:h-4.5" /> 
                  <span>Entrar e Parear</span>
                </>
              )}
            </button>
          </div>

          {/* --- DIVISOR VISUAL --- */}
          <div className="relative flex py-0.5 sm:py-1 items-center select-none">
            <div className="flex-grow border-t border-slate-800/80"></div>
            <span className="flex-shrink mx-3 text-slate-500 text-[9px] sm:text-[10px] font-extrabold uppercase tracking-widest">ou</span>
            <div className="flex-grow border-t border-slate-800/80"></div>
          </div>

          {/* --- BOTÃO DO MODO DE TESTES / DEMONSTRAÇÃO --- */}
          <div className="flex">
            <button 
              type="button" 
              onClick={onGuestLogin}
              disabled={isLoading}
              className="w-full py-2.5 sm:py-3 bg-slate-950 border border-slate-800/80 hover:bg-slate-800/40 text-slate-300 font-bold rounded-xl text-[10px] sm:text-xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <Lucide.MonitorPlay className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-400" />
              Acessar Modo de Demonstração
            </button>
          </div>

        </form>
      </div>
    </motion.div>
  );
};

export default LoginScreen;