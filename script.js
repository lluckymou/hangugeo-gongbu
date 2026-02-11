('use strict');
// Hangul.js
const Hangul = window.Hangul;

// Converter elements
const textInputEl = document.getElementById('hangulInput');
const textOutputEl = document.getElementById('romanizedOutput');
const customJsonEl = document.getElementById('customRules');
const textfieldEl = document.querySelector('.textfield');
const submitBtn = document.getElementById('convertBtn');

// ===== DEFAULTS (unchanging) =====
const HANGEUL_DEFAULTS = {
  hangeul: ['ㄱ','ㄲ','ㄴ','ㄷ','ㄸ','ㄹ','ㅁ','ㅂ','ㅃ','ㅅ','ㅆ','ㅇ','ㅈ','ㅉ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ','ㅏ','ㅐ','ㅑ','ㅒ','ㅓ','ㅔ','ㅕ','ㅖ','ㅗ','ㅛ','ㅜ','ㅠ','ㅡ','ㅣ'],
  consonants: ['ㄱ','ㄲ','ㄴ','ㄷ','ㄸ','ㄹ','ㅁ','ㅂ','ㅃ','ㅅ','ㅆ','ㅇ','ㅈ','ㅉ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'],
  vowels: ['ㅏ','ㅐ','ㅑ','ㅒ','ㅓ','ㅔ','ㅕ','ㅖ','ㅗ','ㅛ','ㅜ','ㅠ','ㅡ','ㅣ'],
  jotiert: ['ㅑ', 'ㅒ', 'ㅖ', 'ㅛ', 'ㅠ', 'ㅕ']
};

