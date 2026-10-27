import json, html as H
from preguntas import PREGUNTAS
from pages_new import sec, P

EMAIL = "delarubiaignacio@gmail.com"

def partes():
    out = []
    n = 0
    data = []
    for bloque, qs in PREGUNTAS:
        out.append(f'<h2 style="margin: 28px 0 4px; font-size: 22px; font-weight: 800">{H.escape(bloque)}</h2>')
        for pregunta, opts, libre in qs:
            n += 1
            data.append({"n": n, "q": pregunta, "o": bool(opts), "opc": libre == "Lo que quieras"})
            o = ""
            if opts:
                o = '<div class="qo">' + "".join(f'<label class="chip"><input type="radio" name="q{n}" value="{H.escape(x)}"><span>{H.escape(x)}</span></label>' for x in opts) + "</div>"
            t = ""
            if libre or not opts:
                ph = libre or "Tu respuesta"
                t = f'<textarea name="t{n}" rows="2" placeholder="{H.escape(ph)}"></textarea>'
            out.append(f'<div class="qb" id="qb{n}"><div class="qh"><span class="qn">{n}</span><strong>{H.escape(pregunta)}</strong></div>{o}{t}</div>')
    css = '''<style>
.qb{background:#fff;border:1px solid #DCE2E7;border-radius:10px;padding:18px;margin-top:12px}
.qh{display:flex;gap:12px;align-items:flex-start;font-size:17px;line-height:1.4}
.qn{flex:none;width:30px;height:30px;border-radius:50%;background:#C2410C;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:14px}
.qo{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px}
.chip input{position:absolute;opacity:0;pointer-events:none}
.chip span{display:inline-flex;align-items:center;min-height:44px;padding:0 16px;border:1px solid #A9B5BF;border-radius:999px;font-size:16px;cursor:pointer;background:#fff}
.chip input:checked+span{background:#12202B;color:#fff;border-color:#12202B}
.chip input:focus-visible+span{outline:3px solid #C2410C;outline-offset:2px}
.qb textarea{width:100%;margin-top:12px;border:1px solid #A9B5BF;border-radius:6px;padding:10px 12px;font:inherit;font-size:16px;resize:vertical}
.acts{display:flex;flex-wrap:wrap;gap:12px;margin-top:24px}
.acts button,.acts a{min-height:52px;padding:0 24px;border-radius:6px;border:0;background:#C2410C;color:#fff;font-weight:700;font-size:17px;cursor:pointer;text-decoration:none;display:inline-flex;align-items:center}
.acts .sec{background:#12202B}
.wa{display:none!important}
.qb.err{border-color:#B91C1C;box-shadow:0 0 0 2px #FEE2E2}
#faltan{margin-top:20px;padding:16px 18px;border:2px solid #B91C1C;background:#FEF2F2;border-radius:10px;font-size:16px;line-height:1.5;color:#7F1D1D}
#faltan a{color:#7F1D1D;font-weight:700}
#faltan ul{margin:8px 0 0;padding-left:20px}
#estado{margin-top:12px;font-size:15px;color:#4A5A68;min-height:22px}
</style>'''
    js = '''<script>
(function(){
var Q=%s;var KEY='ams-cuestionario';var EMAIL='%s';
function leer(){var r=[];Q.forEach(function(x){var o=document.querySelector('input[name="q'+x.n+'"]:checked');var t=document.querySelector('textarea[name="t'+x.n+'"]');var a=[];if(o)a.push(o.value);if(t&&t.value.trim())a.push(t.value.trim());r.push(x.n+'. '+x.q+'\\n   '+(a.length?a.join(' - '):'(sin respuesta)'));});return 'Respuestas de Javi (AMS Cerramientos)\\n\\n'+r.join('\\n\\n');}
function guardar(){try{var d={};document.querySelectorAll('input[type=radio]:checked').forEach(function(i){d[i.name]=i.value});document.querySelectorAll('textarea').forEach(function(t){d[t.name]=t.value});localStorage.setItem(KEY,JSON.stringify(d));}catch(e){}}
function cargar(){try{var d=JSON.parse(localStorage.getItem(KEY)||'{}');Object.keys(d).forEach(function(k){if(k[0]==='q'){var i=document.querySelector('input[name="'+k+'"][value="'+d[k].replace(/"/g,'\\\\"')+'"]');if(i)i.checked=true;}else{var t=document.querySelector('textarea[name="'+k+'"]');if(t)t.value=d[k];}});}catch(e){}}
function faltan(){return Q.filter(function(x){if(x.opc)return false;if(x.o){return !document.querySelector('input[name="q'+x.n+'"]:checked');}var t=document.querySelector('textarea[name="t'+x.n+'"]');return !(t&&t.value.trim());});}
function validar(){document.querySelectorAll('.qb.err').forEach(function(e){e.classList.remove('err')});var f=faltan();var box=document.getElementById('faltan');if(!box){box=document.createElement('div');box.id='faltan';box.setAttribute('role','alert');var a=document.querySelector('.acts');a.parentNode.insertBefore(box,a);}
if(!f.length){box.style.display='none';return true;}
box.style.display='block';box.innerHTML='<b>Te falta por contestar '+f.length+(f.length===1?' pregunta':' preguntas')+'.</b> Pulsa en cada una para ir a ella. Si no sabes algo, escribe "No sé".<ul>'+f.map(function(x){return '<li><a href="#qb'+x.n+'">'+x.n+'. '+x.q+'</a></li>';}).join('')+'</ul>';
f.forEach(function(x){var e=document.getElementById('qb'+x.n);if(e)e.classList.add('err');});
var e0=document.getElementById('qb'+f[0].n);box.scrollIntoView({behavior:'smooth',block:'center'});return false;}
function msg(m){document.getElementById('estado').textContent=m;}
document.addEventListener('change',guardar);document.addEventListener('input',guardar);cargar();
document.getElementById('b-send').addEventListener('click',function(){if(!validar())return;var btn=this;var t=leer();btn.disabled=true;msg('Enviando...');fetch('/api/respuestas',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({texto:t})}).then(function(r){return r.json().catch(function(){return{ok:false}})}).then(function(j){btn.disabled=false;if(j&&j.ok){msg('Enviado. Gracias, Javi: Ignacio ya lo tiene. Puedes seguir editando y volver a enviar.');}else{msg('No se ha podido enviar desde aquí. Usa "Enviar por correo" o "Copiar respuestas", que funcionan siempre.');}}).catch(function(){btn.disabled=false;msg('No se ha podido enviar desde aquí. Usa "Enviar por correo" o "Copiar respuestas", que funcionan siempre.');});});
document.getElementById('b-mail').addEventListener('click',function(){if(!validar())return;var t=leer();window.location.href='mailto:'+EMAIL+'?subject='+encodeURIComponent('Respuestas de Javi - AMS Cerramientos')+'&body='+encodeURIComponent(t);msg('Se abre tu correo con las respuestas escritas: solo tienes que pulsar enviar.');});
document.getElementById('b-copy').addEventListener('click',function(){if(!validar())return;var t=leer();if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(t).then(function(){msg('Copiado. Pégalo en un mensaje de WhatsApp a Ignacio.');},function(){msg('No se ha podido copiar. Selecciona el texto a mano.');});}else{msg('Tu navegador no deja copiar desde aquí.');}});
var s=document.getElementById('b-share');if(navigator.share){s.addEventListener('click',function(){if(!validar())return;navigator.share({title:'Respuestas de Javi - AMS',text:leer()}).catch(function(){});});}else{s.style.display='none';}
})();
</script>''' % (json.dumps(data, ensure_ascii=False), EMAIL)
    return n, css, "".join(out), js


