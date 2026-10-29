/**
 * Web Speech API utilities for German pronunciation (TTS)
 * and German speech recognition (STT).
 * Runs completely locally in the user's browser without external paid APIs.
 */

// Check browser support
export function isSpeechSynthesisSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

export function isSpeechRecognitionSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
}

/**
 * Speaks German text using browser's local SpeechSynthesis
 */
export function speakGerman(
  text: string,
  rate: number = 0.9,
  onEnd?: () => void,
  onError?: (err: unknown) => void
): void {
  if (!isSpeechSynthesisSupported()) {
    console.warn('SpeechSynthesis is not supported in this browser.');
    onError?.('SpeechSynthesis not supported');
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'de-DE';
  utterance.rate = rate; // slightly slower for language learners

  // Pick German voice if available
  const voices = window.speechSynthesis.getVoices();
  const germanVoice = voices.find(
    (v) => v.lang.startsWith('de') || v.lang.includes('DE')
  );
  if (germanVoice) {
    utterance.voice = germanVoice;
  }

  utterance.onend = () => {
    onEnd?.();
  };

  utterance.onerror = (e) => {
    console.warn('SpeechSynthesis error:', e);
    onError?.(e);
  };

  window.speechSynthesis.speak(utterance);
}

/**
 * Creates and starts speech recognition session for German (de-DE)
 */
export function startGermanSpeechRecognition(
  onResult: (transcript: string, isFinal: boolean) => void,
  onError: (error: string) => void,
  onEnd: () => void
): { stop: () => void; abort: () => void } | null {
  if (!isSpeechRecognitionSupported()) {
    onError('Tarayıcınız ses tanıma (SpeechRecognition) özelliğini desteklemiyor.');
    return null;
  }

  // @ts-expect-error Webkit Speech Recognition compatibility
  const SpeechRecognitionConstructor = window.SpeechRecognition || window.webkitSpeechRecognition;

  try {
    const recognition = new SpeechRecognitionConstructor();
    recognition.lang = 'de-DE';
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      const text = finalTranscript || interimTranscript;
      onResult(text, Boolean(finalTranscript));
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onerror = (event: any) => {
      let msg = 'Ses algılanamadı.';
      if (event.error === 'not-allowed') {
        msg = 'Mikrofon izni verilmedi. Lütfen tarayıcı izinlerini kontrol edin veya yazarak cevap verin.';
      } else if (event.error === 'no-speech') {
        msg = 'Ses algılanamadı, lütfen tekrar deneyin.';
      }
      onError(msg);
    };

    recognition.onend = () => {
      onEnd();
    };

    recognition.start();

    return {
      stop: () => {
        try {
          recognition.stop();
        } catch {
          // ignore
        }
      },
      abort: () => {
        try {
          recognition.abort();
        } catch {
          // ignore
        }
      },
    };
  } catch (err) {
    onError('Ses tanıma başlatılırken bir sorun oluştu.');
    return null;
  }
}
