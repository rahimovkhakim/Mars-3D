import React from 'react';
import { ShieldCheck, Compass, Sparkles, BookOpen, Rocket, Award, ExternalLink, Globe } from 'lucide-react';

interface AmericanSpaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartAutoTour: () => void;
}

export const AmericanSpaceModal: React.FC<AmericanSpaceModalProps> = ({
  isOpen,
  onClose,
  onStartAutoTour,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-slate-900 rounded-3xl p-6 md:p-8 border-2 border-red-500/60 shadow-2xl relative text-slate-100 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg text-xs"
        >
          ✕ Закрыть
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-red-600 to-amber-500 flex items-center justify-center text-white shadow-lg shrink-0">
            <Globe className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 bg-amber-950/60 px-2.5 py-0.5 rounded border border-amber-800/40">
              Душанбе, Таджикистан
            </span>
            <h2 className="text-xl md:text-2xl font-bold text-white mt-1">
              Миссия в American Space Dushanbe
            </h2>
          </div>
        </div>

        {/* Why this project matters in real life */}
        <div className="space-y-4 text-xs md:text-sm text-slate-300">
          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800">
            <h3 className="font-bold text-white text-sm mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Зачем это приложение нужно в реальной жизни?
            </h3>
            <p className="leading-relaxed mb-3">
              В школах и кружках Таджикистана астрономия и космонавтика часто преподаются исключительно по старым бумажным учебникам без наглядных моделей. Это приложение превращает любой компьютер, ноутбук или планшет в American Space Dushanbe в <strong>интерактивный цифровой планетарий</strong> и научную лабораторию NASA.
            </p>
            <ul className="space-y-1.5 text-xs text-slate-300 list-disc list-inside">
              <li><strong>Развитие STEM:</strong> Практическое знакомство с гравитацией, геологией, оптикой и физикой газов.</li>
              <li><strong>Английский язык в науке:</strong> Освоение аутентичной аэрокосмической терминологии NASA (Rover, Paleolake, Sol, Sky Crane, Spectrometer).</li>
              <li><strong>Подготовка к олимпиадам:</strong> База для участия школьников Душанбе в международном хакатоне <em>NASA Space Apps Challenge</em>.</li>
              <li><strong>Доступность:</strong> 100% браузерное решение без необходимости покупать дорогие VR-шлемы.</li>
            </ul>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
              <h4 className="font-bold text-sky-400 text-xs mb-1 flex items-center gap-1.5">
                <Rocket className="w-3.5 h-3.5" />
                NASA Data Integration
              </h4>
              <p className="text-[11px] text-slate-400">
                Используются подлинные координаты аппаратов Viking, Pathfinder, Spirit, Opportunity, Curiosity, InSight и Perseverance.
              </p>
            </div>

            <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
              <h4 className="font-bold text-amber-400 text-xs mb-1 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5" />
                Мотивация для детей
              </h4>
              <p className="text-[11px] text-slate-400">
                Геймифицированная шкала изучения до 100% и именной официальный сертификат American Space.
              </p>
            </div>
          </div>

          {/* Quick Auto Tour for Presentations */}
          <div className="bg-gradient-to-r from-red-950/80 to-slate-950 p-4 rounded-xl border border-red-800/40 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <div className="font-bold text-white text-xs mb-0.5">
                🎬 Режим Демо-Тура для защиты перед жюри:
              </div>
              <p className="text-[11px] text-slate-400">
                Автоматический плавный облет 5 главных чудес Марса с озвучкой и акцентом на факты.
              </p>
            </div>
            <button
              onClick={() => {
                onClose();
                onStartAutoTour();
              }}
              className="px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center gap-2 shrink-0"
            >
              <Rocket className="w-4 h-4" />
              Запустить Демо-Тур
            </button>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>American Space Dushanbe • Education & Innovation</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs"
          >
            Понятно
          </button>
        </div>
      </div>
    </div>
  );
};