// prettier-ignore
// McCune-Reischauer baseline (complete; checkers included)
const mccuneReischauer = {
  ...HANGEUL_DEFAULTS,
  
  // Special symbols (customizable)
  symbols: {
    aspiration: "'",  // Symbol for aspiration (t', k', etc)
    pause: "'",       // Symbol for pause (e.g. n' before ㄱ)
  },
  
  // Checks if letter is a Consonant
  isConsonant(letter) {
    return this.consonants.includes(letter);
  },
  // Checks if letter is a Vowel
  isVowel(letter) {
    return this.vowels.includes(letter);
  },
  // Checks if letter is hangeul. if not, it is blank, abc or special character
  notHangeul(letter) {
    return !this.hangeul.includes(letter);
  },
  ㄱ: 'k',
  kiyeokChecker(preprev, prev, fol, fol2) {
    // Check for 'ㄱㅅ' 받침 -> solve in ㅅchecker
    if (
      fol === 'ㅅ' &&
      (this.consonants.includes(fol2) || this.notHangeul(fol2))
    ) {
      return '';
      // check for 'ㄹㄱ' 받침
    } else if (prev === 'ㄹ' && fol === 'ㅇ') {
      return 'lg';
    } else if (prev === 'ㄹ' && ['ㄱ', 'ㅋ', 'ㄲ'].includes(fol)) {
      return 'l';
    } else if (prev === 'ㄹ' && ['ㄴ', 'ㄹ', 'ㅁ'].includes(fol)) {
      return 'ng';
    } else if (prev === 'ㄹ' && fol === 'ㅎ' && fol2 === 'ㅣ') {
      return "lk" + (this.symbols?.aspiration ?? '\'');
    } else if (
      (prev === 'ㄹ' && this.consonants.includes(fol)) ||
      this.notHangeul(fol)
    ) {
      return 'k';
      // Check for 'ㄹㅂ+ㄱ' case
    } else if (preprev === 'ㄹ' && prev === 'ㅂ') {
      return 'g';
      // normal cases
    } else if (prev === 'ㅇ') {
      return 'g';
    } else if (prev === 'ㅎ') {
      return "k" + (this.symbols?.aspiration ?? '\'');
    } else if (fol === 'ㄴ' || fol === 'ㄹ' || fol === 'ㅁ') {
      return 'ng';
    } else if (
      (this.isVowel(prev) && (this.isVowel(fol))|| fol ==='ㅇ') ||
      ['ㄴ', 'ㄹ', 'ㅁ'].includes(prev)
    ) {
      return 'g';
    } else {
      return 'k';
    }
  },
  ㄲ: 'kk',
  ssKiyeokChecker(prev, fol) {
    if (prev === 'ㄱ') {
      return 'k';
    } else if (['ㄴ', 'ㄹ', 'ㅁ'].includes(fol)) {
      return 'ng';
    } else if (this.notHangeul(fol) || (this.consonants.includes(fol)&& fol !== 'ㅇ')) {
      return 'k';
    } else {
      return 'kk';
    }
  },
  ㄴ: 'n',
  nieunChecker(preprev, prev, fol, fol2) {
    // Check for 'ㄴㅎ','ㄴㅈ' 받침 -> solve in ㅎ/ㅈ checker
    if (
      (fol === 'ㅎ' || fol === 'ㅈ') &&
      (this.consonants.includes(fol2) || this.notHangeul(fol2))
    ) {
      return '';
      // check for 'ㄹㅎ + ㄹ' exception
    } else if (preprev === 'ㄹ' && prev === 'ㅎ') {
      return 'l';
    } else if (prev === 'ㄹ' || fol === 'ㄹ') {
      return 'l';
    } else if (fol === 'ㄱ') {
      return "n" + this.symbols.pause;
    } else {
      return 'n';
    }
  },
  ㄷ: 't',
  digeudChecker(preprev, prev, fol, fol2) {
    // ㄹㅌ + ㄷ exception
    if (preprev === 'ㄹ' && prev === 'ㅌ') {
      return 'd';
    } else if (prev === 'ㅎ') {
      return "t" + (this.symbols?.aspiration ?? '\'');
    } else if (fol === 'ㅇ' && fol2 === 'ㅣ') {
      return 'j';
    } else if (fol === 'ㅎ' && ['ㅣ', 'ㅕ'].includes(fol2)) {
      return "ch" + (this.symbols?.aspiration ?? '\'');
    } else if (
      (this.isVowel(prev) && this.isVowel(fol)) ||
      ['ㄴ', 'ㄹ', 'ㅁ', 'ㅇ'].includes(prev)
    ) {
      return 'd';
    } else if (['ㄴ', 'ㄹ', 'ㅁ'].includes(fol)) {
      return 'n';
    } else if (fol === 'ㅅ') {
      return 's';
    } else {
      return 't';
    }
  },
  ㄸ: 'tt',
  ssDigeudChecker(prev, fol, fol2) {
    if (['ㄷ', 'ㄸ', 'ㅅ', 'ㅆ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅌ'].includes(prev)) {
      return 't';
    } else {
      return 'tt';
    }
  },
  ㄹ: 'r',
  rieulChecker(prev, fol, fol2) {
    // Check for 'ㄹㄱ','ㄹㅁ', 'ㄹㅂ', 'ㄹㅅ', 'ㄹㅌ', 'ㄹㅍ', 'ㄹㅎ' 받침 -> solve in respective consonant checkers
    if (
      ['ㄱ', 'ㅁ', 'ㅂ', 'ㅅ', 'ㅌ', 'ㅍ', 'ㅎ'].includes(fol) &&
      (this.consonants.includes(fol2) || this.notHangeul(fol2))
    ) {
      return '';
    } else if ((this.isVowel(prev) && this.isVowel(fol)) || (fol === 'ㅇ' || fol ==='ㅎ')) {
      return 'r';
    } else if (['ㄴ', 'ㄹ'].includes(prev)) {
      return 'l';
    // prettier-ignore
    } else if (
      ['ㄱ','ㄲ','ㄷ','ㄸ','ㅁ','ㅂ','ㅃ','ㅅ','ㅆ','ㅇ','ㅈ','ㅉ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'].includes(prev)
    ) {
      return 'n';
    } else if (this.notHangeul(prev)) {
      return 'r';
    } else {
      return 'l';
    }
  },
  ㅁ: 'm',
  mieumChecker(prev, fol, fol2) {
    // check for 'ㄹㅁ + vokal' case
    if (prev === 'ㄹ' && fol === 'ㅇ') {
      return 'lm';
    } else {
      return 'm';
    }
  },

  ㅂ: 'p',
  bieubChecker(preprev, prev, fol, fol2) {
    // check for 'ㅂㅅ' 받침
    if (
      fol === 'ㅅ' &&
      (this.consonants.includes(fol2) || this.notHangeul(fol2))
    ) {
      return '';

      // ㄹㅂ 받침
    } else if (prev === 'ㄹ' && fol === 'ㅇ') {
      return 'lb';
    } else if (prev === 'ㄹ' && fol === 'ㅎ') {
      return "lp" + (this.symbols?.aspiration ?? '\'');
    } else if (prev === 'ㄹ' && fol === 'ㄴ') {
      return 'm';
    } else if (
      preprev === 'ㅏ' &&
      prev === 'ㄹ' &&
      ['ㄷ', 'ㄱ'].includes(fol)
    ) {
      return 'p';
    } else if (
      preprev === 'ㅓ' &&
      prev === 'ㄹ' &&
      fol === 'ㄷ' &&
      fol2 === 'ㅜ'
    ) {
      return 'p';
    } else if (
      prev === 'ㄹ' &&
      ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅍ', 'ㅃ'].includes(fol)
    ) {
      return 'l';
    } else if (prev === 'ㄹ' && this.consonants.includes(fol)) {
      return 'p';
    } else if (prev === 'ㄹ' && this.notHangeul(fol)) {
      return 'l';
      // normal cases
    } else if (
      (this.isVowel(prev) && this.isVowel(fol)) ||
      ['ㄴ', 'ㄹ', 'ㅁ', 'ㅇ'].includes(prev)
    ) {
      return 'b';
    } else if (['ㄴ', 'ㄹ', 'ㅁ'].includes(fol)) {
      return 'm';
    } else return 'p';
  },
  ㅃ: 'pp',
  ssBieubChecker(prev, fol) {
    if (['ㅂ', 'ㅃ', 'ㅍ'].includes(prev)) {
      return 'p';
    } else return 'pp';
  },
  ㅅ: 's',
  siotChecker(prepreprev, preprev, prev, fol, fol2, fol3) {
    // check for 'ㄱㅅ' 받침
    if (prev === 'ㄱ' && fol === 'ㅇ') {
      return 'ks';
    } else if (prev === 'ㄱ' && ['ㄴ', 'ㄹ', 'ㅁ'].includes(fol)) {
      return 'ng';
    } else if (
      prev === 'ㄱ' &&
      (this.consonants.includes(fol) || this.notHangeul(fol))
    ) {
      return 'k';
      // check for 'ㄹㅅ' 받침
    } else if (prev === 'ㄹ' && fol === 'ㅇ') {
      return 'ls';
    } else if (prev === 'ㄹ' && this.consonants.includes(fol)) {
      return 'l';
    } else if (prev === 'ㄹ' && this.notHangeul(fol)) {
      return 'l';
      // check for 'ㅂㅅ' 받침
      // 값어치 exception
    } else if (
      preprev === 'ㅏ' &&
      prev === 'ㅂ' &&
      fol === 'ㅇ' &&
      (fol2 === 'ㅏ' || fol2 === 'ㅓ')
    ) {
      return 'p';
    } else if (prev === 'ㅂ' && fol === 'ㅇ') {
      return 'ps';
    } else if (prev === 'ㅂ' && ['ㄴ', 'ㄹ', 'ㅁ'].includes(fol)) {
      return 'm';
    } else if (
      prev === 'ㅂ' &&
      (this.consonants.includes(fol) || this.notHangeul(fol))
    ) {
      return 'p';
      // check for 읏,윗,첫,헛,풋,갓 Prefixes
      // 웃어른 exception
    } else if (
      preprev === 'ㅇ' &&
      prev === 'ㅜ' &&
      fol === 'ㅇ' &&
      fol2 === 'ㅓ'
    ) {
      return 'd';
      // 윗
    } else if (
      prepreprev === 'ㅇ' &&
      preprev === 'ㅜ' &&
      prev === 'ㅣ' &&
      fol === 'ㅇ' &&
      fol2 !== 'ㅣ'
    ) {
      return 'd';
      // 첫, 헛
    } else if (
      ['ㅊ', 'ㅎ'].includes(preprev) &&
      prev === 'ㅓ' &&
      fol === 'ㅇ' &&
      (!this.jotiert.includes(fol2) || fol2 === 'ㅣ')
    ) {
      return 'd';
      // check for ㅅ이+ cases (나뭇잎, 깻잎,  등)
    } else if (
      fol === 'ㅇ' &&
      fol2 === 'ㅣ' &&
      !this.jotiert.includes(fol3)
    ) {
      return 'nn';
      // normal cases
    } else if (fol === 'ㅇ' && fol2 === 'ㅣ') {
      return 'sh';
    } else if (fol === 'ㅇ') {
      return 's';
    } else if (fol === 'ㅎ' && this.vowels.includes(fol2)) {
      return '';
    } else if (fol === 'ㅎ' && this.notHangeul(fol2)) {
      return 't';
    } else if (fol === 'ㅈ') {
      return '';
    } else if (fol === 'ㅅ') {
      return 't';
    } else if (this.isVowel(prev) && this.isVowel(fol)) {
      return 's';
    } else if (this.notHangeul(fol)) {
      return 't';
    } else if (this.vowels.includes(prev) && (this.consonants.includes(fol)&& fol !== 'ㅇ')) {
      return 't';
    } else {
      return 's';
    }
  },
  ㅆ: 'ss',
  ssSiotChecker(prev, fol, fol2) {
    if (fol === 'ㅇ' && fol2 === 'ㅣ') {
      return 'tch';
    } else if (fol === 'ㅇ') {
      return 'ss';
    } else if (fol === 'ㅎ' && this.vowels.includes(fol2)) {
      return '';
    } else if (fol === 'ㅈ') {
      return '';
    } else if (fol === 'ㅅ') {
      return 't';
    } else if (this.isVowel(prev) && this.isVowel(fol)) {
      return 'ss';
    } else if (this.notHangeul(fol)) {
      return 't';
    } else if (this.vowels.includes(prev) && (this.consonants.includes(fol)&& fol !== 'ㅇ')) {
      return 't';
    } else {
      return 'ss';
    }
  },
  ㅇ: '',
  ieungChecker(prev, fol) {
    if (this.isVowel(prev) && (fol === undefined || this.notHangeul(fol))) {
      return 'ng';
    } else if (this.notHangeul(prev) && this.isVowel(fol)) {
      return '';
    } else if (this.isConsonant(prev) && this.isVowel(fol)) {
      return '';
    } else if (this.isVowel(prev) && this.isVowel(fol)) {
      return '';
    } else if (fol === 'ㅇ') {
      return '';
    } else {
      return 'ng';
    }
  },
  ㅈ: 'ch',
  jieutChecker(prev, fol, fol2) {
    // check for 'ㄴㅈ' 받침
    if (prev === 'ㄴ' && fol === 'ㅇ') {
      return 'nj';
    } else if (prev === 'ㄴ' && ['ㄱ', 'ㄷ', 'ㅂ', 'ㅅ', 'ㅈ'].includes(fol)) {
      return 'n';
    } else if (prev === 'ㄴ' && fol === 'ㅎ' && ['ㅣ', 'ㅕ'].includes(fol2)) {
      return "nch" + (this.symbols?.aspiration ?? '\'');
    } else if (prev === 'ㄴ' && fol === 'ㅎ') {
      return 'nh';
    } else if (prev === 'ㄴ' && this.consonants.includes(fol)) {
      return 'n';
    } else if (prev === 'ㄴ' && this.notHangeul(fol)) {
      return 'n';
    } else if (prev === 'ㅎ') {
      return "ch" + (this.symbols?.aspiration ?? '\'');
    } else if (fol === 'ㅇ' && fol2 === 'ㅣ') {
      return 'j';
    } else if (fol === 'ㅎ' && ['ㅣ', 'ㅕ'].includes(fol2)) {
      return "ch" + (this.symbols?.aspiration ?? '\'');
    } else if (
      (this.isVowel(prev) && this.isVowel(fol)) ||
      ['ㄴ', 'ㄹ', 'ㅁ', 'ㅇ'].includes(prev)
    ) {
      return 'j';
    } else {
      return 'ch';
    }
  },
  ㅉ: 'tch',
  ssJieutChecker(prev, fol) {
    if (fol === 'ㅇ') {
      return 'tch';
    } else {
      return 'tch';
    }
  },
  ㅊ: "ch'",
  chieutChecker(prev, fol, fol2) {
    if (prev === 'ㅎ') {
      return "ch" + (this.symbols?.aspiration ?? '\'');
    } else if (fol === 'ㅇ' && fol2 === 'ㅣ') {
      return "ch" + (this.symbols?.aspiration ?? '\'');
    } else if (fol === 'ㅎ' && ['ㅣ', 'ㅕ'].includes(fol2)) {
      return "ch" + (this.symbols?.aspiration ?? '\'');
    } else {
      return "ch" + (this.symbols?.aspiration ?? '\'');
    }
  },
  ㅋ: "k'",
  kieukChecker(prev, fol) {
    if (fol === 'ㅇ') {
      return "k" + (this.symbols?.aspiration ?? '\'');
    } else {
      return "k" + (this.symbols?.aspiration ?? '\'');
    }
  },
  ㅌ: "t'",
  tieutChecker(preprev, prev, fol, fol2) {
    // ㄹㅌ 받침
    if (prev === 'ㄹ' && fol === 'ㅇ') {
      return "lt" + (this.symbols?.aspiration ?? '\'');
    } else if (prev === 'ㄹ' && fol === 'ㄷ') {
      return 'l';
    } else if (prev === 'ㄹ' && fol === 'ㄴ') {
      return 'n';
    } else if (prev === 'ㄹ' && this.consonants.includes(fol)) {
      return "t" + (this.symbols?.aspiration ?? '\'');
    } else if (prev === 'ㄹ' && this.notHangeul(fol)) {
      return 'l';
    } else if (fol === 'ㅇ' && fol2 === 'ㅣ') {
      return "ch" + (this.symbols?.aspiration ?? '\'');
    } else if (fol === 'ㅎ' && ['ㅣ', 'ㅕ'].includes(fol2)) {
      return "t" + (this.symbols?.aspiration ?? '\'');
    } else {
      return "t" + (this.symbols?.aspiration ?? '\'');
    }
  },
  ㅍ: "p'",
  pieupChecker(prev, fol) {
    // check for 'ㄹㅍ' 받침
    if (prev === 'ㄹ' && fol === 'ㅇ') {
      return "lp" + (this.symbols?.aspiration ?? '\'');
    } else if (prev === 'ㄹ' && fol === 'ㄴ') {
      return 'm';
    } else if (prev === 'ㄹ' && this.consonants.includes(fol)) {
      return "p" + (this.symbols?.aspiration ?? '\'');
    } else if (prev === 'ㄹ' && this.notHangeul(fol)) {
      return 'l';
    } else if (this.vowels.includes(prev) && this.isVowel(fol)) {
      return "p" + (this.symbols?.aspiration ?? '\'');
    } else if (this.vowels.includes(prev) && this.notHangeul(fol)) {
      return "p" + (this.symbols?.aspiration ?? '\'');
    } else if (this.vowels.includes(prev) && (this.consonants.includes(fol)&& fol !== 'ㅇ')) {
      return "p" + (this.symbols?.aspiration ?? '\'');
    } else if (['ㄴ', 'ㄹ', 'ㅁ'].includes(fol)) {
      return 'm';
    } else return "p" + (this.symbols?.aspiration ?? '\'');
  },
  ㅎ: 'h',
  hieutChecker(preprev, prev, fol, fol2) {
    // check for 'ㄴㅈ+히' exception
    if (preprev === 'ㄴ' && prev === 'ㅈ' && fol === 'ㅣ') {
      return '';
      // check for 'ㄹㄱ+ㅎ' exception
    } else if (preprev === 'ㄹ' && prev === 'ㄱ' && fol === 'ㅣ') {
      return '';
      // check for 'ㄴㅎ' 받침
    } else if (prev === 'ㄴ' && fol === 'ㅇ' && this.vowels.includes(fol2)) {
      return 'n';
    } else if (prev === 'ㄴ' && fol === 'ㅇ') {
      return 'nh';
    } else if (prev === 'ㄴ' && ['ㄱ', 'ㄷ', 'ㅂ', 'ㅈ'].includes(fol)) {
      return 'n';
    } else if (prev === 'ㄴ' && fol === 'ㄴ') {
      return 'n';
    } else if (prev === 'ㄴ' && fol === 'ㅅ') {
      return 'ns';
      // check for 'ㄹㅎ' 받침
    } else if (prev === 'ㄹ' && fol === 'ㅇ' && this.vowels.includes(fol2)) {
      return 'r';
    } else if (prev === 'ㄹ' && fol === 'ㅇ') {
      return 'rh';
    } else if (prev === 'ㄹ' && ['ㄱ', 'ㄷ', 'ㅂ', 'ㅈ'].includes(fol)) {
      return 'l';
    } else if (prev === 'ㄹ' && fol === 'ㄴ') {
      return 'l';
      // normal cases
    } else if (
      this.vowels.includes(prev) &&
      fol === 'ㅇ' &&
      this.vowels.includes(fol2)
    ) {
      return '';
    } else if (
      ['ㄷ','ㅈ'].includes(prev) && ['ㅣ','ㅕ'].includes(fol)
    ) {
      return '';


    } else if (fol === 'ㅅ') {
      return 's';
    } else if (this.vowels.includes(prev) && fol === 'ㄴ') {
      return 'n';
    } else if (this.vowels.includes(prev) && this.notHangeul(fol)) {
      return 't';
    } else if (this.notHangeul(fol) || ['ㄱ', 'ㄷ', 'ㅈ'].includes(fol)) {
      return '';
    } else {
      return 'h';
    }
  },
  ㅏ: 'a',
  aChecker(prev, fol, fol2) {
    if (prev === 'ㅗ') {
      return '';
    } else {
      return 'a';
    }
  },
  ㅐ: 'ae',
  aeChecker(prev, fol, fol2) {
    if (prev === 'ㅗ') {
      return '';
    } else {
      return 'ae';
    }
  },
  ㅑ: 'ya',
  ㅒ: 'yae',
  ㅓ: 'ŏ',
  eoChecker(prev, fol, fol2) {
    if (prev === 'ㅜ') {
      return '';
    } else {
      return 'ŏ';
    }
  },
  ㅔ: 'e',
  eChecker(prev, fol, fol2) {
    if (prev === 'ㅜ') {
      return '';
    } else {
      return 'e';
    }
  },
  ㅕ: 'yŏ',
  ㅖ: 'ye',
  ㅗ: 'o',
  oChecker(prev, fol, fol2) {
    if (fol === 'ㅏ') {
      return 'wa';
    } else if (fol === 'ㅐ') {
      return 'wae';
    } else if (fol === 'ㅣ') {
      return 'oe';
    } else {
      return 'o';
    }
  },
  ㅛ: 'yo',
  ㅜ: 'u',
  uChecker(prev, fol, fol2) {
    if (fol === 'ㅓ') {
      return 'wŏ';
    } else if (fol === 'ㅣ') {
      return 'wi';
    } else if (fol === 'ㅔ') {
      return 'we';
    } else {
      return 'u';
    }
  },
  ㅠ: 'yu',
  ㅡ: 'ŭ',
  euChecker(prev, fol, fol2) {
    if (fol === 'ㅣ') {
      return 'ŭi';
    } else {
      return 'ŭ';
    }
  },
  ㅣ: 'i',
  iChecker(prev, fol, fol2) {
    if (['ㅗ', 'ㅜ', 'ㅡ'].includes(prev)) {
      return '';
    } else {
      return 'i';
    }
  },
};

