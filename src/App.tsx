import React, { useState, useEffect } from 'react';
import { Header } from './components/Header.js';
import { Navigation, ActiveTab } from './components/Navigation.js';
import { ExamMode } from './components/ExamMode.js';
import { SpeakingTrainer } from './components/SpeakingTrainer.js';
import { VocabularyTrainer } from './components/VocabularyTrainer.js';
import { WritingTrainer } from './components/WritingTrainer.js';
import { ReadingListeningTrainer } from './components/ReadingListeningTrainer.js';
import { ProgressDashboard } from './components/ProgressDashboard.js';
import { UserAuthModal } from './components/UserAuthModal.js';
import {
  UserAccount,
  DetailedUserProgress,
  getActiveUser,
  getStoredUsers,
  getUserProgress,
  saveUserAccount,
  setActiveUserId,
  appendExamResult,
  toggleLearnedWord,
  recordSpeakingResult,
  recordWritingResult,
  saveUserProgress,
} from './utils/storage.js';
import { ExamResult, SpeakingEvaluationResult } from './types.js';

export default function App() {
  const [activeUser, setActiveUser] = useState<UserAccount>(() => getActiveUser());
  const [users, setUsers] = useState<UserAccount[]>(() => getStoredUsers());
  const [progress, setProgress] = useState<DetailedUserProgress>(() =>
    getUserProgress(activeUser.id)
  );
  const [activeTab, setActiveTab] = useState<ActiveTab>('exam');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Check URL params on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab') as ActiveTab | null;
    if (tabParam && ['exam', 'vocabulary', 'grammar', 'reading', 'listening', 'speaking', 'writing', 'progress'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, []);

  // Update progress when active user changes
  useEffect(() => {
    setProgress(getUserProgress(activeUser.id));
  }, [activeUser.id]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3500);
  };

  const handleSelectUser = (userId: string) => {
    setActiveUserId(userId);
    const selected = users.find((u) => u.id === userId) || activeUser;
    setActiveUser(selected);
    setProgress(getUserProgress(selected.id));
    showToast(`Aktif profil: ${selected.name}`);
  };

  const handleRegisterUser = (
    userData: Omit<UserAccount, 'id' | 'createdAt'>
  ) => {
    const newUser: UserAccount = {
      ...userData,
      id: `user-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    saveUserAccount(newUser);
    const updatedUsers = getStoredUsers();
    setUsers(updatedUsers);
    setActiveUserId(newUser.id);
    setActiveUser(newUser);
    setProgress(getUserProgress(newUser.id));
    showToast(`Hoş geldiniz ${newUser.name}! Profiliniz başarıyla oluşturuldu.`);
  };

  const handleExamCompleted = (result: ExamResult) => {
    const updated = appendExamResult(activeUser.id, result);
    setProgress({ ...updated });
    showToast(`Sınav tamamlandı! Puanınız: ${result.score}/5 (%${result.percentage}) - ${result.gradeText}`);
  };

  const handleRecordSpeaking = (
    promptId: string,
    answer: string,
    evalResult: SpeakingEvaluationResult
  ) => {
    recordSpeakingResult(activeUser.id, promptId, answer, evalResult);
    setProgress(getUserProgress(activeUser.id));
    showToast(
      evalResult.isCorrect
        ? `Konuşma cevabınız kaydedildi! Puan: ${evalResult.score}/100`
        : `Konuşma analizi tamamlandı. Düzeltmeleri inceleyebilirsiniz.`
    );
  };

  const handleRecordWriting = (
    promptId: string,
    type: 'formular' | 'brief',
    text: string,
    score: number,
    passed: boolean
  ) => {
    recordWritingResult(activeUser.id, promptId, type, text, score, passed);
    setProgress(getUserProgress(activeUser.id));
    showToast(
      passed
        ? `Yazma ödevi kaydedildi! Başarılı (%${score})`
        : `Yazma ödevi kaydedildi. İnceleme tavsiye edilir (%${score})`
    );
  };

  const handleToggleLearnedWord = (wordId: string) => {
    const isLearned = toggleLearnedWord(activeUser.id, wordId);
    setProgress(getUserProgress(activeUser.id));
    showToast(
      isLearned
        ? 'Kelime öğrenilenler listesine eklendi.'
        : 'Kelime öğrenilenlerden çıkarıldı.'
    );
  };

  const handleCompleteExercise = (questionId: string, isCorrect: boolean) => {
    const p = getUserProgress(activeUser.id);
    if (questionId.startsWith('g') && !p.completedGrammarIds.includes(questionId)) {
      p.completedGrammarIds.push(questionId);
    } else if (questionId.startsWith('r') && !p.completedReadingIds.includes(questionId)) {
      p.completedReadingIds.push(questionId);
    } else if (questionId.startsWith('h') && !p.completedListeningIds.includes(questionId)) {
      p.completedListeningIds.push(questionId);
    }
    saveUserProgress(p);
    setProgress({ ...p });
  };

  const handleClearProgress = () => {
    const resetProgress: DetailedUserProgress = {
      userId: activeUser.id,
      learnedWordIds: [],
      bookmarkedQuestionIds: [],
      completedSpeaking: {},
      completedWriting: {},
      completedReadingIds: [],
      completedListeningIds: [],
      completedGrammarIds: [],
      examHistory: [],
    };
    saveUserProgress(resetProgress);
    setProgress(resetProgress);
    showToast('Tüm ilerleme verileriniz sıfırlandı.');
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col font-sans text-stone-900 selection:bg-[#800020] selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-4 right-4 z-50 bg-[#800020] text-white px-4 py-2.5 rounded-xl shadow-lg border border-red-900 text-xs sm:text-sm font-semibold animate-in fade-in slide-in-from-bottom-2 duration-200">
          {toastMessage}
        </div>
      )}

      {/* Header */}
      <Header
        activeUser={activeUser}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
      />

      {/* Navigation Bar */}
      <Navigation
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        examCount={progress.examHistory.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3.5 sm:p-6 lg:p-8">
        {activeTab === 'exam' && (
          <ExamMode
            onExamCompleted={handleExamCompleted}
            onGoToProgress={() => setActiveTab('progress')}
          />
        )}

        {activeTab === 'speaking' && (
          <SpeakingTrainer onRecordSpeaking={handleRecordSpeaking} />
        )}

        {activeTab === 'vocabulary' && (
          <VocabularyTrainer
            learnedWordIds={progress.learnedWordIds}
            onToggleLearned={handleToggleLearnedWord}
          />
        )}

        {activeTab === 'writing' && (
          <WritingTrainer onRecordWriting={handleRecordWriting} />
        )}

        {activeTab === 'grammar' && (
          <ReadingListeningTrainer
            mode="grammar"
            completedIds={progress.completedGrammarIds}
            onCompleteExercise={handleCompleteExercise}
          />
        )}

        {activeTab === 'reading' && (
          <ReadingListeningTrainer
            mode="reading"
            completedIds={progress.completedReadingIds}
            onCompleteExercise={handleCompleteExercise}
          />
        )}

        {activeTab === 'listening' && (
          <ReadingListeningTrainer
            mode="listening"
            completedIds={progress.completedListeningIds}
            onCompleteExercise={handleCompleteExercise}
          />
        )}

        {activeTab === 'progress' && (
          <ProgressDashboard
            activeUser={activeUser}
            progress={progress}
            onClearProgress={handleClearProgress}
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-stone-200 py-6 text-center text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 space-y-1">
          <p className="font-semibold text-stone-700">
            Turk – Persönlicher Deutschtrainer © 2026
          </p>
          <p className="text-stone-400">
            Goethe-Zertifikat A1: Start Deutsch 1 referanslı sınav hazırlığı. Tarayıcıda yerel ve ücretsiz çalışır.
          </p>
        </div>
      </footer>

      {/* User Auth Modal */}
      <UserAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        users={users}
        activeUser={activeUser}
        onSelectUser={handleSelectUser}
        onRegisterUser={handleRegisterUser}
      />
    </div>
  );
}
