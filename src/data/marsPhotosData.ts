import { NASAImage } from '../types/planetary';

export interface GeologicalSample {
  mineralRu: string;
  formula: string;
  percentage: number;
  significanceRu: string;
}

export const MARS_POI_PHOTOS: Record<string, NASAImage[]> = {
  'olympus-mons': [
    {
      id: 'om-1',
      titleRu: 'Орбитальная панорама кальдеры Олимпа (HiRISE)',
      titleEn: 'HiRISE High-Resolution Caldera Rim of Olympus Mons',
      descriptionRu: 'Снимок с борта спутника MRO с высоты 280 км. Видны обрывистые скальные уступы кальдеры глубиной 3 км.',
      camera: 'HiRISE (High Resolution Imaging Science Experiment)',
      mission: 'Mars Reconnaissance Orbiter (NASA)',
      year: 2021,
      imageUrl: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=1200&q=80',
      credit: 'NASA / JPL-Caltech / University of Arizona',
      tags: ['HiRISE', 'Caldera', 'Volcano', 'High-Res']
    },
    {
      id: 'om-2',
      titleRu: 'Застывшие базальтовые лавовые потоки',
      titleEn: 'Solidified Basaltic Lava Channels',
      descriptionRu: 'Многокилометровые каналы лавы, застывшие сотни миллионов лет назад на пологом склоне Олимпа.',
      camera: 'HRSC (High Resolution Stereo Camera)',
      mission: 'Mars Express (ESA)',
      year: 2019,
      imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
      credit: 'ESA / DLR / FU Berlin',
      tags: ['Basalt', 'Lava', 'Geology']
    }
  ],
  'valles-marineris': [
    {
      id: 'vm-1',
      titleRu: 'Слоистые уступы каньона Melas Chasma',
      titleEn: 'Sedimentary Layering in Melas Chasma Canyon Wall',
      descriptionRu: 'Отвесные стены каньона глубиной 7 км. Светлые полосы — слои сульфатных солей, образовавшиеся в присутствии древней воды.',
      camera: 'Mars Express HRSC Perspective View',
      mission: 'Mars Express (ESA)',
      year: 2020,
      imageUrl: 'https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=1200&q=80',
      credit: 'ESA / NASA / JPL',
      tags: ['Canyon', 'Stratigraphy', 'Melas Chasma']
    },
    {
      id: 'vm-2',
      titleRu: 'Утренний туман из водяного льда на дне каньона',
      titleEn: 'Morning Water Ice Haze in Valles Marineris',
      descriptionRu: 'В предрассветные часы на дне каньона температура падает, и редкий марсианский пар конденсируется в белый туман.',
      camera: 'Compact Reconnaissance Imaging Spectrometer (CRISM)',
      mission: 'MRO (NASA)',
      year: 2018,
      imageUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1200&q=80',
      credit: 'NASA / JPL-Caltech / JHUAPL',
      tags: ['Water Ice', 'Atmosphere', 'Clouds']
    }
  ],
  'jezero-crater': [
    {
      id: 'jez-1',
      titleRu: 'Панорама древней дельты реки (Mastcam-Z)',
      titleEn: 'Perseverance Mastcam-Z Ancient River Delta Panorama',
      descriptionRu: 'Высокодетализированный 360-градусный снимок с марсохода Perseverance. Перед нами веер речных отложений, где бушевала река 3.7 млрд лет назад.',
      camera: 'Mastcam-Z Dual Zoom System',
      mission: 'NASA Mars 2020 (Perseverance)',
      year: 2022,
      imageUrl: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=1200&q=80',
      credit: 'NASA / JPL-Caltech / ASU / MSSS',
      tags: ['Perseverance', 'Delta', 'Mastcam-Z', 'True Color']
    },
    {
      id: 'jez-2',
      titleRu: 'Капсула с первым керном марсианской породы',
      titleEn: 'Sample Tube with Martian Core Sample on Surface',
      descriptionRu: 'Герметичная титановая трубка с высверленным образцом породы «Montdenier», оставленная на складе образцов «Three Forks» для возврата на Землю.',
      camera: 'WATSON (Sherloc sub-system)',
      mission: 'Perseverance Rover',
      year: 2023,
      imageUrl: 'https://images.unsplash.com/photo-1517976487507-5b3df11d991e?auto=format&fit=crop&w=1200&q=80',
      credit: 'NASA / JPL-Caltech / MSSS',
      tags: ['Sample Return', 'Rock Core', 'WATSON']
    },
    {
      id: 'jez-3',
      titleRu: 'Вертолёт Ingenuity перед рекордным 50-м полётом',
      titleEn: 'Ingenuity Mars Helicopter resting on Jezero Airfield',
      descriptionRu: 'Первый в истории летательный аппарат с винтами в атмосфере другой планеты. Совершил 72 полёта вместо 5 запланированных!',
      camera: 'SuperCam Remote Micro-Imager (RMI)',
      mission: 'Perseverance / Ingenuity',
      year: 2023,
      imageUrl: 'https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=1200&q=80',
      credit: 'NASA / JPL-Caltech / LANL / CNES',
      tags: ['Ingenuity', 'Helicopter', 'Aviation']
    }
  ],
  'gale-crater': [
    {
      id: 'gale-1',
      titleRu: 'Селфи марсохода Curiosity у хребта Vera Rubin',
      titleEn: 'Curiosity Rover Selfie at Vera Rubin Ridge',
      descriptionRu: 'Составное селфи марсохода Curiosity из 61 отдельного кадра камеры MAHLI на фоне 5-километровой горы Шарп.',
      camera: 'Mars Hand Lens Imager (MAHLI)',
      mission: 'Mars Science Laboratory (NASA)',
      year: 2018,
      imageUrl: 'https://images.unsplash.com/photo-1517976487507-5b3df11d991e?auto=format&fit=crop&w=1200&q=80',
      credit: 'NASA / JPL-Caltech / MSSS',
      tags: ['Curiosity', 'Selfie', 'Gale Crater', 'MAHLI']
    },
    {
      id: 'gale-2',
      titleRu: 'Слои озерного ила (глинистые алевролиты)',
      titleEn: 'Lacustrine Mudstone Sediments at Yellowknife Bay',
      descriptionRu: 'Каменные плиты на дне древнего пресного озера. Анализ показал наличие углерода, водорода, кислорода, фосфора и серы — строительных блоков жизни.',
      camera: 'Mastcam 100mm Focal Length',
      mission: 'Curiosity Rover',
      year: 2013,
      imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
      credit: 'NASA / JPL-Caltech / MSSS',
      tags: ['Lake Deposits', 'Biosignatures', 'Curiosity']
    }
  ],
  'north-pole': [
    {
      id: 'pole-1',
      titleRu: 'Спиральные каньоны ледяной шапки Planum Boreum',
      titleEn: 'Spiral Troughs of North Polar Cap (HiRISE)',
      descriptionRu: 'Орбитальный вид слоистого ледника из водяного льда и замерзшего углекислого газа толщиной до 3 километров.',
      camera: 'HiRISE',
      mission: 'Mars Reconnaissance Orbiter (NASA)',
      year: 2020,
      imageUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1200&q=80',
      credit: 'NASA / JPL / University of Arizona',
      tags: ['North Pole', 'Water Ice', 'Chasma Boreale']
    },
    {
      id: 'pole-2',
      titleRu: 'Гейзеры сухого льда весной на полярных дюнах',
      titleEn: 'Carbon Dioxide Geyser Eruptions on Polar Dunes',
      descriptionRu: 'Весеннее солнце прогревает грунт сквозь полупрозрачный лед CO2, вызывая взрывной выброс газа с темным песком на поверхность.',
      camera: 'Context Camera (CTX)',
      mission: 'MRO (NASA)',
      year: 2019,
      imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
      credit: 'NASA / JPL / MSSS',
      tags: ['Geysers', 'Dunes', 'Dry Ice']
    }
  ],
  'meridiani-planum': [
    {
      id: 'merid-1',
      titleRu: 'Марсианская «Черника» — гематитовые сферы',
      titleEn: 'Martian "Blueberries" - Hematite Spherules',
      descriptionRu: 'Микроскопический снимок марсохода Opportunity. Минеральные шарики гематита размером 3-5 мм, растущие только в жидкой минеральной воде.',
      camera: 'Microscopic Imager (MI)',
      mission: 'Mars Exploration Rover (Opportunity)',
      year: 2004,
      imageUrl: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=1200&q=80',
      credit: 'NASA / JPL-Caltech / Cornell / USGS',
      tags: ['Hematite', 'Blueberries', 'Opportunity', 'Water Proof']
    }
  ],
  'chryse-planitia': [
    {
      id: 'chryse-1',
      titleRu: 'Исторический первый снимок поверхности Марса (1976)',
      titleEn: 'First Historical Color Photograph from Mars Surface (1976)',
      descriptionRu: 'Первая цветная фотография марсианского грунта, переданная аппаратом Viking 1 20 июля 1976 года. Человечество впервые увидело красный реголит.',
      camera: 'Viking Lander Facsimile Camera',
      mission: 'NASA Viking 1',
      year: 1976,
      imageUrl: 'https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=1200&q=80',
      credit: 'NASA Langley Research Center',
      tags: ['Viking 1', 'History', 'First Photo']
    }
  ],
  'ares-vallis': [
    {
      id: 'ares-1',
      titleRu: 'Марсоход Sojourner у валуна «Йоги» (1997)',
      titleEn: 'Sojourner Rover inspecting "Yogi" Rock in Ares Vallis',
      descriptionRu: 'Первый колесный микро-марсоход Sojourner размером с микроволновку анализирует состав валуна с помощью альфа-протон-рентгеновского спектрометра.',
      camera: 'IMP (Imager for Mars Pathfinder)',
      mission: 'Mars Pathfinder',
      year: 1997,
      imageUrl: 'https://images.unsplash.com/photo-1517976487507-5b3df11d991e?auto=format&fit=crop&w=1200&q=80',
      credit: 'NASA / JPL',
      tags: ['Pathfinder', 'Sojourner', 'Historic']
    }
  ],
  'elysium-planitia': [
    {
      id: 'elys-1',
      titleRu: 'Сейсмометр SEIS аппарата InSight на марсианском грунте',
      titleEn: 'InSight SEIS Seismometer on Elysium Dust Surface',
      descriptionRu: 'Французский сейсмометр SEIS под защитным куполом от ветра зафиксировал более 1300 марсотрясений, измерив толщину коры Марса.',
      camera: 'Instrument Deployment Camera (IDC)',
      mission: 'NASA InSight Lander',
      year: 2019,
      imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
      credit: 'NASA / JPL-Caltech / CNES',
      tags: ['InSight', 'Seismology', 'Marsquake']
    }
  ],
  'hellas-planitia': [
    {
      id: 'hellas-1',
      titleRu: 'Орбитальный вид гигантского ударного бассейна Эллада',
      titleEn: 'Orbital View of Hellas Impact Basin (Thermal IR)',
      descriptionRu: 'Крупнейший сохранившийся ударный кратер Марса диаметром 2300 км. Из-за глубины 8 км здесь самое высокое давление атмосферы (12 мбар).',
      camera: 'THEMIS Visual & Thermal Imaging',
      mission: '2001 Mars Odyssey',
      year: 2017,
      imageUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1200&q=80',
      credit: 'NASA / JPL / Arizona State University',
      tags: ['Hellas', 'Odyssey', 'Basin']
    }
  ]
};

