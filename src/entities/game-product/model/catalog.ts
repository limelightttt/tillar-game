import type { GameProduct } from "./types";

export const gameProducts = [
  {
    id: "two-pictures",
    code: "01",
    title: "Две картинки",
    shortTitle: "Выбери картинку",
    description: "Найди правильную иллюстрацию и узнай новый факт.",
  },
  {
    id: "four-pictures-word",
    code: "02",
    title: "Четыре картинки / слово",
    shortTitle: "Собери слово",
    description: "Свяжи четыре подсказки и составь ответ из букв.",
  },
] as const satisfies readonly GameProduct[];
