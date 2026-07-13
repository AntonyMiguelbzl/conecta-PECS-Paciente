export interface PecsCardType {
  id: string;
  label: string;
  icon: string; // Corresponde às chaves do PecsIconMap no icons.ts
  image?: string;
  type: 'item' | 'category';
  target?: string | null; // ID da categoria de destino se type === 'category'
  color?: string; // Classe de cor do texto/ícone (ex: "text-emerald-600")
  bgColor?: string; // Classe de cor do fundo (ex: "bg-white")
  borderColor?: string; // Classe de cor da borda
  isCustom?: boolean; // Identifica se o cartão foi criado pelo usuário/terapeuta
  paciente_id?: string; // Necessário para o filtro do Firebase
  isEssential?: boolean; // <-- Adicione esta linha
  arasaacId?: string; // <--- Adicione esta linha
}

export interface CategoryType {
  id: string;
  name: string;
  icon: string;
  cards: PecsCardType[];
}

export interface SpokenHistoryItem {
  id: string;
  phrase: string;
  timestamp: string;
}