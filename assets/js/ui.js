/* ==================================================================
   ui.js — DOM helpers, toast, text normalization for Hangugeo.
   No framework dependencies. Works in any modern browser.
   ================================================================== */
'use strict';

const UI = (() => {

  /* ---- DOM helpers ---------------------------------------------- */
  function el(tag, attrs, children) {
    // Parse "tag#id.class1.class2" shorthand
    let t = tag, id = null;
    const hashIdx = t.indexOf('#');
    if (hashIdx >= 0) {
      // Extract id: everything after '#' until next '.' or end
      const afterHash = t.slice(hashIdx + 1);
      const dotIdx = afterHash.indexOf('.');
      id = dotIdx >= 0 ? afterHash.slice(0, dotIdx) : afterHash;
      // Rebuild tag: before '#' + classes from after id (if any)
      t = t.slice(0, hashIdx) + (dotIdx >= 0 ? afterHash.slice(dotIdx) : '');
    }
    const parts = t.split('.');
    t = parts[0] || 'div';
    const node = document.createElement(t);
    if (id) node.id = id;
    if (parts.length > 1) parts.slice(1).forEach(c => node.classList.add(c));

    if (attrs) {
      Object.keys(attrs).forEach(k => {
        const v = attrs[k];
        if (k === 'text') { node.textContent = v; }
        else if (k === 'html') { node.innerHTML = v; }
        else if (k === 'style' && typeof v === 'string') { node.style.cssText = v; }
        else if (k.startsWith('on')) { node.addEventListener(k.slice(2), v); }
        else if (k === 'tabindex') { node.setAttribute('tabindex', v); }
        else if (k === 'role') { node.setAttribute('role', v); }
        else { node.setAttribute(k, v); }
      });
    }

    if (children) {
      const arr = Array.isArray(children) ? children : [children];
      arr.forEach(c => {
        if (c == null) return;
        if (typeof c === 'string' || typeof c === 'number') {
          node.appendChild(document.createTextNode(String(c)));
        } else {
          node.appendChild(c);
        }
      });
    }

    return node;
  }

  function clear(node) {
    while (node.firstChild) node.removeChild(node.firstChild);
    return node;
  }

  /* ---- Random helpers ------------------------------------------- */
  function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function sample(arr) { return arr[randInt(0, arr.length - 1)]; }

  function sampleN(arr, n) { return shuffle(arr).slice(0, n); }

  /* ---- Text normalization (forgiving input for quiz answers) ---- */
  function norm(str) {
    if (typeof str !== 'string') return '';
    // Normalize Unicode (NFC for Korean/Hangul composed forms)
    let s = str.normalize('NFC');
    // Trim and collapse whitespace
    s = s.trim().replace(/\s+/g, ' ');
    // Remove common punctuation
    s = s.replace(/[.。,，!！?？:：;；'"]/g, '');
    return s;
  }

  /* ---- Toast ---------------------------------------------------- */
  let toastTimer = null;

  function toast(msg, ms) {
    const duration = ms || 2800;
    let host = document.querySelector('.toast-host');
    if (!host) {
      host = el('div.toast-host');
      document.body.appendChild(host);
    }
    const t = el('div.toast', { text: msg });
    host.appendChild(t);
    // Remove after animation
    setTimeout(() => { if (t.parentNode) t.remove(); }, duration + 350);
    // Auto-remove empty host
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      if (host && !host.children.length) host.remove();
    }, duration + 500);
  }

  /* ---- POS label helper ----------------------------------------- */
  function posLabel(pos) {
    if (!pos) return '';
    const map = {
      noun: t('pos.noun'), verb: t('pos.verb'), adj: t('pos.adj'),
      adv: t('pos.adv'), prep: t('pos.prep'), conj: t('pos.conj'),
      pron: t('pos.pron'), art: t('pos.art'), interj: t('pos.interj'),
      num: t('pos.num'), expr: t('pos.expr'),
    };
    return map[pos] || pos;
  }

  /* ---- Pronoun label helper ------------------------------------- */
  const PRONOUN_LABEL = {
    1: { sg: t('pron.1sg'), pl: t('pron.1pl') },
    2: { sg: t('pron.2sg'), pl: t('pron.2pl') },
    3: { sg: t('pron.3sg'), pl: t('pron.3pl') },
  };

  return { el, clear, randInt, shuffle, sample, sampleN, norm, toast, posLabel, PRONOUN_LABEL };
})();
