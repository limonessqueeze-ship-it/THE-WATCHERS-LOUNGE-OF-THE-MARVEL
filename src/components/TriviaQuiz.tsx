import React, { useState } from 'react';
import { HelpCircle, CheckCircle2, XCircle, Award, RefreshCw, Zap, Shield, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { TriviaQuestion } from '../types';
import { useAuth } from '../context/AuthContext';

interface TriviaQuizProps {
  questions: TriviaQuestion[];
}

export const TriviaQuiz: React.FC<TriviaQuizProps> = ({ questions }) => {
  const { updateNexusPoints } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [totalEarnedPoints, setTotalEarnedPoints] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const currentQuestion = questions[currentIndex];

  const handleSelectOption = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);

    const isCorrect = index === currentQuestion.correctAnswerIndex;
    if (isCorrect) {
      const reward = currentQuestion.nexusPointsReward;
      setScore(prev => prev + 1);
      setTotalEarnedPoints(prev => prev + reward);
      updateNexusPoints(reward); // Add to global user context

      // Trigger Confetti!
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.7 }
      });
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setQuizFinished(true);
      confetti({
        particleCount: 120,
        spread: 100,
        origin: { y: 0.6 }
      });
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setTotalEarnedPoints(0);
    setQuizFinished(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 space-y-6">
      
      {/* Title Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/80 border border-red-500/40 text-amber-300 text-xs font-mono font-bold uppercase tracking-wider">
          <HelpCircle className="w-3.5 h-3.5 text-amber-400" /> DESAFÍO DE CONOCIMIENTO MULTIVERSAL
        </div>
        <h1 className="font-cinzel text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-red-500">
          TRIVIA DE LA TVA
        </h1>
        <p className="text-sm text-slate-400 max-w-md mx-auto">
          Pone a prueba tu dominio sobre el MCU y los cómics para ganar Puntos Nexus y elevar tu Rango de Fan.
        </p>
      </div>

      {!quizFinished ? (
        <div className="tva-card rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl relative">
          
          {/* Progress Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <span className="text-xs font-mono font-bold text-amber-400 uppercase">
              Pregunta {currentIndex + 1} de {questions.length}
            </span>

            <span className="px-3 py-1 rounded-full bg-red-950/80 border border-red-500/40 text-xs font-mono font-bold text-red-300">
              Recompensa: +{currentQuestion.nexusPointsReward} Pts
            </span>
          </div>

          {/* Question Text */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
              Categoría: {currentQuestion.category} • Dificultad: {currentQuestion.difficulty}
            </span>
            <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-slate-100 leading-snug">
              {currentQuestion.question}
            </h2>
          </div>

          {/* Options Grid */}
          <div className="space-y-3">
            {currentQuestion.options.map((option, idx) => {
              let btnStyle = 'bg-slate-900 border-slate-800 text-slate-200 hover:border-amber-500/50';

              if (isAnswered) {
                if (idx === currentQuestion.correctAnswerIndex) {
                  btnStyle = 'bg-emerald-950/90 border-emerald-500 text-emerald-200 font-bold';
                } else if (idx === selectedOption) {
                  btnStyle = 'bg-red-950/90 border-red-500 text-red-200 font-bold';
                } else {
                  btnStyle = 'bg-slate-900/50 border-slate-800 opacity-50';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={isAnswered}
                  className={`w-full p-4 rounded-xl border text-left text-sm transition-all flex items-center justify-between group ${btnStyle}`}
                >
                  <span>{option}</span>
                  {isAnswered && idx === currentQuestion.correctAnswerIndex && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  )}
                  {isAnswered && idx === selectedOption && idx !== currentQuestion.correctAnswerIndex && (
                    <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Answer Explanation Box */}
          {isAnswered && (
            <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/30 space-y-2 animate-fadeIn">
              <span className="text-xs font-mono font-bold text-amber-300 uppercase block">
                ⚡ Explicación del Canon:
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                {currentQuestion.explanation}
              </p>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={handleNext}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 text-white font-bold text-xs shadow-lg hover:brightness-110 transition-all"
                >
                  {currentIndex + 1 < questions.length ? 'Siguiente Pregunta →' : 'Ver Resultados Finales 🎉'}
                </button>
              </div>
            </div>
          )}

        </div>
      ) : (
        /* Quiz Finished Results Card */
        <div className="tva-card rounded-2xl p-8 text-center space-y-6 shadow-2xl animate-fadeIn">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-500 to-red-600 p-0.5 mx-auto">
            <div className="w-full h-full rounded-full bg-[#120808] flex items-center justify-center text-amber-400">
              <Award className="w-10 h-10" />
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="font-cinzel text-3xl font-bold text-amber-200">
              ¡EVALUACIÓN COMPLETADA!
            </h2>
            <p className="text-sm text-slate-300">
              Aciertos: <span className="font-bold text-amber-400 text-base">{score} / {questions.length}</span>
            </p>
            <p className="text-xs font-mono text-emerald-400 font-bold bg-emerald-950/60 p-2 rounded-xl border border-emerald-500/30 max-w-xs mx-auto">
              🎉 +{totalEarnedPoints} Puntos Nexus acreditados a tu cuenta
            </p>
          </div>

          <button
            onClick={handleRestart}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 text-white font-bold text-sm shadow-lg hover:brightness-110 transition-all inline-flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Intentar Trivia Nuevamente</span>
          </button>
        </div>
      )}

    </div>
  );
};
