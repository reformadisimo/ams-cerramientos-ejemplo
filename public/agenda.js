/* Agenda de la visita (2-nov-2026). Después de ver el precio (calculadora, configurador, precio con fotos o formulario),
   el cliente dice cuándo quiere hacer la obra y, si quiere, pide la visita para medir: día (desde mañana, laborables),
   mañana o tarde y hora. Nosotros se la confirmamos por teléfono o WhatsApp. Lo manda a /api/visita, que avisa a AMS,
   le escribe al cliente y lo apunta en la libreta.
   Uso: window.amsAgenda(contenedor, { nombre, telefono, correo, cp, zona, resumen, canal }) */
(function () {
  var estado = {};
  var CUANDO = ['Lo antes posible', 'En un mes', 'De 1 a 3 meses', 'Más adelante'];
  var MAN = ['9:00', '10:00', '11:00', '12:00', '13:00'], TAR = ['16:00', '17:00', '18:00'];
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  function css() {
    if (document.getElementById('ag-css')) return;
    var s = document.createElement('style'); s.id = 'ag-css';
    s.textContent = '.ag{margin-top:18px;border:2px solid #1f6fb2;border-radius:16px;padding:18px;background:#F7FAFD;display:flex;flex-direction:column;gap:12px;text-align:left;font-size:16px;color:#12202B}' +
      '.ag h3{margin:0;font-size:20px}.ag p{margin:0;color:#3D5163;line-height:1.5}.ag .ag-q{font-weight:700;margin-top:4px}' +
      '.ag-ch{display:flex;flex-wrap:wrap;gap:8px}.ag-ch button{border:2px solid #C9D6E2;background:#fff;color:#12202B;border-radius:999px;padding:9px 14px;font:inherit;font-size:15px;font-weight:600;cursor:pointer}' +
      '.ag-ch button.on{border-color:#C2410C;background:#C2410C;color:#fff}' +
      '.ag-dia{display:flex;flex-direction:column;align-items:center;line-height:1.15;min-width:64px;border-radius:12px!important}.ag-dia small{font-weight:500;font-size:12px}' +
      '.ag input{width:100%;box-sizing:border-box;border:1.5px solid #C9D6E2;border-radius:10px;padding:11px 12px;font:inherit;font-size:16px;background:#fff}' +
      '.ag .ag-2{display:grid;grid-template-columns:1fr 1fr;gap:10px}@media(max-width:520px){.ag .ag-2{grid-template-columns:1fr}}' +
      '.ag label{display:flex;flex-direction:column;gap:5px;font-weight:600;font-size:15px}' +
      '.ag .ag-go{background:#C2410C;color:#fff;border:0;border-radius:999px;padding:14px 22px;font:inherit;font-weight:800;font-size:17px;cursor:pointer;align-self:flex-start}' +
      '.ag .ag-err{color:#B42318;font-weight:600}.ag .ag-ok{background:#E8F5EC;border-radius:12px;padding:14px;color:#14532D;font-weight:600;line-height:1.5}';
    document.head.appendChild(s);
  }
  function dias() {
    var out = [], d = new Date();
    while (out.length < 6) {
      d = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1);
      var w = d.getDay(); if (w === 0 || w === 6) continue;
      out.push(d);
    }
    return out;
  }
  var fdia = function (d) { return d.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }); };
  function enviar(st, datos, extra) {
    var o = null; try { o = window.amsOrigen ? window.amsOrigen() : null; } catch (e) {}
    return fetch('/api/visita', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(Object.assign({
      nombre: datos.nombre || '', telefono: st.tel || datos.telefono || '', correo: datos.correo || '', zona: datos.zona || '', resumen: datos.resumen || '', canal: datos.canal || 'web', cuando: st.cuando || '', origen: o
    }, extra || {})) }).then(function (r) { return r.json().catch(function () { return { ok: r.ok }; }); });
  }
  function pinta(el, datos, st) {
    css();
    var h = '<div class="ag"><h3>¿Y ahora?</h3>';
    if (st.hecho) {
      h += '<div class="ag-ok">Hecho. Has pedido la visita para el <b>' + esc(st.diaTxt) + ' a las ' + esc(st.hora) + '</b>. Te llamamos o te escribimos por WhatsApp para confirmártela. Si esa hora no nos encaja, te proponemos otra muy cerca.</div></div>';
      el.innerHTML = h; return;
    }
    h += '<p class="ag-q">¿Cuándo quieres cambiarlas?</p><div class="ag-ch" data-k="cuando">' + CUANDO.map(function (c) { return '<button type="button" class="' + (st.cuando === c ? 'on' : '') + '" data-v="' + esc(c) + '">' + esc(c) + '</button>'; }).join('') + '</div>';
    h += '<p class="ag-q">¿Quieres que vayamos a medir, gratis y sin compromiso?</p><div class="ag-ch" data-k="visita"><button type="button" class="' + (st.visita === 'si' ? 'on' : '') + '" data-v="si">Sí, quiero la visita</button><button type="button" class="' + (st.visita === 'no' ? 'on' : '') + '" data-v="no">Ahora no</button></div>';
    if (st.visita === 'no') h += '<p>Sin problema. Tienes el precio en tu correo, y cuando quieras nos escribes por WhatsApp al 639 78 82 20.</p>';
    if (st.visita === 'si') {
      var D = dias();
      h += '<p class="ag-q">Elige el día</p><div class="ag-ch" data-k="dia">' + D.map(function (d, i) {
        var a = d.toLocaleDateString('es-ES', { weekday: 'short' }).replace('.', ''), n = d.getDate(), m = d.toLocaleDateString('es-ES', { month: 'short' }).replace('.', '');
        return '<button type="button" class="ag-dia ' + (st.dia === i ? 'on' : '') + '" data-v="' + i + '">' + (i === 0 ? 'Mañana' : a) + '<small>' + n + ' ' + m + '</small></button>';
      }).join('') + '</div>';
      h += '<p class="ag-q">¿A qué hora te viene bien?</p><div class="ag-ch" data-k="hora">' + MAN.concat(TAR).map(function (x) { return '<button type="button" class="' + (st.hora === x ? 'on' : '') + '" data-v="' + x + '">' + x + '</button>'; }).join('') + '</div>';
      h += '<div class="ag-2"><label>Tu teléfono<input type="tel" class="ag-tel" autocomplete="tel" inputmode="tel" value="' + esc(st.tel != null ? st.tel : (datos.telefono || '')) + '" placeholder="600 123 456"></label>' +
        '<label>Código postal<input type="text" class="ag-cp" inputmode="numeric" maxlength="5" autocomplete="postal-code" value="' + esc(st.cp != null ? st.cp : (datos.cp || '')) + '" placeholder="28805"></label></div>' +
        '<label>Calle y número (si quieres)<input type="text" class="ag-calle" autocomplete="street-address" maxlength="120" value="' + esc(st.calle || '') + '" placeholder="Calle Mayor 12"></label>' +
        '<p>Elige la hora que mejor te venga y te la confirmamos por teléfono o WhatsApp. Si no nos cuadra, te proponemos otra muy cerca.</p>' +
        '<button type="button" class="ag-go">Pedir la visita</button><p class="ag-err" role="status"></p>';
    }
    h += '</div>';
    el.innerHTML = h;
    var q = function (s) { return el.querySelector(s); };
    var guarda = function () { if (q('.ag-tel')) { st.tel = q('.ag-tel').value; st.cp = q('.ag-cp').value; st.calle = q('.ag-calle').value; } };
    el.querySelectorAll('.ag-ch').forEach(function (g) {
      g.addEventListener('click', function (e) {
        var b = e.target.closest('button'); if (!b) return;
        guarda();
        var k = g.getAttribute('data-k'), v = b.getAttribute('data-v');
        if (k === 'dia') st.dia = Number(v); else st[k] = v;
        if (k === 'cuando' && !st.cuandoEnviado) { st.cuandoEnviado = 1; enviar(st, datos, { tipo: 'cuando' }).catch(function () {}); }
        pinta(el, datos, st);
      });
    });
    var go = q('.ag-go');
    if (go) go.addEventListener('click', function () {
      guarda();
      var err = q('.ag-err'), tel = String(st.tel || '').replace(/\D/g, ''), cp = String(st.cp || '').replace(/\D/g, '');
      if (st.dia == null) { err.textContent = 'Elige el día.'; return; }
      if (!st.hora) { err.textContent = 'Elige la hora.'; return; }
      if (tel.length < 9) { err.textContent = 'Escribe tu teléfono para poder confirmarte la visita.'; return; }
      if (cp.length !== 5) { err.textContent = 'Escribe el código postal de la casa.'; return; }
      var d = dias()[st.dia]; st.diaTxt = fdia(d);
      go.disabled = true; err.textContent = 'Enviando...'; err.style.color = '#1B6B3A';
      enviar(st, datos, { tipo: 'visita', dia: d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'), diaTxt: st.diaTxt, hora: st.hora, cp: cp, calle: st.calle || '' })
        .then(function (r) {
          if (r && r.ok) { st.hecho = 1; pinta(el, datos, st); try { if (window.amsEvento) window.amsEvento('generate_lead', { pagina: location.pathname, via: 'pide_visita' }); } catch (e) {} }
          else { go.disabled = false; err.style.color = ''; err.textContent = 'No hemos podido enviarlo. Escríbenos por WhatsApp al 639 78 82 20.'; }
        }).catch(function () { go.disabled = false; err.style.color = ''; err.textContent = 'No hemos podido enviarlo. Escríbenos por WhatsApp al 639 78 82 20.'; });
    });
  }
  window.amsAgenda = function (el, datos) {
    if (!el) return;
    datos = datos || {};
    var k = datos.clave || (datos.canal || 'web');
    var st = estado[k] || (estado[k] = {});
    pinta(el, datos, st);
  };
})();
