import { MarsPOI, QuizQuestion, RoverComponent, TimelineMilestone } from '../types/mars';
import { MARS_POI_PHOTOS } from './marsPhotosData';

const RAW_MARS_POIS: Omit<MarsPOI, 'photos' | 'planet'>[] = [
  {
    id: 'olympus-mons',
    nameRu: 'Гора Олимп (Olympus Mons)',
    nameEn: 'Olympus Mons',
    category: 'volcano',
    badge: '🌋 Вулкан-рекордсмен',
    lat: 18.65,
    lon: -133.8, // 226.2° E
    elevationKm: 21.9,
    diameterKm: 624,
    highlightFactRu: 'В 2.5 раза выше Эвереста — самый огромный вулкан в Солнечной системе!',
    highlightFactEn: 'Nearly 3x taller than Mount Everest — the largest volcano in the Solar System!',
    shortDescRu: 'Потухший щитовой щитообразный супервулкан. Его основание размером с Францию или весь Таджикистан и Узбекистан вместе взятые!',
    shortDescEn: 'A gigantic shield volcano whose base would cover entire countries on Earth.',
    detailedTextRu: 'Гора Олимп настолько грандиозна, что стоя на её вершине, её склон уходит далеко за марсианский горизонт из-за кривизны планеты! Вулкан рос миллионы лет, потому что на Марсе нет тектонических плит: магма извергалась в одну и ту же точку коры, наращивая гигантскую гору высотой почти 22 километра.',
    detailedTextEn: 'Olympus Mons grew so immense because Mars has no moving tectonic plates; the crust stayed over a hotspot for billions of years.',
    nasaDataRu: [
      { label: 'Высота над средним уровнем', value: '21.9 км (72 000 футов)' },
      { label: 'Диаметр кальдеры (кратера на пике)', value: '80 × 60 км' },
      { label: 'Атмосферное давление на пике', value: '0.07 кПа (почти открытый космос!)' },
      { label: 'Орбитальная съёмка', value: 'NASA MGS & Mars Reconnaissance Orbiter (HiRISE)' }
    ],
    kidFriendlyChallengeRu: 'Представь: если на Олимп поставить 100 Душанбинских телебашен друг на друга, они едва достанут до середины горы!'
  },
  {
    id: 'valles-marineris',
    nameRu: 'Долины Маринер (Valles Marineris)',
    nameEn: 'Valles Marineris',
    category: 'canyon',
    badge: '🏜️ Великий Каньон Марса',
    lat: -14.0,
    lon: -59.0,
    elevationKm: -7.0,
    diameterKm: 4000,
    missionName: 'Mariner 9',
    missionYear: 1971,
    highlightFactRu: 'Длина более 4000 км — если бы он был на Земле, он протянулся бы от Душанбе до Парижа!',
    highlightFactEn: 'Over 4,000 km long — spans the width of the entire United States or Central Asia to Europe!',
    shortDescRu: 'Колоссальная система каньонов глубиной до 7 км и шириной до 200 км. В 4 раза глубже и в 10 раз длиннее Большого Каньона в США.',
    shortDescEn: 'The Grand Canyon of Mars, stretching along the equator across a fifth of the planet.',
    detailedTextRu: 'Этот разлом образовался миллиарды лет назад, когда соседняя вулканическая провинция Фарсида вздымалась вверх и разорвала марсианскую кору. Внутри каньонов утренний туман состоит из кристаллов водяного льда, а на дне обнаружены следы древних водных потоков.',
    detailedTextEn: 'Formed as a colossal tectonic crack when the volcanic Tharsis bulge swelled up, splitting the crust.',
    nasaDataRu: [
      { label: 'Протяжённость', value: '4 000+ км (четверть экватора Марса)' },
      { label: 'Максимальная глубина', value: '7 км' },
      { label: 'Открыт аппаратом', value: 'NASA Mariner 9 (1971 г.)' },
      { label: 'Геология', value: 'Осадочные сульфатные минералы и древние оползни' }
    ],
    kidFriendlyChallengeRu: 'В этот каньон можно свободно уронить высочайшие горы Памира, и их вершины даже не покажутся из края пропасти!'
  },
  {
    id: 'jezero-crater',
    nameRu: 'Кратер Езеро (Jezero Crater)',
    nameEn: 'Jezero Crater (Perseverance & Ingenuity)',
    category: 'rover',
    badge: '🚀 Марсоход Perseverance & вертолёт Ingenuity',
    lat: 18.38,
    lon: 77.58,
    elevationKm: -2.5,
    diameterKm: 45,
    missionName: 'NASA Mars 2020',
    missionYear: 2021,
    highlightFactRu: 'Место посадки марсохода Perseverance (2021) и легендарного вертолёта Ingenuity!',
    highlightFactEn: 'Landing site of NASA Perseverance rover and Ingenuity helicopter in 2021.',
    shortDescRu: 'Древнее озеро и дельта реки возрастом 3.7 млрд лет. Здесь марсоход собирает образцы грунта для доставки на Землю.',
    shortDescEn: 'An ancient paleolake and river delta where Perseverance collects samples in search of ancient microbial biosignatures.',
    detailedTextRu: 'NASA выбрало кратер Езеро (названный в честь города в Боснии, что означает "Озеро"), потому что снимки с орбиты показали классическую форму речной дельты с принесёнными глинами. Глины отлично консервируют органические молекулы и микроокаменелости древних бактерий, если жизнь когда-либо зарождалась на Марсе.',
    detailedTextEn: 'Sediments in this delta may preserve evidence of microscopic life that existed billions of years ago.',
    nasaDataRu: [
      { label: 'Дата посадки', value: '18 февраля 2021 года' },
      { label: 'Технология спуска', value: '«Небесный кран» (Sky Crane)' },
      { label: 'Рекорд вертолёта Ingenuity', value: '72 полёта вместо запланированных 5!' },
      { label: 'Главный прибор MOXIE', value: 'Впервые получил кислород из атмосферы Марса' }
    ],
    kidFriendlyChallengeRu: 'Вертолёт Ingenuity доказал: летать с винтами в атмосфере плотностью всего 1% от земной — РЕАЛЬНО!'
  },
  {
    id: 'gale-crater',
    nameRu: 'Кратер Гейл и гора Шарп (Gale Crater)',
    nameEn: 'Gale Crater (Curiosity)',
    category: 'rover',
    badge: '🤖 Марсоход Curiosity (NASA)',
    lat: -5.4,
    lon: 137.8,
    elevationKm: -4.5,
    diameterKm: 154,
    missionName: 'Mars Science Laboratory',
    missionYear: 2012,
    highlightFactRu: 'Марсоход Curiosity доказал: в кратере миллионы лет была пресная питьевая вода!',
    highlightFactEn: 'Curiosity discovered freshwater lake deposits and chemical ingredients necessary for life.',
    shortDescRu: 'Огромный кратер с 5-километровой слоистой горой Шарп в центре. Ровер Curiosity исследует его уже более 12 лет.',
    shortDescEn: 'Home of the Curiosity rover since August 2012, climbing Mount Sharp layer by layer.',
    detailedTextRu: 'В центре кратера возвышается гора Эолида (Шарп). Её слои, как страницы каменной книги, хранят всю историю изменения марсианского климата: от тёплой и влажной планеты с озёрами до холодной сухой пустыни.',
    detailedTextEn: 'Mount Sharp is a 5-km sedimentary mountain whose layers record billions of years of Martian climate history.',
    nasaDataRu: [
      { label: 'Дата посадки', value: '6 августа 2012 года' },
      { label: 'Пройденная дистанция', value: 'Более 32 километров по скалам' },
      { label: 'Главное открытие', value: 'Органические углеродные молекулы и древнее пресное озеро' },
      { label: 'Источник энергии', value: 'Радиоизотопный термоэлектрический генератор (РИТЭГ)' }
    ],
    kidFriendlyChallengeRu: 'Curiosity — это целая химическая лаборатория на 6 колёсах размером с легковой внедорожник!'
  },
  {
    id: 'planum-boreum',
    nameRu: 'Северная полярная шапка (Planum Boreum)',
    nameEn: 'North Polar Ice Cap',
    category: 'pole',
    badge: '❄️ Полярные льды и сухой лёд',
    lat: 84.0,
    lon: 0.0,
    elevationKm: 2.0,
    diameterKm: 1000,
    highlightFactRu: 'Содержит миллионы кубических километров водяного льда — хватит, чтобы покрыть весь Марс океаном!',
    highlightFactEn: 'Contains millions of cubic kilometers of water ice, enough to cover Mars in a shallow ocean.',
    shortDescRu: 'Спиральные слои водяного льда, пыли и замерзшего углекислого газа (сухого льда). Зимой шапка растёт, а летом тает.',
    shortDescEn: 'A spiral vortex of layered water ice and frozen carbon dioxide (dry ice) sculpted by polar winds.',
    detailedTextRu: 'Спиральный узор ледяной шапки вызван ветрами кориолисовой силы, которые дуют от полюса при вращении планеты. Под слоем углекислотного инея скрыт чистейший водяной лёд. Это главный резервуар воды для будущих человеческих баз на Марсе!',
    detailedTextEn: 'Coriolis forces and sublimation drive polar katabatic winds that carve dramatic spiral troughs in the ice.',
    nasaDataRu: [
      { label: 'Диаметр ледяного щита', value: 'Около 1 000 км' },
      { label: 'Толщина льда', value: 'До 3 километров' },
      { label: 'Зимняя температура', value: '-125°C и ниже' },
      { label: 'Состав', value: 'Водяной лёд (H2O) + сезонная корка CO2 (сухой лёд)' }
    ],
    kidFriendlyChallengeRu: 'На Марсе снег падает не только из воды, но и из сухого льда — углекислого газа из газировки!'
  },
  {
    id: 'meridiani-planum',
    nameRu: 'Плато Меридиана (Meridiani Planum)',
    nameEn: 'Meridiani Planum (Opportunity)',
    category: 'rover',
    badge: '🫐 «Марсианская черника» & Opportunity',
    lat: -0.2,
    lon: -2.5,
    elevationKm: -1.3,
    diameterKm: 800,
    missionName: 'Mars Exploration Rover - Opportunity',
    missionYear: 2004,
    highlightFactRu: 'Марсоход Opportunity проработал 14 лет вместо 90 дней и проехал марафонскую дистанцию (45.16 км)!',
    highlightFactEn: 'Opportunity rover operated for nearly 15 years and covered a marathon distance of 45.16 km.',
    shortDescRu: 'Гладкая экваториальная равнина, где марсоход обнаружил микроскопические серые шарики гематита — минерала, растущего в воде.',
    shortDescEn: 'Smooth equatorial plain where Opportunity discovered hematite spherules formed in ancient standing groundwater.',
    detailedTextRu: 'Астрономы назвали эти шарики "марсианской черникой" (blueberries). Они образовались в древних минерализованных грунтовых водах, что стало первым неопровержимым доказательством жидкой воды на поверхности Марса в геологическом прошлом.',
    detailedTextEn: 'Tiny mineral spheres rich in iron called "blueberries" confirmed that acid groundwater once soaked this area.',
    nasaDataRu: [
      { label: 'Период работы ровера', value: '2004 — 2018 (5 111 марсианских суток!)' },
      { label: 'Рекорд движения', value: '45.16 км (мировой рекорд для внеземных аппаратов)' },
      { label: 'Главный минерал', value: 'Гематит (оксид железа, сформированный в воде)' },
      { label: 'Конец миссии', value: 'Глобальная песчаная буря 2018 года закрыла солнечные панели' }
    ],
    kidFriendlyChallengeRu: 'Представь: машинка на пульте управления с батарейкой на 3 месяца проработала почти 15 ЛЕТ!'
  },
  {
    id: 'chryse-planitia',
    nameRu: 'Равнина Хриса (Chryse Planitia - Viking 1)',
    nameEn: 'Chryse Planitia (Viking 1)',
    category: 'plain',
    badge: '📸 Первое цветное фото с Марса (1976)',
    lat: 22.27,
    lon: -47.95,
    elevationKm: -3.8,
    diameterKm: 1600,
    missionName: 'NASA Viking 1',
    missionYear: 1976,
    highlightFactRu: '20 июля 1976 г. аппарат Viking 1 совершил первую в истории успешную посадку США на Марс!',
    highlightFactEn: 'First successful landing by NASA Viking 1 in 1976, transmitting the first color Mars panoramas.',
    shortDescRu: 'Низменная круглая равнина, куда в древности с рёвом впадали гигантские паводковые каналы с плато Фарсида.',
    shortDescEn: 'A smooth lowland plain shaped by ancient catastrophic flash floods flowing down into a northern ocean basin.',
    detailedTextRu: 'Viking 1 передал человечеству первое фото с поверхности Марса: каменистая равнина ржавого цвета и розово-лососевое небо. Аппарат взял образцы почвы автоматической рукой-ковшом и провёл первые биологические тесты на поиск марсианских микробов.',
    detailedTextEn: 'Viking 1 gave humanity its first intimate view of Mars with crisp rocks, red soil, and a salmon-colored atmosphere.',
    nasaDataRu: [
      { label: 'Дата посадки', value: '20 июля 1976 г.' },
      { label: 'Длительность связи', value: '2 245 солов (более 6 лет)' },
      { label: 'Эксперименты', value: 'Газовый хроматограф, метеостанция, поиск метаболизма' },
      { label: 'Температура за бортом', value: 'От -86°C ночью до -14°C днём' }
    ],
    kidFriendlyChallengeRu: 'Благодаря Viking 1 люди впервые узнали, какого цвета марсианское небо — не синее, а рыжевато-розовое!'
  },
  {
    id: 'ares-vallis',
    nameRu: 'Долина Арес (Ares Vallis - Pathfinder & Sojourner)',
    nameEn: 'Ares Vallis (Sojourner)',
    category: 'rover',
    badge: '🚗 Первый колёсный ровер (1997)',
    lat: 19.33,
    lon: -33.55,
    elevationKm: -3.6,
    diameterKm: 1700,
    missionName: 'Mars Pathfinder',
    missionYear: 1997,
    highlightFactRu: 'Марсоход Sojourner был размером с микроволновку (10.5 кг) и открыл эру подвижных марсоходов!',
    highlightFactEn: 'Sojourner was tiny (10.5 kg) like a toy microwave, yet proved robotic rovers can explore other worlds.',
    shortDescRu: 'Древнее русло катастрофического наводнения. Здесь ровер приземлился на надувных подушках безопасности!',
    shortDescEn: 'Ancient megaflood outflow channel where Pathfinder bounced down cushioned by giant airbags in 1997.',
    detailedTextRu: '4 июля 1997 года (в День независимости США) станция Pathfinder коснулась Марса, завернувшись в гигантские воздушные подушки, отскочила 15 раз и раскрылась, как лепестки цветка. Маленький ровер Sojourner съехал по пандусу и изучил камни «Барнакл Билл» и «Йоги».',
    detailedTextEn: 'Landed using innovative giant airbags, deploying tiny Sojourner which analyzed boulders like Barnacle Bill.',
    nasaDataRu: [
      { label: 'Вес ровера Sojourner', value: 'Всего 10.5 кг!' },
      { label: 'Скорость', value: '1 см в секунду (очень осторожно)' },
      { label: 'Связь', value: 'Свыше 17 000 фото и миллионы посещений сайта NASA' },
      { label: 'Значение', value: 'Доказал надёжность шасси Rocker-Bogie для будущих роверов' }
    ],
    kidFriendlyChallengeRu: 'Его колеса были всего 13 см в диаметре, но они проложили дорогу для гигантов Curiosity и Perseverance!'
  },
  {
    id: 'elysium-planitia',
    nameRu: 'Равнина Элизий (Elysium Planitia - InSight)',
    nameEn: 'Elysium Planitia (InSight)',
    category: 'crater',
    badge: '🩺 Марсианский стетоскоп InSight',
    lat: 4.5,
    lon: 135.6,
    elevationKm: -2.6,
    diameterKm: 3000,
    missionName: 'NASA InSight',
    missionYear: 2018,
    highlightFactRu: 'Аппарат InSight впервые измерил размер жидкого металлического ядра Марса и записал 1300+ марсотрясений!',
    highlightFactEn: 'InSight measured the core, crust, and mantle of Mars, detecting over 1,300 marsquakes.',
    shortDescRu: 'Плоская вулканическая равнина. Робот InSight установил на грунт сверхчувствительный сейсмометр под вакуумным куполом.',
    shortDescEn: 'Flat volcanic plain where InSight deployed a seismometer to listen to vibrations deep within Mars.',
    detailedTextRu: 'Марс оказался сейсмически живой планетой! InSight зарегистрировал подземные толчки от разломов коры и ударов метеоритов. Сейсмические волны помогли ученым выяснить толщину марсианской коры (от 24 до 72 км) и то, что ядро Марса наполовину состоит из расплавленного железа и серы.',
    detailedTextEn: 'Marsquakes revealed that Mars has a liquid metallic core with an approximate radius of 1,830 kilometers.',
    nasaDataRu: [
      { label: 'Зафиксировано марсотрясений', value: '1 319 толчков (до 4.7 баллов)' },
      { label: 'Радиус жидкого ядра', value: 'Около 1 830 км' },
      { label: 'Прибор HP3 ("Крот")', value: 'Попытка зарыться на 5 метров для измерения тепла недр' },
      { label: 'Миссия завершена', value: 'Декабрь 2022 года' }
    ],
    kidFriendlyChallengeRu: 'InSight слушал пульс Марса, словно доктор слушает сердце человека стетоскопом!'
  },
  {
    id: 'hellas-planitia',
    nameRu: 'Равнина Эллада (Hellas Planitia)',
    nameEn: 'Hellas Impact Basin',
    category: 'crater',
    badge: '☄️ Глубочайшая впадина Марса',
    lat: -42.7,
    lon: 70.0,
    elevationKm: -7.15,
    diameterKm: 2300,
    highlightFactRu: 'Самый глубокий ударный кратер на Марсе (глубина более 7 км от края)!',
    highlightFactEn: 'One of the largest preserved impact basins in the Solar System, over 7 km deep.',
    shortDescRu: 'След от удара колоссального астероида 4 миллиарда лет назад. Атмосферное давление здесь почти вдвое выше, чем в среднем по Марсу.',
    shortDescEn: 'A gigantic scar from an asteroid collision. The dense air at the bottom occasionally allows liquid water to momentarily exist.',
    detailedTextRu: 'Из-за колоссальной глубины впадины воздух у её дна сжимается сильнее. Давление там достигает 1.15 кПа (по сравнению с 0.6 кПа на равнинах). При таких условиях чистая вода могла бы существовать в жидком виде при плюсовой температуре, не закипая мгновенно!',
    detailedTextEn: 'The atmospheric pressure at the basin floor is significantly higher, sometimes exceeding the triple point of water.',
    nasaDataRu: [
      { label: 'Диаметр впадины', value: '2 300 км (один из крупнейших в Солнечной системе)' },
      { label: 'Глубина', value: '7.15 км ниже нулевого уровня высот' },
      { label: 'Особенность погоды', value: 'Родина масштабных региональных пылевых бурь' },
      { label: 'След астероида', value: 'Астероид размером около 100 км врезался 4.1 млрд лет назад' }
    ],
    kidFriendlyChallengeRu: 'Если налить в Элладу всю воду Каспийского и Аральского морей, на дне образовалось бы глубокое море!'
  }
];

