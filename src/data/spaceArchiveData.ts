export interface SpaceArchiveItem {
  id: string;
  category: 'earth' | 'mars' | 'spacecraft' | 'geology';
  titleRu: string;
  titleEn: string;
  subtitleRu: string;
  mission: string;
  camera: string;
  date: string;
  resolution: string;
  descriptionRu: string;
  scientificValueRu: string;
  funKidFactRu: string;
  imageUrl: string;
  credit: string;
  tags: string[];
}

export const SPACE_ARCHIVE_DATA: SpaceArchiveItem[] = [
  // ==========================================
  // CATEGORY 1: EARTH FROM ORBIT
  // ==========================================
  {
    id: 'earth-dushanbe-pamir',
    category: 'earth',
    titleRu: 'Душанбе и Памирский хребет с борта МКС',
    titleEn: 'Dushanbe and the Pamir Mountains from the ISS',
    subtitleRu: 'Вид на Центральную Азию из купола Международной космической станции',
    mission: 'International Space Station (Expedition 65)',
    camera: 'Nikon D5 / 400mm Telephoto Lens',
    date: '14 мая 2021',
    resolution: '4K Ultra HD (35 м/пиксель)',
    descriptionRu: 'Космонавты с борта МКС запечатлели Гиссарскую долину, город Душанбе и снежные шапки Памиро-Алая. С высоты 408 километров виден контраст между плодородной долиной и вздымающимися заснеженными пиками «Крыши мира».',
    scientificValueRu: 'Мониторинг таяния высокогорных ледников Памира, питающих реки Амударью и Пяндж, критически важен для водной безопасности Центральной Азии.',
    funKidFactRu: 'МКС пролетает прямо над Душанбе со скоростью 28 000 км/ч. Станция пересекает всё небо Таджикистана всего за 3 минуты!',
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=85',
    credit: 'NASA Astronaut Photography / ISS Expedition 65',
    tags: ['Earth', 'Central Asia', 'Dushanbe', 'Pamir', 'ISS']
  },
  {
    id: 'earth-earthrise',
    category: 'earth',
    titleRu: '«Восход Земли» над горизонтом Луны (Apollo 8)',
    titleEn: 'Earthrise from Lunar Orbit (Apollo 8)',
    subtitleRu: 'Легендарный снимок, изменивший представление человечества о своем доме',
    mission: 'NASA Apollo 8',
    camera: 'Hasselblad 500EL / 250mm Zeiss Sonnar',
    date: '24 декабря 1968',
    resolution: '70mm Hasselblad Medium Format',
    descriptionRu: 'Астронавт Уильям Андерс сделал этот снимок, когда корабль «Аполлон-8» выходил из-за обратной стороны Луны. Впервые человек увидел всю Землю целиком как хрупкий сияющий голубой оазис посреди ледяного мрака космоса.',
    scientificValueRu: 'Снимок положил начало всемирному экологическому движению и осознанию хрупкости биосферы Земли.',
    funKidFactRu: 'Астронавты летели фотографировать Луну, но самым ценным открытием их полета оказалось открытие красоты самой Земли!',
    imageUrl: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=1600&q=85',
    credit: 'NASA / William Anders (Apollo 8)',
    tags: ['Earth', 'Moon', 'Apollo', 'Historic', 'Earthrise']
  },
  {
    id: 'earth-aurora-australis',
    category: 'earth',
    titleRu: 'Полярное сияние над ночным горизонтом',
    titleEn: 'Aurora Australis glowing above Earth Rim',
    subtitleRu: 'Магнитный щит Земли отражает солнечный ветер',
    mission: 'ISS Cupola Observation Dome',
    camera: 'Nikon D4 Ultra-Low-Light',
    date: '17 сентября 2020',
    resolution: '4928 × 3280 пикселей',
    descriptionRu: 'Изумрудно-зеленое и фиолетовое свечение верхних слоев атмосферы (на высоте 100-300 км), вызванное столкновением заряженных солнечных протонов с атомами кислорода и азота в геомагнитной ловушке.',
    scientificValueRu: 'Демонстрация работы жидкого железного ядра Земли: магнитосфера защищает жизнь от смертоносной солнечной радиации. На Марсе такого глобального сияния нет из-за отсутствия магнитного щита.',
    funKidFactRu: 'Зеленый цвет сияния дает кислород, а фиолетовый и пурпурный — азот!',
    imageUrl: 'https://images.unsplash.com/photo-1517976487507-5b3df11d991e?auto=format&fit=crop&w=1600&q=85',
    credit: 'NASA Earth Observatory / ISS Expedition 63',
    tags: ['Earth', 'Aurora', 'Magnetosphere', 'Night']
  },
  {
    id: 'earth-eye-of-hurricane',
    category: 'earth',
    titleRu: 'Глаз супертайфуна из стратосферы',
    titleEn: 'The Eye of Super Typhoon from Low Earth Orbit',
    subtitleRu: 'Колоссальный атмосферный тепловой вихрь',
    mission: 'ISS Earth Science Camera',
    camera: 'External High Definition Camera Assembly',
    date: '8 октября 2019',
    resolution: '4K Ultra HD',
    descriptionRu: 'Взгляд вертикально вниз в идеально круглое 35-километровое «око» шторма 5-й категории. Внутри глаза царит абсолютный штиль и синее море, в то время как окружающая стена облаков вращается со скоростью 270 км/ч.',
    scientificValueRu: 'Изучение теплообмена между тропическими океанами и тропосферой позволяет улучшать модели прогнозирования штормов.',
    funKidFactRu: 'Энергия, выделяемая одним крупным ураганом за сутки, превышает суммарное энергопотребление всех стран мира за полгода!',
    imageUrl: 'https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=1600&q=85',
    credit: 'NASA / ESA / Alexander Gerst',
    tags: ['Earth', 'Weather', 'Cyclone', 'Atmosphere']
  },
  {
    id: 'earth-blue-marble-dscovr',
    category: 'earth',
    titleRu: '«Голубой мрамор» с расстояния 1.5 миллиона км',
    titleEn: 'DSCOVR EPIC Full Disc Blue Marble',
    subtitleRu: 'Освещенное полушарие Земли из точки Лагранжа L1',
    mission: 'NOAA / NASA DSCOVR Spacecraft',
    camera: 'Earth Polychromatic Imaging Camera (EPIC)',
    date: '21 июня 2022',
    resolution: '2048 × 2048 пикселей',
    descriptionRu: 'Аппарат DSCOVR находится в точке гравитационного равновесия между Землей и Солнцем на расстоянии 1.5 млн км, непрерывно фотографируя всю дневную сторону планеты без единой тени.',
    scientificValueRu: 'Измерение альбедо Земли, уровня озона, высоты аэрозолей и пыли в глобальном масштабе.',
    funKidFactRu: 'С этого расстояния Луна иногда проходит прямо перед диском Земли, и камера EPIC снимает темную обратную сторону Луны на фоне Земли!',
    imageUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1600&q=85',
    credit: 'NASA / NOAA / DSCOVR Team',
    tags: ['Earth', 'Blue Marble', 'Lagrange L1', 'DSCOVR']
  },

  // ==========================================
  // CATEGORY 2: MARS HIGH-RES PANORAMAS & SURFACE
  // ==========================================
  {
    id: 'mars-blue-sunset',
    category: 'mars',
    titleRu: 'Голубой марсианский закат в кратере Гейл',
    titleEn: 'Blue Martian Sunset captured by Curiosity',
    subtitleRu: 'Удивительный оптический феномен марсианской атмосферы',
    mission: 'Mars Science Laboratory (Curiosity Rover)',
    camera: 'Mast Camera (Mastcam) 100mm lens',
    date: '15 апреля 2015',
    resolution: 'True Color Multiframe Composite',
    descriptionRu: 'На Земле небо днем голубое, а закаты красные. На Марсе всё ровно наоборот! Днем марсианское небо желтовато-рыжее из-за окислов железа в пыли, а на закате солнце окружает холодный лазурно-голубой ореол.',
    scientificValueRu: 'Рассеяние света Ми на субмикронных частицах минеральной пыли пропускает голубой спектр света вперед намного эффективнее, чем красный.',
    funKidFactRu: 'Если ты будешь стоять на Марсе вечером, ты увидишь синий ореол заходящего солнца, которое кажется на треть меньше, чем с Земли!',
    imageUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1600&q=85',
    credit: 'NASA / JPL-Caltech / MSSS / Texas A&M',
    tags: ['Mars', 'Sunset', 'Curiosity', 'Atmosphere', 'Optics']
  },
  {
    id: 'mars-jezero-delta-mastcam',
    category: 'mars',
    titleRu: '360° Панорама древней речной дельты в кратере Езеро',
    titleEn: '360° Panorama of Ancient River Delta in Jezero Crater',
    subtitleRu: 'Миллиарды лет назад здесь шумели бурные пресные потоки',
    mission: 'NASA Mars 2020 (Perseverance Rover)',
    camera: 'Mastcam-Z Right/Left Stereo Telephoto Zoom',
    date: '28 ноября 2022',
    resolution: '2.5 миллиарда пикселей (составная мозаика)',
    descriptionRu: 'Марсоход Perseverance запечатлел скальный массив «Kodiak» — отпрепарированный ветром останец древней речной дельты. Слоистая косая слоистость доказывает, что река периодически разливалась бурными паводками.',
    scientificValueRu: 'Глины дельты Езеро — главная цель поиска следов древней одноклеточной марсианской жизни (биосигнатур).',
    funKidFactRu: 'Кратер Езеро назван в честь города в Боснии, и на славянских языках это слово буквально означает «Озеро»!',
    imageUrl: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=1600&q=85',
    credit: 'NASA / JPL-Caltech / ASU / MSSS',
    tags: ['Mars', 'Perseverance', 'Jezero', 'Delta', 'Mastcam-Z']
  },
  {
    id: 'mars-olympus-caldera-hirise',
    category: 'mars',
    titleRu: 'Обрывы кальдеры вулкана Олимп (HiRISE 25 см/пикс)',
    titleEn: 'Cliffs of Olympus Mons Caldera at 25cm/pixel',
    subtitleRu: 'Взгляд на вершину высочайшей горы Солнечной системы с орбиты',
    mission: 'Mars Reconnaissance Orbiter (NASA)',
    camera: 'High Resolution Imaging Science Experiment (HiRISE)',
    date: '19 января 2021',
    resolution: '0.25 метра на пиксель (с высоты 280 км)',
    descriptionRu: 'На вершине 22-километрового вулкана Олимп расположена сложная кальдера размером 80 × 60 км, состоящая из 6 пересекающихся кратеров провала. Стены обрывов уходят вертикально вниз на глубину до 3.2 километров.',
    scientificValueRu: 'Анализ последовательности обрушений лавовых камер позволил восстановить историю извержений плюма за последние 200 миллионов лет.',
    funKidFactRu: 'Воздух на вершине Олимпа настолько разрежен (0.07 кПа), что там царит почти космический вакуум. Вершина горы буквально торчит из атмосферы Марса!',
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=85',
    credit: 'NASA / JPL-Caltech / University of Arizona',
    tags: ['Mars', 'Olympus Mons', 'HiRISE', 'Volcano', 'High-Res']
  },
  {
    id: 'mars-ingenuity-flight',
    category: 'mars',
    titleRu: 'Вертолёт Ingenuity в полете над марсианскими дюнами',
    titleEn: 'Ingenuity Helicopter in Flight over Martian Dunes',
    subtitleRu: 'Первый управляемый полет винтокрылой машины на чужой планете',
    mission: 'Perseverance / Ingenuity Mars Helicopter',
    camera: 'SuperCam Remote Micro-Imager / Navcam',
    date: '3 декабря 2022',
    resolution: '1920 × 1080 HD',
    descriptionRu: 'Дрон Ingenuity массой всего 1.8 кг с карбоновыми лопастями, вращающимися со скоростью 2537 оборотов в минуту. Он совершил 72 полета, преодолев свыше 17 километров над поверхностью Марса.',
    scientificValueRu: 'Доказана возможность атмосферной воздушной разведки на телах с крайне разреженной атмосферой (плотность воздуха Марса — всего 1% от земной).',
    funKidFactRu: 'Под солнечной батареей Ingenuity прикреплен крошечный кусочек ткани от крыла самолета братьев Райт 1903 года — символ первого полета на Земле и на Марсе!',
    imageUrl: 'https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=1600&q=85',
    credit: 'NASA / JPL-Caltech',
    tags: ['Mars', 'Ingenuity', 'Helicopter', 'Aviation', 'First Flight']
  },
  {
    id: 'mars-valles-marineris-express',
    category: 'mars',
    titleRu: 'Глубины Большого Каньона Марса (Valles Marineris)',
    titleEn: 'Depths of Melas Chasma in Valles Marineris',
    subtitleRu: 'В 4 раза глубже и в 10 раз длиннее Большого Каньона в США',
    mission: 'Mars Express (European Space Agency)',
    camera: 'High Resolution Stereo Camera (HRSC)',
    date: '14 февраля 2020',
    resolution: '12.5 метров на пиксель (3D Perspective View)',
    descriptionRu: 'Грандиозный тектонический раскол коры протяженностью 4000 км. На дне видны древние оползни размером с целые города и отложения сульфатов, доказывающие прошлую гидротермальную активность.',
    scientificValueRu: 'Вскрытие слоев коры Марса на глубину 7-8 км обнажает породы ранней нойской эры (возрастом более 4 млрд лет).',
    funKidFactRu: 'Если бы Долины Маринер находились на Земле, они протянулись бы от Душанбе через всю Евразию прямо до берегов Атлантического океана!',
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=85',
    credit: 'ESA / DLR / FU Berlin (G. Neukum)',
    tags: ['Mars', 'Valles Marineris', 'Canyon', 'ESA', 'Geology']
  },

  // ==========================================
  // CATEGORY 3: SPACECRAFT & DEEP SPACE SCIENCE
  // ==========================================
  {
    id: 'jwst-deep-field',
    category: 'spacecraft',
    titleRu: 'Первое глубокое поле телескопа «Джеймс Уэбб» (SMACS 0723)',
    titleEn: 'James Webb Space Telescope First Deep Field',
    subtitleRu: 'Самый глубокий и четкий инфракрасный снимок ранней Вселенной',
    mission: 'NASA / ESA / CSA James Webb Space Telescope',
    camera: 'NIRCam (Near-Infrared Camera)',
    date: '12 июля 2022',
    resolution: '4537 × 4630 пикселей (12.5 часов экспозиции)',
    descriptionRu: 'Массивное скопление галактик SMACS 0723 работает как гигантская гравитационная линза, искривляя и усиливая свет далеких фоновых галактик, возникших всего через несколько сотен миллионов лет после Большого Взрыва.',
    scientificValueRu: 'Обнаружение древнейших сформировавшихся галактик возрастом 13.1 миллиарда лет опровергло старые астрофизические теории ранней эволюции Вселенной.',
    funKidFactRu: 'Участок неба на этом снимке настолько крошечный, будто вы держите песчинку на расстоянии вытянутой руки!',
    imageUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1600&q=85',
    credit: 'NASA, ESA, CSA, STScI',
    tags: ['Webb', 'JWST', 'Galaxy', 'Deep Space', 'Universe']
  },
  {
    id: 'jwst-pillars-creation',
    category: 'spacecraft',
    titleRu: '«Столпы Творения» в туманности Орла (Webb NIRCam)',
    titleEn: 'Pillars of Creation in Eagle Nebula (JWST)',
    subtitleRu: 'Инфракрасный взгляд сквозь космическую пыль на колыбель звезд',
    mission: 'James Webb Space Telescope',
    camera: 'NIRCam (Near-Infrared)',
    date: '19 октября 2022',
    resolution: '8423 × 14586 пикселей (Ultra HD)',
    descriptionRu: 'Гигантские колонны из холодного межзвездного газа и пыли протяженностью 4-5 световых лет. В инфракрасном диапазоне «Уэбба» пыль становится полупрозрачной, открывая сотни новорожденных протозвезд с рубиновыми джетами.',
    scientificValueRu: 'Точный подсчет массы газопылевых сгустков позволяет понять механизм рождения звезд, похожих на наше Солнце.',
    funKidFactRu: 'Высота самого левого столпа составляет около 4 световых лет — это расстояние от Земли до ближайшей к нам звезды Проксима Центавра!',
    imageUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1600&q=85',
    credit: 'NASA, ESA, CSA, STScI, J. DePasquale, A. Pagan',
    tags: ['Webb', 'JWST', 'Nebula', 'Stars', 'Pillars of Creation']
  },
  {
    id: 'iss-spacewalk',
    category: 'spacecraft',
    titleRu: 'Выход астронавта в открытый космос над планетой Земля',
    titleEn: 'Spacewalk Extravehicular Activity high above Earth',
    subtitleRu: 'Человек за пределами герметичного мира станции',
    mission: 'ISS Expedition 59 Extravehicular Activity',
    camera: 'Helmet Mounted High-Definition Digital Camera',
    date: '22 марта 2019',
    resolution: '4K Ultra HD',
    descriptionRu: 'Астронавт NASA Ник Хейг выполняет 6-часовые работы по замене никель-водородных аккумуляторов на литий-ионные на внешней ферме МКС на скорости 7.7 км/с на фоне лазурного Тихого океана.',
    scientificValueRu: 'Модернизация энергетической системы станции обеспечивает питанием научные приборы европейского и японского модулей.',
    funKidFactRu: 'Температура за бортом скафандра меняется от +120°C на солнечной стороне до -150°C в тени Земли каждые 45 минут!',
    imageUrl: 'https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=1600&q=85',
    credit: 'NASA / Anne McClain',
    tags: ['ISS', 'Spacewalk', 'Astronaut', 'Earth', 'Technology']
  },

  // ==========================================
  // CATEGORY 4: MICROSCOPIC GEOLOGY & ROCK SAMPLES
  // ==========================================
  {
    id: 'mars-hematite-blueberries',
    category: 'geology',
    titleRu: 'Марсианская «Черника» — сферы минерала гематита',
    titleEn: 'Martian "Blueberries" - Hematite Spherules in Bedrock',
    subtitleRu: 'Главное геологическое доказательство древней жидкой воды',
    mission: 'Mars Exploration Rover (Opportunity)',
    camera: 'Microscopic Imager (MI) / 30 microns/pixel',
    date: '18 марта 2004',
    resolution: '1024 × 1024 (размер кадра 3 × 3 см)',
    descriptionRu: 'Крошечные минеральные шарики диаметром 3-5 миллиметров, рассеянные в осадочном камне кратера Игл. На Земле подобные конкреции растут исключительно при медленном просачивании минерализованной грунтовой воды сквозь пористый песчаник.',
    scientificValueRu: 'Открытие доказало: в эпоху Ноя на Марсе существовали обширные водоносные горизонты с нейтральным или слабокислым pH.',
    funKidFactRu: 'Ученые в NASA назвали их «черникой» (blueberries), потому что на ложных цветах спектрометра шарики выглядели синими ягодами в кексе!',
    imageUrl: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=1600&q=85',
    credit: 'NASA / JPL-Caltech / Cornell / USGS',
    tags: ['Geology', 'Hematite', 'Blueberries', 'Opportunity', 'Water Proof']
  },
  {
    id: 'mars-sample-tube-titanium',
    category: 'geology',
    titleRu: 'Герметичная капсула с керном марсианской породы',
    titleEn: 'First Sealed Sample Tube Dropped on Mars Surface',
    subtitleRu: 'Посылка с другой планеты для будущей доставки на Землю',
    mission: 'NASA Mars 2020 (Perseverance)',
    camera: 'WATSON (Wide Angle Topographic Sensor for Operations)',
    date: '21 декабря 2022',
    resolution: 'Macro Imager 15 microns/pixel',
    descriptionRu: 'Титановая трубка с высверленным цилиндром древней магматической породы «Malay», оставленная на ровной площадке склада «Three Forks». В 2030-х годах совместная миссия NASA и ESA заберет эти капсулы и доставит в земные лаборатории.',
    scientificValueRu: 'Возврат образцов позволит провести радиоизотопное датирование на масс-спектрометрах, точно определив возраст марсианских пород.',
    funKidFactRu: 'Трубки для образцов сделаны из сверхчистого титана и покрыты белым нитридным слоем для защиты от перегрева на марсианском солнце!',
    imageUrl: 'https://images.unsplash.com/photo-1517976487507-5b3df11d991e?auto=format&fit=crop&w=1600&q=85',
    credit: 'NASA / JPL-Caltech / MSSS',
    tags: ['Sample Return', 'Perseverance', 'Titanium', 'Geology']
  }
];
