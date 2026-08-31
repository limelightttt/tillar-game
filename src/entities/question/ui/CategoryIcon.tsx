import {
  Clapperboard,
  Cpu,
  Globe2,
  Landmark,
  type LucideIcon,
  MapPinned,
  Microscope,
  Music2,
  Palette,
  Shapes,
  Trophy,
  UserRound,
} from "lucide-react";

import type { CategoryId } from "../model/types";

const categoryIcons = {
  all: Shapes,
  geography: Globe2,
  history: Landmark,
  cinema: Clapperboard,
  music: Music2,
  science: Microscope,
  art: Palette,
  people: UserRound,
  sport: Trophy,
  uzbekistan: MapPinned,
  technology: Cpu,
} as const satisfies Record<CategoryId, LucideIcon>;

interface CategoryIconProps {
  categoryId: CategoryId;
  className?: string;
}

export function CategoryIcon({ categoryId, className = "size-4" }: CategoryIconProps) {
  const Icon = categoryIcons[categoryId];

  return <Icon aria-hidden="true" className={className} strokeWidth={1.8} />;
}
