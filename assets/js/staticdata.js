/* ==================================================================
   staticdata.js — Korean colors, numbers (Sino + Native), and hanja data
   ================================================================== */
'use strict';

// ---- Korean Colors Data (3 difficulty levels, from original hangugeo) ---- //

const COLORS_DATA_BASIC = [
  { name: '빨강', english: 'Red', hanja: '赤色', color: '#FF0000', altNames: ['빨간색', '적색'] },
  { name: '파랑', english: 'Blue', hanja: '靑色', color: '#0000FF', altNames: ['파란색', '청색'] },
  { name: '노랑', english: 'Yellow', hanja: '黃色', color: '#FFFF00', altNames: ['노란색', '황색'] },
  { name: '초록', english: 'Green', hanja: '綠色', color: '#008000', altNames: ['초록색', '녹색'] },
  { name: '흰색', english: 'White', hanja: '白色', color: '#FFFFFF', altNames: ['하얀색', '백색'] },
  { name: '검정', english: 'Black', hanja: '黑色', color: '#000000', altNames: ['까만색', '흑색'] },
  { name: '회색', english: 'Gray', hanja: '灰色', color: '#808080', altNames: ['그레이'] },
  { name: '분홍', english: 'Pink', hanja: '粉紅色', color: '#FFC0CB', altNames: ['핑크'] },
  { name: '주황', english: 'Orange', hanja: '朱黃色', color: '#FFA500', altNames: ['오렌지'] },
  { name: '보라', english: 'Purple', hanja: '紫色', color: '#800080', altNames: ['보라색'] },
  { name: '갈색', english: 'Brown', hanja: '褐色', color: '#A52A2A', altNames: ['브라운'] },
  { name: '남색', english: 'Navy Blue', hanja: '藍色', color: '#000080', altNames: ['네이비'] },
];

const COLORS_DATA_INTERMEDIATE = [
  { name: '하늘색', english: 'Sky Blue', hanja: '하늘色', color: '#87CEEB', altNames: ['스카이블루'] },
  { name: '연두', english: 'Light Green', hanja: '軟豆', color: '#90EE90', altNames: ['연두색'] },
  { name: '청록', english: 'Teal', hanja: '靑綠', color: '#00CED1', altNames: ['청록색'] },
  { name: '연분홍', english: 'Light Pink', hanja: '軟粉紅', color: '#FFB6C1', altNames: ['라이트 핑크'] },
  { name: '진분홍', english: 'Hot Pink', hanja: '深粉紅', color: '#FF69B4', altNames: ['핫핑크'] },
  { name: '연보라', english: 'Lavender', hanja: '軟紫色', color: '#DDA0DD', altNames: ['라벤더'] },
  { name: '연회색', english: 'Light Gray', hanja: '軟灰色', color: '#D3D3D3', altNames: ['라이트 그레이'] },
  { name: '진회색', english: 'Dark Gray', hanja: '深灰色', color: '#4A4A4A', altNames: ['다크 그레이'] },
  { name: '베이지', english: 'Beige', hanja: '', color: '#F5F5DC', altNames: [] },
  { name: '크림색', english: 'Cream', hanja: '', color: '#FFFDD0', altNames: ['아이보리'] },
  { name: '민트', english: 'Mint', hanja: '', color: '#98FB98', altNames: [] },
  { name: '올리브', english: 'Olive', hanja: '', color: '#808000', altNames: [] },
  { name: '카키', english: 'Khaki', hanja: '', color: '#556B2F', altNames: [] },
  { name: '금색', english: 'Gold', hanja: '金色', color: '#FFD700', altNames: ['골드'] },
  { name: '은색', english: 'Silver', hanja: '銀色', color: '#C0C0C0', altNames: ['실버'] },
];

