// Dramatic narration using the browser's own speech synthesis. No external services.
export function createNarrator({ onStart, onEnd } = {}) {
  const synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
  let voice = null;
  let volume = 0.75;
  let enabled = true;
  let pending = null;

  function pickVoice() {
    if (!synth) return;
    const voices = synth.getVoices();
    if (!voices.length) return;
    const english = voices.filter((item) => /^en/i.test(item.lang || ''));
    const pool = english.length ? english : voices;
    const preferred = pool.find((item) => /daniel|arthur|george|david|male|uk english male|google uk english/i.test(item.name));
    voice = preferred || pool[0];
  }

  if (synth) {
    pickVoice();
    if (typeof synth.addEventListener === 'function') synth.addEventListener('voiceschanged', pickVoice);
  }

  return {
    available: Boolean(synth),
    speak(text) {
      if (!synth || !enabled || !text) return;
      try {
        synth.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        if (!voice) pickVoice();
        if (voice) utterance.voice = voice;
        utterance.rate = 0.92;
        utterance.pitch = 0.82;
        utterance.volume = volume;
        utterance.onstart = () => onStart?.();
        utterance.onend = () => onEnd?.();
        utterance.onerror = () => onEnd?.();
        window.clearTimeout(pending);
        pending = window.setTimeout(() => {
          try {
            synth.speak(utterance);
          } catch (error) {
            onEnd?.();
          }
        }, 70);
      } catch (error) {
        onEnd?.();
      }
    },
    cancel() {
      window.clearTimeout(pending);
      if (!synth) return;
      try { synth.cancel(); } catch (error) { /* nothing speaking */ }
      onEnd?.();
    },
    setVolume(next) {
      volume = Math.max(0, Math.min(1, next));
      enabled = volume > 0.001;
    },
  };
}