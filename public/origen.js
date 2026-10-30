/* De dónde viene cada contacto (para saber qué anuncio trae trabajo).
   - Guarda cómo llegó la persona: anuncio de Google (gclid), Facebook/Instagram (fbclid), utm, página de entrada.
   - Sin permiso de cookies solo se guarda durante la visita (sessionStorage); con permiso, 60 días.
   - Cuando alguien deja nombre y teléfono en un formulario, se manda al CRM antes de abrir WhatsApp o el correo.
   - Los clics en WhatsApp y en llamar se cuentan, sin datos personales.
   - Uso desde otras herramientas: window.amsLead({nombre, telefono, correo, zona, trabajo, pide}, 'calculadora'). */
(function () {
  var K = 'ams-origen-v2', API = '/api/contacto', DIAS = 60;
  var CAMPOS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'gbraid', 'wbraid', 'fbclid'];
  function permiso() { try { var v = JSON.parse(localStorage.getItem('ams-cookies') || 'null'); return !!(v && v.medicion === true); } catch (e) { return false; } }
  function leer() {
    var t = null;
    try { t = JSON.parse(sessionStorage.getItem(K) || 'null'); } catch (e) {}
    if (!t) try { var l = JSON.parse(localStorage.getItem(K) || 'null'); if (l && Date.now() - l.t < DIAS * 864e5) t = l; } catch (e) {}
    return t;
  }
  function guardar(o) {
    try { sessionStorage.setItem(K, JSON.stringify(o)); } catch (e) {}
    if (permiso()) try { localStorage.setItem(K, JSON.stringify(o)); } catch (e) {}
  }
  var o = leer() || {}, q;
  try { q = new URLSearchParams(location.search); } catch (e) { q = null; }
  var nuevo = {};
  if (q) CAMPOS.forEach(function (c) { var v = q.get(c); if (v) nuevo[c] = v.slice(0, 300); });
  var ref = document.referrer && document.referrer.indexOf(location.host) === -1 ? document.referrer.slice(0, 300) : '';
  if (Object.keys(nuevo).length) {
    // un clic nuevo en un anuncio manda sobre lo anterior
    o = nuevo; o.pagina_entrada = location.pathname; o.referente = ref; o.t = Date.now();
    if (nuevo.fbclid) o.fbc = 'fb.1.' + Date.now() + '.' + nuevo.fbclid;
    guardar(o);
  } else if (!o.t) {
    o = { pagina_entrada: location.pathname, referente: ref, t: Date.now() };
    guardar(o);
  }
  window.addEventListener('ams-cookies', function () { if (permiso()) guardar(o); });

  function disp() { return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || (navigator.maxTouchPoints > 1 && /Macintosh/.test(navigator.userAgent)) ? 'movil' : 'ordenador'; }
  function fbp() { var m = document.cookie.match(/(?:^|;\s*)_fbp=([^;]+)/); return m ? m[1] : ''; }
  function base() {
    var d = {};
    CAMPOS.concat(['pagina_entrada', 'referente', 'fbc']).forEach(function (c) { if (o[c]) d[c] = o[c]; });
    d.pagina_envio = location.pathname; d.dispositivo = disp(); var f = fbp(); if (f) d.fbp = f;
    return d;
  }
  function enviar(cuerpo) {
    var s = JSON.stringify(cuerpo);
    try { fetch(API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: s, keepalive: true }).catch(function () {}); }
    catch (e) { try { navigator.sendBeacon(API, new Blob([s], { type: 'application/json' })); } catch (e2) {} }
  }
  // Para la calculadora, el configurador y el chat
  window.amsLead = function (datos, canal) {
    datos = datos || {};
    if (!datos.nombre || !(datos.telefono || datos.correo)) return;
    var d = base();
    ['nombre', 'telefono', 'correo', 'zona', 'trabajo', 'pide'].forEach(function (c) { if (datos[c]) d[c] = String(datos[c]).slice(0, 600); });
    d.canal = canal || 'formulario'; d.tipo = 'contacto';
    enviar(d);
  };
  window.amsOrigen = function () { return base(); };

  // Formularios con nombre y teléfono (contacto, landing, diagnóstico...): antes de abrir WhatsApp o el correo
  var TRAB = [['ventana', 'ventanas'], ['cancela', 'cancela'], ['puerta', 'puerta'], ['terraza', 'cerramiento'], ['cerramiento', 'cerramiento'], ['porche', 'cerramiento'], ['pérgola', 'pergola'], ['pergola', 'pergola']];
  document.addEventListener('submit', function (e) {
    var f = e.target; if (!f || !f.querySelector) return;
    var v = function (n) { var el = f.querySelector('[name=' + n + ']'); return el ? String(el.value || '').trim() : ''; };
    var nombre = v('nombre'), tel = v('telefono'), correo = v('correo') || v('email');
    if (!nombre || !(tel || correo)) return;
    var pc = f.querySelector('[name=privacidad]'); if (pc && !pc.checked) return;
    var serv = v('servicio'), msg = v('mensaje'), t = '', s = serv.toLowerCase();
    TRAB.forEach(function (x) { if (!t && s.indexOf(x[0]) !== -1) t = x[1]; });
    window.amsLead({ nombre: nombre, telefono: tel, correo: correo, zona: v('localidad'), trabajo: t, pide: [serv, msg].filter(Boolean).join('. ') }, 'formulario');
  }, true);

  // Clics en WhatsApp y llamar (cuántos y de qué anuncio; sin datos personales)
  var ultimo = 0;
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]'); if (!a) return;
    var h = a.getAttribute('href') || '', tipo = '';
    if (h.indexOf('tel:') === 0) tipo = 'llamada';
    else if (h.indexOf('wa.me') !== -1 || h.indexOf('api.whatsapp.com') !== -1) tipo = 'whatsapp';
    if (!tipo || Date.now() - ultimo < 3000) return;
    ultimo = Date.now();
    var d = base(); d.tipo = 'clic'; d.clic = tipo; d.pagina = location.pathname;
    enviar(d);
  }, true);
})();
