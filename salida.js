/* Aviso de salida: si el visitante se va, le ofrecemos la calculadora y recordamos que visita y medicion son gratis. */
(function () {
  var p = location.pathname.replace(/\/$/, '');
  if (/^\/(aviso-legal|privacidad|cookies|guia-javi|cuestionario|fotos-web-antigua)/.test(p)) return;
  var K = 'ams-salida';
  try { if (sessionStorage.getItem(K)) return; var _n = +localStorage.getItem('ams-salida-no') || 0; if (_n && Date.now() < _n) return; } catch (e) {}
  var enCalc = /^\/(calculadora|configurador)/.test(p), enContacto = /^\/contacto/.test(p);
  if (enContacto) return;
  var t0 = Date.now(), hecho = false, ultimoY = window.scrollY, maxY = 0;
  var css = '#sx{position:fixed;inset:0;z-index:2147482990;background:rgba(18,32,43,.66);display:flex;align-items:center;justify-content:center;padding:16px;font:16px/1.5 Inter,system-ui,sans-serif;animation:sxf .25s ease-out}' +
    '#sx .c{position:relative;background:#fff;color:#12202B;border-radius:22px;max-width:480px;width:100%;overflow:hidden;box-shadow:0 24px 70px rgba(0,0,0,.45);animation:sxu .35s cubic-bezier(.2,.8,.2,1)}' +
    '#sx .t{background:linear-gradient(135deg,#12202B,#1C3A52);color:#fff;padding:22px 26px 18px;display:flex;gap:14px;align-items:center}' +
    '#sx .ic{flex:none;width:52px;height:52px;border-radius:16px;background:linear-gradient(135deg,#FF9F1C,#FFC53D);color:#12202B;display:flex;align-items:center;justify-content:center;box-shadow:0 6px 16px rgba(255,159,28,.35)}#sx .ic svg{width:28px;height:28px}' +
    '#sx .k{display:block;color:#FFC53D;font-weight:800;font-size:12.5px;letter-spacing:.07em;text-transform:uppercase}#sx .t small{display:block;color:#C9D6E0;font-size:14px;margin-top:2px}' +
    '#sx .b{padding:22px 26px 22px}#sx h2{margin:0 0 8px;font-size:26px;line-height:1.18;font-weight:800;letter-spacing:-.01em}' +
    '#sx h2 mark{background:linear-gradient(transparent 58%,#FFD66B 58%);color:inherit;padding:0 3px}' +
    '#sx p{margin:0 0 14px;color:#33495C;font-size:16.5px}' +
    '#sx ul{list-style:none;margin:0 0 18px;padding:0;display:grid;gap:8px}#sx li{display:flex;gap:10px;align-items:flex-start;font-weight:600;font-size:15.5px}' +
    '#sx li i{flex:none;width:22px;height:22px;border-radius:50%;background:#E6F4EC;color:#1D7A4B;display:flex;align-items:center;justify-content:center;margin-top:1px}#sx li svg{width:13px;height:13px}' +
    '#sx .a{display:flex;flex-direction:column;gap:10px}#sx a.p,#sx a.s{display:flex;align-items:center;justify-content:center;gap:8px;min-height:54px;border-radius:12px;font-weight:800;font-size:17px;text-decoration:none;text-align:center;padding:0 16px}' +
    '#sx a.p{background:linear-gradient(180deg,#D9480F,#C2410C);color:#fff;box-shadow:0 8px 20px rgba(194,65,12,.38)}#sx a.p:hover{filter:brightness(1.07)}' +
    '#sx a.s{min-height:48px;font-size:15.5px;border:2px solid #CFE3D6;background:#F1F9F4;color:#14532D}#sx a.s svg,#sx a.p svg{width:20px;height:20px}' +
    '#sx .x{position:absolute;top:10px;right:10px;width:44px;height:44px;border:0;border-radius:50%;background:rgba(255,255,255,.14);font-size:28px;line-height:1;cursor:pointer;color:#fff}#sx .x:hover{background:rgba(255,255,255,.28)}' +
    '#sx .n{display:block;margin:12px auto 0;background:none;border:0;color:#5C6F82;text-decoration:underline;cursor:pointer;font:inherit;font-size:15px;min-height:40px}' +
    '#sx .g{margin:14px 0 0;padding-top:12px;border-top:1px solid #EDF1F4;text-align:center;color:#5C6F82;font-size:13.5px}' +
    '#sx a:focus-visible,#sx button:focus-visible{outline:3px solid #F5B27F;outline-offset:2px}' +
    '@keyframes sxf{from{opacity:0}to{opacity:1}}@keyframes sxu{from{opacity:0;transform:translateY(22px) scale(.97)}to{opacity:1;transform:none}}' +
    '@media(prefers-reduced-motion:reduce){#sx,#sx .c{animation:none}}html.lec-a #sx,html.lec-a #sx .c{animation:none}' +
    '@media(max-width:480px){#sx{align-items:flex-end;padding:0}#sx .c{border-radius:22px 22px 0 0;max-height:94vh;overflow:auto}#sx h2{font-size:23px}#sx .t,#sx .b{padding-left:20px;padding-right:20px}}';
  function cerrar() { try { localStorage.setItem('ams-salida-no', String(Date.now() + 3 * 864e5)); } catch (x) {} var e = document.getElementById('sx'); if (e) e.remove(); document.removeEventListener('keydown', esc); }
  function esc(e) { if (e.key === 'Escape') cerrar(); }
  function mostrar() {
    if (hecho || document.getElementById('ck') || document.querySelector('#asp.open,#asp[data-open],#asp.on') || Date.now() - t0 < 8000 || (document.getElementById('lec-panel') && !document.getElementById('lec-panel').hidden)) return;
    hecho = true; try { sessionStorage.setItem(K, '1'); } catch (e) {}
    var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
    var d = document.createElement('div'); d.id = 'sx'; d.setAttribute('role', 'dialog'); d.setAttribute('aria-modal', 'true'); d.setAttribute('aria-labelledby', 'sx-t');
    var tit, txt, b1, tag = 'Presupuesto gratis y sin compromiso', it, ico = 'doc';
    var wa = 'https://wa.me/34639788220?text=' + encodeURIComponent('Hola, AMS Cerramientos. Estaba mirando vuestra web (' + (p || '/') + ') y me gustaría pedir presupuesto.');
    var II = {
      doc: '<path d="M7 3h8l4 4v14H7z"/><path d="M15 3v4h4M10 12h6M10 16h6"/>',
      calc: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8M8 12h2M12 12h2M16 12h0M8 16h2M12 16h2M16 16h0"/>',
      home: '<path d="M3 11l9-8 9 8M5 10v10h14V10"/><path d="M10 20v-6h4v6"/>'
    };
    var OK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
    var FL = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
    var WS = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20l1.3-4.2A8 8 0 1 1 8.4 18.8z"/></svg>';
    if (enCalc) {
      tit = '¿Quieres que te lo <mark>afinemos</mark>?'; txt = 'Este precio es orientativo. El equipo de AMS te prepara el presupuesto cerrado, por escrito.';
      it = ['Visita y medición gratis', 'Precio cerrado, sin sorpresas', 'Sin compromiso']; ico = 'calc';
      b1 = '<a class="p" href="/contacto">Pedir presupuesto gratis ' + FL + '</a>';
    } else if (/^\/(cerramientos-terrazas|techos|pergolas|toldos|persianas-cristales)/.test(p) || /precio-cerrar-terraza|cerrar-terraza/.test(p)) {
      tit = '¿Cuánto costaría <mark>cerrar tu terraza</mark>?'; txt = 'Calcula un precio orientativo en un minuto. Si te encaja, pides presupuesto sin compromiso.';
      it = ['Precio orientativo en un minuto', 'Sin dejar tus datos', 'Visita y medición gratis']; ico = 'home';
      b1 = '<a class="p" href="/calculadora">Calcular el precio de mi terraza ' + FL + '</a>';
    } else if (/^\/(cancelas-puertas|rejas|automatismos|reparaciones|comunidades)/.test(p)) {
      tit = '¿Qué precio <mark>orientativo</mark> tendría?'; txt = 'Calcúlalo en un minuto y luego pide un presupuesto cerrado, sin compromiso.';
      it = ['Precio orientativo en un minuto', 'Sin dejar tus datos', 'Visita y medición gratis']; ico = 'calc';
      b1 = '<a class="p" href="/calculadora">Calcular mi presupuesto ' + FL + '</a>';
    } else if (/^\/glosario/.test(p)) {
      tit = '¿Tu presupuesto lleva palabras que <mark>no entiendes</mark>?'; txt = 'Mándanoslo y te lo traducimos a lenguaje normal, sin compromiso.';
      it = ['Qué incluye de verdad', 'Qué le falta', 'Si el precio es razonable']; ico = 'doc'; tag = 'Revisión gratuita';
      b1 = '<a class="p" href="/revisa-tu-presupuesto">Revisar mi presupuesto ' + FL + '</a>';
    } else if (/^\/blog/.test(p) || /^\/(garantia|financiacion|como-medir|permisos)/.test(p)) {
      tit = '¿Ya tienes un presupuesto de <mark>otra empresa</mark>?'; txt = 'Revísalo gratis antes de decidir. Te decimos lo que no se ve a simple vista.';
      it = ['Qué incluye de verdad', 'Qué le falta', 'Si el precio es razonable']; ico = 'doc'; tag = 'Revisión gratuita';
      b1 = '<a class="p" href="/revisa-tu-presupuesto">Revisar mi presupuesto ' + FL + '</a>';
    } else if (/^\/(ventanas|acabados)/.test(p) || /^\/(alcala|torrejon|villalbilla|coslada|meco|azuqueca|guadalajara|madrid)/.test(p)) {
      tit = 'Configura tus ventanas y mira el <mark>precio</mark>'; txt = 'Elige medidas, material y color y ve un precio orientativo al momento.';
      it = ['Precio al instante, sin dejar tus datos', 'Presupuesto cerrado por escrito', 'Visita y medición gratis']; ico = 'home';
      b1 = '<a class="p" href="/configurador">Configurar mis ventanas ' + FL + '</a>';
    } else {
      tit = '¿Cuánto te costaría? <mark>Míralo en un minuto</mark>'; txt = 'Calcula el precio orientativo de tus ventanas, puertas o cerramiento, sin dejar tus datos.';
      it = ['Precio orientativo en un minuto', 'Sin dejar tus datos', 'Visita y medición gratis']; ico = 'calc';
      b1 = '<a class="p" href="/calculadora">Calcular mi presupuesto ' + FL + '</a>';
    }
    d.innerHTML = '<div class="c"><div class="t"><span class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + II[ico] + '</svg></span><div><span class="k">' + tag + '</span><small>AMS Cerramientos · Villalbilla</small></div><button class="x" type="button" aria-label="Cerrar">&times;</button></div>' +
      '<div class="b"><h2 id="sx-t">' + tit + '</h2><p>' + txt + '</p><ul>' + it.map(function (x) { return '<li><i>' + OK + '</i>' + x + '</li>'; }).join('') + '</ul>' +
      '<div class="a">' + b1 + '<a class="s" href="' + wa + '">' + WS + 'Prefiero preguntar por WhatsApp</a></div><button class="n" type="button">Ahora no, gracias</button>' +
      '<p class="g">Visita y medición gratis · Presupuesto cerrado por escrito</p></div></div>';
    document.body.appendChild(d);
    d.querySelector('.x').onclick = cerrar; d.querySelector('.n').onclick = cerrar;
    d.onclick = function (e) { if (e.target === d) cerrar(); };
    document.addEventListener('keydown', esc);
    d.querySelector('a.p').focus();
    [].forEach.call(d.querySelectorAll('a.p,a.s'), function (a) { a.addEventListener('click', function () { try { localStorage.setItem('ams-salida-no', String(Date.now() + 14 * 864e5)); } catch (x) {} }); });
  }
  /* Lector interesado: tras 45 s y mitad de la pagina leida, en vez de esperar a que se vaya. */
  setTimeout(function () { var h = document.documentElement; if ((window.scrollY + innerHeight) / h.scrollHeight > .5) mostrar(); }, 45000);
  document.addEventListener('mouseout', function (e) { if (!e.relatedTarget && e.clientY <= 0) mostrar(); });
  var sube = 0;
  window.addEventListener('scroll', function () {
    var y = window.scrollY; if (y > maxY) maxY = y;
    if (y < ultimoY) sube += ultimoY - y; else sube = 0;
    if (matchMedia('(pointer:coarse)').matches && maxY > 600 && sube > 180 && y < maxY * 0.6) mostrar();
    ultimoY = y;
  }, { passive: true });
})();
