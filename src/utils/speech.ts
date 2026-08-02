import { TextToSpeech } from '@capacitor-community/text-to-speech';
import { Capacitor } from '@capacitor/core';

type SpeakOptions = {
  interrupt?: boolean;
};

let speechInProgress = false;
let queuedSpeech: {
  text: string;
  onStart?: () => void;
  onEnd?: () => void;
  options: SpeakOptions;
} | null = null;

function completeSpeech() {
  speechInProgress = false;
  if (queuedSpeech) {
    const next = queuedSpeech;
    queuedSpeech = null;
    speakText(next.text, next.onStart, next.onEnd, next.options);
  }
}

/**
 * Professional client-side & native Speech Synthesis utility.
 * Specifically tuned for Portuguese voices (Android/iOS/Web).
 */
export function speakText(
  text: string,
  onStart?: () => void,
  onEnd?: () => void,
  options: SpeakOptions = { interrupt: true }
) {
  if (!text) return;

  const request = {
    text,
    onStart,
    onEnd,
    options: { interrupt: options.interrupt ?? true },
  };

  if (speechInProgress) {
    queuedSpeech = request;

    if (request.options.interrupt) {
      if (Capacitor.isNativePlatform()) {
        TextToSpeech.stop().catch(() => undefined);
      } else if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    }

    return;
  }

  const speakNow = async () => {
    speechInProgress = true;

    if (Capacitor.isNativePlatform()) {
      try {
        if (onStart) onStart();

        await TextToSpeech.speak({
          text: request.text,
          lang: 'pt-BR',
          rate: 0.9,
          pitch: 1.0,
          volume: 1.0,
          category: 'ambient',
        });
      } catch (error) {
        console.error('Erro ao reproduzir voz nativa:', error);
      } finally {
        if (onEnd) onEnd();
        completeSpeech();
      }
      return;
    }

    if (!('speechSynthesis' in window)) {
      console.warn('Speech synthesis is not supported in this browser.');
      completeSpeech();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(request.text);
    const voices = window.speechSynthesis.getVoices();
    const ptVoice = voices.find(
      (v) => v.lang.startsWith('pt-BR') || v.lang.startsWith('pt')
    );

    if (ptVoice) {
      utterance.voice = ptVoice;
    }

    utterance.lang = 'pt-BR';
    utterance.rate = 0.9;
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      if (onStart) onStart();
    };

    utterance.onend = () => {
      if (onEnd) onEnd();
      completeSpeech();
    };

    utterance.onerror = () => {
      if (onEnd) onEnd();
      completeSpeech();
    };

    window.speechSynthesis.speak(utterance);
  };

  if (!request.options.interrupt && speechInProgress) {
    queuedSpeech = request;
    return;
  }

  speakNow();
}

// Pre-load voices if supported (apenas se estiver no ambiente web)
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  window.speechSynthesis.getVoices();
}
