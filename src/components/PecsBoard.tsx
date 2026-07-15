import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import * as Lucide from 'lucide-react';
import { collection, query, where, onSnapshot, updateDoc, doc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { PecsCardType } from '../types';
import SentenceBar from './SentenceBar';
import PecsCard from './PecsCard'; 
import { speakText } from '../utils/speech';

interface PecsBoardProps {
  cards: PecsCardType[];
  setCards: React.Dispatch<React.SetStateAction<PecsCardType[]>>;
  profile: { name: string; age: string; city: string; phone: string };
  spokenHistory: { id: string; phrase: string; timestamp: string }[];
  setSpokenHistory: React.Dispatch<React.SetStateAction<{ id: string; phrase: string; timestamp: string }[]>>;
  activeRole: 'student' | 'therapist' | 'parent';
  onOpenPanel: () => void;
  username: string;
}

export default function PecsBoard({
  cards, setCards, profile, spokenHistory, setSpokenHistory,
  activeRole, onOpenPanel, username
}: PecsBoardProps) {

  const [sentence, setSentence] = useState<PecsCardType[]>([]);
  const [historyStack, setHistoryStack] = useState<string[]>(['home']);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [customCards, setCustomCards] = useState<PecsCardType[]>([]);

  const ultimoCliqueRef = useRef<number>(0);
  const boasVindasFaladas = useRef<boolean>(false);

  const currentCategory = historyStack[historyStack.length - 1] || 'home';

  useEffect(() => {
    const nomeParaBoasVindas = profile?.name || username;

    if (nomeParaBoasVindas && !boasVindasFaladas.current) {
      const timer = setTimeout(() => {
        speakText(`Bem-vindo, ${nomeParaBoasVindas}!`);
        boasVindasFaladas.current = true;
      }, 800);

      return () => clearTimeout(timer);
    }
  }, [profile?.name, username]);

  useEffect(() => {
    const syncSentence = async () => {
      const savedConfig = localStorage.getItem('paciente_conectado');
      const alunoData = savedConfig ? JSON.parse(savedConfig) : null;
      
      if (alunoData && alunoData.id) {
        try {
          const pacienteRef = doc(db, "pacientes", alunoData.id);
          await updateDoc(pacienteRef, {
            currentSentence: sentence
          });
        } catch (error) {
          console.error("Erro ao sincronizar com monitoramento:", error);
        }
      }
    };
    syncSentence();
  }, [sentence]);

  const categorySentenceHelpers: Record<string, { label: string; voiceText: string; icon: string; color: string; bgColor: string; borderColor: string }> = {
    comer: { label: 'eu quero comer', voiceText: 'eu quero comer', icon: 'utensils', color: 'text-amber-600', bgColor: 'bg-amber-50', borderColor: 'border-amber-200' },
    brincar: { label: 'eu quero brincar', voiceText: 'eu quero brincar de', icon: 'gamepad', color: 'text-sky-600', bgColor: 'bg-sky-50', borderColor: 'border-sky-200' },
    ir: { label: 'eu quero ir', voiceText: 'eu quero ir para', icon: 'footprints', color: 'text-purple-600', bgColor: 'bg-purple-50', borderColor: 'border-purple-200' },
    sentimentos: { label: 'eu me sinto', voiceText: 'eu estou me sentindo', icon: 'smile', color: 'text-rose-600', bgColor: 'bg-rose-50', borderColor: 'border-rose-200' },
    querer: { label: 'eu quero', voiceText: 'eu quero', icon: 'hand', color: 'text-blue-600', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' },
    familia: { label: 'minha família', voiceText: 'minha família', icon: 'users', color: 'text-emerald-600', bgColor: 'bg-emerald-50', borderColor: 'border-emerald-200' },
    sobre: { label: 'sobre mim', voiceText: 'conversa sobre mim', icon: 'user', color: 'text-indigo-600', bgColor: 'bg-indigo-50', borderColor: 'border-indigo-200' }
  };

  useEffect(() => {
    const savedConfig = localStorage.getItem('paciente_conectado');
    const alunoData = savedConfig ? JSON.parse(savedConfig) : null;
    
    if (alunoData && alunoData.id) {
      const q = query(
        collection(db, "cartoes_customizados"), 
        where("paciente_id", "==", alunoData.id)
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const cartoesFormatados = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          isCustom: true
        })) as PecsCardType[];
        setCustomCards(cartoesFormatados);
      }, (error) => {
        console.error("Erro ao sincronizar com Firebase:", error);
      });

      return () => unsubscribe();
    }
  }, []);

  const verificarBloqueioSpam = (tempoCooldown = 350): boolean => {
    const agora = Date.now();
    if (agora - ultimoCliqueRef.current < tempoCooldown) {
      return true;
    }
    ultimoCliqueRef.current = agora;
    return false;
  };

  const handleSidebarClick = (target: string) => {
    if (verificarBloqueioSpam(400)) return;

    if (target === 'home') { setHistoryStack(['home']); return; }
    if (categorySentenceHelpers[target]) {
      const helper = categorySentenceHelpers[target];
      const helperCard: PecsCardType = { id: `helper-${target}`, label: helper.label, icon: helper.icon, type: 'item', color: helper.color, bgColor: helper.bgColor, borderColor: helper.borderColor };
      setSentence((prev) => prev.some((item) => item.id === helperCard.id) ? prev : [...prev, helperCard]);
      speakText(helper.voiceText);
    }
    setHistoryStack((prev) => prev[prev.length - 1] === target ? prev : [...prev, target]);
  };

  const handleCardClick = (card: PecsCardType) => {
    if (verificarBloqueioSpam(400)) return;

    if (card.type === 'category') {
      if (card.target && categorySentenceHelpers[card.target]) {
        const helper = categorySentenceHelpers[card.target];
        setSentence((prev) => [...prev, { 
          id: `helper-${card.target}`, 
          label: helper.label, 
          icon: helper.icon, 
          type: 'item', 
          color: helper.color, 
          bgColor: helper.bgColor, 
          borderColor: helper.borderColor 
        }]);
        speakText(helper.voiceText);
      }
      if (card.target) setHistoryStack((prev) => [...prev, card.target!]);
    } else {
      setSentence((prev) => [...prev, {
        ...card,
        color: card.color || 'text-slate-700',
        bgColor: card.bgColor || 'bg-white',
        borderColor: card.borderColor || 'border-slate-200'
      }]);
      speakText(card.label);
    }
  };

  const handleRemoveIndex = (idx: number) => {
    if (verificarBloqueioSpam(350)) return;
    setSentence((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleClear = () => {
    if (verificarBloqueioSpam(400)) return;
    setSentence([]);
  };

  const handleBackspace = () => {
    if (verificarBloqueioSpam(350)) return;
    setSentence((prev) => prev.slice(0, -1));
  };

  const handleNavHome = () => {
    if (verificarBloqueioSpam(400)) return;
    setHistoryStack(['home']);
  };

  const handleNavBack = () => {
    if (verificarBloqueioSpam(400)) return;
    setHistoryStack((prev) => prev.length > 1 ? prev.slice(0, -1) : prev);
  };

  const handleSpeakSentence = () => {
    if (sentence.length === 0 || isSpeaking) return;

    setIsSpeaking(true);
    const textoCompleto = sentence.map(s => s.label).join(' ');
    speakText(textoCompleto);

    const tempoEstimadoAudio = Math.max(1200, (textoCompleto.length * 85) + 600);
    
    setTimeout(() => {
      setIsSpeaking(false);
    }, tempoEstimadoAudio);
  };

  const handleOpenPanelSecure = () => {
    const num1 = Math.floor(Math.random() * 9) + 1;
    const num2 = Math.floor(Math.random() * 9) + 1;
    const resultadoCorreto = num1 + num2;

    const resposta = prompt(
      `ÁREA RESTRITA PARA RESPONSÁVEIS\n\nPara acessar as configurações, resolva a conta abaixo:\nQuanto é ${num1} + ${num2}?`
    );

    if (parseInt(resposta || '') === resultadoCorreto) {
      onOpenPanel();
    } else {
      alert("Acesso recusado. Apenas pais, terapeutas ou educadores podem alterar as configurações.");
    }
  };

  const sidebarItems = [
    { id: 'home', label: 'Início', icon: <Lucide.Home size={28} />, target: 'home', activeColor: 'bg-blue-600 text-white border-blue-700 shadow-lg', inactiveColor: 'bg-white text-slate-600 hover:bg-slate-100 border-slate-200' },
    { id: 'comer', label: 'Comer', icon: <Lucide.Utensils size={28} />, target: 'comer', activeColor: 'bg-amber-500 text-white border-amber-600 shadow-lg', inactiveColor: 'bg-amber-100 text-amber-700 hover:bg-amber-200 border-amber-200' },
    { id: 'brincar', label: 'Brincar', icon: <Lucide.Gamepad2 size={28} />, target: 'brincar', activeColor: 'bg-sky-500 text-white border-sky-600 shadow-lg', inactiveColor: 'bg-sky-100 text-sky-700 hover:bg-sky-200 border-sky-200' },
    { id: 'ir', label: 'Ir', icon: <Lucide.Footprints size={28} />, target: 'ir', activeColor: 'bg-purple-500 text-white border-purple-600 shadow-lg', inactiveColor: 'bg-purple-100 text-purple-700 hover:bg-purple-200 border-purple-200' },
    { id: 'sentimentos', label: 'Sentir', icon: <Lucide.Smile size={28} />, target: 'sentimentos', activeColor: 'bg-rose-500 text-white border-rose-600 shadow-lg', inactiveColor: 'bg-rose-100 text-rose-700 hover:bg-rose-200 border-rose-200' },
    { id: 'familia', label: 'Família', icon: <Lucide.Users size={28} />, target: 'familia', activeColor: 'bg-emerald-500 text-white border-emerald-600 shadow-lg', inactiveColor: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-emerald-200' },
    { id: 'sobre', label: 'Sobre', icon: <Lucide.User size={28} />, target: 'sobre', activeColor: 'bg-indigo-500 text-white border-indigo-600 shadow-lg', inactiveColor: 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200 border-indigo-200' },
  ];

  return (
    <motion.div className="flex-1 flex flex-col w-full h-[100dvh] mx-auto bg-white shadow-2xl relative overflow-hidden">
      <SentenceBar
        sentence={sentence}
        onRemoveIndex={handleRemoveIndex}
        onClear={handleClear}
        onBackspace={handleBackspace}
        onSpeak={handleSpeakSentence}
        onNavHome={handleNavHome}
        onNavBack={handleNavBack}
        isSpeaking={isSpeaking}
        historyLength={historyStack.length}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar responsiva apenas para celular horizontal */}
        <aside className="w-16 sm:w-24 md:w-28 bg-slate-50 border-r-4 border-slate-200 flex flex-col items-center py-4 sm:py-6 gap-3 sm:gap-5 [@media(max-height:620px)_and_(orientation:landscape)]:py-1.5 [@media(max-height:620px)_and_(orientation:landscape)]:gap-1.5 overflow-y-auto shrink-0">
          {sidebarItems.map((item) => {
            const isActive = currentCategory === item.target;
            return (
              <button key={item.id} onClick={() => handleSidebarClick(item.target)} className="flex flex-col items-center justify-center gap-1 group w-full px-1">
                <div className={`w-12 h-12 sm:w-14 sm:h-14 [@media(max-height:620px)_and_(orientation:landscape)]:w-10 [@media(max-height:620px)_and_(orientation:landscape)]:h-10 rounded-2xl [@media(max-height:620px)_and_(orientation:landscape)]:rounded-xl flex items-center justify-center border-2 transition-all ${isActive ? item.activeColor : item.inactiveColor}`}>
                  {React.cloneElement(item.icon as React.ReactElement<any>, { className: "w-6 h-6 sm:w-7 sm:h-7 [@media(max-height:620px)_and_(orientation:landscape)]:w-5 [@media(max-height:620px)_and_(orientation:landscape)]:h-5" })}
                </div>
                <span className="text-[9px] sm:text-[10px] [@media(max-height:620px)_and_(orientation:landscape)]:text-[8px] font-extrabold uppercase text-center mt-0.5 truncate w-full">{item.label}</span>
              </button>
            );
          })}
        </aside>

        {/* Área de conteúdo dos cartões */}
        <div className="flex-1 p-3 sm:p-6 [@media(max-height:620px)_and_(orientation:landscape)]:p-2.5 overflow-y-auto bg-slate-50">
          {/* Grade otimizada: No desktop ela escala até 8 ou 10 colunas, de acordo com o tamanho da tela do PC */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-10 [@media(max-height:620px)_and_(orientation:landscape)]:grid-cols-4 gap-3 sm:gap-4 [@media(max-height:620px)_and_(orientation:landscape)]:gap-2 pb-10">
            {[...cards, ...customCards]
              .filter(card => {
                if (currentCategory === 'home') {
                  return card.isEssential === true || card.isCustom === true;
                }
                return card.target === currentCategory;
              })
              .map((item) => (
                <PecsCard key={item.id} card={item} onClick={() => handleCardClick(item)} />
              ))}
          </div>
        </div>
      </div>

      {/* Footer responsivo apenas para celular horizontal */}
      <footer className="shrink-0 px-3 sm:px-6 py-3 border-t border-slate-200 flex items-center justify-between bg-slate-50 h-14 [@media(max-height:620px)_and_(orientation:landscape)]:h-11 [@media(max-height:620px)_and_(orientation:landscape)]:py-1">
        <div className="flex items-center gap-2 truncate">
          <span className={`w-3 h-3 rounded-full shadow-sm animate-pulse shrink-0 ${
            activeRole === 'therapist' ? 'bg-purple-500' : 
            activeRole === 'parent' ? 'bg-indigo-500' : 'bg-emerald-500'
          }`} />
          <span className="text-[9px] sm:text-[10px] [@media(max-height:620px)_and_(orientation:landscape)]:text-[8px] font-extrabold uppercase tracking-wider text-slate-600 truncate">
            {activeRole === 'therapist' ? `Terapeuta: ${username}` : 
             activeRole === 'parent' ? `Responsável: ${username}` : `Estudante: ${username}`}
          </span>
        </div>
        <button 
          onClick={handleOpenPanelSecure} 
          className="flex items-center gap-1.5 text-[9px] sm:text-[11px] [@media(max-height:620px)_and_(orientation:landscape)]:text-[9px] font-extrabold px-2 sm:px-3 py-1.5 [@media(max-height:620px)_and_(orientation:landscape)]:py-1 bg-white hover:bg-amber-50 text-amber-700 border-2 border-amber-200 hover:border-amber-300 rounded-xl transition-all shadow-sm active:scale-95 shrink-0"
        >
          <Lucide.Settings className="w-3.5 h-3.5 sm:w-4 sm:h-4 [@media(max-height:620px)_and_(orientation:landscape)]:w-3.5 [@media(max-height:620px)_and_(orientation:landscape)]:h-3.5" />
          <span className="hidden sm:inline">CONFIGURAÇÕES</span>
          <span className="inline sm:hidden">CONFIG</span>
        </button>
      </footer>
    </motion.div>
  );
}