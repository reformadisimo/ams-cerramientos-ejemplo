/* "Mira como quedaria en tu casa": de momento, un ejemplo con deslizador antes / despues. La subida de fotos con IA esta preparada (api/ventana-ia.js) pero apagada. */
(function () {
  'use strict';
  var root = document.getElementById('cfIA'); if (!root) return;
  var box = root.querySelector('.cia-cmp'), rg = root.querySelector('.cia-cmp input'), top = root.querySelector('.cia-cmp .cia-top');
  if (!box || !rg || !top) return;
  var set = function () { top.style.clipPath = 'inset(0 ' + (100 - rg.value) + '% 0 0)'; box.style.setProperty('--x', rg.value + '%'); };
  rg.addEventListener('input', set); set();
})();
