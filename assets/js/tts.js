/* ==================================================================
   tts.js — Web Speech API wrapper for Korean with graceful degradation.
   Uses SpeechSynthesis for Korean TTS when available.
   ================================================================== */
'use strict';

const TTS = (() => {
  let _available = null;  // cached check

  function available() {
    if (_available !== null) return _available;
    _available = typeof window !== 'undefined' &&
                 typeof window.speechSynthesis !== 'undefined' &&
                 typeof SpeechSynthesisUtterance !== 'undefined';
    return _available;
  }

  /**
   * Speak Korean text. Returns a promise that resolves when speech ends
   * or rejects if TTS is unavailable.
   */
  function speak(text, options) {
    return new Promise((resolve, reject) => {
      if (!available()) { reject(new Error('TTS unavailable')); return; }

      // Cancel any pending speech
      window.speechSynthesis.cancel();

      const opts = options || {};
      const utterance = new SpeechSynthesisUtterance(text);

      // Best-effort Korean voice selection
      utterance.lang = opts.lang || 'ko-KR';
      utterance.rate = opts.rate || 0.88;    // slightly slower for learners
      utterance.pitch = opts.pitch || 1.0;
      utterance.volume = opts.volume || 1.0;

      // Try to find a Korean voice
      const voices = window.speechSynthesis.getVoices();
      if (voices.length) {
        const koVoice = voices.find(v =>
          v.lang.startsWith('ko') ||
          v.name.includes('Korean') ||
          v.name.includes('Yuna') ||
          v.name.includes('Heami')
        );
        if (koVoice) utterance.voice = koVoice;
      } else {
        // Voices may load asynchronously; retry once
        window.speechSynthesis.onvoiceschanged = () => {
          const v = window.speechSynthesis.getVoices();
          const ko = v.find(vv =>
            vv.lang.startsWith('ko') ||
            vv.name.includes('Korean') ||
            vv.name.includes('Yuna') ||
            vv.name.includes('Heami')
          );
          if (ko) utterance.voice = ko;
        };
      }

      utterance.onend = () => resolve();
      utterance.onerror = (e) => {
        if (e.error === 'canceled' || e.error === 'interrupted') { resolve(); }
        else { reject(e); }
      };

      window.speechSynthesis.speak(utterance);
    });
  }

  /** Speak a single Korean word (shorter utterances work better). */
  function speakWord(word, opts) {
    return speak(word, { ...opts, rate: (opts && opts.rate) || 0.78 });
  }

  /** Speak slowly for dictation / pronunciation practice. */
  function speakSlow(text, opts) {
    return speak(text, { ...opts, rate: (opts && opts.rate) || 0.65 });
  }

  /** Cancel any ongoing speech. */
  function stop() {
    if (available()) window.speechSynthesis.cancel();
  }

  return { available, speak, speakWord, speakSlow, stop };
})();
