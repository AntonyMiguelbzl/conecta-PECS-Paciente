import * as Lucide from 'lucide-react';
import { createElement, ComponentType } from 'react';

// Lista explícita de ícones disponíveis para os cartões PECS (Mapeados para os componentes corretos do Lucide)
export const PecsIconMap: Record<string, ComponentType<{ className?: string; size?: number }>> = {
  user: Lucide.User,
  users: Lucide.Users,
  utensils: Lucide.Utensils,
  gamepad: Lucide.Gamepad2,
  footprints: Lucide.Footprints,
  hand: Lucide.Hand,
  smile: Lucide.Smile,
  heart: Lucide.Heart,
  helpCircle: Lucide.CircleHelp, // Ajustado para a versão estável do Lucide
  checkCircle: Lucide.CircleCheck, // Ajustado para a versão estável do Lucide
  xCircle: Lucide.CircleX, // Ajustado para a versão estável do Lucide
  search: Lucide.Search,
  contact: Lucide.Contact,
  homeIcon: Lucide.Home,
  cake: Lucide.Cake,
  phone: Lucide.Phone,
  userCheck: Lucide.UserCheck,
  baby: Lucide.Baby,
  frown: Lucide.Frown,
  angry: Lucide.Angry,
  moon: Lucide.Moon,
  ghost: Lucide.Ghost,
  apple: Lucide.Apple,
  glassWater: Lucide.GlassWater,
  cupSoda: Lucide.CupSoda,
  droplet: Lucide.Droplet,
  car: Lucide.Car,
  layoutGrid: Lucide.LayoutGrid,
  puzzle: Lucide.Puzzle,
  school: Lucide.School,
  trees: Lucide.Trees,
  bath: Lucide.Bath,
  stethoscope: Lucide.Stethoscope,
  checkSquare: Lucide.SquareCheck, // Ajustado para a versão estável do Lucide
  plus: Lucide.Plus,
  volume2: Lucide.Volume2,
  settings: Lucide.Settings,
  flower: Lucide.Flower,
  sun: Lucide.Sun,
  cloud: Lucide.Cloud,
  brush: Lucide.Brush,
  music: Lucide.Music,
  tv: Lucide.Tv,
  shirt: Lucide.Shirt,
  scissors: Lucide.Scissors,
  cookie: Lucide.Cookie,
  pizza: Lucide.Pizza,
  clock: Lucide.Clock,
  heartHandshake: Lucide.HeartHandshake,
  voltar: Lucide.ArrowLeft,
  ouvir: Lucide.Play,
  apagar: Lucide.Delete,
  limpar: Lucide.Trash2,
};

// Array simples de strings contendo apenas as chaves dos ícones (Perfeito para dar map num select ou modal de escolha)
export const AVAILABLE_ICONS = Object.keys(PecsIconMap).filter(
  (key) => !['voltar', 'ouvir', 'apagar', 'limpar'].includes(key) // Remove botões do sistema da escolha de ícones do cartão
);

interface DynamicIconProps {
  name: string;
  className?: string;
  size?: number;
}

export function PECSIcon({ name, className, size = 32 }: DynamicIconProps) {
  // Caso o nome vindo do banco/API não exista no mapa, ele renderiza o CircleHelp por padrão
  const IconComponent = PecsIconMap[name] || Lucide.CircleHelp;
  return createElement(IconComponent, { className, size });
}