const COLORS_DATA_ADVANCED = [
  { name: '살구색', english: 'Apricot', hanja: '', color: '#FBCEB1', altNames: [] },
  { name: '귤색', english: 'Tangerine', hanja: '', color: '#FF8C00', altNames: [] },
  { name: '연노랑', english: 'Light Yellow', hanja: '軟黃色', color: '#FFFFE0', altNames: ['레몬색'] },
  { name: '주홍', english: 'Scarlet', hanja: '朱紅', color: '#FF4500', altNames: ['주홍색'] },
  { name: '자주', english: 'Reddish Purple', hanja: '紫朱', color: '#C71585', altNames: ['자주색'] },
  { name: '자줏빛', english: 'Deep Purple', hanja: '', color: '#9932CC', altNames: ['딥 퍼플'] },
  { name: '밤색', english: 'Chestnut', hanja: '栗色', color: '#8B4513', altNames: [] },
  { name: '코랄', english: 'Coral', hanja: '', color: '#FF7F50', altNames: [] },
  { name: '머스타드', english: 'Mustard', hanja: '', color: '#FFDB58', altNames: [] },
  { name: '와인색', english: 'Burgundy', hanja: '', color: '#722F37', altNames: ['버건디'] },
  { name: '라임', english: 'Lime', hanja: '', color: '#32CD32', altNames: [] },
  { name: '감색', english: 'Navy Blue', hanja: '紺色', color: '#2F4F4F', altNames: ['다크 네이비'] },
];

const COLORS_DATA = {
  basic: COLORS_DATA_BASIC,
  intermediate: [...COLORS_DATA_BASIC, ...COLORS_DATA_INTERMEDIATE],
  advanced: [...COLORS_DATA_BASIC, ...COLORS_DATA_INTERMEDIATE, ...COLORS_DATA_ADVANCED],
};

// ---- Korean Numbers Data (Sino + Native systems) ---- //

const SINO_NUMBERS = {
  0: { text: '공', altTexts: ['영'], hanja: '空' },
  1: { text: '일', hanja: '一' },
  2: { text: '이', hanja: '二' },
  3: { text: '삼', hanja: '三' },
  4: { text: '사', hanja: '四' },
  5: { text: '오', hanja: '五' },
  6: { text: '육', hanja: '六' },
  7: { text: '칠', hanja: '七' },
  8: { text: '팔', hanja: '八' },
  9: { text: '구', hanja: '九' },
  10: { text: '십', hanja: '十' },
  100: { text: '백', hanja: '百' },
  1000: { text: '천', hanja: '千' },
  10000: { text: '만', hanja: '萬' },
  100000000: { text: '억', hanja: '億' },
};

const NATIVE_NUMBERS = {
  0: { text: '공' },
  1: { text: '하나' },
  2: { text: '둘' },
  3: { text: '셋' },
  4: { text: '넷' },
  5: { text: '다섯' },
  6: { text: '여섯' },
  7: { text: '일곱' },
  8: { text: '여덟' },
  9: { text: '아홉' },
  10: { text: '열' },
  20: { text: '스물' },
  30: { text: '서른' },
  40: { text: '마흔' },
  50: { text: '쉰' },
  60: { text: '예순' },
  70: { text: '일흔' },
  80: { text: '여든' },
  90: { text: '아흔' },
};

// Convert number to Native Korean word (up to 99)
function nativeToWords(n) {
  if (n === 0) return NATIVE_NUMBERS[0].text;
  const tens = Math.floor(n / 10);
  const ones = n % 10;
  const parts = [];
  if (tens > 0) parts.push(NATIVE_NUMBERS[tens * 10].text);
  if (ones > 0) parts.push(NATIVE_NUMBERS[ones].text);
  return parts.join(' ');
}

// Convert number to Sino-Korean word (up to 99,999,999)
function sinoToWords(n) {
  if (n === 0) return '공';
  const units = [
    { val: 100000000, name: '억' },
    { val: 10000, name: '만' },
    { val: 1000, name: '천' },
    { val: 100, name: '백' },
    { val: 10, name: '십' },
  ];
  let remaining = n;
  const parts = [];
  for (const u of units) {
    if (remaining >= u.val) {
      const count = Math.floor(remaining / u.val);
      if (count > 1) parts.push(SINO_NUMBERS[count].text);
      parts.push(u.name);
      remaining -= count * u.val;
    }
  }
  if (remaining > 0) parts.push(SINO_NUMBERS[remaining].text);
  return parts.join('');
}

// Check if a string matches the Native Korean word for a number
function checkNativeWords(n, input) {
  const norm = (s) => (s || '').trim().replace(/\s+/g, ' ');
  const expected = norm(nativeToWords(n));
  const got = norm(input);
  return expected === got;
}

// Check if a string matches the Sino-Korean word for a number
function checkSinoWords(n, input) {
  const norm = (s) => (s || '').trim().replace(/\s+/g, ' ');
  const expected = norm(sinoToWords(n));
  const got = norm(input);
  if (expected === got) return true;
  // Also accept 공/영 interchange for zero
  if (n === 0) {
    if (got === '영' || got === '공') return true;
  }
  return false;
}