// Helper to create an automatic checker from an array (vowels or consonant batchim arrays)
const createArrayChecker = function(letter, options, dict) {
  return function(preprev, prev, fol, fol2) {
    if (!Array.isArray(options)) {
      return options;
    }

    // Special case for ㅇ (ieung) - silent at start or after non-hangeul (space, punctuation)
    if (letter === 'ㅇ') {
      // Silent if:
      // - No previous letter (start of word)
      // - Previous is non-Hangeul (space, punctuation, etc.)
      // - Or previous is consonant but next is vowel (onset position)
      if (!prev || dict.notHangeul(prev) || (dict.isConsonant(prev) && dict.isVowel(fol))) {
        return options[0] || "";  // Sempre silent no início ou após pausa
      }
      // Otherwise batchim (ng)
      return options[1] || "ng";
    }

    // Para consoantes normais
    if (dict.isConsonant(letter)) {
      // Onset: before vowel or before ㅇ + vowel
      if (dict.isVowel(fol) || (fol === 'ㅇ' && dict.isVowel(fol2))) {
        return options[0] || options[options.length - 1] || dict[letter] || letter;
      }

      // Special ㄴ + ㄱ → n' (pause)
      if (letter === 'ㄴ' && fol === 'ㄱ') {
        return (options[1] || 'n') + (dict.symbols?.pause ?? "'");
      }

      // Batchim cases
      if (fol === 'ㄴ' || fol === 'ㅁ') {
        return options[2] || options[1] || options[0] || dict[letter] || letter;
      }
      if (fol === 'ㄹ') {
        return options[3] || options[1] || options[0] || dict[letter] || letter;
      }
      if (!fol || dict.notHangeul(fol)) {
        return options[4] || options[1] || options[0] || dict[letter] || letter;
      }

      // Fallback batchim
      return options[1] || options[options.length - 1] || dict[letter] || letter;
    }

    // Para vogais (diphthongs e regras existentes)
    if (letter === 'ㅗ') {
      if (fol === 'ㅏ') return options[0] || 'wa';
      if (fol === 'ㅐ') return options[1] || 'wae';
      if (fol === 'ㅣ') return options[2] || 'oe';
      return options[3] || options[options.length - 1];
    }

    if (letter === 'ㅜ') {
      if (fol === 'ㅓ') return options[0] || 'wo';
      if (fol === 'ㅣ') return options[1] || 'wi';
      if (fol === 'ㅔ') return options[2] || 'we';
      return options[3] || options[options.length - 1];
    }

    if (letter === 'ㅡ') {
      if (fol !== 'ㅣ') return options[3] || options[options.length - 1] || 'eu';
      if (!prev || dict.notHangeul(prev)) return options[0] || 'eui';
      if (dict.isVowel(prev)) return options[1] || 'ui';
      if (dict.isConsonant(prev) && dict.isConsonant(fol2)) return options[2] || 'ui';
      return options[0] || 'eui';
    }

    if (['ㅏ', 'ㅐ', 'ㅓ', 'ㅔ'].includes(letter)) {
      if ((letter === 'ㅏ' && prev === 'ㅗ') ||
          (letter === 'ㅐ' && prev === 'ㅗ') ||
          (letter === 'ㅓ' && prev === 'ㅜ') ||
          (letter === 'ㅔ' && prev === 'ㅜ')) {
        return options[0] || '';
      }
      return options[1] || options[options.length - 1];
    }

    if (letter === 'ㅣ') {
      if (['ㅗ', 'ㅜ', 'ㅡ'].includes(prev)) return options[0] || '';
      return options[1] || options[options.length - 1];
    }

    return options[options.length - 1] || options[0];
  };
};

