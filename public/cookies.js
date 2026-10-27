/* Aviso de cookies de AMS Cerramientos: aceptar todas, rechazar o configurar.
   Las tecnicas siempre estan activas. El mapa de Google (terceros) y la medicion de visitas solo se activan con permiso. */
(function () {
  var KEY = 'ams-cookies';
  function leer() { try { return JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { return null; } }
  function guardar(v) { try { localStorage.setItem(KEY, JSON.stringify(v)); } catch (e) {} aplicar(v); try { window.dispatchEvent(new Event('ams-cookies')); } catch (e) {} }
  function aplicar(v) {
    document.querySelectorAll('[data-ck-src]').forEach(function (f) {
      var ph = f.parentNode.querySelector('.ck-ph');
      if (v && v.terceros) { if (!f.src) f.src = f.getAttribute('data-ck-src'); f.style.display = 'block'; if (ph) ph.style.display = 'none'; }
      else { f.style.display = 'none'; if (ph) ph.style.display = 'flex'; }
    });
  }
  var css = '#ck{position:fixed;left:12px;right:12px;bottom:12px;z-index:9999;max-width:760px;margin:0 auto;background:#12202B;color:#fff;border-radius:12px;padding:18px 20px;box-shadow:0 8px 32px rgba(0,0,0,.35);font:15px/1.5 Inter,system-ui,sans-serif}' +
    '#ck h2{margin:0 0 6px;font-size:17px}#ck p{margin:0 0 12px;color:#D3DBE2}#ck a{color:#F5B27F}' +
    '#ck .b{display:flex;flex-wrap:wrap;gap:8px}#ck button{min-height:44px;padding:0 18px;border-radius:8px;border:1px solid #fff;background:transparent;color:#fff;font:700 15px Inter,system-ui,sans-serif;cursor:pointer}' +
    '#ck button.p{background:#C2410C;border-color:#C2410C}#ck button:focus-visible{outline:3px solid #F5B27F;outline-offset:2px}' +
    '#ck .o{margin:0 0 12px;display:none}#ck .o label{display:flex;gap:10px;align-items:flex-start;margin:6px 0;color:#fff}#ck .o input{margin-top:4px;width:18px;height:18px}' +
    '.ck-ph{height:100%;min-height:380px;display:none;flex-direction:column;align-items:center;justify-content:center;gap:12px;text-align:center;padding:24px;color:#12202B;font-size:16px}' +
    '.ck-ph button{min-height:44px;padding:0 20px;border-radius:8px;border:0;background:#C2410C;color:#fff;font:700 15px Inter,system-ui,sans-serif;cursor:pointer}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
  document.querySelectorAll('iframe[data-ck-src]').forEach(function (f) {
    var d = document.createElement('div'); d.className = 'ck-ph';
    d.innerHTML = '<span>Para ver el mapa hace falta aceptar las cookies de Google Maps.</span><button type="button">Aceptar y ver el mapa</button>';
    d.querySelector('button').onclick = function () { var p = leer() || {}; guardar({ terceros: true, medicion: p.medicion === true }); };
    f.parentNode.insertBefore(d, f);
  });
  function cerrar() { var e = document.getElementById('ck'); if (e) e.remove(); }
  function mostrar() {
    cerrar();
    var d = document.createElement('div'); d.id = 'ck'; d.setAttribute('role', 'dialog'); d.setAttribute('aria-label', 'Aviso de cookies');
    d.innerHTML = '<h2>Cookies</h2><p>Usamos cookies técnicas, necesarias para que la web funcione. Con tu permiso, también las de medición de visitas (Google Analytics) y las de terceros (el mapa de Google Maps). Puedes aceptar todas, rechazarlas o elegir. Más información en la <a href="/cookies">política de cookies</a>.</p>' +
      '<div class="o"><label><input type="checkbox" checked disabled><span><b>Técnicas</b>: siempre activas, no se pueden desactivar.</span></label><label><input type="checkbox" id="ck-m"><span><b>Medición</b>: Google Analytics, para saber cuántas personas visitan la web y qué páginas ven. No te identifica.</span></label><label><input type="checkbox" id="ck-t"><span><b>Terceros</b>: Google Maps en la página de contacto.</span></label></div>' +
      '<div class="b"><button type="button" class="p" id="ck-a">Aceptar todas</button><button type="button" id="ck-r">Rechazar</button><button type="button" id="ck-c">Configurar</button></div>';
    document.body.appendChild(d);
    var cfg = false, v = leer(); if (v && v.terceros) document.getElementById('ck-t').checked = true; if (v && v.medicion) document.getElementById('ck-m').checked = true;
    document.getElementById('ck-a').onclick = function () { guardar({ terceros: true, medicion: true }); cerrar(); };
    document.getElementById('ck-r').onclick = function () { guardar({ terceros: false, medicion: false }); cerrar(); };
    document.getElementById('ck-c').onclick = function () {
      if (!cfg) { cfg = true; d.querySelector('.o').style.display = 'block'; this.textContent = 'Guardar mi elección'; }
      else { guardar({ terceros: document.getElementById('ck-t').checked, medicion: document.getElementById('ck-m').checked }); cerrar(); }
    };
  }
  document.addEventListener('click', function (e) { var a = e.target.closest && e.target.closest('[data-ck-open]'); if (a) { e.preventDefault(); mostrar(); } });
  var v0 = leer(); aplicar(v0); if (!v0 || v0.medicion === undefined) mostrar();
})();