export const MARS_POIS: MarsPOI[] = RAW_MARS_POIS.map(p => ({
  ...p,
  planet: 'mars',
  photos: MARS_POI_PHOTOS[p.id] || [],
}));

export const MARS_FACTS_SUMMARY = {
  diameterKm: 6779,
  earthDiameterRatio: 0.53,
  massRatioEarth: 0.11,
  gravityRatio: 0.38, // 38%
  dayLength: '24 ч 37 мин 22 сек (1 Сол)',
  yearLengthDays: '687 земных суток',
  temperatureRange: 'от -140°C до +20°C (в среднем -63°C)',
  atmosphereComposition: '95.3% Углекислый газ, 2.6% Азот, 1.9% Аргон, 0.13% Кислород',
  moons: ['Фобос (Страх)', 'Деймос (Ужас)'],
  distanceFromSunMillionKm: 228
};

export const ROVER_COMPONENTS: RoverComponent[] = [
  {
    id: 'mastcam-z',
    nameRu: 'Камеры Mastcam-Z & SuperCam',
    nameEn: 'Mastcam-Z & SuperCam Laser',
    iconName: 'Camera',
    roleRu: '«Глаза и лазерный прицел» марсохода',
    kidExplanationRu: 'Две зум-камеры на высокой мачте видят мир в 3D и цвете, как человек. А лазер SuperCam стреляет по камням лучом, испаряя кусочек скалы для химического анализа!',
    nasaDetailsRu: 'Сенсоры делают панорамы в 4K разрешении и способны заметить муху на расстоянии футбольного поля.',
    specMetric: 'Зум: 3:1, Лазер: 1064 нм'
  },
  {
    id: 'rocker-bogie',
    nameRu: 'Подвеска Rocker-Bogie & 6 колёс',
    nameEn: 'Rocker-Bogie 6-Wheel Suspension',
    iconName: 'Compass',
    roleRu: 'Вездеходная подвеска без пружин',
    kidExplanationRu: 'Особая система качалок соединяет 6 алюминиевых колёс так, что ровер может переезжать камни выше диаметра колеса и никогда не переворачивается!',
    nasaDetailsRu: 'Каждое колесо имеет свой отдельный электромотор. Рисунок протектора оставляет на марсианском грунте метки для измерения пройденной дистанции.',
    specMetric: 'Макс. скорость: 4.2 см/сек'
  },
  {
    id: 'robotic-arm',
    nameRu: 'Роботизированная рука с буром',
    nameEn: 'Robotic Arm & Coring Drill',
    iconName: 'Wrench',
    roleRu: 'Бурение и сбор ценных проб грунта',
    kidExplanationRu: '2-метровая рука весом 45 кг с буром на конце высверливает керны марсианских камней толщиной с мелок и упаковывает их в стерильные титановые трубки!',
    nasaDetailsRu: 'Содержит датчики SHERLOC и PIXL для микроскопического ультрафиолетового сканирования кристаллов в поисках органики.',
    specMetric: 'Длина руки: 2.1 м, 5 степеней свободы'
  },
  {
    id: 'moxie',
    nameRu: 'Генератор кислорода MOXIE',
    nameEn: 'MOXIE Oxygen Generator',
    iconName: 'Wind',
    roleRu: '«Искусственное дерево» на Марсе',
    kidExplanationRu: 'Эксперимент NASA забирает из марсианского воздуха ядовитый углекислый газ (CO2) и с помощью температуры 800°C расщепляет его на чистый кислород (O2)!',
    nasaDetailsRu: 'Успешно произвел кислород 16 раз (более 122 граммов), показав, что будущие космонавты смогут дышать на Марсе и заправлять ракеты.',
    specMetric: 'Производительность: до 12 г О2 в час'
  },
  {
    id: 'ingenuity',
    nameRu: 'Вертолёт Ingenuity',
    nameEn: 'Ingenuity Mars Helicopter',
    iconName: 'Plane',
    roleRu: 'Первый летательный аппарат на другой планете',
    kidExplanationRu: 'Маленький дрон весом всего 1.8 кг с двумя винтами из углепластика, вращающимися со скоростью 2400 оборотов в минуту — в 5 раз быстрее земных вертолётов!',
    nasaDetailsRu: 'Долетел с Perseverance на днище марсохода. Вместо 5 тестовых полетов совершил 72 полета, пролетел 17 км и служил воздушным разведчиком.',
    specMetric: 'Вес: 1.8 кг, Винты: 1.2 м'
  },
  {
    id: 'mmrtg',
    nameRu: 'Ядерный генератор РИТЭГ (MMRTG)',
    nameEn: 'Radioisotope Thermoelectric Generator',
    iconName: 'Zap',
    roleRu: 'Вечная батарея марсохода',
    kidExplanationRu: 'В отличие от старых роверов с солнечными батареями, Perseverance работает на тепле распада плутония. Ему не страшны марсианские пыльные бури и полярные ночи!',
    nasaDetailsRu: 'Вырабатывает около 110 Вт непрерывного электричества и тепло, которое согревает электронику ровера марсианскими ночами при -90°C.',
    specMetric: 'Срок службы: 14+ лет, Топливо: Плутоний-238'
  }
];

