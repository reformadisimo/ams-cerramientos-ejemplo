/* Contador propio de AMS, sin cookies (el mismo que Reformadísimo y Casiopea, 31-oct-2026).
   Cuenta a todos, acepten o no las cookies: página, de dónde viene, móvil u ordenador,
   si es la primera página de la visita (entrada) y si es la primera vez hoy de este navegador
   (nuevo = una persona distinta del día). Además, el TIEMPO con la página a la vista y el REBOTE
   (visita de una sola página y menos de 10 s), mandados a /api/tiempo al ocultar la pestaña o salir.
   No viaja nada que identifique a nadie. Los robots no cuentan. Las páginas internas tampoco. */
(function () {
  var INTERNAS = /^\/(mesa|crm|mis-contactos|guia-javi|panel|lupa)(\/|\.|$)/;
  var ruta = (location.pathname.replace(/\.html$/, '').replace(/\/index$/, '/') || '/').slice(0, 150);
  if (navigator.webdriver || INTERNAS.test(ruta) || !navigator.sendBeacon) return;

  function atribucion() {
    try { var g = sessionStorage.getItem('ams-atrib'); if (g) return g; } catch (e) {}
    var f = 'directo';
    try {
      var q = new URLSearchParams(location.search);
      if (q.get('gclid') || q.get('gbraid') || q.get('wbraid')) f = 'google-ads';
      else if (q.get('fbclid')) f = 'meta';
      else if (q.get('utm_source')) f = String(q.get('utm_source')).toLowerCase().slice(0, 60);
      else if (document.referrer) {
        var h = new URL(document.referrer).hostname.replace(/^www\./, '');
        if (h && h !== location.hostname.replace(/^www\./, '')) f = h.slice(0, 60);
      }
    } catch (e) {}
    try { sessionStorage.setItem('ams-atrib', f); } catch (e) {}
    return f;
  }
  var fuente = atribucion();
  var disp = window.matchMedia && window.matchMedia('(pointer: coarse)').matches ? 'movil' : 'pc';
  function manda(url, o) { try { navigator.sendBeacon(url, JSON.stringify(o)); } catch (e) {} }

  setTimeout(function () {
    var entrada = false, nuevo = false;
    try { if (!sessionStorage.getItem('ams-visita')) { sessionStorage.setItem('ams-visita', '1'); entrada = true; } } catch (e) {}
    try {
      var hoy = new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Madrid' });
      if (localStorage.getItem('ams-dia') !== hoy) { localStorage.setItem('ams-dia', hoy); nuevo = true; }
    } catch (e) {}
    try { sessionStorage.setItem('ams-pags', String(Number(sessionStorage.getItem('ams-pags') || 0) + 1)); } catch (e) {}
    manda('/api/vista', { pagina: ruta, fuente: fuente, disp: disp, entrada: entrada, nuevo: nuevo });
  }, 1200);

  // Tiempo con la página a la vista: se acumula mientras la pestaña está visible y se manda en trozos.
  var desde = document.visibilityState === 'visible' ? Date.now() : 0, acumulado = 0, total = 0, navega = false;
  // Pasar a otra página de la web no es rebote (la web es de varias páginas, no una sola).
  document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
    if (a && a.host === location.host) navega = true;
  }, true);
  function esRebote() {
    try {
      if (navega || sessionStorage.getItem('ams-rebote')) return false;
      if (Number(sessionStorage.getItem('ams-pags') || 0) !== 1 || total >= 10) return false;
      sessionStorage.setItem('ams-rebote', '1');
      return true;
    } catch (e) { return false; }
  }
  function parar() { if (desde) { acumulado += Date.now() - desde; desde = 0; } }
  function mandar() {
    parar();
    var s = Math.round(acumulado / 1000);
    acumulado = 0; total += s;
    var rebote = esRebote();
    if (s < 1 && !rebote) return;
    manda('/api/tiempo', { pagina: ruta, fuente: fuente, disp: disp, s: s, rebote: rebote });
  }
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'visible') { if (!desde) desde = Date.now(); } else mandar();
  });
  window.addEventListener('pagehide', mandar);
})();
