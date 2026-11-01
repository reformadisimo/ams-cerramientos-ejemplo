/* Precio con fotos (presupuesto sin visita, 1-nov-2026).
   Cada ventana: foto con un folio A4 pegado al cristal. El cliente toca las 4 esquinas del folio y las 4 del marco;
   con la homografía del folio (21 x 29,7 cm) se calcula el ancho y el alto aproximados del marco.
   Si no hay folio, puede escribir la medida. Al dejar sus datos ve el precio orientativo al momento (la misma tarifa
   que la calculadora, /api/precio) y la ficha con las fotos llega a AMS (/api/fotos) y a su libreta (amsLead). */
(function () {
  var lista = document.getElementById('sv-lista');
  if (!lista) return;
  var ventanas = [], cuenta = 0;
  var NORTE = /moraleja|encinar|conde orgaz|piovera|alameda de osuna|paracuellos|santo domingo|algete|ciudalcampo|fuente del fresno|alcobendas|san sebasti[aá]n de los reyes|mirasierra|hortaleza|barajas/i;
  var TIPOS = [['Oscilobatiente (se abre y se inclina)', 'oscilobatiente'], ['Abatible (solo se abre)', 'practicable'], ['Corredera', 'corredera'], ['Balconera (puerta a la terraza)', 'practicable'], ['Fija (no se abre)', 'corredera'], ['No lo sé', 'oscilobatiente']];
  var PERS = [['Con motor', 'motor'], ['Manual', 'manual'], ['Sin persiana', 'no'], ['Me vale la que tengo', 'no']];

  // ---------- geometría ----------
  function ordenar(p) { // esquinas en cualquier orden -> arriba-izq, arriba-der, abajo-der, abajo-izq
    var s = p.slice().sort(function (a, b) { return (a.x + a.y) - (b.x + b.y); });
    var tl = s[0], br = s[3], resto = [s[1], s[2]];
    resto.sort(function (a, b) { return (a.y - a.x) - (b.y - b.x); });
    return [tl, resto[0], br, resto[1]];
  }
  function resolver(A, b) {
    var n = b.length, M = A.map(function (f, i) { return f.concat([b[i]]); });
    for (var c = 0; c < n; c++) {
      var piv = c;
      for (var r = c + 1; r < n; r++) if (Math.abs(M[r][c]) > Math.abs(M[piv][c])) piv = r;
      var t = M[c]; M[c] = M[piv]; M[piv] = t;
      if (Math.abs(M[c][c]) < 1e-12) return null;
      for (var r2 = 0; r2 < n; r2++) {
        if (r2 === c) continue;
        var k = M[r2][c] / M[c][c];
        for (var j = c; j <= n; j++) M[r2][j] -= k * M[c][j];
      }
    }
    return M.map(function (f, i) { return f[n] / f[i]; });
  }
  function homografia(src, dst) {
    var A = [], b = [];
    for (var i = 0; i < 4; i++) {
      var x = src[i].x, y = src[i].y, u = dst[i].x, v = dst[i].y;
      A.push([x, y, 1, 0, 0, 0, -u * x, -u * y]); b.push(u);
      A.push([0, 0, 0, x, y, 1, -v * x, -v * y]); b.push(v);
    }
    var h = resolver(A, b);
    return h ? h.concat([1]) : null;
  }
  function aplicar(H, p) { var w = H[6] * p.x + H[7] * p.y + H[8]; return { x: (H[0] * p.x + H[1] * p.y + H[2]) / w, y: (H[3] * p.x + H[4] * p.y + H[5]) / w }; }
  var d = function (a, b) { return Math.hypot(a.x - b.x, a.y - b.y); };
  function medir(folio, marco) {
    var f = ordenar(folio), m = ordenar(marco);
    var horiz = (d(f[0], f[1]) + d(f[3], f[2])) / 2, vert = (d(f[0], f[3]) + d(f[1], f[2])) / 2;
    var W = horiz > vert ? 29.7 : 21, Hh = horiz > vert ? 21 : 29.7;
    var H = homografia(f, [{ x: 0, y: 0 }, { x: W, y: 0 }, { x: W, y: Hh }, { x: 0, y: Hh }]);
    if (!H) return null;
    var q = m.map(function (p) { return aplicar(H, p); });
    return { ancho: Math.round((d(q[0], q[1]) + d(q[3], q[2])) / 2), alto: Math.round((d(q[0], q[3]) + d(q[1], q[2])) / 2) };
  }
  var opts = function (l) { return l.map(function (o) { return '<option>' + o[0] + '</option>'; }).join(''); };

  // ---------- una ventana ----------
  function nueva() {
    cuenta++;
    var v = { id: cuenta, img: null, folio: [], marco: [], como: '', el: null };
    var el = document.createElement('div');
    el.className = 'card sv-v';
    el.innerHTML =
      '<div class="sv-cab"><h3>Ventana <span class="sv-num"></span></h3><button type="button" class="sv-quitar">Quitar</button></div>' +
      '<div class="sv-guia"><img src="/img/sv-ejemplo-foto.jpg" alt="Ejemplo: ventana entera, de frente, con un folio pegado en el cristal" loading="lazy"><p><b>Así tiene que quedar la foto:</b> la ventana entera, de frente, con un folio pegado en el cristal.</p></div>' +
      '<label class="sv-foto"><input type="file" accept="image/*" capture="environment"><span>Hacer la foto</span></label>' +
      '<div class="sv-lienzo"><p class="sv-paso"></p><canvas></canvas><div class="sv-botones"><button type="button" class="sv-deshacer">Deshacer el último toque</button><button type="button" class="sv-reiniciar">Volver a marcar</button></div></div>' +
      '<p class="sv-ok" hidden></p>' +
      '<p class="sv-mano">¿Sabes la medida o no tienes folio? Escríbela aquí:</p>' +
      '<div class="sv-med"><label>Ancho (cm)<input type="number" inputmode="numeric" min="20" max="600" class="sv-an" placeholder="120"></label><label>Alto (cm)<input type="number" inputmode="numeric" min="20" max="400" class="sv-al" placeholder="120"></label></div>' +
      '<label style="font-weight:700;display:flex;flex-direction:column;gap:6px">¿Cómo se abre?<select class="sv-tipo">' + opts(TIPOS) + '</select></label>' +
      '<label style="font-weight:700;display:flex;flex-direction:column;gap:6px">Persiana<select class="sv-pers">' + opts(PERS) + '</select></label>' +
      '<label style="display:flex;gap:10px;align-items:center"><input type="checkbox" class="sv-mosq"> Quiero mosquitera</label>';
    v.el = el;
    var q = function (s) { return el.querySelector(s); };
    var cv = q('canvas'), cx = cv.getContext('2d'), lienzo = q('.sv-lienzo'), paso = q('.sv-paso'), ok = q('.sv-ok'), guia = q('.sv-guia');
    var an = q('.sv-an'), al = q('.sv-al'), etiqueta = q('.sv-foto span');
    function aviso(t, mal) { ok.hidden = false; ok.textContent = t; ok.style.background = mal ? '#FDECEA' : ''; ok.style.color = mal ? '#B42318' : ''; }
    function texto() {
      if (v.folio.length < 4) paso.textContent = 'Paso 1: toca las 4 esquinas del folio (' + v.folio.length + ' de 4).';
      else if (v.marco.length < 4) paso.textContent = 'Paso 2: ahora toca las 4 esquinas del marco de la ventana (' + v.marco.length + ' de 4).';
      else paso.textContent = 'Listo. Si algo no cuadra, pulsa «Volver a marcar».';
    }
    function dibujar() {
      if (!v.img) return;
      cx.drawImage(v.img, 0, 0, cv.width, cv.height);
      var r = Math.max(7, cv.width / 80);
      [[v.folio, '#F2C14E'], [v.marco, '#C2410C']].forEach(function (g) {
        var pts = g[0]; if (!pts.length) return;
        cx.lineWidth = Math.max(3, cv.width / 280); cx.strokeStyle = g[1]; cx.fillStyle = g[1];
        var o = pts.length === 4 ? ordenar(pts) : pts;
        cx.beginPath(); o.forEach(function (p, i) { i ? cx.lineTo(p.x, p.y) : cx.moveTo(p.x, p.y); }); if (pts.length === 4) cx.closePath(); cx.stroke();
        pts.forEach(function (p) { cx.beginPath(); cx.arc(p.x, p.y, r, 0, Math.PI * 2); cx.fill(); });
      });
    }
    function calcular() {
      if (v.folio.length === 4 && v.marco.length === 4) {
        var m = medir(v.folio, v.marco);
        if (m && m.ancho >= 20 && m.ancho <= 600 && m.alto >= 20 && m.alto <= 400) {
          an.value = m.ancho; al.value = m.alto; v.como = 'foto';
          aviso('Tu ventana mide unos ' + m.ancho + ' × ' + m.alto + ' cm.');
        } else aviso('La medida no sale bien. Pulsa «Volver a marcar» y toca bien las esquinas, o escribe la medida a mano.', true);
      }
    }
    cv.addEventListener('click', function (e) {
      if (!v.img) return;
      var b = cv.getBoundingClientRect(), p = { x: (e.clientX - b.left) * cv.width / b.width, y: (e.clientY - b.top) * cv.height / b.height };
      if (v.folio.length < 4) v.folio.push(p); else if (v.marco.length < 4) v.marco.push(p); else return;
      dibujar(); texto(); calcular();
    });
    q('.sv-deshacer').addEventListener('click', function () { if (v.marco.length) v.marco.pop(); else v.folio.pop(); dibujar(); texto(); ok.hidden = true; });
    q('.sv-reiniciar').addEventListener('click', function () { v.folio = []; v.marco = []; dibujar(); texto(); ok.hidden = true; });
    [an, al].forEach(function (i) { i.addEventListener('input', function () { v.como = v.como === 'foto' ? 'foto-corregida' : 'mano'; }); });
    function mostrar(blob) {
      var u = URL.createObjectURL(blob), im = new Image();
      im.onload = function () {
        var k = Math.min(1, 1400 / Math.max(im.width, im.height));
        cv.width = Math.round(im.width * k); cv.height = Math.round(im.height * k);
        v.img = im; v.folio = []; v.marco = [];
        lienzo.style.display = 'flex'; guia.style.display = 'none'; etiqueta.textContent = 'Cambiar la foto'; ok.hidden = true;
        dibujar(); texto();
        lienzo.scrollIntoView({ behavior: 'smooth', block: 'center' });
      };
      im.onerror = function () {
        URL.revokeObjectURL(u);
        if (!blob.__convertida && /heic|heif/i.test((blob.type || '') + ' ' + (blob.name || ''))) return convertirHeic(blob);
        etiqueta.textContent = 'Hacer la foto';
        aviso('No hemos podido abrir esa foto. Prueba con otra, o hazla directamente con el móvil desde esta página.', true);
      };
      im.src = u;
    }
    function convertirHeic(blob) {
      etiqueta.textContent = 'Abriendo la foto del iPhone...';
      var falla = function () { etiqueta.textContent = 'Hacer la foto'; aviso('Esa foto es del iPhone (formato HEIC) y no la podemos abrir aquí. Hazla directamente con el móvil desde esta página.', true); };
      var go = function () {
        window.heic2any({ blob: blob, toType: 'image/jpeg', quality: 0.85 }).then(function (r) { r = Array.isArray(r) ? r[0] : r; r.__convertida = true; mostrar(r); }).catch(falla);
      };
      if (window.heic2any) return go();
      var sc = document.createElement('script'); sc.src = '/vendor/heic2any.min.js'; sc.onload = go; sc.onerror = falla; document.head.appendChild(sc);
    }
    q('input[type=file]').addEventListener('change', function (e) {
      var f = e.target.files && e.target.files[0]; if (!f) return;
      etiqueta.textContent = 'Abriendo la foto...'; mostrar(f);
    });
    q('.sv-quitar').addEventListener('click', function () {
      if (ventanas.length === 1) return;
      ventanas = ventanas.filter(function (x) { return x !== v; }); el.remove(); numerar(); avisoZona();
    });
    v.datos = function (conFoto) {
      var ti = TIPOS[q('.sv-tipo').selectedIndex] || TIPOS[0], pe = PERS[q('.sv-pers').selectedIndex] || PERS[0];
      var r = { tipo: ti[0], apertura: ti[1], persiana: pe[0], per: pe[1], mosquitera: q('.sv-mosq').checked, ancho: Number(an.value) || 0, alto: Number(al.value) || 0, como: v.como || (an.value ? 'mano' : '') };
      if (conFoto && v.img) r.foto = cv.toDataURL('image/jpeg', conFoto);
      return r;
    };
    ventanas.push(v); lista.appendChild(el); numerar(); avisoZona();
    return v;
  }
  function numerar() { ventanas.forEach(function (v, i) { v.el.querySelector('.sv-num').textContent = i + 1; v.el.querySelector('.sv-quitar').hidden = ventanas.length === 1; }); }

  // ---------- zona ----------
  var zona = document.getElementById('sv-zona'), avisoZ = document.getElementById('sv-zona-aviso');
  function avisoZona() {
    avisoZ.hidden = !(NORTE.test(zona.value || '') && ventanas.length < 6);
    avisoZ.textContent = 'En esta zona hacemos obras completas, de 6 ventanas o más. Si son menos, te atendería mejor un instalador más cercano; si más adelante cambias el resto, aquí estamos.';
  }
  zona.addEventListener('input', avisoZona);
  try { var pz = new URLSearchParams(location.search).get('zona'); if (pz) zona.value = pz.slice(0, 80); } catch (e) {}
  document.getElementById('sv-mas').addEventListener('click', function () { var v = nueva(); v.el.scrollIntoView({ behavior: 'smooth', block: 'start' }); });
  nueva();

  // ---------- precio y envío ----------
  var form = document.getElementById('sv-form'), st = document.getElementById('sv-s'), bt = document.getElementById('sv-b'), res = document.getElementById('sv-res');
  var eur = function (n) { return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' €'; };
  function msg(t, e) { st.textContent = t; st.style.color = e ? '#B42318' : '#1B6B3A'; }
  function precioDe(x) {
    if (!x.ancho || !x.alto) return Promise.resolve(null);
    return fetch('/api/precio', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ svc: 'ventanas', ventanas: [{ n: 1, w: x.ancho, h: x.alto, label: x.tipo }], material: 'pvc', apertura: x.apertura, vidrio: 'termico', color: 'blanco', persiana: x.per, mosquitera: x.mosquitera }) })
      .then(function (r) { return r.ok ? r.json() : null; }).catch(function () { return null; });
  }
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var n = document.getElementById('sv-n').value.trim(), t = document.getElementById('sv-t').value.trim(), m = document.getElementById('sv-e').value.trim();
    var datos = ventanas.map(function (v) { return v.datos(0); });
    if (!datos.some(function (x) { return x.ancho && x.alto; })) { msg('Haz la foto de al menos una ventana (o escribe su medida) para calcular el precio.', 1); return; }
    if (t.replace(/\D/g, '').length < 9) { msg('Escribe tu teléfono para poder confirmarte el precio.', 1); return; }
    if (!document.getElementById('sv-c').checked) { msg('Marca la casilla para que podamos ver las fotos.', 1); return; }
    var calidad = [0.72, 0.6, 0.48, 0.36], conFotos, i = 0;
    do { conFotos = ventanas.map(function (v) { return v.datos(calidad[i]); }); i++; }
    while (i < calidad.length && JSON.stringify(conFotos).length > 4000000);
    var resumen = datos.length + ' ventanas: ' + datos.map(function (x, k) { return (k + 1) + ') ' + x.tipo + (x.ancho ? ' ' + x.ancho + 'x' + x.alto + ' cm' : '') + ', persiana ' + x.persiana.toLowerCase() + (x.mosquitera ? ', mosquitera' : ''); }).join('; ');
    bt.disabled = true; msg('Calculando tu precio...');
    try { if (window.amsLead) window.amsLead({ nombre: n || '(sin nombre)', telefono: t, correo: m, zona: zona.value, trabajo: 'ventanas', pide: 'Precio con fotos. ' + resumen }, 'sin-visita'); } catch (er) {}
    Promise.all(datos.map(precioDe)).then(function (ps) {
      var lo = 0, hi = 0, iva = false, filas = '';
      datos.forEach(function (x, k) {
        var p = ps[k];
        if (p) { lo += p.low; hi += p.high; iva = iva || p.iva_incluido; }
        filas += '<li>Ventana ' + (k + 1) + ': ' + (x.ancho ? x.ancho + ' × ' + x.alto + ' cm, ' : 'sin medida, ') + x.tipo.split(' (')[0].toLowerCase() + (x.per !== 'no' ? ', persiana ' + x.persiana.toLowerCase() : '') + (x.mosquitera ? ', mosquitera' : '') + (p ? ': <b>' + eur(p.low) + ' a ' + eur(p.high) + '</b>' : '') + '</li>';
      });
      res.hidden = false;
      res.innerHTML = '<p style="margin:0;color:#4A5A68;font-weight:600">Tu precio orientativo</p>' +
        (lo ? '<div class="sv-precio">' + eur(lo) + ' a ' + eur(hi) + '</div><p style="margin:0;color:#4A5A68">' + (iva ? 'IVA incluido. ' : 'Más IVA. ') + 'PVC de calidad, montaje y remates incluidos.</p>' : '<div class="sv-precio">Te lo calculamos nosotros</div>') +
        '<ul>' + filas + '</ul>' +
        '<p style="margin:0;line-height:1.55"><b>¿Y ahora?</b> Te llamamos lo antes posible para confirmártelo. Si te encaja, vamos a medir con láser y te damos el presupuesto definitivo por escrito, sin compromiso.</p>' +
        '<div style="display:flex;flex-wrap:wrap;gap:12px"><a class="b1" href="tel:+34639788220">Llamar ahora</a><a class="b2" href="https://wa.me/34639788220">Escribir por WhatsApp</a></div>';
      res.scrollIntoView({ behavior: 'smooth', block: 'start' });
      msg('');
    });
    fetch('/api/fotos', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre: n, telefono: t, correo: m, zona: zona.value, mensaje: document.getElementById('sv-m').value, consentimiento: true, ventanas: conFotos, origen: window.amsOrigen ? window.amsOrigen() : null })
    }).then(function () { bt.disabled = false; }).catch(function () { bt.disabled = false; });
  });
})();
