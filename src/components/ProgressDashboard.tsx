import React, { useState } from 'react';
import {
  Award,
  BookMarked,
  SpellCheck,
  BookOpen,
  Headphones,
  Mic,
  PenTool,
  Clock,
  CheckCircle2,
  XCircle,
  Calendar,
  Download,
  Trash2,
  ChevronRight,
  AlertCircle,
  FileCheck2,
  Sparkles,
} from 'lucide-react';
import { UserAccount, DetailedUserProgress } from '../utils/storage.js';
import { ExamResult } from '../types.js';
import { VOCABULARY_LIST } from '../data/vocabulary.js';
import { A1_QUESTIONS } from '../data/questions.js';

interface ProgressDashboardProps {
  activeUser: UserAccount;
  progress: DetailedUserProgress;
  onClearProgress: () => void;
  onOpenAuthModal: () => void;
}

export const ProgressDashboard: React.FC<ProgressDashboardProps> = ({
  activeUser,
  progress,
  onClearProgress,
  onOpenAuthModal,
}) => {
  const [selectedReviewExam, setSelectedReviewExam] = useState<ExamResult | null>(
    null
  );

  // Skill Metrics
  const totalVocab = VOCABULARY_LIST.length;
  const learnedVocab = progress.learnedWordIds.length;
  const vocabPct = Math.round((learnedVocab / totalVocab) * 100);

  const totalGrammarQ = A1_QUESTIONS.filter((q) => q.category === 'grammar').length;
  const completedGrammar = progress.completedGrammarIds.length;
  const grammarPct = Math.min(100, Math.round((completedGrammar / totalGrammarQ) * 100));

  const totalReadingQ = A1_QUESTIONS.filter((q) => q.category === 'reading').length;
  const completedReading = progress.completedReadingIds.length;
  const readingPct = Math.min(100, Math.round((completedReading / totalReadingQ) * 100));

  const totalListeningQ = A1_QUESTIONS.filter((q) => q.category === 'listening').length;
  const completedListening = progress.completedListeningIds.length;
  const listeningPct = Math.min(100, Math.round((completedListening / totalListeningQ) * 100));

  const speakingCount = Object.keys(progress.completedSpeaking).length;
  const speakingPct = Math.min(100, Math.round((speakingCount / 6) * 100));

  const writingCount = Object.keys(progress.completedWriting).length;
  const writingPct = Math.min(100, Math.round((writingCount / 3) * 100));

  // Overall Goethe A1 readiness index
  const readinessIndex = Math.round(
    (vocabPct + grammarPct + readingPct + listeningPct + speakingPct + writingPct) / 6
  );

  // Exam stats
  const totalExams = progress.examHistory.length;
  const passedExams = progress.examHistory.filter((e) => e.passed).length;
  const avgScore =
    totalExams > 0
      ? (
          progress.examHistory.reduce((acc, e) => acc + e.score, 0) / totalExams
        ).toFixed(1)
      : '0.0';

  // Target exam date calculation
  const targetDate = new Date(activeUser.targetExamDate);
  const now = new Date();
  const diffDays = Math.ceil(
    (targetDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );

  const handleExportData = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(
        JSON.stringify(
          {
            user: activeUser,
            progress,
            exportedAt: new Date().toISOString(),
          },
          null,
          2
        )
      );
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute(
      'download',
      `deutschtrainer_progress_${activeUser.name.toLowerCase().replace(/\s+/g, '_')}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Student Profile Card */}
      <div className="bg-white rounded-2xl p-5 sm:p-7 shadow-xs border border-stone-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-2xl text-white flex items-center justify-center text-2xl font-black shadow-inner shrink-0"
              style={{ backgroundColor: activeUser.avatarColor || '#800020' }}
            >
              {activeUser.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-stone-900">
                  {activeUser.name}
                </h2>
                <span className="text-xs bg-red-100 text-[#800020] px-2.5 py-0.5 rounded-full font-bold">
                  Goethe A1 Öğrencisi
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">{activeUser.email}</p>
              <div className="flex items-center gap-3 text-xs text-stone-600 mt-2">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#800020]" />
                  Hedef Sınav: <strong>{activeUser.targetExamDate}</strong>
                </span>
                <span className="text-stone-300">•</span>
                <span className="text-xs font-semibold text-[#800020]">
                  {diffDays > 0 ? `${diffDays} gün kaldı` : 'Sınav tarihi geldi!'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={onOpenAuthModal}
              className="px-3.5 py-2 text-xs font-bold rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-700 transition"
            >
              Profili Değiştir / Düzenle
            </button>
            <button
              type="button"
              onClick={handleExportData}
              className="p-2 text-stone-600 hover:text-[#800020] hover:bg-red-50 rounded-xl border border-stone-200 transition"
              title="İlerleme verilerini JSON olarak indir"
              aria-label="Verileri dışa aktar"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => {
                if (
                  window.confirm(
                    'Tüm sınav geçmişiniz ve kayıtlı ilerlemeniz silinecektir. Emin misiniz?'
                  )
                ) {
                  onClearProgress();
                }
              }}
              className="p-2 text-stone-400 hover:text-red-700 hover:bg-red-50 rounded-xl border border-stone-200 transition"
              title="İlerleme verilerini sıfırla"
              aria-label="İlerlemeyi sıfırla"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Readiness Index & 6 Skills Overview */}
      <div className="bg-white rounded-2xl p-5 sm:p-7 shadow-xs border border-stone-200 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-stone-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#800020]" />
              Goethe-Zertifikat A1 Hazırlık Göstergesi
            </h3>
            <p className="text-xs text-stone-500">
              Kelime, dil bilgisi, okuma, dinleme, konuşma ve yazma olmak üzere 6 temel alandaki toplam başarı durumunuz.
            </p>
          </div>

          <div className="text-right self-start sm:self-auto">
            <div className="text-2xl sm:text-3xl font-black text-[#800020]">
              %{readinessIndex}
            </div>
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
              {readinessIndex >= 80
                ? 'Sınava Çok Hazır'
                : readinessIndex >= 60
                ? 'Geçer Barajda'
                : 'Hazırlık Sürüyor'}
            </span>
          </div>
        </div>

        {/* Global Progress bar */}
        <div className="w-full bg-stone-100 h-3 rounded-full overflow-hidden p-0.5 border border-stone-200">
          <div
            className="bg-[#800020] h-full rounded-full transition-all duration-500"
            style={{ width: `${readinessIndex}%` }}
          ></div>
        </div>

        {/* 6 Skill Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
          {/* 1. Kelime (Wortschatz) */}
          <div className="p-3.5 rounded-xl border border-stone-200 bg-stone-50/70 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-stone-700">
              <span className="flex items-center gap-1.5">
                <BookMarked className="w-4 h-4 text-[#800020]" />
                Kelime (Wortschatz)
              </span>
              <span className="text-[#800020]">%{vocabPct}</span>
            </div>
            <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#800020] h-full rounded-full"
                style={{ width: `${vocabPct}%` }}
              ></div>
            </div>
            <p className="text-[11px] text-stone-500">
              {learnedVocab} / {totalVocab} kelime pekiştirildi
            </p>
          </div>

          {/* 2. Dil Bilgisi (Grammatik) */}
          <div className="p-3.5 rounded-xl border border-stone-200 bg-stone-50/70 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-stone-700">
              <span className="flex items-center gap-1.5">
                <SpellCheck className="w-4 h-4 text-blue-700" />
                Dil Bilgisi
              </span>
              <span className="text-blue-700">%{grammarPct}</span>
            </div>
            <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-blue-700 h-full rounded-full"
                style={{ width: `${grammarPct}%` }}
              ></div>
            </div>
            <p className="text-[11px] text-stone-500">
              {completedGrammar} / {totalGrammarQ} kural çözüldü
            </p>
          </div>

          {/* 3. Okuma (Lesen) */}
          <div className="p-3.5 rounded-xl border border-stone-200 bg-stone-50/70 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-stone-700">
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-emerald-700" />
                Okuma (Lesen)
              </span>
              <span className="text-emerald-700">%{readingPct}</span>
            </div>
            <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-emerald-700 h-full rounded-full"
                style={{ width: `${readingPct}%` }}
              ></div>
            </div>
            <p className="text-[11px] text-stone-500">
              {completedReading} / {totalReadingQ} metin incelendi
            </p>
          </div>

          {/* 4. Dinleme (Hören) */}
          <div className="p-3.5 rounded-xl border border-stone-200 bg-stone-50/70 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-stone-700">
              <span className="flex items-center gap-1.5">
                <Headphones className="w-4 h-4 text-purple-700" />
                Dinleme (Hören)
              </span>
              <span className="text-purple-700">%{listeningPct}</span>
            </div>
            <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-purple-700 h-full rounded-full"
                style={{ width: `${listeningPct}%` }}
              ></div>
            </div>
            <p className="text-[11px] text-stone-500">
              {completedListening} / {totalListeningQ} ses alıştırması
            </p>
          </div>

          {/* 5. Konuşma (Sprechen) */}
          <div className="p-3.5 rounded-xl border border-stone-200 bg-stone-50/70 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-stone-700">
              <span className="flex items-center gap-1.5">
                <Mic className="w-4 h-4 text-[#800020]" />
                Konuşma (Sprechen)
              </span>
              <span className="text-[#800020]">%{speakingPct}</span>
            </div>
            <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#800020] h-full rounded-full"
                style={{ width: `${speakingPct}%` }}
              ></div>
            </div>
            <p className="text-[11px] text-stone-500">
              {speakingCount} prova tamamlandı
            </p>
          </div>

          {/* 6. Yazma (Schreiben) */}
          <div className="p-3.5 rounded-xl border border-stone-200 bg-stone-50/70 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-stone-700">
              <span className="flex items-center gap-1.5">
                <PenTool className="w-4 h-4 text-amber-700" />
                Yazma (Schreiben)
              </span>
              <span className="text-amber-700">%{writingPct}</span>
            </div>
            <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-amber-700 h-full rounded-full"
                style={{ width: `${writingPct}%` }}
              ></div>
            </div>
            <p className="text-[11px] text-stone-500">
              {writingCount} form & mektup yazıldı
            </p>
          </div>
        </div>
      </div>

      {/* 5-Question Exam History Table */}
      <div className="bg-white rounded-2xl p-5 sm:p-7 shadow-xs border border-stone-200 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-2 border-b border-stone-200">
          <div>
            <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-[#800020]" />
              5 Soruluk Sınav Modu Geçmişi ({totalExams} Tur Tamamlandı)
            </h3>
            <p className="text-xs text-stone-500">
              Önceki turlarda aldığınız puanlar, geçme durumu ve soruların Türkçe açıklamaları.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs font-semibold text-stone-700">
            <span>Ort. Puan: <strong className="text-[#800020]">{avgScore} / 5</strong></span>
            <span>•</span>
            <span>Barajı Geçme: <strong className="text-emerald-700">{passedExams} / {totalExams}</strong></span>
          </div>
        </div>

        {totalExams === 0 ? (
          <div className="text-center py-8 text-stone-500 text-sm">
            Henüz 5 soruluk sınav tamamlamadınız. Sınav Modu sekmesinden ilk 5 soruluk turunuzu başlatabilirsiniz!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-stone-200 text-stone-500 text-[11px] font-bold uppercase tracking-wider">
                  <th className="py-2.5 px-3">Tarih</th>
                  <th className="py-2.5 px-3">Kategori</th>
                  <th className="py-2.5 px-3 text-center">Puan</th>
                  <th className="py-2.5 px-3">Goethe Derecesi</th>
                  <th className="py-2.5 px-3 text-right">İncele</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {progress.examHistory.map((item) => {
                  const dateStr = new Date(item.date).toLocaleDateString('tr-TR', {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                  });

                  return (
                    <tr key={item.id} className="hover:bg-red-50/30 transition">
                      <td className="py-3 px-3 text-stone-600 whitespace-nowrap">
                        {dateStr}
                      </td>
                      <td className="py-3 px-3 font-semibold text-stone-800">
                        {item.category === 'all'
                          ? 'Karışık A1 Sınavı'
                          : item.category === 'grammar'
                          ? 'Dil Bilgisi'
                          : item.category === 'vocabulary'
                          ? 'Kelime'
                          : item.category === 'reading'
                          ? 'Okuma'
                          : 'Dinleme'}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-xs ${
                            item.passed
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {item.score} / 5 (%{item.percentage})
                        </span>
                      </td>
                      <td className="py-3 px-3 text-stone-700 text-xs">
                        {item.gradeText}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedReviewExam(item)}
                          className="text-xs font-bold text-[#800020] hover:underline inline-flex items-center gap-1"
                        >
                          <span>Soruları Gör</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Review Modal for Past Exam */}
      {selectedReviewExam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl border border-stone-200 max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden">
            <div className="bg-[#800020] text-white p-4 sm:p-5 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-base">Sınav Turu İncelemesi</h4>
                <p className="text-xs text-red-100">
                  {new Date(selectedReviewExam.date).toLocaleString('tr-TR')} •{' '}
                  Puan: {selectedReviewExam.score} / 5 ({selectedReviewExam.gradeText})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedReviewExam(null)}
                className="p-1 rounded-lg hover:bg-white/10 text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4">
              {selectedReviewExam.answers.map((ans, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-xl border text-xs sm:text-sm ${
                    ans.isCorrect
                      ? 'bg-emerald-50/60 border-emerald-200'
                      : 'bg-red-50/60 border-red-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 font-bold text-stone-900 mb-1.5">
                    <span>
                      {idx + 1}. {ans.questionGerman}
                    </span>
                    {ans.isCorrect ? (
                      <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded text-xs font-bold shrink-0">
                        ✓ Doğru
                      </span>
                    ) : (
                      <span className="text-red-700 bg-red-100 px-2 py-0.5 rounded text-xs font-bold shrink-0">
                        ✕ Yanlış
                      </span>
                    )}
                  </div>

                  <div className="text-xs text-stone-700 space-y-0.5 mb-2">
                    <div>
                      Seçilen: <strong>{ans.options[ans.selectedIndex]}</strong>
                    </div>
                    {!ans.isCorrect && (
                      <div className="text-emerald-800">
                        Doğru Seçenek: <strong>{ans.options[ans.correctIndex]}</strong>
                      </div>
                    )}
                  </div>

                  <div className="text-xs bg-white p-2.5 rounded-lg border border-stone-200 text-stone-600">
                    <strong className="text-[#800020]">Türkçe Açıklama: </strong>
                    {ans.turkishExplanation}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-stone-200 bg-stone-50 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedReviewExam(null)}
                className="bg-[#800020] text-white px-4 py-2 rounded-xl text-xs font-bold"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
