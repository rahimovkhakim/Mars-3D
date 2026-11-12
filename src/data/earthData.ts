import { PlanetaryPOI, ISSData } from '../types/planetary';

export const ISS_DATA: ISSData = {
  nameRu: 'Международная космическая станция (МКС)',
  speedKmh: 27600,
  altitudeKm: 408,
  periodMinutes: 92.68,
  crewCount: 7,
  launchYear: 1998,
  massKg: 444615,
  pressurizedVolumeM3: 916,
  modules: [
    {
      name: 'Заря (FGB)',
      agency: 'Роскосмос / NASA',
      year: 1998,
      descriptionRu: 'Первый запущенный модуль МКС, обеспечивающий электроэнергию, двигатели ориентации и хранение топлива.',
    },
    {
      name: 'Unity (Node 1)',
      agency: 'NASA',
      year: 1998,
      descriptionRu: 'Первый американский связующий гермоузел, соединяющий российскую и международную части станции.',
    },
    {
      name: 'Звезда',
      agency: 'Роскосмос',
      year: 2000,
      descriptionRu: 'Служебный модуль с системами жизнеобеспечения, каютами экипажа, кухней и главным двигательным комплексом.',
    },
    {
      name: 'Destiny Laboratory',
      agency: 'NASA',
      year: 2001,
      descriptionRu: 'Основная американская научно-исследовательская лаборатория для экспериментов в условиях микрогравитации.',
    },
    {
      name: 'Columbus',
      agency: 'ESA (Европа)',
      year: 2008,
      descriptionRu: 'Европейская научная лаборатория материаловедения, гидродинамики и космической биологии.',
    },
    {
      name: 'Kibo (JEM)',
      agency: 'JAXA (Япония)',
      year: 2008,
      descriptionRu: 'Крупнейший обитаемый модуль станции с внешней открытой платформой для экспонирования образцов в открытом космосе.',
    },
    {
      name: 'Cupola',
      agency: 'ESA / NASA',
      year: 2010,
      descriptionRu: 'Обзорный купол с 7 кварцевыми иллюминаторами для визуального наблюдения Земли и управления манипулятором Canadarm2.',
    },
  ],
};

