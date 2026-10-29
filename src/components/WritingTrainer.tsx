import React, { useState } from 'react';
import {
  PenTool,
  CheckCircle2,
  AlertCircle,
  FileText,
  Sparkles,
  Send,
  Eye,
  Check,
  Lightbulb,
} from 'lucide-react';
import { WritingPrompt } from '../types.js';
import { WRITING_PROMPTS } from '../data/writingPrompts.js';
import { checkWritingRequirements } from '../utils/rules.js';
import { GermanKeyboardHelper } from './GermanKeyboardHelper.js';

interface WritingTrainerProps {
  onRecordWriting: (
    promptId: string,
    type: 'formular' | 'brief',
    text: string,
    score: number,
    passed: boolean
  ) => void;
}

export const WritingTrainer: React.FC<WritingTrainerProps> = ({
  onRecordWriting,
}) => {
  const [selectedPromptIndex, setSelectedPromptIndex] = useState(0);
  const [studentText, setStudentText] = useState('');
  const [formInputs, setFormInputs] = useState<Record<string, string>>({});
  const [showSample, setShowSample] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [evaluation, setEvaluation] = useState<{
    score: number;
    passed: boolean;
    wordCount: number;
    matchedPoints: string[];
    missingPoints: string[];
    feedbackTurkish: string;
  } | null>(null);

  const prompt: WritingPrompt = WRITING_PROMPTS[selectedPromptIndex];

  const handleFormInputChange = (label: string, value: string) => {
    setFormInputs((prev) => ({ ...prev, [label]: value }));
  };

  const handleEvaluateForm = () => {
    if (!prompt.formFields) return;

    let correctCount = 0;
    prompt.formFields.forEach((field) => {
      const val = (formInputs[field.labelGerman] || '').trim().toLowerCase();
      if (val === field.correctValue.toLowerCase()) {
        correctCount += 1;
      }
    });

    const score = Math.round((correctCount / prompt.formFields.length) * 100);
    const passed = score >= 60;

    const summaryText = Object.entries(formInputs)
      .map(([k, v]) => `${k}: ${v}`)
      .join(', ');

    setEvaluation({
      score,
      passed,
      wordCount: prompt.formFields.length,
      matchedPoints: [`${correctCount} / ${prompt.formFields.length} doğru alan`],
      missingPoints: [],
      feedbackTurkish: passed
        ? `Tebrikler! ${correctCount}/${prompt.formFields.length} alanı doğru doldurdunuz. Goethe A1 Formular barajını geçtiniz.`
        : `Formda bazı alanlar yanlış veya boş (${correctCount}/${prompt.formFields.length}). Örnek çözümü inceleyerek tekrar deneyiniz.`,
    });

    onRecordWriting(prompt.id, 'formular', summaryText, score, passed);
  };

  const handleEvaluateEmail = () => {
    const result = checkWritingRequirements(prompt, studentText);
    setEvaluation(result);
    onRecordWriting(
      prompt.id,
      'brief',
      studentText,
      result.score,
      result.passed
    );
  };

  const handleInsertChar = (char: string) => {
    setStudentText((prev) => prev + char);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Top Selector Card */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-xs border border-stone-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#800020]"></span>
              <h2 className="text-lg font-bold text-stone-900">
                Goethe A1 Yazma Atölyesi (Schreiben)
              </h2>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Teil 1 (Form Doldurma) ve Teil 2 (Kısa E-posta Yazma) alıştırmaları.
            </p>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {WRITING_PROMPTS.map((p, idx) => (
              <button
                key={p.id}
                onClick={() => {
                  setSelectedPromptIndex(idx);
                  setStudentText('');
                  setFormInputs({});
                  setEvaluation(null);
                  setShowSample(false);
                  setShowHint(false);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                  selectedPromptIndex === idx
                    ? 'bg-[#800020] text-white shadow-2xs'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                {p.goetheTeil}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Task Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
        {/* Header */}
        <div className="bg-red-50/70 p-4 sm:p-5 border-b border-red-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#800020] text-white">
              {prompt.goetheTeil}
            </span>
            <span className="text-sm font-bold text-stone-900">{prompt.title}</span>
          </div>
          <span className="text-xs text-stone-500 hidden sm:inline">
            Goethe A1 Sınav Formatı
          </span>
        </div>

        <div className="p-5 sm:p-7 space-y-6">
          {/* Situation Context */}
          <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 text-xs sm:text-sm text-stone-800 space-y-2">
            <div>
              <span className="font-bold text-stone-900">Durum (Almanca): </span>
              <span className="italic">„{prompt.situationGerman}“</span>
            </div>
            <div>
              <span className="font-bold text-stone-900">Türkçe Açıklama: </span>
              <span>{prompt.situationTurkish}</span>
            </div>
          </div>

          {/* Action Row: Hint Button */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setShowHint(!showHint)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition border cursor-pointer active:scale-95 ${
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

          {/* Motivating Goethe A1 Hint Card */}
          {showHint && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-xs sm:text-sm text-amber-950 space-y-1 animate-in fade-in duration-200">
              <div className="flex items-center gap-1.5 font-bold text-amber-900 text-xs uppercase tracking-wide">
                <Lightbulb className="w-4 h-4 text-amber-600 fill-amber-500 shrink-0" />
                <span>Goethe-Zertifikat A1 Yazma (Schreiben) & Dil Bilgisi İpucu</span>
              </div>
              <p className="leading-relaxed text-amber-900/90 pl-5">
                {prompt.a1ExamHint || 'Sorudaki 3 maddeyi ayrı cümlelerde yanıtlayın ve selamlama kalıplarını unutmayın!'}
              </p>
            </div>
          )}

          {/* Teil 1: Formular ausfüllen */}
          {prompt.type === 'formular' && prompt.formFields && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
                Form Alanlarını Doldurunuz:
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {prompt.formFields.map((field) => (
                  <div key={field.labelGerman} className="space-y-1">
                    <label className="block text-xs font-semibold text-stone-700">
                      {field.labelGerman}{' '}
                      <span className="text-stone-400 font-normal">
                        ({field.labelTurkish})
                      </span>
                    </label>

                    {field.options ? (
                      <select
                        value={formInputs[field.labelGerman] || ''}
                        onChange={(e) =>
                          handleFormInputChange(field.labelGerman, e.target.value)
                        }
                        className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-stone-300 bg-white focus:border-[#800020] outline-none"
                      >
                        <option value="">Seçiniz...</option>
                        {field.options.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        value={formInputs[field.labelGerman] || ''}
                        onChange={(e) =>
                          handleFormInputChange(field.labelGerman, e.target.value)
                        }
                        placeholder={field.labelGerman}
                        className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-stone-300 focus:border-[#800020] outline-none"
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleEvaluateForm}
                  className="bg-[#800020] hover:bg-[#68001a] text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md transition active:scale-95 flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Formu Kontrol Et & Kaydet</span>
                </button>
              </div>
            </div>
          )}

          {/* Teil 2: E-Mail / Brief schreiben */}
          {prompt.type === 'brief' && (
            <div className="space-y-4">
              {/* Checklist Requirements */}
              <div className="bg-red-50/50 border border-red-100 rounded-xl p-3.5 space-y-1.5">
                <span className="text-xs font-bold text-[#800020] uppercase tracking-wider block">
                  Metninizde Yer Alması Gereken 3 Nokta (Punkte):
                </span>
                <ul className="space-y-1 text-xs text-stone-700">
                  {prompt.requiredPoints.map((pt, i) => (
                    <li key={i} className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#800020]"></span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Text Area */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <label
                    htmlFor="student-writing-text"
                    className="font-bold uppercase tracking-wider text-stone-700"
                  >
                    Almanca E-posta / Mektubunuz:
                  </label>
                  <span
                    className={`font-semibold ${
                      studentText.trim().split(/\s+/).filter(Boolean).length >=
                      (prompt.minWords || 25)
                        ? 'text-emerald-700'
                        : 'text-stone-500'
                    }`}
                  >
                    Kelime: {studentText.trim().split(/\s+/).filter(Boolean).length} / Hedef:{' '}
                    {prompt.minWords || 25}
                  </span>
                </div>

                <textarea
                  id="student-writing-text"
                  rows={6}
                  value={studentText}
                  onChange={(e) => setStudentText(e.target.value)}
                  placeholder="Lieber Thomas, vielen Dank für die Einladung..."
                  className="w-full p-4 rounded-xl border border-stone-300 focus:border-[#800020] focus:ring-2 focus:ring-red-100 text-stone-900 text-sm font-sans outline-none resize-y"
                />

                <GermanKeyboardHelper onInsertChar={handleInsertChar} />
              </div>

              {/* Submit & Sample Solution Toggle */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSample(!showSample)}
                  className="text-xs text-[#800020] hover:underline font-semibold flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{showSample ? 'Model Çözümü Gizle' : 'Örnek Model Çözümü Göster'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleEvaluateEmail}
                  disabled={!studentText.trim()}
                  className="w-full sm:w-auto bg-[#800020] hover:bg-[#68001a] disabled:bg-stone-300 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed active:scale-95"
                >
                  <Send className="w-4 h-4" />
                  <span>Metni Değerlendir & Kaydet</span>
                </button>
              </div>
            </div>
          )}

          {/* Model Solution Box */}
          {showSample && (
            <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 text-xs sm:text-sm space-y-2">
              <div className="font-bold text-amber-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-700" />
                Örnek Model Çözüm (Musterlösung):
              </div>
              <pre className="font-sans whitespace-pre-line text-stone-800 bg-white p-3 rounded-lg border border-amber-200 text-xs sm:text-sm">
                {prompt.sampleSolution}
              </pre>
              <p className="text-[11px] text-stone-600">
                💡 <strong>Tavsiye:</strong> {prompt.guidanceTurkish}
              </p>
            </div>
          )}

          {/* Feedback Card */}
          {evaluation && (
            <div
              className={`p-4 rounded-xl border space-y-2 ${
                evaluation.passed
                  ? 'bg-emerald-50/70 border-emerald-300'
                  : 'bg-red-50/70 border-red-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {evaluation.passed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-[#800020]" />
                  )}
                  <span className="font-bold text-stone-900 text-sm">
                    {evaluation.passed ? 'Başarılı Değerlendirme' : 'Geliştirilmeli'}
                  </span>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#800020] text-white">
                  Puan: {evaluation.score} / 100
                </span>
              </div>

              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                {evaluation.feedbackTurkish}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