// ---- Pronunciation Phrases for Practice ---- //

const PRONUNCIATION_PHRASES = [
  { korean: '안녕하세요', romanized: 'annyeonghaseyo', english: 'Hello' },
  { korean: '감사합니다', romanized: 'gamsahamnida', english: 'Thank you' },
  { korean: '반갑습니다', romanized: 'bangapseumnida', english: 'Nice to meet you' },
  { korean: '사랑해요', romanized: 'saranghaeyo', english: 'I love you' },
  { korean: '죄송합니다', romanized: 'joesonghamnida', english: "I'm sorry" },
  { korean: '잘 먹겠습니다', romanized: 'jal meokgesseumnida', english: 'I will eat well (before meal)' },
  { korean: '잘 먹었습니다', romanized: 'jal meogeosseumnida', english: 'I ate well (after meal)' },
  { korean: '만나서 반가워요', romanized: 'mannaseo bangawoyo', english: 'Nice to meet you' },
  { korean: '이름이 뭐예요?', romanized: 'ireumi mwoyeyo?', english: "What's your name?" },
  { korean: '어디에서 왔어요?', romanized: 'eodieseo wasseoyo?', english: 'Where are you from?' },
  { korean: '한국어를 공부해요', romanized: 'hangugeoreul gongbuhaeyo', english: 'I study Korean' },
  { korean: '잘 지냈어요?', romanized: 'jal jinaesseoyo?', english: 'Have you been well?' },
  { korean: '도와주세요', romanized: 'dowajuseyo', english: 'Please help me' },
  { korean: '얼마예요?', romanized: 'eolmayeyo?', english: 'How much is it?' },
  { korean: '맛있어요', romanized: 'masisseoyo', english: "It's delicious" },
  { korean: '피곤해요', romanized: 'pigonhaeyo', english: "I'm tired" },
  { korean: '행복해요', romanized: 'haengbokhaeyo', english: "I'm happy" },
  { korean: '날씨가 좋아요', romanized: 'nalssiga joayo', english: 'The weather is nice' },
  { korean: '배고파요', romanized: 'baegopayo', english: "I'm hungry" },
  { korean: '몇 시예요?', romanized: 'myeot siyeyo?', english: 'What time is it?' },
  { korean: '한국에 가고 싶어요', romanized: 'hanguge gago sipeoyo', english: 'I want to go to Korea' },
  { korean: '천천히 말해 주세요', romanized: 'cheoncheonhi malhae juseyo', english: 'Please speak slowly' },
  { korean: '다시 한 번 말해 주세요', romanized: 'dasi han beon malhae juseyo', english: 'Please say it once more' },
  { korean: '저는 학생입니다', romanized: 'jeoneun haksaengimnida', english: 'I am a student' },
  { korean: '여기가 어디예요?', romanized: 'yeogiga eodiyeyo?', english: 'Where is this place?' },
];

// ---- Hanja Practice Data ---- //

