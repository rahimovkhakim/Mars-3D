import React, { useState } from 'react';
import { MarsPOI } from '../types/mars';
import { MARS_POIS } from '../data/marsData';
import { Award, CheckCircle2, Circle, Printer, Sparkles, Share2, Compass, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ExplorerLogbookProps {
  exploredPOIIds: Set<string>;
  testedTools: Set<string>;
  testedPhysics: boolean;
  quizScore: number;
  onSelectPOI: (poi: MarsPOI) => void;
}

export const ExplorerLogbook: React.FC<ExplorerLogbookProps> = ({
  exploredPOIIds,
  testedTools,
  testedPhysics,
  quizScore,
  onSelectPOI,
}) => {
  const [studentName, setStudentName] = useState<string>('Юный Исследователь');
  const [isEditingName, setIsEditingName] = useState<boolean>(false);
  const [showCertificateModal, setShowCertificateModal] = useState<boolean>(false);

  // Calculate mastery percentage (0% to 100%)
  // POIs: 10 POIs = up to 50% (5% each)
  // Tools: 6 tools = up to 20% (3.33% each)
  // Physics lab: 15%
  // Quiz: up to 15% (score / 8 * 15)
  const poiPoints = Math.min(50, exploredPOIIds.size * 5);
  const toolPoints = Math.min(20, testedTools.size * 3.5);
  const physicsPoints = testedPhysics ? 15 : 0;
  const quizPoints = Math.min(15, Math.round((quizScore / 8) * 15));

  const totalMastery = Math.min(100, Math.round(poiPoints + toolPoints + physicsPoints + quizPoints));

  const handleOpenCertificate = () => {
    setShowCertificateModal(true);
    confetti({
      particleCount: 70,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full h-full bg-slate-950 text-slate-100 p-4 md:p-6 overflow-y-auto max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-red-400 bg-red-950/60 px-2.5 py-0.5 rounded border border-red-800/40">
              Бортовой Журнал Экспедиции
            </span>
            <span className="text-xs text-slate-400">American Space Dushanbe</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-white">Прогресс изучения Марса</h2>
          <p className="text-xs md:text-sm text-slate-400">
            Изучи 10 районов Марса, протестируй марсоход и ответь на вопросы, чтобы достичь 100%!
          </p>
        </div>

        {/* Big Percentage Badge */}
        <div className="flex items-center gap-3 bg-slate-900 p-3 rounded-2xl border border-slate-800">
          <div className="text-right">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Уровень знаний:</span>
            <span className="text-2xl font-black text-amber-400 font-mono">{totalMastery}%</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-red-600 to-amber-500 flex items-center justify-center text-white shadow-lg">
            <Award className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Mastery Progress Bar */}
      <div className="bg-slate-900/80 rounded-2xl p-5 border border-slate-800 mb-6">
        <div className="flex justify-between items-center text-xs mb-2">
          <span className="font-semibold text-slate-300">Готовность к сертификации исследователя</span>
          <span className="font-mono text-amber-400 font-bold">{totalMastery} / 100%</span>
        </div>
        <div className="w-full h-3.5 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
          <div
            className="h-full bg-gradient-to-r from-red-600 via-amber-500 to-emerald-400 rounded-full transition-all duration-500"
            style={{ width: `${totalMastery}%` }}
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 text-xs">
          <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
            <div className="text-slate-400 text-[11px]">Районы Марса</div>
            <div className="font-bold text-white mt-0.5">
              {exploredPOIIds.size} из {MARS_POIS.length}
            </div>
          </div>
          <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
            <div className="text-slate-400 text-[11px]">Инструменты ровера</div>
            <div className="font-bold text-white mt-0.5">
              {testedTools.size} из 6
            </div>
          </div>
          <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
            <div className="text-slate-400 text-[11px]">Лаборатория физики</div>
            <div className="font-bold text-white mt-0.5">
              {testedPhysics ? 'Пройдена ✅' : 'Ожидает'}
            </div>
          </div>
          <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
            <div className="text-slate-400 text-[11px]">Викторина</div>
            <div className="font-bold text-white mt-0.5">
              {quizScore} из 8 баллов
            </div>
          </div>
        </div>

        {totalMastery >= 60 && (
          <div className="mt-4 pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-emerald-400">
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>Поздравляем! Ты освоил более 60% программы и можешь получить официальный сертификат.</span>
            </div>
            <button
              onClick={handleOpenCertificate}
              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-red-600 hover:from-amber-400 hover:to-red-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-all flex items-center gap-1.5 shrink-0"
            >
              <Award className="w-4 h-4 text-slate-950" />
              Открыть сертификат NASA & American Space
            </button>
          </div>
        )}
      </div>

      {/* POI Checklist */}
      <div className="bg-slate-900/80 rounded-2xl p-5 border border-slate-800">
        <h3 className="font-bold text-base text-white mb-2">Чек-лист географических объектов и зон посадок</h3>
        <p className="text-xs text-slate-400 mb-4">
          Нажми на любой район, чтобы переместиться к нему на 3D глобусе Марса:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {MARS_POIS.map(poi => {
            const isExplored = exploredPOIIds.has(poi.id);
            return (
              <div
                key={poi.id}
                onClick={() => onSelectPOI(poi)}
                className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                  isExplored
                    ? 'bg-slate-950/90 border-emerald-900/60 hover:border-emerald-500'
                    : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  {isExplored ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-600 shrink-0" />
                  )}
                  <div className="truncate">
                    <div className="text-xs font-bold text-white truncate">{poi.nameRu}</div>
                    <div className="text-[11px] text-slate-400 truncate">{poi.badge}</div>
                  </div>
                </div>

                <span className={`text-[10px] px-2 py-0.5 rounded font-medium shrink-0 ml-2 ${
                  isExplored ? 'bg-emerald-950 text-emerald-400' : 'bg-slate-800 text-slate-400'
                }`}>
                  {isExplored ? 'Изучено +5%' : 'Перейти'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Official Certificate Modal */}
      {showCertificateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-slate-900 rounded-3xl p-6 md:p-8 border-2 border-amber-500/80 shadow-2xl relative text-slate-900">
            {/* Close button */}
            <button
              onClick={() => setShowCertificateModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white text-xs bg-slate-800 px-3 py-1.5 rounded-lg"
            >
              Закрыть ✕
            </button>

            {/* Printable Certificate Inner Area */}
            <div id="printable-certificate" className="bg-gradient-to-b from-amber-50 to-orange-50 p-6 md:p-8 rounded-2xl border-4 border-amber-600 relative overflow-hidden shadow-inner">
              {/* Decorative Corner Ornaments */}
              <div className="absolute top-2 left-2 text-amber-700 text-xs font-serif">✦ AMERICAN SPACE DUSHANBE ✦</div>
              <div className="absolute top-2 right-2 text-amber-700 text-xs font-serif">✦ NASA STEM OUTREACH ✦</div>

              <div className="text-center my-4">
                <div className="inline-block p-3 bg-red-600 text-white rounded-2xl shadow-md mb-2">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <h1 className="text-2xl md:text-3xl font-black tracking-wide text-slate-900 uppercase font-serif">
                  Сертификат Исследователя Марса
                </h1>
                <p className="text-xs font-bold uppercase tracking-widest text-red-700 mt-1">
                  Mars Junior Planetary Scientist Certificate
                </p>
              </div>

              <p className="text-center text-xs text-slate-700 my-2">
                Настоящий сертификат подтверждает, что юный исследователь:
              </p>

              {/* Student Name */}
              <div className="text-center my-3">
                {isEditingName ? (
                  <input
                    type="text"
                    value={studentName}
                    onChange={e => setStudentName(e.target.value)}
                    onBlur={() => setIsEditingName(false)}
                    autoFocus
                    className="text-center font-bold text-xl md:text-2xl text-red-800 border-b-2 border-red-600 bg-transparent outline-none w-full max-w-sm"
                  />
                ) : (
                  <div
                    onClick={() => setIsEditingName(true)}
                    className="font-bold text-xl md:text-2xl text-red-800 underline decoration-dotted cursor-pointer hover:opacity-80"
                    title="Нажми, чтобы изменить имя"
                  >
                    {studentName} ✏️
                  </div>
                )}
                <span className="text-[10px] text-slate-500 block mt-0.5">
                  (Нажми на имя, чтобы вписать имя ученика)
                </span>
              </div>

              <p className="text-center text-xs text-slate-700 leading-relaxed max-w-lg mx-auto mb-6">
                Успешно освоил <strong>{totalMastery}%</strong> интерактивной программы по астрофизике, геологии и истории миссий NASA на Марс, исследовал гору Олимп, каньон Долины Маринер, кратер Езеро и устройство марсохода Perseverance.
              </p>

              {/* Signatures & Seal */}
              <div className="flex justify-between items-end pt-4 border-t-2 border-amber-300 text-xs">
                <div>
                  <div className="font-bold text-slate-800">American Space Dushanbe</div>
                  <div className="text-[10px] text-slate-500">STEM & Education Initiative</div>
                </div>

                <div className="w-16 h-16 rounded-full border-2 border-red-700 flex flex-col items-center justify-center bg-red-50 text-[8px] font-bold text-red-800 rotate-[-12deg] shadow-sm">
                  <span>OFFICIAL</span>
                  <span className="text-[10px]">MARS 3D</span>
                  <span>VERIFIED</span>
                </div>

                <div className="text-right">
                  <div className="font-bold text-slate-800 font-mono">№ ASD-MARS-{Math.floor(totalMastery * 73)}</div>
                  <div className="text-[10px] text-slate-500">Душанбе, Таджикистан</div>
                </div>
              </div>
            </div>

            {/* Print & Action Buttons */}
            <div className="flex justify-end gap-3 mt-4 text-white">
              <button
                onClick={handlePrint}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-semibold flex items-center gap-2 border border-slate-700"
              >
                <Printer className="w-4 h-4" />
                Распечатать сертификат
              </button>
              <button
                onClick={() => setShowCertificateModal(false)}
                className="px-5 py-2 bg-red-600 hover:bg-red-500 rounded-xl text-xs font-bold shadow-lg"
              >
                Отлично!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
