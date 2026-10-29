import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  Volume2,
  RotateCcw,
  Award,
  ArrowRight,
  Sparkles,
  Clock,
  BookOpen,
  Lightbulb,
} from 'lucide-react';
import { ExamQuestion, QuestionAnswer, ExamResult, SkillCategory } from '../types.js';
import { A1_QUESTIONS } from '../data/questions.js';
import { buildExamResult } from '../utils/rules.js';
import { speakGerman } from '../utils/speech.js';

interface ExamModeProps {
  onExamCompleted: (result: ExamResult) => void;
  onGoToProgress: () => void;
}

export const ExamMode: React.FC<ExamModeProps> = ({
  onExamCompleted,
  onGoToProgress,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<SkillCategory>('all');
  const [activeQuestions, setActiveQuestions] = useState<ExamQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [answers, setAnswers] = useState<QuestionAnswer[]>([]);
  const [examFinished, setExamFinished] = useState(false);
  const [completedResult, setCompletedResult] = useState<ExamResult | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [roundStartTime, setRoundStartTime] = useState<number>(Date.now());

  // Function to initialize 5 questions based on category
  const startNew5QuestionRound = (cat: SkillCategory = selectedCategory) => {
    let pool = A1_QUESTIONS;
    if (cat !== 'all') {
      pool = A1_QUESTIONS.filter((q) => q.category === cat);
      if (pool.length < 5) {
        // if pool has fewer than 5, supplement from all
        pool = [...pool, ...A1_QUESTIONS.filter((q) => q.category !== cat)];
      }
    }

    // Shuffle and pick 5
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    const five = shuffled.slice(0, 5);

    setActiveQuestions(five);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setAnswers([]);
    setExamFinished(false);
    setCompletedResult(null);
    setShowHint(false);
    setRoundStartTime(Date.now());
  };

  useEffect(() => {
    startNew5QuestionRound(selectedCategory);
  }, [selectedCategory]);

  const currentQ = activeQuestions[currentIndex];

  const handleSelectOption = (idx: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(idx);
    setIsAnswerSubmitted(true);

    const isCorrect = idx === currentQ.correctIndex;
    const answerRecord: QuestionAnswer = {
      questionId: currentQ.id,
      questionGerman: currentQ.questionGerman,
      options: currentQ.options,
      selectedIndex: idx,
      correctIndex: currentQ.correctIndex,
      isCorrect,
      turkishExplanation: currentQ.turkishExplanation,
    };

    const nextAnswers = [...answers, answerRecord];
    setAnswers(nextAnswers);

    // If it was the 5th question, finalize the exam
    if (currentIndex === 4) {
      const timeSpent = Math.max(
        10,
        Math.round((Date.now() - roundStartTime) / 1000)
      );
      const result = buildExamResult(selectedCategory, nextAnswers, timeSpent);
      setCompletedResult(result);
      onExamCompleted(result);
    }
  };

  const handleNext = () => {
    if (currentIndex < 4) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
      setShowHint(false);
    } else {
      setExamFinished(true);
    }
  };

  const handlePlayAudio = (text: string) => {
    setIsPlayingAudio(true);
    speakGerman(
      text,
      0.9,
      () => setIsPlayingAudio(false),
      () => setIsPlayingAudio(false)
    );
  };

  if (!currentQ && !examFinished) {
    return (
      <div className="p-8 text-center text-stone-600">
        Sorular yükleniyor...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Category selector pill bar */}
      <div className="bg-white p-3 sm:p-4 rounded-xl shadow-xs border border-stone-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#800020]"></span>
              5 Soruluk Goethe A1 Sınav Modu
            </h2>
            <p className="text-xs text-stone-500">
              Her turda 5 soru, 4 seçenek, anında Türkçe kural açıklaması ve puanlama.
            </p>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {[
              { id: 'all' as SkillCategory, label: 'Karışık (Goethe A1)' },
              { id: 'grammar' as SkillCategory, label: 'Dil Bilgisi' },
              { id: 'vocabulary' as SkillCategory, label: 'Kelime' },
              { id: 'reading' as SkillCategory, label: 'Okuma' },
              { id: 'listening' as SkillCategory, label: 'Dinleme' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  startNew5QuestionRound(cat.id);
                }}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold whitespace-nowrap transition ${
                  selectedCategory === cat.id
                    ? 'bg-[#800020] text-white shadow-2xs'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Question View (Active Round) */}
      {!examFinished ? (
        <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
          {/* Header Progress Strip */}
          <div className="bg-red-50/70 px-4 sm:px-6 py-3 border-b border-red-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#800020] text-white">
                Soru {currentIndex + 1} / 5
              </span>
              <span className="text-xs text-stone-600 font-medium">
                {currentQ.tag}
              </span>
            </div>
            <div className="flex items-center gap-1 text-xs text-[#800020] font-semibold">
              <span className="hidden sm:inline">Tur Puanı:</span>
              <span className="bg-white px-2 py-0.5 rounded border border-red-200 font-bold">
                {answers.filter((a) => a.isCorrect).length} / {answers.length} Doğru
              </span>
            </div>
          </div>

          {/* Progress Bar 1 to 5 */}
          <div className="w-full bg-stone-100 h-1.5">
            <div
              className="bg-[#800020] h-1.5 transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / 5) * 100}%` }}
            ></div>
          </div>

          <div className="p-5 sm:p-7 space-y-6">
            {/* Stimulus Text (Reading notice or Listening Transcript) */}
            {currentQ.stimulusText && (
              <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 text-sm text-stone-800 leading-relaxed font-sans whitespace-pre-line relative">
                <div className="text-[11px] font-bold tracking-wide uppercase text-[#800020] mb-1 flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5" />
                  Sınav Metni / Durum
                </div>
                {currentQ.stimulusText}
              </div>
            )}

            {/* German Question & Audio */}
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-lg sm:text-xl font-bold text-stone-900 leading-snug">
                  {currentQ.questionGerman}
                </h3>
                <button
                  type="button"
                  onClick={() =>
                    handlePlayAudio(
                      currentQ.audioText || currentQ.questionGerman
                    )
                  }
                  className={`p-2 rounded-lg text-white font-medium transition shrink-0 ${
                    isPlayingAudio
                      ? 'bg-amber-600 animate-pulse'
                      : 'bg-[#800020] hover:bg-[#68001a]'
                  }`}
                  title="Almanca telaffuzu dinle"
                  aria-label="Almanca soruyu seslendir"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>

              {currentQ.questionTurkishPrompt && (
                <p className="text-xs sm:text-sm text-stone-600 italic">
                  💡 {currentQ.questionTurkishPrompt}
                </p>
              )}
            </div>

            {/* Hint Action Row */}
            <div className="flex items-center justify-between gap-2 pt-0.5">
              <button
                type="button"
                onClick={() => setShowHint(!showHint)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition border cursor-pointer active:scale-95 ${
                  showHint
                    ? 'bg-amber-100 text-amber-950 border-amber-300 shadow-2xs'
                    : 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100'
                }`}
                title="Goethe A1 sınav stratejisi ve ipucu al"
              >
                <Lightbulb className={`w-3.5 h-3.5 ${showHint ? 'text-amber-700 fill-amber-500' : 'text-amber-600'}`} />
                <span>{showHint ? 'İpucunu Gizle' : 'İpucu Ver'}</span>
              </button>
            </div>

            {/* Hint Box */}
            {showHint && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-xs sm:text-sm text-amber-950 space-y-1 animate-in fade-in duration-200">
                <div className="flex items-center gap-1.5 font-bold text-amber-900 text-xs uppercase tracking-wide">
                  <Lightbulb className="w-4 h-4 text-amber-600 fill-amber-500 shrink-0" />
                  <span>Goethe-Zertifikat A1 Sınav & Dil Bilgisi İpucu</span>
                </div>
                <p className="leading-relaxed text-amber-900/90 pl-5">
                  {currentQ.a1ExamHint || 'Sorudaki anahtar fiil çekimlerine ve ipuçlarına dikkat edin. Başarırsınız!'}
                </p>
              </div>
            )}

            {/* 4 Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentQ.options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === currentQ.correctIndex;

                let btnStyle =
                  'bg-white border-stone-300 text-stone-800 hover:border-[#800020] hover:bg-red-50/40';

                if (isAnswerSubmitted) {
                  if (isCorrect) {
                    btnStyle =
                      'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold ring-2 ring-emerald-300';
                  } else if (isSelected) {
                    btnStyle =
                      'bg-red-50 border-red-500 text-red-900 font-bold ring-2 ring-red-300';
                  } else {
                    btnStyle = 'bg-stone-50 border-stone-200 text-stone-400 opacity-70';
                  }
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectOption(idx)}
                    disabled={isAnswerSubmitted}
                    className={`w-full text-left p-3.5 sm:p-4 rounded-xl border text-sm sm:text-base font-medium transition-all duration-150 flex items-center justify-between gap-3 ${btnStyle} cursor-pointer disabled:cursor-default`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                          isAnswerSubmitted && isCorrect
                            ? 'bg-emerald-600 text-white'
                            : isAnswerSubmitted && isSelected
                            ? 'bg-red-600 text-white'
                            : 'bg-stone-100 text-stone-700 border border-stone-300'
                        }`}
                      >
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span>{opt}</span>
                    </div>

                    {isAnswerSubmitted && isCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    )}
                    {isAnswerSubmitted && isSelected && !isCorrect && (
                      <XCircle className="w-5 h-5 text-red-600 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Turkish Explanation Card (Shows on Answer Selection) */}
            {isAnswerSubmitted && (
              <div
                className={`p-4 rounded-xl border transition-all ${
                  selectedOption === currentQ.correctIndex
                    ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                    : 'bg-red-50/80 border-red-200 text-stone-900'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  {selectedOption === currentQ.correctIndex ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                  ) : (
                    <HelpCircle className="w-5 h-5 text-[#800020] mt-0.5 shrink-0" />
                  )}
                  <div className="space-y-1">
                    <h4 className="font-bold text-sm">
                      {selectedOption === currentQ.correctIndex
                        ? 'Tebrikler, Doğru Cevap!'
                        : 'Yanlış Cevap — Türkçe Kural Açıklaması:'}
                    </h4>
                    <p className="text-xs sm:text-sm leading-relaxed text-stone-700">
                      {currentQ.turkishExplanation}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Action Bar */}
            <div className="pt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={() => startNew5QuestionRound(selectedCategory)}
                className="text-xs text-stone-500 hover:text-stone-800 flex items-center gap-1 font-medium"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Turu Sıfırla
              </button>

              {isAnswerSubmitted && (
                <button
                  type="button"
                  onClick={handleNext}
                  className="bg-[#800020] hover:bg-[#68001a] text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md transition flex items-center gap-2 active:scale-95"
                >
                  <span>{currentIndex < 4 ? 'Sonraki Soru' : 'Sonuçları Gör'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Exam Finished / Results Screen */
        completedResult && (
          <div className="bg-white rounded-2xl shadow-md border border-stone-200 overflow-hidden space-y-6 p-6 sm:p-8">
            {/* Header Result Card */}
            <div className="text-center space-y-3 pb-6 border-b border-stone-200">
              <div
                className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center shadow-inner ${
                  completedResult.passed
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-red-100 text-[#800020]'
                }`}
              >
                <Award className="w-8 h-8" />
              </div>

              <div>
                <span className="text-xs font-bold text-stone-500 uppercase tracking-widest">
                  5 Soruluk Sınav Tamamlandı
                </span>
                <h3 className="text-3xl font-black text-stone-900 mt-1">
                  Puan: {completedResult.score} / 5
                  <span className="text-xl font-normal text-stone-500 ml-2">
                    (%{completedResult.percentage})
                  </span>
                </h3>
              </div>

              <div className="inline-block px-4 py-1.5 rounded-full text-sm font-bold bg-[#800020] text-white shadow-2xs">
                {completedResult.gradeText}
              </div>

              <p className="text-xs text-stone-500 flex items-center justify-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                Süre: {completedResult.timeSpentSeconds} saniye • Sonuçlar profilinize kaydedildi.
              </p>
            </div>

            {/* Questions Breakdown List */}
            <div className="space-y-4">
              <h4 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#800020]" />
                Bu Turdaki Soruların Özeti ve Türkçe Açıklamaları:
              </h4>

              <div className="space-y-3">
                {completedResult.answers.map((ans, i) => (
                  <div
                    key={i}
                    className={`p-4 rounded-xl border text-sm ${
                      ans.isCorrect
                        ? 'bg-emerald-50/50 border-emerald-200'
                        : 'bg-red-50/50 border-red-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="font-bold text-stone-900">
                        Soru {i + 1}: {ans.questionGerman}
                      </span>
                      {ans.isCorrect ? (
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded flex items-center gap-1 shrink-0">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Doğru
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded flex items-center gap-1 shrink-0">
                          <XCircle className="w-3.5 h-3.5" /> Yanlış
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-stone-600 space-y-1 mb-2">
                      <div>
                        <span className="font-semibold text-stone-700">Seçtiğiniz: </span>
                        <span className={ans.isCorrect ? 'text-emerald-700 font-bold' : 'text-red-700 font-bold'}>
                          {ans.options[ans.selectedIndex]}
                        </span>
                      </div>
                      {!ans.isCorrect && (
                        <div>
                          <span className="font-semibold text-emerald-800">Doğru Cevap: </span>
                          <span className="text-emerald-800 font-bold">
                            {ans.options[ans.correctIndex]}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="text-xs bg-white/80 p-2.5 rounded-lg border border-stone-200 text-stone-700 leading-relaxed">
                      <strong className="text-[#800020]">Açıklama:</strong> {ans.turkishExplanation}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-stone-200">
              <button
                type="button"
                onClick={onGoToProgress}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-700 text-sm font-semibold transition"
              >
                Tüm İlerlememi Görüntüle
              </button>

              <button
                type="button"
                onClick={() => startNew5QuestionRound(selectedCategory)}
                className="w-full sm:w-auto bg-[#800020] hover:bg-[#68001a] text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-md transition flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Yeni 5 Soru Başlat
              </button>
            </div>
          </div>
        )
      )}
    </div>
  );
};
