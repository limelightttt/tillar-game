import type { PictureQuestion } from "./types";

export const pictureQuestions = [
  {
    id: "ocean-largest",
    categoryId: "geography",
    prompt: "Какой из этих океанов является крупнейшим по площади?",
    options: [
      {
        id: "pacific",
        visualKey: "pacific-ocean",
        ariaLabel: "Океан с цепью вулканических островов и широкой синей акваторией",
      },
      {
        id: "atlantic",
        visualKey: "atlantic-ocean",
        ariaLabel: "Океан между очертаниями Америки, Европы и Африки",
      },
    ],
    correctOptionId: "pacific",
    correctFact:
      "Тихий океан — крупнейший и самый глубокий океан Земли. Его площадь больше площади всей суши планеты.",
    incorrectExplanation: {
      optionId: "atlantic",
      text: "Атлантический океан занимает второе место по площади после Тихого и разделяет Америки, Европу и Африку.",
    },
  },
  {
    id: "landmark-paris",
    categoryId: "geography",
    prompt: "Какая из этих достопримечательностей находится в Париже?",
    options: [
      {
        id: "eiffel",
        visualKey: "eiffel-tower",
        ariaLabel: "Высокая ажурная металлическая башня у реки",
      },
      {
        id: "westminster-clock",
        visualKey: "big-ben",
        ariaLabel: "Готическая часовая башня рядом с парламентским зданием",
      },
    ],
    correctOptionId: "eiffel",
    correctFact:
      "Эйфелеву башню построили для Всемирной выставки 1889 года. Со временем она стала одним из главных символов Парижа.",
    incorrectExplanation: {
      optionId: "westminster-clock",
      text: "Эта часовая башня стоит у Вестминстерского дворца в Лондоне; Биг-Бен — название её большого колокола.",
    },
  },
  {
    id: "history-first-spaceflight",
    categoryId: "history",
    prompt: "Кто из этих людей первым совершил полёт в космос?",
    options: [
      {
        id: "gagarin",
        visualKey: "yuri-gagarin",
        ariaLabel: "Юрий Гагарин в шлеме космонавта",
      },
      {
        id: "armstrong",
        visualKey: "neil-armstrong",
        ariaLabel: "Нил Армстронг в скафандре астронавта",
      },
    ],
    correctOptionId: "gagarin",
    correctFact:
      "Юрий Гагарин 12 апреля 1961 года совершил первый полёт человека в космос на корабле «Восток-1».",
    incorrectExplanation: {
      optionId: "armstrong",
      text: "Нил Армстронг вошёл в историю позже: в июле 1969 года он стал первым человеком, ступившим на Луну.",
    },
  },
  {
    id: "history-rome-landmark",
    categoryId: "history",
    prompt: "Какое из этих древних сооружений находится в Риме?",
    options: [
      {
        id: "colosseum",
        visualKey: "colosseum",
        ariaLabel: "Овальный каменный амфитеатр с рядами арок",
      },
      {
        id: "parthenon",
        visualKey: "parthenon",
        ariaLabel: "Античный храм с треугольным фронтоном и колоннами",
      },
    ],
    correctOptionId: "colosseum",
    correctFact:
      "Колизей — древнеримский амфитеатр, открытый в I веке нашей эры. Его строили для массовых зрелищ.",
    incorrectExplanation: {
      optionId: "parthenon",
      text: "Парфенон находится на Афинском акрополе в Греции и был возведён в V веке до нашей эры.",
    },
  },
  {
    id: "science-planet-rings",
    categoryId: "science",
    prompt: "Какая из этих планет известна самой заметной системой колец?",
    options: [
      {
        id: "saturn",
        visualKey: "saturn",
        ariaLabel: "Светлая газовая планета с широкой системой колец",
      },
      {
        id: "mars",
        visualKey: "mars",
        ariaLabel: "Красноватая каменистая планета без колец",
      },
    ],
    correctOptionId: "saturn",
    correctFact:
      "Кольца Сатурна состоят из множества частиц льда, камня и пыли. Они особенно хорошо видны с Земли в телескоп.",
    incorrectExplanation: {
      optionId: "mars",
      text: "У Марса нет колец. У этой планеты есть два небольших спутника — Фобос и Деймос.",
    },
  },
  {
    id: "science-marine-mammal",
    categoryId: "science",
    prompt: "Какое из этих морских животных является млекопитающим?",
    options: [
      {
        id: "dolphin",
        visualKey: "dolphin",
        ariaLabel: "Дельфин выпрыгивает из морской волны",
      },
      {
        id: "shark",
        visualKey: "shark",
        ariaLabel: "Акула плывёт под водой",
      },
    ],
    correctOptionId: "dolphin",
    correctFact:
      "Дельфины дышат лёгкими, рождают живых детёнышей и кормят их молоком — это признаки млекопитающих.",
    incorrectExplanation: {
      optionId: "shark",
      text: "Акула — хрящевая рыба. Она получает кислород из воды с помощью жабр.",
    },
  },
  {
    id: "uzbekistan-samarkand",
    categoryId: "uzbekistan",
    prompt: "Какой из этих архитектурных ансамблей находится в Самарканде?",
    options: [
      {
        id: "registan",
        visualKey: "registan",
        ariaLabel: "Площадь с тремя медресе и бирюзовыми куполами",
      },
      {
        id: "ichan-kala",
        visualKey: "ichan-kala",
        ariaLabel: "Глинобитные стены старого города и голубой минарет",
      },
    ],
    correctOptionId: "registan",
    correctFact:
      "Регистан — историческая площадь в центре Самарканда. Её обрамляют три знаменитых медресе.",
    incorrectExplanation: {
      optionId: "ichan-kala",
      text: "Ичан-Кала — окружённый стенами внутренний город Хивы, а не Самарканда.",
    },
  },
  {
    id: "uzbekistan-tashkent",
    categoryId: "uzbekistan",
    prompt: "Какая из этих достопримечательностей находится в Ташкенте?",
    options: [
      {
        id: "chorsu",
        visualKey: "chorsu-bazaar",
        ariaLabel: "Круглый рынок под большим голубым куполом",
      },
      {
        id: "ark",
        visualKey: "ark-bukhara",
        ariaLabel: "Массивная древняя крепость с высокими стенами",
      },
    ],
    correctOptionId: "chorsu",
    correctFact:
      "Чорсу — один из самых известных базаров Ташкента. Его современный комплекс узнают по большому голубому куполу.",
    incorrectExplanation: {
      optionId: "ark",
      text: "Крепость Арк находится в Бухаре и веками служила резиденцией бухарских правителей.",
    },
  },
  {
    id: "art-leonardo",
    categoryId: "art",
    prompt: "Какую из этих картин создал Леонардо да Винчи?",
    options: [
      {
        id: "mona-lisa",
        visualKey: "mona-lisa",
        ariaLabel: "Портрет женщины со сложенными руками на фоне пейзажа",
      },
      {
        id: "starry-night",
        visualKey: "starry-night",
        ariaLabel: "Ночное небо с яркими звёздами и закрученными облаками",
      },
    ],
    correctOptionId: "mona-lisa",
    correctFact:
      "Леонардо да Винчи написал «Мону Лизу» в начале XVI века. Сегодня картина хранится в Лувре.",
    incorrectExplanation: {
      optionId: "starry-night",
      text: "«Звёздную ночь» написал Винсент ван Гог в 1889 году, спустя несколько веков после Леонардо.",
    },
  },
  {
    id: "music-uzbek-instrument",
    categoryId: "music",
    prompt: "Какой из этих инструментов относится к традиционным узбекским щипковым?",
    options: [
      {
        id: "dutar",
        visualKey: "dutar",
        ariaLabel: "Длинногрифный двухструнный инструмент с грушевидным корпусом",
      },
      {
        id: "violin",
        visualKey: "violin",
        ariaLabel: "Четырёхструнный смычковый инструмент с фигурным корпусом",
      },
    ],
    correctOptionId: "dutar",
    correctFact:
      "Дутар распространён в музыкальных традициях Узбекистана и других стран Центральной Азии. Его название связано с двумя струнами.",
    incorrectExplanation: {
      optionId: "violin",
      text: "Скрипка — смычковый инструмент; её современная форма сложилась в Европе в XVI веке.",
    },
  },
  {
    id: "sport-badminton-object",
    categoryId: "sport",
    prompt: "Каким из этих предметов играют в бадминтон?",
    options: [
      {
        id: "shuttlecock",
        visualKey: "shuttlecock",
        ariaLabel: "Волан с округлой головкой и оперением",
      },
      {
        id: "tennis-ball",
        visualKey: "tennis-ball",
        ariaLabel: "Яркий мяч с изогнутыми белыми швами",
      },
    ],
    correctOptionId: "shuttlecock",
    correctFact:
      "В бадминтоне ракеткой перебрасывают волан через сетку. Его юбка бывает перьевой или синтетической.",
    incorrectExplanation: {
      optionId: "tennis-ball",
      text: "Такой мяч используют в теннисе: он покрыт ворсистым материалом и отскакивает от корта.",
    },
  },
  {
    id: "technology-solid-state-storage",
    categoryId: "technology",
    prompt: "Какое из этих устройств хранит данные без движущихся механических частей?",
    options: [
      {
        id: "ssd",
        visualKey: "ssd-drive",
        ariaLabel: "Компактный накопитель с микросхемами памяти",
      },
      {
        id: "hdd",
        visualKey: "hard-disk-drive",
        ariaLabel: "Накопитель с круглым магнитным диском и подвижной головкой",
      },
    ],
    correctOptionId: "ssd",
    correctFact:
      "SSD хранит данные в микросхемах флеш-памяти и не содержит вращающихся дисков или механической считывающей головки.",
    incorrectExplanation: {
      optionId: "hdd",
      text: "В HDD данные записываются на вращающиеся магнитные пластины, над которыми перемещается механическая головка.",
    },
  },
  {
    id: "cinema-synchronization-tool",
    categoryId: "cinema",
    prompt:
      "Какой предмет помогает отметить дубль и синхронизировать звук с изображением на съёмке?",
    options: [
      {
        id: "clapperboard",
        visualKey: "film-clapper",
        ariaLabel: "Кинохлопушка с полосатой подвижной планкой",
      },
      {
        id: "megaphone",
        visualKey: "megaphone",
        ariaLabel: "Ручной рупор для усиления голоса",
      },
    ],
    correctOptionId: "clapperboard",
    correctFact:
      "Хлопок кинохлопушки создаёт заметную точку одновременно в звуковой дорожке и на кадре, помогая синхронизировать запись.",
    incorrectExplanation: {
      optionId: "megaphone",
      text: "Мегафон направляет и усиливает голос, но не создаёт монтажную отметку для синхронизации звука и изображения.",
    },
  },
  {
    id: "people-general-relativity",
    categoryId: "people",
    prompt: "Кто из этих учёных сформулировал общую теорию относительности?",
    options: [
      {
        id: "einstein",
        visualKey: "albert-einstein",
        ariaLabel: "Альберт Эйнштейн с характерными седыми волосами",
      },
      {
        id: "newton",
        visualKey: "isaac-newton",
        ariaLabel: "Исаак Ньютон с длинными волнистыми волосами",
      },
    ],
    correctOptionId: "einstein",
    correctFact:
      "Альберт Эйнштейн представил завершённые уравнения общей теории относительности в 1915 году.",
    incorrectExplanation: {
      optionId: "newton",
      text: "Исаак Ньютон сформулировал законы классической механики и закон всемирного тяготения задолго до теории Эйнштейна.",
    },
  },
] as const satisfies readonly PictureQuestion[];
