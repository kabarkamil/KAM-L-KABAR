import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getGoetheGrade,
  buildExamResult,
  evaluateSpeakingAnswer,
  checkWritingRequirements,
  calculateUserStats,
  normalizeGermanText,
} from './rules.js';
import { SpeakingPrompt, WritingPrompt } from '../types.js';

test('getGoetheGrade assigns correct grades for 5-question exam', () => {
  assert.deepEqual(getGoetheGrade(5, 5), {
    gradeText: 'Sehr gut (Pekiyi)',
    passed: true,
    percentage: 100,
  });

  assert.deepEqual(getGoetheGrade(4, 5), {
    gradeText: 'Gut (İyi)',
    passed: true,
    percentage: 80,
  });

  assert.deepEqual(getGoetheGrade(3, 5), {
    gradeText: 'Bestanden (Geçti - Goethe A1 Barajı %60)',
    passed: true,
    percentage: 60,
  });

  const failResult = getGoetheGrade(2, 5);
  assert.equal(failResult.passed, false);
  assert.equal(failResult.percentage, 40);
});

test('buildExamResult correctly packages 5-question exam details', () => {
  const mockAnswers = [
    {
      questionId: 'q1',
      questionGerman: 'Wie heißen Sie?',
      options: ['Ich heiße Ali', 'Ich bin Ali', 'Mein Name Ali', 'A ve B doğru'],
      selectedIndex: 3,
      correctIndex: 3,
      isCorrect: true,
      turkishExplanation: 'Her ikisi de geçerlidir.',
    },
    {
      questionId: 'q2',
      questionGerman: 'Woher kommen Sie?',
      options: ['Aus der Türkei', 'Aus Türkei', 'In Türkei', 'Nach Türkei'],
      selectedIndex: 0,
      correctIndex: 0,
      isCorrect: true,
      turkishExplanation: 'Türkiye artikellidir.',
    },
    {
      questionId: 'q3',
      questionGerman: 'Ich ___ einen Kaffee.',
      options: ['möchte', 'möchten', 'möchtet', 'mag'],
      selectedIndex: 0,
      correctIndex: 0,
      isCorrect: true,
      turkishExplanation: 'Ich möchte.',
    },
    {
      questionId: 'q4',
      questionGerman: 'Was ist das? Das ist ___ Buch.',
      options: ['ein', 'eine', 'einen', 'einem'],
      selectedIndex: 0,
      correctIndex: 0,
      isCorrect: true,
      turkishExplanation: 'Das Buch -> ein Buch.',
    },
    {
      questionId: 'q5',
      questionGerman: 'Er kommt ___ Bus.',
      options: ['mit dem', 'mit den', 'mit der', 'von'],
      selectedIndex: 2,
      correctIndex: 0,
      isCorrect: false,
      turkishExplanation: 'Der Bus -> mit dem Bus.',
    },
  ];

  const result = buildExamResult('grammar', mockAnswers, 45);
  assert.equal(result.score, 4);
  assert.equal(result.totalQuestions, 5);
  assert.equal(result.percentage, 80);
  assert.equal(result.passed, true);
  assert.equal(result.answers.length, 5);
});

test('evaluateSpeakingAnswer catches missing article for Turkey', () => {
  const prompt: SpeakingPrompt = {
    id: 'sp-1',
    teil: 1,
    teilTitle: 'Teil 1: Sich vorstellen',
    germanQuestion: 'Woher kommen Sie?',
    audioPromptText: 'Woher kommen Sie?',
    turkishContext: 'Memleketinizi söyleyiniz.',
    expectedKeywords: ['komme', 'Türkei'],
    modelAnswer: 'Ich komme aus der Türkei.',
    commonMistakes: [
      {
        pattern: /aus türkei\b/i,
        turkishCorrection: "Kısa Düzeltme: 'aus der Türkei' denmelidir. 'die Türkei' artikellidir.",
      },
    ],
    hintTurkish: 'aus der Türkei kalıbını kullanın.',
  };

  const studentWrongAnswer = 'Ich komme aus Türkei';
  const evalResult = evaluateSpeakingAnswer(prompt, studentWrongAnswer);

  assert.equal(evalResult.isCorrect, false);
  assert.match(evalResult.correctionTurkish || '', /aus der Türkei/);
  assert.equal(evalResult.modelAnswer, 'Ich komme aus der Türkei.');
});

test('evaluateSpeakingAnswer approves correct answer', () => {
  const prompt: SpeakingPrompt = {
    id: 'sp-1',
    teil: 1,
    teilTitle: 'Teil 1: Sich vorstellen',
    germanQuestion: 'Woher kommen Sie?',
    audioPromptText: 'Woher kommen Sie?',
    turkishContext: 'Memleketinizi söyleyiniz.',
    expectedKeywords: ['komme', 'Türkei'],
    modelAnswer: 'Ich komme aus der Türkei.',
    commonMistakes: [
      {
        pattern: /aus türkei\b/i,
        turkishCorrection: "Kısa Düzeltme: 'aus der Türkei' denmelidir.",
      },
    ],
    hintTurkish: 'aus der Türkei kalıbını kullanın.',
  };

  const studentCorrectAnswer = 'Ich komme aus der Türkei.';
  const evalResult = evaluateSpeakingAnswer(prompt, studentCorrectAnswer);

  assert.equal(evalResult.isCorrect, true);
  assert.equal(evalResult.status, 'perfect');
  assert.equal(evalResult.score, 100);
});

test('normalizeGermanText handles punctuation and casing', () => {
  assert.equal(
    normalizeGermanText('Guten Tag! Wie geht es Ihnen?'),
    'guten tag wie geht es ihnen'
  );
});

test('calculateUserStats accumulates stats correctly', () => {
  const res1 = buildExamResult('grammar', [
    { questionId: '1', questionGerman: '', options: [], selectedIndex: 0, correctIndex: 0, isCorrect: true, turkishExplanation: '' },
    { questionId: '2', questionGerman: '', options: [], selectedIndex: 0, correctIndex: 0, isCorrect: true, turkishExplanation: '' },
    { questionId: '3', questionGerman: '', options: [], selectedIndex: 0, correctIndex: 0, isCorrect: true, turkishExplanation: '' },
    { questionId: '4', questionGerman: '', options: [], selectedIndex: 0, correctIndex: 0, isCorrect: true, turkishExplanation: '' },
    { questionId: '5', questionGerman: '', options: [], selectedIndex: 0, correctIndex: 0, isCorrect: true, turkishExplanation: '' },
  ], 30);

  const stats = calculateUserStats([res1]);
  assert.equal(stats.totalExamsCompleted, 1);
  assert.equal(stats.totalQuestionsAnswered, 5);
  assert.equal(stats.totalCorrectAnswers, 5);
  assert.equal(stats.averageScorePercentage, 100);
});
