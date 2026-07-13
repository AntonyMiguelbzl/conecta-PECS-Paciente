import { motion } from 'motion/react';
import { PecsCardType } from '../types';
import { PECSIcon } from '../icons';
import * as Lucide from 'lucide-react';

interface PecsCardProps {
  card: PecsCardType;
  onClick: () => void;
  onDeleteCustom?: (id: string) => void;
}

export default function PecsCard({ card, onClick, onDeleteCustom }: PecsCardProps) {
  const isCategory = card.type === 'category';

  // Lógica para determinar a fonte da imagem
  const imageUrl = card.image && card.image.trim() !== "" ? card.image : null;
  const arasaacUrl = !imageUrl && card.arasaacId 
    ? `https://static.arasaac.org/pictograms/${card.arasaacId}/${card.arasaacId}_500.png` 
    : null;

  // Fallbacks for default values
  const bgClass = card.bgColor || 'bg-white';
  const borderClass = card.borderColor || 'border-slate-200 hover:border-blue-500';
  const textClass = card.color || 'text-slate-700';

  return (
    <motion.div
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      onClick={onClick}
      whileHover={{ y: -3, scale: 1.02 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 300, damping: 15 }}
      className={`relative w-full h-full min-h-[140px] md:min-h-[160px] rounded-3xl border-4 ${borderClass} ${bgClass} p-4 flex flex-col items-center justify-between text-center transition-shadow hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-100 group select-none cursor-pointer`}
    >
      {/* Category marker bar */}
      {isCategory && (
        <div className="absolute top-0 inset-x-0 h-2 bg-blue-500 rounded-t-xl" />
      )}

      {/* Delete Custom Card Action */}
      {card.isCustom && onDeleteCustom && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDeleteCustom(card.id);
          }}
          className="absolute top-2 right-2 p-1 rounded-full bg-red-50 text-red-500 hover:bg-red-100 opacity-0 group-hover:opacity-100 transition-opacity z-10"
          title="Excluir Cartão"
        >
          <Lucide.Trash size={14} className="stroke-[2.5]" />
        </button>
      )}

      {/* Pictogram/Image wrapper */}
      <div className={`flex-1 flex items-center justify-center ${textClass} transition-transform group-hover:scale-110 duration-200 mt-1`}>
        {imageUrl ? (
          <img src={imageUrl} alt={card.label} className="max-h-24 object-contain rounded-lg" />
        ) : arasaacUrl ? (
          <img src={arasaacUrl} alt={card.label} className="max-h-24 object-contain rounded-lg" />
        ) : (
          <PECSIcon name={card.icon} size={64} />
        )}
      </div>

      {/* Label underneath */}
      <div className="mt-2 w-full flex items-center justify-center">
        <span className="font-sans font-extrabold text-[15px] text-slate-800 leading-tight tracking-tight lowercase truncate max-w-full block px-1">
          {card.label}
        </span>
      </div>

      {/* Indicator overlay */}
      {isCategory && (
        <div className="absolute bottom-2 right-3 flex items-center gap-0.5 text-blue-600/70">
          <Lucide.Folder size={12} className="fill-blue-50" />
          <span className="text-[9px] font-extrabold uppercase">pasta</span>
        </div>
      )}
    </motion.div>
  );
}