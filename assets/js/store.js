/* ==================================================================
   store.js — localStorage persistence for Hangugeo.
   Queue, stats, streak, history, learned words, preferences.
   ================================================================== */
'use strict';

const Store = (() => {
  const PREFIX = 'hangugeo_';

  function get(key) {
    try { return JSON.parse(localStorage.getItem(PREFIX + key)); }
    catch (e) { return null; }
  }

  function set(key, val) {
    try { localStorage.setItem(PREFIX + key, JSON.stringify(val)); }
    catch (e) { /* quota exceeded — silent fail */ }
  }

  /* ---- Vocabulary queue (daily review cards) ------------------- */
  function getQueue() { return get('queue') || []; }
  function setQueue(q) { set('queue', q); }
  function addToQueue(cards) { const q = getQueue(); q.push(...cards); setQueue(q); }

  /* ---- Learned words (finished reviews) ------------------------ */
  function getLearned() { return get('learned') || []; }
  function addLearned(word) {
    const l = getLearned();
    if (!l.includes(word)) { l.push(word); set('learned', l); }
  }
  function removeLearned(word) {
    set('learned', getLearned().filter(w => w !== word));
  }

  /* ---- Lock: if queue is non-empty, lock practice modules ------ */
  function isLocked() { return getQueue().length > 0; }

  /* ---- Stats per module ---------------------------------------- */
  function recordResult(moduleKey, correct) {
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const stats = get('stats') || { byModule: {}, byDay: {} };

    // per-module
    if (!stats.byModule[moduleKey]) stats.byModule[moduleKey] = { correct: 0, total: 0 };
    stats.byModule[moduleKey].total++;
    if (correct) stats.byModule[moduleKey].correct++;

    // per-day
    if (!stats.byDay[today]) stats.byDay[today] = { correct: 0, total: 0 };
    stats.byDay[today].total++;
    if (correct) stats.byDay[today].correct++;

    // streak update
    updateStreak();

    set('stats', stats);
  }

  function getStats() {
    return get('stats') || { byModule: {}, byDay: {} };
  }

  /* ---- Streak -------------------------------------------------- */
  function getStreak() { return get('streak') || 0; }
  function setStreak(n) { set('streak', n); }
  function streakEnabled() { return get('streakEnabled') !== false; }
  function setStreakEnabled(v) { set('streakEnabled', v); }

  function updateStreak() {
    if (!streakEnabled()) return;
    const today = new Date().toISOString().slice(0, 10);
    const last = get('lastStreakDate');
    if (!last) { setStreak(1); set('lastStreakDate', today); return; }
    if (last === today) return; // already counted today
    const lastDate = new Date(last + 'T00:00:00');
    const todayDate = new Date(today + 'T00:00:00');
    const diff = Math.round((todayDate - lastDate) / 86400000);
    if (diff === 1) { setStreak(getStreak() + 1); }
    else if (diff > 1) { setStreak(0); }
    set('lastStreakDate', today);
  }

  /* ---- History (recent answers) -------------------------------- */
  function getHistory() { return get('history') || []; }
  function addHistory(entry) {
    const h = getHistory();
    h.unshift({ ...entry, ts: Date.now() });
    if (h.length > 200) h.length = 200;
    set('history', h);
  }

  return {
    getQueue, setQueue, addToQueue,
    getLearned, addLearned, removeLearned,
    isLocked,
    recordResult, getStats,
    getStreak, setStreak, streakEnabled, setStreakEnabled, updateStreak,
    getHistory, addHistory,
  };
})();
