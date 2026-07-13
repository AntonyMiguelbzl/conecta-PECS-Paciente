import { motion } from "framer-motion";
import * as Lucide from "lucide-react";
import { PecsCardType } from "../types";
import { PECSIcon } from "../icons";

interface SentenceBarProps {
  sentence: PecsCardType[];
  onRemoveIndex: (index: number) => void;
  onClear: () => void;
  onBackspace: () => void;
  onSpeak: () => void;
  onNavHome: () => void;
  onNavBack: () => void;
  isSpeaking: boolean;
  historyLength: number;
}

export default function SentenceBar({
  sentence,
  onRemoveIndex,
  onClear,
  onBackspace,
  onSpeak,
  onNavHome,
  onNavBack,
  isSpeaking,
  historyLength,
}: SentenceBarProps) {
  return (
    <header className="w-full z-10 flex items-center justify-between px-6 py-4 bg-white border-b-4 border-blue-500 shadow-md flex-shrink-0">
      {/* Esquerda: Ações de Navegação */}
      <div className="flex items-center gap-4">
        <button
          onClick={onNavHome}
          className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-white border-2 border-slate-200 text-blue-600 hover:bg-blue-50 hover:border-blue-500 hover:scale-105 active:scale-95 transition-all shadow-sm cursor-pointer"
          title="Início"
        >
          <Lucide.Home size={28} className="stroke-[2.5]" />
          <span className="text-[12px] font-extrabold lowercase mt-1 block tracking-tight text-slate-600">
            inicio
          </span>
        </button>

        <button
          onClick={onNavBack}
          disabled={historyLength <= 1}
          className={`flex flex-col items-center justify-center p-2.5 rounded-2xl bg-white border-2 transition-all shadow-sm ${
            historyLength > 1
              ? "border-slate-200 text-blue-600 hover:bg-blue-50 hover:border-blue-500 hover:scale-105 active:scale-95 cursor-pointer"
              : "border-slate-100 text-slate-300 cursor-not-allowed opacity-50"
          }`}
          title="Voltar"
        >
          <Lucide.ArrowLeft size={28} className="stroke-[2.5]" />
          <span className="text-[12px] font-extrabold lowercase mt-1 block tracking-tight text-slate-600">
            voltar
          </span>
        </button>
      </div>

      {/* Centro: Barra onde a Frase é Montada */}
      <div
        className={`flex-1 mx-4 md:mx-6 h-20 rounded-2xl bg-white border-4 transition-all duration-300 flex items-center px-4 gap-3 overflow-x-auto shadow-inner ${
          isSpeaking
            ? "border-blue-600 bg-blue-50 ring-4 ring-blue-100"
            : sentence.length > 0
              ? "border-blue-400"
              : "border-dashed border-slate-200"
        }`}
      >
        {sentence.length === 0 ? (
          <div className="text-slate-400 font-bold text-sm select-none italic text-center w-full">
            Toque nos cartões abaixo para montar uma frase...
          </div>
        ) : (
          <div className="flex items-center gap-2.5 py-1 min-w-max">
            {sentence.map((card, idx) => (
                <motion.div
                  key={`${card.id}-${idx}`}
                  initial={{ opacity: 0, scale: 0.8, x: 20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  whileHover={{ scale: 1.05 }}
                  className="group relative flex flex-col items-center justify-center border-2 border-blue-400 bg-blue-50 rounded-xl p-1.5 min-w-[76px] h-15.7 shadow-sm cursor-pointer"
                  onClick={() => onRemoveIndex(idx)}
                  title="Clique para remover"
                >
                  <div
                    className={`${card.color || "text-slate-800"} flex items-center justify-center`}
                  >
                    {/* Lógica unificada: Imagem > ARASAAC > PECSIcon */}
                    {card.image ? (
                      <img
                        src={card.image}
                        alt={card.label}
                        className="w-8 h-8 object-contain"
                      />
                    ) : card.arasaacId ? (
                      <img
                        src={`https://static.arasaac.org/pictograms/${card.arasaacId}/${card.arasaacId}_500.png`}
                        alt={card.label}
                        className="w-8 h-8 object-contain"
                      />
                    ) : (
                      <PECSIcon name={card.icon} size={24} />
                    )}
                  </div>
                  <span className="text-[11px] font-bold text-slate-800 lowercase leading-none mt-1 text-center block w-full truncate px-1">
                    {card.label}
                  </span>

                  <div className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                    <Lucide.X size={10} className="stroke-[3]" />
                  </div>
                </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Direita: Botões de Ação */}
      <div className="flex items-center gap-3">
        <button
          onClick={onSpeak}
          disabled={sentence.length === 0}
          className={`flex flex-col items-center justify-center p-2.5 rounded-2xl bg-white border-2 transition-all shadow-sm ${
            sentence.length > 0
              ? "border-slate-200 text-blue-600 hover:bg-blue-50 hover:border-blue-500 hover:scale-105 active:scale-95 cursor-pointer"
              : "border-slate-100 text-slate-300 cursor-not-allowed opacity-50"
          }`}
          title="Ouvir Frase"
        >
          <Lucide.Volume2 size={28} className="stroke-[2.5]" />
          <span className="text-[12px] font-extrabold lowercase mt-1 block tracking-tight text-slate-600">
            falar
          </span>
        </button>

        <button
          onClick={onClear}
          disabled={sentence.length === 0}
          className={`flex flex-col items-center justify-center p-2.5 rounded-2xl bg-white border-2 transition-all shadow-sm ${
            sentence.length > 0
              ? "border-red-100 text-red-600 hover:bg-red-50 hover:border-red-300 hover:scale-105 active:scale-95 cursor-pointer"
              : "border-slate-100 text-slate-300 cursor-not-allowed opacity-50"
          }`}
          title="Limpar tudo"
        >
          <Lucide.Trash2 size={28} className="stroke-[2.5]" />
          <span className="text-[12px] font-extrabold lowercase mt-1 block tracking-tight text-slate-600">
            limpar
          </span>
        </button>
      </div>
    </header>
  );
}
