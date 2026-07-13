/**
 * Professional client-side Speech Synthesis utility.
 * Specifically tuned for Portuguese voices.
 */

export function speakText(text: string, onStart?: () => void, onEnd?: () => void) {
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

// Pre-load voices if supported
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  window.speechSynthesis.getVoices();
}
