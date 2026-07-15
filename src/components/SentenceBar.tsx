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
    <header className="w-full z-10 flex items-center justify-between px-3 sm:px-6 py-2 sm:py-4 bg-white border-b-4 border-blue-500 shadow-md flex-shrink-0">
      {/* Esquerda: Ações de Navegação */}
      <div className="flex items-center gap-1.5 sm:gap-4 shrink-0">
        <button
          onClick={onNavHome}
          className="flex flex-col items-center justify-center p-1.5 sm:p-2.5 rounded-xl sm:rounded-2xl bg-white border-2 border-slate-200 text-blue-600 hover:bg-blue-50 hover:border-blue-500 hover:scale-105 active:scale-95 transition-all shadow-sm cursor-pointer"
          title="Início"
        >
          <Lucide.Home className="w-5 h-5 sm:w-7 sm:h-7 stroke-[2.5]" />
          <span className="text-[9px] sm:text-[12px] font-extrabold lowercase mt-0.5 sm:mt-1 block tracking-tight text-slate-600">
            inicio
          </span>
        </button>

        <button
          onClick={onNavBack}
          disabled={historyLength <= 1}
          className={`flex flex-col items-center justify-center p-1.5 sm:p-2.5 rounded-xl sm:rounded-2xl bg-white border-2 transition-all shadow-sm ${
            historyLength > 1
              ? "border-slate-200 text-blue-600 hover:bg-blue-50 hover:border-blue-500 hover:scale-105 active:scale-95 cursor-pointer"
              : "border-slate-100 text-slate-300 cursor-not-allowed opacity-50"
          }`}
          title="Voltar"
        >
          <Lucide.ArrowLeft className="w-5 h-5 sm:w-7 sm:h-7 stroke-[2.5]" />
          <span className="text-[9px] sm:text-[12px] font-extrabold lowercase mt-0.5 sm:mt-1 block tracking-tight text-slate-600">
            voltar
          </span>
        </button>
      </div>

      {/* Centro: Barra onde a Frase é Montada */}
      <div
        className={`flex-1 mx-2 sm:mx-4 md:mx-6 h-16 sm:h-20 rounded-xl sm:rounded-2xl bg-white border-2 sm:border-4 transition-all duration-300 flex items-center px-2 sm:px-4 gap-1.5 sm:gap-3 overflow-x-auto shadow-inner ${
          isSpeaking
            ? "border-blue-600 bg-blue-50 ring-4 ring-blue-100"
            : sentence.length > 0
              ? "border-blue-400"
              : "border-dashed border-slate-200"
        }`}
      >
        {sentence.length === 0 ? (
          <div className="text-slate-400 font-bold text-xs sm:text-sm select-none italic text-center w-full truncate px-1">
            Toque nos cartões abaixo para montar uma frase...
          </div>
        ) : (
          <div className="flex items-center gap-1.5 sm:gap-2.5 py-1 min-w-max">
            {sentence.map((card, idx) => (
                <motion.div
                  key={`${card.id}-${idx}`}
                  initial={{ opacity: 0, scale: 0.8, x: 20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  whileHover={{ scale: 1.05 }}
                  className="group relative flex flex-col items-center justify-center border-2 border-blue-400 bg-blue-50 rounded-lg sm:rounded-xl p-1 sm:p-1.5 min-w-[56px] sm:min-w-[76px] h-12 sm:h-16 shadow-sm cursor-pointer"
                  onClick={() => onRemoveIndex(idx)}
                  title="Clique para remover"
                >
                  <div
                    className={`${card.color || "text-slate-800"} flex items-center justify-center`}
                  >
                    {card.image ? (
                      <img
                        src={card.image}
                        alt={card.label}
                        className="w-6 h-6 sm:w-8 sm:h-8 object-contain"
                      />
                    ) : card.arasaacId ? (
                      <img
                        src={`https://static.arasaac.org/pictograms/${card.arasaacId}/${card.arasaacId}_500.png`}
                        alt={card.label}
                        className="w-6 h-6 sm:w-8 sm:h-8 object-contain"
                      />
                    ) : (
                      <PECSIcon name={card.icon} size={20} />
                    )}
                  </div>
                  <span className="text-[9px] sm:text-[11px] font-bold text-slate-800 lowercase leading-none mt-0.5 sm:mt-1 text-center block w-full truncate px-1">
                    {card.label}
                  </span>

                  <div className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                    <Lucide.X className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Direita: Botões de Ação */}
      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        <button
          onClick={onSpeak}
          disabled={sentence.length === 0 || isSpeaking}
          className={`flex flex-col items-center justify-center p-1.5 sm:p-2.5 rounded-xl sm:rounded-2xl bg-white border-2 transition-all shadow-sm ${
            sentence.length > 0 && !isSpeaking
              ? "border-slate-200 text-blue-600 hover:bg-blue-50 hover:border-blue-500 hover:scale-105 active:scale-95 cursor-pointer"
              : "border-slate-100 text-slate-300 cursor-not-allowed opacity-50"
          }`}
          title="Ouvir Frase"
        >
          {isSpeaking ? (
            <Lucide.VolumeX className="w-5 h-5 sm:w-7 sm:h-7 stroke-[2.5] text-blue-400 animate-pulse" />
          ) : (
            <Lucide.Volume2 className="w-5 h-5 sm:w-7 sm:h-7 stroke-[2.5]" />
          )}
          <span className="text-[9px] sm:text-[12px] font-extrabold lowercase mt-0.5 sm:mt-1 block tracking-tight text-slate-600">
            {isSpeaking ? "falando" : "falar"}
          </span>
        </button>

        <button
          onClick={onClear}
          disabled={sentence.length === 0}
          className={`flex flex-col items-center justify-center p-1.5 sm:p-2.5 rounded-xl sm:rounded-2xl bg-white border-2 transition-all shadow-sm ${
            sentence.length > 0
              ? "border-red-100 text-red-600 hover:bg-red-50 hover:border-red-300 hover:scale-105 active:scale-95 cursor-pointer"
              : "border-slate-100 text-slate-300 cursor-not-allowed opacity-50"
          }`}
          title="Limpar tudo"
        >
          <Lucide.Trash2 className="w-5 h-5 sm:w-7 sm:h-7 stroke-[2.5]" />
          <span className="text-[9px] sm:text-[12px] font-extrabold lowercase mt-0.5 sm:mt-1 block tracking-tight text-slate-600">
            limpar
          </span>
        </button>
      </div>
    </header>
  );
}