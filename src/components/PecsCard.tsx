import { motion } from 'motion/react';
import { PecsCardType } from '../types';
import { PECSIcon } from '../icons';
import * as Lucide from 'lucide-react';

interface PecsCardProps {
  card: PecsCardType;
  onClick: (card: PecsCardType) => void;
  onDeleteCustom?: (id: string) => void;
}

export default function PecsCard({ card, onClick, onDeleteCustom }: PecsCardProps) {
  const isCategory = card.type === 'category';

  const imageUrl = card.image && card.image.trim() !== "" ? card.image : null;
  const arasaacUrl = !imageUrl && card.arasaacId 
    ? `https://static.arasaac.org/pictograms/${card.arasaacId}/${card.arasaacId}_500.png` 
    : null;

  const bgClass = card.bgColor || 'bg-white';
  const borderClass = card.borderColor || 'border-slate-200';
  const textClass = card.color || 'text-slate-700';

  return (
    <motion.div
      role="button"
      onClick={() => onClick(card)}
      whileHover={{ y: -3, scale: 1.02 }}
      whileTap={{ scale: 0.96 }}
      className={`relative w-full h-full min-h-[140px] rounded-3xl border-4 ${borderClass} ${bgClass} p-4 flex flex-col items-center justify-between text-center cursor-pointer group`}
    >
      {isCategory && <div className="absolute top-0 inset-x-0 h-2 bg-blue-500 rounded-t-xl" />}

      {card.isCustom && onDeleteCustom && (
        <button
          onClick={(e) => { e.stopPropagation(); onDeleteCustom(card.id); }}
          className="absolute top-2 right-2 p-1 rounded-full bg-red-50 text-red-500 opacity-0 group-hover:opacity-100"
        >
          <Lucide.Trash size={14} />
        </button>
      )}

      <div className={`flex-1 flex items-center justify-center ${textClass} mt-1`}>
        {imageUrl ? (
          <img src={imageUrl} alt={card.label} className="max-h-24 object-contain" />
        ) : arasaacUrl ? (
          <img src={arasaacUrl} alt={card.label} className="max-h-24 object-contain" />
        ) : (
          <PECSIcon name={card.icon || 'HelpCircle'} size={64} />
        )}
      </div>

      <div className="mt-2 w-full">
        <span className="font-extrabold text-[15px] text-slate-800 lowercase truncate block">
          {card.label}
        </span>
      </div>
    </motion.div>
  );
}