import type { WordPuzzle } from "./types";

export const wordPuzzles = [
  {
    id: "geography-ocean",
    categoryId: "geography",
    prompt: "Что объединяет эти четыре изображения?",
    images: [
      {
        id: "ocean-wave",
        visualKey: "ocean-wave",
        symbol: "🌊",
        alt: "Бирюзовая волна с белой пеной",
      },
      {
        id: "ocean-island",
        visualKey: "ocean-island",
        symbol: "🏝️",
        alt: "Зелёный остров посреди воды",
      },
      {
        id: "ocean-ship",
        visualKey: "ocean-ship",
        symbol: "🚢",
        alt: "Большой корабль на синей глади",
      },
      {
        id: "ocean-fish",
        visualKey: "ocean-fish",
        symbol: "🐋",
        alt: "Кит плывёт под поверхностью воды",
      },
    ],
    answer: "ОКЕАН",
    distractorLetters: ["М", "Р"],
    explanation:
      "Океан — крупнейший водный объект Земли; океаны покрывают большую часть поверхности планеты.",
  },
  {
    id: "geography-mountain",
    categoryId: "geography",
    prompt: "Какое слово связывает все четыре изображения?",
    images: [
      {
        id: "mountain-peak",
        visualKey: "mountain-peak",
        symbol: "🏔️",
        alt: "Высокая заснеженная вершина",
      },
      {
        id: "mountain-climber",
        visualKey: "mountain-climber",
        symbol: "🧗",
        alt: "Альпинист поднимается по отвесной скале",
      },
      {
        id: "mountain-snow",
        visualKey: "mountain-snow",
        symbol: "❄️",
        alt: "Белый снег на каменном пике",
      },
      {
        id: "mountain-cable",
        visualKey: "mountain-cable",
        symbol: "🚠",
        alt: "Кабинка канатной дороги над ущельем",
      },
    ],
    answer: "ГОРА",
    distractorLetters: ["Л", "Н"],
    explanation: "Гора — заметное возвышение рельефа с выраженными склонами и вершиной.",
  },
  {
    id: "history-crown",
    categoryId: "history",
    prompt: "Назовите исторический символ на четырёх изображениях.",
    images: [
      {
        id: "crown-gold",
        visualKey: "crown-gold",
        symbol: "👑",
        alt: "Золотой головной убор с драгоценными камнями",
      },
      {
        id: "crown-king",
        visualKey: "crown-king",
        symbol: "🤴",
        alt: "Монарх в парадной мантии",
      },
      {
        id: "crown-castle",
        visualKey: "crown-castle",
        symbol: "🏰",
        alt: "Крепость с башнями и воротами",
      },
      {
        id: "crown-throne",
        visualKey: "crown-throne",
        symbol: "🪑",
        alt: "Украшенное кресло правителя",
      },
    ],
    answer: "КОРОНА",
    distractorLetters: ["Л", "Т"],
    explanation:
      "Корона служила знаком монаршей власти и использовалась во время коронации правителей.",
  },
  {
    id: "history-chronicle",
    categoryId: "history",
    prompt: "Какой вид исторического текста объединяет эти изображения?",
    images: [
      {
        id: "chronicle-manuscript",
        visualKey: "chronicle-manuscript",
        symbol: "📜",
        alt: "Раскрытая старинная рукопись",
      },
      {
        id: "chronicle-quill",
        visualKey: "chronicle-quill",
        symbol: "🪶",
        alt: "Перо рядом с чернильницей",
      },
      {
        id: "chronicle-scribe",
        visualKey: "chronicle-scribe",
        symbol: "✍️",
        alt: "Переписчик работает за деревянным столом",
      },
      {
        id: "chronicle-dates",
        visualKey: "chronicle-dates",
        symbol: "📅",
        alt: "Столбец дат исторических событий",
      },
    ],
    answer: "ЛЕТОПИСЬ",
    distractorLetters: ["А", "Н"],
    explanation:
      "Летопись — историческое произведение, в котором события излагались последовательно по годам.",
  },
  {
    id: "cinema-frame",
    categoryId: "cinema",
    prompt: "Какой термин из кино объединяет изображения?",
    images: [
      {
        id: "frame-camera",
        visualKey: "frame-camera",
        symbol: "🎥",
        alt: "Кинокамера на штативе во время съёмки",
      },
      {
        id: "frame-clapper",
        visualKey: "frame-clapper",
        symbol: "🎬",
        alt: "Хлопушка перед началом съёмки",
      },
      {
        id: "frame-film",
        visualKey: "frame-film",
        symbol: "🎞️",
        alt: "Полоса киноплёнки с отдельными изображениями",
      },
      {
        id: "frame-screen",
        visualKey: "frame-screen",
        symbol: "📺",
        alt: "Прямоугольное изображение на экране",
      },
    ],
    answer: "КАДР",
    distractorLetters: ["О", "И"],
    explanation:
      "Кадр — отдельное изображение в последовательности фильма, а также ограниченная рамкой часть сцены.",
  },
  {
    id: "cinema-screenplay",
    categoryId: "cinema",
    prompt: "Какой документ помогает снять фильм?",
    images: [
      {
        id: "screenplay-pages",
        visualKey: "screenplay-pages",
        symbol: "📄",
        alt: "Стопка листов с репликами и пометками",
      },
      {
        id: "screenplay-writer",
        visualKey: "screenplay-writer",
        symbol: "💻",
        alt: "Автор печатает текст за ноутбуком",
      },
      {
        id: "screenplay-clapper",
        visualKey: "screenplay-clapper",
        symbol: "🎬",
        alt: "Съёмочная хлопушка с номером дубля",
      },
      {
        id: "screenplay-storyboard",
        visualKey: "screenplay-storyboard",
        symbol: "🗂️",
        alt: "Последовательность рисунков будущего фильма",
      },
    ],
    answer: "СЦЕНАРИЙ",
    distractorLetters: ["К", "О"],
    explanation:
      "Сценарий описывает сюжет, реплики и последовательность эпизодов, по которым создают фильм.",
  },
  {
    id: "music-rhythm",
    categoryId: "music",
    prompt: "Найдите общее музыкальное понятие.",
    images: [
      {
        id: "rhythm-drum",
        visualKey: "rhythm-drum",
        symbol: "🥁",
        alt: "Палочки ударяют по натянутой мембране барабана",
      },
      {
        id: "rhythm-notes",
        visualKey: "rhythm-notes",
        symbol: "🎵",
        alt: "Ряд нот с чередованием длительностей",
      },
      {
        id: "rhythm-dance",
        visualKey: "rhythm-dance",
        symbol: "💃",
        alt: "Танцовщица повторяет движения под музыку",
      },
      {
        id: "rhythm-metronome",
        visualKey: "rhythm-metronome",
        symbol: "⏱️",
        alt: "Маятник метронома отклонён в сторону",
      },
    ],
    answer: "РИТМ",
    distractorLetters: ["А", "К"],
    explanation:
      "Ритм организует звуки и паузы во времени и помогает воспринимать движение музыки.",
  },
  {
    id: "music-melody",
    categoryId: "music",
    prompt: "Какое музыкальное понятие связывает четыре подсказки?",
    images: [
      {
        id: "melody-notes",
        visualKey: "melody-notes",
        symbol: "🎼",
        alt: "Нотные знаки движутся вверх и вниз по строкам",
      },
      {
        id: "melody-piano",
        visualKey: "melody-piano",
        symbol: "🎹",
        alt: "Пианист нажимает белые и чёрные клавиши",
      },
      {
        id: "melody-singer",
        visualKey: "melody-singer",
        symbol: "🎤",
        alt: "Певица исполняет голосовую партию",
      },
      {
        id: "melody-listener",
        visualKey: "melody-listener",
        symbol: "🎧",
        alt: "Слушатель в больших наушниках",
      },
    ],
    answer: "МЕЛОДИЯ",
    distractorLetters: ["К", "Р"],
    explanation:
      "Мелодия — осмысленная последовательность звуков разной высоты и длительности, воспринимаемая как единое целое.",
  },
  {
    id: "science-atom",
    categoryId: "science",
    prompt: "Какое научное понятие показано четырьмя способами?",
    images: [
      {
        id: "atom-model",
        visualKey: "atom-model",
        symbol: "⚛️",
        alt: "Ядро с орбитами на учебной схеме",
      },
      {
        id: "atom-lab",
        visualKey: "atom-lab",
        symbol: "🧪",
        alt: "Колба с раствором в лаборатории",
      },
      {
        id: "atom-microscope",
        visualKey: "atom-microscope",
        symbol: "🔬",
        alt: "Микроскоп установлен над образцом вещества",
      },
      {
        id: "atom-energy",
        visualKey: "atom-energy",
        symbol: "⚡",
        alt: "Вспышка энергии и электрический разряд",
      },
    ],
    answer: "АТОМ",
    distractorLetters: ["И", "С"],
    explanation:
      "Атом — наименьшая электрически нейтральная частица химического элемента, сохраняющая его свойства.",
  },
  {
    id: "science-planet",
    categoryId: "science",
    prompt: "Какой космический объект объединяет изображения?",
    images: [
      {
        id: "planet-ring",
        visualKey: "planet-ring",
        symbol: "🪐",
        alt: "Круглое небесное тело с яркими кольцами",
      },
      {
        id: "planet-earth",
        visualKey: "planet-earth",
        symbol: "🌍",
        alt: "Голубой шар Земли в темноте космоса",
      },
      {
        id: "planet-telescope",
        visualKey: "planet-telescope",
        symbol: "🔭",
        alt: "Телескоп направлен на звёздное небо",
      },
      {
        id: "planet-rocket",
        visualKey: "planet-rocket",
        symbol: "🚀",
        alt: "Ракета летит к далёкому небесному телу",
      },
    ],
    answer: "ПЛАНЕТА",
    distractorLetters: ["О", "Р"],
    explanation:
      "Планета обращается вокруг звезды, имеет почти округлую форму и очищает окрестность своей орбиты.",
  },
  {
    id: "art-portrait",
    categoryId: "art",
    prompt: "Определите жанр искусства по четырём изображениям.",
    images: [
      {
        id: "portrait-face",
        visualKey: "portrait-face",
        symbol: "🧑",
        alt: "Лицо человека крупным планом",
      },
      {
        id: "portrait-palette",
        visualKey: "portrait-palette",
        symbol: "🎨",
        alt: "Палитра и кисть художника",
      },
      {
        id: "portrait-frame",
        visualKey: "portrait-frame",
        symbol: "🖼️",
        alt: "Изображение человека в музейной раме",
      },
      {
        id: "portrait-pencil",
        visualKey: "portrait-pencil",
        symbol: "✏️",
        alt: "Карандашный набросок человеческого лица",
      },
    ],
    answer: "ПОРТРЕТ",
    distractorLetters: ["А", "И"],
    explanation:
      "Портрет изображает конкретного человека или группу людей и передаёт особенности их внешности.",
  },
  {
    id: "art-mosaic",
    categoryId: "art",
    prompt: "Как называется техника, которую показывают четыре изображения?",
    images: [
      {
        id: "mosaic-tiles",
        visualKey: "mosaic-tiles",
        symbol: "🔷",
        alt: "Горсть маленьких разноцветных кусочков стекла",
      },
      {
        id: "mosaic-wall",
        visualKey: "mosaic-wall",
        symbol: "🕌",
        alt: "Стена здания покрыта узором из цветных фрагментов",
      },
      {
        id: "mosaic-hands",
        visualKey: "mosaic-hands",
        symbol: "🧩",
        alt: "Руки складывают мелкие детали в изображение",
      },
      {
        id: "mosaic-floor",
        visualKey: "mosaic-floor",
        symbol: "◼️",
        alt: "Орнаментальный пол из множества каменных элементов",
      },
    ],
    answer: "МОЗАИКА",
    distractorLetters: ["Л", "Т"],
    explanation:
      "Мозаика — изображение или орнамент, составленный из закреплённых на поверхности кусочков камня, стекла или других материалов.",
  },
  {
    id: "people-genius",
    categoryId: "people",
    prompt: "Каким словом можно описать человека на этих изображениях?",
    images: [
      {
        id: "genius-scientist",
        visualKey: "genius-scientist",
        symbol: "👨‍🔬",
        alt: "Учёный решает сложную задачу у доски",
      },
      {
        id: "genius-idea",
        visualKey: "genius-idea",
        symbol: "💡",
        alt: "Яркая лампочка над головой человека",
      },
      {
        id: "genius-formula",
        visualKey: "genius-formula",
        symbol: "📐",
        alt: "Доска покрыта сложными научными формулами",
      },
      {
        id: "genius-books",
        visualKey: "genius-books",
        symbol: "📚",
        alt: "Высокая стопка научных книг",
      },
    ],
    answer: "ГЕНИЙ",
    distractorLetters: ["А", "Л"],
    explanation:
      "Гением называют человека с исключительными творческими или интеллектуальными способностями.",
  },
  {
    id: "people-gagarin",
    categoryId: "people",
    prompt: "Фамилию какого знаменитого человека подсказывают изображения?",
    images: [
      {
        id: "gagarin-portrait",
        visualKey: "gagarin-portrait",
        symbol: "👨‍🚀",
        alt: "Улыбающийся мужчина в гермошлеме и оранжевом скафандре",
      },
      {
        id: "gagarin-vostok",
        visualKey: "gagarin-vostok",
        symbol: "🚀",
        alt: "Ракета-носитель стартует с космодрома",
      },
      {
        id: "gagarin-orbit",
        visualKey: "gagarin-orbit",
        symbol: "🌍",
        alt: "Космический корабль движется вокруг Земли",
      },
      {
        id: "gagarin-date",
        visualKey: "gagarin-date",
        symbol: "📅",
        alt: "Календарный лист с датой 12 апреля 1961 года",
      },
    ],
    answer: "ГАГАРИН",
    distractorLetters: ["О", "У"],
    explanation:
      "Юрий Гагарин 12 апреля 1961 года первым в мире совершил космический полёт на корабле «Восток-1».",
  },
  {
    id: "sport-racket",
    categoryId: "sport",
    prompt: "Какой спортивный предмет объединяет изображения?",
    images: [
      {
        id: "racket-tennis",
        visualKey: "racket-tennis",
        symbol: "🎾",
        alt: "Струнный спортивный снаряд рядом с жёлтым мячом",
      },
      {
        id: "racket-badminton",
        visualKey: "racket-badminton",
        symbol: "🏸",
        alt: "Волан рядом со струнным спортивным снарядом",
      },
      {
        id: "racket-net",
        visualKey: "racket-net",
        symbol: "🥅",
        alt: "Сетка натянута поперёк корта",
      },
      {
        id: "racket-player",
        visualKey: "racket-player",
        symbol: "🙋",
        alt: "Игрок замахнулся для удара по мячу",
      },
    ],
    answer: "РАКЕТКА",
    distractorLetters: ["О", "М"],
    explanation:
      "Ракеткой ударяют по мячу или волану в теннисе, бадминтоне и других игровых видах спорта.",
  },
  {
    id: "sport-marathon",
    categoryId: "sport",
    prompt: "Какой вид бегового соревнования объединяет изображения?",
    images: [
      {
        id: "marathon-runners",
        visualKey: "marathon-runners",
        symbol: "🏃",
        alt: "Группа бегунов движется по городской улице",
      },
      {
        id: "marathon-distance",
        visualKey: "marathon-distance",
        symbol: "📏",
        alt: "Дорожный указатель показывает 42 километра 195 метров",
      },
      {
        id: "marathon-finish",
        visualKey: "marathon-finish",
        symbol: "🏁",
        alt: "Спортсмен пересекает финишную ленту",
      },
      {
        id: "marathon-medal",
        visualKey: "marathon-medal",
        symbol: "🏅",
        alt: "Медаль на груди уставшего бегуна",
      },
    ],
    answer: "МАРАФОН",
    distractorLetters: ["И", "Т"],
    explanation: "Марафон — шоссейный бег на официальную дистанцию 42 километра 195 метров.",
  },
  {
    id: "uzbekistan-registan",
    categoryId: "uzbekistan",
    prompt: "Назовите знаменитый ансамбль Узбекистана.",
    images: [
      {
        id: "registan-square",
        visualKey: "registan-square",
        symbol: "🕌",
        alt: "Широкая площадь между тремя медресе",
      },
      {
        id: "registan-mosaic",
        visualKey: "registan-mosaic",
        symbol: "🔷",
        alt: "Сине-золотой узор на фасаде исторического здания",
      },
      {
        id: "registan-samarkand",
        visualKey: "registan-samarkand",
        symbol: "🇺🇿",
        alt: "Панорама старинного центра Самарканда",
      },
      {
        id: "registan-dome",
        visualKey: "registan-dome",
        symbol: "🏛️",
        alt: "Высокий портал и бирюзовый купол",
      },
    ],
    answer: "РЕГИСТАН",
    distractorLetters: ["О", "К"],
    explanation:
      "Регистан — историческая площадь Самарканда, окружённая медресе Улугбека, Шердор и Тилля-Кари.",
  },
  {
    id: "uzbekistan-sumalak",
    categoryId: "uzbekistan",
    prompt: "Какое традиционное блюдо Узбекистана объединяет изображения?",
    images: [
      {
        id: "sumalak-cauldron",
        visualKey: "sumalak-cauldron",
        symbol: "🥘",
        alt: "Большой котёл стоит над открытым огнём",
      },
      {
        id: "sumalak-stirring",
        visualKey: "sumalak-stirring",
        symbol: "🥄",
        alt: "Женщины по очереди помешивают густое блюдо",
      },
      {
        id: "sumalak-wheat",
        visualKey: "sumalak-wheat",
        symbol: "🌱",
        alt: "Молодые ростки пшеницы на подносе",
      },
      {
        id: "sumalak-navruz",
        visualKey: "sumalak-navruz",
        symbol: "🌷",
        alt: "Весенний праздник с общим столом во дворе",
      },
    ],
    answer: "СУМАЛЯК",
    distractorLetters: ["О", "Р"],
    explanation:
      "Сумаляк — традиционное блюдо из пророщенной пшеницы, которое готовят сообща к празднику Навруз.",
  },
  {
    id: "technology-robot",
    categoryId: "technology",
    prompt: "Какое устройство объединяет четыре изображения?",
    images: [
      {
        id: "robot-face",
        visualKey: "robot-face",
        symbol: "🤖",
        alt: "Механическое лицо с круглыми светящимися глазами",
      },
      {
        id: "robot-gear",
        visualKey: "robot-gear",
        symbol: "⚙️",
        alt: "Шестерёнки внутри металлического механизма",
      },
      {
        id: "robot-circuit",
        visualKey: "robot-circuit",
        symbol: "🔌",
        alt: "Плата с проводами и микросхемами",
      },
      {
        id: "robot-arm",
        visualKey: "robot-arm",
        symbol: "🦾",
        alt: "Автоматическая металлическая рука на производстве",
      },
    ],
    answer: "РОБОТ",
    distractorLetters: ["А", "И"],
    explanation:
      "Робот — программируемое устройство, которое выполняет действия автоматически или под управлением человека.",
  },
  {
    id: "technology-algorithm",
    categoryId: "technology",
    prompt: "Какое понятие связывает эти способы решения задачи?",
    images: [
      {
        id: "algorithm-flowchart",
        visualKey: "algorithm-flowchart",
        symbol: "🔀",
        alt: "Блок-схема со стрелками между шагами",
      },
      {
        id: "algorithm-code",
        visualKey: "algorithm-code",
        symbol: "💻",
        alt: "Строки программного кода на экране",
      },
      {
        id: "algorithm-recipe",
        visualKey: "algorithm-recipe",
        symbol: "📝",
        alt: "Нумерованный список последовательных действий",
      },
      {
        id: "algorithm-machine",
        visualKey: "algorithm-machine",
        symbol: "⚙️",
        alt: "Механизм выполняет заданные операции по порядку",
      },
    ],
    answer: "АЛГОРИТМ",
    distractorLetters: ["Е", "К"],
    explanation:
      "Алгоритм — конечная и однозначная последовательность инструкций для решения задачи.",
  },
] as const satisfies readonly WordPuzzle[];