// Function to process a dictionary and create automatic checkers
const processDict = (rawDict) => {
  // Merge with McCune-Reischauer as the base (inherits default checkers)
  const processed = {
    ...mccuneReischauer,
    ...rawDict,
  };
  
  // Ensure symbols exist (allow custom overrides)
  if (rawDict.symbols) {
    processed.symbols = { ...mccuneReischauer.symbols, ...rawDict.symbols };
  }
  
  // For each letter, check whether we should create/override a checker
  for (const letter of processed.hangeul) {
    const value = processed[letter];
    const checkerName = getCheckerName(letter);
    
    // If the value is an array, create/override a checker
    if (Array.isArray(value)) {
      processed[checkerName] = createArrayChecker(letter, value, processed);
    }
    
    // If a checker exists as a stringified function in rawDict, convert it
    const checkerValue = rawDict[checkerName];
    if (typeof checkerValue === 'string' && checkerValue.trim().startsWith('function')) {
      try {
        processed[checkerName] = eval(`(${checkerValue})`);
      } catch (e) {
        console.error(`Error processing checker ${checkerName}:`, e);
      }
    }
  }
  
  console.log('Processed dict symbols:', processed.symbols);
  return processed;
};

// Helper to get the checker name based on a letter
const getCheckerName = (letter) => {
  const checkerMap = {
    'ㄱ': 'kiyeokChecker',
    'ㄲ': 'ssKiyeokChecker',
    'ㄴ': 'nieunChecker',
    'ㄷ': 'digeudChecker',
    'ㄸ': 'ssDigeudChecker',
    'ㄹ': 'rieulChecker',
    'ㅁ': 'mieumChecker',
    'ㅂ': 'bieubChecker',
    'ㅃ': 'ssBieubChecker',
    'ㅅ': 'siotChecker',
    'ㅆ': 'ssSiotChecker',
    'ㅇ': 'ieungChecker',
    'ㅈ': 'jieutChecker',
    'ㅉ': 'ssJieutChecker',
    'ㅊ': 'chieutChecker',
    'ㅋ': 'kieukChecker',
    'ㅌ': 'tieutChecker',
    'ㅍ': 'pieupChecker',
    'ㅎ': 'hieutChecker',
    'ㅏ': 'aChecker',
    'ㅐ': 'aeChecker',
    'ㅑ': 'yaChecker',
    'ㅒ': 'yaeChecker',
    'ㅓ': 'eoChecker',
    'ㅔ': 'eChecker',
    'ㅕ': 'yeoChecker',
    'ㅖ': 'yeChecker',
    'ㅗ': 'oChecker',
    'ㅛ': 'yoChecker',
    'ㅜ': 'uChecker',
    'ㅠ': 'yuChecker',
    'ㅡ': 'euChecker',
    'ㅣ': 'iChecker'
  };
  return checkerMap[letter] || `${letter}Checker`;
};

