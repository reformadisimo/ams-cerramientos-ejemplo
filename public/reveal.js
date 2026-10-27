/* Las secciones se van abriendo al desplazarte (movil y PC). Solo opacidad y un desplazamiento corto. Respeta "reducir movimiento" y los ajustes de lectura (parar animaciones). */
(function () {
  try {
    if (!('IntersectionObserver' in window)) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var h = document.documentElement;
    if (h.classList.contains('lec-a')) return;
    var main = document.querySelector('main');
    if (!main || document.querySelector('.cl')) return;
    var st = document.createElement('style');
    st.textContent = '.rv0{opacity:0;transform:translateY(28px);transition:opacity .75s ease,transform .75s cubic-bezier(.2,.7,.2,1)}.rv1{opacity:1;transform:none}.lec-a .rv0{opacity:1!important;transform:none!important;transition:none!important}@media print{.rv0{opacity:1!important;transform:none!important}}';
    document.head.appendChild(st);
    var vh = innerHeight, els = [];
    main.querySelectorAll('section').forEach(function (s) {
      if (s.parentElement && s.parentElement.closest('section')) return; // solo secciones de primer nivel
      if (s.getBoundingClientRect().top < vh * 0.85 && scrollY < 50) return; // lo que ya se ve al cargar, quieto
      els.push(s);
    });
    var io = new IntersectionObserver(function (a) {
      a.forEach(function (x) {
        if (x.isIntersecting) { x.target.classList.add('rv1'); io.unobserve(x.target); }
      });
    }, { threshold: 0, rootMargin: '0px 0px -8% 0px' });
    els.forEach(function (s) { s.classList.add('rv0'); io.observe(s); });
    var tm;
    function barrido() {
      els.forEach(function (s) { if (!s.classList.contains('rv1') && s.getBoundingClientRect().top < innerHeight) { s.classList.add('rv1'); io.unobserve(s); } });
    }
    addEventListener('scroll', function () { clearTimeout(tm); tm = setTimeout(barrido, 180); }, { passive: true });
    setTimeout(barrido, 1500);
    addEventListener('beforeprint', function () { els.forEach(function (s) { s.classList.add('rv1'); }); });
  } catch (e) {}
})();
