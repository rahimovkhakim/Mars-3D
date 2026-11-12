import React, { useState } from 'react';
import { MARS_QUIZZES } from '../data/marsData';
import { QuizQuestion } from '../types/mars';
import { CheckCircle2, XCircle, Award, RotateCcw, Sparkles, ChevronRight } from 'lucide-react';
import { marsAudio } from '../utils/marsAudio';
import confetti from 'canvas-confetti';

interface MarsQuizProps {
  onQuizCompleted?: (score: number) => void;
}

export const MarsQuiz: React.FC<MarsQuizProps> = ({ onQuizCompleted }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const currentQuestion: QuizQuestion = MARS_QUIZZES[currentIndex];

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    const isCorrect = idx === currentQuestion.correctIndex;
    if (isCorrect) {
      setScore(prev => prev + 1);
      marsAudio.playSuccessChime();
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.6 },
      });
    } else {
      marsAudio.playTelemetryPing();
    }
  };

  const handleNext = () => {
    if (currentIndex < MARS_QUIZZES.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
      if (onQuizCompleted) onQuizCompleted(score + (selectedOption === currentQuestion.correctIndex ? 1 : 0));
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 },
      });
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setIsFinished(false);
  };

  if (isFinished) {
    const percentage = Math.round((score / MARS_QUIZZES.length) * 100);
    return (
      <div className="w-full h-full bg-slate-950 text-slate-100 p-6 flex items-center justify-center">
        <div className="max-w-md w-full bg-slate-900/90 rounded-2xl p-6 border border-slate-800 text-center shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-amber-500/20 text-amber-400 mx-auto flex items-center justify-center mb-4 border border-amber-500/40">
            <Award className="w-8 h-8" />
          </div>

          <h2 className="text-2xl font-bold text-white mb-2">Викторина пройдена!</h2>
          <p className="text-sm text-slate-300 mb-4">
            Твой результат: <span className="text-amber-400 font-bold">{score} из {MARS_QUIZZES.length}</span> ({percentage}%)
          </p>

          <div className="bg-slate-950/80 rounded-xl p-4 border border-slate-800 mb-6 text-xs text-slate-300">
            {percentage >= 75 ? (
              <p className="text-emerald-400 font-semibold">
                🌟 Блестяще! Твои знания достойны инженера NASA Jet Propulsion Laboratory! Ты готов к полету на Марс!
              </p>
            ) : (
              <p className="text-amber-300">
                🚀 Отличная попытка! Изучи 3D глобус и инструменты ровера, чтобы набрать 100%!
              </p>
            )}
          </div>

          <button
            onClick={handleRestart}
            className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            Пройти викторину снова
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-slate-950 text-slate-100 p-4 md:p-6 flex flex-col justify-between overflow-y-auto max-w-3xl mx-auto">
      {/* Quiz Progress Header */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
            Марсианская Викторина для школьников
          </span>
          <span className="text-xs font-mono text-slate-400">
            Вопрос {currentIndex + 1} из {MARS_QUIZZES.length}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mb-6">
          <div
            className="h-full bg-gradient-to-r from-red-600 to-amber-500 transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / MARS_QUIZZES.length) * 100}%` }}
          />
        </div>

        {/* Question Title */}
        <div className="bg-slate-900/80 rounded-2xl p-5 border border-slate-800 mb-4">
          <h2 className="text-lg md:text-xl font-bold text-white mb-1">
            {currentQuestion.questionRu}
          </h2>
          <span className="text-xs text-slate-400 block">{currentQuestion.questionEn}</span>
        </div>

        {/* Options List */}
        <div className="space-y-2.5 mb-4">
          {currentQuestion.optionsRu.map((option, idx) => {
            const isSelected = selectedOption === idx;
            const isCorrect = idx === currentQuestion.correctIndex;

            let btnStyle = 'bg-slate-900/60 border-slate-800 text-slate-200 hover:bg-slate-900 hover:border-slate-700';

            if (isAnswered) {
              if (isCorrect) {
                btnStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 font-semibold shadow-lg';
              } else if (isSelected) {
                btnStyle = 'bg-red-950/80 border-red-500 text-red-200';
              } else {
                btnStyle = 'bg-slate-900/30 border-slate-800/40 text-slate-500';
              }
            }

            return (
              <button
                key={idx}
                disabled={isAnswered}
                onClick={() => handleSelectOption(idx)}
                className={`w-full p-3.5 rounded-xl text-left text-xs md:text-sm transition-all border flex items-center justify-between ${btnStyle}`}
              >
                <span>{option}</span>
                {isAnswered && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 ml-2" />}
                {isAnswered && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-400 shrink-0 ml-2" />}
              </button>
            );
          })}
        </div>

        {/* Explanation Card upon answering */}
        {isAnswered && (
          <div className="bg-slate-900/90 rounded-xl p-4 border border-slate-700/80 animate-fadeIn mb-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
              <Sparkles className="w-4 h-4" />
              Объяснение учёных NASA:
            </div>
            <p className="text-xs text-slate-200 leading-relaxed">
              {currentQuestion.explanationRu}
            </p>
            <div className="text-[11px] text-sky-300 bg-slate-950/80 p-2.5 rounded-lg border border-slate-800">
              💡 <strong>Любопытный факт:</strong> {currentQuestion.funFactRu}
            </div>
          </div>
        )}
      </div>

      {/* Footer Next Button */}
      {isAnswered && (
        <div className="pt-2">
          <button
            onClick={handleNext}
            className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all"
          >
            <span>{currentIndex < MARS_QUIZZES.length - 1 ? 'Следующий вопрос' : 'Посмотреть результат'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