export const EARTH_POIS: PlanetaryPOI[] = [
  {
    id: 'american-space-dushanbe',
    planet: 'earth',
    nameRu: 'American Space Dushanbe',
    nameEn: 'American Space Dushanbe (Tajikistan)',
    category: 'observatory',
    badge: '🌟 Центр инноваций и STEM-образования',
    lat: 38.56,
    lon: 68.79,
    elevationKm: 0.71,
    highlightFactRu: 'Место проведения защиты данного космического проекта! Ведущий образовательный центр в Душанбе.',
    highlightFactEn: 'The host of this presentation and leading STEM space education hub in Dushanbe!',
    shortDescRu: 'Образовательный и инновационный центр в столице Таджикистана, вдохновляющий молодёжь на изучение астрономии, робототехники и науки.',
    shortDescEn: 'Educational innovation hub in Tajikistan inspiring youth in astronomy and space exploration.',
    detailedTextRu: 'American Space Dushanbe — это платформа знаний, открывающая для студентов и школьников Центральной Азии доступ к технологиям XXI века, астрономии, программированию и международным космическим исследованиям NASA.',
    detailedTextEn: 'American Space Dushanbe empowers youth with cutting-edge STEM programs, telescope workshops, and space science exploration.',
    nasaDataRu: [
      { label: 'Координаты', value: '38.56°N, 68.79°E (Душанбе)' },
      { label: 'Высота над уровнем моря', value: '+710 метров' },
      { label: 'Миссия', value: 'Образование, астрономия, STEM и защита космических инициатив' },
      { label: 'Статус', value: 'Активный инновационный центр' }
    ],
    photos: [
      {
        id: 'asd-1',
        titleRu: 'Душанбе и Памиро-Алай из космоса',
        titleEn: 'Dushanbe and Pamir Mountains from Orbit',
        descriptionRu: 'Вид на Гиссарскую долину и Памирские горы с Международной космической станции (МКС).',
        camera: 'Nikon D5 / ISS Cupola',
        mission: 'Expedition 65',
        year: 2021,
        imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
        credit: 'NASA Astronaut Photography',
        tags: ['Earth', 'Central Asia', 'Mountains']
      }
    ],
    kidFriendlyChallengeRu: 'Знай: из окон American Space в Душанбе можно наблюдать пролёты МКС в ночном небе над Памиром!'
  },
  {
    id: 'baikonur-cosmodrome',
    planet: 'earth',
    nameRu: 'Космодром Байконур',
    nameEn: 'Baikonur Cosmodrome (Site 1)',
    category: 'spaceport',
    badge: '🚀 Первый космодром Земли',
    lat: 45.96,
    lon: 63.30,
    elevationKm: 0.10,
    missionYear: 1957,
    highlightFactRu: 'Отсюда 12 апреля 1961 года стартовал Юрий Гагарин — первый человек в космосе!',
    highlightFactEn: 'The launchpad of Sputnik 1 (1957) and Yuri Gagarin (1961) — humanitys doorway to space.',
    shortDescRu: 'Исторический Гагаринский старт, откуда взлетел первый искусственный спутник и сотни пилотируемых миссий «Союз».',
    shortDescEn: 'The world’s first and largest operational space launch facility in Kazakhstan.',
    detailedTextRu: 'Байконур расположен в степях Казахстана. Именно отсюда началась космическая эра человечества: запуск первого спутника Земли в 1957 году, полёт первой женщины-космонавта, выведение базовых модулей орбитальной станции «Мир» и модуля «Заря» для МКС.',
    detailedTextEn: 'The birthplace of orbital spaceflight. Over decades, it has launched thousands of rockets connecting Earth to orbit.',
    nasaDataRu: [
      { label: 'Координаты', value: '45.96°N, 63.30°E' },
      { label: 'Первый орбитальный запуск', value: '4 октября 1957 (Спутник-1)' },
      { label: 'Первый человек в космосе', value: '12 апреля 1961 (Восток-1, Гагарин)' },
      { label: 'Площадь комплекса', value: '6 717 км²' }
    ],
    photos: [
      {
        id: 'baikonur-1',
        titleRu: 'Старт ракеты «Союз» к МКС',
        titleEn: 'Soyuz Rocket Launch to ISS',
        descriptionRu: 'Пилотируемый пуск транспортного космического корабля «Союз» с космодрома Байконур.',
        camera: 'NASA Ground Optical Tracking',
        mission: 'Expedition 64 Launch',
        year: 2020,
        imageUrl: 'https://images.unsplash.com/photo-1517976487507-5b3df11d991e?auto=format&fit=crop&w=1200&q=80',
        credit: 'NASA / Bill Ingalls',
        tags: ['Rocket', 'Launch', 'Spaceport']
      }
    ],
    kidFriendlyChallengeRu: 'Ракета «Союз» стартует с Байконура и разгоняется до первой космической скорости (28 000 км/ч) всего за 9 минут!'
  },
  {
    id: 'kennedy-space-center',
    planet: 'earth',
    nameRu: 'Космический центр Кеннеди (NASA KSC)',
    nameEn: 'NASA Kennedy Space Center / Cape Canaveral',
    category: 'spaceport',
    badge: '🌙 Стартовая площадка миссий Apollo и Artemis',
    lat: 28.57,
    lon: -80.65,
    elevationKm: 0.01,
    missionYear: 1962,
    highlightFactRu: 'Отсюда стартовал «Аполлон-11» с Нилом Армстронгом для первой высадки человека на Луну в 1969 году!',
    highlightFactEn: 'Launch site of Apollo 11 moon landing, 135 Space Shuttle flights, and Artemis SLS missions.',
    shortDescRu: 'Главный стартовый комплекс NASA во Флориде: стартовые столы 39A и 39B для сверхтяжёлых лунных и марсианских ракет.',
    shortDescEn: 'America’s primary spaceport for human spaceflight on Florida’s Space Coast.',
    detailedTextRu: 'Расположенный на мысе Канаверал, КЦ Кеннеди принимал все полёты программы «Аполлон», 135 миссий многоразовых шаттлов «Спейс Шаттл», а сегодня запускает ракеты Falcon Heavy и мегаракету SLS для возвращения человека на Луну по программе Artemis.',
    detailedTextEn: 'Home of the massive Vehicle Assembly Building (VAB) and historic pads 39A and 39B launching mankind beyond low Earth orbit.',
    nasaDataRu: [
      { label: 'Координаты', value: '28.57°N, 80.65°W (Флорида, США)' },
      { label: 'Высадка на Луну', value: '16 июля 1969 (Apollo 11, Сатурн-V)' },
      { label: 'Здание сборки ракет (VAB)', value: 'Объём 3.66 млн кубометров' },
      { label: 'Текущие программы', value: 'NASA Artemis (Луна), Commercial Crew (SpaceX Dragon)' }
    ],
    photos: [
      {
        id: 'ksc-1',
        titleRu: 'Стартовая площадка 39B и ракета SLS Artemis',
        titleEn: 'Pad 39B with Artemis I Space Launch System',
        descriptionRu: 'Сверхтяжёлая ракета Space Launch System (SLS) перед стартом к Луне.',
        camera: 'NASA KSC High-Speed Telephoto',
        mission: 'Artemis I',
        year: 2022,
        imageUrl: 'https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=1200&q=80',
        credit: 'NASA / Joel Kowsky',
        tags: ['NASA', 'SLS', 'Moon', 'Artemis']
      }
    ],
    kidFriendlyChallengeRu: 'Здание сборки ракет (VAB) в КЦ Кеннеди настолько гигантское, что в жаркие дни под его потолком иногда образуются настоящие облака!'
  },
  {
    id: 'esa-kourou',
    planet: 'earth',
    nameRu: 'Космодром Куру (Французская Гвиана)',
    nameEn: 'Guiana Space Centre (ESA Kourou)',
    category: 'spaceport',
    badge: '🔭 Запуск телескопа James Webb (JWST)',
    lat: 5.23,
    lon: -52.76,
    elevationKm: 0.02,
    highlightFactRu: 'Расположен всего в 500 км от экватора — вращение Земли даёт ракете бесплатную прибавку к скорости 1660 км/ч!',
    highlightFactEn: 'Located at 5° latitude near the equator, boosting rocket payloads via Earth rotational velocity.',
    shortDescRu: 'Европейский космодром, откуда на ракете Ariane 5 в Рождество 2021 года был запущен величайший космический телескоп «Джеймс Уэбб».',
    shortDescEn: 'Europe’s Spaceport near the equator in French Guiana, launch site of the James Webb Space Telescope.',
    detailedTextRu: 'Благодаря близости к экватору космодром Куру является самым энергетически выгодным космодромом в мире для вывода аппаратов на геостационарную орбиту и к точкам Лагранжа L2.',
    detailedTextEn: 'The premier launch site of the European Space Agency, hosting Ariane and Vega launchers.',
    nasaDataRu: [
      { label: 'Широта', value: '5.23°N (самый близкий к экватору крупный космодром)' },
      { label: 'Главный триумф', value: 'Запуск космического телескопа James Webb (25 дек 2021)' },
      { label: 'Оператор', value: 'ESA / CNES / Arianespace' }
    ],
    photos: [
      {
        id: 'kourou-1',
        titleRu: 'Запуск ракеты Ariane 5 с телескопом JWST',
        titleEn: 'Ariane 5 Launch carrying James Webb Telescope',
        descriptionRu: 'Старт телескопа James Webb в космос для изучения первых галактик Вселенной.',
        camera: 'ESA / CNES Tracking',
        mission: 'JWST Launch',
        year: 2021,
        imageUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1200&q=80',
        credit: 'ESA / NASA / Bill Ingalls',
        tags: ['Telescope', 'JWST', 'Ariane']
      }
    ],
    kidFriendlyChallengeRu: 'Именно этот космодром помог отправить телескоп «Джеймс Уэбб» на расстояние 1.5 миллиона километров от Земли!'
  },
  {
    id: 'mount-everest',
    planet: 'earth',
    nameRu: 'Гора Эверест (Джомолунгма)',
    nameEn: 'Mount Everest (Himalayas)',
    category: 'mountain',
    badge: '🏔️ Высочайший пик Земли (+8.85 км)',
    lat: 27.98,
    lon: 86.92,
    elevationKm: 8.85,
    highlightFactRu: 'Высочайшая гора Земли (+8.85 км). Но марсианский Олимп (+21.9 км) выше её почти в 2.5 раза!',
    highlightFactEn: 'Highest peak on Earth at 8,848m — yet Mars’ Olympus Mons is almost 3x taller!',
    shortDescRu: 'Вершина Гималаев, рождённая столкновением тектонических плит Индостана и Евразии.',
    shortDescEn: 'The roof of the world, formed by active tectonic collisions unique to dynamic planet Earth.',
    detailedTextRu: 'Эверест символизирует главное геологическое отличие Земли от Марса: на Земле действуют тектонические плиты, сминающие кору в складчатые горы. На Марсе тектоники плит нет, поэтому вулканы оставались над одним горячим пятном и выросли в гигантов вроде Олимпа.',
    detailedTextEn: 'Everest demonstrates Earth’s active plate tectonics, contrasting with the static, thick single-plate crust of Mars.',
    nasaDataRu: [
      { label: 'Высота вершины', value: '8 848.86 метров над уровнем моря' },
      { label: 'Атмосферное давление на пике', value: '33 кПа (33% от нормы, «Зона смерти»)' },
      { label: 'Сравнение с Марсом', value: 'Олимп на Марсе на 13 000 метров выше Эвереста!' },
      { label: 'Геология', value: 'Морские известняки (поднятые со дна океана Тетис)' }
    ],
    photos: [
      {
        id: 'everest-1',
        titleRu: 'Гималаи и Эверест из космоса с МКС',
        titleEn: 'Himalayas and Everest from ISS',
        descriptionRu: 'Снежные вершины Гималайского хребта, запечатлённые космонавтами с борта МКС.',
        camera: 'ISS High Resolution Digital Still Camera',
        mission: 'Expedition 53',
        year: 2017,
        imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
        credit: 'NASA Earth Observatory',
        tags: ['Mountains', 'Himalayas', 'Everest']
      }
    ],
    kidFriendlyChallengeRu: 'На самой вершине Эвереста геологи находят окаменелости древних морских ракушек — когда-то эта скала была дном океана!'
  },
  {
    id: 'mariana-trench',
    planet: 'earth',
    nameRu: 'Марианская впадина (Бездна Челленджера)',
    nameEn: 'Mariana Trench (Challenger Deep)',
    category: 'ocean',
    badge: '🌊 Глубочайшая точка Мирового океана (-11.03 км)',
    lat: 11.35,
    lon: 142.20,
    elevationKm: -11.03,
    highlightFactRu: 'Глубина 11 034 метра! Если поставить Эверест на дно впадины, над ним останется ещё более 2 км воды!',
    highlightFactEn: '11,034 meters deep — greater depth below sea level than Everest rises above it.',
    shortDescRu: 'Зона субдукции Тихоокеанской тектонической плиты. Давление на дне превышает 108 мегапаскалей (в 1070 раз больше нормы).',
    shortDescEn: 'The deepest point of Earth’s vast liquid hydrosphere, covering 71% of the planetary surface.',
    detailedTextRu: 'В то время как на Марсе вода существует лишь в виде льда и микроскопического пара в атмосфере, Земля — единственная известная планета с обширным океаном жидкой воды, породившим жизнь 3.8 миллиарда лет назад.',
    detailedTextEn: 'Earth is the ocean world of the solar system, with 1.33 billion cubic kilometers of liquid water.',
    nasaDataRu: [
      { label: 'Глубина Бездны Челленджера', value: '11 034 метра' },
      { label: 'Гидростатическое давление', value: '1 086 бар (1 070 атмосфер)' },
      { label: 'Температура воды на дне', value: 'от +1°C до +4°C' },
      { label: 'Сравнение с Марсом', value: 'Впадина Эллада на Марсе имеет глубину 8.2 км, но сухая' }
    ],
    photos: [
      {
        id: 'trench-1',
        titleRu: 'Тихий океан и гидросфера Земли из космоса',
        titleEn: 'Pacific Ocean Basin from Orbit',
        descriptionRu: 'Глубокие синие океаны Земли — планеты, где вода сформировала биосферу.',
        camera: 'NASA DSCOVR EPIC Camera',
        mission: 'DSCOVR Spacecraft',
        year: 2021,
        imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
        credit: 'NASA Goddard Space Flight Center',
        tags: ['Ocean', 'Hydrosphere', 'Earth']
      }
    ],
    kidFriendlyChallengeRu: 'На дне Марианской впадины давление такое огромное, будто на один квадратный сантиметр давит слон!'
  },
  {
    id: 'mauna-kea',
    planet: 'earth',
    nameRu: 'Обсерватория Мауна-Кеа (Гавайи)',
    nameEn: 'Mauna Kea Observatories (Hawaii)',
    category: 'observatory',
    badge: '🔭 Окно в глубины Вселенной',
    lat: 19.82,
    lon: -155.46,
    elevationKm: 4.20,
    highlightFactRu: '13 крупнейших оптических и инфракрасных телескопов мира, заглядывающих в глубины космоса!',
    highlightFactEn: 'Home to 13 world-class astronomical telescopes studying exoplanets, black holes, and Mars.',
    shortDescRu: 'Потухший щитовой вулкан на острове Гавайи. Благодаря чистейшему сухому воздуху на высоте 4200 м это лучшая астрономическая точка планеты.',
    shortDescEn: 'The premier ground-based optical and infrared astronomical observatory on Earth.',
    detailedTextRu: 'Здесь работают телескопы Keck I и Keck II с адаптивной оптикой, телескоп Subaru и Канадско-Франко-Гавайский телескоп. С их помощью астрономы изучают атмосферу Марса, открывают экзопланеты у далёких звёзд и исследуют сверхмассивную чёрную дыру в центре нашей Галактики.',
    detailedTextEn: 'High above 40% of Earth’s atmosphere and 90% of water vapor, providing crystal-clear views into the cosmos.',
    nasaDataRu: [
      { label: 'Высота', value: '4 207 метров над уровнем моря' },
      { label: 'Влажность воздуха', value: 'Менее 10% (идеально для инфракрасной астрономии)' },
      { label: 'Ключевые телескопы', value: 'Двойной Keck (10 м), Subaru (8.2 м), Gemini North (8.1 м)' },
      { label: 'Вклад', value: 'Первые спектроскопические обнаружения метана в атмосфере Марса' }
    ],
    photos: [
      {
        id: 'mauna-kea-1',
        titleRu: 'Телескопы Мауна-Кеа под Млечным Путем',
        titleEn: 'Mauna Kea Telescopes beneath the Milky Way',
        descriptionRu: 'Купола обсерватории на вершине вулкана над облаками в лучах лазерных лучей адаптивной оптики.',
        camera: 'Astronomical Ultra-Low Light Long Exposure',
        mission: 'W. M. Keck Observatory',
        year: 2019,
        imageUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1200&q=80',
        credit: 'W. M. Keck Observatory / Andrew Richard Hara',
        tags: ['Observatory', 'Stars', 'Space']
      }
    ],
    kidFriendlyChallengeRu: 'Астрономы на Мауна-Кеа используют специальные лазеры в небо, создавая искусственные звёзды, чтобы нейтрализовать дрожание атмосферы Земли!'
  }
];
