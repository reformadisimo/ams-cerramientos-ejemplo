# Ajustes de lectura: boton "Aa" en la barra superior (tamano, letra legible, interlineado, contraste, parar animaciones).
BTN = ('<button type="button" class="lec-btn" id="lec-btn" aria-haspopup="dialog" aria-expanded="false" aria-controls="lec-panel" aria-label="Ajustes de lectura">'
       '<span aria-hidden="true">A<small>a</small></span></button>')

PANEL = r'''<div id="lec-ov" hidden></div>
<div id="lec-panel" role="dialog" aria-modal="false" aria-labelledby="lec-t" hidden>
<div class="lec-h"><div><b id="lec-t">Ajustes de lectura</b><small>Para leer más a gusto. Se guarda en este dispositivo.</small></div><button type="button" id="lec-x" aria-label="Cerrar">&times;</button></div>
<div class="lec-row"><span>Tamaño del texto</span><div class="lec-sz"><button type="button" id="lec-m" aria-label="Texto más pequeño">A&minus;</button><b id="lec-n" aria-live="polite">100 %</b><button type="button" id="lec-p" aria-label="Texto más grande">A+</button></div></div>
<button type="button" class="lec-sw" role="switch" aria-checked="false" data-k="f"><span>Letra más fácil de leer</span><i></i></button>
<button type="button" class="lec-sw" role="switch" aria-checked="false" data-k="l"><span>Más espacio entre líneas</span><i></i></button>
<button type="button" class="lec-sw" role="switch" aria-checked="false" data-k="c"><span>Más contraste</span><i></i></button>
<button type="button" class="lec-sw" role="switch" aria-checked="false" data-k="a"><span>Parar animaciones y vídeos</span><i></i></button>
<button type="button" id="lec-r">Restablecer todo</button>
</div>
<style>
.lec-btn{flex:none;display:inline-flex;align-items:center;justify-content:center;width:44px;height:44px;border-radius:10px;border:1px solid rgba(255,255,255,.35);background:transparent;color:#fff;font:700 19px/1 Inter,sans-serif;cursor:pointer}
.lec-btn small{font-size:13px;font-weight:700}.lec-btn:hover,.lec-btn[aria-expanded=true]{background:#fff;color:#12202B}
#lec-ov{position:fixed;inset:0;z-index:2147482998;background:rgba(18,32,43,.35)}
#lec-panel{position:fixed;z-index:2147482999;top:76px;right:16px;width:340px;max-width:calc(100vw - 24px);background:#fff;color:#12202B;border-radius:18px;box-shadow:0 18px 50px rgba(18,32,43,.35);padding:16px 16px 14px;font:16px/1.4 Inter,sans-serif;max-height:calc(100vh - 96px);overflow:auto}
#lec-panel[hidden],#lec-ov[hidden]{display:none}
.lec-h{display:flex;justify-content:space-between;gap:10px;align-items:flex-start;margin-bottom:10px}.lec-h b{display:block;font-size:19px}.lec-h small{display:block;color:#5C6F82;font-size:13.5px;margin-top:2px}
#lec-x{flex:none;width:40px;height:40px;border-radius:50%;border:0;background:#F5ECE2;color:#12202B;font-size:26px;line-height:1;cursor:pointer}
.lec-row{display:flex;justify-content:space-between;align-items:center;gap:10px;padding:10px 0;border-top:1px solid #EADFD2;font-weight:600}
.lec-sz{display:flex;align-items:center;gap:8px}.lec-sz button{width:48px;height:44px;border-radius:12px;border:2px solid #12202B;background:#fff;color:#12202B;font:700 17px Inter,sans-serif;cursor:pointer}
.lec-sz button:hover{background:#12202B;color:#fff}.lec-sz b{min-width:52px;text-align:center}
.lec-sw{display:flex;justify-content:space-between;align-items:center;gap:12px;width:100%;min-height:52px;padding:8px 0;border:0;border-top:1px solid #EADFD2;background:none;color:#12202B;font:600 16px Inter,sans-serif;text-align:left;cursor:pointer}
.lec-sw i{flex:none;position:relative;width:50px;height:30px;border-radius:999px;background:#C9D2D9;transition:background .15s}
.lec-sw i:after{content:"";position:absolute;top:3px;left:3px;width:24px;height:24px;border-radius:50%;background:#fff;box-shadow:0 1px 3px rgba(0,0,0,.3);transition:left .15s}
.lec-sw[aria-checked=true] i{background:#D9694D}.lec-sw[aria-checked=true] i:after{left:23px}
#lec-r{margin-top:8px;width:100%;min-height:46px;border-radius:12px;border:2px solid #D9694D;background:#FCEBE4;color:#A8442C;font:700 15px Inter,sans-serif;cursor:pointer}
#lec-panel button:focus-visible,.lec-btn:focus-visible{outline:3px solid #F2C14E;outline-offset:2px}
@media(max-width:600px){#lec-panel{top:auto;bottom:0;left:0;right:0;width:auto;max-width:none;border-radius:22px 22px 0 0;max-height:78vh;padding-bottom:calc(16px + env(safe-area-inset-bottom))}}
html.lec-f body,html.lec-f body *:not(svg):not(svg *):not(i):not(.mi){font-family:Verdana,"Atkinson Hyperlegible",Tahoma,Arial,sans-serif!important;letter-spacing:.015em!important;word-spacing:.06em!important}
html.lec-l p,html.lec-l li,html.lec-l td,html.lec-l dd,html.lec-l summary{line-height:1.95!important}
html.lec-l h1,html.lec-l h2,html.lec-l h3{line-height:1.35!important}
html.lec-c a{text-decoration:underline!important;text-underline-offset:3px}
html.lec-c p,html.lec-c li,html.lec-c td{font-weight:500}
html.lec-a *,html.lec-a *:before,html.lec-a *:after{animation:none!important;transition:none!important;scroll-behavior:auto!important}
</style>
<script>(function(){
var K="ams_lectura",d=document.documentElement,S={z:0,f:0,l:0,c:0,a:0};
try{var g=JSON.parse(localStorage.getItem(K)||"{}");for(var k in S)if(typeof g[k]==="number")S[k]=g[k]}catch(e){}
function save(){try{localStorage.setItem(K,JSON.stringify(S))}catch(e){}}
function lum(c){var m=c.match(/[\d.]+/g);if(!m)return null;var a=m.length>3?+m[3]:1;if(a<.05)return null;var v=[+m[0],+m[1],+m[2]].map(function(x){x/=255;return x<=.03928?x/12.92:Math.pow((x+.055)/1.055,2.4)});return .2126*v[0]+.7152*v[1]+.0722*v[2]}
function bgOf(el){while(el&&el.nodeType===1){var s=getComputedStyle(el);if(s.backgroundImage&&s.backgroundImage!=="none")return .02;var l=lum(s.backgroundColor);if(l!==null)return l;el=el.parentElement}return 1}
function ratio(a,b){var h=Math.max(a,b),l=Math.min(a,b);return(h+.05)/(l+.05)}
function contrast(on){var els=document.querySelectorAll("body p,body li,body td,body th,body h1,body h2,body h3,body h4,body a,body span,body label,body small,body strong,body em,body summary,body dd,body dt");
if(!on){els.forEach(function(e){if(e.hasAttribute("data-lec")){e.style.removeProperty("color");e.removeAttribute("data-lec")}});return}
els.forEach(function(e){if(e.closest("#lec-panel")||!e.textContent.trim())return;var s=getComputedStyle(e),cl=lum(s.color);if(cl===null)return;var bl=bgOf(e);if(ratio(cl,bl)<7){e.style.setProperty("color",bl>.4?"#000":"#fff","important");e.setAttribute("data-lec","1")}})}
function media(on){document.querySelectorAll("video").forEach(function(v){if(on){v.pause()}else{try{var p=v.play();if(p&&p.catch)p.catch(function(){})}catch(e){}}})}
var FAC=[1,1.12,1.25,1.4],done=-1;
function scaleText(){if(done===S.z)return;done=S.z;
var els=[].slice.call(document.querySelectorAll("body *")).filter(function(e){if(/^(SCRIPT|STYLE|SVG|PATH|NOSCRIPT|VIDEO|IMG|BR|HR|INPUT|SOURCE|I)$/i.test(e.tagName)||e.closest("#lec-panel,#lec-ov,.site-header,#gbar,#as-root,#asp,#asb,[class*=asw]"))return false;
for(var i=0;i<e.childNodes.length;i++){if(e.childNodes[i].nodeType===3&&e.childNodes[i].textContent.trim())return true}return false});
els.forEach(function(e){if(e.getAttribute("data-lf")===null){e.setAttribute("data-lf",parseFloat(getComputedStyle(e).fontSize));e.setAttribute("data-lfo",e.style.fontSize||"")}});
els.forEach(function(e){var o=parseFloat(e.getAttribute("data-lf"));if(S.z===0){e.style.removeProperty("font-size");var q=e.getAttribute("data-lfo");if(q)e.style.fontSize=q}else e.style.setProperty("font-size",(o*FAC[S.z]).toFixed(2)+"px","important")})}
function apply(init){
scaleText();
d.classList.toggle("lec-f",!!S.f);d.classList.toggle("lec-l",!!S.l);d.classList.toggle("lec-c",!!S.c);d.classList.toggle("lec-a",!!S.a);
var n=document.getElementById("lec-n");if(n)n.textContent=[100,112,125,140][S.z]+" %";
document.querySelectorAll(".lec-sw").forEach(function(b){b.setAttribute("aria-checked",S[b.getAttribute("data-k")]?"true":"false")});
var m=document.getElementById("lec-m"),p=document.getElementById("lec-p");if(m)m.disabled=S.z<=0;if(p)p.disabled=S.z>=3;
if(m)m.style.opacity=S.z<=0?.4:1;if(p)p.style.opacity=S.z>=3?.4:1;
if(!init||S.c)contrast(!!S.c);if(!init||S.a)media(!!S.a)}
function boot(){
var b=document.getElementById("lec-btn"),pn=document.getElementById("lec-panel"),ov=document.getElementById("lec-ov");if(!b||!pn)return;document.body.appendChild(ov);document.body.appendChild(pn);
function open(){pn.hidden=false;ov.hidden=false;b.setAttribute("aria-expanded","true");var f=document.getElementById("lec-x");if(f)f.focus()}
function close(){pn.hidden=true;ov.hidden=true;b.setAttribute("aria-expanded","false");b.focus()}
b.addEventListener("click",function(){pn.hidden?open():close()});document.getElementById("lec-x").addEventListener("click",close);ov.addEventListener("click",close);
document.addEventListener("keydown",function(e){if(e.key==="Escape"&&!pn.hidden)close()});
document.getElementById("lec-m").addEventListener("click",function(){if(S.z>0){S.z--;save();apply()}});
document.getElementById("lec-p").addEventListener("click",function(){if(S.z<3){S.z++;save();apply()}});
document.querySelectorAll(".lec-sw").forEach(function(s){s.addEventListener("click",function(){var k=s.getAttribute("data-k");S[k]=S[k]?0:1;save();apply()})});
document.getElementById("lec-r").addEventListener("click",function(){var had=S.c;S={z:0,f:0,l:0,c:0,a:0};save();apply();if(had)contrast(false);media(false)});
apply(true)}
apply(true);
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",function(){boot();apply(true)});else boot();
window.addEventListener("load",function(){if(S.z>0){done=-1;scaleText()}if(S.c)contrast(true);if(S.a)media(true)})
})();</script>'''
