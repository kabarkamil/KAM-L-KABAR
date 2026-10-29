export type SkillCategory = 'all' | 'grammar' | 'vocabulary' | 'reading' | 'listening';

export interface ExamQuestion {
  id: string;
  category: 'grammar' | 'vocabulary' | 'reading' | 'listening';
  questionGerman: string;
  questionTurkishPrompt?: string;
  stimulusText?: string; // Text for reading or transcript for listening
  audioText?: string; // German text to read aloud for listening questions
  options: string[];
  correctIndex: number;
  turkishExplanation: string;
  difficulty: 'A1.1' | 'A1.2';
  tag: string;
  a1ExamHint?: string; // Goethe-Zertifikat A1 exam strategy and motivating grammar hint
}

export interface QuestionAnswer {
  questionId: string;
  questionGerman: string;
  options: string[];
  selectedIndex: number;
  correctIndex: number;
  isCorrect: boolean;
  turkishExplanation: string;
}

export interface ExamResult {
  id: string;
  date: string;
  category: SkillCategory;
  score: number; // out of 5
  totalQuestions: 5;
  percentage: number;
  gradeText: string;
  passed: boolean;
  timeSpentSeconds: number;
  answers: QuestionAnswer[];
}

export interface SpeakingPrompt {
  id: string;
  teil: 1 | 2 | 3;
  teilTitle: string; // e.g. "Teil 1: Kendini Tanıtma (Sich vorstellen)"
  germanQuestion: string;
  audioPromptText: string;
  turkishContext: string;
  expectedKeywords: string[];
  modelAnswer: string;
  commonMistakes: {
    pattern: RegExp;
    turkishCorrection: string;
  }[];
  hintTurkish: string;
}

export interface SpeakingAnalysis {
  overallVerdictTurkish: string;
  grammarRating: 'perfect' | 'minor_issue' | 'error';
  grammarFeedbackTurkish: string;
  vocabularyRating: 'rich' | 'adequate' | 'basic';
  vocabularyFeedbackTurkish: string;
  structureRating: 'proper' | 'incomplete';
  structureFeedbackTurkish: string;
  politenessTipTurkish: string;
  alternativeExpressions: string[];
}

export interface SpeakingEvaluationResult {
  isCorrect: boolean;
  score: number; // 0 - 100
  feedbackTurkish: string;
  correctionTurkish?: string;
  modelAnswer: string;
  matchedKeywords: string[];
  status: 'perfect' | 'good' | 'needs_work';
  analysis: SpeakingAnalysis;
}

export interface WritingPrompt {
  id: string;
  title: string;
  type: 'formular' | 'brief';
  goetheTeil: 'Teil 1 (Formular)' | 'Teil 2 (E-Mail / Brief)';
  situationGerman: string;
  situationTurkish: string;
  requiredPoints: string[];
  sampleSolution: string;
  minWords?: number;
  guidanceTurkish: string;
  a1ExamHint?: string; // Motivating exam strategy hint
  formFields?: {
    labelGerman: string;
    labelTurkish: string;
    correctValue: string;
    options?: string[];
  }[];
}

export interface VocabularyWord {
  id: string;
  word: string;
  article: 'der' | 'die' | 'das' | null;
  plural?: string;
  turkishMeaning: string;
  category: string;
  exampleGerman: string;
  exampleTurkish: string;
}

export interface UserStats {
  totalExamsCompleted: number;
  totalQuestionsAnswered: number;
  totalCorrectAnswers: number;
  averageScorePercentage: number;
  speakingPracticesCount: number;
  writingPracticesCount: number;
  categoryScores: {
    grammar: { total: number; correct: number };
    vocabulary: { total: number; correct: number };
    reading: { total: number; correct: number };
    listening: { total: number; correct: number };
  };
}