// Checker runner (accepts a custom dictionary)
const checker = function (words, dict = mccuneReischauer) {
  const splitText = Hangul.disassemble(words);
  const arr = [];
  
  for (const [i, letter] of splitText.entries()) {
    const checkerName = getCheckerName(letter);
    const checkerFunc = dict[checkerName];
    
    if (checkerFunc && typeof checkerFunc === 'function') {
      // Call the appropriate checker with the required parameters
      // Determine how many parameters the checker needs
      const paramCount = checkerFunc.length;
      
      let prepreprev = splitText[i - 3] ?? undefined;
      let preprev = splitText[i - 2] ?? undefined;
      let prev = splitText[i - 1] ?? undefined;
      let fol = splitText[i + 1] ?? undefined;
      let fol2 = splitText[i + 2] ?? undefined;
      let fol3 = splitText[i + 3] ?? undefined;

      if (paramCount === 2) {
        arr.push(checkerFunc.call(dict, prev, fol));
      } else if (paramCount === 3) {
        arr.push(checkerFunc.call(dict, prev, fol, fol2));
      } else if (paramCount === 4) {
        arr.push(checkerFunc.call(dict, preprev, prev, fol, fol2));
      } else if (paramCount === 6) {
        arr.push(checkerFunc.call(dict, prepreprev, preprev, prev, fol, fol2, fol3));
      } else {
        arr.push(checkerFunc.call(dict, prev, fol, fol2));
      }
    } else {
      // If there is no checker, use the value directly or the original letter
      const value = dict[letter];
      if (Array.isArray(value)) {
        // If it's an array, use the last element as a fallback
        arr.push(value[value.length - 1] || letter);
      } else {
        arr.push(value || letter);
      }
    }
  }

  return arr.join('');
};

// Event listener for the Submit button
submitBtn.addEventListener('click', function () {
  const input = textInputEl.value;
  let usedDict = mccuneReischauer;
  let errorMessage = '';
  
  // Get custom JSON value
  const customJson = customJsonEl.value.trim();
  
  if (customJson) {
    try {
      // Try to parse the JSON
      const parsed = JSON.parse(customJson);
      
      // Process the dictionary (create automatic checkers, convert functions, etc.)
      usedDict = processDict(parsed);
      console.log('✅ Using custom romanization!');
      console.log('Symbols:', usedDict.symbols);
    } catch (e) {
      errorMessage = `❌ Error parsing custom JSON: ${e.message}. Using default McCune-Reischauer.`;
      console.error(errorMessage);
      alert(errorMessage);
    }
  }
  
  // Perform the conversion
  textOutputEl.value = checker(input, usedDict);
});