/* Presupuesto sin visita (1-nov-2026).
   Cada ventana: foto con un folio A4 pegado al cristal. El cliente toca las 4 esquinas del folio y las 4 del marco;
   con la homografía del folio (medida conocida, 21 x 29,7 cm) se calcula el ancho y el alto aproximados del marco.
   Si no hay folio, escribe las medidas a mano. Se envía a /api/fotos (correo a Javi con las fotos) y al CRM (amsLead). */
(function () {
  var lista = document.getElementById('sv-lista');
  if (!lista) return;
  var ventanas = [], cuenta = 0;
  var NORTE = /moraleja|encinar|conde orgaz|piovera|alameda de osuna|paracuellos|santo domingo|algete|ciudalcampo|fuente del fresno|alcobendas|san sebasti[aá]n de los reyes|mirasierra|hortaleza|barajas/i;

  // ---------- geometría ----------
  function ordenar(p) { // esquinas en cualquier orden -> arriba-izq, arriba-der, abajo-der, abajo-izq
    var s = p.slice().sort(function (a, b) { return (a.x + a.y) - (b.x + b.y); });
    var tl = s[0], br = s[3], resto = [s[1], s[2]];
    resto.sort(function (a, b) { return (a.y - a.x) - (b.y - b.x); });
    return [tl, resto[0], br, resto[1]];
  }
  function resolver(A, b) { // Gauss con pivote, 8x8
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
  function aplicar(H, p) {
    var w = H[6] * p.x + H[7] * p.y + H[8];
    return { x: (H[0] * p.x + H[1] * p.y + H[2]) / w, y: (H[3] * p.x + H[4] * p.y + H[5]) / w };
  }
  var d = function (a, b) { return Math.hypot(a.x - b.x, a.y - b.y); };
  function medir(folio, marco) {
    var f = ordenar(folio), m = ordenar(marco);
    var horiz = (d(f[0], f[1]) + d(f[3], f[2])) / 2, vert = (d(f[0], f[3]) + d(f[1], f[2])) / 2;
    var W = horiz > vert ? 29.7 : 21, Hh = horiz > vert ? 21 : 29.7; // centímetros
    var H = homografia(f, [{ x: 0, y: 0 }, { x: W, y: 0 }, { x: W, y: Hh }, { x: 0, y: Hh }]);
    if (!H) return null;
    var q = m.map(function (p) { return aplicar(H, p); });
    return { ancho: Math.round((d(q[0], q[1]) + d(q[3], q[2])) / 2), alto: Math.round((d(q[0], q[3]) + d(q[1], q[2])) / 2) };
  }

  // ---------- una ventana ----------
  function nueva() {
    cuenta++;
    var v = { id: cuenta, img: null, folio: [], marco: [], como: '', el: null };
    var el = document.createElement('div');
    el.className = 'card sv-v';
    el.innerHTML =
      '<div class="sv-cab"><h3>Ventana <span class="sv-num"></span></h3><button type="button" class="sv-quitar">Quitar</button></div>' +
      '<label class="sv-foto"><input type="file" accept="image/*" capture="environment"><span>Hacer o elegir la foto</span></label>' +
      '<div class="sv-lienzo"><p class="sv-paso"></p><canvas></canvas><div class="sv-botones"><button type="button" class="sv-deshacer">Deshacer el último toque</button><button type="button" class="sv-reiniciar">Volver a marcar</button></div></div>' +
      '<div class="sv-med"><label>Ancho (cm)<input type="number" inputmode="numeric" min="20" max="600" class="sv-an"></label><label>Alto (cm)<input type="number" inputmode="numeric" min="20" max="400" class="sv-al"></label></div>' +
      '<p class="sv-ok" hidden></p>' +
      '<label style="font-weight:700">Tipo de ventana<select class="sv-tipo"><option>Abatible u oscilobatiente</option><option>Corredera</option><option>Balconera (puerta a terraza)</option><option>Fija</option><option>No lo sé</option></select></label>' +
      '<label style="font-weight:700">Persiana<select class="sv-pers"><option>Con motor</option><option>Manual</option><option>Sin persiana</option><option>Me vale la que tengo</option></select></label>' +
      '<label style="display:flex;gap:10px;align-items:center"><input type="checkbox" class="sv-mosq"> Quiero mosquitera</label>' +
      '<label style="font-weight:700">Nota (opcional)<input type="text" maxlength="120" class="sv-nota" placeholder="Por ejemplo, la del salón, da al jardín"></label>';
    v.el = el;
    var q = function (s) { return el.querySelector(s); };
    var cv = q('canvas'), cx = cv.getContext('2d'), lienzo = q('.sv-lienzo'), paso = q('.sv-paso'), ok = q('.sv-ok');
    var an = q('.sv-an'), al = q('.sv-al');
    function texto() {
      if (v.folio.length < 4) paso.textContent = 'Toca las 4 esquinas del folio (' + v.folio.length + ' de 4).';
      else if (v.marco.length < 4) paso.textContent = 'Ahora toca las 4 esquinas del marco de la ventana (' + v.marco.length + ' de 4).';
      else paso.textContent = 'Listo. Si algo no cuadra, vuelve a marcar o corrige la medida a mano.';
    }
    function dibujar() {
      if (!v.img) return;
      cx.drawImage(v.img, 0, 0, cv.width, cv.height);
      var r = Math.max(6, cv.width / 90);
      [[v.folio, '#F2C14E'], [v.marco, '#C2410C']].forEach(function (g) {
        var pts = g[0]; if (!pts.length) return;
        cx.lineWidth = Math.max(3, cv.width / 300); cx.strokeStyle = g[1]; cx.fillStyle = g[1];
        var o = pts.length === 4 ? ordenar(pts) : pts;
        cx.beginPath(); o.forEach(function (p, i) { i ? cx.lineTo(p.x, p.y) : cx.moveTo(p.x, p.y); }); if (pts.length === 4) cx.closePath(); cx.stroke();
        pts.forEach(function (p) { cx.beginPath(); cx.arc(p.x, p.y, r, 0, Math.PI * 2); cx.fill(); });
      });
    }
    function calcular() {
      ok.hidden = true;
      if (v.folio.length === 4 && v.marco.length === 4) {
        var m = medir(v.folio, v.marco);
        if (m && m.ancho >= 20 && m.ancho <= 600 && m.alto >= 20 && m.alto <= 400) {
          an.value = m.ancho; al.value = m.alto; v.como = 'foto';
          ok.textContent = 'Medida aproximada: ' + m.ancho + ' × ' + m.alto + ' cm. Puedes corregirla si la sabes.';
          ok.hidden = false;
        } else {
          paso.textContent = 'La medida no sale bien. Revisa que has tocado las esquinas del folio y del marco, o escribe la medida a mano.';
        }
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
    q('input[type=file]').addEventListener('change', function (e) {
      var f = e.target.files && e.target.files[0]; if (!f) return;
      var u = URL.createObjectURL(f), im = new Image();
      im.onload = function () {
        var k = Math.min(1, 1400 / Math.max(im.width, im.height));
        cv.width = Math.round(im.width * k); cv.height = Math.round(im.height * k);
        v.img = im; v.folio = []; v.marco = [];
        lienzo.style.display = 'flex'; q('.sv-foto span').textContent = 'Cambiar la foto';
        dibujar(); texto();
      };
      im.src = u;
    });
    q('.sv-quitar').addEventListener('click', function () {
      if (ventanas.length === 1) return;
      ventanas = ventanas.filter(function (x) { return x !== v; }); el.remove(); numerar(); avisoZona();
    });
    v.datos = function (conFoto) {
      var r = { tipo: q('.sv-tipo').value, persiana: q('.sv-pers').value, mosquitera: q('.sv-mosq').checked, nota: q('.sv-nota').value, ancho: Number(an.value) || 0, alto: Number(al.value) || 0, como: v.como || (an.value ? 'mano' : '') };
      if (conFoto && v.img) r.foto = cv.toDataURL('image/jpeg', conFoto);
      return r;
    };
    ventanas.push(v); lista.appendChild(el); numerar(); avisoZona();
    return v;
  }
  function numerar() { ventanas.forEach(function (v, i) { v.el.querySelector('.sv-num').textContent = i + 1; v.el.querySelector('.sv-quitar').hidden = ventanas.length === 1; }); }

  // ---------- zona ----------
  var zona = document.getElementById('sv-zona'), aviso = document.getElementById('sv-zona-aviso');
  function avisoZona() {
    var norte = NORTE.test(zona.value || '');
    aviso.hidden = !(norte && ventanas.length < 6);
    aviso.textContent = 'En esta zona hacemos obras completas, de 6 ventanas o más. Si son menos, te atendería mejor un instalador más cercano; si más adelante cambias el resto, aquí estamos.';
  }
  zona.addEventListener('input', avisoZona);
  try { var pz = new URLSearchParams(location.search).get('zona'); if (pz) zona.value = pz.slice(0, 80); } catch (e) {}
  document.getElementById('sv-mas').addEventListener('click', function () { var v = nueva(); v.el.scrollIntoView({ behavior: 'smooth', block: 'start' }); });
  nueva();

  // ---------- envío ----------
  var form = document.getElementById('sv-form'), st = document.getElementById('sv-s'), bt = document.getElementById('sv-b');
  function msg(t, e) { st.textContent = t; st.style.color = e ? '#B42318' : '#1B6B3A'; }
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var n = document.getElementById('sv-n').value.trim(), t = document.getElementById('sv-t').value.trim(), m = document.getElementById('sv-e').value.trim();
    var datos = ventanas.map(function (v) { return v.datos(0); });
    if (!datos.some(function (x) { return x.ancho || x.alto; }) && !ventanas.some(function (v) { return v.img; })) { msg('Añade al menos una foto o una medida.', 1); return; }
    if (t.replace(/\D/g, '').length < 9 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(m)) { msg('Escribe un teléfono para poder mandarte el precio.', 1); return; }
    if (!document.getElementById('sv-c').checked) { msg('Marca la casilla para que podamos ver las fotos.', 1); return; }
    // fotos cada vez más ligeras hasta que quepa todo (límite de unos 4 MB)
    var calidad = [0.72, 0.6, 0.48, 0.36], conFotos, i = 0;
    do { conFotos = ventanas.map(function (v) { return v.datos(calidad[i]); }); i++; }
    while (i < calidad.length && JSON.stringify(conFotos).length > 4000000);
    var resumen = datos.length + ' ventanas: ' + datos.map(function (x, k) { return (k + 1) + ') ' + x.tipo + (x.ancho ? ' ' + x.ancho + 'x' + x.alto + ' cm' : '') + ', persiana ' + x.persiana.toLowerCase() + (x.mosquitera ? ', mosquitera' : ''); }).join('; ');
    bt.disabled = true; msg('Enviando las fotos...');
    try { if (window.amsLead) window.amsLead({ nombre: n || '(sin nombre)', telefono: t, correo: m, zona: zona.value, trabajo: 'ventanas', pide: 'Presupuesto sin visita. ' + resumen }, 'sin-visita'); } catch (er) {}
    fetch('/api/fotos', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre: n, telefono: t, correo: m, zona: zona.value, mensaje: document.getElementById('sv-m').value, consentimiento: true, ventanas: conFotos, origen: window.amsOrigen ? window.amsOrigen() : null })
    }).then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return { r: r, j: j }; }); })
      .then(function (x) {
        bt.disabled = false;
        if (x.j && x.j.ok) { msg('Recibido, gracias. Te mandamos el precio orientativo en 24 a 48 horas laborables.'); form.reset(); }
        else if (x.r.status === 429) msg('Has enviado varios seguidos. Inténtalo más tarde o escríbenos por WhatsApp al 639 78 82 20.', 1);
        else msg('No hemos podido enviarlo desde aquí. Mándanos las fotos por WhatsApp al 639 78 82 20.', 1);
      })
      .catch(function () { bt.disabled = false; msg('No hemos podido enviarlo desde aquí. Mándanos las fotos por WhatsApp al 639 78 82 20.', 1); });
  });
})();