// Top-level hanja characters used in the original hangugeo
const HANJA_CHARS = [
  { char: '一', korean: '일', english: 'one', meaning: 'one', stroke: 1 },
  { char: '二', korean: '이', english: 'two', meaning: 'two', stroke: 2 },
  { char: '三', korean: '삼', english: 'three', meaning: 'three', stroke: 3 },
  { char: '四', korean: '사', english: 'four', meaning: 'four', stroke: 5 },
  { char: '五', korean: '오', english: 'five', meaning: 'five', stroke: 4 },
  { char: '六', korean: '육', english: 'six', meaning: 'six', stroke: 4 },
  { char: '七', korean: '칠', english: 'seven', meaning: 'seven', stroke: 2 },
  { char: '八', korean: '팔', english: 'eight', meaning: 'eight', stroke: 2 },
  { char: '九', korean: '구', english: 'nine', meaning: 'nine', stroke: 2 },
  { char: '十', korean: '십', english: 'ten', meaning: 'ten', stroke: 2 },
  { char: '百', korean: '백', english: 'hundred', meaning: 'hundred', stroke: 6 },
  { char: '千', korean: '천', english: 'thousand', meaning: 'thousand', stroke: 3 },
  { char: '萬', korean: '만', english: 'ten thousand', meaning: 'myriad', stroke: 12 },
  { char: '人', korean: '인', english: 'person', meaning: 'person', stroke: 2 },
  { char: '大', korean: '대', english: 'big', meaning: 'big', stroke: 3 },
  { char: '小', korean: '소', english: 'small', meaning: 'small', stroke: 3 },
  { char: '中', korean: '중', english: 'middle', meaning: 'center', stroke: 4 },
  { char: '山', korean: '산', english: 'mountain', meaning: 'mountain', stroke: 3 },
  { char: '水', korean: '수', english: 'water', meaning: 'water', stroke: 4 },
  { char: '火', korean: '화', english: 'fire', meaning: 'fire', stroke: 4 },
  { char: '木', korean: '목', english: 'tree', meaning: 'tree', stroke: 4 },
  { char: '金', korean: '금', english: 'gold', meaning: 'gold; metal', stroke: 8 },
  { char: '土', korean: '토', english: 'earth', meaning: 'earth', stroke: 3 },
  { char: '日', korean: '일', english: 'day', meaning: 'sun; day', stroke: 4 },
  { char: '月', korean: '월', english: 'moon', meaning: 'moon; month', stroke: 4 },
  { char: '年', korean: '년', english: 'year', meaning: 'year', stroke: 6 },
  { char: '天', korean: '천', english: 'sky', meaning: 'sky; heaven', stroke: 4 },
  { char: '地', korean: '지', english: 'ground', meaning: 'earth; land', stroke: 6 },
  { char: '男', korean: '남', english: 'male', meaning: 'man', stroke: 7 },
  { char: '女', korean: '여', english: 'female', meaning: 'woman', stroke: 3 },
  { char: '父', korean: '부', english: 'father', meaning: 'father', stroke: 4 },
  { char: '母', korean: '모', english: 'mother', meaning: 'mother', stroke: 5 },
  { char: '子', korean: '자', english: 'child', meaning: 'child', stroke: 3 },
  { char: '學', korean: '학', english: 'learn', meaning: 'learning', stroke: 16 },
  { char: '校', korean: '교', english: 'school', meaning: 'school', stroke: 10 },
  { char: '生', korean: '생', english: 'life', meaning: 'life; birth', stroke: 5 },
  { char: '國', korean: '국', english: 'country', meaning: 'nation', stroke: 11 },
  { char: '韓', korean: '한', english: 'Korea', meaning: 'Korea', stroke: 17 },
  { char: '語', korean: '어', english: 'language', meaning: 'language', stroke: 14 },
  { char: '文', korean: '문', english: 'writing', meaning: 'writing', stroke: 4 },
  { char: '先', korean: '선', english: 'first', meaning: 'before', stroke: 6 },
  { char: '生', korean: '생', english: 'student', meaning: 'student', stroke: 5 },
  { char: '名', korean: '명', english: 'name', meaning: 'name', stroke: 6 },
  { char: '心', korean: '심', english: 'heart', meaning: 'heart', stroke: 4 },
  { char: '力', korean: '력', english: 'power', meaning: 'power', stroke: 2 },
  { char: '食', korean: '식', english: 'eat', meaning: 'food; eat', stroke: 9 },
  { char: '時', korean: '시', english: 'time', meaning: 'time', stroke: 10 },
  { char: '間', korean: '간', english: 'between', meaning: 'interval', stroke: 12 },
  { char: '門', korean: '문', english: 'door', meaning: 'door', stroke: 8 },
  { char: '長', korean: '장', english: 'long', meaning: 'long', stroke: 8 },
  { char: '前', korean: '전', english: 'before', meaning: 'front; before', stroke: 9 },
  { char: '後', korean: '후', english: 'after', meaning: 'after; behind', stroke: 9 },
  { char: '上', korean: '상', english: 'above', meaning: 'above; up', stroke: 3 },
  { char: '下', korean: '하', english: 'below', meaning: 'below; down', stroke: 3 },
  { char: '東', korean: '동', english: 'east', meaning: 'east', stroke: 8 },
  { char: '西', korean: '서', english: 'west', meaning: 'west', stroke: 6 },
  { char: '南', korean: '남', english: 'south', meaning: 'south', stroke: 9 },
  { char: '北', korean: '북', english: 'north', meaning: 'north', stroke: 5 },
  { char: '白', korean: '백', english: 'white', meaning: 'white', stroke: 5 },
  { char: '靑', korean: '청', english: 'blue', meaning: 'blue; green', stroke: 8 },
  { char: '赤', korean: '적', english: 'red', meaning: 'red', stroke: 7 },
  { char: '黃', korean: '황', english: 'yellow', meaning: 'yellow', stroke: 12 },
  { char: '高', korean: '고', english: 'high', meaning: 'high; tall', stroke: 10 },
  { char: '低', korean: '저', english: 'low', meaning: 'low', stroke: 7 },
  { char: '多', korean: '다', english: 'many', meaning: 'many; much', stroke: 6 },
  { char: '新', korean: '신', english: 'new', meaning: 'new', stroke: 13 },
  { char: '古', korean: '고', english: 'old', meaning: 'old; ancient', stroke: 5 },
  { char: '强', korean: '강', english: 'strong', meaning: 'strong', stroke: 12 },
  { char: '弱', korean: '약', english: 'weak', meaning: 'weak', stroke: 10 },
  { char: '同', korean: '동', english: 'same', meaning: 'same', stroke: 6 },
  { char: '內', korean: '내', english: 'inside', meaning: 'inside', stroke: 4 },
  { char: '外', korean: '외', english: 'outside', meaning: 'outside', stroke: 5 },
  { char: '入', korean: '입', english: 'enter', meaning: 'enter', stroke: 2 },
  { char: '出', korean: '출', english: 'exit', meaning: 'exit', stroke: 5 },
  { char: '開', korean: '개', english: 'open', meaning: 'open', stroke: 12 },
  { char: '閉', korean: '폐', english: 'close', meaning: 'close; shut', stroke: 11 },
  { char: '始', korean: '시', english: 'begin', meaning: 'begin', stroke: 8 },
  { char: '終', korean: '종', english: 'end', meaning: 'end', stroke: 11 },
  { char: '正', korean: '정', english: 'correct', meaning: 'correct; right', stroke: 5 },
  { char: '美', korean: '미', english: 'beautiful', meaning: 'beautiful', stroke: 9 },
  { char: '善', korean: '선', english: 'good', meaning: 'good; kind', stroke: 12 },
  { char: '惡', korean: '악', english: 'evil', meaning: 'evil; bad', stroke: 12 },
  { char: '眞', korean: '진', english: 'true', meaning: 'true; real', stroke: 10 },
  { char: '安', korean: '안', english: 'peace', meaning: 'peace; safe', stroke: 6 },
  { char: '危', korean: '위', english: 'danger', meaning: 'danger; risk', stroke: 6 },
  { char: '老', korean: '로', english: 'old', meaning: 'old; aged', stroke: 6 },
  { char: '死', korean: '사', english: 'death', meaning: 'death; die', stroke: 6 },
  { char: '活', korean: '활', english: 'life', meaning: 'life; live', stroke: 9 },
  { char: '戰', korean: '전', english: 'war', meaning: 'war; battle', stroke: 16 },
  { char: '和', korean: '화', english: 'harmony', meaning: 'peace; harmony', stroke: 8 },
  { char: '勝', korean: '승', english: 'victory', meaning: 'victory; win', stroke: 12 },
  { char: '平', korean: '평', english: 'peace', meaning: 'flat; peace', stroke: 5 },
  { char: '廣', korean: '광', english: 'wide', meaning: 'wide; broad', stroke: 15 },
  { char: '深', korean: '심', english: 'deep', meaning: 'deep', stroke: 11 },
  { char: '淺', korean: '천', english: 'shallow', meaning: 'shallow', stroke: 12 },
  { char: '重', korean: '중', english: 'heavy', meaning: 'heavy; important', stroke: 9 },
  { char: '輕', korean: '경', english: 'light', meaning: 'light (weight)', stroke: 14 },
  { char: '速', korean: '속', english: 'fast', meaning: 'fast; speed', stroke: 10 },
  { char: '遠', korean: '원', english: 'far', meaning: 'far; distant', stroke: 13 },
  { char: '近', korean: '근', english: 'near', meaning: 'near; close', stroke: 7 },
  { char: '春', korean: '춘', english: 'spring', meaning: 'spring', stroke: 9 },
  { char: '夏', korean: '하', english: 'summer', meaning: 'summer', stroke: 10 },
  { char: '秋', korean: '추', english: 'autumn', meaning: 'autumn', stroke: 9 },
  { char: '冬', korean: '동', english: 'winter', meaning: 'winter', stroke: 5 },
  { char: '風', korean: '풍', english: 'wind', meaning: 'wind', stroke: 9 },
  { char: '雲', korean: '운', english: 'cloud', meaning: 'cloud', stroke: 12 },
  { char: '雨', korean: '우', english: 'rain', meaning: 'rain', stroke: 8 },
  { char: '雪', korean: '설', english: 'snow', meaning: 'snow', stroke: 11 },
  { char: '電', korean: '전', english: 'electricity', meaning: 'electricity', stroke: 13 },
  { char: '音', korean: '음', english: 'sound', meaning: 'sound', stroke: 9 },
  { char: '色', korean: '색', english: 'color', meaning: 'color', stroke: 6 },
  { char: '光', korean: '광', english: 'light', meaning: 'light; ray', stroke: 6 },
  { char: '明', korean: '명', english: 'bright', meaning: 'bright; clear', stroke: 8 },
  { char: '暗', korean: '암', english: 'dark', meaning: 'dark', stroke: 13 },
  { char: '醫', korean: '의', english: 'medicine', meaning: 'medicine; doctor', stroke: 18 },
  { char: '病', korean: '병', english: 'sick', meaning: 'sickness', stroke: 10 },
  { char: '藥', korean: '약', english: 'drug', meaning: 'medicine; drug', stroke: 19 },
  { char: '身', korean: '신', english: 'body', meaning: 'body', stroke: 7 },
  { char: '體', korean: '체', english: 'body', meaning: 'body; form', stroke: 23 },
  { char: '首', korean: '수', english: 'head', meaning: 'head', stroke: 9 },
  { char: '手', korean: '수', english: 'hand', meaning: 'hand', stroke: 4 },
  { char: '足', korean: '족', english: 'foot', meaning: 'foot', stroke: 7 },
  { char: '海', korean: '해', english: 'sea', meaning: 'sea; ocean', stroke: 10 },
  { char: '川', korean: '천', english: 'river', meaning: 'river', stroke: 3 },
  { char: '石', korean: '석', english: 'stone', meaning: 'stone', stroke: 5 },
  { char: '玉', korean: '옥', english: 'jade', meaning: 'jade', stroke: 5 },
  { char: '王', korean: '왕', english: 'king', meaning: 'king', stroke: 4 },
  { char: '民', korean: '민', english: 'people', meaning: 'people', stroke: 5 },
  { char: '主', korean: '주', english: 'master', meaning: 'master; main', stroke: 5 },
  { char: '自', korean: '자', english: 'self', meaning: 'self', stroke: 6 },
  { char: '世', korean: '세', english: 'world', meaning: 'world', stroke: 5 },
  { char: '界', korean: '계', english: 'boundary', meaning: 'boundary; world', stroke: 9 },
  { char: '家', korean: '가', english: 'house', meaning: 'house; family', stroke: 10 },
  { char: '族', korean: '족', english: 'clan', meaning: 'clan; ethnic group', stroke: 11 },
  { char: '道', korean: '도', english: 'way', meaning: 'way; path', stroke: 12 },
  { char: '市', korean: '시', english: 'city', meaning: 'city; market', stroke: 5 },
  { char: '農', korean: '농', english: 'farming', meaning: 'farming', stroke: 13 },
  { char: '工', korean: '공', english: 'work', meaning: 'work; industry', stroke: 3 },
  { char: '商', korean: '상', english: 'trade', meaning: 'trade; commerce', stroke: 11 },
  { char: '政', korean: '정', english: 'politics', meaning: 'politics', stroke: 9 },
  { char: '治', korean: '치', english: 'govern', meaning: 'govern; rule', stroke: 8 },
  { char: '法', korean: '법', english: 'law', meaning: 'law; method', stroke: 8 },
  { char: '經', korean: '경', english: 'classic', meaning: 'classic; economy', stroke: 13 },
  { char: '濟', korean: '제', english: 'cross', meaning: 'cross; economy', stroke: 17 },
  { char: '理', korean: '리', english: 'reason', meaning: 'reason; logic', stroke: 11 },
  { char: '氣', korean: '기', english: 'energy', meaning: 'energy; spirit', stroke: 10 },
  { char: '運', korean: '운', english: 'fortune', meaning: 'fortune; luck', stroke: 12 },
  { char: '動', korean: '동', english: 'move', meaning: 'move; motion', stroke: 11 },
  { char: '植', korean: '식', english: 'plant', meaning: 'plant', stroke: 12 },
  { char: '物', korean: '물', english: 'thing', meaning: 'thing; object', stroke: 8 },
  { char: '魚', korean: '어', english: 'fish', meaning: 'fish', stroke: 11 },
  { char: '鳥', korean: '조', english: 'bird', meaning: 'bird', stroke: 11 },
  { char: '草', korean: '초', english: 'grass', meaning: 'grass', stroke: 9 },
  { char: '花', korean: '화', english: 'flower', meaning: 'flower', stroke: 7 },
  { char: '林', korean: '임', english: 'forest', meaning: 'forest', stroke: 8 },
  { char: '米', korean: '미', english: 'rice', meaning: 'rice', stroke: 6 },
  { char: '肉', korean: '육', english: 'meat', meaning: 'meat', stroke: 6 },
  { char: '言', korean: '언', english: 'speech', meaning: 'speech', stroke: 7 },
  { char: '話', korean: '화', english: 'talk', meaning: 'talk; story', stroke: 13 },
  { char: '讀', korean: '독', english: 'read', meaning: 'read', stroke: 22 },
  { char: '書', korean: '서', english: 'write', meaning: 'write; book', stroke: 10 },
  { char: '見', korean: '견', english: 'see', meaning: 'see', stroke: 7 },
  { char: '聞', korean: '문', english: 'hear', meaning: 'hear', stroke: 14 },
  { char: '行', korean: '행', english: 'go', meaning: 'go; walk', stroke: 6 },
  { char: '來', korean: '래', english: 'come', meaning: 'come', stroke: 8 },
  { char: '去', korean: '거', english: 'go', meaning: 'go away', stroke: 5 },
  { char: '立', korean: '립', english: 'stand', meaning: 'stand', stroke: 5 },
  { char: '休', korean: '휴', english: 'rest', meaning: 'rest', stroke: 6 },
  { char: '使', korean: '사', english: 'use', meaning: 'use; make', stroke: 8 },
  { char: '作', korean: '작', english: 'make', meaning: 'make; create', stroke: 7 },
  { char: '思', korean: '사', english: 'think', meaning: 'think', stroke: 9 },
  { char: '知', korean: '지', english: 'know', meaning: 'know', stroke: 8 },
  { char: '信', korean: '신', english: 'trust', meaning: 'trust', stroke: 9 },
  { char: '愛', korean: '애', english: 'love', meaning: 'love', stroke: 13 },
  { char: '情', korean: '정', english: 'feeling', meaning: 'feeling', stroke: 11 },
  { char: '感', korean: '감', english: 'feel', meaning: 'feel; sense', stroke: 13 },
  { char: '喜', korean: '희', english: 'joy', meaning: 'joy', stroke: 12 },
  { char: '怒', korean: '노', english: 'anger', meaning: 'anger', stroke: 9 },
  { char: '哀', korean: '애', english: 'sorrow', meaning: 'sorrow', stroke: 9 },
  { char: '樂', korean: '락', english: 'music', meaning: 'music; pleasure', stroke: 15 },
  { char: '苦', korean: '고', english: 'bitter', meaning: 'bitter; suffering', stroke: 8 },
  { char: '甘', korean: '감', english: 'sweet', meaning: 'sweet', stroke: 5 },
  { char: '辛', korean: '신', english: 'spicy', meaning: 'spicy', stroke: 7 },
  { char: '酸', korean: '산', english: 'sour', meaning: 'sour', stroke: 14 },
  { char: '酒', korean: '주', english: 'alcohol', meaning: 'alcohol', stroke: 10 },
  { char: '茶', korean: '차', english: 'tea', meaning: 'tea', stroke: 9 },
  { char: '牛', korean: '우', english: 'cow', meaning: 'cow', stroke: 4 },
  { char: '馬', korean: '마', english: 'horse', meaning: 'horse', stroke: 10 },
  { char: '犬', korean: '견', english: 'dog', meaning: 'dog', stroke: 4 },
  { char: '猫', korean: '묘', english: 'cat', meaning: 'cat', stroke: 11 },
];

