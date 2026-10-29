import {
  ExamResult,
  QuestionAnswer,
  SpeakingPrompt,
  SpeakingEvaluationResult,
  WritingPrompt,
  UserStats,
  SkillCategory,
} from '../types.js';

/**
 * Goethe-Zertifikat A1 grading reference:
 * Total: 5 questions per exam blitz
 * 5/5 (100%): Sehr gut (Çok İyi)
 * 4/5 (80%): Gut (İyi)
 * 3/5 (60%): Bestanden (Geçti - Goethe barajı %60'tır)
 * 2/5 (40%): Nicht bestanden (Kaldı - Biraz daha pratik)
 * 0-1/5 (<40%): Nicht bestanden (Başarısız)
 */
export function getGoetheGrade(score: number, total: number = 5): {
  gradeText: string;
  passed: boolean;
  percentage: number;
} {
  const percentage = Math.round((score / total) * 100);
  let gradeText = '';
  let passed = percentage >= 60;

  if (percentage === 100) {
    gradeText = 'Sehr gut (Pekiyi)';
  } else if (percentage >= 80) {
    gradeText = 'Gut (İyi)';
  } else if (percentage >= 60) {
    gradeText = 'Bestanden (Geçti - Goethe A1 Barajı %60)';
  } else if (percentage >= 40) {
    gradeText = 'Nicht bestanden (Kaldı - Tekrar önerilir)';
  } else {
    gradeText = 'Nicht bestanden (Başarısız)';
  }

  return { gradeText, passed, percentage };
}

/**
 * Calculates exam results given answers
 */
