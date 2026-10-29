import React, { useState } from 'react';
import {
  BookOpen,
  Headphones,
  Volume2,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
} from 'lucide-react';
import { ExamQuestion } from '../types.js';
import { A1_QUESTIONS } from '../data/questions.js';
import { speakGerman } from '../utils/speech.js';

interface ReadingListeningTrainerProps {
  mode: 'reading' | 'listening' | 'grammar';
  completedIds: string[];
  onCompleteExercise: (questionId: string, isCorrect: boolean) => void;
}

export const ReadingListeningTrainer: React.FC<ReadingListeningTrainerProps> = ({
  mode,
  completedIds,
  onCompleteExercise,
}) => {
  const questions: ExamQuestion[] = A1_QUESTIONS.filter(
    (q) => q.category === mode
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const currentQ = questions[currentIndex] || questions[0];

  const handleSelectOption = (idx: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(idx);
    const isCorrect = idx === currentQ.correctIndex;
    onCompleteExercise(currentQ.id, isCorrect);
  };

  const handleNext = () => {
    setSelectedOption(null);
    setCurrentIndex((prev) => (prev + 1) % questions.length);
  };

  const handlePlayAudio = (text: string) => {
    setIsPlayingAudio(true);
    speakGerman(
      text,
      0.85,
      () => setIsPlayingAudio(false),
      () => setIsPlayingAudio(false)
    );
  };

  const titles = {
    reading: {
      title: 'Goethe A1 Okuma Alıştırmaları (Lesen)',
      subtitle: 'Kısa duyurular, afişler, e-postalar ve tabelaları okuyup 4 seçenekli soruları cevaplayın.',
      badge: 'Lesen',
    },
    listening: {
      title: 'Goethe A1 Dinleme Alıştırmaları (Hören)',
      subtitle: 'İstasyon anonsları ve günlük telefon konuşmalarını dinleyip soruları cevaplayın.',
      badge: 'Hören',
    },
    grammar: {
      title: 'Goethe A1 Dil Bilgisi Alıştırmaları (Grammatik)',
      subtitle: 'Fiil çekimleri, ayrılabilen fiiller, Akkusativ ve Dativ kurallarını pekiştirin.',
      badge: 'Grammatik',
    },
  };

  const activeMeta = titles[mode];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-xs border border-stone-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#800020]"></span>
            <h2 className="text-lg font-bold text-stone-900">{activeMeta.title}</h2>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">{activeMeta.subtitle}</p>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-stone-600 bg-stone-100 px-3 py-1.5 rounded-xl self-start sm:self-auto">
          <span>{currentIndex + 1} / {questions.length} Soru</span>
        </div>
      </div>

      {/* Main Question Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
        {/* Header Strip */}
        <div className="bg-red-50/70 p-4 border-b border-red-100 flex items-center justify-between">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#800020] text-white">
            {currentQ.tag}
          </span>
          {completedIds.includes(currentQ.id) && (
            <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Önceden Çözüldü
            </span>
          )}
        </div>

        <div className="p-5 sm:p-7 space-y-5">
          {/* Stimulus / Reading Notice or Listening Script */}
          {currentQ.stimulusText && (
            <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 text-xs sm:text-sm text-stone-800 whitespace-pre-line leading-relaxed font-sans">
              <div className="text-[11px] font-bold text-[#800020] uppercase tracking-wider mb-1.5 flex items-center gap-1">
                {mode === 'listening' ? <Headphones className="w-3.5 h-3.5" /> : <BookOpen className="w-3.5 h-3.5" />}
                {mode === 'listening' ? 'Sesli Metin / Anons' : 'Sınav Metni'}
              </div>
              {currentQ.stimulusText}
            </div>
          )}

          {/* Question German and Audio button */}
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <h3 className="text-base sm:text-lg font-bold text-stone-900">
                {currentQ.questionGerman}
              </h3>
              {currentQ.questionTurkishPrompt && (
                <p className="text-xs text-stone-500 italic">
                  💡 {currentQ.questionTurkishPrompt}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={() => handlePlayAudio(currentQ.audioText || currentQ.questionGerman)}
              className={`p-2.5 rounded-xl text-white font-medium transition shrink-0 ${
                isPlayingAudio ? 'bg-amber-600 animate-pulse' : 'bg-[#800020] hover:bg-[#68001a]'
              }`}
              title="Almanca sesi dinle"
              aria-label="Metni seslendir"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>

          {/* 4 Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === currentQ.correctIndex;

              let btnStyle =
                'bg-white border-stone-300 text-stone-800 hover:border-[#800020] hover:bg-red-50/40';

              if (selectedOption !== null) {
                if (isCorrect) {
                  btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold ring-2 ring-emerald-300';
                } else if (isSelected) {
                  btnStyle = 'bg-red-50 border-red-500 text-red-900 font-bold ring-2 ring-red-300';
                } else {
                  btnStyle = 'bg-stone-50 border-stone-200 text-stone-400 opacity-70';
                }
              }

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectOption(idx)}
                  disabled={selectedOption !== null}
                  className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm font-medium transition flex items-center justify-between gap-3 ${btnStyle} cursor-pointer disabled:cursor-default`}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold shrink-0 ${
                        selectedOption !== null && isCorrect
                          ? 'bg-emerald-600 text-white'
                          : selectedOption !== null && isSelected
                          ? 'bg-red-600 text-white'
                          : 'bg-stone-100 text-stone-700'
                      }`}
                    >
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{opt}</span>
                  </div>

                  {selectedOption !== null && isCorrect && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  )}
                  {selectedOption !== null && isSelected && !isCorrect && (
                    <XCircle className="w-4 h-4 text-red-600 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Turkish Explanation Card */}
          {selectedOption !== null && (
            <div
              className={`p-4 rounded-xl border space-y-1.5 ${
                selectedOption === currentQ.correctIndex
                  ? 'bg-emerald-50/80 border-emerald-200'
                  : 'bg-red-50/80 border-red-200'
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-xs sm:text-sm text-stone-900">
                <HelpCircle className="w-4 h-4 text-[#800020]" />
                <span>
                  {selectedOption === currentQ.correctIndex
                    ? 'Doğru! Türkçe Kural ve Açıklama:'
                    : 'Yanlış Cevap! Türkçe Kural ve Açıklama:'}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                {currentQ.turkishExplanation}
              </p>
            </div>
          )}

          {/* Navigation Action */}
          <div className="pt-2 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setSelectedOption(null)}
              className="text-xs text-stone-500 hover:text-stone-800 flex items-center gap-1 font-medium"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Tekrar Dene
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="bg-[#800020] hover:bg-[#68001a] text-white px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-md transition active:scale-95"
            >
              Sonraki Soru ({currentIndex + 1} / {questions.length})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