// ---- Romanization Quiz Data (Hangul → Romanized pairs) ---- //

const ROMAN_QUIZ_DATA = [
  { hangul: '가', roman: 'ga' },
  { hangul: '나', roman: 'na' },
  { hangul: '다', roman: 'da' },
  { hangul: '라', roman: 'ra' },
  { hangul: '마', roman: 'ma' },
  { hangul: '바', roman: 'ba' },
  { hangul: '사', roman: 'sa' },
  { hangul: '아', roman: 'a' },
  { hangul: '자', roman: 'ja' },
  { hangul: '차', roman: 'cha' },
  { hangul: '카', roman: 'ka' },
  { hangul: '타', roman: 'ta' },
  { hangul: '파', roman: 'pa' },
  { hangul: '하', roman: 'ha' },
  { hangul: '까', roman: 'kka' },
  { hangul: '따', roman: 'tta' },
  { hangul: '빠', roman: 'ppa' },
  { hangul: '싸', roman: 'ssa' },
  { hangul: '짜', roman: 'jja' },
  { hangul: '개', roman: 'gae' },
  { hangul: '게', roman: 'ge' },
  { hangul: '고', roman: 'go' },
  { hangul: '구', roman: 'gu' },
  { hangul: '그', roman: 'geu' },
  { hangul: '기', roman: 'gi' },
  { hangul: '녀', roman: 'nyeo' },
  { hangul: '도', roman: 'do' },
  { hangul: '무', roman: 'mu' },
  { hangul: '보', roman: 'bo' },
  { hangul: '소', roman: 'so' },
  { hangul: '어', roman: 'eo' },
  { hangul: '워', roman: 'wo' },
  { hangul: '위', roman: 'wi' },
  { hangul: '의', roman: 'ui' },
  { hangul: '와', roman: 'wa' },
  { hangul: '왜', roman: 'wae' },
  { hangul: '외', roman: 'oe' },
  { hangul: '요', roman: 'yo' },
  { hangul: '유', roman: 'yu' },
  { hangul: '으', roman: 'eu' },
  { hangul: '이', roman: 'i' },
  { hangul: '야', roman: 'ya' },
  { hangul: '얘', roman: 'yae' },
  { hangul: '여', roman: 'yeo' },
  { hangul: '예', roman: 'ye' },
  { hangul: '애', roman: 'ae' },
  { hangul: '에', roman: 'e' },
  { hangul: '완', roman: 'wan' },
  { hangul: '원', roman: 'weon' },
  { hangul: '웅', roman: 'ung' },
  { hangul: '강', roman: 'gang' },
  { hangul: '감', roman: 'gam' },
  { hangul: '값', roman: 'gap' },
  { hangul: '같', roman: 'gat' },
  { hangul: '한', roman: 'han' },
  { hangul: '할', roman: 'hal' },
  { hangul: '함', roman: 'ham' },
  { hangul: '합', roman: 'hap' },
  { hangul: '항', roman: 'hang' },
  { hangul: '해', roman: 'hae' },
  { hangul: '했', roman: 'haet' },
  { hangul: '했', roman: 'haet' },
  { hangul: '입', roman: 'ip' },
  { hangul: '있', roman: 'it' },
  { hangul: '좋', roman: 'jot' },
  { hangul: '먹', roman: 'meok' },
  { hangul: '했', roman: 'haet' },
  { hangul: '님', roman: 'nim' },
  { hangul: '다', roman: 'da' },
  { hangul: '요', roman: 'yo' },
  { hangul: '습', roman: 'seup' },
  { hangul: '습', roman: 'seup' },
];
// deduplicate
const _seen = new Set();
const ROMAN_QUIZ_UNIQUE = ROMAN_QUIZ_DATA.filter(item => {
  const key = item.hangul + '|' + item.roman;
  if (_seen.has(key)) return false;
  _seen.add(key);
  return true;
});

// ---- Hanja Utils minimal interface (from existing hanja-utils.js) ---- //
// The full hanja-utils.js provides extended data for the Hanja module.
// This minimal version provides the graded Hanja data needed for quizzes.

// HANJA_DATA is the canonical array used by app.js; it maps `char` → `character`
// and carries `korean` (Hangul reading) + `meaning` for quizzes.
const BUILTIN_HANJA_DATA = HANJA_CHARS.map(h => ({
  character: h.char,
  korean: h.korean,
  meaning: h.meaning || h.english,
  stroke: h.stroke,
}));

const BUILTIN_HANJA_LEVELS = {
  top50: HANJA_DATA.slice(0, 50),
  top100: HANJA_DATA.slice(0, 100),
  top150: HANJA_DATA,
};
