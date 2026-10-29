import { ExamQuestion } from '../types.js';

export const A1_QUESTIONS: ExamQuestion[] = [
  // --- GRAMMATIK (Dilbilgisi) ---
  {
    id: 'g1',
    category: 'grammar',
    questionGerman: 'Frau Müller, woher ___ Sie?',
    questionTurkishPrompt: 'Boşluğa gelebilecek en uygun fiil çekimini seçiniz.',
    options: ['kommst', 'kommt', 'kommen', 'komme'],
    correctIndex: 2,
    turkishExplanation:
      "Almanca'da resmi/nezaket hitabı olan 'Sie' (Siz) zamirinde fiil sonuna '-en' takısı gelir: 'Sie kommen'. 'du' için 'kommst', 'er/sie' için 'kommt', 'ich' için 'komme' olur.",
    difficulty: 'A1.1',
    tag: 'Fiil Çekimi (Konjugation)',
  },
  {
    id: 'g2',
    category: 'grammar',
    questionGerman: 'Ich habe einen Bruder. ___ Bruder heißt Mehmet.',
    questionTurkishPrompt: 'Boşluğa uygun iyelik zamirini (Possessivpronomen) seçiniz.',
    options: ['Mein', 'Meine', 'Meinen', 'Meinem'],
    correctIndex: 0,
    turkishExplanation:
      "'Bruder' (erkek kardeş) eril bir isimdir ('der Bruder') ve burada cümlenin öznesi (Nominativ) konumundadır. Bu yüzden 'Mein Bruder' kullanılır. 'Meine' dişil/çoğul, 'Meinen' Akkusativ içindir.",
    difficulty: 'A1.1',
    tag: 'İyelik Zamirleri',
  },
  {
    id: 'g3',
    category: 'grammar',
    questionGerman: 'Wir möchten heute Abend einen Film ___.',
    questionTurkishPrompt: 'Modal fiil (möchten) ile cümlenin sonundaki fiil nasıl olmalıdır?',
    options: ['sehen', 'sieht', 'gesehen', 'sah'],
    correctIndex: 0,
    turkishExplanation:
      "Modal fiillerle (möchten, können, müssen vb.) kurulan cümlelerde asıl fiil cümlenin en sonuna gider ve çekimlenmeden yalın (Infinitiv) halde kalır: 'möchten ... sehen'.",
    difficulty: 'A1.1',
    tag: 'Modalverben',
  },
  {
    id: 'g4',
    category: 'grammar',
    questionGerman: 'Entschuldigung, ich suche ___ Bahnhof.',
    questionTurkishPrompt: 'Boşluğa hangi artikeli getirmelisiniz?',
    options: ['der', 'den', 'dem', 'das'],
    correctIndex: 1,
    turkishExplanation:
      "'Bahnhof' eril bir kelimedir ('der Bahnhof'). 'Suchen' fiili belirtili nesne (Akkusativ - -i hali) alır. Eril isimlerde 'der' artikeli Akkusativ'de 'den' haline dönüşür.",
    difficulty: 'A1.2',
    tag: 'Akkusativ (-i hali)',
  },
  {
    id: 'g5',
    category: 'grammar',
    questionGerman: 'Kommen Sie bitte ___! Der Deutschkurs beginnt gleich.',
    questionTurkishPrompt: 'Ayrılabilir fiil (hereinkommen) için boşluğu tamamlayınız.',
    options: ['herein', 'an', 'aus', 'auf'],
    correctIndex: 0,
    turkishExplanation:
      "'Hereinkommen' (içeri gelmek) ayrılabilen bir fiildir. Emir veya kibar ricada ön ek sona gider: 'Kommen Sie bitte herein!'.",
    difficulty: 'A1.2',
    tag: 'Trennbare Verben (Ayrılabilen Fiiller)',
  },
  {
    id: 'g6',
    category: 'grammar',
    questionGerman: 'Fährst du mit ___ Bus oder mit der U-Bahn zur Arbeit?',
    questionTurkishPrompt: 'Boşluğa uygun edat artikelini seçiniz.',
    options: ['der', 'dem', 'den', 'das'],
    correctIndex: 1,
    turkishExplanation:
      "'mit' edatı daima Dativ (-e/-de hali) gerektirir. 'der Bus' eril bir isimdir ve Dativ halinde 'dem' olur: 'mit dem Bus'.",
    difficulty: 'A1.2',
    tag: 'Dativ Präpositionen (mit)',
  },
  {
    id: 'g7',
    category: 'grammar',
    questionGerman: 'Nein, danke. Ich trinke ___ Kaffee.',
    questionTurkishPrompt: 'Kahve içmediğinizi belirtmek için hangisi uygundur?',
    options: ['nicht', 'kein', 'keinen', 'keine'],
    correctIndex: 2,
    turkishExplanation:
      "Artikeli olmayan veya belirsiz artikelli isimleri olumsuz yapmak için 'kein' kullanılır. 'Kaffee' erildir ('der Kaffee') ve içmek fiili nesne aldığından Akkusativ'de 'keinen Kaffee' olur.",
    difficulty: 'A1.1',
    tag: 'Negation (nicht vs kein)',
  },
  {
    id: 'g8',
    category: 'grammar',
    questionGerman: 'Am Sonntag ___ wir lange schlafen.',
    questionTurkishPrompt: 'Cümledeki boşluğa uygun modal fiili seçiniz (Wir için können).',
    options: ['kann', 'kannst', 'können', 'könnt'],
    correctIndex: 2,
    turkishExplanation:
      "'können' (yapabilmek) fiili 'wir' öznesi için 'können' şeklinde çekimlenir: 'Am Sonntag können wir lange schlafen.'",
    difficulty: 'A1.1',
    tag: 'Modalverb (können)',
  },

  // --- WORTSCHATZ (Kelime Bilgisi) ---
  {
    id: 'v1',
    category: 'vocabulary',
    questionGerman: 'Wie spät ist es? — Es ist Viertel vor acht (07:45).',
    questionTurkishPrompt: "'Viertel vor acht' ifadesinin Türkçe karşılığı nedir?",
    options: ['Sekize çeyrek var', 'Sekizi çeyrek geçiyor', 'Yedi buçuk', 'Sekiz buçuk'],
    correctIndex: 0,
    turkishExplanation:
      "'Viertel' çeyrek, 'vor' önce/kala anlamına gelir. 'Viertel vor acht' = Sekize çeyrek var (07:45). 'Viertel nach acht' sekizi çeyrek geçiyor olurdu.",
    difficulty: 'A1.1',
    tag: 'Uhrzeit (Saatler)',
  },
  {
    id: 'v2',
    category: 'vocabulary',
    questionGerman: 'Ich möchte gerne zwei Kilo Äpfel kaufen. Wo bin ich?',
    questionTurkishPrompt: 'Bu cümleyi kuran kişi nerededir?',
    options: ['In der Apotheke', 'Auf dem Markt / Im Supermarkt', 'Am Bahnhof', 'Beim Arzt'],
    correctIndex: 1,
    turkishExplanation:
      "'Äpfel' (elmalar) ve 'Kilo' kelimeleri alışverişle ilgilidir. Dolayısıyla kişi pazarda ('auf dem Markt') veya süpermarkettedir.",
    difficulty: 'A1.1',
    tag: 'Einkaufen (Alışveriş)',
  },
  {
    id: 'v3',
    category: 'vocabulary',
    questionGerman: 'Welches Wort passt? — Meine Mutter und mein Vater sind meine ___.',
    questionTurkishPrompt: 'Boşluğa hangi aile terimi gelmelidir?',
    options: ['Geschwister', 'Eltern', 'Kinder', 'Großeltern'],
    correctIndex: 1,
    turkishExplanation:
      "Almanca'da anne ve babaya birlikte 'die Eltern' (ebeveyn) denir. 'Geschwister' kardeşler, 'Großeltern' büyükanne ve büyükbabadır.",
    difficulty: 'A1.1',
    tag: 'Familie (Aile)',
  },
  {
    id: 'v4',
    category: 'vocabulary',
    questionGerman: 'Mein Kopf tut weh. Ich brauche ein ___.',
    questionTurkishPrompt: 'Başı ağrıyan bir kişinin neye ihtiyacı vardır?',
    options: ['Fahrrad', 'Medikament', 'Ticket', 'Wörterbuch'],
    correctIndex: 1,
    turkishExplanation:
      "'Mein Kopf tut weh' = Başım ağrıyor demektir. Bu durumda bir ilaca ('das Medikament') ihtiyaç duyulur.",
    difficulty: 'A1.2',
    tag: 'Gesundheit (Sağlık)',
  },
  {
    id: 'v5',
    category: 'vocabulary',
    questionGerman: 'Welches Verb passt: „Ich ___ als Krankenschwester im Krankenhaus.“',
    questionTurkishPrompt: 'Meslek belirtirken kullanılan uygun fiil hangisidir?',
    options: ['wohne', 'lerne', 'arbeite', 'fahre'],
    correctIndex: 2,
    turkishExplanation:
      "Meslek ve iş yeri belirtirken 'arbeiten als ...' (olarak çalışmak) kullanılır: 'Ich arbeite als Krankenschwester...'.",
    difficulty: 'A1.1',
    tag: 'Beruf (Meslekler)',
  },
  {
    id: 'v6',
    category: 'vocabulary',
    questionGerman: 'Wie heißt das Gegenteil von „billig“?',
    questionTurkishPrompt: "'billig' (ucuz) kelimesinin zıt anlamlısı nedir?",
    options: ['teuer', 'groß', 'schön', 'schnell'],
    correctIndex: 0,
    turkishExplanation:
      "'billig' ucuz demektir, zıttı ise 'teuer' (pahalı) kelimesidir.",
    difficulty: 'A1.1',
    tag: 'Adjektive (Sıfatlar)',
  },

  // --- LESEN (Okuma Becerisi - Goethe A1 Formatı) ---
  {
    id: 'r1',
    category: 'reading',
    stimulusText: `AUSHANG IM DEUTSCHINSTITUT:
Liebe Kursteilnehmer,
die Sprachschule ist am Freitag, dem 1. Mai, wegen eines Feiertags geschlossen.
Am Montag, dem 4. Mai, finden alle Deutschkurse wieder wie gewohnt statt.
Ihr Sprachschul-Team`,
    questionGerman: 'Wann gibt es keinen Deutschunterricht?',
    questionTurkishPrompt: 'Metne göre hangi gün Almanca dersi yoktur?',
    options: [
      'Am Freitag, 1. Mai',
      'Am Montag, 4. Mai',
      'Die ganze Woche',
      'Am Wochenende nicht',
    ],
    correctIndex: 0,
    turkishExplanation:
      "Metinde 'die Sprachschule ist am Freitag, dem 1. Mai ... geschlossen' (1 Mayıs Cuma günü kapalıdır) ifadesi yer almaktadır. Dolayısıyla o gün ders yoktur.",
    difficulty: 'A1.1',
    tag: 'Goethe Lesen Teil 1',
  },
  {
    id: 'r2',
    category: 'reading',
    stimulusText: `E-MAIL:
Hallo Anna,
ich mache am Samstag eine Geburtstagsparty in meinem Garten.
Wir fangen um 18:00 Uhr an. Kannst du bitte einen Salat oder Kuchen mitbringen?
Gib mir bitte bis Donnerstag Bescheid.
Liebe Grüße, Markus`,
    questionGerman: 'Was soll Anna zur Party mitbringen?',
    questionTurkishPrompt: 'Markus, Anna\'dan partiye ne getirmesini istiyor?',
    options: [
      'Getränke und Musik',
      'Einen Salat oder Kuchen',
      'Ein Geschenk für Markus',
      'Nichts, alles ist da',
    ],
    correctIndex: 1,
    turkishExplanation:
      "Metinde açıkça 'Kannst du bitte einen Salat oder Kuchen mitbringen?' (Lütfen bir salata veya kek getirebilir misin?) sorulmuştur.",
    difficulty: 'A1.1',
    tag: 'Goethe Lesen Teil 2',
  },
  {
    id: 'r3',
    category: 'reading',
    stimulusText: `SCHILD AM SUPERMARKT:
Sehr geehrte Kundinnen und Kunden,
unsere Öffnungszeiten ab Oktober:
Montag bis Freitag: 08:00 – 20:00 Uhr
Samstag: 08:00 – 16:00 Uhr
Sonntags geschlossen!`,
    questionGerman: 'Kann man am Samstag um 18:00 Uhr im Supermarkt einkaufen?',
    questionTurkishPrompt: 'Cumartesi günü saat 18:00\'de bu marketten alışveriş yapılabilir mi?',
    options: [
      'Nein, samstags schließt der Markt um 16:00 Uhr.',
      'Ja, bis 20:00 Uhr geöffnet.',
      'Ja, aber nur mit Voranmeldung.',
      'Sonntags ist länger offen.',
    ],
    correctIndex: 0,
    turkishExplanation:
      "İlanda 'Samstag: 08:00 – 16:00 Uhr' yazmaktadır. Saat 18:00'de market kapalı olduğundan alışveriş yapılamaz.",
    difficulty: 'A1.2',
    tag: 'Goethe Lesen Teil 3',
  },
  {
    id: 'r4',
    category: 'reading',
    stimulusText: `ARZTPRAXIS DR. WEBER:
Liebe Patienten,
die Praxis ist vom 15. Juli bis zum 30. Juli wegen Urlaub geschlossen.
In Notfällen wenden Sie sich bitte an die Praxis Dr. Müller, Tel: 030-456789.`,
    questionGerman: 'Was müssen Patienten bei einem Notfall tun?',
    questionTurkishPrompt: 'Acil bir durumda hastaların ne yapması gerekiyor?',
    options: [
      'Bis zum 30. Juli warten',
      'Die Praxis Dr. Müller anrufen',
      'Direkt ins Krankenhaus fahren',
      'Eine E-Mail an Dr. Weber schreiben',
    ],
    correctIndex: 1,
    turkishExplanation:
      "Metinde 'In Notfällen wenden Sie sich bitte an die Praxis Dr. Müller, Tel: 030-456789' (Acil durumlarda lütfen Dr. Müller kliniğine başvurunuz) denmektedir.",
    difficulty: 'A1.2',
    tag: 'Goethe Lesen Teil 3',
  },

  // --- HÖREN (Dinleme Becerisi - Audio Destekli Goethe A1) ---
  {
    id: 'h1',
    category: 'listening',
    audioText:
      'Achtung am Gleis drei! Der Intercity-Express nach München über Nürnberg hat zehn Minuten Verspätung. Grund dafür ist eine technische Störung. Bitte beachten Sie die Durchsagen.',
    stimulusText: `BAHNHOFDURCHSAGE (Sesli Anons):
„Achtung am Gleis drei! Der ICE nach München über Nürnberg hat 10 Minuten Verspätung...“`,
    questionGerman: 'Wie viel Verspätung hat der Zug nach München?',
    questionTurkishPrompt: 'Dinlediğiniz anonsa göre tren kaç dakika gecikmelidir?',
    options: ['10 Minuten', '15 Minuten', '20 Minuten', 'Er fällt komplett aus'],
    correctIndex: 0,
    turkishExplanation:
      "Anonsta 'Der Intercity-Express nach München ... hat zehn Minuten Verspätung' (10 dakika rötarlıdır) denmektedir. Doğru yanıt: 10 Minuten.",
    difficulty: 'A1.1',
    tag: 'Goethe Hören Teil 1 (Anons)',
  },
  {
    id: 'h2',
    category: 'listening',
    audioText:
      'Guten Tag, hier spricht die Arztpraxis Dr. Schmidt. Herr Yılmaz, Ihr Termin morgen um zehn Uhr muss leider auf fünfzehn Uhr verschoben werden. Bitte rufen Sie uns zurück.',
    stimulusText: `TELEFONBEANTWORTER (Telesekreter Mesajı):
„...Herr Yılmaz, Ihr Termin morgen um 10 Uhr muss leider auf 15 Uhr verschoben werden...“`,
    questionGerman: 'Wann ist der neue Termin von Herrn Yılmaz?',
    questionTurkishPrompt: 'Herr Yılmaz\'ın yeni randevu saati kaçtır?',
    options: ['Um 10:00 Uhr', 'Um 15:00 Uhr', 'Um 12:00 Uhr', 'Morgen gibt es keinen Termin'],
    correctIndex: 1,
    turkishExplanation:
      "Mesajda randevunun 'auf fünfzehn Uhr' (saat 15:00'e) ertelendiği belirtilmiştir ('verschoben werden').",
    difficulty: 'A1.2',
    tag: 'Goethe Hören Teil 2',
  },
  {
    id: 'h3',
    category: 'listening',
    audioText:
      'Entschuldigung, was kostet dieser Pullover hier? — Der Pullover kostet normalerweise sechzig Euro, aber heute im Angebot nur neununddreißig Euro.',
    stimulusText: `DIALOG IM GESCHÄFT (Mağazada Diyalog):
„...normalerweise 60 Euro, aber heute im Angebot nur 39 Euro.“`,
    questionGerman: 'Wie viel kostet der Pullover heute im Angebot?',
    questionTurkishPrompt: 'Kazak bugün indirimde kaç Euro\'dur?',
    options: ['39 Euro (neununddreißig)', '60 Euro (sechzig)', '49 Euro (neunundvierzig)', '30 Euro (dreißig)'],
    correctIndex: 0,
    turkishExplanation:
      "Satıcı 'heute im Angebot nur neununddreißig Euro' (bugün indirimde sadece 39 Euro) demiştir. 39 = neununddreißig.",
    difficulty: 'A1.1',
    tag: 'Goethe Hören Teil 1 (Sayılar)',
  },
  {
    id: 'h4',
    category: 'listening',
    audioText:
      'Hallo Sarah, hier ist Lisa. Wir treffen uns heute nicht im Café, sondern bei mir zu Hause um halb sieben. Meine Adresse ist Schillerstraße zwölf. Bis später!',
    stimulusText: `SPRACHNACHRICHT (Sesli Mesaj):
„...Wir treffen uns heute nicht im Café, sondern bei mir zu Hause um halb sieben...“`,
    questionGerman: 'Wo treffen sich die Freundinnen?',
    questionTurkishPrompt: 'İki arkadaş nerede buluşuyorlar?',
    options: [
      'Bei Lisa zu Hause',
      'Im Café',
      'In der Sprachschule',
      'Im Park',
    ],
    correctIndex: 0,
    turkishExplanation:
      "Mesajda 'nicht im Café, sondern bei mir zu Hause' (kafede değil, benim evimde) denilmiştir. Dolayısıyla buluşma Lisa'nın evindedir.",
    difficulty: 'A1.2',
    tag: 'Goethe Hören Teil 2',
  },
];
