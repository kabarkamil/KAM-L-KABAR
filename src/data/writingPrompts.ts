import { WritingPrompt } from '../types.js';

export const WRITING_PROMPTS: WritingPrompt[] = [
  {
    id: 'wr-t1-form',
    title: 'Sprachschule Anmeldeformular',
    type: 'formular',
    goetheTeil: 'Teil 1 (Formular)',
    situationGerman:
      'Ihre Freundin Fatma Kaya möchte an einem Deutschkurs in Berlin teilnehmen. Helfen Sie ihr beim Ausfüllen des Formulars.',
    situationTurkish:
      'Arkadaşınız Fatma Kaya, Berlin\'de yoğun A1 Almanca kursuna kaydolmak istiyor. Bilgilerini kullanarak formu doldurunuz.',
    requiredPoints: [
      'Familienname (Soyadı): Kaya',
      'Vorname (Adı): Fatma',
      'Wohnort (Şehir): Berlin',
      'Geburtsland (Doğum Ülkesi): Türkei',
      'Kursart (Kurs Türü): Intensivkurs A1',
    ],
    sampleSolution:
      'Familienname: Kaya | Vorname: Fatma | Straße: Kantstraße 12 | Wohnort: 10623 Berlin | Geburtsland: Türkei | Gewünschter Kurs: Intensivkurs A1',
    guidanceTurkish:
      'Formu doldururken büyük harfle ve yazım kurallarına uygun olarak bilgileri giriniz.',
    formFields: [
      { labelGerman: 'Familienname', labelTurkish: 'Soyadı', correctValue: 'Kaya' },
      { labelGerman: 'Vorname', labelTurkish: 'Adı', correctValue: 'Fatma' },
      { labelGerman: 'Geburtsland', labelTurkish: 'Doğum Ülkesi', correctValue: 'Türkei' },
      {
        labelGerman: 'Gewünschter Kurs',
        labelTurkish: 'Kurs Seviyesi',
        correctValue: 'Intensivkurs A1',
        options: ['Intensivkurs A1', 'Abendkurs B1', 'Wochenendkurs B2'],
      },
      {
        labelGerman: 'Zahlungsweise',
        labelTurkish: 'Ödeme Şekli',
        correctValue: 'Kreditkarte',
        options: ['Kreditkarte', 'Barzahlung', 'Überweisung'],
      },
    ],
  },
  {
    id: 'wr-t2-invitation',
    title: 'Einladung zum Geburtstag (Doğum Günü Davetine Cevap)',
    type: 'brief',
    goetheTeil: 'Teil 2 (E-Mail / Brief)',
    situationGerman:
      'Ihr Kollege Thomas hat Sie zu seiner Geburtstagsparty am Samstag eingeladen. Schreiben Sie ihm eine kurze E-Mail (ca. 30 Wörter).',
    situationTurkish:
      'İş arkadaşınız Thomas sizi cumartesi günkü doğum günü partisine davet etti. Ona yaklaşık 30 kelimelik kısa bir e-posta yazınız.',
    requiredPoints: [
      'Bedanken Sie sich für die Einladung (Davet için teşekkür edin)',
      'Sagen Sie zu: Sie kommen gerne (Geleceğinizi onaylayın)',
      'Fragen Sie: Was können Sie mitbringen? (Ne getirebileceğinizi sorun)',
    ],
    minWords: 25,
    sampleSolution: `Lieber Thomas,

vielen Dank für die nette Einladung zu deiner Geburtstagsparty!
Ich komme am Samstag sehr gerne.
Was kann ich zur Party mitbringen? Einen Kuchen oder Getränke?

Viele Grüße,
Ahmet`,
    guidanceTurkish:
      'Goethe A1 mektuplarında şu 4 unsura dikkat edin: 1) Hitap (Lieber Thomas,), 2) Teşekkür, 3) Katılım onayı, 4) Ne getireyim sorusu, 5) Vedalaşma (Viele Grüße,) ve adınız.',
  },
  {
    id: 'wr-t2-excuse',
    title: 'Entschuldigung für den Deutschkurs (Kursa Katılamama Mazereti)',
    type: 'brief',
    goetheTeil: 'Teil 2 (E-Mail / Brief)',
    situationGerman:
      'Sie können morgen nicht zum Deutschunterricht kommen, weil Sie krank sind. Schreiben Sie an Ihre Lehrerin, Frau Müller.',
    situationTurkish:
      'Hasta olduğunuz için yarınki Almanca dersine katılamayacaksınız. Öğretmeniniz Frau Müller\'e resmi bir e-posta yazınız.',
    requiredPoints: [
      'Grund des Schreibens: Sie sind krank (Yazma nedeni: Hastasınız)',
      'Wann können Sie wieder kommen? (Ne zaman derse döneceğinizi bildirin)',
      'Bitten Sie um die Hausaufgaben (Ev ödevlerini rica edin)',
    ],
    minWords: 25,
    sampleSolution: `Sehr geehrte Frau Müller,

leider kann ich morgen nicht zum Unterricht kommen, weil ich krank bin und hohes Fieber habe.
Am Donnerstag bin ich wieder im Kurs.
Können Sie mir bitte die Hausaufgaben per E-Mail schicken?

Mit freundlichen Grüßen,
Emre Demir`,
    guidanceTurkish:
      'Resmi öğretmen hitabı için "Sehr geehrte Frau Müller," kullanılır. Kapanışta "Mit freundlichen Grüßen" ifadesini seçin.',
  },
];