export const MARS_GEOLOGY_SAMPLES: Record<string, GeologicalSample[]> = {
  'olympus-mons': [
    { mineralRu: 'Толеитовый базальт', formula: 'SiO2 (50%) + FeO + MgO', percentage: 72, significanceRu: 'Изверженная лавовая порода горячего мантийного плюма' },
    { mineralRu: 'Плагиоклаз', formula: 'NaAlSi3O8 - CaAl2Si2O8', percentage: 18, significanceRu: 'Полевой шпат вулканического остывания' },
    { mineralRu: 'Магнетит', formula: 'Fe3O4', percentage: 10, significanceRu: 'Придаёт породе сильные магнитные свойства' }
  ],
  'valles-marineris': [
    { mineralRu: 'Кизерит (сульфат магния)', formula: 'MgSO4 · H2O', percentage: 48, significanceRu: 'Свидетельство испарения древних соленых озер' },
    { mineralRu: 'Оливин', formula: '(Mg, Fe)2SiO4', percentage: 32, significanceRu: 'Глубинная мантия Марса, вскрытая разломом коры' },
    { mineralRu: 'Гематит', formula: 'Fe2O3', percentage: 20, significanceRu: 'Окисленный оксид железа (ржавчина)' }
  ],
  'jezero-crater': [
    { mineralRu: 'Смектитовые глины', formula: '(Na,Ca)0.33(Al,Mg)2Si4O10(OH)2', percentage: 55, significanceRu: 'Идеальный минерал-ловушка для консервации микробиологических следов' },
    { mineralRu: 'Карбонаты магния', formula: 'MgCO3', percentage: 28, significanceRu: 'Сформировались в нейтральной пресной озерной воде 3.7 млрд лет назад' },
    { mineralRu: 'Аморфный кремнезем', formula: 'SiO2 · nH2O', percentage: 17, significanceRu: 'На Земле в таких отложениях находят строматолиты' }
  ],
  'gale-crater': [
    { mineralRu: 'Филлосиликаты (монтмориллонит)', formula: 'Al2H2O12Si4', percentage: 42, significanceRu: 'Озерный осадок нейтрального pH' },
    { mineralRu: 'Ярозит (сульфат железа)', formula: 'KFe3(SO4)2(OH)6', percentage: 35, significanceRu: 'Образуется при испарении кислых грунтовых вод' },
    { mineralRu: 'Апатит (фосфат кальция)', formula: 'Ca5(PO4)3(F,Cl,OH)', percentage: 23, significanceRu: 'Фосфор — ключевой элемент для создания ДНК и РНК' }
  ],
  'north-pole': [
    { mineralRu: 'Водяной лед (H2O)', formula: 'H2O (твердый)', percentage: 88, significanceRu: 'Главный стратегический резервуар питьевой воды для будущих колоний' },
    { mineralRu: 'Сухой лед (CO2)', formula: 'CO2 (твердый)', percentage: 8, significanceRu: 'Сезонная снежная шапка, замерзающая при -125°C' },
    { mineralRu: 'Базальтовая пыль', formula: 'Fe-Mg силикаты', percentage: 4, significanceRu: 'Слои пылевых бурь, законсервированные в ледяных слоях' }
  ]
};
