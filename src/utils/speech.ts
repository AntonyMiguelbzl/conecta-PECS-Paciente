import { TextToSpeech } from '@capacitor-community/text-to-speech';
import { Capacitor } from '@capacitor/core';

/**
 * Professional client-side & native Speech Synthesis utility.
 * Specifically tuned for Portuguese voices (Android/iOS/Web).
 */
export function speakText(text: string, onStart?: () => void, onEnd?: () => void) {
  if (!text) return;

  // 1. Se estiver rodando como APP NATIVO (Android ou iOS)
  if (Capacitor.isNativePlatform()) {
    const speakNative = async () => {
      try {
        // Dispara o callback de início (se houver) antes de começar a falar
        if (onStart) onStart();

        // Para qualquer fala que esteja tocando antes
        await TextToSpeech.stop();

        // Executa a fala nativa usando o motor do Android/iOS
        await TextToSpeech.speak({
          text: text,
          lang: 'pt-BR',
          rate: 0.9,      // Mantém o ritmo ligeiramente mais lento (ideal para PECS)
          pitch: 1.0,
          volume: 1.0,
          category: 'ambient',
        });

        // Dispara o callback de fim assim que a síntese nativa concluir
        if (onEnd) onEnd();
      } catch (error) {
        console.error("Erro ao reproduzir voz nativa:", error);
        // Garante que o fluxo não trave chamando o onEnd mesmo em caso de erro
        if (onEnd) onEnd();
      }
    };

    speakNative();
    return;
  }

  // 2. Fallback para WEB (Navegador tradicional/PWA)
  if (!('speechSynthesis' in window)) {
    console.warn('Speech synthesis is not supported in this browser.');
    return;
  }

  // Cancel any ongoing speech first
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  
  // Try to locate a Brazilian Portuguese voice
  const voices = window.speechSynthesis.getVoices();
  const ptVoice = voices.find(
    (v) => v.lang.startsWith('pt-BR') || v.lang.startsWith('pt')
  );

  if (ptVoice) {
    utterance.voice = ptVoice;
  }

  utterance.lang = 'pt-BR';
  utterance.rate = 0.9; // Slightly slower, perfect for PECS users
  utterance.pitch = 1.0;

  if (onStart) utterance.onstart = onStart;
  if (onEnd) utterance.onend = onEnd;

  window.speechSynthesis.speak(utterance);
}

// Pre-load voices if supported (apenas se estiver no ambiente web)
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  window.speechSynthesis.getVoices();
}