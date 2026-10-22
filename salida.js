/* Aviso de salida: si el visitante se va, le ofrecemos la calculadora y recordamos que visita y medicion son gratis. */
(function () {
  var p = location.pathname.replace(/\/$/, '');
  if (/^\/(aviso-legal|privacidad|cookies|guia-javi|cuestionario|fotos-web-antigua)/.test(p)) return;
  var K = 'ams-salida';
  try { if (sessionStorage.getItem(K)) return; } catch (e) {}
  var enCalc = /^\/(calculadora|configurador)/.test(p), enContacto = /^\/contacto/.test(p);
  if (enContacto) return;
  var t0 = Date.now(), hecho = false, ultimoY = window.scrollY, maxY = 0;
  var css = '#sx{position:fixed;inset:0;z-index:9998;background:rgba(18,32,43,.62);display:flex;align-items:center;justify-content:center;padding:16px;font:16px/1.5 Inter,system-ui,sans-serif}' +
    '#sx .c{position:relative;background:#fff;color:#12202B;border-radius:14px;max-width:460px;width:100%;padding:28px 26px 24px;box-shadow:0 20px 60px rgba(0,0,0,.4)}' +
    '#sx .k{display:inline-block;background:#FDEBDD;color:#9A3412;font-weight:700;font-size:13px;letter-spacing:.04em;text-transform:uppercase;padding:4px 10px;border-radius:99px;margin-bottom:10px}' +
    '#sx h2{margin:0 0 8px;font-size:24px;line-height:1.2}#sx p{margin:0 0 16px;color:#41505C}' +
    '#sx .a{display:flex;flex-direction:column;gap:10px}#sx a.p,#sx a.s{display:flex;align-items:center;justify-content:center;min-height:48px;border-radius:8px;font-weight:700;text-decoration:none;text-align:center;padding:0 16px}' +
    '#sx a.p{background:#C2410C;color:#fff}#sx a.s{border:2px solid #12202B;color:#12202B}' +
    '#sx .x{position:absolute;top:8px;right:8px;width:44px;height:44px;border:0;background:transparent;font-size:28px;line-height:1;cursor:pointer;color:#41505C}' +
    '#sx .n{display:block;margin:12px auto 0;background:none;border:0;color:#41505C;text-decoration:underline;cursor:pointer;font:inherit;min-height:36px}' +
    '#sx a:focus-visible,#sx button:focus-visible{outline:3px solid #F5B27F;outline-offset:2px}';
  function cerrar() { var e = document.getElementById('sx'); if (e) e.remove(); document.removeEventListener('keydown', esc); }
  function esc(e) { if (e.key === 'Escape') cerrar(); }
  function mostrar() {
    if (hecho || document.getElementById('ck') || Date.now() - t0 < 8000) return;
    hecho = true; try { sessionStorage.setItem(K, '1'); } catch (e) {}
    var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
    var d = document.createElement('div'); d.id = 'sx'; d.setAttribute('role', 'dialog'); d.setAttribute('aria-modal', 'true'); d.setAttribute('aria-labelledby', 'sx-t');
    var tit, txt, b1;
    if (enCalc) {
      tit = '¿Quieres que te lo afinemos?'; txt = 'Este precio es orientativo. Nos acercamos a tu casa a tomar medidas y te hacemos el presupuesto cerrado, <b>sin coste y sin compromiso</b>.';
      b1 = '<a class="p" href="/contacto">Pedir visita y medición gratis</a>';
    } else {
      tit = '¿Cuánto te costaría? Míralo en un minuto'; txt = 'Calcula el precio orientativo de tus ventanas, puertas o cerramiento con nuestra herramienta, sin dejar tus datos. Y si te encaja, <b>la visita y la medición son gratuitas</b>.';
      b1 = '<a class="p" href="/calculadora">Calcular mi presupuesto</a>';
    }
    d.innerHTML = '<div class="c"><button class="x" type="button" aria-label="Cerrar">&times;</button><span class="k">Visita y medición gratis</span><h2 id="sx-t">' + tit + '</h2><p>' + txt + '</p>' +
      '<div class="a">' + b1 + '<a class="s" href="https://wa.me/34639788220">Preguntar por WhatsApp</a></div><button class="n" type="button">No, gracias</button></div>';
    document.body.appendChild(d);
    d.querySelector('.x').onclick = cerrar; d.querySelector('.n').onclick = cerrar;
    d.onclick = function (e) { if (e.target === d) cerrar(); };
    document.addEventListener('keydown', esc);
    d.querySelector('a.p').focus();
  }
  document.addEventListener('mouseout', function (e) { if (!e.relatedTarget && e.clientY <= 0) mostrar(); });
  window.addEventListener('scroll', function () {
    var y = window.scrollY; if (y > maxY) maxY = y;
    if (matchMedia('(pointer:coarse)').matches && maxY > 600 && ultimoY - y > 120 && y < maxY * 0.5) mostrar();
    ultimoY = y;
  }, { passive: true });
})();