export const MARS_TIMELINE: TimelineMilestone[] = [
  {
    year: 1965,
    name: 'Mariner 4 (NASA)',
    agency: 'NASA (США)',
    type: 'flyby',
    titleRu: 'Первый успешный пролёт у Марса',
    descriptionRu: 'Аппарат передал первые 21 черно-белых снимка кратеров с близкого расстояния, развеяв мифы о каналах марсиан.',
    scientificBreakthroughRu: 'Доказано: атмосфера Марса очень разреженная (меньше 1% от земной), а планета сухая и холодная.',
    status: 'completed'
  },
  {
    year: 1971,
    name: 'Mariner 9 (NASA)',
    agency: 'NASA (США)',
    type: 'orbiter',
    titleRu: 'Первый искусственный спутник Марса',
    descriptionRu: 'Вышел на орбиту во время глобальной пыльной бури. Сфотографировал вулканы Олимп и колоссальный каньон Долины Маринер.',
    scientificBreakthroughRu: 'Открыты гигантские вулканы, русла древних высохших рек и ледяные полярные шапки.',
    status: 'completed'
  },
  {
    year: 1976,
    name: 'Viking 1 & Viking 2 (NASA)',
    agency: 'NASA (США)',
    type: 'lander',
    titleRu: 'Первая долгоживущая станция на грунте',
    descriptionRu: 'Спускаемые аппараты сели на равнинах Хриса и Утопия. Передали первые цветные панорамы и провели анализы грунта.',
    scientificBreakthroughRu: 'Первые прямые метеорологические наблюдения и химический анализ марсианского песка.',
    status: 'completed'
  },
  {
    year: 1997,
    name: 'Mars Pathfinder & Sojourner',
    agency: 'NASA (США)',
    type: 'rover',
    titleRu: 'Первый подвижный марсоход в истории',
    descriptionRu: 'Посадка на надувных подушках в долине Арес. Маленький ровер Sojourner покорил мир, катаясь вокруг посадочного модуля.',
    scientificBreakthroughRu: 'Доказана возможность мобильной колесной разведки на другой планете.',
    status: 'completed'
  },
  {
    year: 2004,
    name: 'Spirit & Opportunity (NASA MER)',
    agency: 'NASA (США)',
    type: 'rover',
    titleRu: 'Марсоходы-близнецы и поиск древней воды',
    descriptionRu: 'Spirit исследовал кратер Гусев, а Opportunity — плато Меридиана. Оппи проработал рекордные 14 лет и 138 дней.',
    scientificBreakthroughRu: 'Найдена «марсианская черника» — прямое подтверждение озер и грунтовых вод в прошлом.',
    status: 'completed'
  },
  {
    year: 2006,
    name: 'Mars Reconnaissance Orbiter (MRO)',
    agency: 'NASA (США)',
    type: 'orbiter',
    titleRu: 'Орбитальный телескоп-суперглаз HiRISE',
    descriptionRu: 'Мощнейшая камера HiRISE видит детали на поверхности Марса размером с обеденный стол (30 см на пиксель)!',
    scientificBreakthroughRu: 'Открыты активные песчаные дюны, оползни, подземные ледники и выбраны места посадок всех новых роверов.',
    status: 'active'
  },
  {
    year: 2012,
    name: 'Curiosity (MSL - NASA)',
    agency: 'NASA (США)',
    type: 'rover',
    titleRu: 'Химическая лаборатория в кратере Гейл',
    descriptionRu: 'Марсоход весом 900 кг опустился на систему ракетных тросов «Sky Crane». Исследует слои горы Шарп.',
    scientificBreakthroughRu: 'Доказано: древний Марс обладал всеми химическими условиями для поддержания микробной жизни.',
    status: 'active'
  },
  {
    year: 2018,
    name: 'InSight (NASA)',
    agency: 'NASA (США)',
    type: 'lander',
    titleRu: 'Геофизик внутренней структуры Марса',
    descriptionRu: 'Установил сверхчувствительный французский сейсмометр SEIS на грунт равнины Элизий.',
    scientificBreakthroughRu: 'Впервые зарегистрировано 1300+ марсотрясений и определена толщина коры и размер жидкого ядра.',
    status: 'completed'
  },
  {
    year: 2021,
    name: 'Perseverance & Ingenuity (Mars 2020)',
    agency: 'NASA (США)',
    type: 'helicopter',
    titleRu: 'Поиск биосигнатур и первый полёт вертолёта',
    descriptionRu: 'Приземление в кратере Езеро. Сбор запечатанных капсул с грунтом, генерация кислорода MOXIE и 72 полёта дрона.',
    scientificBreakthroughRu: 'Первый управляемый полёт аппарата с винтами в атмосфере другой планеты!',
    status: 'active'
  },
  {
    year: 2030,
    name: 'Mars Sample Return (NASA / ESA)',
    agency: 'NASA / ESA',
    type: 'future',
    titleRu: 'Доставка образцов грунта на Землю',
    descriptionRu: 'Роботизированная миссия заберет запечатанные пробирки Perseverance и впервые в истории запустит ракету с Марса к Земле.',
    scientificBreakthroughRu: 'Ученые в земных лабораториях смогут исследовать марсианский грунт на мощнейших микроскопах.',
    status: 'planned'
  }
];

