/* ==================================================================
   app.js — Hangugeo application shell, router, and all modules.
   Depends on: i18n, icons, ui, store, tts, staticdata, lexicon, Hangul.
   ================================================================== */
'use strict';

(() => {
  const { el, clear, randInt, shuffle, sample, sampleN, toast, posLabel, norm } = UI;
  const main = document.getElementById('main');
  const bannerHost = document.getElementById('bannerHost');
  let currentView = 'home';

  /* ============================================================ *
   *  Shared widgets
   * ============================================================ */

  function ttsButton(getText) {
    const btn = el('button.tts-btn', { title: t('common.listen'), 'aria-label': t('common.listen'), html: ICONS.speaker() });
    if (!TTS.available()) { btn.disabled = true; btn.innerHTML = ICONS.speakerOff(); }
    btn.addEventListener('click', async () => {
      const text = typeof getText === 'function' ? getText() : getText;
      try { await TTS.speak(text); }
      catch (e) { btn.disabled = true; btn.innerHTML = ICONS.speakerOff(); toast(t('tts.unavailable')); }
    });
    return btn;
  }

  function ttsMini(getText) {
    const b = el('button.tts-mini', { title: t('common.listen'), 'aria-label': t('common.listen'), html: ICONS.speaker() });
    if (!TTS.available()) { b.disabled = true; b.innerHTML = ICONS.speakerOff(); }
    b.addEventListener('click', async (e) => {
      e.stopPropagation();
      try { await TTS.speak(typeof getText === 'function' ? getText() : getText); }
      catch (err) { b.disabled = true; b.innerHTML = ICONS.speakerOff(); toast(t('tts.unavailable')); }
    });
    return b;
  }

  function viewHead(titleKey) {
    return el('div.view-head', {}, [
      el('button.back-btn', { html: ICONS.chevL(), 'aria-label': t('nav.back'), onclick: () => navigate('home') }),
      el('h2', { text: t(titleKey) }),
    ]);
  }

  function skipButton(onClick) {
    return el('button.btn.ghost.block.mt', { html: ICONS.refresh() + '<span>' + t('common.skip') + '</span>', onclick: onClick });
  }
  function flipNext(btn) { btn.innerHTML = ICONS.chevR() + '<span>' + t('common.next') + '</span>'; }

  let modalBack = null;
  function openModal(node) {
    closeModal();
    modalBack = el('div.modal-back', { onclick: (e) => { if (e.target === modalBack) closeModal(); } },
      el('div.modal', {}, node));
    document.body.appendChild(modalBack);
  }
  function closeModal() { if (modalBack) { modalBack.remove(); modalBack = null; } }

  function score(moduleKey, correct) { Store.recordResult(moduleKey, correct); }

  /* ============================================================ *
   *  Header (subtitle + language selector)
   * ============================================================ */
  let langOpen = false;

  function renderHeader() {
    document.getElementById('appSubtitle').textContent = t('app.subtitle');

    const old = document.getElementById('streakChip');
    if (old) old.remove();
    if (Store.streakEnabled() && Store.getStreak() > 0) {
      const chip = el('button#streakChip.streak-chip', {
        title: t('streak.tip'), 'aria-label': t('streak.tip') + ' · ' + Store.getStreak(),
        html: ICONS.flame() + '<span>' + Store.getStreak() + '</span>',
        onclick: () => navigate('stats'),
      });
      document.getElementById('langSel').before(chip);
    }

    const sel = clear(document.getElementById('langSel'));
    sel.classList.toggle('collapsed', !langOpen);
    LANG_META.forEach(l => {
      const b = el('button', { text: l.flag, title: l.label, 'aria-label': l.label });
      if (getLang() === l.code) b.classList.add('active');
      b.addEventListener('click', () => {
        if (!langOpen) { langOpen = true; renderHeader(); return; }
        langOpen = false;
        if (l.code !== getLang()) { setLang(l.code); renderHeader(); navigate(currentView, true); }
        else renderHeader();
      });
      sel.appendChild(b);
    });
    document.getElementById('brand').onclick = () => { if (currentView === 'home') navigate('about'); else navigate('home'); };
  }

  /* ============================================================ *
   *  Banners
   * ============================================================ */
  function renderBanners() {
    clear(bannerHost);
    if (Store.isLocked() && currentView !== 'voc') {
      const n = Store.getQueue().length;
      const b = el('div.banner.lock.glass', {}, [
        el('span', { html: ICONS.lock(), style: 'color:var(--primary-color);display:flex;' }),
        el('div.banner-txt', { html: t('voc.locked.msg', { n }) }),
        el('button.btn.sm', { text: t('voc.locked.go'), onclick: () => navigate('voc') }),
      ]);
      bannerHost.appendChild(b);
    }
  }

  /* ============================================================ *
   *  Router
   * ============================================================ */
  const VIEWS = {};
  function navigate(view, keepScroll) {
    if (Store.isLocked() && view !== 'voc' && view !== 'home' && view !== 'stats' && view !== 'about') {
      toast(t('voc.locked.go'));
      view = 'voc';
    }
    currentView = view;
    try { history.replaceState(null, '', '#' + view); } catch (e) {}
    closeModal();
    renderHeader();
    renderBanners();
    clear(main);
    (VIEWS[view] || VIEWS.home)();
    if (!keepScroll) window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
  }

  /* ============================================================ *
   *  HOME — module grid
   * ============================================================ */
  const MODULES = [
    { key: 'voc',    icon: 'cards',   tint: 'tint-voc',   view: 'voc' },
    { key: 'num',    icon: 'numbers', tint: 'tint-num',   view: 'numbers' },
    { key: 'color',  icon: 'colors',  tint: 'tint-color', view: 'colors' },
    { key: 'horas',  icon: 'clock',   tint: '',           view: 'horas' },
    { key: 'pron',   icon: 'mic',     tint: '',           view: 'pronunciation' },
    { key: 'roman',  icon: 'roman',   tint: 'tint-roman', view: 'romanization' },
    { key: 'hanja',  icon: 'hanja',   tint: 'tint-hanja', view: 'hanja' },
    { key: 'conj',   icon: 'conj',    tint: '',           view: 'conjugator' },
    { key: 'dict',   icon: 'dict',    tint: '',           view: 'dictionary' },
    { key: 'stats',  icon: 'stats',   tint: '',           view: 'stats' },
  ];

  VIEWS.home = function () {
    const v = el('div.view');
    v.appendChild(el('p.muted.mb', { text: t('home.title'), style: 'font-size:14px;margin:6px 0 10px;' }));
    const locked = Store.isLocked();
    const grid = el('div.grid');
    MODULES.forEach(m => {
      const isLockable = m.key !== 'voc';
      const card = el('div.mod-card' + (m.tint ? '.' + m.tint : ''), {
        tabindex: '0', role: 'button',
        onclick: () => navigate(m.view),
        onkeydown: (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigate(m.view); } },
      }, [
        el('div.ic', { html: ICONS[m.icon]() }),
        el('div', {}, [
          el('h3', { text: t('mod.' + m.key + '.name') }),
          el('p', { text: t('mod.' + m.key + '.desc') }),
        ]),
      ]);
      if (locked && isLockable) {
        card.classList.add('locked');
        card.appendChild(el('span.lockbadge', { html: ICONS.lock() }));
      }
      grid.appendChild(card);
    });
    v.appendChild(grid);
    main.appendChild(v);
  };

  /* ============================================================ *
   *  VOCABULARY CARDS
   * ============================================================ */
  let practiceStack = null;

  VIEWS.voc = function () {
    const v = el('div.view');
    v.appendChild(viewHead('mod.voc.name'));

    if (practiceStack && practiceStack.length) {
      v.appendChild(practiceCard());
      main.appendChild(v);
      return;
    }
    practiceStack = null;

    const queue = Store.getQueue();
    if (queue.length) {
      v.appendChild(reviewCard());
      main.appendChild(v);
      return;
    }

    const learnedCount = Store.getLearned().length;
    v.appendChild(el('button.btn.block.mb', { html: ICONS.plus() + '<span>' + t('voc.add.title') + '</span>', onclick: openAddModal }));
    if (learnedCount >= 1) {
      v.appendChild(el('button.btn.ghost.block.mb', { html: ICONS.refresh() + '<span>' + t('voc.practice') + '</span>', onclick: startPractice }));
      v.appendChild(el('p.hint', { text: t('voc.learnedCount', { n: learnedCount }),
        style: 'cursor:pointer;text-decoration:underline;text-underline-offset:3px;', onclick: openLearnedModal }));
    } else {
      v.appendChild(el('p.hint', { text: t('voc.learnedCount', { n: 0 }) }));
    }
    v.appendChild(el('div.empty', { text: t('voc.empty') }));
    main.appendChild(v);
  };

  function flashFace(card) {
    const nodes = [
      el('span.chip.pos-tag', { text: posLabel(card.pos) }),
      el('div.word', { text: card.word }),
      el('div.tts-row', {}, ttsButton(() => card.word)),
    ];

    // Show the primary translation directly (direct_ko or first meaning)
    const primaryDef = card.direct_ko
      || (card.definitions_ko && card.definitions_ko[0])
      || (card.meanings && card.meanings[0])
      || (card.definitions && card.definitions[0]);
    if (primaryDef) {
      nodes.push(el('div.flash-direct', { text: primaryDef, style: 'margin-bottom:6px;' }));
    }

    if (card.romanized || card.rr) {
      nodes.push(el('div', { text: card.romanized || card.rr, style: 'font-size:13px;color:var(--ink-soft);margin-top:2px;' }));
    }

    // Extra definitions (if any beyond the primary one)
    const defs_ko = card.definitions_ko;
    const defs_en = card.definitions || card.meanings;
    const extra_ko = defs_ko ? defs_ko.slice(1) : [];
    const extra_en = defs_en ? defs_en.slice(1) : [];
    const hasExtra = extra_ko.length || extra_en.length;
    if (hasExtra) {
      const defSection = el('div.flash-def-section');
      const defList = el('div');
      let showingKo = !!extra_ko.length;
      const renderDefs = () => {
        clear(defList);
        const defs = showingKo && extra_ko.length ? extra_ko : extra_en;
        if (defs && defs.length) defs.forEach((d) => defList.appendChild(el('div.def', { text: d })));
      };
      renderDefs();
      if (extra_ko.length && extra_en.length) {
        const toggleBtn = el('button.def-lang-toggle', { text: 'EN' });
        toggleBtn.addEventListener('click', () => {
          showingKo = !showingKo;
          renderDefs();
          toggleBtn.textContent = showingKo ? 'EN' : 'KO';
        });
        defSection.appendChild(toggleBtn);
      }
      defSection.appendChild(defList);
      nodes.push(defSection);
    }

    // Examples with translations always visible
    const exs = card.examples ? card.examples.filter(Boolean) : [];
    exs.forEach((ex, i) => {
      const exKo = card.examples_ko && card.examples_ko[i];
      const exEn = card.examples_en && card.examples_en[i];
      const translation = exKo || exEn;
      nodes.push(el('div.example-wrap', {}, [
        el('div.example', { text: '“' + ex + '”' }),
        translation ? el('div.example-ko', { text: translation }) : null,
      ]));
    });

    return el('div.flash', {}, nodes);
  }

  function reviewBtn(cls, label, desc, onclick) {
    return el('div.btn-col', {}, [
      el('button' + cls, { text: label, onclick }),
      el('div.btn-desc', { text: desc }),
    ]);
  }

  function deckButtons(h) {
    return el('div.btn-row.mt', {}, [
      reviewBtn('.btn.again',    t('voc.again'), t('voc.desc.again'), h.again),
      reviewBtn('.btn.ok-light', t('voc.hard'),  t('voc.desc.hard'),  h.hard),
      reviewBtn('.btn.ok',       t('voc.good'),  t('voc.desc.good'),  h.good),
    ]);
  }

  function giveUpLink(onClick) { return el('button.give-up', { text: t('voc.giveUp'), onclick: onClick }); }

  function reviewCard() {
    const wrap = el('div.mt');
    const card = Store.getQueue()[0];
    wrap.appendChild(el('div.progress-pill', { text: t('voc.remaining', { n: Store.getQueue().length }) }));
    wrap.appendChild(flashFace(card));

    const advance = (mutate, correct) => {
      const q = Store.getQueue(); const c = q.shift();
      mutate(q, c); Store.setQueue(q);
      score('vocabulary_cards', correct);
      if (Store.getQueue().length === 0) toast(t('voc.done'));
      navigate('voc', true);
    };

    wrap.appendChild(deckButtons({
      again: () => advance((q, c) => q.push(c), false),
      hard:  () => advance((q, c) => q.splice(Math.floor(q.length / 2), 0, c), true),
      good:  () => advance((q, c) => { Store.addLearned(c.word); }, true),
    }));
    wrap.appendChild(giveUpLink(() => { Store.setQueue([]); navigate('voc'); }));
    return wrap;
  }

  function learnedPool() { return Store.getLearned().map(w => Lexicon.find(w)).filter(Boolean); }

  function startPractice() {
    const pool = learnedPool();
    if (!pool.length) { toast(t('voc.practice.empty')); return; }
    const begin = (n) => { practiceStack = shuffle(pool).slice(0, n); closeModal(); navigate('voc', true); };
    if (pool.length < 5) { begin(pool.length); return; }
    const presets = [5, 10, 20, 50, 100].filter(n => n < pool.length);
    const buttons = presets.map(n => el('button.btn.sm', { text: String(n), onclick: () => begin(n) }));
    buttons.push(el('button.btn.sm', { text: t('voc.practice.all') + ' (' + pool.length + ')', onclick: () => begin(pool.length) }));
    openModal(el('div', {}, [
      el('h3', { text: t('voc.practice') }),
      el('p.modal-sub', { text: t('voc.practice.howMany') }),
      el('div.chips', {}, buttons),
    ]));
  }

  function practiceCard() {
    const wrap = el('div.mt');
    wrap.appendChild(el('div.progress-pill', { text: t('voc.remaining', { n: practiceStack.length }) }));
    wrap.appendChild(flashFace(practiceStack[0]));

    const advance = (mutate, correct) => {
      const c = practiceStack.shift();
      mutate(c);
      score('vocabulary_cards', correct);
      if (practiceStack.length === 0) { practiceStack = null; toast(t('voc.done')); }
      navigate('voc', true);
    };

    wrap.appendChild(deckButtons({
      again: () => advance(c => practiceStack.push(c), false),
      hard:  () => advance(c => practiceStack.splice(Math.floor(practiceStack.length / 2), 0, c), true),
      good:  () => advance(() => {}, true),
    }));
    wrap.appendChild(giveUpLink(() => { practiceStack = null; navigate('voc', true); }));
    return wrap;
  }

  function openLearnedModal() {
    const list = el('div.dict-list', { style: 'max-height:50vh;overflow-y:auto;' });
    const render = () => {
      clear(list);
      const learned = Store.getLearned();
      if (!learned.length) { list.appendChild(el('div.empty', { text: t('voc.empty') })); return; }
      learned.forEach(w => {
        list.appendChild(el('div.dict-item', { style: 'display:flex;align-items:center;gap:8px;' }, [
          el('span.di-word', { text: w, style: 'flex:1;' }),
          ttsMini(() => w),
          el('button.tts-mini', { html: ICONS.x(), title: t('common.close'), onclick: () => { Store.removeLearned(w); render(); } }),
        ]));
      });
    };
    render();
    openModal(el('div', {}, [
      el('h3', { text: t('voc.learnedTitle') }),
      el('p.modal-sub', { text: t('voc.learnedCount', { n: Store.getLearned().length }) }),
      list,
      el('button.btn.ghost.block.mt', { text: t('common.close'), onclick: closeModal }),
    ]));
  }

  function openAddModal() {
    const CLASSES = [
      { pos: 'noun', label: t('pos.noun') },
      { pos: 'verb', label: t('pos.verb') },
      { pos: 'adj',  label: t('pos.adj') },
      { pos: 'adv',  label: t('pos.adv') },
    ];
    let count = 10;

    const countChips = el('div.chips', {});
    [5, 10, 20].forEach(n => {
      const c = el('label.chip' + (n === count ? '.on' : ''), { text: String(n) });
      c.addEventListener('click', () => { count = n; countChips.querySelectorAll('.chip').forEach(x => x.classList.remove('on')); c.classList.add('on'); });
      countChips.appendChild(c);
    });

    const hint = el('div.add-hint', {}, [ el('span.pulse-dot'), el('span', { text: t('voc.add.hint') }) ]);
    const refreshHint = () => { hint.style.display = Object.keys(state).some(p => state[p].on) ? 'none' : 'flex'; };

    const classRows = el('div', { style: 'display:flex;flex-direction:column;gap:8px;' });
    const state = {};
    CLASSES.forEach(c => {
      state[c.pos] = { on: false, top: 100 };
      const cb = el('input', { type: 'checkbox' });
      const topInput = el('input', { type: 'number', min: '1', max: '999999', value: '100' });
      const row = el('label.chip.row', {}, [
        cb, el('span', { text: c.label }),
        el('span.topx', {}, [ el('span', { text: 'TOP' }), topInput ]),
      ]);
      const setOn = (on) => { state[c.pos].on = on; cb.checked = on; row.classList.toggle('on', on); refreshHint(); };
      cb.addEventListener('change', () => setOn(cb.checked));
      ['pointerdown', 'click'].forEach(ev => topInput.addEventListener(ev, e => e.stopPropagation()));
      topInput.addEventListener('input', () => { state[c.pos].top = parseInt(topInput.value, 10) || 100; if (!state[c.pos].on) setOn(true); });
      classRows.appendChild(row);
    });

    const learnedMax = Store.getLearned().length;
    const reviewInput = el('input', { type: 'number', min: '0', max: String(learnedMax), value: '0' });
    reviewInput.addEventListener('input', () => {
      let n = parseInt(reviewInput.value, 10) || 0;
      if (n > learnedMax) { n = learnedMax; reviewInput.value = String(n); }
    });

    const content = el('div', {}, [
      el('h3', { text: t('voc.add.title') }),
      el('p.modal-sub', { text: t('voc.add.sub') }),
      el('div.field', {}, [ el('label', { text: t('voc.add.count') }), countChips ]),
      el('div.field', {}, [ el('label', { text: t('voc.add.classes') }), hint, classRows ]),
      el('div.field', {}, [ el('label', { text: t('voc.add.review') + (learnedMax ? ' (max ' + learnedMax + ')' : '') }), reviewInput ]),
      el('div.btn-row.mt', {}, [
        el('button.btn.ghost', { text: t('common.close'), onclick: closeModal }),
        el('button.btn', { text: t('voc.add.create'), onclick: () => buildDeck(state, count, parseInt(reviewInput.value, 10) || 0) }),
      ]),
    ]);
    openModal(content);
    refreshHint();
  }

  function buildDeck(state, count, reviewCount) {
    const chosen = Object.keys(state).filter(p => state[p].on);
    if (!chosen.length && reviewCount <= 0) { toast(t('voc.add.pickOne')); return; }

    const learned = new Set(Store.getLearned());
    const inQueue = new Set(Store.getQueue().map(w => w.word));
    const seen = new Set();

    let pool = [];
    chosen.forEach(pos => {
      const rank = state[pos].top;
      Lexicon.all().forEach(w => {
        if (w.pos !== pos || w.frequency > rank) return;
        if (!(w.examples && w.examples.length)) return;
        if (learned.has(w.word) || inQueue.has(w.word) || seen.has(w.word)) return;
        seen.add(w.word); pool.push(w);
      });
    });
    const deck = shuffle(pool).slice(0, count);
    deck.forEach(w => seen.add(w.word));

    let reviewDeck = [];
    if (reviewCount > 0) {
      const rpool = Store.getLearned().map(w => Lexicon.find(w))
        .filter(w => w && !inQueue.has(w.word) && !seen.has(w.word));
      reviewDeck = shuffle(rpool).slice(0, reviewCount);
    }

    const added = deck.concat(reviewDeck);
    if (!added.length) { toast(t('voc.notEnough', { n: 0 })); return; }
    const wanted = count * (chosen.length ? 1 : 0) + reviewCount;
    if (added.length < wanted) toast(t('voc.notEnough', { n: added.length }));
    else toast(t('voc.added', { n: added.length }));

    Store.setQueue(Store.getQueue().concat(added));
    closeModal();
    navigate('voc', true);
  }

  /* ============================================================ *
   *  NUMBERS (Sino + Native Korean)
   * ============================================================ */
  VIEWS.numbers = function () {
    const v = el('div.view');
    v.appendChild(viewHead('mod.num.name'));

    let mode = 'd2t', system = 'sino', maxExponent = 0;
    const quizHost = el('div');
    const panel = el('div.panel.glass');

    const systemChips = el('div.chips.mb');
    [['sino', t('num.sino')], ['native', t('num.native')], ['phone', t('num.phone')]].forEach(([m, lbl]) => {
      const c = el('label.chip' + (m === system ? '.on' : ''), { text: lbl });
      c.addEventListener('click', () => {
        system = m; systemChips.querySelectorAll('.chip').forEach(x => x.classList.remove('on')); c.classList.add('on');
        updateMax();
      });
      systemChips.appendChild(c);
    });

    const diffLabel = el('span', { text: t('num.diff.level') + ': ' + t('num.diff.0') });
    const diffSlider = el('input.slider', { type: 'range', min: '0', max: '7', value: '0' });
    diffSlider.addEventListener('input', () => {
      maxExponent = parseInt(diffSlider.value, 10);
      diffLabel.textContent = t('num.diff.level') + ': ' + t('num.diff.' + maxExponent);
    });

    const modeChips = el('div.chips.mb');
    [['d2t', t('num.mode.d2t')], ['t2d', t('num.mode.t2d')]].forEach(([m, lbl]) => {
      const c = el('label.chip' + (m === mode ? '.on' : ''), { text: lbl });
      c.addEventListener('click', () => { mode = m; modeChips.querySelectorAll('.chip').forEach(x => x.classList.remove('on')); c.classList.add('on'); });
      modeChips.appendChild(c);
    });

    function updateMax() {
      if (system === 'phone') { diffSlider.max = '11'; return; }
      diffSlider.max = system === 'sino' ? '7' : '0';
      diffSlider.value = Math.min(diffSlider.value, diffSlider.max);
    }
    updateMax();

    const startBtn = el('button.btn.block.mt', { text: t('common.start'), onclick: () => {
      numberQuiz(quizHost, system, mode, maxExponent);
      startBtn.textContent = t('common.restart');
    } });

    panel.appendChild(el('div.field', {}, [ el('label', { text: t('num.system') }), systemChips ]));
    panel.appendChild(el('div.field', {}, [ el('label'), diffLabel, diffSlider ]));
    panel.appendChild(el('div.field', {}, [ el('label', { text: t('num.mode') }), modeChips ]));
    panel.appendChild(startBtn);
    v.appendChild(quizHost);
    v.appendChild(panel);
    main.appendChild(v);
  };

  function numberQuiz(host, system, mode, maxExponent) {
    clear(host);
    let n;
    if (system === 'phone') {
      const digits = maxExponent > 0 ? Math.min(11, maxExponent + 3) : 10;
      n = [];
      for (let i = 0; i < digits; i++) n.push(randInt(0, 9));
      if (n[0] === 0) n[0] = 1; // phone numbers rarely start with 0 in practice
    } else {
      const max = system === 'sino' ? Math.pow(10, maxExponent > 0 ? maxExponent + 1 : 1) : 99;
      n = randInt(0, max);
    }

    const quiz = el('div.panel.glass.quiz.mb');
    const adv = skipButton(() => numberQuiz(host, system, mode, maxExponent));
    const correctAnswer = system === 'phone'
      ? n.map(d => system === 'sino' ? SINO_NUM[d] : NATIVE_NUM[d]).join(' ')
      : (system === 'sino' ? sinoToKorean(n) : nativeToKorean(n));

    if (mode === 'd2t') {
      quiz.appendChild(el('p.prompt-sub', { text: t('num.prompt.d2t') }));
      const display = system === 'phone' ? n.join('-') : n.toLocaleString('ko-KR');
      quiz.appendChild(el('div.prompt-big', { text: display }));
      const input = el('input', { type: 'text', placeholder: t('num.placeholder.d2t') });
      quiz.appendChild(el('div.field.mt', {}, input));
      const fb = el('div.feedback');
      const check = el('button.btn.block', { text: t('common.check'), onclick: () => {
        const ok = norm(input.value) === norm(correctAnswer);
        score('numeros', ok);
        fb.className = 'feedback ' + (ok ? 'ok' : 'err');
        fb.textContent = ok ? t('common.correct') : t('common.answerWas', { a: correctAnswer });
        check.disabled = true; input.disabled = true; flipNext(adv);
      } });
      quiz.appendChild(check); quiz.appendChild(fb);
    } else {
      quiz.appendChild(el('p.prompt-sub', { text: t('num.prompt.t2d') }));
      quiz.appendChild(el('div.prompt-big', { text: correctAnswer }));
      quiz.appendChild(el('div.tts-row', { style: 'display:flex;justify-content:center;margin:4px 0;' }, ttsButton(() => correctAnswer)));
      const input = el('input', { type: 'text', placeholder: t('num.placeholder.t2d') });
      quiz.appendChild(el('div.field.mt', {}, input));
      const fb = el('div.feedback');
      const check = el('button.btn.block', { text: t('common.check'), onclick: () => {
        const display = system === 'phone' ? n.join('') : String(n);
        const ok = norm(input.value) === norm(display);
        score('numeros', ok);
        fb.className = 'feedback ' + (ok ? 'ok' : 'err');
        fb.textContent = ok ? t('common.correct') : t('common.answerWas', { a: display });
        check.disabled = true; input.disabled = true; flipNext(adv);
      } });
      quiz.appendChild(check); quiz.appendChild(fb);
    }
    quiz.appendChild(adv);
    host.appendChild(quiz);
  }

  /* ============================================================ *
   *  COLORS
   * ============================================================ */
  VIEWS.colors = function () {
    const v = el('div.view');
    v.appendChild(viewHead('mod.color.name'));
    let mode = 'n2c', diff = 'basic';
    const quizHost = el('div');

    const modeChips = el('div.chips.mb');
    [['n2c', t('color.mode.n2c')], ['c2n', t('color.mode.c2n')]].forEach(([m, lbl]) => {
      const c = el('label.chip' + (m === mode ? '.on' : ''), { text: lbl });
      c.addEventListener('click', () => { mode = m; modeChips.querySelectorAll('.chip').forEach(x => x.classList.remove('on')); c.classList.add('on'); colorRound(quizHost, mode, diff); });
      modeChips.appendChild(c);
    });

    const diffChips = el('div.chips.mb');
    [['basic', t('color.diff.basic')], ['intermediate', t('color.diff.intermediate')], ['advanced', t('color.diff.advanced')]].forEach(([d, lbl]) => {
      const c = el('label.chip' + (d === diff ? '.on' : ''), { text: lbl });
      c.addEventListener('click', () => { diff = d; diffChips.querySelectorAll('.chip').forEach(x => x.classList.remove('on')); c.classList.add('on'); colorRound(quizHost, mode, diff); });
      diffChips.appendChild(c);
    });

    v.appendChild(modeChips);
    v.appendChild(diffChips);
    v.appendChild(quizHost);
    main.appendChild(v);
    colorRound(quizHost, mode, diff);
  };

  function colorRound(host, mode, diff) {
    clear(host);
    const pool = COLORS_DATA[diff];
    const color = sample(pool);
    const quiz = el('div.panel.glass.quiz.mb');
    const adv = skipButton(() => colorRound(host, mode, diff));

    if (mode === 'n2c') {
      quiz.appendChild(el('p.prompt-sub', { text: t('color.prompt.n2c') }));
      quiz.appendChild(el('div.prompt-big', { text: color.name }));
      if (color.hanja) quiz.appendChild(el('div', { text: color.hanja, style: 'text-align:center;font-size:13px;color:var(--ink-soft);margin:2px 0;' }));
      const optionsDiv = el('div.options', {});
      const opts = sampleN(pool, Math.min(6, pool.length));
      // ensure correct answer is present
      if (!opts.find(o => o.name === color.name)) {
        opts[randInt(0, opts.length - 1)] = color;
      }
      opts.forEach(o => {
        const sw = el('div.swatch-wrap', { onclick: () => {
          const ok = o.name === color.name;
          score('cores', ok);
          optionsDiv.querySelectorAll('.swatch-wrap').forEach(s => {
            s.style.pointerEvents = 'none';
            if (s.dataset.name === color.name) s.classList.add('correct');
          });
          if (!ok) sw.classList.add('wrong');
          flipNext(adv);
        }, 'data-name': o.name }, [
          el('div.swatch', { style: 'background:' + o.color }),
        ]);
        optionsDiv.appendChild(sw);
      });
      quiz.appendChild(optionsDiv);
    } else {
      quiz.appendChild(el('p.prompt-sub', { text: t('color.prompt.c2n') }));
      const swatchBox = el('div', { style: 'display:flex;justify-content:center;margin:16px 0;' },
        el('div.swatch', { style: 'background:' + color.color + ';width:100px;height:100px;border-radius:24px;' }));
      quiz.appendChild(swatchBox);
      if (color.hanja) quiz.appendChild(el('div', { text: color.hanja, style: 'text-align:center;font-size:12px;color:var(--ink-soft);margin:2px 0 10px;' }));
      const optionsDiv = el('div.options', {});
      const wrongNames = pool.filter(c => c.name !== color.name).map(c => c.name);
      const names = shuffle([color.name, ...sampleN(wrongNames, Math.min(5, wrongNames.length))]);
      names.forEach(name => {
        const o = el('button.opt', { text: name, onclick: () => {
          const ok = name === color.name;
          score('cores', ok);
          optionsDiv.querySelectorAll('.opt').forEach(opt => {
            opt.disabled = true;
            if (opt.textContent === color.name) opt.classList.add('correct');
          });
          if (!ok) o.classList.add('wrong');
          flipNext(adv);
        } });
        optionsDiv.appendChild(o);
      });
      quiz.appendChild(optionsDiv);
    }
    quiz.appendChild(adv);
    host.appendChild(quiz);
  }

  /* ============================================================ *
   *  PRONUNCIATION (Dictation-style reading practice)
   * ============================================================ */
  VIEWS.pronunciation = function () {
    const v = el('div.view');
    v.appendChild(viewHead('mod.pron.name'));
    const quizHost = el('div');
    const panel = el('div.panel.glass');

    let diffLevel = 'basic', mode = 'listen';
    const diffChips = el('div.chips.mb');
    [['basic', t('pron.diff.basic')], ['intermediate', t('pron.diff.intermediate')], ['advanced', t('pron.diff.advanced')]].forEach(([d, lbl]) => {
      const c = el('label.chip' + (d === diffLevel ? '.on' : ''), { text: lbl });
      c.addEventListener('click', () => { diffLevel = d; diffChips.querySelectorAll('.chip').forEach(x => x.classList.remove('on')); c.classList.add('on'); pronRound(quizHost, diffLevel, mode); });
      diffChips.appendChild(c);
    });

    const modeChips = el('div.chips.mb');
    [['listen', t('pron.mode.listen')], ['read', t('pron.mode.read')]].forEach(([m, lbl]) => {
      const c = el('label.chip' + (m === mode ? '.on' : ''), { text: lbl });
      c.addEventListener('click', () => { mode = m; modeChips.querySelectorAll('.chip').forEach(x => x.classList.remove('on')); c.classList.add('on'); pronRound(quizHost, diffLevel, mode); });
      modeChips.appendChild(c);
    });

    panel.appendChild(el('div.field', {}, [ el('label', { text: t('pron.diff') }), diffChips ]));
    panel.appendChild(el('div.field', {}, [ el('label', { text: t('pron.mode') }), modeChips ]));
    v.appendChild(quizHost);
    v.appendChild(panel);
    main.appendChild(v);
    pronRound(quizHost, diffLevel, mode);
  };

  function pronRound(host, diffLevel, mode) {
    clear(host);
    const pool = VOCAB_POOL.filter(w => {
      if (!w.word) return false;
      const len = w.word.length;
      if (diffLevel === 'basic') return len >= 1 && len <= 3;
      if (diffLevel === 'intermediate') return len >= 2 && len <= 5;
      return len >= 3 && len <= 12;
    });
    if (!pool.length) { host.appendChild(el('div.empty', { text: t('common.noData') })); return; }

    const item = sample(pool);
    const quiz = el('div.panel.glass.quiz.mb');
    const adv = skipButton(() => pronRound(host, diffLevel, mode));

    if (mode === 'listen') {
      quiz.appendChild(el('p.prompt-sub', { text: t('pron.prompt.listen') }));
      const listenRow = el('div', { style: 'display:flex;justify-content:center;align-items:center;gap:12px;margin:16px 0;' },
        ttsButton(() => item.word));
      quiz.appendChild(listenRow);
      const input = el('input', { type: 'text', placeholder: t('pron.placeholder') });
      quiz.appendChild(el('div.field.mt', {}, input));
      const fb = el('div.feedback');
      const check = el('button.btn.block', { text: t('common.check'), onclick: () => {
        const ok = norm(input.value) === norm(item.word);
        score('pronunciation', ok);
        fb.className = 'feedback ' + (ok ? 'ok' : 'err');
        fb.textContent = ok ? t('common.correct') : t('common.answerWas', { a: item.word });
        check.disabled = true; input.disabled = true; flipNext(adv);
      } });
      quiz.appendChild(check); quiz.appendChild(fb);
    } else {
      quiz.appendChild(el('p.prompt-sub', { text: t('pron.prompt.read') }));
      quiz.appendChild(el('div.prompt-big', { text: item.word }));
      quiz.appendChild(el('div.tts-row', { style: 'display:flex;justify-content:center;margin:4px 0;' }, ttsButton(() => item.word)));
      if (item.romanized) quiz.appendChild(el('div', { text: item.romanized, style: 'text-align:center;font-size:13px;color:var(--ink-soft);margin:2px 0;' }));
      if (item.direct_ko) quiz.appendChild(el('div', { text: t('pron.meaning') + ': ' + item.direct_ko, style: 'text-align:center;font-size:14px;color:var(--ink-soft);margin:8px 0;' }));
      // In read mode, user practices by listening — just show play button and advance
      const doneBtn = el('button.btn.ok.block.mt', { text: t('pron.gotIt'), onclick: () => {
        score('pronunciation', true);
        pronRound(host, diffLevel, mode);
      } });
      quiz.appendChild(doneBtn);
    }
    quiz.appendChild(adv);
    host.appendChild(quiz);
  }

  /* ============================================================ *
   *  ROMANIZATION (Hangul → Romanized text)
   * ============================================================ */
  VIEWS.romanization = function () {
    const v = el('div.view');
    v.appendChild(viewHead('mod.roman.name'));

    let mode = 'h2r';
    const quizHost = el('div');

    const modeChips = el('div.chips.mb');
    [['h2r', t('roman.mode.h2r')], ['r2h', t('roman.mode.r2h')]].forEach(([m, lbl]) => {
      const c = el('label.chip' + (m === mode ? '.on' : ''), { text: lbl });
      c.addEventListener('click', () => { mode = m; modeChips.querySelectorAll('.chip').forEach(x => x.classList.remove('on')); c.classList.add('on'); romanRound(quizHost, mode); });
      modeChips.appendChild(c);
    });

    v.appendChild(modeChips);
    v.appendChild(quizHost);
    main.appendChild(v);
    romanRound(quizHost, mode);
  };

  function romanRound(host, mode) {
    clear(host);
    const pool = VOCAB_POOL.filter(w => w.word && w.word.length >= 1);
    if (!pool.length) { host.appendChild(el('div.empty', { text: t('common.noData') })); return; }

    const item = sample(pool);
    const quiz = el('div.panel.glass.quiz.mb');
    const adv = skipButton(() => romanRound(host, mode));

    if (mode === 'h2r') {
      quiz.appendChild(el('p.prompt-sub', { text: t('roman.prompt.h2r') }));
      quiz.appendChild(el('div.prompt-big', { text: item.word }));
      quiz.appendChild(el('div.tts-row', { style: 'display:flex;justify-content:center;margin:4px 0;' }, ttsButton(() => item.word)));
      const input = el('input', { type: 'text', placeholder: t('roman.placeholder.h2r') });
      quiz.appendChild(el('div.field.mt', {}, input));
      const fb = el('div.feedback');
      const check = el('button.btn.block', { text: t('common.check'), onclick: () => {
        const expected = item.romanized || item.word;
        const ok = norm(input.value).toLowerCase() === norm(expected).toLowerCase();
        score('romanization', ok);
        fb.className = 'feedback ' + (ok ? 'ok' : 'err');
        fb.textContent = ok ? t('common.correct') : t('common.answerWas', { a: expected });
        check.disabled = true; input.disabled = true; flipNext(adv);
      } });
      quiz.appendChild(check); quiz.appendChild(fb);
    } else {
      quiz.appendChild(el('p.prompt-sub', { text: t('roman.prompt.r2h') }));
      const roman = item.romanized || item.word;
      quiz.appendChild(el('div.prompt-big', { text: roman }));
      const input = el('input', { type: 'text', placeholder: t('roman.placeholder.r2h') });
      quiz.appendChild(el('div.field.mt', {}, input));
      const fb = el('div.feedback');
      const check = el('button.btn.block', { text: t('common.check'), onclick: () => {
        const ok = norm(input.value) === norm(item.word);
        score('romanization', ok);
        fb.className = 'feedback ' + (ok ? 'ok' : 'err');
        fb.textContent = ok ? t('common.correct') : t('common.answerWas', { a: item.word });
        check.disabled = true; input.disabled = true; flipNext(adv);
      } });
      quiz.appendChild(check); quiz.appendChild(fb);
    }
    quiz.appendChild(adv);
    host.appendChild(quiz);
  }

  /* ============================================================ *
   *  HANJA (Chinese character practice)
   * ============================================================ */
  VIEWS.hanja = function () {
    const v = el('div.view');
    v.appendChild(viewHead('mod.hanja.name'));

    let mode = 'h2m', diff = 'top50';
    const quizHost = el('div');

    const modeChips = el('div.chips.mb');
    [['h2m', t('hanja.mode.h2m')], ['m2h', t('hanja.mode.m2h')]].forEach(([m, lbl]) => {
      const c = el('label.chip' + (m === mode ? '.on' : ''), { text: lbl });
      c.addEventListener('click', () => { mode = m; modeChips.querySelectorAll('.chip').forEach(x => x.classList.remove('on')); c.classList.add('on'); hanjaRound(quizHost, mode, diff); });
      modeChips.appendChild(c);
    });

    const diffChips = el('div.chips.mb');
    const levels = [['top50','50'],['top100','100'],['top150','150'],['top225','225'],['top300','300'],['top400','400'],['top500','500'],['top750','750'],['top1000','1K'],['top1500','1.5K'],['top1817','1.8K'],['top2355','2.3K'],['top3500','3.5K'],['top4650','4.6K'],['top5978','6K']];
    levels.forEach(([d, lbl]) => {
      const c = el('label.chip' + (d === diff ? '.on' : ''), { text: lbl });
      c.addEventListener('click', () => { diff = d; diffChips.querySelectorAll('.chip').forEach(x => x.classList.remove('on')); c.classList.add('on'); hanjaRound(quizHost, mode, diff); });
      diffChips.appendChild(c);
    });

    v.appendChild(modeChips);
    v.appendChild(diffChips);
    v.appendChild(quizHost);
    main.appendChild(v);
    hanjaRound(quizHost, mode, diff);
  };

  function hanjaRound(host, mode, diff) {
    clear(host);
    const pool = HANJA_LEVELS[diff] || HANJA_DATA;
    if (!pool.length) { host.appendChild(el('div.empty', { text: t('common.noData') })); return; }
    const item = sample(pool);
    const quiz = el('div.panel.glass.quiz.mb');
    const adv = skipButton(() => hanjaRound(host, mode, diff));

    if (mode === 'h2m') {
      quiz.appendChild(el('p.prompt-sub', { text: t('hanja.prompt.h2m') }));
      quiz.appendChild(el('div', { text: item.character, style: 'font-family:\"Yuji Boku\",\"Noto Serif TC\",serif;font-size:64px;text-align:center;margin:16px 0 6px;' }));
      if (item.korean) {
        quiz.appendChild(el('div', { text: item.korean, style: 'text-align:center;font-size:18px;color:var(--accent);margin:0 0 10px;font-family:\"Nanum Gothic\",sans-serif;' }));
        quiz.appendChild(el('div.tts-row', { style: 'display:flex;justify-content:center;margin-bottom:8px;' }, ttsButton(() => item.korean)));
      }
      const optionsDiv = el('div.options', {});
      const wrongMeanings = pool.filter(h => h.meaning !== item.meaning).map(h => h.meaning);
      const meanings = shuffle([item.meaning, ...sampleN(wrongMeanings, Math.min(5, wrongMeanings.length))]);
      meanings.forEach(meaning => {
        const o = el('button.opt', { text: meaning, style: 'font-size:14px;word-break:break-word;', onclick: () => {
          const ok = meaning === item.meaning;
          score('hanja', ok);
          optionsDiv.querySelectorAll('.opt').forEach(opt => {
            opt.disabled = true;
            if (opt.textContent === item.meaning) opt.classList.add('correct');
          });
          if (!ok) o.classList.add('wrong');
          flipNext(adv);
        } });
        optionsDiv.appendChild(o);
      });
      quiz.appendChild(optionsDiv);
    } else {
      quiz.appendChild(el('p.prompt-sub', { text: t('hanja.prompt.m2h') }));
      quiz.appendChild(el('div.prompt-big', { text: item.meaning }));
      if (item.korean) {
        quiz.appendChild(el('div', { text: item.korean, style: 'text-align:center;font-size:18px;color:var(--accent);margin:4px 0;font-family:\"Nanum Gothic\",sans-serif;' }));
        quiz.appendChild(el('div.tts-row', { style: 'display:flex;justify-content:center;margin-bottom:4px;' }, ttsButton(() => item.korean)));
      }
      const optionsDiv = el('div.options', {});
      const wrongChars = pool.filter(h => h.character !== item.character).map(h => h.character);
      const chars = shuffle([item.character, ...sampleN(wrongChars, Math.min(5, wrongChars.length))]);
      chars.forEach(ch => {
        const o = el('button.opt', { text: ch, style: 'font-family:\"Yuji Boku\",\"Noto Serif TC\",serif;font-size:32px;', onclick: () => {
          const ok = ch === item.character;
          score('hanja', ok);
          optionsDiv.querySelectorAll('.opt').forEach(opt => {
            opt.disabled = true;
            if (opt.textContent === item.character) opt.classList.add('correct');
          });
          if (!ok) o.classList.add('wrong');
          flipNext(adv);
        } });
        optionsDiv.appendChild(o);
      });
      quiz.appendChild(optionsDiv);
    }
    quiz.appendChild(adv);
    host.appendChild(quiz);
  }

  /* ============================================================ *
   *  TIME / HOURS (Korean time expressions)
   * ============================================================ */
  VIEWS.horas = function () {
    const v = el('div.view');
    v.appendChild(viewHead('mod.horas.name'));
    const quizHost = el('div');
    const panel = el('div.panel.glass');

    let mode = 'k2t';
    const modeChips = el('div.chips.mb');
    [['k2t', t('horas.mode.k2t')], ['t2k', t('horas.mode.t2k')]].forEach(([m, lbl]) => {
      const c = el('label.chip' + (m === mode ? '.on' : ''), { text: lbl });
      c.addEventListener('click', () => { mode = m; modeChips.querySelectorAll('.chip').forEach(x => x.classList.remove('on')); c.classList.add('on'); });
      modeChips.appendChild(c);
    });

    const startBtn = el('button.btn.block.mt', { text: t('common.start'), onclick: () => {
      horasRound(quizHost, mode);
      startBtn.textContent = t('common.restart');
    }});

    panel.appendChild(el('div.field', {}, [ el('label', { text: t('horas.mode') }), modeChips ]));
    panel.appendChild(startBtn);
    v.appendChild(quizHost);
    v.appendChild(panel);
    main.appendChild(v);
  };

  function horasRound(host, mode) {
    clear(host);
    const h = randInt(1, 12);
    const m = randInt(0, 59);
    const ampm = Math.random() < 0.5 ? 'am' : 'pm';
    const koreanTime = koreanTimeStr(h, m, ampm);
    const ampmStr = ampm === 'am' ? 'AM' : 'PM';
    const numTime = String(h).padStart(2,'0') + ':' + String(m).padStart(2,'0') + ampmStr;
    // Accept: 07:54AM, 7:54am, 07:54 AM, 7:54 am, 19:54 (24h), etc.
    function normTime(s) {
      let t = s.trim().toUpperCase().replace(/\s+/g, '');
      // Strip leading zeros from hour
      t = t.replace(/^0(\d:\d)/, '$1');
      // If 24h format, convert to 12h for comparison
      const m24 = t.match(/^(\d{1,2}):(\d{2})$/);
      if (m24) {
        let hh = parseInt(m24[1], 10);
        const mm = m24[2];
        const ap = hh >= 12 ? 'PM' : 'AM';
        if (hh > 12) hh -= 12;
        if (hh === 0) hh = 12;
        t = String(hh) + ':' + mm + ap;
      }
      return t;
    }
    const expectedNorm = normTime(numTime);

    const quiz = el('div.panel.glass.quiz.mb');
    const adv = skipButton(() => horasRound(host, mode));

    if (mode === 'k2t') {
      quiz.appendChild(el('p.prompt-sub', { text: t('horas.prompt.k2t') }));
      quiz.appendChild(el('div.prompt-big', { text: koreanTime }));
      quiz.appendChild(el('div.tts-row', { style: 'display:flex;justify-content:center;margin:4px 0;' }, ttsButton(() => koreanTime)));
      const input = el('input', { type: 'text', placeholder: t('horas.placeholder.k2t') });
      quiz.appendChild(el('div.field.mt', {}, input));
      const fb = el('div.feedback');
      const check = el('button.btn.block', { text: t('common.check'), onclick: () => {
        const ok = normTime(input.value) === expectedNorm;
        score('horas', ok);
        fb.className = 'feedback ' + (ok ? 'ok' : 'err');
        fb.textContent = ok ? t('common.correct') : t('common.answerWas', { a: numTime });
        check.disabled = true; input.disabled = true; flipNext(adv);
      }});
      quiz.appendChild(check); quiz.appendChild(fb);
    } else {
      quiz.appendChild(el('p.prompt-sub', { text: t('horas.prompt.t2k') }));
      quiz.appendChild(el('div.prompt-big', { text: numTime }));
      const input = el('input', { type: 'text', placeholder: t('horas.placeholder.t2k') });
      quiz.appendChild(el('div.field.mt', {}, input));
      const fb = el('div.feedback');
      const check = el('button.btn.block', { text: t('common.check'), onclick: () => {
        const ok = norm(input.value) === norm(koreanTime);
        score('horas', ok);
        fb.className = 'feedback ' + (ok ? 'ok' : 'err');
        fb.textContent = ok ? t('common.correct') : t('common.answerWas', { a: koreanTime });
        check.disabled = true; input.disabled = true; flipNext(adv);
      }});
      quiz.appendChild(check); quiz.appendChild(fb);
    }
    quiz.appendChild(adv);
    host.appendChild(quiz);
  }

  function koreanTimeStr(h, m, ampm) {
    const nativeHours = ['', '한', '두', '세', '네', '다섯', '여섯', '일곱', '여덟', '아홉', '열', '열한', '열두'];
    const sinoMinutes = ['', '일', '이', '삼', '사', '오', '육', '칠', '팔', '구', '십'];
    const tensM = ['', '십', '이십', '삼십', '사십', '오십'];
    const prefix = ampm === 'am' ? '오전 ' : ampm === 'pm' ? '오후 ' : '';
    let t = prefix + nativeHours[h] + '시';
    if (m > 0) {
      const ten = Math.floor(m / 10);
      const one = m % 10;
      t += ' ' + (tensM[ten] || '') + (one > 0 ? sinoMinutes[one] : '') + '분';
    }
    return t;
  }

  /* ============================================================ *
   *  VERB CONJUGATOR — full Korean conjugation engine
   * ============================================================ */
  VIEWS.conjugator = function () {
    const v = el('div.view');
    v.appendChild(viewHead('mod.conj.name'));

    const searchRow = el('div.search-row');
    const input = el('input', { type: 'text', placeholder: t('conj.placeholder'), onkeydown: (e) => { if (e.key === 'Enter') doConjugate(); } });
    const btn = el('button.btn', { text: t('conj.conjugate'), onclick: doConjugate });
    searchRow.appendChild(input);
    searchRow.appendChild(btn);
    v.appendChild(searchRow);

    const resultHost = el('div');
    v.appendChild(resultHost);

    function doConjugate() {
      clear(resultHost);
      const w = input.value.trim();
      if (!w) return;
      // Only conjugate verbs that exist in the dictionary
      let dictEntry = Lexicon.find(w);
      if (!dictEntry && !w.endsWith('다')) dictEntry = Lexicon.find(w + '다');
      if (!dictEntry && w.endsWith('다')) dictEntry = Lexicon.find(w.slice(0, -1));
      if (!dictEntry || (dictEntry.pos !== 'verb' && dictEntry.pos !== 'adj')) {
        resultHost.appendChild(el('div.empty', { text: t('conj.notInDict') }));
        return;
      }
      const forms = conjugateFull(dictEntry.word);
      if (!forms) {
        resultHost.appendChild(el('div.empty', { text: t('conj.notFound') }));
        return;
      }
      resultHost.appendChild(renderConjTable(forms));
    }

    main.appendChild(v);
  };

    /* ---- Korean conjugation engine ---- */
  function conjugateFull(word) {
    if (!word || !word.replace(/\s/g, '')) return null;
    if (!word.endsWith('다')) word = word + '다';
    if (word === '다') return null;
    const stemFull = word.slice(0, -1);    // remove 다 → e.g. 하, 먹, 공부하
    const isHada = stemFull === '하' || (stemFull.length > 1 && stemFull.endsWith('하'));
    const nounStem = isHada ? stemFull.slice(0, -1) : stemFull;

    // ---- Compute three base forms (present, past, future) ----
    let presentBase, pastBase, futureBase;

    if (isHada) {
      presentBase = nounStem + '해';
      pastBase    = nounStem + '했';
      futureBase  = nounStem + '하겠';
    } else {
      // Find the last vowel in the stem for vowel harmony
      const yang = 'ㅏㅑㅗㅛㅘㅚㅙ';
      const yin  = 'ㅓㅕㅜㅠㅡㅣㅔㅖㅐㅒㅝㅞㅟㅢ';
      let lastVowel = '';
      for (let i = stemFull.length - 1; i >= 0; i--) {
        const c = stemFull[i];
        if (yang.includes(c) || yin.includes(c)) { lastVowel = c; break; }
      }
      if (!lastVowel) lastVowel = 'ㅏ';
      const harmony = yang.includes(lastVowel) ? '아' : '어';

      // Vowel contraction: stem ending vowel + harmony
      const last = stemFull[stemFull.length - 1];
      const contractions = {
        'ㅏ': { '아': 'ㅏ', '어': 'ㅏ' },  // 가 + 아 = 가
        'ㅑ': { '아': 'ㅑ', '어': 'ㅑ' },
        'ㅓ': { '아': 'ㅓ', '어': 'ㅓ' },  // 서 + 어 = 서
        'ㅕ': { '아': 'ㅕ', '어': 'ㅕ' },
        'ㅗ': { '아': 'ㅘ', '어': 'ㅗ' },  // 오 + 아 = 와 (but 오 + 어 stays 오)
        'ㅛ': { '아': 'ㅛ', '어': 'ㅛ' },
        'ㅜ': { '아': 'ㅜ', '어': 'ㅝ' },  // 주 + 어 = 줘
        'ㅠ': { '아': 'ㅠ', '어': 'ㅠ' },
        'ㅡ': { '아': 'ㅡ', '어': 'ㅓ' },  // 크 + 어 = 커
        'ㅣ': { '아': 'ㅑ', '어': 'ㅕ' },  // 기 + 어 = 겨 (approximation)
        'ㅐ': { '아': 'ㅐ', '어': 'ㅐ' },
        'ㅒ': { '아': 'ㅒ', '어': 'ㅒ' },
        'ㅔ': { '아': 'ㅔ', '어': 'ㅔ' },
        'ㅖ': { '아': 'ㅖ', '어': 'ㅖ' },
        'ㅘ': { '아': 'ㅘ', '어': 'ㅘ' },
        'ㅙ': { '아': 'ㅙ', '어': 'ㅙ' },
        'ㅚ': { '아': 'ㅚ', '어': 'ㅚ' },
        'ㅝ': { '아': 'ㅝ', '어': 'ㅝ' },
        'ㅞ': { '아': 'ㅞ', '어': 'ㅞ' },
        'ㅟ': { '아': 'ㅟ', '어': 'ㅟ' },
        'ㅢ': { '아': 'ㅢ', '어': 'ㅢ' },
      };
      const contr = (contractions[last] && contractions[last][harmony]) || harmony;
      let merged;
      if (contr === harmony) {
        // No contraction — just append
        merged = stemFull + harmony;
      } else if (contr === last) {
        // Same vowel — drop the harmony vowel
        merged = stemFull;
      } else {
        // Different vowel — replace last vowel with contracted form
        merged = stemFull.slice(0, -1) + contr;
      }
      presentBase = merged;
      pastBase    = merged + (harmony === '아' ? 'ㅆ' : 'ㅆ'); // 았/었 → merged + ㅆ
      // Actually: past = presentBase + 'ㅆ' for 았/었 contraction
      // 가 + 았 = 갔 (가 + ㅏ + ㅆ = 갔)
      pastBase = stemFull + (harmony === '아' ? '았' : '었');
      futureBase  = stemFull + '겠';
    }

    // Build the full conjugation table rows
    const rows = [];
    const sf = stemFull;
    const ns = nounStem;
    const pr = presentBase;
    const pa = pastBase;
    const fu = futureBase;

    // Helper: check if stem ends with consonant (batchim)
    function hasBatchim(s) {
      const last = s[s.length - 1];
      return last && !'ㅏㅑㅓㅕㅗㅛㅜㅠㅡㅣㅐㅒㅔㅖㅘㅙㅚㅝㅞㅟㅢ'.includes(last);
    }
    const hb = hasBatchim(sf);

    // ---- DECLARATIVE PRESENT ----
    rows.push({ section: t('conj.declPresent') });
    rows.push({ label: t('conj.infLow'), form: pr, speaker: pr });
    rows.push({ label: t('conj.infHigh'), form: pr + '요', speaker: pr + '요' });
    const dpFormLow = isHada ? (nounStem + '한다') : (hb ? sf + '는다' : sf + 'ㄴ다');
    rows.push({ label: t('conj.formLow'), form: dpFormLow, speaker: dpFormLow });
    const dpFormHigh = isHada ? (nounStem + '합니다') : (hb ? sf + '습니다' : sf + 'ㅂ니다');
    rows.push({ label: t('conj.formHigh'), form: dpFormHigh, speaker: dpFormHigh });

    // ---- DECLARATIVE PAST ----
    rows.push({ section: t('conj.declPast') });
    rows.push({ label: t('conj.infLow'), form: pa + '어', speaker: pa + '어' });
    rows.push({ label: t('conj.infHigh'), form: pa + '어요', speaker: pa + '어요' });
    rows.push({ label: t('conj.formLow'), form: pa + '다', speaker: pa + '다' });
    rows.push({ label: t('conj.formHigh'), form: pa + '습니다', speaker: pa + '습니다' });

    // ---- DECLARATIVE FUTURE ----
    rows.push({ section: t('conj.declFuture') });
    const futStem = hb ? sf + '을' : sf + 'ㄹ';
    rows.push({ label: t('conj.infLow'), form: futStem + ' 거야', speaker: futStem + ' 거야' });
    rows.push({ label: t('conj.infHigh'), form: futStem + ' 거예요', speaker: futStem + ' 거예요' });
    rows.push({ label: t('conj.formLow'), form: futStem + ' 거다', speaker: futStem + ' 거다' });
    rows.push({ label: t('conj.formHigh'), form: futStem + ' 겁니다', speaker: futStem + ' 겁니다' });

    // ---- FUTURE CONDITIONAL ----
    rows.push({ section: t('conj.futCond') });
    rows.push({ label: t('conj.infLow'), form: fu + '어', speaker: fu + '어' });
    rows.push({ label: t('conj.infHigh'), form: fu + '어요', speaker: fu + '어요' });
    rows.push({ label: t('conj.formLow'), form: fu + '다', speaker: fu + '다' });
    rows.push({ label: t('conj.formHigh'), form: fu + '습니다', speaker: fu + '습니다' });

    // ---- INQUISITIVE PRESENT ----
    rows.push({ section: t('conj.inqPresent') });
    rows.push({ label: t('conj.infLow'), form: pr + '?', speaker: pr });
    rows.push({ label: t('conj.infHigh'), form: pr + '요?', speaker: pr + '요' });
    const iqFormLow = isHada ? (nounStem + '하니?') : (hb ? sf + '니?' : sf + '니?');
    rows.push({ label: t('conj.formLow'), form: iqFormLow, speaker: iqFormLow });
    const iqFormHigh = isHada ? (nounStem + '합니까?') : (hb ? sf + '습니까?' : sf + 'ㅂ니까?');
    rows.push({ label: t('conj.formHigh'), form: iqFormHigh, speaker: iqFormHigh });

    // ---- INQUISITIVE PAST ----
    rows.push({ section: t('conj.inqPast') });
    rows.push({ label: t('conj.infLow'), form: pa + '어?', speaker: pa + '어' });
    rows.push({ label: t('conj.infHigh'), form: pa + '어요?', speaker: pa + '어요' });
    rows.push({ label: t('conj.formLow'), form: pa + '니?', speaker: pa + '니' });
    rows.push({ label: t('conj.formHigh'), form: pa + '습니까?', speaker: pa + '습니까' });

    // ---- IMPERATIVE ----
    rows.push({ section: t('conj.imperative') });
    rows.push({ label: t('conj.infLow'), form: pr, speaker: pr });
    const impHigh = isHada ? (nounStem + '하세요') : (hb ? sf + '으세요' : sf + '세요');
    rows.push({ label: t('conj.infHigh'), form: impHigh, speaker: impHigh });
    rows.push({ label: t('conj.formLow'), form: pr + '라', speaker: pr + '라' });
    const impFormHigh = isHada ? (nounStem + '하십시오') : (hb ? sf + '으십시오' : sf + '십시오');
    rows.push({ label: t('conj.formHigh'), form: impFormHigh, speaker: impFormHigh });

    // ---- PROPOSITIVE ----
    rows.push({ section: t('conj.propositive') });
    rows.push({ label: t('conj.infLow'), form: pr, speaker: pr });
    rows.push({ label: t('conj.infHigh'), form: pr + '요', speaker: pr + '요' });
    // Propositive formal low: stem + 자
    let propLow = isHada ? (nounStem + '하자') : sf + '자';
    rows.push({ label: t('conj.formLow'), form: propLow, speaker: propLow });
    const propHigh = isHada ? (nounStem + '합시다') : (hb ? sf + '읍시다' : sf + 'ㅂ시다');
    rows.push({ label: t('conj.formHigh'), form: propHigh, speaker: propHigh });

    // ---- CONNECTIVE ----
    rows.push({ section: t('conj.connective') });
    const connIf = hb ? sf + '으면' : sf + '면';
    rows.push({ label: t('conj.if'), form: connIf, speaker: connIf });
    rows.push({ label: t('conj.and'), form: sf + '고', speaker: sf + '고' });

    // ---- NOMINAL ----
    rows.push({ section: t('conj.nominal') });
    const nomIng = hb ? sf + '음' : sf + 'ㅁ';
    rows.push({ label: t('conj.ing'), form: nomIng, speaker: nomIng });

    return { word, rows };
  }
  function renderConjTable(forms) {
    const wrap = el('div.panel.glass');
    const h3 = el('h3', { text: forms.word, style: 'font-family:\"Nanum Gothic\",sans-serif;font-size:24px;margin-bottom:6px;' });
    wrap.appendChild(h3);
    wrap.appendChild(el('div.tts-row', { style: 'margin-bottom:8px;' }, ttsButton(() => forms.word)));

    const table = el('table.conj-table');
    const thead = el('thead');
    thead.appendChild(el('tr', {}, [
      el('th', { text: '' }),
      el('th', { text: t('conj.conjugation') }),
    ]));
    table.appendChild(thead);
    const tbody = el('tbody');

    forms.rows.forEach(r => {
      if (r.section) {
        // Section header row
        const tr = el('tr');
        const td = el('td', { colspan: '2', style: 'padding:14px 10px 4px;font-weight:700;color:var(--accent);font-size:12px;text-transform:uppercase;letter-spacing:.5px;' });
        td.colSpan = 2;
        td.textContent = r.section;
        tr.appendChild(td);
        tbody.appendChild(tr);
      } else {
        const tr = el('tr');
        tr.appendChild(el('td', { text: r.label }));
        const td = el('td', { style: 'font-family:\"Nanum Gothic\",sans-serif;font-size:16px;padding:8px 10px;' });
        const span = el('span', { text: r.form });
        td.appendChild(span);
        if (r.speaker) {
          td.appendChild(ttsMini(() => r.speaker));
        }
        tr.appendChild(td);
        tbody.appendChild(tr);
      }
    });

    table.appendChild(tbody);
    wrap.appendChild(table);
    return wrap;
  }

  /* ============================================================ *
   *  DICTIONARY
   * ============================================================ */
  VIEWS.dictionary = function () {
    const v = el('div.view');
    v.appendChild(viewHead('mod.dict.name'));

    const searchRow = el('div.search-row');
    const input = el('input', { type: 'text', placeholder: t('dict.placeholder'), onkeydown: (e) => { if (e.key === 'Enter') doSearch(); } });
    const btn = el('button.btn', { text: t('dict.search'), onclick: doSearch });
    searchRow.appendChild(input);
    searchRow.appendChild(btn);
    v.appendChild(searchRow);

    const listHost = el('div.dict-list');
    v.appendChild(listHost);

    function doSearch() {
      clear(listHost);
      const q = input.value.trim();
      const results = q ? Lexicon.search(q).slice(0, 50) : shuffle(Lexicon.all()).slice(0, 50);
      if (!results.length) {
        listHost.appendChild(el('div.empty', { text: t('common.noData') }));
        return;
      }
      results.forEach(w => {
        const item = el('div.dict-item', { onclick: () => showWordDetail(w) }, [
          el('div.di-head', {}, [
            el('span.di-word', { text: w.word }),
            w.pos ? el('span.di-pos', { text: posLabel(w.pos) }) : null,
            w.frequency ? el('span.di-freq', { text: '#' + w.frequency }) : null,
          ]),
          w.meanings && w.meanings[0] ? el('div.di-def', { text: w.meanings[0] }) : null,
        ]);
        listHost.appendChild(item);
      });
    }

    function showWordDetail(w) {
      const content = el('div', {}, [
        el('h3', { text: w.word, style: 'font-family:\"Nanum Gothic\",sans-serif;' }),
        w.pos ? el('span.di-pos', { text: posLabel(w.pos), style: 'margin:4px 0;display:inline-block;' }) : null,
        w.rr ? el('p', { text: w.rr, style: 'font-size:13px;color:var(--ink-soft);margin:4px 0;' }) : null,
        w.hanja ? el('p', { text: w.hanja, style: 'font-family:\"Yuji Boku\",\"Noto Serif TC\",serif;font-size:24px;color:var(--primary-color);margin:6px 0;' }) : null,
        el('div', { style: 'display:flex;align-items:center;gap:10px;margin:8px 0;' }, [
          ttsButton(() => w.word),
          (w.pos === 'verb') ? el('button.btn.sm.ghost', { text: t('dict.conjugate'), onclick: () => { closeModal(); navigate('conjugator'); setTimeout(() => { const inp = main.querySelector('.search-row input'); if (inp) { inp.value = w.word; inp.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' })); } }, 100); } }) : null,
        ]),
      ]);
      if (w.meanings && w.meanings.length) {
        const ul = el('div', { style: 'margin-top:8px;line-height:1.6;' });
        w.meanings.forEach(m => ul.appendChild(el('div', { text: '• ' + m, style: 'font-size:14px;' })));
        content.appendChild(ul);
      }
      if (w.examples && w.examples.length) {
        content.appendChild(el('h4', { text: t('dict.examples'), style: 'margin-top:12px;' }));
        w.examples.forEach((ex, i) => {
          content.appendChild(el('div.example', { text: '“' + ex + '”' }));
          if (w.examples_en && w.examples_en[i]) {
            content.appendChild(el('div.example-ko', { text: w.examples_en[i], style: 'border-left-color:var(--accent);' }));
          }
        });
      }
      openModal(content);
    }

    doSearch();
    main.appendChild(v);
  };

  /* ============================================================ *
   *  STATS
   * ============================================================ */
  VIEWS.stats = function () {
    const v = el('div.view');
    v.appendChild(viewHead('mod.stats.name'));

    const stats = Store.getStats();
    const streak = Store.getStreak();
    const streakEnabled = Store.streakEnabled();

    // Streak card
    v.appendChild(el('div.streak-card.glass', {}, [
      el('div.streak-flame', { html: ICONS.flame() }),
      el('div', {}, [
        el('div.streak-num', { text: String(streak) }),
        el('div.streak-lbl', { text: t('streak.days' + (streak === 1 ? '.1' : '')) }),
      ]),
    ]));

    // Streak toggle
    const toggleLabel = el('span', { text: t('streak.enable') });
    const toggle = el('div.switch', {}, el('label', {},
      [el('input', { type: 'checkbox', checked: streakEnabled }), el('span.track')]));
    toggle.querySelector('input').addEventListener('change', (e) => {
      Store.setStreakEnabled(e.target.checked);
      renderHeader();
    });
    v.appendChild(el('div.toggle-row.glass.mb', {}, [toggleLabel, toggle]));

    // Per-module stats
    const moduleKeys = ['vocabulary_cards', 'numeros', 'cores', 'pronunciation', 'romanization', 'hanja'];
    const modNames = {
      vocabulary_cards: t('mod.voc.name'), numeros: t('mod.num.name'), cores: t('mod.color.name'),
      pronunciation: t('mod.pron.name'), romanization: t('mod.roman.name'), hanja: t('mod.hanja.name'),
    };
    const grid = el('div.stat-grid');
    moduleKeys.forEach(k => {
      const m = stats.byModule[k] || { correct: 0, total: 0 };
      const pct = m.total > 0 ? Math.round((m.correct / m.total) * 100) : '—';
      grid.appendChild(el('div.stat-box', {}, [
        el('div.l', { text: modNames[k] }),
        el('div.v' + (typeof pct === 'number' && pct >= 70 ? '.ok' : '') + (typeof pct === 'number' && pct < 40 ? '.err' : ''),
          { text: typeof pct === 'number' ? pct + '%' : pct }),
        el('div.l', { text: m.correct + '/' + m.total }),
      ]));
    });
    v.appendChild(grid);

    // 7-day chart (simple bar chart using CSS)
    const chartWrap = el('div.chart-wrap.glass');
    chartWrap.appendChild(el('h4', { text: t('stats.chart') }));
    const chartBox = el('div', { style: 'display:flex;align-items:flex-end;gap:6px;height:120px;padding-top:8px;' });
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push(d.toISOString().slice(0, 10));
    }
    const maxVal = Math.max(1, ...days.map(d => (stats.byDay[d] || {}).total || 0));
    days.forEach(d => {
      const dayStats = stats.byDay[d] || { correct: 0, total: 0 };
      const h = maxVal > 0 ? Math.max(2, (dayStats.total / maxVal) * 100) : 2;
      const dayLabel = new Date(d + 'T00:00:00').toLocaleDateString(getLang() === 'ko' ? 'ko-KR' : 'en-US', { weekday: 'short' });
      chartBox.appendChild(el('div', { style: 'flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;' }, [
        el('div', { text: String(dayStats.total), style: 'font-size:10px;color:var(--ink-soft);' }),
        el('div', { style: 'width:100%;height:' + h + 'px;background:linear-gradient(to top,var(--primary-color),var(--holo));border-radius:6px 6px 2px 2px;' }),
        el('div', { text: dayLabel, style: 'font-size:10px;color:var(--ink-soft);' }),
      ]));
    });
    chartWrap.appendChild(chartBox);
    v.appendChild(chartWrap);

    // Learned count summary
    v.appendChild(el('div.stat-box.center.mt', {}, [
      el('div.l', { text: t('voc.learnedTitle') }),
      el('div.v.ok', { text: String(Store.getLearned().length) }),
    ]));

    main.appendChild(v);
  };

  /* ============================================================ *
   *  ABOUT (logo tap)
   * ============================================================ */
  VIEWS.about = function () {
    const aboutEl = el('div.about', {}, [
      el('div.about-main', {}, [
        el('div.about-logo', { text: '🇰🇷', style: 'font-size:100px;line-height:1;' }),
        el('div.about-title', { text: '한국말 공부' }),
        el('div.about-slogan', { text: t('about.slogan') }),
        el('a.about-teacher', { href: 'https://lluc.dev/', target: '_blank', rel: 'noopener noreferrer' },
          [ el('span', { html: ICONS.instagram(), style: 'margin-right:3px;' }), el('span', { text: t('about.creator') }) ]),
      ]),
      el('span', { text: t('about.tap'), style: 'font-size:12px;color:var(--ink-soft);opacity:.6;margin-top:20px;' }),
    ]);
    aboutEl.addEventListener('click', (e) => { if (!e.target.closest('a')) navigate('home'); });
    main.appendChild(aboutEl);
  };

  /* ============================================================ *
   *  Helpers for numbers (sino/native Korean)
   * ============================================================ */
  function sinoToKorean(n) {
    if (n === 0) return '영';
    const units = ['', '일', '이', '삼', '사', '오', '육', '칠', '팔', '구'];
    const tens = ['', '십', '백', '천', '만', '십만', '백만', '천만'];
    if (n < 10) return units[n];
    const s = String(n);
    const parts = [];
    for (let i = 0; i < s.length; i++) {
      const d = parseInt(s[i], 10);
      const place = s.length - i - 1;
      if (d === 0) continue;
      if (place > 0 && d === 1 && place < 4) { parts.push(tens[place]); continue; }
      parts.push(units[d]);
      if (place > 0) parts.push(tens[place]);
    }
    return parts.join('');
  }

  function nativeToKorean(n) {
    const units = ['', '하나', '둘', '셋', '넷', '다섯', '여섯', '일곱', '여덟', '아홉'];
    const tensMap = ['', '열', '스물', '서른', '마흔', '쉰', '예순', '일흔', '여든', '아흔'];
    if (n === 0) return '영';
    if (n < 10) return units[n];
    if (n < 100) {
      const t = Math.floor(n / 10);
      const u = n % 10;
      return (tensMap[t] || '') + (u > 0 ? ' ' + units[u] : '');
    }
    return sinoToKorean(n); // Native Korean numbers max out at 99
  }

  // Vocabulary pool for pronunciation/romanization (falls back to lexicon)
  const VOCAB_POOL = (() => {
    const words = [];
    Lexicon.all().forEach(w => {
      if (w.word && w.romanized) words.push(w);
    });
    // If no romanized data, add common words with basic romanization
    if (!words.length) {
      const basic = [
        { word: '안녕하세요', romanized: 'annyeonghaseyo', direct_ko: 'hello' },
        { word: '감사합니다', romanized: 'gamsahamnida', direct_ko: 'thank you' },
        { word: '사랑해요', romanized: 'saranghaeyo', direct_ko: 'I love you' },
        { word: '좋아요', romanized: 'joayo', direct_ko: 'good' },
        { word: '미안합니다', romanized: 'mianhamnida', direct_ko: 'sorry' },
        { word: '네', romanized: 'ne', direct_ko: 'yes' },
        { word: '아니요', romanized: 'aniyo', direct_ko: 'no' },
        { word: '어디', romanized: 'eodi', direct_ko: 'where' },
        { word: '언제', romanized: 'eonje', direct_ko: 'when' },
        { word: '무엇', romanized: 'mueot', direct_ko: 'what' },
        { word: '사람', romanized: 'saram', direct_ko: 'person' },
        { word: '음식', romanized: 'eumsik', direct_ko: 'food' },
        { word: '물', romanized: 'mul', direct_ko: 'water' },
        { word: '친구', romanized: 'chingu', direct_ko: 'friend' },
        { word: '가족', romanized: 'gajok', direct_ko: 'family' },
        { word: '학교', romanized: 'hakgyo', direct_ko: 'school' },
        { word: '한국', romanized: 'hanguk', direct_ko: 'Korea' },
        { word: '서울', romanized: 'seoul', direct_ko: 'Seoul' },
        { word: '예쁘다', romanized: 'yeppeuda', direct_ko: 'pretty' },
        { word: '맛있다', romanized: 'masitda', direct_ko: 'delicious' },
        { word: '행복하다', romanized: 'haengbokhada', direct_ko: 'happy' },
        { word: '공부하다', romanized: 'gongbuhada', direct_ko: 'to study' },
        { word: '이야기', romanized: 'iyagi', direct_ko: 'story' },
        { word: '하늘', romanized: 'haneul', direct_ko: 'sky' },
        { word: '바다', romanized: 'bada', direct_ko: 'sea' },
      ];
      words.push(...basic);
    }
    return words;
  })();

  /* ============================================================ *
   *  Boot
   * ============================================================ */
  // Build HANJA_LEVELS from the full hanja.js dataset (if loaded),
  // falling back to the built-in small set.
  (function buildHanjaLevels() {
    const levelKeys = [50, 100, 150, 225, 300, 400, 500, 750, 1000, 1500, 1817, 2355, 3500, 4650, 5978];
    // hanja.js defines HANJA_DATA as { 50: [...], 100: [...], ... }
    // Each value is an array of { char, pronunciations, meanings }
    if (typeof HANJA_DATA === 'object' && !Array.isArray(HANJA_DATA) && HANJA_DATA[50]) {
      // Build cumulative levels by merging all entries up to each tier
      const cumulative = {};
      let all = [];
      levelKeys.forEach(k => {
        if (HANJA_DATA[k]) {
          const mapped = HANJA_DATA[k].map(h => ({
            character: h.char,
            korean: (h.pronunciations && h.pronunciations[0]) || '',
            meaning: (h.meanings && h.meanings[0]) || '',
          }));
          all = all.concat(mapped);
        }
        // Store cumulative under a key like 'top50', 'top100', etc.
        cumulative['top' + k] = all.slice();
      });
      window.HANJA_LEVELS = cumulative;
    } else {
      // Fallback to built-in dataset
      window.HANJA_LEVELS = (typeof BUILTIN_HANJA_LEVELS !== 'undefined')
        ? BUILTIN_HANJA_LEVELS
        : { top50: [], top100: [], top150: [] };
    }
  })();

  // Register service worker for offline support
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js').catch(() => {});
  }

  // Parse initial route from hash
  const hash = (window.location.hash || '').replace(/^#/, '');
  const initialView = hash && VIEWS[hash] ? hash : 'home';

  // Render header, banners, and initial view
  renderHeader();
  renderBanners();
  navigate(initialView, true);

  // Handle hash changes (back button)
  window.addEventListener('hashchange', () => {
    const h = (window.location.hash || '').replace(/^#/, '');
    if (h && VIEWS[h] && h !== currentView) navigate(h, true);
  });
})();
