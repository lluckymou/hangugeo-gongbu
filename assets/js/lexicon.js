/* ==================================================================
   lexicon.js — Korean vocabulary data access layer
   Tries full dataset first (hangugeo_data.js), falls back to the
   bundled fallback (hangugeo_data_fallback.js) for instant startup.
   ================================================================== */
'use strict';

const Lexicon = (() => {
  let _data = null;
  let _loaded = false;

  function _init() {
    if (_loaded) return;
    // Prefer the full dataset if it has been loaded (lazy, optional).
    if (typeof WORD_DATA !== 'undefined' && Array.isArray(WORD_DATA) && WORD_DATA.length) {
      _data = WORD_DATA;
    } else if (typeof WORD_DATA_FALLBACK !== 'undefined' && Array.isArray(WORD_DATA_FALLBACK) && WORD_DATA_FALLBACK.length) {
      _data = WORD_DATA_FALLBACK;
    } else {
      _data = [];
    }
    _loaded = true;
  }

  /** Return the full array of word objects. */
  function all() { _init(); return _data; }

  /** Look up a single word by its `word` field. */
  function find(word) { _init(); return _data.find(w => w.word === word) || null; }

  /** Search words by word, romanization, meanings, or hanja. */
  function search(query) {
    _init();
    const q = query.toLowerCase().trim();
    if (!q) return _data.slice(0, 50);
    return _data.filter(w =>
      w.word.toLowerCase().includes(q) ||
      (w.rr && w.rr.toLowerCase().includes(q)) ||
      (w.meanings && w.meanings.some(d => d.toLowerCase().includes(q))) ||
      (w.hanja && w.hanja.includes(q)) ||
      (w.definitions && w.definitions.some(d => d.toLowerCase().includes(q))) ||
      (w.definitions_ko && w.definitions_ko.some(d => d.includes(q)))
    );
  }

  /** Return words filtered by part-of-speech, capped by frequency rank. */
  function byPOS(pos, maxRank) {
    _init();
    return _data.filter(w => w.pos === pos && w.frequency <= (maxRank || Infinity));
  }

  /** Count total available words. */
  function count() { _init(); return _data.length; }

  // Allow lazy-loading a full dataset after startup.
  function load(dataset) {
    _data = dataset;
    _loaded = true;
  }

  return { all, find, search, byPOS, count, load };
})();
