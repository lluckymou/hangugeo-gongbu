/* ==================================================================
   icons.js — Icon set for Hangugeo (Font Awesome 4.7 backed).
   Every function returns an HTML string with an <i> tag.
   ================================================================== */
'use strict';

const ICONS = {
  // orientation & close
  chevL: () => '<i class="fa fa-chevron-left"></i>',
  chevR: () => '<i class="fa fa-chevron-right"></i>',
  x:     () => '<i class="fa fa-times"></i>',

  // audio
  speaker:    () => '<i class="fa fa-volume-up"></i>',
  speakerOff: () => '<i class="fa fa-volume-off"></i>',

  // lock
  lock: () => '<i class="fa fa-lock"></i>',

  // flame (streak)
  flame: () => '<i class="fa fa-fire"></i>',

  // refresh / restart
  refresh: () => '<i class="fa fa-refresh"></i>',

  // add / plus
  plus: () => '<i class="fa fa-plus"></i>',

  // instagram
  instagram: () => '<i class="fa fa-instagram"></i>',

  // ---- Module icons ----
  cards:   () => '<i class="fa fa-clone"></i>',
  numbers: () => '<i class="fa fa-hashtag"></i>',
  colors:  () => '<i class="fa fa-paint-brush"></i>',
  write:   () => '<i class="fa fa-pencil"></i>',
  mic:     () => '<i class="fa fa-microphone"></i>',
  roman:   () => '<i class="fa fa-language"></i>',
  hanja:   () => '<i class="fa fa-header"></i>',
  geo:     () => '<i class="fa fa-globe"></i>',
  clock:   () => '<i class="fa fa-clock-o"></i>',
  conj:    () => '<i class="fa fa-table"></i>',
  dict:    () => '<i class="fa fa-book"></i>',
  stats:   () => '<i class="fa fa-bar-chart"></i>',
  gender:  () => '<i class="fa fa-venus-mars"></i>',
  home:    () => '<i class="fa fa-home"></i>',
  info:    () => '<i class="fa fa-info-circle"></i>',
  check:   () => '<i class="fa fa-check"></i>',
  search:  () => '<i class="fa fa-search"></i>',
};