def pagina():
    n, css, bloques, js = partes()
    body = f'''<div style="max-width: 820px; margin: 0 auto; padding: 40px 24px 72px">
<h1 style="margin: 0; font-size: clamp(28px, 6vw, 40px); line-height: 1.1; font-weight: 800">Cuestionario para Javi</h1>
<p style="font-size: 18px; line-height: 1.55; color: #4A5A68"><b>Perdona que sea tan largo:</b> sabemos que son muchas preguntas, pero este trabajo es muy importante y queremos que lo conozcas todo y que la web diga solo lo que es verdad. Son {n} preguntas cortas. Contesta todas; si no sabes algo, escribe "No sé" y ya lo averiguamos. Tus respuestas se guardan en este móvil mientras las escribes. Al final, las mandas por correo, por WhatsApp o las copias.</p>
{css}
{bloques}
<div class="acts"><button id="b-send" type="button">Enviar mis respuestas a Ignacio</button><button id="b-share" class="sec" type="button">Enviar (elige WhatsApp)</button><button id="b-mail" type="button">Enviar por correo</button><button id="b-copy" class="sec" type="button">Copiar respuestas</button></div>
<div id="estado" role="status"></div>
{js}
</div>'''
    return ("/cuestionario", "cuestionario.html", "Cuestionario para Javi | AMS Cerramientos", "Cuestionario interno para completar la web de AMS Cerramientos.", body)
