/* Botón «Volver a la guía» para Javi. Sale en las páginas privadas que le enseñamos desde la guía,
   y en cualquier página de la web si ha pasado antes por la guía en este navegador (marca ams-guia).
   Un cliente normal nunca lo ve: no pasa por la guía. */
(function () {
  try {
    var p = location.pathname.replace(/\/+$/, '') || '/';
    var guia = p === '/guia-javi' || p === '/guia-javi.html';
    var ls = null; try { ls = window.localStorage; } catch (e) {}
    if (p.indexOf('/guia-javi') === 0) { try { ls && ls.setItem('ams-guia', '1'); } catch (e) {} }
    if (guia) return;
    var privada = /^\/(todo-es-tuyo|conoce-tu-cliente|correos-ejemplo|linkedin-ams|conversaciones|fotos-web-antigua|mapa-de-obras|informes|mesa)(\/|-|\.|$)/.test(p) ||
      (p.indexOf('/guia-javi/') === 0 && p.indexOf('/guia-javi/crm-movil') !== 0);
    var marca = false; try { marca = !!(ls && ls.getItem('ams-guia')); } catch (e) {}
    if (!privada && !marca) return;
    if (document.getElementById('ams-vg')) return;
    var st = document.createElement('style');
    st.textContent = '#ams-vgt{position:fixed;left:12px;bottom:96px;z-index:2147483000;display:none;align-items:center;gap:10px;background:#0A8F4E;color:#fff!important;font:700 19px/1.1 Arial,Helvetica,sans-serif;text-decoration:none;padding:16px 24px;border-radius:999px;border:2px solid #fff;box-shadow:0 6px 18px rgba(0,0,0,.3)}#ams-vgt:hover{background:#087a42}#ams-vgt svg{width:24px;height:24px;flex:none}@media print{#ams-vgt{display:none}}#ams-vg{position:fixed;left:12px;bottom:44px;z-index:2147483000;display:inline-flex;align-items:center;gap:8px;background:#1f6fb2;color:#fff!important;font:700 16px/1.1 Arial,Helvetica,sans-serif;text-decoration:none;padding:13px 18px;border-radius:999px;border:2px solid #fff;box-shadow:0 6px 18px rgba(0,0,0,.3)}#ams-vg:hover{background:#185a93}#ams-vg svg{width:20px;height:20px;flex:none}@media print{#ams-vg{display:none}}';
    document.head.appendChild(st);
    var a = document.createElement('a');
    a.id = 'ams-vg'; a.href = '/guia-javi';
    a.setAttribute('aria-label', 'Volver a la guía');
    a.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5"/><path d="M12 5l-7 7 7 7"/></svg>Volver a la guía';
    document.body.appendChild(a);
    /* Tareas pendientes: solo si quedan (las mismas que cuenta la guía) */
    try {
      fetch('/estado-guia.json', { cache: 'no-store' }).then(function (r) { return r.json(); }).then(function (d) {
        var H = []; try { H = JSON.parse((ls && ls.getItem('ams-th')) || '[]'); } catch (e) {}
        var k = (d.tareas || []).filter(function (x) { return !x.hecho && H.indexOf((x.t || '').slice(0, 40)) < 0; }).length;
        if (!k) return;
        var t = document.createElement('a');
        t.id = 'ams-vgt'; t.href = '/guia-javi#tareas';
        t.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 11l3 3 8-8"/><path d="M20 12v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h9"/></svg>Tareas pendientes';
        t.style.display = 'inline-flex';
        document.body.appendChild(t);
      }).catch(function () {});
    } catch (e) {}
  } catch (e) {}
})();