export function buildExamResult(
  category: SkillCategory,
  answers: QuestionAnswer[],
  timeSpentSeconds: number
): ExamResult {
  const correctCount = answers.filter((a) => a.isCorrect).length;
  const { gradeText, passed, percentage } = getGoetheGrade(correctCount, 5);

  return {
    id: `exam-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    date: new Date().toISOString(),
    category,
    score: correctCount,
    totalQuestions: 5,
    percentage,
    gradeText,
    passed,
    timeSpentSeconds,
    answers,
  };
}

/**
 * Normalizes text for comparison (lowercasing, trimming extra spaces, normalizing punctuation)
 */
export function normalizeGermanText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[.,/#!$%^&*;:{}=\-_`~()?"']/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Evaluates a student's spoken/written answer in the speaking rehearsal:
 * "Konuşma provasında tek soru sor, öğrencinin cevabını bekle ve yanlışsa kısa düzeltme yap."
 */
export function evaluateSpeakingAnswer(
  prompt: SpeakingPrompt,
  studentAnswer: string
): SpeakingEvaluationResult {
  const trimmed = studentAnswer.trim();

  if (!trimmed) {
    return {
      isCorrect: false,
      score: 0,
      feedbackTurkish: 'Lütfen bir yanıt verin veya mikrofon butonuna basarak konuşun.',
      correctionTurkish: 'Boş yanıt. Goethe A1 sınavında sessiz kalmak yerine basit de olsa bir kalıp söylemeniz beklenir.',
      modelAnswer: prompt.modelAnswer,
      matchedKeywords: [],
      status: 'needs_work',
      analysis: {
        overallVerdictTurkish: 'Cevap girilmedi.',
        grammarRating: 'error',
        grammarFeedbackTurkish: 'Değerlendirilecek bir cümle bulunamadı.',
        vocabularyRating: 'basic',
        vocabularyFeedbackTurkish: 'Kelime girişi yapılmadı.',
        structureRating: 'incomplete',
        structureFeedbackTurkish: 'Cümle oluşturulmadı.',
        politenessTipTurkish: 'Sınavda bilemediğiniz durumlarda dahi "Entschuldigung, können Sie das bitte wiederholen?" (Afedersiniz, tekrar eder misiniz?) diyerek zaman kazanabilirsiniz.',
        alternativeExpressions: [prompt.modelAnswer],
      },
    };
  }

  const normalized = normalizeGermanText(trimmed);

  // Check specific common grammar mistakes in German A1 for this prompt
  let identifiedCorrection: string | undefined;

  for (const mistake of prompt.commonMistakes) {
    if (mistake.pattern.test(trimmed) || mistake.pattern.test(normalized)) {
      identifiedCorrection = mistake.turkishCorrection;
      break;
    }
  }

  // Check generic German A1 common speech errors if no specific pattern caught
  if (!identifiedCorrection) {
    // 1. "Ich bin heiße"
    if (/ich bin heiße/i.test(trimmed)) {
      identifiedCorrection =
        "Kısa Düzeltme: 'Ich bin...' veya 'Ich heiße...' kalıplarından yalnızca birini kullanın ('Ich bin heiße' hatalıdır).";
    }
    // 2. Turkey without article "aus Türkei" -> "aus der Türkei"
    else if (/\baus türkei\b/i.test(normalized)) {
      identifiedCorrection =
        "Kısa Düzeltme: Almanca'da Türkiye artikelli bir ülkedir ('die Türkei'). 'aus' edatından sonra Dativ gelir: 'aus der Türkei' denmelidir.";
    }
    // 3. "Ich habe 25 Jahre alt"
    else if (/ich habe \d+ jahre/i.test(trimmed)) {
      identifiedCorrection =
        "Kısa Düzeltme: Yaş belirtirken 'haben' değil 'sein' fiili kullanılır: 'Ich bin ... Jahre alt'.";
    }
    // 4. Missing verb at 2nd position in statements
    else if (/^ich \w+ \w+ (heiße|komme|wohne|spreche)\b/i.test(trimmed)) {
      identifiedCorrection =
        "Kısa Düzeltme: Almanca düz cümlelerde çekimli fiil daima 2. sırada yer alır. Örn: 'Ich heiße ...' / 'Ich komme ...'";
    }
    // 5. Ja/Nein single word response
    else if (prompt.teil === 2 && normalized.length < 5 && !/(ja|nein|bitte|gerne)/i.test(normalized)) {
      identifiedCorrection =
        'Kısa Düzeltme: Cevabınız çok kısa. A1 sınavında tam veya nezaket içeren cümle kurmak jüriden tam puan kazandırır.';
    }
  }

  // Count matched expected keywords
  const matchedKeywords = prompt.expectedKeywords.filter((kw) => {
    const normKw = normalizeGermanText(kw);
    return normalized.includes(normKw);
  });

  const keywordRatio =
    prompt.expectedKeywords.length > 0
      ? matchedKeywords.length / prompt.expectedKeywords.length
      : 1;

  // Build alternatives based on prompt
  const alternativeExpressions: string[] = [prompt.modelAnswer];
  if (prompt.id === 'sp-t1-name') {
    alternativeExpressions.push('Mein Name ist [Adınız].', 'Ich bin [Adınız].');
  } else if (prompt.id === 'sp-t1-origin') {
    alternativeExpressions.push('Ich komme aus der Türkei, aus Ankara.');
  } else if (prompt.id === 'sp-t1-residence') {
    alternativeExpressions.push('Ich wohne jetzt in Frankfurt am Main.');
  } else if (prompt.id === 'sp-t1-languages') {
    alternativeExpressions.push('Meine Muttersprache ist Türkisch und ich lerne Deutsch.');
  } else if (prompt.id === 'sp-t2-supermarkt') {
    alternativeExpressions.push('Entschuldigung, verkaufen Sie hier auch frische Äpfel?');
  } else if (prompt.id === 'sp-t3-buch') {
    alternativeExpressions.push('Ja, natürlich! Bitte sehr.', 'Gern, einen Moment bitte.');
  }

  // Detailed Analysis calculation
  const hasPoliteWord = /(bitte|danke|gerne|entschuldigung|natürlich|guten tag|hallo)/i.test(trimmed);
  const words = trimmed.split(/\s+/).filter(Boolean);
  const isMultiWord = words.length >= 3;

  if (identifiedCorrection) {
    return {
      isCorrect: false,
      score: Math.max(35, Math.round(keywordRatio * 55)),
      feedbackTurkish: 'Cevabınız konuyla ilgili ancak giderilmesi gereken önemli bir dil bilgisi kuralı var.',
      correctionTurkish: identifiedCorrection,
      modelAnswer: prompt.modelAnswer,
      matchedKeywords,
      status: 'needs_work',
      analysis: {
        overallVerdictTurkish: 'Geliştirilmeli (Düzeltme Gerekli)',
        grammarRating: 'error',
        grammarFeedbackTurkish: identifiedCorrection,
        vocabularyRating: matchedKeywords.length > 0 ? 'adequate' : 'basic',
        vocabularyFeedbackTurkish:
          matchedKeywords.length > 0
            ? `Temel kelimeler (${matchedKeywords.join(', ')}) kullanılmış ancak çekim veya artikelde düzeltme gerekiyor.`
            : 'Soruya doğrudan karşılık gelen A1 anahtar kelimeleri eksik kaldı.',
        structureRating: isMultiWord ? 'proper' : 'incomplete',
        structureFeedbackTurkish: isMultiWord
          ? 'Cümle uzunluğu fena değil fakat fiil çekimi veya ek kuralı düzeltilmeli.'
          : 'Cevap çok kısa. Cümleyi özne + fiil + tümleç şeklinde kurmaya özen gösterin.',
        politenessTipTurkish: hasPoliteWord
          ? 'Nezaket ifadesi kullanımınız yerinde.'
          : 'Konuşurken cümlenin başına veya sonuna "bitte" veya "Entschuldigung" eklemek Goethe A1 jürisinden artı puan kazandırır.',
        alternativeExpressions,
      },
    };
  }

  // Check if answer is valid
  const isSufficient = matchedKeywords.length >= 1 || (normalized.length >= 8 && isMultiWord);

  if (isSufficient) {
    const isPerfect = keywordRatio >= 0.5 && trimmed.length >= 10;
    const score = isPerfect ? 100 : 85;

    return {
      isCorrect: true,
      score,
      feedbackTurkish: isPerfect
        ? 'Mükemmel! Goethe A1 kriterlerine uygun, doğru ve akıcı bir Almanca yanıt.'
        : 'Başarılı! Soruya uygun, anlaşılır ve doğru bir cevap verdiniz.',
      modelAnswer: prompt.modelAnswer,
      matchedKeywords,
      status: isPerfect ? 'perfect' : 'good',
      analysis: {
        overallVerdictTurkish: isPerfect ? 'Mükemmel (100 / 100)' : 'Başarılı (A1 Geçer Düzey)',
        grammarRating: 'perfect',
        grammarFeedbackTurkish: 'Fiil konumu, şahıs çekimi ve kelime dizilimi A1 kurallarına uygundur.',
        vocabularyRating: isPerfect ? 'rich' : 'adequate',
        vocabularyFeedbackTurkish: `Soru bağlamına uygun kelimeler başarıyla kullanıldı (${
          matchedKeywords.length > 0 ? matchedKeywords.join(', ') : 'uygun ifade'
        }).`,
        structureRating: 'proper',
        structureFeedbackTurkish: 'Cümle yapısı tamamlanmış ve jüri için kolay anlaşılır nitelikte.',
        politenessTipTurkish: hasPoliteWord
          ? 'Harika nezaket tonu! "Bitte / Gerne / Natürlich" gibi kelimeler konuşmanıza doğallık katıyor.'
          : 'Cümlenizin sonuna "bitte" veya "vielen Dank" ekleyerek daha da akıcı hale getirebilirsiniz.',
        alternativeExpressions,
      },
    };
  }

  // Insufficient / off-topic
  return {
    isCorrect: false,
    score: 40,
    feedbackTurkish: 'Cevabınız sorulan soruyla tam örtüşmedi veya eksik kaldı.',
    correctionTurkish: `Kısa Düzeltme: Soruyu daha açık yanıtlamak için şu kalıbı deneyebilirsiniz: "${prompt.modelAnswer}"`,
    modelAnswer: prompt.modelAnswer,
    matchedKeywords,
    status: 'needs_work',
    analysis: {
      overallVerdictTurkish: 'Yetersiz (Konu Dışı veya Eksik)',
      grammarRating: 'minor_issue',
      grammarFeedbackTurkish: 'Cümle yapısı net anlaşılamadı. Özne ve fiil belirgin olmalıdır.',
      vocabularyRating: 'basic',
      vocabularyFeedbackTurkish: `Beklenen anahtar kelimeler (${prompt.expectedKeywords.join(', ')}) cümlede yer almadı.`,
      structureRating: 'incomplete',
      structureFeedbackTurkish: 'Tam bir cümle oluşturulamadı. Model yanıtı inceleyiniz.',
      politenessTipTurkish: 'Goethe A1 sözlü sınavında soruya tam ve doğrudan bir cümleyle yanıt vermek esastır.',
      alternativeExpressions,
    },
  };
}

/**
 * Calculates aggregated user stats from past exam runs
 */
export function calculateUserStats(history: ExamResult[]): UserStats {
  const stats: UserStats = {
    totalExamsCompleted: history.length,
    totalQuestionsAnswered: history.length * 5,
    totalCorrectAnswers: 0,
    averageScorePercentage: 0,
    speakingPracticesCount: 0,
    writingPracticesCount: 0,
    categoryScores: {
      grammar: { total: 0, correct: 0 },
      vocabulary: { total: 0, correct: 0 },
      reading: { total: 0, correct: 0 },
      listening: { total: 0, correct: 0 },
    },
  };

  if (history.length === 0) {
    return stats;
  }

  let totalScorePercentageSum = 0;

  for (const session of history) {
    stats.totalCorrectAnswers += session.score;
    totalScorePercentageSum += session.percentage;

    for (const ans of session.answers) {
      // Find category from question or session
      const cat = session.category !== 'all' ? session.category : 'grammar';
      if (stats.categoryScores[cat]) {
        stats.categoryScores[cat].total += 1;
        if (ans.isCorrect) {
          stats.categoryScores[cat].correct += 1;
        }
      }
    }
  }

  stats.averageScorePercentage = Math.round(
    totalScorePercentageSum / history.length
  );

  return stats;
}

/**
 * Writing checker for A1 Schreiben
 */
export function checkWritingRequirements(
  prompt: WritingPrompt,
  text: string
): {
  passed: boolean;
  score: number;
  wordCount: number;
  missingPoints: string[];
  matchedPoints: string[];
  feedbackTurkish: string;
} {
  const trimmed = text.trim();
  const words = trimmed ? trimmed.split(/\s+/).filter(Boolean) : [];
  const wordCount = words.length;
  const minWords = prompt.minWords || 20;

  const normalized = normalizeGermanText(trimmed);

  // Check for greetings (Anrede) and sign-off (Grußformel) in emails
  const hasGreeting = /(hallo|liebe|lieber|sehr geehrte|guten tag)/i.test(trimmed);
  const hasSignOff = /(grüße|gruß|viele grüße|herzliche grüße|tschüss|auf wiedersehen)/i.test(trimmed);

  // Check keywords
  const matchedPoints: string[] = [];
  const missingPoints: string[] = [];

  for (const point of prompt.requiredPoints) {
    const pointKeywords = point.toLowerCase().split(/[\s,()/-]+/).filter((w) => w.length > 3);
    const hasMatch = pointKeywords.some((kw) => normalized.includes(kw));
    if (hasMatch) {
      matchedPoints.push(point);
    } else {
      missingPoints.push(point);
    }
  }

  let score = 0;
  if (wordCount >= minWords) score += 30;
  else score += Math.round((wordCount / minWords) * 30);

  if (hasGreeting) score += 15;
  if (hasSignOff) score += 15;

  const pointScore = prompt.requiredPoints.length > 0
    ? Math.round((matchedPoints.length / prompt.requiredPoints.length) * 40)
    : 40;
  score += pointScore;

  const passed = score >= 60 && wordCount >= 15;

  let feedbackTurkish = '';
  if (passed) {
    feedbackTurkish =
      'Başarılı! Yazınız Goethe A1 kriterlerini (hitap, içerik maddeleri, kapanış selamı ve kelime uzunluğu) karşılıyor.';
  } else {
    feedbackTurkish =
      'Yazınızı geliştirmek için: hitap ("Liebe/Lieber..."), 3 ana maddeyi içeren cümleler ve vedalaşma ("Viele Grüße") eklemeyi unutmayın.';
  }

  return {
    passed,
    score: Math.min(100, score),
    wordCount,
    missingPoints,
    matchedPoints,
    feedbackTurkish,
  };
}
