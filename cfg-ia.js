/* "Mira como quedaria en tu casa": sube la foto de tu ventana y la IA la cambia por la que has configurado. */
(function () {
  'use strict';
  var root = document.getElementById('cfIA'); if (!root) return;
  var $ = function (s) { return root.querySelector(s); };
  var WA = '34639788220', LIM = 10, KEY = 'amsIA';
  var foto = null, ultimo = null, busy = false;

  function hoy() { return new Date().toISOString().slice(0, 10); }
  function usos() { try { var d = JSON.parse(localStorage.getItem(KEY) || '{}'); return d.dia === hoy() ? d.n : 0; } catch (e) { return 0; } }
  function suma() { try { localStorage.setItem(KEY, JSON.stringify({ dia: hoy(), n: usos() + 1 })); } catch (e) {} }

  // La ventana que se pinta: la ultima del presupuesto (el configurador la guarda en la direccion, #p=...)
  function elegida() {
    try {
      var m = location.hash.match(/#p=(.+)/); if (!m) return null;
      var d = JSON.parse(decodeURIComponent(escape(atob(m[1]))));
      var a = (d.i || []).filter(function (x) { return x && ['ventana', 'balconera', 'corredera', 'fijo'].indexOf(x.tipo) >= 0; });
      return a.length ? a[a.length - 1] : null;
    } catch (e) { return null; }
  }
  var COLN = { blanco: 'blanco', color: 'gris antracita', bicolor: 'blanco por dentro y gris por fuera', madera: 'imitación madera', negro: 'negro mate' };
  function resumen(it) {
    if (!it) return 'Aún no has añadido ninguna ventana al presupuesto, así que usaremos una de PVC blanca oscilobatiente. Configura la tuya arriba y vuelve aquí para ver la tuya.';
    var p = [it.mat === 'alu' ? 'Aluminio' : 'PVC', COLN[it.col] || 'blanco'];
    if (it.hojas) p.push(it.hojas + (it.hojas > 1 ? ' hojas' : ' hoja'));
    if (it.pers && it.pers !== 'no') p.push('con persiana');
    return 'Vamos a poner en tu foto: ' + p.join(', ') + (it.hab ? ' (' + it.hab + ')' : '') + '.';
  }

  function pinta() {
    var it = elegida();
    var u = usos(), quedan = Math.max(0, LIM - u);
    var h = '<h2>Mira cómo quedaría en tu casa</h2>' +
      '<p>Haz una foto de tu ventana de ahora y nuestra inteligencia artificial te enseña cómo quedaría con la que has configurado: el color, las hojas, la persiana. Antes de gastar un euro.</p>';
    if (ultimo) {
      h += '<div class="cia-cmp" id="ciaCmp"><img class="a" src="' + ultimo + '" alt="Tu ventana nueva"><img class="cia-top" src="' + foto + '" alt="Tu ventana ahora">' +
        '<input type="range" min="0" max="100" value="50" aria-label="Comparar antes y después"><span class="l">Ahora</span><span class="r">Nueva</span></div>' +
        '<p class="cia-note">Es una imagen orientativa hecha con inteligencia artificial. El diseño y las medidas exactas las confirmamos al medir en tu casa.</p>' +
        '<div class="cia-row"><a class="cf-btn" target="_blank" rel="noopener" href="https://wa.me/' + WA + '?text=' + encodeURIComponent('Hola, AMS Cerramientos. He probado el configurador y me ha gustado cómo queda la ventana en mi casa. Quiero presupuesto.') + '">Pedir presupuesto por WhatsApp</a>' +
        '<a class="cf-btn sec" href="' + ultimo + '" download="mi-ventana-nueva.jpg" target="_blank" rel="noopener">Descargar la imagen</a>' +
        '<button type="button" class="cf-btn sec" id="ciaOtra">Probar otra foto</button></div>';
    } else if (busy) {
      h += '<div class="cia-wait"><i></i><b id="ciaMsg">Preparando tu foto…</b><span>Suele tardar entre 20 y 60 segundos. No cierres la página.</span></div>';
    } else if (foto) {
      h += '<img class="cia-prev" src="' + foto + '" alt="Tu foto"><p class="cia-note">' + resumen(it) + '</p>' +
        '<div class="cia-row"><button type="button" class="cf-btn" id="ciaGo"' + (quedan ? '' : ' disabled') + '>Ver cómo quedaría</button><button type="button" class="cf-btn sec" id="ciaOtra">Cambiar la foto</button></div>';
    } else {
      h += '<p class="cia-note">' + resumen(it) + '</p><div class="cia-row"><label class="cf-btn" for="ciaFile">Subir una foto de mi ventana</label>' +
        '<input id="ciaFile" type="file" accept="image/*" hidden></div>';
    }
    h += '<p class="cia-err" id="ciaErr" role="alert" hidden></p>' +
      '<small class="cia-small">Tu foto solo se usa para generar la imagen; nosotros no la guardamos. Puedes probar hasta ' + LIM + ' veces al día' + (u ? ' (te quedan ' + quedan + ' hoy)' : '') + '.</small>';
    $('.cf-ia-txt').innerHTML = h;
    root.classList.toggle('cia-on', !!(foto || ultimo || busy));
    var f = $('#ciaFile'); if (f) f.addEventListener('change', carga);
    var go = $('#ciaGo'); if (go) go.addEventListener('click', genera);
    var ot = $('#ciaOtra'); if (ot) ot.addEventListener('click', function () { foto = null; ultimo = null; pinta(); });
    var rg = $('#ciaCmp input'); if (rg) rg.addEventListener('input', function () { $('#ciaCmp .cia-top').style.clipPath = 'inset(0 ' + (100 - rg.value) + '% 0 0)'; });
    if (rg) $('#ciaCmp .cia-top').style.clipPath = 'inset(0 50% 0 0)';
  }
  function error(t) { var e = $('#ciaErr'); if (e) { e.textContent = t; e.hidden = false; } }

  // Reduce la foto para que pese poco (el servidor admite hasta 4 MB)
  function carga(ev) {
    var f = ev.target.files && ev.target.files[0]; if (!f) return;
    if (!/^image\//.test(f.type)) return error('Elige un archivo de imagen.');
    var fr = new FileReader();
    fr.onload = function () {
      var im = new Image();
      im.onload = function () {
        var s = Math.min(1, 1500 / Math.max(im.width, im.height)), c = document.createElement('canvas');
        c.width = Math.round(im.width * s); c.height = Math.round(im.height * s);
        c.getContext('2d').drawImage(im, 0, 0, c.width, c.height);
        foto = c.toDataURL('image/jpeg', 0.86); ultimo = null; pinta();
      };
      im.onerror = function () { error('No he podido leer esa imagen. Prueba con otra foto (JPG o PNG).'); };
      im.src = fr.result;
    };
    fr.readAsDataURL(f);
  }

  var MOT = {
    'sin-clave': 'Esta función se está activando y todavía no está disponible. Vuelve en unos días.',
    'limite': 'Hoy has llegado al límite de fotos. Vuelve mañana, o pídenos el presupuesto por WhatsApp.',
    'tope-dia': 'Hoy hay mucha gente probándolo y hemos llegado al límite. Vuelve mañana, o pídenos el presupuesto por WhatsApp.',
    'imagen': 'La foto no es válida o pesa demasiado. Prueba con otra.',
  };
  function genera() {
    if (usos() >= LIM) return error(MOT.limite);
    var it = elegida() || { tipo: 'ventana', mat: 'pvc', col: 'blanco', hojas: 2, aper: ['osc', 'osc'], pers: 'no', fijo: 'no' };
    busy = true; pinta();
    fetch('/api/ventana-ia', { method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imagen: foto, v: { tipo: it.tipo, mat: it.mat, col: it.col, hojas: it.hojas, aper: it.aper, pers: it.pers, fijo: it.fijo } }) })
      .then(function (r) { return r.json().catch(function () { return { ok: false, motivo: 'servidor' }; }); })
      .then(function (j) {
        if (!j.ok) return fin(MOT[j.motivo] || 'No hemos podido hacerlo ahora mismo. Inténtalo de nuevo en un rato.');
        suma(); sondea(j.status_url, j.response_url, 0);
      })
      .catch(function () { fin('No hemos podido conectar. Revisa tu conexión e inténtalo otra vez.'); });
  }
  function fin(t) { busy = false; pinta(); error(t); }
  function sondea(s, r, n) {
    if (n > 40) return fin('Está tardando más de lo normal. Inténtalo de nuevo en un rato.');
    var m = $('#ciaMsg'); if (m) m.textContent = n < 3 ? 'Preparando tu foto…' : 'La inteligencia artificial está cambiando tu ventana…';
    setTimeout(function () {
      fetch('/api/ventana-ia?s=' + encodeURIComponent(s) + '&r=' + encodeURIComponent(r)).then(function (x) { return x.json(); }).then(function (j) {
        if (j.ok && j.estado === 'listo') { busy = false; ultimo = j.url; pinta(); return; }
        if (!j.ok) return fin('No hemos podido generar la imagen con esa foto. Prueba con otra, de frente y con buena luz.');
        sondea(s, r, n + 1);
      }).catch(function () { sondea(s, r, n + 1); });
    }, n ? 3000 : 2000);
  }

  var css = document.createElement('style');
  css.textContent = '.cf-ia.cia-on{grid-template-columns:1fr}.cf-ia.cia-on .cf-ia-img{display:none}.cf-ia.cia-on .cf-ia-txt{max-width:640px}.cia-row{display:flex;flex-wrap:wrap;gap:10px;margin:14px 0 0}.cia-row .cf-btn{display:inline-flex;align-items:center;justify-content:center;text-decoration:none;cursor:pointer}' +
    '.cia-note{font-size:15px!important;margin:10px 0 0!important}.cia-small{display:block;margin-top:14px;color:#6B7A87;font-size:13px;line-height:1.45}' +
    '.cia-err{margin:12px 0 0;padding:10px 14px;border-radius:8px;background:#FDECEA;color:#8A1C12;font-weight:600;font-size:15px}' +
    '.cia-prev{display:block;width:100%;max-height:300px;object-fit:cover;border-radius:10px;margin-top:12px}' +
    '.cia-wait{margin:16px 0;padding:22px;border-radius:12px;background:#F3F5F7;text-align:center}.cia-wait b{display:block;font-size:17px;color:#12202B}.cia-wait span{display:block;margin-top:6px;color:#4A5A68;font-size:14px}' +
    '.cia-wait i{display:block;width:34px;height:34px;margin:0 auto 12px;border-radius:50%;border:4px solid #E3E8EC;border-top-color:#C2410C;animation:ciaspin 1s linear infinite}@keyframes ciaspin{to{transform:rotate(360deg)}}' +
    '.cia-cmp{position:relative;margin-top:12px;border-radius:12px;overflow:hidden;line-height:0;user-select:none;background:#DDE3E8}.cia-cmp img{width:100%;display:block;max-height:420px;object-fit:cover}' +
    '.cia-cmp img.cia-top{position:absolute;inset:0;width:100%;height:100%;max-height:none;object-fit:cover}' +
    '.cia-cmp input{position:absolute;inset:0;width:100%;height:100%;opacity:0;cursor:ew-resize;margin:0}.cia-cmp .l,.cia-cmp .r{position:absolute;bottom:10px;padding:4px 10px;border-radius:999px;background:rgba(18,32,43,.78);color:#fff;font:700 12px Inter,sans-serif;line-height:1.4}.cia-cmp .l{left:10px}.cia-cmp .r{right:10px}';
  document.head.appendChild(css);
  pinta();
})();
