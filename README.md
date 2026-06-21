# 한국말 공부 — Hangugeo

**Korean learning app** — A PWA for learning Korean through flashcards, quizzes, and practice modes.

---

## Modules

| | Module | Description |
|---|--------|-------------|
| 🃏 | **Vocabulary Cards** | Spaced-repetition flashcards with a daily queue and streak system |
| 🔢 | **Numbers** | Digit ↔ Korean word conversion (Sino + Native), up to 99,999,999 |
| 🎨 | **Colors** | 27 Korean colors — name-to-swatch and swatch-to-name (3 difficulty levels) |
| 🎤 | **Pronunciation** | Listen-and-type dictation with Korean vocabulary |
| R | **Romanization** | Hangul → Romanized transcription quiz |
| 漢 | **Hanja** | Chinese character practice for Korean |
| 📊 | **Stats** | 7-day activity chart, per-module accuracy, and streak tracking |

---

## Features

- **Offline-first PWA** — installable on mobile, works fully offline after the first load
- **Korean UI by default** — all labels, prompts, and definitions in Korean; English toggle available
- **Forgiving input** — normalizes input so minor typos are accepted
- **200-word fallback dataset** — bundled, instant startup; full dataset loads optionally

---

## Structure

```
hangugeo/
├── index.html                     App shell (SPA)
├── manifest.json                  PWA manifest
├── service-worker.js              Offline cache
└── assets/
    ├── css/styles.css             Design system (glassmorphism + blue/purple aurora)
    ├── hangul.js                  Korean text processing (Hangul.js)
    ├── hangugeo.png               App icon
    ├── hangugeo_data.js           Full dataset placeholder (lazy-loaded)
    ├── hangugeo_data_fallback.js  200-word fallback dataset (bundled)
    └── js/
        ├── i18n.js                Korean / English translations
        ├── icons.js               Inline SVG icon set
        ├── ui.js                  DOM helpers, toast, text normalization
        ├── store.js               localStorage: queue, stats, streak, history
        ├── tts.js                 Web Speech API wrapper for Korean
        ├── staticdata.js          Colors, numbers, hanja data
        ├── lexicon.js             Vocabulary data access layer
        └── app.js                 Router + all modules
```

## Running locally

```bash
# Any static file server works:
npx serve .
# or
python3 -m http.server 8080
```

Open `http://localhost:8080`. The service worker requires `http(s)://` — `file://` won't work.

---

## Context

This project was refactored based on [Glória PT](https://github.com/lluckymou/gloriapt) — a Portuguese learning app. Both share the same SPA architecture and offline-first PWA approach.
