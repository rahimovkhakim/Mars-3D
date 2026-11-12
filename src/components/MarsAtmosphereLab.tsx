import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, ArrowUp, Thermometer, Wind, Compass, Sparkles } from 'lucide-react';
import { marsAudio } from '../utils/marsAudio';

interface MarsAtmosphereLabProps {
  onInteractLab?: () => void;
}

export const MarsAtmosphereLab: React.FC<MarsAtmosphereLabProps> = ({ onInteractLab }) => {
  const [isWindActive, setIsWindActive] = useState(false);
  const [selectedPlanet, setSelectedPlanet] = useState<'earth' | 'mars' | 'moon'>('mars');
  const [isJumping, setIsJumping] = useState(false);
  const [jumpProgress, setJumpProgress] = useState(0); // 0 to 1
  const [timeOfDay, setTimeOfDay] = useState<'noon' | 'evening' | 'night'>('noon');

  const toggleWindSound = () => {
    const newState = marsAudio.toggleWind();
    setIsWindActive(newState);
    if (onInteractLab) onInteractLab();
  };

  const handleJump = () => {
    if (isJumping) return;
    setIsJumping(true);
    setJumpProgress(0);
    marsAudio.playTelemetryPing();
    if (onInteractLab) onInteractLab();

    const duration = selectedPlanet === 'earth' ? 900 : selectedPlanet === 'mars' ? 1800 : 2800;
    const startTime = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(1, elapsed / duration);
      setJumpProgress(progress);

      if (progress >= 1) {
        clearInterval(interval);
        setIsJumping(false);
      }
    }, 16);
  };

  // Jump height calculation: parabola 4 * p * (1 - p)
  const jumpHeightMeters =
    selectedPlanet === 'earth'
      ? 0.5
      : selectedPlanet === 'mars'
      ? 1.32
      : 3.05;

  const currentJumpY = Math.sin(jumpProgress * Math.PI) * (selectedPlanet === 'earth' ? 60 : selectedPlanet === 'mars' ? 140 : 220);

  const temperatures = {
    noon: { temp: '+20°C', desc: 'Теплый полдень на экваторе в разгар марсианского лета' },
    evening: { temp: '-45°C', desc: 'Резкое падение тепла из-за отсутствия парникового эффекта' },
    night: { temp: '-90°C', desc: 'Морозная полярная ночь. Требуется обогрев РИТЭГ' },
  };

  return (
    <div className="w-full h-full bg-slate-950 text-slate-100 p-4 md:p-6 overflow-y-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 bg-amber-950/60 px-2.5 py-0.5 rounded border border-amber-800/40">
            STEM Лаборатория
          </span>
          <span className="text-xs text-slate-400">American Space Dushanbe & NASA Data</span>
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-white">Физика и Атмосфера Марса</h2>
        <p className="text-xs md:text-sm text-slate-400">
          Сравнивай условия на Красной планете с Землей и тестируй марсианские законы физики
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* 1. Interactive Gravity Jump Simulator */}
        <div className="bg-slate-900/80 rounded-xl p-5 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Compass className="w-4 h-4 text-sky-400" />
                Гравитационный тренажёр: Прыжок в космосе
              </h3>
              <span className="text-xs font-mono text-amber-300">
                g = {selectedPlanet === 'earth' ? '9.80' : selectedPlanet === 'mars' ? '3.72' : '1.62'} м/с²
              </span>
            </div>

            <p className="text-xs text-slate-300 mb-4">
              Гравитация Марса — всего <strong>38% от земной</strong>. Выбери планету и нажми «Прыжок!», чтобы увидеть разницу своими глазами.
            </p>

            {/* Planet Tabs */}
            <div className="grid grid-cols-3 gap-2 mb-6">
              {[
                { id: 'earth', label: 'Земля (1.0 g)', tag: 'Дома' },
                { id: 'mars', label: 'Марс (0.38 g)', tag: 'В 2.6x легче!' },
                { id: 'moon', label: 'Луна (0.16 g)', tag: 'В 6x легче' },
              ].map(p => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPlanet(p.id as 'earth' | 'mars' | 'moon')}
                  className={`p-2.5 rounded-lg text-xs font-semibold text-center transition-all border ${
                    selectedPlanet === p.id
                      ? 'bg-sky-600/30 border-sky-400 text-white shadow-lg'
                      : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div>{p.label}</div>
                  <div className="text-[10px] text-amber-400 font-normal">{p.tag}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Jump Visualizer Stage */}
          <div className="relative h-64 bg-gradient-to-b from-slate-950 to-slate-900 rounded-xl border border-slate-800 flex flex-col justify-end p-4 overflow-hidden mb-4">
            {/* Height Ruler Lines */}
            <div className="absolute left-3 inset-y-4 flex flex-col justify-between text-[10px] text-slate-500 font-mono border-l border-dashed border-slate-700 pl-2">
              <span>3.0 м (Лунный рекорд)</span>
              <span>2.0 м</span>
              <span>1.3 м (Марсианский прыжок)</span>
              <span>0.5 м (Земля)</span>
              <span>0.0 м (Поверхность)</span>
            </div>

            {/* Animated Astronaut/Kid Character */}
            <div
              className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center transition-transform"
              style={{
                bottom: '24px',
                transform: `translate(-50%, -${currentJumpY}px)`,
              }}
            >
              {/* Badge showing current altitude */}
              {isJumping && (
                <div className="bg-sky-500 text-slate-950 font-mono text-[10px] font-bold px-1.5 py-0.5 rounded shadow mb-1">
                  {(jumpHeightMeters * Math.sin(jumpProgress * Math.PI)).toFixed(2)} м
                </div>
              )}
              {/* Cute Astronaut SVG character */}
              <div className="w-14 h-18 bg-white/95 rounded-2xl p-1.5 shadow-xl border-2 border-slate-300 flex flex-col items-center relative">
                {/* Visor */}
                <div className="w-9 h-6 bg-amber-400 rounded-lg shadow-inner border border-amber-600 mb-1 flex items-center justify-center">
                  <div className="w-4 h-1.5 bg-white/70 rounded-full" />
                </div>
                {/* Suit badge */}
                <div className="text-[8px] font-bold text-red-600">NASA</div>
                {/* Backpack */}
                <div className="absolute -left-1.5 top-3 w-2 h-7 bg-slate-400 rounded" />
              </div>
            </div>

            {/* Ground surface line */}
            <div
              className={`h-6 w-full rounded border-t-2 ${
                selectedPlanet === 'earth'
                  ? 'bg-emerald-900/60 border-emerald-500'
                  : selectedPlanet === 'mars'
                  ? 'bg-red-950/80 border-red-500'
                  : 'bg-slate-800 border-slate-500'
              }`}
            />
          </div>

          <button
            onClick={handleJump}
            disabled={isJumping}
            className="w-full py-3 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold rounded-lg shadow-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            <ArrowUp className="w-4 h-4" />
            {isJumping ? 'Прыжок в невесомости...' : `Подпрыгнуть на ${selectedPlanet === 'earth' ? 'Земле' : selectedPlanet === 'mars' ? 'Марсе' : 'Луне'}!`}
          </button>
        </div>

        {/* 2. Audio & Atmosphere Composition Lab */}
        <div className="space-y-5">
          {/* Martian Wind Acoustic Simulator */}
          <div className="bg-slate-900/80 rounded-xl p-5 border border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Wind className="w-4 h-4 text-amber-400" />
                Аудио-симулятор: Звук ветра на Марсе
              </h3>
              <button
                onClick={toggleWindSound}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  isWindActive
                    ? 'bg-red-600 text-white shadow-lg'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                }`}
              >
                {isWindActive ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                {isWindActive ? 'Остановить ветер' : 'Включить марсианский ветер'}
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-3">
              Атмосфера Марса состоит из углекислого газа и в 100 раз разреженнее земной. Поэтому звуковые волны затухают быстрее, а высокие звуки (пение птиц, свист) почти не слышны!
            </p>

            <div className="bg-slate-950/90 rounded-lg p-3 border border-slate-800 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-red-950 flex items-center justify-center shrink-0 border border-red-800/60">
                <Sparkles className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-xs text-slate-300">
                <strong className="text-white">Факт микрофонов NASA:</strong> Марсоход Perseverance впервые в истории записал настоящий шум порывов ветра и треск лазера SuperCam в кратере Езеро.
              </div>
            </div>
          </div>

          {/* Gas Composition Bar */}
          <div className="bg-slate-900/80 rounded-xl p-5 border border-slate-800">
            <h3 className="font-bold text-base text-white mb-2">Состав воздуха Марса vs Земли</h3>
            <p className="text-xs text-slate-400 mb-3">
              На Марсе нет привычного воздуха для дыхания — нужен скафандр с чистым кислородом:
            </p>

            {/* Mars Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-red-400">Марс (95.3% Углекислый газ CO2)</span>
                <span className="text-slate-400">Давление: 0.6% от Земли</span>
              </div>
              <div className="h-6 w-full bg-slate-800 rounded-lg overflow-hidden flex font-mono text-[10px] text-slate-950 font-bold">
                <div style={{ width: '95.3%' }} className="bg-amber-600 flex items-center justify-center">
                  95.3% CO2
                </div>
                <div style={{ width: '2.6%' }} className="bg-sky-400 flex items-center justify-center">
                  N2
                </div>
                <div style={{ width: '1.9%' }} className="bg-purple-400 flex items-center justify-center">
                  Ar
                </div>
                <div style={{ width: '0.2%' }} className="bg-emerald-400" />
              </div>
            </div>

            {/* Earth Bar */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-sky-400">Земля (78% Азот, 21% Кислород O2)</span>
                <span className="text-slate-400">Давление: 101.3 кПа</span>
              </div>
              <div className="h-6 w-full bg-slate-800 rounded-lg overflow-hidden flex font-mono text-[10px] text-slate-950 font-bold">
                <div style={{ width: '78%' }} className="bg-sky-500 flex items-center justify-center">
                  78% N2 (Азот)
                </div>
                <div style={{ width: '21%' }} className="bg-emerald-400 flex items-center justify-center">
                  21% O2 (Кислород)
                </div>
                <div style={{ width: '1%' }} className="bg-slate-400" />
              </div>
            </div>
          </div>

          {/* Temperature Simulator */}
          <div className="bg-slate-900/80 rounded-xl p-5 border border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-red-400" />
                Температурные качели
              </h3>
              <span className="text-lg font-bold text-amber-300 font-mono">
                {temperatures[timeOfDay].temp}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-3">
              {(['noon', 'evening', 'night'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setTimeOfDay(t)}
                  className={`p-2 rounded-lg text-xs font-semibold capitalize transition-all border ${
                    timeOfDay === t
                      ? 'bg-amber-600/30 border-amber-400 text-white'
                      : 'bg-slate-800/40 border-slate-700/50 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {t === 'noon' ? 'Полдень' : t === 'evening' ? 'Вечер' : 'Ночь'}
                </button>
              ))}
            </div>

            <p className="text-xs text-slate-300 bg-slate-950/80 p-2.5 rounded-lg border border-slate-800">
              {temperatures[timeOfDay].desc}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
