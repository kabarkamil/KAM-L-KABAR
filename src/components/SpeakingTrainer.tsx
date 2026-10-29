import React, { useState } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  ArrowRight,
  Send,
  BookOpen,
  MessageSquare,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { SpeakingPrompt, SpeakingEvaluationResult } from '../types.js';
import { SPEAKING_PROMPTS } from '../data/speakingPrompts.js';
import { evaluateSpeakingAnswer } from '../utils/rules.js';
import {
  speakGerman,
  isSpeechRecognitionSupported,
  startGermanSpeechRecognition,
} from '../utils/speech.js';
import { GermanKeyboardHelper } from './GermanKeyboardHelper.js';

interface SpeakingTrainerProps {
  onRecordSpeaking: (
    promptId: string,
    answer: string,
    evalResult: SpeakingEvaluationResult
  ) => void;
}

export const SpeakingTrainer: React.FC<SpeakingTrainerProps> = ({
  onRecordSpeaking,
}) => {
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [studentInput, setStudentInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [recognitionSession, setRecognitionSession] = useState<{
    stop: () => void;
  } | null>(null);
  const [evaluation, setEvaluation] = useState<SpeakingEvaluationResult | null>(
    null
  );
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);

  const currentPrompt: SpeakingPrompt = SPEAKING_PROMPTS[currentPromptIndex];
  const hasSTT = isSpeechRecognitionSupported();

  const handlePlayPromptAudio = () => {
    setIsPlayingAudio(true);
    speakGerman(
      currentPrompt.audioPromptText,
      0.85,
      () => setIsPlayingAudio(false),
      () => setIsPlayingAudio(false)
    );
  };

  const handlePlayModelAnswerAudio = (text: string) => {
    speakGerman(text, 0.85);
  };

  const toggleMic = () => {
    setSpeechError(null);
    if (isListening) {
      recognitionSession?.stop();
      setIsListening(false);
      setRecognitionSession(null);
      return;
    }

    const session = startGermanSpeechRecognition(
      (transcript, isFinal) => {
        setStudentInput(transcript);
        if (isFinal) {
          setIsListening(false);
          setRecognitionSession(null);
        }
      },
      (error) => {
        setSpeechError(error);
        setIsListening(false);
        setRecognitionSession(null);
      },
      () => {
        setIsListening(false);
        setRecognitionSession(null);
      }
    );

    if (session) {
      setRecognitionSession(session);
      setIsListening(true);
    }
  };

  const handleSubmitAnswer = () => {
    if (!studentInput.trim()) return;

    const result = evaluateSpeakingAnswer(currentPrompt, studentInput);
    setEvaluation(result);
    onRecordSpeaking(currentPrompt.id, studentInput, result);
  };

  const handleNextPrompt = () => {
    const nextIdx = (currentPromptIndex + 1) % SPEAKING_PROMPTS.length;
    setCurrentPromptIndex(nextIdx);
    setStudentInput('');
    setEvaluation(null);
    setSpeechError(null);
    if (isListening) {
      recognitionSession?.stop();
      setIsListening(false);
    }
  };

  const handleInsertChar = (char: string) => {
    setStudentInput((prev) => prev + char);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Title & Teil info */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-xs border border-stone-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#800020]"></span>
              <h2 className="text-lg font-bold text-stone-900">
                Goethe A1 Konuşma Provası (Sprechen)
              </h2>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Sanal sınav gözetmeni tek soru yöneltir. Cevabınızı verin, ardından detaylı dil bilgisi, kelime ve nezaket analizini inceleyin.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-[#800020]">
              {currentPrompt.teilTitle}
            </span>
            <span className="text-xs text-stone-400 font-medium">
              {currentPromptIndex + 1} / {SPEAKING_PROMPTS.length}
            </span>
          </div>
        </div>
      </div>

      {/* Main Single Question Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
        {/* Examiner Prompt Header */}
        <div className="bg-[#800020] text-white p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-xs uppercase tracking-wider text-red-200 font-bold flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5" />
              Sanal Gözetmen Sorusu
            </div>
            <div className="text-xl sm:text-2xl font-black text-white tracking-tight">
              „{currentPrompt.germanQuestion}“
            </div>
          </div>

          <button
            type="button"
            onClick={handlePlayPromptAudio}
            disabled={isPlayingAudio}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-[#800020] bg-white hover:bg-red-50 shadow-sm transition active:scale-95 shrink-0 ${
              isPlayingAudio ? 'animate-pulse' : ''
            }`}
            title="Soruyu seslendir"
            aria-label="Sorunun Almanca okunuşunu dinle"
          >
            <Volume2 className="w-4 h-4" />
            <span>{isPlayingAudio ? 'Seslendiriliyor...' : 'Soruyu Dinle'}</span>
          </button>
        </div>

        <div className="p-5 sm:p-7 space-y-5">
          {/* Situation Context in Turkish */}
          <div className="bg-stone-50 border border-stone-200 rounded-xl p-3.5 text-xs sm:text-sm text-stone-700 leading-relaxed flex items-start gap-2.5">
            <BookOpen className="w-4 h-4 text-[#800020] mt-0.5 shrink-0" />
            <div>
              <span className="font-bold text-stone-900">Sınav Durumu: </span>
              {currentPrompt.turkishContext}
              <div className="text-[11px] text-stone-500 mt-1">
                💡 <strong>İpucu:</strong> {currentPrompt.hintTurkish}
              </div>
            </div>
          </div>

          {/* Student Answer Input Section */}
          <div className="space-y-3">
            <label
              htmlFor="student-speaking-input"
              className="block text-xs font-bold uppercase tracking-wider text-stone-700"
            >
              Cevabınız (Almanca):
            </label>

            <div className="relative">
              <textarea
                id="student-speaking-input"
                rows={3}
                value={studentInput}
                onChange={(e) => setStudentInput(e.target.value)}
                placeholder="Cevabınızı buraya yazın veya mikrofona basarak konuşun..."
                className="w-full p-3.5 rounded-xl border border-stone-300 focus:border-[#800020] focus:ring-2 focus:ring-red-100 text-stone-900 text-sm sm:text-base outline-none resize-none transition"
              />

              {/* Floating Mic Button inside textarea */}
              <button
                type="button"
                onClick={toggleMic}
                aria-label={
                  isListening ? 'Mikrofonu durdur' : 'Mikrofonla Almanca konuş'
                }
                className={`absolute right-3 bottom-3 p-2.5 rounded-xl text-white font-semibold transition-all active:scale-95 flex items-center gap-1.5 shadow-sm ${
                  isListening
                    ? 'bg-red-600 animate-ping ring-4 ring-red-200'
                    : 'bg-[#800020] hover:bg-[#68001a]'
                }`}
                title={
                  hasSTT
                    ? 'Mikrofonla konuş (Almanca ses tanıma)'
                    : 'Mikrofon bu tarayıcıda kısıtlı, yazarak cevap verebilirsiniz'
                }
              >
                {isListening ? (
                  <>
                    <MicOff className="w-4 h-4" />
                    <span className="text-xs">Dinleniyor...</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-4 h-4" />
                    <span className="text-xs hidden sm:inline">Konuş</span>
                  </>
                )}
              </button>
            </div>

            {speechError && (
              <p className="text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {speechError}
              </p>
            )}

            {/* German Umlaut Keyboard toolbar */}
            <GermanKeyboardHelper onInsertChar={handleInsertChar} />

            {/* Submit Action */}
            <div className="pt-2 flex items-center justify-between">
              <span className="text-xs text-stone-400">
                {studentInput.trim().split(/\s+/).filter(Boolean).length} kelime
              </span>

              <button
                type="button"
                onClick={handleSubmitAnswer}
                disabled={!studentInput.trim()}
                className="bg-[#800020] hover:bg-[#68001a] disabled:bg-stone-300 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md transition flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed active:scale-95"
              >
                <Send className="w-4 h-4" />
                <span>Cevabı Analiz Et</span>
              </button>
            </div>
          </div>

          {/* DETAILED ANALYSIS & TURKISH FEEDBACK DISPLAY */}
          {evaluation && (
            <div
              className={`rounded-2xl border p-5 sm:p-6 space-y-5 animate-in fade-in duration-300 ${
                evaluation.isCorrect
                  ? 'bg-emerald-50/70 border-emerald-300'
                  : 'bg-red-50/70 border-red-300'
              }`}
            >
              {/* Header Analysis Pill */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-stone-200">
                <div className="flex items-center gap-2.5">
                  {evaluation.isCorrect ? (
                    <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                  ) : (
                    <div className="w-9 h-9 rounded-xl bg-[#800020] text-white flex items-center justify-center font-bold">
                      <AlertCircle className="w-5 h-5" />
                    </div>
                  )}
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                      Konuşma Analizi & Puan
                    </span>
                    <h4 className="text-base sm:text-lg font-black text-stone-900 leading-tight">
                      {evaluation.analysis.overallVerdictTurkish}
                    </h4>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-extrabold ${
                      evaluation.score >= 80
                        ? 'bg-emerald-700 text-white'
                        : evaluation.score >= 60
                        ? 'bg-amber-600 text-white'
                        : 'bg-[#800020] text-white'
                    }`}
                  >
                    Puan: {evaluation.score} / 100
                  </span>
                </div>
              </div>

              {/* General Feedback Text */}
              <p className="text-sm text-stone-800 font-medium leading-relaxed">
                {evaluation.feedbackTurkish}
              </p>

              {/* 4 Multi-Factor Detailed Analysis Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* 1. Grammar Card */}
                <div className="bg-white p-3.5 rounded-xl border border-stone-200 space-y-1 shadow-2xs">
                  <div className="font-bold text-stone-900 flex items-center justify-between">
                    <span>1. Dil Bilgisi & Fiil Çekimi:</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        evaluation.analysis.grammarRating === 'perfect'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {evaluation.analysis.grammarRating === 'perfect'
                        ? 'Kusursuz'
                        : 'Düzeltme Var'}
                    </span>
                  </div>
                  <p className="text-stone-600 leading-relaxed">
                    {evaluation.analysis.grammarFeedbackTurkish}
                  </p>
                </div>

                {/* 2. Vocabulary Card */}
                <div className="bg-white p-3.5 rounded-xl border border-stone-200 space-y-1 shadow-2xs">
                  <div className="font-bold text-stone-900 flex items-center justify-between">
                    <span>2. Kelime & Soru Uyumu:</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        evaluation.analysis.vocabularyRating === 'rich'
                          ? 'bg-emerald-100 text-emerald-800'
                          : evaluation.analysis.vocabularyRating === 'adequate'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {evaluation.analysis.vocabularyRating === 'rich'
                        ? 'Zengin'
                        : evaluation.analysis.vocabularyRating === 'adequate'
                        ? 'Yeterli'
                        : 'Geliştirilmeli'}
                    </span>
                  </div>
                  <p className="text-stone-600 leading-relaxed">
                    {evaluation.analysis.vocabularyFeedbackTurkish}
                  </p>
                </div>

                {/* 3. Sentence Structure Card */}
                <div className="bg-white p-3.5 rounded-xl border border-stone-200 space-y-1 shadow-2xs">
                  <div className="font-bold text-stone-900 flex items-center justify-between">
                    <span>3. Cümle Yapısı & Söz Dizimi:</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        evaluation.analysis.structureRating === 'proper'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {evaluation.analysis.structureRating === 'proper'
                        ? 'Düzgün Cümle'
                        : 'Eksik'}
                    </span>
                  </div>
                  <p className="text-stone-600 leading-relaxed">
                    {evaluation.analysis.structureFeedbackTurkish}
                  </p>
                </div>

                {/* 4. Politeness & Exam Jury Strategy Card */}
                <div className="bg-white p-3.5 rounded-xl border border-stone-200 space-y-1 shadow-2xs">
                  <div className="font-bold text-stone-900 flex items-center justify-between">
                    <span>4. Nezaket & Jüri Tüyosu:</span>
                    <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded text-[10px] font-bold">
                      A1 Stratejisi
                    </span>
                  </div>
                  <p className="text-stone-600 leading-relaxed">
                    {evaluation.analysis.politenessTipTurkish}
                  </p>
                </div>
              </div>

              {/* Model Solution & Alternatives */}
              <div className="bg-white p-4 rounded-xl border border-stone-300 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#800020] uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Örnek Model Yanıt (Musterantwort):
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      handlePlayModelAnswerAudio(evaluation.modelAnswer)
                    }
                    className="text-xs text-[#800020] hover:text-[#580512] font-semibold flex items-center gap-1"
                    title="Model cevabı dinle"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Modeli Dinle</span>
                  </button>
                </div>

                <div className="text-sm sm:text-base font-bold text-stone-900 bg-stone-50 p-3 rounded-lg border border-stone-200">
                  „{evaluation.modelAnswer}“
                </div>

                {evaluation.analysis.alternativeExpressions.length > 1 && (
                  <div className="space-y-1 text-xs">
                    <span className="font-semibold text-stone-600">
                      Alternatif Doğal İfadeler:
                    </span>
                    <ul className="list-disc list-inside space-y-0.5 text-stone-700 pl-1">
                      {evaluation.analysis.alternativeExpressions
                        .filter((expr) => expr !== evaluation.modelAnswer)
                        .map((expr, i) => (
                          <li key={i}>{expr}</li>
                        ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Next Question Button */}
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleNextPrompt}
                  className="bg-[#800020] hover:bg-[#68001a] text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md transition flex items-center gap-2 active:scale-95"
                >
                  <span>Sonraki Soruya Geç</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
