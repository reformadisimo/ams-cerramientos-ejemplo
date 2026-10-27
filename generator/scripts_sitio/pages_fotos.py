import json, html as H
B = "https://amscerramientos.es/wp-content/uploads/"
G = [
 ("Obras y trabajos (lo que más puede valer)", [
  ("2015/06/1-260x170.jpg","Cancelas de aluminio (galería)"),
  ("2015/04/foto02-260x170.jpg","Cerramientos (galería)"),
  ("2015/04/rejas_08-e1429884660683.jpg","Rejas (galería)"),
  ("2015/02/Cerramiento_AL_6.jpg","Cerramiento de aluminio"),
  ("2018/10/Cerramiento-de-aluminio-en-Alcala-de-Henares.jpg","Cerramiento en Alcalá de Henares"),
  ("2024/01/trabajando-cerramiento-aluminio-techo-jpg.webp","Trabajando en cerramiento de techo"),
  ("2024/01/Casa-Sostenibilidad-y-eficiencia-energetica-jpg.webp","Casa, eficiencia energética"),
  ("2015/04/ALUMINIO_SOLDADO.jpg","Aluminio soldado"),
  ("2026/07/Cancelas-de-aluminio-soldado-en-Madrid.jpg","Cancelas de aluminio soldado"),
  ("2019/05/cancela-aluminio-soldado-efecto-gris.jpeg","Cancela efecto gris"),
  ("2015/04/rejas_03-300x300.jpg","Reja modelo Forja"),
  ("2015/04/rejasm_02-300x300.jpg","Reja modelo Mallorquina"),
  ("2015/05/persiana-300x300.jpg","Persianas"),
 ]),
 ("Cabeceras de la web antigua", [
  ("2015/02/DSCF1684-960x340.jpg","Puertas de aluminio"),
  ("2024/01/AMS-Cerramientos-Ventanas-Pergolas-Toldos-Aluminio-PVC-960x340.webp","Ventanas, pérgolas y toldos"),
  ("2015/03/Cristal_Ahorro_Energetico-960x340.jpg","Cristal de ahorro energético"),
  ("2015/03/Calidad_Destacado-960x340.jpg","Acabados y calidades"),
  ("2015/04/Automatización_puertas_cancelas_Corredera-960x340.jpg","Automatización de puertas y cancelas"),
  ("2015/03/VENTANAS_ALUMINIO-960x340_Calidades-960x340.jpg","Ventanas de aluminio"),
  ("2023/06/KOMMERLING-Ventanas-PVC_001-960x340.webp","Ventanas PVC Kömmerling"),
  ("2024/01/Instalador-Pergolas-Alcala-de-Henares-960x340.webp","Pérgolas en Alcalá"),
 ]),
 ("Imágenes de la web de 2026", [
  ("2026/07/Cancelas-de-Aluminio-Madrid.png","Cancelas de aluminio"),
  ("2026/07/Cerramientos-de-Aluminio-Madrid.png","Cerramientos de aluminio"),
  ("2026/07/Aacristalamiento-termico-Madrid.png","Acristalamiento térmico"),
  ("2026/08/Ventanas-oscilobatientes-en-Alcala-de-Henares-130x130.jpeg","Ventanas oscilobatientes"),
  ("2026/08/Cerramientos-de-terrazas-2026-130x130.jpeg","Cerramientos de terrazas"),
 ]),
 ("Producto y sistemas", [
  ("2023/05/sistema_ventanas_kommerling_76_con_junta_central-300x300.png","Kömmerling 76 MD Xtrem"),
  ("2023/05/KOMMERLING76-AD-Xtrem-300x300.png","Kömmerling 76 AD Xtrem"),
  ("2023/05/SISTEMA-EUROFUTUR-ELEGANCE.jpg","Sistema Eurofutur Elegance"),
  ("2023/05/Los-sistemas-KOMMERLING-esconden-todo-un-mundo-de-posibilidades.png","Sistemas Kömmerling"),
  ("2015/03/Colores_Ventanas_Aluminio_PVC.png","Colores de ventanas"),
 ]),
 ("Otros", [
  ("2022/05/BANNER_Promocion_Ventanas.png","Banner de promoción"),
  ("2024/01/mapa_situacion_AMS.jpg","Mapa de situación"),
 ]),
]
def pagina():
    out=[];data=[];n=0
    for t,items in G:
        out.append(f'<h2 style="margin:32px 0 6px;font-size:22px;font-weight:800">{H.escape(t)}</h2><div class="gal">')
        for f,c in items:
            n+=1;data.append({"n":n,"c":c,"f":f.split("/")[-1]})
            out.append(f'<div class="fph"><a href="{B}{f}" target="_blank" rel="noopener"><img src="{B}{f}" loading="lazy" alt="{H.escape(c)}"></a><div class="pc"><b>{n}. {H.escape(c)}</b><div class="qo"><label class="chip"><input type="radio" name="q{n}" value="Usar"><span>Usar</span></label><label class="chip"><input type="radio" name="q{n}" value="Quizá"><span>Quizá</span></label><label class="chip"><input type="radio" name="q{n}" value="No"><span>No</span></label></div></div></div>')
        out.append('</div>')
    css='''<style>
.gal{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:14px;margin-top:12px}
.fph{background:#fff;border:1px solid #DCE2E7;border-radius:10px;overflow:hidden}
.fph img{width:100%;height:170px;object-fit:cover;display:block;background:#EEF1F4}
.pc{padding:12px;font-size:15px}
.qo{display:flex;gap:6px;margin-top:8px}
.chip input{position:absolute;opacity:0;pointer-events:none}
.chip span{display:inline-flex;align-items:center;min-height:40px;padding:0 14px;border:1px solid #A9B5BF;border-radius:999px;font-size:15px;cursor:pointer;background:#fff}
.chip input:checked+span{background:#12202B;color:#fff;border-color:#12202B}
.acts{display:flex;flex-wrap:wrap;gap:12px;margin-top:24px}
.acts button{min-height:52px;padding:0 24px;border-radius:6px;border:0;background:#C2410C;color:#fff;font-weight:700;font-size:17px;cursor:pointer}
.acts .sec{background:#12202B}
.wa{display:none!important}
#estado{margin-top:12px;font-size:15px;color:#4A5A68;min-height:22px}
</style>'''
    js='''<script>
(function(){var Q=%s,KEY='ams-fotos';
function leer(){var u=[],q=[],r=[];Q.forEach(function(x){var o=document.querySelector('input[name="q'+x.n+'"]:checked');if(!o)return;var l=x.n+'. '+x.c+' ('+x.f+')';if(o.value==='Usar')u.push(l);else if(o.value==='Quizá')q.push(l);else r.push(x.n);});return 'Fotos de la web antigua de AMS\\n\\nUSAR:\\n'+(u.join('\\n')||'-')+'\\n\\nQUIZA:\\n'+(q.join('\\n')||'-')+'\\n\\nDescartadas (numeros): '+(r.join(', ')||'-');}
function guardar(){try{var d={};document.querySelectorAll('input:checked').forEach(function(i){d[i.name]=i.value});localStorage.setItem(KEY,JSON.stringify(d));}catch(e){}}
function cargar(){try{var d=JSON.parse(localStorage.getItem(KEY)||'{}');Object.keys(d).forEach(function(k){var i=document.querySelector('input[name="'+k+'"][value="'+d[k]+'"]');if(i)i.checked=true;});}catch(e){}}
function msg(m){document.getElementById('estado').textContent=m;}
document.addEventListener('change',guardar);cargar();
document.getElementById('b-mail').addEventListener('click',function(){window.location.href='mailto:%s?subject='+encodeURIComponent('Fotos elegidas - AMS')+'&body='+encodeURIComponent(leer());});
document.getElementById('b-copy').addEventListener('click',function(){if(navigator.clipboard){navigator.clipboard.writeText(leer()).then(function(){msg('Copiado. Pégalo en un mensaje.');});}});
var s=document.getElementById('b-share');if(navigator.share){s.addEventListener('click',function(){navigator.share({title:'Fotos elegidas - AMS',text:leer()}).catch(function(){});});}else{s.style.display='none';}
})();</script>''' % (json.dumps(data,ensure_ascii=False),"delarubiaignacio@gmail.com")
    body=f'''<div style="max-width:1100px;margin:0 auto;padding:40px 24px 72px"><h1 style="margin:0;font-size:clamp(28px,6vw,40px);line-height:1.1;font-weight:800">Fotos de la web antigua</h1>
<p style="font-size:18px;line-height:1.55;color:#4A5A68;max-width:720px">Estas son las {n} imágenes de la web actual de AMS que podrían servir. Se cargan desde la web antigua. Marca Usar, Quizá o No en cada una; al final copia o envía la lista. Pulsa en una imagen para verla grande. Las que se usen se pasarán al tamaño adecuado.</p>
{css}{"".join(out)}
<div class="acts"><button id="b-share" class="sec" type="button">Enviar (elige WhatsApp)</button><button id="b-mail" type="button">Enviar por correo</button><button id="b-copy" class="sec" type="button">Copiar lista</button></div><div id="estado" role="status"></div>{js}</div>'''
    return ("/fotos-web-antigua","fotos-web-antigua.html","Fotos de la web antigua | AMS Cerramientos","Selección interna de fotos de la web antigua de AMS.",body)
