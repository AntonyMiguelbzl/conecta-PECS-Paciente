import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as Lucide from 'lucide-react';
import { collection, query, where, onSnapshot } from "firebase/firestore";
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

  const currentCategory = historyStack[historyStack.length - 1] || 'home';

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

  const handleSidebarClick = (target: string) => {
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
    if (card.type === 'category') {
      if (card.target && categorySentenceHelpers[card.target]) {
        const helper = categorySentenceHelpers[card.target];
        setSentence((prev) => [...prev, { id: `helper-${card.target}`, label: helper.label, icon: helper.icon, type: 'item', color: helper.color, bgColor: helper.bgColor, borderColor: helper.borderColor }]);
        speakText(helper.voiceText);
      }
      if (card.target) setHistoryStack((prev) => [...prev, card.target!]);
    } else {
      setSentence((prev) => [...prev, card]);
      speakText(card.label);
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
    <motion.div className="flex-1 flex flex-col max-w-7xl w-full mx-auto bg-white shadow-2xl relative overflow-hidden h-full">
      <SentenceBar
        sentence={sentence}
        onRemoveIndex={(idx: number) => setSentence(prev => prev.filter((_, i) => i !== idx))}
        onClear={() => setSentence([])}
        onBackspace={() => setSentence(prev => prev.slice(0, -1))}
        onSpeak={() => speakText(sentence.map(s => s.label).join(' '))}
        onNavHome={() => setHistoryStack(['home'])}
        onNavBack={() => setHistoryStack(prev => prev.length > 1 ? prev.slice(0, -1) : prev)}
        isSpeaking={isSpeaking}
        historyLength={historyStack.length}
      />

      <div className="flex-1 flex overflow-hidden">
        <aside className="w-24 sm:w-28 bg-slate-50 border-r-4 border-slate-200 flex flex-col items-center py-6 gap-5 overflow-y-auto">
          {sidebarItems.map((item) => {
            const isActive = currentCategory === item.target;
            return (
              <button key={item.id} onClick={() => handleSidebarClick(item.target)} className="flex flex-col items-center justify-center gap-1 group w-16 sm:w-20">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 ${isActive ? item.activeColor : item.inactiveColor}`}>
                  {item.icon}
                </div>
                <span className="text-[10px] font-extrabold uppercase text-center mt-0.5">{item.label}</span>
              </button>
            );
          })}
        </aside>

        <div className="flex-1 p-6 overflow-y-auto bg-slate-50">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
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

      <footer className="px-6 py-3 border-t border-slate-200 flex items-center justify-between bg-slate-50 h-14">
        <div className="flex items-center gap-2">
          <span className={`w-3 h-3 rounded-full shadow-sm animate-pulse ${
            activeRole === 'therapist' ? 'bg-purple-500' : 
            activeRole === 'parent' ? 'bg-indigo-500' : 'bg-emerald-500'
          }`} />
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600">
            {activeRole === 'therapist' ? `Terapeuta: ${username}` : 
             activeRole === 'parent' ? `Responsável: ${username}` : `Estudante: ${username}`}
          </span>
        </div>
        <button 
          onClick={onOpenPanel} 
          className="flex items-center gap-1.5 text-[11px] font-extrabold px-3 py-1.5 bg-white hover:bg-amber-50 text-amber-700 border-2 border-amber-200 hover:border-amber-300 rounded-xl transition-all shadow-sm active:scale-95"
        >
          <Lucide.Settings size={13} />
          CONFIGURAÇÕES
        </button>
      </footer>
    </motion.div>
  );
}