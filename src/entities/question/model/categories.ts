import type { QuestionCategory } from "./types";

export const questionCategories = [
  { id: "all", label: "Все темы", icon: "🌐" },
  { id: "geography", label: "География", icon: "🌍" },
  { id: "history", label: "История", icon: "🏛️" },
  { id: "cinema", label: "Кино", icon: "🎬" },
  { id: "music", label: "Музыка", icon: "🎵" },
  { id: "science", label: "Наука", icon: "🔬" },
  { id: "art", label: "Искусство", icon: "🎨" },
  { id: "people", label: "Известные люди", icon: "👤" },
  { id: "sport", label: "Спорт", icon: "🏸" },
  { id: "uzbekistan", label: "Узбекистан", icon: "🇺🇿" },
  { id: "technology", label: "Технологии", icon: "💻" },
] as const satisfies readonly QuestionCategory[];
