import React, { useState, useEffect } from 'react';
import {
  Rocket,
  Play,
  Pause,
  RotateCcw,
  FastForward,
  Radio,
  ShieldAlert,
  Gauge,
  Clock,
  Compass,
  Sparkles,
  ChevronRight,
  Flame,
  CheckCircle2
} from 'lucide-react';
import { marsAudio } from '../utils/marsAudio';

interface HohmannFlightSimulatorProps {
  onReturnToOrbit: () => void;
  onExploreMars: () => void;
}

export const HohmannFlightSimulator: React.FC<HohmannFlightSimulatorProps> = ({
  onReturnToOrbit,
  onExploreMars,
}) => {
  // Flight progress from 0% (Earth launch) to 100% (Mars touchdown)
  const [progress, setProgress] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);

  // Flight Stages
  // 0% - 15%: Earth Departure (TMI Burn)
  // 15% - 80%: Interplanetary Heliocentric Cruise
  // 80% - 95%: Mars Aerocapture & Descent
  // 95% - 100%: Jezero Crater Touchdown

  useEffect(() => {
    if (!isPlaying) return;

    const interval = window.setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          setIsPlaying(false);
          marsAudio.playSuccessChime();
          return 100;
        }
        return Math.min(100, prev + 0.3 * speedMultiplier);
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, speedMultiplier]);

  // Calculated Telemetry based on progress
  const totalDays = 210; // ~7 months
  const currentDay = Math.round((progress / 100) * totalDays);
  const totalDistanceMillionKm = 480; // Arc of Hohmann transfer
  const distanceCovered = Math.round((progress / 100) * totalDistanceMillionKm);
  const distanceToMars = Math.max(0, totalDistanceMillionKm - distanceCovered);

  // Speed: starts high (32 km/s), drops during cruise (21 km/s), increases during Mars approach (25 km/s)
  const speedKms = progress < 20
    ? (32.4 - (progress / 20) * 10).toFixed(1)
    : progress > 80
    ? (21.4 + ((progress - 80) / 20) * 4.2).toFixed(1)
    : (21.4 + Math.sin(progress * 0.1) * 0.8).toFixed(1);

  // Radio light-speed delay (from 0.3 min at Earth up to 21.4 min at Mars)
  const radioDelayMin = (0.3 + (progress / 100) * 21.1).toFixed(1);

  const getStageInfo = (p: number) => {
    if (p < 15) {
      return {
        stageRu: 'Фаза 1: Старт с Земли & Импульс TMI',
        descRu: 'Включение метано-кислородных двигателей второй ступени. Аппарат развивает вторую космическую скорость (11.2 км/с + 3.6 км/с дельта-V) и покидает сферу тяготения Земли.',
        statusColor: 'text-sky-400',
        badge: '🚀 ОТХОД ОТ ЗЕМЛИ'
      };
    }
    if (p < 80) {
      return {
        stageRu: 'Фаза 2: 7-Месячный Межпланетный Круиз',
        descRu: 'Аппарат движется по эллиптической траектории Гомана вокруг Солнца. Корабль вращается для поддержания теплового баланса («режим гриля»), солнечные батареи ориентированы на Солнце.',
        statusColor: 'text-amber-400',
        badge: '☀️ ГЕЛИОЦЕНТРИЧЕСКИЙ КРУИЗ'
      };
    }
    if (p < 95) {
      return {
        stageRu: 'Фаза 3: Вход в атмосферу («7 Минут Ужаса»)',
        descRu: 'Вход в атмосферу Марса на скорости 19 000 км/ч. Температура теплозащитного экрана достигает 2100°C. Плазма блокирует радиосвязь, посадка происходит полностью автономно под управлением ИИ!',
        statusColor: 'text-red-400',
        badge: '🔥 АЭРОТОРМОЖЕНИЕ & ПЛАЗМА'
      };
    }
    return {
      stageRu: 'Фаза 4: Мягкая посадка в кратере Езеро',
      descRu: 'Раскрытие сверхзвукового парашюта, отстрел теплозащитного экрана, сканирование рельефа радаром и мягкое опускание аппарата на марсианский грунт!',
      statusColor: 'text-emerald-400',
      badge: '🎯 МЯГКАЯ ПОСАДКА'
    };
  };

  const currentStage = getStageInfo(progress);

  const handleSeek = (stagePercent: number) => {
    marsAudio.playTelemetryPing();
    setProgress(stagePercent);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-5 animate-fadeIn text-slate-100">
      {/* Header Banner */}
      <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-5 shadow-2xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold text-amber-400 bg-amber-950/70 border border-amber-800/40 px-2 py-0.5 rounded font-mono">
              ОРБИТАЛЬНЫЙ СИМУЛЯТОР ПОЛЁТА
            </span>
            <span className="text-[10px] text-slate-400 font-mono">Hohmann Transfer Trajectory</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white">
            Межпланетный перелёт: Земля ♁ → Марс ♂
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Физическая модель движения по эллиптической переходной орбите Гомана (210 суток в глубоком космосе)
          </p>
        </div>

        <button
          onClick={onReturnToOrbit}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-all"
        >
          ← Вернуться к 3D планетам
        </button>
      </div>

      {/* Main Interactive 2D/3D Trajectory Orbit Display */}
      <div className="bg-slate-950/95 border border-slate-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        {/* Orbital Trajectory Canvas Schematic */}
        <div className="relative w-full aspect-[21/9] bg-slate-900/50 rounded-xl border border-slate-800/80 flex items-center justify-center overflow-hidden">
          {/* Background Grid & Stars */}
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle, #38bdf8 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />

          {/* Sun at Center */}
          <div className="absolute left-[38%] top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-amber-400 to-yellow-300 shadow-[0_0_40px_rgba(251,191,36,0.6)] animate-pulse" />
            <span className="text-[10px] font-bold font-mono text-amber-300 mt-1">СОЛНЦЕ</span>
          </div>

          {/* Earth Orbit (1.0 AU) */}
          <div
            className="absolute left-[38%] top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-sky-500/30 border-dashed pointer-events-none"
            style={{ width: '42%', height: '84%' }}
          />

          {/* Mars Orbit (1.52 AU) */}
          <div
            className="absolute left-[38%] top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-red-500/30 border-dashed pointer-events-none"
            style={{ width: '64%', height: '128%' }}
          />

          {/* Earth Body */}
          <div
            className="absolute flex flex-col items-center cursor-pointer transition-transform hover:scale-110"
            style={{ left: '17%', top: '50%', transform: 'translate(-50%, -50%)' }}
            onClick={() => handleSeek(0)}
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 via-sky-400 to-emerald-400 shadow-[0_0_15px_rgba(56,189,248,0.5)] border border-sky-300" />
            <span className="text-[10px] font-bold font-mono text-sky-400 mt-1">ЗЕМЛЯ (Старт)</span>
          </div>

          {/* Mars Body */}
          <div
            className="absolute flex flex-col items-center cursor-pointer transition-transform hover:scale-110"
            style={{ right: '10%', top: '50%', transform: 'translate(50%, -50%)' }}
            onClick={() => handleSeek(100)}
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-red-600 to-amber-500 shadow-[0_0_15px_rgba(239,68,68,0.5)] border border-red-400" />
            <span className="text-[10px] font-bold font-mono text-red-400 mt-1">МАРС (Цель)</span>
          </div>

          {/* Hohmann Arc Path (SVG) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <path
              d="M 170,180 Q 380,20 820,180"
              fill="none"
              stroke="#fbbf24"
              strokeWidth="2.5"
              strokeDasharray="6 4"
              className="opacity-70"
            />
          </svg>

          {/* Current Spacecraft Position Marker */}
          {(() => {
            // Parametric curve interpolation
            const t = progress / 100;
            const xPercent = 17 + t * 73;
            // Arc parabolic height offset
            const yOffset = Math.sin(t * Math.PI) * 28;
            const yPercent = 50 - yOffset;

            return (
              <div
                className="absolute z-20 flex flex-col items-center pointer-events-none transition-all duration-100 ease-out"
                style={{
                  left: `${xPercent}%`,
                  top: `${yPercent}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <div className="w-6 h-6 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-bold shadow-[0_0_20px_#fbbf24] animate-bounce">
                  <Rocket className="w-3.5 h-3.5 rotate-45" />
                </div>
                <div className="bg-slate-950/90 border border-amber-400/80 px-2 py-0.5 rounded text-[9px] font-mono text-amber-300 mt-1 whitespace-nowrap shadow-xl">
                  {speedKms} км/с
                </div>
              </div>
            );
          })()}
        </div>

        {/* Progress Bar & Stage Waypoints */}
        <div className="mt-5 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5 font-bold text-white">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              {currentStage.badge}
            </span>
            <span className="font-bold text-amber-400">
              День {currentDay} из {totalDays} ({Math.round(progress)}%)
            </span>
          </div>

          <div className="relative w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800">
            <div
              className="bg-gradient-to-r from-sky-500 via-amber-400 to-red-500 h-full rounded-full transition-all duration-150"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Stage Waypoint Buttons */}
          <div className="grid grid-cols-4 gap-2 pt-1 text-[11px] font-mono">
            <button
              onClick={() => handleSeek(0)}
              className={`p-2 rounded-xl border text-left transition-all ${
                progress < 15
                  ? 'bg-sky-950/70 border-sky-400 text-white shadow-md'
                  : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <span className="text-[9px] text-sky-400 block">01 ЭТАП</span>
              <strong className="block truncate">Старт с Земли</strong>
            </button>

            <button
              onClick={() => handleSeek(40)}
              className={`p-2 rounded-xl border text-left transition-all ${
                progress >= 15 && progress < 80
                  ? 'bg-amber-950/70 border-amber-400 text-white shadow-md'
                  : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <span className="text-[9px] text-amber-400 block">02 ЭТАП</span>
              <strong className="block truncate">Глубокий космос</strong>
            </button>

            <button
              onClick={() => handleSeek(85)}
              className={`p-2 rounded-xl border text-left transition-all ${
                progress >= 80 && progress < 95
                  ? 'bg-red-950/70 border-red-400 text-white shadow-md'
                  : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <span className="text-[9px] text-red-400 block">03 ЭТАП</span>
              <strong className="block truncate">Плазменный вход</strong>
            </button>

            <button
              onClick={() => handleSeek(100)}
              className={`p-2 rounded-xl border text-left transition-all ${
                progress >= 95
                  ? 'bg-emerald-950/70 border-emerald-400 text-white shadow-md'
                  : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <span className="text-[9px] text-emerald-400 block">04 ЭТАП</span>
              <strong className="block truncate">Посадка Езеро</strong>
            </button>
          </div>
        </div>

        {/* Flight Playback Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-5 pt-4 border-t border-slate-800">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                marsAudio.playTelemetryPing();
                setIsPlaying(prev => !prev);
              }}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-2 shadow-lg transition-all"
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
              <span>{isPlaying ? 'Пауза полёта' : 'Запуск симуляции'}</span>
            </button>

            <button
              onClick={() => {
                marsAudio.playTelemetryPing();
                setProgress(0);
                setIsPlaying(true);
              }}
              className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-xl text-slate-300 hover:text-white"
              title="Начать перелет заново"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Time Warp Multipliers */}
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs font-mono">
            <span className="text-[10px] text-slate-400 px-2">Ускорение времени:</span>
            {[1, 5, 20].map(mult => (
              <button
                key={mult}
                onClick={() => setSpeedMultiplier(mult)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  speedMultiplier === mult
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {mult}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Flight Telemetry Dashboard Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-slate-950/85 border border-slate-800 p-3.5 rounded-2xl shadow-xl">
          <span className="text-[10px] text-slate-400 font-mono uppercase block flex items-center gap-1.5">
            <Gauge className="w-3.5 h-3.5 text-amber-400" /> Скорость корабля
          </span>
          <span className="text-xl font-black font-mono text-white mt-1 block">
            {speedKms} км/с
          </span>
          <span className="text-[10px] text-slate-500 font-mono">{(Number(speedKms) * 3600).toLocaleString()} км/ч</span>
        </div>

        <div className="bg-slate-950/85 border border-slate-800 p-3.5 rounded-2xl shadow-xl">
          <span className="text-[10px] text-slate-400 font-mono uppercase block flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-sky-400" /> Пройденный путь
          </span>
          <span className="text-xl font-black font-mono text-sky-400 mt-1 block">
            {distanceCovered} млн км
          </span>
          <span className="text-[10px] text-slate-500 font-mono">Осталось: {distanceToMars} млн км</span>
        </div>

        <div className="bg-slate-950/85 border border-slate-800 p-3.5 rounded-2xl shadow-xl">
          <span className="text-[10px] text-slate-400 font-mono uppercase block flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-pink-400" /> Задержка радиосвязи
          </span>
          <span className="text-xl font-black font-mono text-pink-400 mt-1 block">
            +{radioDelayMin} мин
          </span>
          <span className="text-[10px] text-slate-500 font-mono">Скорость света (c = 300 000 км/с)</span>
        </div>

        <div className="bg-slate-950/85 border border-slate-800 p-3.5 rounded-2xl shadow-xl">
          <span className="text-[10px] text-slate-400 font-mono uppercase block flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-emerald-400" /> Радиация за бортом
          </span>
          <span className="text-xl font-black font-mono text-emerald-400 mt-1 block">
            {(0.66 * (progress / 100) * 300).toFixed(0)} мЗв
          </span>
          <span className="text-[10px] text-slate-500 font-mono">В норме защитного экрана</span>
        </div>
      </div>

      {/* Current Stage Educational Dossier */}
      <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-amber-400 font-mono font-bold text-sm">ТЕКУЩАЯ СИТУАЦИЯ МИССИИ:</span>
            <span className={`text-sm font-bold ${currentStage.statusColor}`}>{currentStage.stageRu}</span>
          </div>
          {progress >= 98 && (
            <button
              onClick={onExploreMars}
              className="px-4 py-1.5 bg-gradient-to-r from-red-600 to-amber-600 text-white font-bold text-xs rounded-xl shadow-lg hover:from-red-500 hover:to-amber-500 flex items-center gap-1.5 animate-pulse"
            >
              <span>Исследовать Марс в 3D</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
        <p className="text-xs md:text-sm text-slate-300 leading-relaxed pt-1">
          {currentStage.descRu}
        </p>
      </div>
    </div>
  );
};
