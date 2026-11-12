import React, { useEffect, useState } from 'react';
import { MarsPOI } from '../types/mars';
import { marsAudio } from '../utils/marsAudio';
import { Rocket, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface LandingDescentOverlayProps {
  poi: MarsPOI;
  onLandingComplete: () => void;
}

export const LandingDescentOverlay: React.FC<LandingDescentOverlayProps> = ({
  poi,
  onLandingComplete,
}) => {
  const [altitudeKm, setAltitudeKm] = useState(125);
  const [stageText, setStageText] = useState('Вход в атмосферу Марса (Entry, Descent & Landing)...');
  const [speedKmh, setSpeedKmh] = useState(19500);

  useEffect(() => {
    marsAudio.playThruster();

    const interval = setInterval(() => {
      setAltitudeKm(prev => {
        const next = Math.max(0, prev - 3.8);
        if (next < 80 && next >= 40) {
          setStageText('Торможение теплозащитным экраном (T = 1300°C)...');
          setSpeedKmh(9200);
        } else if (next < 40 && next >= 10) {
          setStageText('Раскрытие сверхзвукового парашюта NASA...');
          setSpeedKmh(1400);
        } else if (next < 10 && next >= 1) {
          setStageText('Включение тормозных двигателей "Небесного крана" (Sky Crane)...');
          setSpeedKmh(120);
        } else if (next <= 0) {
          setStageText(`Касание поверхности! Посадка в районе: ${poi.nameRu}`);
          setSpeedKmh(0);
          marsAudio.playLanding();
          clearInterval(interval);
          setTimeout(() => {
            onLandingComplete();
          }, 800);
        }
        return Math.round(next * 10) / 10;
      });
    }, 70);

    return () => clearInterval(interval);
  }, [poi, onLandingComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-white font-mono select-none">
      {/* Plasma heat glow background effect */}
      <div className="absolute inset-0 bg-radial from-red-600/30 via-orange-600/10 to-transparent pointer-events-none animate-pulse" />

      <div className="max-w-md w-full bg-slate-950/90 border-2 border-red-500 rounded-3xl p-6 shadow-2xl relative text-center">
        <div className="w-14 h-14 rounded-2xl bg-red-600/20 text-red-400 border border-red-500 mx-auto flex items-center justify-center mb-4">
          <Rocket className="w-7 h-7 animate-bounce" />
        </div>

        <div className="text-[11px] font-bold text-amber-400 uppercase tracking-widest mb-1">
          NASA Jet Propulsion Laboratory
        </div>
        <h2 className="text-xl font-black text-white uppercase mb-1">
          7 Минут Страха: Спуск на Марс
        </h2>
        <span className="text-xs text-sky-400 block mb-6 font-semibold">
          Цель посадки: {poi.nameRu}
        </span>

        {/* Telemetry Gauges */}
        <div className="grid grid-cols-2 gap-3 mb-6 text-left">
          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase block">Высота:</span>
            <span className="text-2xl font-bold text-amber-400">{altitudeKm} км</span>
          </div>
          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase block">Скорость:</span>
            <span className="text-2xl font-bold text-red-400">{speedKmh} км/ч</span>
          </div>
        </div>

        {/* Altitude Descent Progress Bar */}
        <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800 mb-4">
          <div
            className="h-full bg-gradient-to-r from-red-600 via-amber-500 to-emerald-400 rounded-full transition-all duration-75"
            style={{ width: `${Math.min(100, Math.max(0, ((125 - altitudeKm) / 125) * 100))}%` }}
          />
        </div>

        {/* Current Flight Stage Text */}
        <div className="text-xs text-slate-200 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800 flex items-center justify-center gap-2">
          {altitudeKm <= 0 ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping shrink-0" />
          )}
          <span>{stageText}</span>
        </div>
      </div>
    </div>
  );
};
