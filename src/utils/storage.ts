import { ExamResult, SpeakingEvaluationResult } from '../types.js';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  targetExamDate: string; // e.g. "2026-12-15"
  createdAt: string;
  avatarColor: string;
}

export interface DetailedUserProgress {
  userId: string;
  learnedWordIds: string[];
  bookmarkedQuestionIds: string[];
  completedSpeaking: Record<
    string,
    {
      lastScore: number;
      lastAnswer: string;
      correction?: string;
      timestamp: string;
    }
  >;
  completedWriting: Record<
    string,
    {
      type: 'formular' | 'brief';
      submissionText: string;
      score: number;
      passed: boolean;
      timestamp: string;
    }
  >;
  completedReadingIds: string[];
  completedListeningIds: string[];
  completedGrammarIds: string[];
  examHistory: ExamResult[];
}

const STORAGE_KEYS = {
  USERS: 'turk_deutschtrainer_users_v1',
  ACTIVE_USER_ID: 'turk_deutschtrainer_active_user_v1',
  PROGRESS_PREFIX: 'turk_deutschtrainer_progress_',
};

const DEFAULT_USER: UserAccount = {
  id: 'user-default-1',
  name: 'Öğrenci (Misafir)',
  email: 'ogrenci@deutschtrainer.de',
  targetExamDate: '2026-11-30',
  createdAt: new Date().toISOString(),
  avatarColor: '#800020', // burgundy
};

export function getStoredUsers(): UserAccount[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USERS);
    if (!raw) {
      // Initialize with default account
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([DEFAULT_USER]));
      return [DEFAULT_USER];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : [DEFAULT_USER];
  } catch {
    return [DEFAULT_USER];
  }
}

export function saveUserAccount(user: UserAccount): void {
  const users = getStoredUsers();
  const existingIdx = users.findIndex((u) => u.id === user.id);
  if (existingIdx >= 0) {
    users[existingIdx] = user;
  } else {
    users.push(user);
  }
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
}

export function getActiveUserId(): string {
  try {
    const active = localStorage.getItem(STORAGE_KEYS.ACTIVE_USER_ID);
    if (active) return active;
    const users = getStoredUsers();
    const id = users[0]?.id || DEFAULT_USER.id;
    localStorage.setItem(STORAGE_KEYS.ACTIVE_USER_ID, id);
    return id;
  } catch {
    return DEFAULT_USER.id;
  }
}

export function setActiveUserId(userId: string): void {
  localStorage.setItem(STORAGE_KEYS.ACTIVE_USER_ID, userId);
}

export function getActiveUser(): UserAccount {
  const users = getStoredUsers();
  const activeId = getActiveUserId();
  return users.find((u) => u.id === activeId) || users[0] || DEFAULT_USER;
}

export function getUserProgress(userId: string): DetailedUserProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROGRESS_PREFIX + userId);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        userId,
        learnedWordIds: parsed.learnedWordIds || [],
        bookmarkedQuestionIds: parsed.bookmarkedQuestionIds || [],
        completedSpeaking: parsed.completedSpeaking || {},
        completedWriting: parsed.completedWriting || {},
        completedReadingIds: parsed.completedReadingIds || [],
        completedListeningIds: parsed.completedListeningIds || [],
        completedGrammarIds: parsed.completedGrammarIds || [],
        examHistory: parsed.examHistory || [],
      };
    }
  } catch {
    // fallback
  }

  return {
    userId,
    learnedWordIds: [],
    bookmarkedQuestionIds: [],
    completedSpeaking: {},
    completedWriting: {},
    completedReadingIds: [],
    completedListeningIds: [],
    completedGrammarIds: [],
    examHistory: [],
  };
}

export function saveUserProgress(progress: DetailedUserProgress): void {
  try {
    localStorage.setItem(
      STORAGE_KEYS.PROGRESS_PREFIX + progress.userId,
      JSON.stringify(progress)
    );
  } catch (e) {
    console.error('Failed to save progress to localStorage', e);
  }
}

export function appendExamResult(
  userId: string,
  result: ExamResult
): DetailedUserProgress {
  const progress = getUserProgress(userId);
  progress.examHistory.unshift(result); // latest first

  // also mark individual category exercises
  for (const ans of result.answers) {
    if (ans.isCorrect) {
      if (ans.questionId.startsWith('g')) {
        if (!progress.completedGrammarIds.includes(ans.questionId)) {
          progress.completedGrammarIds.push(ans.questionId);
        }
      } else if (ans.questionId.startsWith('v')) {
        if (!progress.learnedWordIds.includes(ans.questionId)) {
          progress.learnedWordIds.push(ans.questionId);
        }
      } else if (ans.questionId.startsWith('r')) {
        if (!progress.completedReadingIds.includes(ans.questionId)) {
          progress.completedReadingIds.push(ans.questionId);
        }
      } else if (ans.questionId.startsWith('h')) {
        if (!progress.completedListeningIds.includes(ans.questionId)) {
          progress.completedListeningIds.push(ans.questionId);
        }
      }
    }
  }

  saveUserProgress(progress);
  return progress;
}

export function toggleLearnedWord(userId: string, wordId: string): boolean {
  const progress = getUserProgress(userId);
  const idx = progress.learnedWordIds.indexOf(wordId);
  let isLearned = false;
  if (idx >= 0) {
    progress.learnedWordIds.splice(idx, 1);
    isLearned = false;
  } else {
    progress.learnedWordIds.push(wordId);
    isLearned = true;
  }
  saveUserProgress(progress);
  return isLearned;
}

export function recordSpeakingResult(
  userId: string,
  promptId: string,
  answer: string,
  evalResult: SpeakingEvaluationResult
): void {
  const progress = getUserProgress(userId);
  progress.completedSpeaking[promptId] = {
    lastScore: evalResult.score,
    lastAnswer: answer,
    correction: evalResult.correctionTurkish,
    timestamp: new Date().toISOString(),
  };
  saveUserProgress(progress);
}

export function recordWritingResult(
  userId: string,
  promptId: string,
  type: 'formular' | 'brief',
  text: string,
  score: number,
  passed: boolean
): void {
  const progress = getUserProgress(userId);
  progress.completedWriting[promptId] = {
    type,
    submissionText: text,
    score,
    passed,
    timestamp: new Date().toISOString(),
  };
  saveUserProgress(progress);
}