export const MARS_QUIZZES: QuizQuestion[] = [
  {
    id: 1,
    questionRu: 'Какого цвета марсианское небо днём и на закате?',
    questionEn: 'What color is the Martian sky during the day and at sunset?',
    optionsRu: [
      'Синее днём, красное на закате (как на Земле)',
      'Рыжевато-розовое днём, голубое/синее на закате',
      'Полностью черное круглые сутки',
      'Зеленое из-за углекислого газа'
    ],
    optionsEn: [
      'Blue by day, red at sunset (like Earth)',
      'Salmon-butterscotch by day, blue/cyan at sunset',
      'Pitch black day and night',
      'Green due to CO2'
    ],
    correctIndex: 1,
    explanationRu: 'На Марсе всё наоборот! Мелкая пыль оксида железа в воздухе рассеивает красноватый свет днём, а на закате прямые солнечные лучи пробиваются через пыль, создавая потрясающий голубой ореол вокруг Солнца.',
    explanationEn: 'Dust particles scatter reddish light during the day, while allowing shorter blue wavelengths to penetrate near sunset.',
    funFactRu: 'Закаты на Марсе запечатлели роверы Spirit, Curiosity и Perseverance — Солнце кажется на треть меньше, чем с Земли!'
  },
  {
    id: 2,
    questionRu: 'Сколько продлится марсианский день (называемый «Сол»)?',
    questionEn: 'How long is a solar day on Mars (called a "Sol")?',
    optionsRu: [
      'Ровно 12 часов',
      '24 часа 39 минут и 35 секунд',
      '48 часов',
      'Около 30 земных дней'
    ],
    optionsEn: [
      'Exactly 12 hours',
      '24 hours 39 minutes and 35 seconds',
      '48 hours',
      'About 30 Earth days'
    ],
    correctIndex: 1,
    explanationRu: 'Марсианские сутки удивительно близки к земным — они длятся всего на 39 минут и 35 секунд дольше наших!',
    explanationEn: 'A Martian day (Sol) is only ~40 minutes longer than a standard day on Earth.',
    funFactRu: 'Инженеры NASA, управляющие марсоходами, носят специальные часы, идущие на 2.7% медленнее, чтобы жить по марсианскому времени!'
  },
  {
    id: 3,
    questionRu: 'Если на Земле ты весишь 40 кг, сколько ты будешь весить на Марсе?',
    questionEn: 'If you weigh 40 kg on Earth, what would you weigh on Mars?',
    optionsRu: [
      'Около 15 кг (гравитация Марса 38% от земной)',
      '40 кг (столько же)',
      '80 кг (в два раза тяжелее)',
      '0 кг (полная невесомость)'
    ],
    optionsEn: [
      'About 15 kg (gravity is 38% of Earth)',
      '40 kg (identical)',
      '80 kg (double)',
      '0 kg (floating)'
    ],
    correctIndex: 0,
    explanationRu: 'Гравитация на Марсе составляет всего 38% от земной (g ≈ 3.72 м/с² против 9.8 м/с² на Земле). Ты почувствуешь себя супергероем: сможешь подпрыгнуть почти в 2.6 раза выше!',
    explanationEn: 'Mars has lower mass and surface gravity (3.72 m/s²), making you feel 62% lighter than on Earth.',
    funFactRu: 'На Марсе человек в скафандре весом 100 кг ощутит его как легкий рюкзак весом всего 38 кг!'
  },
  {
    id: 4,
    questionRu: 'Почему вулкан Олимп (Olympus Mons) смог вырасти до высоты 22 км?',
    questionEn: 'Why did Olympus Mons grow to an enormous height of 22 km?',
    optionsRu: [
      'На Марсе нет тектонических плит, поэтому лава извергалась в одно место миллиарды лет',
      'Его построили марсиане из красного кирпича',
      'Из-за сильного марсианского ветра, сдувавшего песок в одну кучу',
      'Это не вулкан, а след от падения огромной кометы'
    ],
    optionsEn: [
      'Mars lacks plate tectonics, so magma erupted in the exact same spot for billions of years',
      'Martians built it',
      'Martian wind blew all sand together',
      'It is a comet impact'
    ],
    correctIndex: 0,
    explanationRu: 'На Земле тектонические плиты двигаются над очагом магмы, образуя цепочки островов (как на Гавайях). На Марсе кора неподвижна, поэтому гигантский вулкан рос в одной точке!',
    explanationEn: 'Without plate tectonics to slide the crust, stationary hot spots poured lava over the same spot over eons.',
    funFactRu: 'Вулкан Олимп настолько пологий, что средний уклон его склонов составляет всего около 5 градусов.'
  },
  {
    id: 5,
    questionRu: 'Как называется первый в истории вертолёт, поднявшийся в воздух на другой планете?',
    questionEn: 'What is the name of the first helicopter to fly on another planet?',
    optionsRu: [
      'Sputnik',
      'Ingenuity («Изобретательность»)',
      'Apollo 11',
      'Voyager'
    ],
    optionsEn: [
      'Sputnik',
      'Ingenuity',
      'Apollo 11',
      'Voyager'
    ],
    correctIndex: 1,
    explanationRu: 'Вертолёт Ingenuity прилетел на Марс с ровером Perseverance в 2021 году. Он совершил 72 полёта вместо 5 запланированных!',
    explanationEn: 'NASA Ingenuity flew 72 missions over nearly 3 years, proving powered aerodynamic flight is possible on Mars.',
    funFactRu: 'Под солнечной панелью Ingenuity прикреплен крошечный кусочек ткани от крыла самолёта братьев Райт 1903 года!'
  },
  {
    id: 6,
    questionRu: 'Из чего в основном состоит тонкая атмосфера Марса?',
    questionEn: 'What is the primary gas making up Mars atmosphere?',
    optionsRu: [
      'Кислород (как воздух в лесу)',
      'Углекислый газ (CO2) — более 95%',
      'Чистый водород и гелий',
      'Водяной пар'
    ],
    optionsEn: [
      'Oxygen',
      'Carbon dioxide (CO2) - over 95%',
      'Hydrogen and Helium',
      'Water vapor'
    ],
    correctIndex: 1,
    explanationRu: 'Атмосфера Марса на 95.3% состоит из углекислого газа. Дышать им человек не может, поэтому прибор MOXIE на марсоходе Perseverance учится превращать CO2 в кислород O2!',
    explanationEn: 'Atmosphere is 95% CO2 with trace nitrogen and argon, with surface pressure under 1% of Earth sea level.',
    funFactRu: 'Зимой на полюсах Марса настолько холодно (-125°C), что сам углекислый газ замерзает и падает в виде сухого льда!'
  },
  {
    id: 7,
    questionRu: 'Сколько естественных спутников (лун) вращается вокруг Марса?',
    questionEn: 'How many natural moons orbit planet Mars?',
    optionsRu: [
      'Ноль, Марс одинок',
      'Две: Фобос и Деймос',
      'Одна, как у Земли',
      'Более 70, как у Юпитера'
    ],
    optionsEn: [
      'Zero',
      'Two: Phobos and Deimos',
      'One like Earth',
      'Over 70 like Jupiter'
    ],
    correctIndex: 1,
    explanationRu: 'У Марса две крошечные луны: Фобос («Страх») и Деймос («Ужас»). Они похожи на неровные картофелины и, скорее всего, являются захваченными гравитацией астероидами.',
    explanationEn: 'Phobos and Deimos are small irregular potato-shaped moons, likely captured asteroids from the Main Asteroid Belt.',
    funFactRu: 'Фобос обращается вокруг Марса за 7 часов 39 минут — он восходит на западе и заходит на востоке дважды в сутки!'
  },
  {
    id: 8,
    questionRu: 'Что за минеральные шарики нашел марсоход Opportunity, подтвердившие древнюю воду?',
    questionEn: 'What mineral spheres did Opportunity find confirming ancient liquid water?',
    optionsRu: [
      '«Марсианскую чернику» (гематитовые сферы)',
      'Стеклянные алмазы',
      'Золотые самородки',
      'Окаменевшие кости динозавров'
    ],
    optionsEn: [
      '"Martian blueberries" (hematite spherules)',
      'Diamonds',
      'Gold nuggets',
      'Dinosaur bones'
    ],
    correctIndex: 0,
    explanationRu: 'Opportunity обнаружил миллиарды миллиметровых шариков минерала гематита, прозванных "черникой". На Земле гематит в такой форме вырастает только в стоячей минеральной воде!',
    explanationEn: 'Hematite spherules precipitate out of mineral-saturated groundwater, providing direct evidence of prolonged wet conditions.',
    funFactRu: 'Один из кратеров, изученных Opportunity, был назван «Endurance» в честь знаменитого исследовательского корабля!'
  }
];
