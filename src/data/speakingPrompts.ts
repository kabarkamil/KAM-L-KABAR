import { SpeakingPrompt } from '../types.js';

export const SPEAKING_PROMPTS: SpeakingPrompt[] = [
  // --- TEIL 1: SICH VORSTELLEN (Kendini Tanıtma) ---
  {
    id: 'sp-t1-name',
    teil: 1,
    teilTitle: 'Teil 1: Kendini Tanıtma (Name)',
    germanQuestion: 'Guten Tag! Wie heißen Sie bitte?',
    audioPromptText: 'Guten Tag! Wie heißen Sie bitte?',
    turkishContext: 'Sınav gözetmeni adınızı ve soyadınızı soruyor. Kendinizi tanıtınız.',
    expectedKeywords: ['heiße', 'Name', 'bin'],
    modelAnswer: 'Ich heiße Ali Yılmaz. (veya: Mein Name ist Ali Yılmaz.)',
    commonMistakes: [
      {
        pattern: /ich bin heiße/i,
        turkishCorrection:
          "Kısa Düzeltme: 'Ich bin...' veya 'Ich heiße...' ifadelerinden yalnızca birini seçin ('Ich bin heiße' hatalıdır).",
      },
      {
        pattern: /^mein name [^i]/i,
        turkishCorrection:
          "Kısa Düzeltme: 'ist' fiilini unutmayınız: 'Mein Name ist ...'",
      },
    ],
    hintTurkish: "'Ich heiße [Adınız]' veya 'Mein Name ist [Adınız]' kalıbını kullanın.",
  },
  {
    id: 'sp-t1-origin',
    teil: 1,
    teilTitle: 'Teil 1: Kendini Tanıtma (Herkunft)',
    germanQuestion: 'Und woher kommen Sie?',
    audioPromptText: 'Und woher kommen Sie?',
    turkishContext: 'Hangi ülkeden geldiğinizi belirtiniz.',
    expectedKeywords: ['komme', 'aus', 'Türkei'],
    modelAnswer: 'Ich komme aus der Türkei.',
    commonMistakes: [
      {
        pattern: /\baus türkei\b/i,
        turkishCorrection:
          "Kısa Düzeltme: 'die Türkei' artikelli bir ülke olduğu için 'aus' edatından sonra Dativ kuralıyla 'aus der Türkei' denmelidir.",
      },
      {
        pattern: /\bvon türkei\b/i,
        turkishCorrection:
          "Kısa Düzeltme: Ülke kökeni söylerken 'von' değil 'aus' kullanılır: 'aus der Türkei'.",
      },
    ],
    hintTurkish: "'Ich komme aus der Türkei' şeklinde tam cümle kurunuz.",
  },
  {
    id: 'sp-t1-residence',
    teil: 1,
    teilTitle: 'Teil 1: Kendini Tanıtma (Wohnort)',
    germanQuestion: 'Wo wohnen Sie zurzeit?',
    audioPromptText: 'Wo wohnen Sie zurzeit?',
    turkishContext: 'Şu an nerede yaşadığınızı (şehir) söyleyiniz.',
    expectedKeywords: ['wohne', 'in', 'lebe'],
    modelAnswer: 'Ich wohne in Istanbul. (veya: Ich wohne in Berlin.)',
    commonMistakes: [
      {
        pattern: /\bwohne nach\b/i,
        turkishCorrection:
          "Kısa Düzeltme: Şehirde ikamet ederken 'nach' değil 'in' kullanılır: 'Ich wohne in ...'",
      },
      {
        pattern: /^ich in \w+ wohne/i,
        turkishCorrection:
          "Kısa Düzeltme: Düz cümlede fiil daima 2. sıradadır: 'Ich wohne in [Şehir]'.",
      },
    ],
    hintTurkish: "'Ich wohne in [Şehir]' kalıbını kullanın.",
  },
  {
    id: 'sp-t1-languages',
    teil: 1,
    teilTitle: 'Teil 1: Kendini Tanıtma (Sprachen)',
    germanQuestion: 'Welche Sprachen sprechen Sie?',
    audioPromptText: 'Welche Sprachen sprechen Sie?',
    turkishContext: 'Konuştuğunuz dilleri (Türkçe, biraz Almanca vb.) söyleyiniz.',
    expectedKeywords: ['spreche', 'Türkisch', 'Deutsch', 'Englisch'],
    modelAnswer: 'Ich spreche Türkisch und ein bisschen Deutsch.',
    commonMistakes: [
      {
        pattern: /ich spreche kein deutsch/i,
        turkishCorrection:
          "Tavsiye: Sınavda 'ein bisschen Deutsch' (biraz Almanca) demek daha olumlu bir izlenim bırakır.",
      },
      {
        pattern: /ich sprecht/i,
        turkishCorrection:
          "Kısa Düzeltme: 'ich' öznesi için fiil çekimi 'ich spreche' şeklindedir ('ich sprecht' değil).",
      },
    ],
    hintTurkish: "'Ich spreche Türkisch und ein bisschen Deutsch' kalıbı idealdir.",
  },
  {
    id: 'sp-t1-profession',
    teil: 1,
    teilTitle: 'Teil 1: Kendini Tanıtma (Beruf)',
    germanQuestion: 'Was sind Sie von Beruf? Was machen Sie?',
    audioPromptText: 'Was sind Sie von Beruf? Was machen Sie?',
    turkishContext: 'Mesleğinizi veya şu anki durumunuzu (öğrenci, mühendis vb.) açıklayınız.',
    expectedKeywords: ['bin', 'arbeite', 'als', 'Student', 'Ingenieur', 'Lehrer'],
    modelAnswer: 'Ich bin Ingenieur von Beruf. (veya: Ich arbeite als Lehrerin / Ich bin Student.)',
    commonMistakes: [
      {
        pattern: /ich habe beruf/i,
        turkishCorrection:
          "Kısa Düzeltme: Almanca'da meslek söylerken 'Ich bin [Meslek]' veya 'Ich arbeite als [Meslek]' kalıbı kullanılır.",
      },
    ],
    hintTurkish: "'Ich bin [Meslek]' veya 'Ich bin Student/Studentin' diyebilirsiniz.",
  },

  // --- TEIL 2: UM INFORMATIONEN BITTEN (Karttan Bilgi İsteme) ---
  {
    id: 'sp-t2-supermarkt',
    teil: 2,
    teilTitle: 'Teil 2: Soru Sorma (Thema: Einkaufen - Karte: Obst)',
    germanQuestion: 'Thema: Einkaufen. Ihre Karte ist „Obst“. Stellen Sie bitte eine Frage!',
    audioPromptText: 'Thema: Einkaufen. Ihre Karte ist Obst. Stellen Sie bitte eine Frage!',
    turkishContext:
      'Önünüzdeki kartta "Alışveriş" teması ve "Meyve (Obst)" kelimesi var. Bir soru yöneltin.',
    expectedKeywords: ['Obst', 'Äpfel', 'kosten', 'haben', 'kaufen'],
    modelAnswer: 'Haben Sie frisches Obst? (veya: Was kostet das Obst?)',
    commonMistakes: [
      {
        pattern: /was ist obst/i,
        turkishCorrection:
          "Kısa Düzeltme: Alışveriş bağlamında fiyat veya mevcudiyet sormalısınız: 'Was kostet das Obst?' veya 'Haben Sie Obst?'",
      },
    ],
    hintTurkish: "'Haben Sie frisches Obst?' veya 'Was kostet das Obst?' sorusu uygundur.",
  },
  {
    id: 'sp-t2-uhrzeit',
    teil: 2,
    teilTitle: 'Teil 2: Soru Sorma (Thema: Freizeit - Karte: Wochenende)',
    germanQuestion: 'Thema: Freizeit. Ihre Karte ist „Wochenende“. Fragen Sie Ihren Partner!',
    audioPromptText: 'Thema: Freizeit. Ihre Karte ist Wochenende. Fragen Sie Ihren Partner!',
    turkishContext: 'Hafta sonu planı hakkında partnerinize Almanca bir soru sorun.',
    expectedKeywords: ['Wochenende', 'machen', 'hast', 'Zeit'],
    modelAnswer: 'Was machst du am Wochenende? (veya: Haben Sie am Wochenende Zeit?)',
    commonMistakes: [
      {
        pattern: /\bin wochenende\b/i,
        turkishCorrection:
          "Kısa Düzeltme: Hafta sonu için 'in' değil 'am' edatı kullanılır: 'am Wochenende'.",
      },
    ],
    hintTurkish: "'Was machst du am Wochenende?' şeklinde soru yöneltebilirsiniz.",
  },

  // --- TEIL 3: BITTEN FORMULIEREN (Rica & Karşılık Verme) ---
  {
    id: 'sp-t3-buch',
    teil: 3,
    teilTitle: 'Teil 3: Rica ve Tepki (Karte: Ein Buch)',
    germanQuestion: 'Entschuldigung, können Sie mir bitte das Buch geben?',
    audioPromptText: 'Entschuldigung, können Sie mir bitte das Buch geben?',
    turkishContext:
      'Partneriniz sizden kitabı vermenizi rica ediyor. Kibarca olumlu veya olumsuz yanıt veriniz.',
    expectedKeywords: ['Ja', 'gerne', 'bitte', 'hier', 'leid'],
    modelAnswer: 'Ja, gerne! Hier ist das Buch. (veya: Es tut mir leid, ich brauche es selbst.)',
    commonMistakes: [
      {
        pattern: /^(ja|nein)$/i,
        turkishCorrection:
          "Kısa Düzeltme: Sadece 'Ja' veya 'Nein' demek yerine 'Ja, natürlich!' veya 'Ja, gerne!' gibi nezaket ifadeleri ekleyiniz.",
      },
    ],
    hintTurkish: "'Ja, gerne! Hier bitte.' veya 'Natürlich, bitte schön.' şeklinde yanıt verin.",
  },
  {
    id: 'sp-t3-tuer',
    teil: 3,
    teilTitle: 'Teil 3: Rica ve Tepki (Karte: Tür öffnen)',
    germanQuestion: 'Es ist hier sehr warm. Können Sie bitte das Fenster aufmachen?',
    audioPromptText: 'Es ist hier sehr warm. Können Sie bitte das Fenster aufmachen?',
    turkishContext: 'Oda sıcak olduğu için pencereyi açmanız rica ediliyor. Nezaketle yanıtlayınız.',
    expectedKeywords: ['Ja', 'gerne', 'mache', 'sofort', 'klar', 'natürlich'],
    modelAnswer: 'Ja, natürlich, ich mache das Fenster sofort auf.',
    commonMistakes: [
      {
        pattern: /ich mache fenster/i,
        turkishCorrection:
          "Kısa Düzeltme: 'das Fenster' artikeli ile ve ayrılabilir fiil 'aufmachen' olarak kullanılmalıdır: 'Ich mache das Fenster auf.'",
      },
    ],
    hintTurkish: "'Ja, gern! Kein Problem.' veya 'Ja, natürlich!' cevabı tam puan alır.",
  },
];
