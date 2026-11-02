/* Medicion de visitas de AMS Cerramientos con Google Analytics 4 y Microsoft Clarity.
   Reglas:
   - No se carga NADA de Google hasta que la persona acepta las cookies de medicion.
   - Solo funciona en el dominio real (amscerramientos.es): en pruebas y demos no manda datos.
   - El ID de medicion esta en un unico sitio: la constante ID. */
(function () {
  var ID = 'G-7QY0HN6E06';
  var CLARITY = 'z7cv1h5ti3';
  var HOSTS = ['amscerramientos.es', 'www.amscerramientos.es'];
  var KEY = 'ams-cookies';
  var cargado = false;

  function permitido() {
    try { var v = JSON.parse(localStorage.getItem(KEY) || 'null'); return !!(v && v.medicion === true); } catch (e) { return false; }
  }
  function enDominioReal() { return HOSTS.indexOf(location.hostname) !== -1; }

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }

  function cargar() {
    if (cargado || !enDominioReal() || !permitido()) return;
    cargado = true;
    var s = document.createElement('script');
    s.async = true; s.src = 'https://www.googletagmanager.com/gtag/js?id=' + ID;
    document.head.appendChild(s);
    gtag('js', new Date());
    gtag('config', ID, { anonymize_ip: true, allow_google_signals: false, allow_ad_personalization_signals: false });
    // Microsoft Clarity (mapas de calor y grabaciones), proyecto «AMS Cerramientos» (2-nov-2026). Mismas reglas: con permiso y en el dominio real.
    (function (c, l, a, r, i, t, y) {
      c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
      t = l.createElement(r); t.async = 1; t.src = 'https://www.clarity.ms/tag/' + i;
      y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
    })(window, document, 'clarity', 'script', CLARITY);
    try { window.clarity('consent'); } catch (e) {}
  }

  /* Evento propio: window.amsEvento('nombre', {parametros}). Si no hay permiso o no es el dominio real, no hace nada. */
  window.amsEvento = function (nombre, params) {
    if (!cargado) return;
    gtag('event', nombre, params || {});
  };

  /* Llamadas, WhatsApp y correo: se detectan por el enlace, sin tocar cada pagina. */
  document.addEventListener('click', function (e) {
    if (!cargado) return;
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a) return;
    var h = a.getAttribute('href') || '';
    var base = { pagina: location.pathname };
    if (h.indexOf('tel:') === 0) window.amsEvento('click_call', { telefono: h.replace('tel:', ''), pagina: base.pagina });
    else if (h.indexOf('wa.me') !== -1 || h.indexOf('api.whatsapp.com') !== -1) window.amsEvento('click_whatsapp', base);
    else if (h.indexOf('mailto:') === 0) window.amsEvento('click_email', base);
  }, true);

  /* Formularios: se avisa al enviar. El texto escrito nunca se manda. */
  document.addEventListener('submit', function (e) {
    if (!cargado) return;
    var f = e.target;
    if (!f || !f.id) return;
    window.amsEvento('form_submit', { formulario: f.id, pagina: location.pathname });
  }, true);

  window.addEventListener('ams-cookies', cargar);
  cargar();
})();
