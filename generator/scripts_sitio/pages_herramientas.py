# Herramientas gratuitas: diagnostico de ventanas y simulador de ahorro y ruido.
# Todo se calcula en el navegador del cliente: sin servidor, sin datos personales.
from pages_new import BTN, BTN2

CSS = '''<style>
.hx input[type=checkbox],.hx input[type=radio]{width:22px;height:22px;accent-color:#C2410C;flex:none;margin:0}
.hx label.op{display:flex;align-items:center;gap:12px;min-height:52px;padding:10px 16px;background:#fff;border:1px solid #C9D2D9;border-radius:8px;cursor:pointer;font-size:16px;line-height:1.35}
.hx label.op:has(input:checked){border-color:#C2410C;background:#FFF4EC}
.hx fieldset{border:0;margin:0;padding:0;display:flex;flex-direction:column;gap:10px}
.hx legend{font-size:20px;font-weight:800;margin:0 0 12px;padding:0}
.hx select,.hx input[type=number]{min-height:52px;padding:0 14px;border:1px solid #C9D2D9;border-radius:8px;font:16px Inter,sans-serif;width:100%;box-sizing:border-box;background:#fff}
.hx .card{background:#fff;border-radius:10px;padding:24px;display:flex;flex-direction:column;gap:10px}
.hx .b1{display:inline-flex;align-items:center;min-height:54px;padding:0 26px;border-radius:6px;background:#C2410C;color:#fff;border:0;font:700 17px Inter,sans-serif;cursor:pointer;text-decoration:none}
.hx .tag{font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.04em;color:#B8430A}
.hx .big{font-size:clamp(28px,6vw,40px);font-weight:800;line-height:1.1;color:#12202B}
.hx .gr{display:grid;gap:16px;grid-template-columns:repeat(auto-fit,minmax(240px,1fr))}
.hx a.l{color:#B8430A;font-weight:700}
</style>'''

HV = {"Diagnóstico": "ventana-cortina", "Simulador": "salon-ventanal", "Revisa tu presupuesto": "arquitecto-mesa", "Comprobador de ayudas": "hombre-sonriendo", "Cómo medir tus ventanas": "lapiz-medicion", "Permisos para cerrar tu terraza": "terraza-cristal", "Visualizador": "reforma-ventanal"}

def hero(crumb, h1, lead, extra=""):
    v = HV.get(crumb)
    fondo = (f'''<video class="vbg" autoplay muted loop playsinline preload="metadata" poster="/img/{v}.jpg" aria-hidden="true" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:50% 40%"><source src="/img/{v}.webm" type="video/webm"><source src="/img/{v}.mp4" type="video/mp4"></video><div aria-hidden="true" style="position:absolute;inset:0;background:linear-gradient(90deg,rgba(18,32,43,.88) 0%,rgba(18,32,43,.72) 55%,rgba(18,32,43,.45) 100%)"></div>''' if v else "")
    est = f"background: #12202B url(/img/{v}.jpg) center / cover; " if v else "background: #12202B; "
    return f'''<section style="position: relative; overflow: hidden; {est}color: #FFFFFF">{fondo}
<div style="position: relative; max-width: 1200px; margin: 0 auto; padding: 40px 24px 56px; display: flex; flex-direction: column; gap: 18px">
<div style="font-size: 14px; color: #D3DBE2"><a href="/" style="color: #D3DBE2">Inicio</a> / {crumb}</div>
<h1 style="margin: 0; font-size: clamp(30px, 7vw, 46px); line-height: 1.1; font-weight: 800; max-width: 820px; text-shadow: 0 1px 12px rgba(0,0,0,.35)">{h1}</h1>
<p style="margin: 0; font-size: 19px; line-height: 1.55; color: #E6ECF1; max-width: 780px">{lead}</p>{extra}
</div></section>'''

def op(tipo, name, val, txt):
    return f'<label class="op"><input type="{tipo}" name="{name}" value="{val}"><span>{txt}</span></label>'


def p_diagnostico():
    q1 = "".join(op("checkbox", "s", v, t) for v, t in [
        ("cond", "Se empañan los cristales o sale moho en el marco o en la pared"),
        ("vaho", "Hay vaho o gotas entre los dos cristales"),
        ("ruido", "Entra mucho ruido de la calle"),
        ("aire", "Notas corrientes de aire con la ventana cerrada"),
        ("caja", "Por el cajón de la persiana se cuela frío o aire"),
        ("agua", "Entra agua por la ventana cuando llueve"),
        ("abrir", "Cuesta abrir o cerrar, o la manilla está floja"),
        ("temp", "Una habitación está siempre demasiado fría o demasiado calurosa"),
        ("seg", "No me siento seguro con las ventanas actuales"),
    ])
    def grupo(n, leg, items):
        return f'<fieldset><legend>{leg}</legend>' + "".join(op("radio", n, v, t) for v, t in items) + '</fieldset>'
    q2 = grupo("mat", "¿De qué material son ahora?", [("madera", "Madera"), ("alu_sin", "Aluminio antiguo (el marco está frío al tacto)"), ("alu_rpt", "Aluminio con rotura de puente térmico"), ("pvc", "PVC"), ("nose", "No lo sé")])
    q3 = grupo("vid", "¿Y el vidrio?", [("simple", "Un solo cristal"), ("doble", "Doble cristal con cámara"), ("nose", "No lo sé")])
    q4 = grupo("edad", "¿Qué edad tienen las ventanas?", [("n", "Menos de 10 años"), ("m", "Entre 10 y 25 años"), ("v", "Más de 25 años o no lo sé")])
    q5 = grupo("calle", "¿Cómo es la calle?", [("t", "Tranquila"), ("m", "Con tráfico normal"), ("r", "Ruidosa (avenida, bares, obras)")])
    q6 = grupo("orient", "¿Hacia dónde da la habitación con el problema?", [("n", "Norte"), ("s", "Sur u oeste"), ("e", "Este"), ("x", "No lo sé o varias")])
    body = hero("Diagnóstico", "Diagnóstico gratuito de tus ventanas",
        "Contesta seis preguntas de un minuto y te decimos qué es lo que probablemente falla y qué arreglo tiene sentido. Incluido cuando la respuesta es «no hace falta cambiar nada».")
    body += f'''<section class="hx" style="background: #F3F5F7"><div style="max-width: 820px; margin: 0 auto; padding: 40px 24px 72px; display: flex; flex-direction: column; gap: 28px">
<form id="dg" style="display: flex; flex-direction: column; gap: 32px" novalidate>
<fieldset><legend>¿Qué te pasa? (marca todo lo que notes)</legend>{q1}</fieldset>
{q2}{q3}{q4}{q5}{q6}
<div><button type="submit" class="b1">Ver mi diagnóstico</button></div>
<p id="dg-err" style="margin:0;color:#B42318;font-weight:600" role="alert"></p>
</form>
<div id="dg-out" hidden style="display:none;flex-direction:column;gap:18px" aria-live="polite"></div>
<p style="margin:0;font-size:14px;color:#4A5A68;line-height:1.5">Es una orientación basada en lo que nos cuentas, no sustituye a ver las ventanas. En la visita, gratis y sin compromiso, lo confirmamos y te damos el presupuesto cerrado. Tus respuestas no se envían a ningún sitio: se procesan en tu navegador.</p>
</div></section>{CSS}
<script>
(function(){{
var f=document.getElementById('dg'),out=document.getElementById('dg-out'),err=document.getElementById('dg-err');
function v(n){{var e=f.querySelector('input[name='+n+']:checked');return e?e.value:null;}}
function sint(){{return [].slice.call(f.querySelectorAll('input[name=s]:checked')).map(function(e){{return e.value;}});}}
function esc(s){{return s.replace(/&/g,'&amp;').replace(/</g,'&lt;');}}
f.addEventListener('submit',function(ev){{ev.preventDefault();
var S=sint(),mat=v('mat'),vid=v('vid'),edad=v('edad'),calle=v('calle'),or=v('orient');
if(!S.length){{err.textContent='Marca al menos una cosa que notes.';return;}}
if(!mat||!vid||!edad||!calle||!or){{err.textContent='Falta contestar alguna pregunta de abajo.';return;}}
err.textContent='';
var has=function(k){{return S.indexOf(k)>-1;}},R=[],cambio=0,parcial=0;
var viejo=(mat==='alu_sin'||mat==='madera'||vid==='simple'||edad==='v');
if(has('cond')){{
 if(mat==='alu_sin'){{R.push(['Marco de aluminio sin rotura de puente térmico','El perfil es de metal continuo y conduce el frío de fuera hacia dentro, así que en invierno el marco está helado y el vapor de la casa se convierte en agua justo ahí. Es el caso clásico.','Ventanas con rotura de puente térmico o de PVC.','/blog/rotura-puente-termico','Qué es la rotura de puente térmico']);cambio+=2;}}
 else if(vid==='simple'){{R.push(['Cristal sencillo','Un solo cristal está muy frío en invierno y condensa con cualquier humedad.','Doble acristalamiento (con ventana nueva, o sobre el marco si está bien).','/blog/condensacion-ventanas','Condensación en ventanas']);cambio+=2;}}
 else{{R.push(['Probablemente es humedad de la casa, no de la ventana','Si ya tienes un doble cristal y un marco que aísla, el moho y el vaho suelen venir de falta de ventilación o de un exceso de humedad. Cambiar de ventanas no lo arregla.','Ventilar cinco minutos al día, usar la microventilación o aireadores, y revisar la humedad. Si coincide con ventanas viejas o mal selladas, lo vemos en visita.','/blog/condensacion-ventanas','Condensación en ventanas']);parcial+=1;}}
}}
if(has('vaho')){{R.push(['Doble cristal con el sellado roto','Cuando aparece vaho entre los dos cristales, el sellado perdió estanqueidad y entró humedad en la cámara. No se seca ni se limpia.','Sustituir solo el vidrio, no la ventana entera, si el marco y el herraje están bien.','/glosario#sellado-del-vidrio','Qué es el sellado del vidrio']);parcial+=1;}}
if(has('ruido')){{
 if(vid==='simple'){{R.push(['Vidrio sencillo: poco freno al ruido','Un cristal solo deja pasar la mayor parte del ruido de la calle.','Doble acristalamiento; si la calle es ruidosa, con vidrio laminado acústico.','/blog/pvc-o-aluminio','PVC o aluminio: ruido y aislamiento']);cambio+=2;}}
 else{{R.push(['El ruido lo decide el vidrio y el sellado, no solo el marco','Con doble cristal normal ya tienes algo; si sigue entrando ruido, suele ser el cristal (poco espesor o sin laminar), las juntas o el cajón de persiana.','Vidrio acústico laminado, juntas nuevas y, si el cajón está sin aislar, cajón aislado.','/glosario#vidrio-acustico','Qué es el vidrio acústico']);cambio+=(calle==='r'?2:1);}}
}}
if(has('aire')){{
 if(edad==='n'&&mat!=='alu_sin'&&mat!=='madera'){{R.push(['Ventana joven con fugas: seguramente es un ajuste','Una ventana de menos de diez años no debería tener corrientes. Suele ser un herraje desajustado, una junta salida o un sellado perimetral deficiente.','Ajuste de herrajes y revisión de juntas. No hace falta cambiarla.','/blog/mantenimiento-limpieza-ventanas','Mantenimiento de ventanas']);parcial+=1;}}
 else{{R.push(['Ventanas con juntas gastadas o poco estancas','Con los años las juntas se resecan y los marcos pierden ajuste; en madera y aluminio antiguo se suma la holgura.','Si el marco está sano, cambiar juntas y ajustar. Si hay varios síntomas más, ventana nueva.','/blog/instalacion-ventanas-pvc','Cómo se instala bien una ventana']);cambio+=1;}}
}}
if(has('caja')){{R.push(['Cajón de persiana sin aislar','Es una de las mayores fugas de una casa, y casi nadie lo mira. La caja es fina y está pegada al exterior.','Cajón aislado, o monoblock. Se puede hacer sin cambiar la ventana.','/blog/cajones-persiana-aislados','Cajones de persiana aislados']);parcial+=1;}}
if(has('agua')){{R.push(['Entrada de agua','Puede ser un vierteaguas sin pendiente, un sellado exterior roto o desagües de la ventana obstruidos.','Limpiar desagües, rehacer el sellado y revisar el vierteaguas. En ventanas jóvenes revisamos cómo se instalaron.','/blog/instalacion-ventanas-pvc','Cómo se instala bien una ventana']);parcial+=1;}}
if(has('abrir')){{R.push(['Herraje o carriles','Lo más común es un herraje seco o descolgado, o carriles sucios en correderas.','Limpieza, engrase y ajuste; o cambio del herraje.','/reparaciones','Reparaciones']);parcial+=1;}}
if(has('temp')){{
 if(or==='s'){{R.push(['Orientación sur u oeste','Si el problema es el calor, el sol de la tarde entra directo.','Vidrio de control solar, persiana exterior o toldo.','/toldos','Toldos y protección solar']);}}
 else if(or==='n'){{R.push(['Orientación norte','Habitación que no recibe sol directo; la ventana es el punto débil.','Vidrio bajo emisivo y ventana con buen aislamiento.','/ventanas-pvc','Ventanas de PVC']);cambio+=1;}}
 else{{R.push(['Habitación fría o calurosa','Depende de la orientación y de qué ventana tengas en esa estancia.','Lo mejor es verlo en visita: miramos orientación, vidrio y persiana.','/contacto','Pedir visita']);}}
}}
if(has('seg')){{R.push(['Seguridad','Una ventana segura combina cierre multipunto, vidrio laminado y, en plantas bajas, reja.','Herraje con cierre multipunto, vidrio laminado, o rejas.','/rejas','Rejas y enrejados']);parcial+=1;}}
var ver,verT;
if(cambio>=3||(viejo&&cambio>=2)){{ver='Compensa cambiar las ventanas';verT='Con lo que cuentas, los problemas vienen del propio conjunto de ventana (marco, vidrio o edad), y los arreglos sueltos solo retrasarían la decisión.';}}
else if(cambio+parcial>0){{ver='No hace falta cambiar todas las ventanas';verT='Lo que describes se arregla con actuaciones concretas. Te lo decimos así porque es lo que te conviene, y lo confirmamos en la visita.';}}
else{{ver='Con lo que cuentas, no parece haber un problema serio';verT='Revisa el mantenimiento y ventila bien.';}}
var h='<div class="card" style="background:#12202B;color:#fff"><span class="tag" style="color:#F4A261">Nuestra lectura</span><h2 style="margin:0;font-size:clamp(24px,5vw,32px);font-weight:800">'+ver+'</h2><p style="margin:0;font-size:17px;line-height:1.55;color:#D3DBE2">'+verT+'</p></div>';
R.forEach(function(r,i){{h+='<div class="card"><span class="tag">Punto '+(i+1)+'</span><h3 style="margin:0;font-size:21px">'+r[0]+'</h3><p style="margin:0;line-height:1.6"><b>Por qué pasa:</b> '+r[1]+'</p><p style="margin:0;line-height:1.6"><b>Qué hacer:</b> '+r[2]+'</p><a class="l" href="'+r[3]+'">'+r[4]+'</a></div>';}});
var msg='Hola, he hecho el diagnóstico de ventanas de la web. Resultado: '+ver+'. Me gustaría que me hicierais una visita.';
h+='<div class="card" style="gap:14px"><h3 style="margin:0;font-size:22px">¿Lo confirmamos en tu casa?</h3><p style="margin:0">La visita y la medición son gratuitas y sin compromiso. Si quieres hacerte una idea del precio antes, usa la calculadora.</p><div style="display:flex;flex-wrap:wrap;gap:12px"><a class="b1" href="https://wa.me/34639788220?text='+encodeURIComponent(msg)+'">Pedir visita por WhatsApp</a><a href="/configurador" style="display:inline-flex;align-items:center;min-height:54px;padding:0 22px;border-radius:6px;border:1px solid #12202B;color:#12202B;text-decoration:none;font-weight:600">Calcular mi precio</a></div></div>';
out.innerHTML=h;out.style.display='flex';out.hidden=false;out.scrollIntoView({{behavior:'smooth',block:'start'}});
}});
}})();
</script>'''
    return ("/diagnostico", "diagnostico.html", "Diagnóstico gratuito de tus ventanas: qué falla y qué arreglo conviene | AMS Cerramientos",
            "Contesta seis preguntas y te decimos si tus ventanas necesitan cambio o solo un arreglo: condensación, ruido, corrientes, cajón de persiana. Gratis, sin datos personales.", body)


def p_simulador():
    ua = [("4.5", "Madera con un solo cristal"), ("2.6", "Madera con doble cristal"), ("5.7", "Aluminio antiguo con un solo cristal"), ("3.8", "Aluminio antiguo con doble cristal"), ("2.8", "Aluminio con rotura de puente térmico, antiguo"), ("2.4", "PVC antiguo con doble cristal")]
    un = [("1.4", "PVC con doble vidrio bajo emisivo"), ("1.7", "Aluminio con rotura de puente térmico y doble vidrio bajo emisivo"), ("1.0", "PVC con triple vidrio")]
    sel = lambda ident, items: f'<select id="{ident}">' + "".join(f'<option value="{v}">{t}</option>' for v, t in items) + '</select>'
    ra = [("25", "Un solo cristal"), ("30", "Doble cristal normal")]
    rn = [("32", "Doble cristal normal"), ("38", "Doble vidrio laminado acústico"), ("35", "Triple vidrio")]
    calef = [("0.10", "Gas natural"), ("0.13", "Gasóleo"), ("0.07", "Bomba de calor"), ("0.20", "Radiadores eléctricos")]
    body = hero("Simulador", "¿Cuánto ahorrarías y cuánto ruido te quitarías?",
        "Una estimación sincera, con las hipótesis a la vista. Te damos una horquilla, no una promesa: así sabes qué esperar antes de gastar un euro.")
    lab = lambda t, i: f'<label for="{i}" style="font-weight:700">{t}</label>'
    body += f'''<section class="hx" style="background: #F3F5F7"><div style="max-width: 820px; margin: 0 auto; padding: 40px 24px 72px; display: flex; flex-direction: column; gap: 24px">
<div class="card" style="gap: 14px">
{lab("Metros cuadrados de ventana que quieres cambiar (suma de todas)", "sm")}<input id="sm" type="number" min="1" max="200" step="1" value="12" inputmode="numeric">
{lab("Ventana actual", "sa")}{sel("sa", ua)}
{lab("Ventana nueva", "sn")}{sel("sn", un)}
{lab("Cómo calientas la casa", "sc")}{sel("sc", calef)}
<hr style="border:0;border-top:1px solid #E3E8EC;width:100%">
{lab("Aislamiento acústico del vidrio actual", "ra")}{sel("ra", ra)}
{lab("Vidrio nuevo para el ruido", "rn")}{sel("rn", rn)}
</div>
<div id="so" style="display: flex; flex-direction: column; gap: 16px" aria-live="polite"></div>
<div class="card"><h2 style="margin:0;font-size:20px">Cómo lo calculamos</h2>
<ul style="margin:0;padding-left:20px;line-height:1.7;font-size:15px;color:#2B3A47">
<li><b>Ahorro de calefacción</b> = diferencia de transmitancia térmica (Uw) × metros cuadrados × grados-día de calefacción de Madrid y el Corredor del Henares (unos 1.700 al año) × 24 horas. El precio del kWh es orientativo, de octubre de 2026; cámbialo en tu cabeza si tu tarifa es distinta.</li>
<li><b>Valores de Uw</b> típicos de cada tipo de ventana, no de un modelo concreto. El de tu ventana real puede variar.</li>
<li><b>No contamos las fugas de aire</b> (infiltraciones), que en ventanas viejas suelen ser importantes. Por eso damos una horquilla y el ahorro real de una ventana vieja y mal sellada suele quedar por encima.</li>
<li><b>Ruido</b> = diferencia entre el aislamiento acústico del vidrio (Rw, en decibelios). Una bajada de 10 dB se percibe, aproximadamente, como la mitad de ruido. El resultado real depende también de la instalación, las juntas y el cajón de persiana.</li>
<li>La ventana nueva mejora también el confort: menos pared fría, menos corrientes, menos condensación. Eso no sale en una factura.</li>
</ul></div>
<div class="card" style="gap:14px"><h3 style="margin:0;font-size:22px">¿Quieres cifras con tus ventanas reales?</h3><p style="margin:0">Te las medimos gratis y te damos un presupuesto cerrado.</p><div style="display:flex;flex-wrap:wrap;gap:12px"><a class="b1" href="/configurador">Calcular mi precio</a><a href="/contacto" style="display:inline-flex;align-items:center;min-height:54px;padding:0 22px;border-radius:6px;border:1px solid #12202B;color:#12202B;text-decoration:none;font-weight:600">Pedir visita</a></div></div>
</div></section>{CSS}
<script>
(function(){{
var g=function(i){{return document.getElementById(i);}},o=g('so');
function eur(n){{return Math.round(n/5)*5;}}
function f(){{
var m=Math.max(1,Math.min(200,parseFloat(g('sm').value)||0)),ua=parseFloat(g('sa').value),un=parseFloat(g('sn').value),p=parseFloat(g('sc').value),ra=parseFloat(g('ra').value),rn=parseFloat(g('rn').value);
var dU=ua-un,kwh=dU*m*1700*24/1000,eu=kwh*p,h='';
if(dU<=0.2){{h+='<div class="card"><span class="tag">Calefacción</span><p style="margin:0;font-size:17px;line-height:1.55">Con esas dos opciones la mejora de aislamiento es muy pequeña. Probablemente no compense cambiar solo por ahorro; sí puede compensar por confort o por ruido.</p></div>';}}
else{{h+='<div class="card"><span class="tag">Calefacción, al año</span><div class="big">de '+eur(eu*0.7)+' a '+eur(eu*1.3)+' € menos</div><p style="margin:0;color:#4A5A68">Entre '+Math.round(kwh*0.7/10)*10+' y '+Math.round(kwh*1.3/10)*10+' kWh. Es lo que ahorrarías solo por el aislamiento, sin contar las fugas de aire.</p></div>';}}
var dR=rn-ra;
if(dR<=0){{h+='<div class="card"><span class="tag">Ruido</span><p style="margin:0;font-size:17px;line-height:1.55">Con esa combinación no ganas aislamiento acústico. Si el ruido es tu problema, mira el vidrio laminado acústico.</p></div>';}}
else{{var t=dR>=10?'Se notaría mucho: aproximadamente la mitad de ruido o menos.':dR>=6?'Se notaría claramente.':'Mejora pequeña, apenas perceptible.';
h+='<div class="card"><span class="tag">Ruido</span><div class="big">'+dR+' dB menos</div><p style="margin:0;color:#4A5A68">'+t+' Pasarías de un aislamiento de '+ra+' dB a '+rn+' dB, en el vidrio.</p></div>';}}
o.innerHTML=h;}}
['sm','sa','sn','sc','ra','rn'].forEach(function(i){{g(i).addEventListener('input',f);g(i).addEventListener('change',f);}});f();
}})();
</script>'''
    return ("/simulador", "simulador.html", "Simulador de ahorro y ruido al cambiar ventanas | AMS Cerramientos",
            "Calcula con hipótesis claras cuánto podrías ahorrar en calefacción y cuántos decibelios de ruido te quitarías al cambiar tus ventanas, en Madrid y Guadalajara.", body)



_UPL = """<div class="card" id="up" style="gap:14px;border:2px solid #C2410C"><h2 style="margin:0;font-size:22px">Sube tu presupuesto y lo revisamos nosotros</h2>
<p style="margin:0;color:#3D5163;line-height:1.6">Haz una foto o sube el PDF. Una persona de AMS lo mira y te dice con sinceridad si el precio es razonable y qué falta. Si el otro presupuesto es mejor, te lo decimos. Si podemos mejorarlo, te hacemos el nuestro.</p>
<form id="up-f" novalidate style="display:flex;flex-direction:column;gap:12px">
<label for="up-a" style="font-weight:700">Foto o PDF del presupuesto</label><input id="up-a" type="file" accept="image/*,application/pdf">
<label for="up-n" style="font-weight:700">Tu nombre (opcional)</label><input id="up-n" type="text" autocomplete="name" maxlength="80">
<label for="up-t" style="font-weight:700">Teléfono o correo, para contestarte</label><input id="up-t" type="text" autocomplete="tel" maxlength="120" placeholder="Por ejemplo, 600 123 456">
<label for="up-m" style="font-weight:700">¿Quieres decirnos algo? (opcional)</label><input id="up-m" type="text" maxlength="300" placeholder="Por ejemplo, me han dado 5 días de plazo">
<label style="display:flex;gap:10px;align-items:flex-start;line-height:1.45;font-size:15px"><input id="up-c" type="checkbox" style="margin-top:4px;flex:none"><span>Acepto que AMS Cerramientos reciba este archivo y mis datos solo para revisar el presupuesto y contestarme. Más información en la <a href="/privacidad">política de privacidad</a>.</span></label>
<div><button type="submit" class="b1" id="up-b">Enviar para que lo revisen</button></div>
<p id="up-s" role="status" style="margin:0;font-weight:600"></p>
</form>
<p style="margin:0;font-size:14px;color:#4A5A68">¿Prefieres no subir nada? Rellena los datos a mano aquí debajo y te damos una primera idea al momento.</p></div>
<script>(function(){var f=document.getElementById('up-f');if(!f)return;var s=document.getElementById('up-s'),b=document.getElementById('up-b');function m(t,e){s.textContent=t;s.style.color=e?'#B42318':'#1B6B3A'}
function rd(file){return new Promise(function(ok,ko){var r=new FileReader();r.onload=function(){ok(r.result)};r.onerror=ko;r.readAsDataURL(file)})}
function img(file){return new Promise(function(ok,ko){var u=URL.createObjectURL(file),i=new Image();i.onload=function(){var k=Math.min(1,1800/Math.max(i.width,i.height)),c=document.createElement('canvas');c.width=Math.round(i.width*k);c.height=Math.round(i.height*k);c.getContext('2d').drawImage(i,0,0,c.width,c.height);URL.revokeObjectURL(u);ok(c.toDataURL('image/jpeg',.82))};i.onerror=function(){URL.revokeObjectURL(u);ko()};i.src=u})}
f.addEventListener('submit',function(e){e.preventDefault();var file=document.getElementById('up-a').files[0],t=document.getElementById('up-t').value.trim();
if(!file){m('Elige primero la foto o el PDF.',1);return}
if(!t){m('Escribe un teléfono o un correo para poder contestarte.',1);return}
if(!document.getElementById('up-c').checked){m('Marca la casilla para que podamos revisarlo.',1);return}
var pdf=file.type==='application/pdf';if(pdf&&file.size>3000000){m('El PDF pesa demasiado. Mándanoslo por WhatsApp al 639 78 82 20.',1);return}
if(!pdf&&file.type.indexOf('image/')!==0){m('Solo podemos recibir fotos o PDF.',1);return}
b.disabled=true;m('Enviando...');
(pdf?rd(file):img(file)).then(function(d){var mail=/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(t);return fetch('/api/presupuesto-archivo',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({tipo:pdf?'application/pdf':'image/jpeg',datos:d,nombre:document.getElementById('up-n').value,telefono:mail?'':t,correo:mail?t:'',mensaje:document.getElementById('up-m').value,consentimiento:true})})}).then(function(r){return r.json().catch(function(){return{ok:false}}).then(function(j){return{r:r,j:j}})}).then(function(x){b.disabled=false;if(x.j&&x.j.ok){m('Recibido, gracias. Lo revisamos y te contestamos lo antes posible.');f.reset()}else if(x.r.status===429){m('Has enviado varios seguidos. Inténtalo más tarde o escríbenos por WhatsApp.',1)}else{m('No hemos podido enviarlo desde aquí. Mándanoslo por WhatsApp al 639 78 82 20.',1)}}).catch(function(){b.disabled=false;m('No hemos podido enviarlo desde aquí. Mándanoslo por WhatsApp al 639 78 82 20.',1)})})})();</script>
"""

def p_presupuesto():
    sel = lambda ident, items: f'<select id="{ident}">' + "".join(f'<option value="{v}">{t}</option>' for v, t in items) + '</select>'
    lab = lambda t, i: f'<label for="{i}" style="font-weight:700">{t}</label>'
    chk = [("med", "Medición previa de los huecos"), ("ret", "Desmontaje y retirada de las ventanas viejas y de los escombros"), ("marca", "Marca y serie del perfil (por ejemplo, Kömmerling 76 AD)"),
           ("vid", "Composición exacta del vidrio (por ejemplo, 4/16/4 bajo emisivo)"), ("caja", "Cajón de persiana: qué se hace con él (aislar, cambiar o dejar)"), ("rem", "Remates: sellado, tapajuntas y vierteaguas"),
           ("iva", "Precio con el IVA indicado claramente"), ("gar", "Garantía por escrito, con los años del perfil, del vidrio y de la instalación"), ("plazo", "Plazo de entrega e instalación"), ("pago", "Forma de pago y cuánto se adelanta")]
    checks = "".join(op("checkbox", "c", v, t) for v, t in chk)
    glos = {"med": "", "ret": "", "marca": "/glosario#serie-sistema-de-perfiles", "vid": "/glosario#doble-acristalamiento", "caja": "/blog/cajones-persiana-aislados", "rem": "/glosario#sellado-perimetral", "iva": "", "gar": "/glosario#garantia", "plazo": "", "pago": ""}
    import json as _j
    body = hero("Revisa tu presupuesto", "¿Tienes otro presupuesto? Revísalo aquí",
        "Pon los datos del presupuesto que te han dado y te decimos si el precio por metro cuadrado es razonable y qué cosas no aparecen y conviene preguntar. No criticamos a nadie: solo te ayudamos a comparar peras con peras.")
    body += f'''<section class="hx" style="background: #F3F5F7"><div style="max-width: 820px; margin: 0 auto; padding: 40px 24px 72px; display: flex; flex-direction: column; gap: 28px">
{_UPL}
<form id="pr" style="display: flex; flex-direction: column; gap: 28px" novalidate>
<div class="card" style="gap: 14px"><h2 style="margin:0;font-size:22px">1. Los números del presupuesto</h2>
{lab("Precio total que te han dado (en euros)", "pp")}<input id="pp" type="number" min="1" step="1" inputmode="numeric" placeholder="Por ejemplo, 4200">
{lab("¿Ese precio lleva IVA?", "pi")}{sel("pi", [("con", "Sí, con IVA incluido"), ("sin", "No, es sin IVA"), ("nose", "No lo sé")])}
{lab("Número de ventanas", "pn")}<input id="pn" type="number" min="1" max="50" step="1" value="4" inputmode="numeric">
{lab("Metros cuadrados en total de todas las ventanas (anchura × altura de cada una, sumadas)", "pm")}<input id="pm" type="number" min="0.5" max="150" step="0.1" value="6" inputmode="decimal">
{lab("Material", "pa")}{sel("pa", [("pvc", "PVC"), ("alu", "Aluminio con rotura de puente térmico")])}
{lab("Vidrio", "pv", )}{sel("pv", [("doble", "Doble normal"), ("bajoe", "Doble bajo emisivo"), ("acustico", "Doble acústico"), ("triple", "Triple")])}
{lab("Persianas", "pe")}{sel("pe", [("no", "Sin persianas"), ("manual", "Con persiana manual"), ("motor", "Con persiana motorizada")])}
</div>
<fieldset class="card"><legend style="font-size:22px;font-weight:800;margin-bottom:6px">2. ¿Qué aparece escrito en el presupuesto?</legend><p style="margin:0 0 6px;color:#4A5A68">Marca solo lo que viene claramente. Lo que dejes sin marcar te lo señalamos como cosa que preguntar.</p>{checks}</fieldset>
<div style="display:flex;flex-wrap:wrap;gap:12px;align-items:center"><button type="submit" class="b1">Revisar mi presupuesto</button><button type="button" id="pr-ej" style="min-height:54px;padding:0 22px;border-radius:6px;border:1px solid #12202B;background:transparent;color:#12202B;font:600 16px Inter,sans-serif;cursor:pointer">Probar con un ejemplo</button></div>
<p style="margin:0;font-size:14px;color:#4A5A68">El ejemplo es un presupuesto inventado de 4 ventanas (6 m², 3.000 € con IVA) para que veas cómo responde. Si prefieres no escribir nada, sube arriba la foto o el PDF y lo revisamos nosotros.</p>
<p id="pr-err" style="margin:0;color:#B42318;font-weight:600" role="alert"></p>
</form>
<div id="pr-out" style="display:none;flex-direction:column;gap:18px" aria-live="polite"></div>
<div class="card"><h2 style="margin:0;font-size:20px">Cómo lo hacemos, sin trampa</h2><ul style="margin:0;padding-left:20px;line-height:1.7;font-size:15px;color:#2B3A47">
<li>El precio de referencia sale de nuestra calculadora, con medición, instalación y retirada de lo viejo incluidas. Es una referencia con margen, no un presupuesto cerrado.</li>
<li>Que un presupuesto sea más barato no significa que sea peor: puede ser otra serie, otro vidrio o que falte algo. Por eso la segunda parte importa tanto.</li>
<li>No guardamos lo que escribes: todo se calcula en tu navegador, salvo la consulta del precio de referencia, que no lleva datos personales.</li>
</ul></div>
</div></section>{CSS}
<script>
(function(){{
var f=document.getElementById('pr'),out=document.getElementById('pr-out'),err=document.getElementById('pr-err');
var CH={_j.dumps([[v,t,glos[v]] for v,t in chk], ensure_ascii=False)};
function g(i){{return document.getElementById(i);}}
function fe(n){{return Math.round(n).toLocaleString('es-ES')+' €';}}
function ref(item,n){{return fetch('/api/configurador',{{method:'POST',headers:{{'Content-Type':'application/json'}},body:JSON.stringify({{items:[Object.assign({{tipo:'ventana',n:n}},item)]}})}}).then(function(r){{if(!r.ok)throw 0;return r.json();}});}}
f.addEventListener('submit',function(ev){{ev.preventDefault();
var P=parseFloat(g('pp').value),n=Math.round(parseFloat(g('pn').value)),m=parseFloat(g('pm').value);
if(!(P>0)||!(n>0)||!(m>0)){{err.textContent='Rellena el precio, el número de ventanas y los metros cuadrados.';return;}}
err.textContent='';
var done={{}};[].slice.call(f.querySelectorAll('input[name=c]:checked')).forEach(function(e){{done[e.value]=1;}});
var falta=CH.filter(function(c){{return !done[c[0]];}});
var iva=g('pi').value,eur_m2=P/m;
var lado=Math.max(30,Math.min(400,Math.sqrt(m/n)*100));
var it={{w:Math.round(lado),h:Math.round(lado),mat:g('pa').value,vid:g('pv').value,pers:g('pe').value,gama:'confort',hojas:1}};
out.style.display='flex';out.innerHTML='<div class="card"><p style="margin:0">Calculando…</p></div>';
function pinta(R){{
var h='';
h+='<div class="card"><span class="tag">Tu presupuesto</span><div class="big">'+fe(eur_m2)+' por m²</div><p style="margin:0;color:#4A5A68">'+fe(P)+' entre '+m.toLocaleString('es-ES')+' m² de ventana'+(iva==='con'?' (con IVA).':iva==='sin'?' (sin IVA).':'.')+'</p></div>';
var cta='',ver;
if(R){{
 var comp=iva==='con'?R.total:R.base,low=comp*0.85,hi=comp*1.15;
 if(iva==='nose'){{ver='No sabes si lleva IVA, y con un 21 % de diferencia no se puede comparar bien. Pregúntalo: es lo primero que hay que aclarar.';}}
 else if(P<low){{ver='Tu presupuesto está por debajo de nuestra referencia. Puede ser una buena oferta, pero conviene mirar qué falta (abajo) y qué serie y vidrio llevan: normalmente la diferencia está ahí. Y si el otro presupuesto está bien y es más barato, envíanoslo: estudiamos si podemos adaptarnos.';}}
 else if(P>hi){{ver='Tu presupuesto está por encima de nuestra referencia. Puede incluir más (otra serie, vidrio mejor, remates), pero merece la pena compararlo con el nuestro.';}}
 else{{ver='Tu presupuesto está en la zona de nuestra referencia. Lo que decide ahora es qué incluye cada uno.';}}
 h+='<div class="card"><span class="tag">Referencia AMS para ese tipo de ventana</span><div class="big">'+fe(low)+' a '+fe(hi)+'</div><p style="margin:0;color:#4A5A68">'+(iva==='con'?'Con IVA':'Sin IVA')+', instalado, con medición y retirada de lo viejo. Orientativo.</p><p style="margin:0;line-height:1.6">'+ver+'</p></div>';
}}else{{h+='<div class="card"><span class="tag">Precio de referencia</span><p style="margin:0;line-height:1.6">Ahora mismo no podemos consultar nuestra referencia. Usa la <a class="l" href="/configurador">calculadora</a> con tus medidas para compararlo.</p></div>';}}
h+='<div class="card"><span class="tag">Qué no aparece y conviene preguntar</span>';
if(!falta.length)h+='<p style="margin:0;line-height:1.6">Has marcado todo. Es un presupuesto claro. Aun así, compara series y vidrios: es donde se esconden las diferencias.</p>';
else{{h+='<p style="margin:0;line-height:1.6">Esto no aparece en tu presupuesto. No significa que no esté incluido: significa que hay que <b>preguntar si lo está</b> antes de firmar.</p><ul style="margin:0;padding-left:20px;line-height:1.8">';
falta.forEach(function(c){{h+='<li>'+c[1]+(c[2]?' <a class="l" href="'+c[2]+'">Qué es</a>':'')+'</li>';}});h+='</ul>';}}
h+='</div>';
var msg='Hola, he revisado un presupuesto en vuestra web: '+n+' ventanas, '+m+' m², '+fe(P)+(iva==='con'?' con IVA':iva==='sin'?' sin IVA':'')+'. Os lo mando para que le echéis un vistazo.';
h+='<div class="card" style="gap:14px;background:#12202B;color:#fff"><h3 style="margin:0;font-size:22px">¿Quieres que lo miremos nosotros?</h3><p style="margin:0;color:#D3DBE2;line-height:1.6">Mándanos una foto o el PDF por WhatsApp. Lo revisamos sin compromiso y, si el otro presupuesto es mejor en precio, vemos si podemos adaptarnos. Siempre te diremos la verdad, aunque sea que el otro está bien.</p><div style="display:flex;flex-wrap:wrap;gap:12px"><a class="b1" href="https://wa.me/34639788220?text='+encodeURIComponent(msg)+'">Mandar mi presupuesto por WhatsApp</a><a href="/configurador" style="display:inline-flex;align-items:center;min-height:54px;padding:0 22px;border-radius:6px;border:1px solid #5B6B78;color:#fff;text-decoration:none;font-weight:600">Calcular el nuestro</a></div></div>';
out.innerHTML=h;out.scrollIntoView({{behavior:'smooth',block:'start'}});
}}
ref(it,n).then(pinta).catch(function(){{pinta(null);}});
}});
g('pr-ej').addEventListener('click',function(){{g('pp').value=3000;g('pi').value='con';g('pn').value=4;g('pm').value=6;g('pa').value='pvc';g('pv').value='doble';g('pe').value='no';
[].slice.call(f.querySelectorAll('input[name=c]')).forEach(function(e){{e.checked=(e.value==='med'||e.value==='iva'||e.value==='plazo');}});
f.requestSubmit?f.requestSubmit():f.dispatchEvent(new Event('submit',{{cancelable:true}}));}});
}})();
</script>'''
    return ("/revisa-tu-presupuesto", "revisa-tu-presupuesto.html", "Revisa tu presupuesto de ventanas: ¿es razonable? | AMS Cerramientos",
            "Compara el presupuesto de ventanas que te han dado con una referencia real y descubre qué no aparece y conviene preguntar antes de firmar. Gratis y sin datos personales.", body)


WA = "https://wa.me/34639788220"
OUTB = "display:inline-flex;align-items:center;min-height:54px;padding:0 22px;border-radius:6px;border:1px solid #12202B;color:#12202B;text-decoration:none;font-weight:600"


def p_ayudas():
    sel = lambda ident, items: f'<select id="{ident}">' + "".join(f'<option value="{v}">{t}</option>' for v, t in items) + '</select>'
    lab = lambda t, i: f'<label for="{i}" style="font-weight:700">{t}</label>'
    body = hero("Comprobador de ayudas", "¿Puedo recibir alguna ayuda por cambiar mis ventanas?",
        "Cuatro preguntas y te decimos qué hay de verdad y cuánto podrías recuperar. Revisado en octubre de 2026: solo contamos lo que existe, no lo que algunas webs prometen.")
    body += f'''<section class="hx" style="background: #F3F5F7"><div style="max-width: 820px; margin: 0 auto; padding: 40px 24px 72px; display: flex; flex-direction: column; gap: 24px">
<div class="card" style="gap: 14px">
{lab("¿Para qué es la obra?", "at")}{sel("at", [("casa", "Mi vivienda (piso o casa)"), ("com", "Una comunidad de propietarios (todo el edificio)"), ("otro", "Un local o una empresa")])}
{lab("Importe aproximado de la obra, con IVA (euros)", "ai")}<input id="ai" type="number" min="100" step="100" value="4000" inputmode="numeric">
{lab("¿Además de ventanas se hace otra mejora de eficiencia (aislamiento de fachada, caldera, aerotermia)?", "ao")}{sel("ao", [("no", "No, solo ventanas"), ("si", "Sí, hay otras mejoras")])}
{lab("¿Cuándo acabará la obra?", "af")}{sel("af", [("a", "Antes del 31 de diciembre de 2026"), ("d", "Después del 31 de diciembre de 2026")])}
</div>
<div id="ao-out" style="display:flex;flex-direction:column;gap:16px" aria-live="polite"></div>
<div class="card"><h2 style="margin:0;font-size:20px">Lo que conviene saber</h2><ul style="margin:0;padding-left:20px;line-height:1.7;font-size:15px;color:#2B3A47">
<li>A octubre de 2026 <b>no hay subvención abierta</b> para cambiar ventanas en la Comunidad de Madrid: el Plan Renove de Ventanas está cerrado y las ayudas Next Generation para viviendas, finalizadas. Si una web te dice «solicita ya el Plan Renove 2026», no cuentes con ello.</li>
<li>Lo que sí existe es la <b>deducción en el IRPF</b>, que exige certificado energético antes y después de la obra, pago por banco (nunca en efectivo) y que la obra reduzca la demanda de energía lo suficiente.</li>
<li>Los cálculos son orientativos y no somos asesores fiscales: confírmalo con tu asesor o con la Agencia Tributaria. Más detalle en la <a class="l" href="/blog/ayudas-cambiar-ventanas-madrid">guía de ayudas para cambiar ventanas</a>.</li>
<li>Esta herramienta se revisa cada vez que cambian las ayudas. Última revisión: octubre de 2026.</li>
</ul></div>
</div></section>{CSS}
<script>
(function(){{
var g=function(i){{return document.getElementById(i);}},o=g('ao-out');
function e(n){{return Math.round(n).toLocaleString('es-ES')+' €';}}
function f(){{
var t=g('at').value,imp=Math.max(0,parseFloat(g('ai').value)||0),otras=g('ao').value==='si',pl=g('af').value==='a',h='';
if(t==='otro'){{h+='<div class="card"><span class="tag">Resultado</span><p style="margin:0;line-height:1.6">Las deducciones del IRPF por eficiencia energética son para viviendas. Para locales y empresas hay que consultarlo con tu asesor: puede haber otros incentivos, pero no los tenemos comprobados.</p></div>';}}
else if(!pl){{h+='<div class="card"><span class="tag">Resultado</span><p style="margin:0;line-height:1.6">Con la obra terminada después del 31 de diciembre de 2026 no podríamos asegurarte la deducción actual: ese es el plazo de las deducciones vigentes. Si te interesa, lo mejor es adelantar la obra. Y puedes preguntar a tu asesor si se prorroga.</p></div>';}}
else if(t==='com'){{h+='<div class="card"><span class="tag">Posible deducción para la comunidad</span><div class="big">hasta 5.000 € al año por vecino</div><p style="margin:0;line-height:1.6">Existe una deducción del 60 % para obras en el edificio que mejoren un 30 % su eficiencia, con base máxima de 5.000 € al año por propietario y un plazo que llega al 31 de diciembre de 2027. Solo con ventanas es difícil llegar al 30 %; suele lograrse con fachada y ventanas a la vez. Necesitáis certificado energético antes y después.</p></div>';}}
else{{
 var d20=Math.min(imp,5000)*0.2;
 h+='<div class="card"><span class="tag">Deducción del 20 % en el IRPF</span><div class="big">'+e(d20)+' de devolución como máximo</div><p style="margin:0;line-height:1.6">Si la obra reduce al menos un 7 % la demanda de calefacción y refrigeración, te puedes deducir el 20 % de lo pagado, con una base máxima de 5.000 € (tope de 1.000 €). Lo normal al cambiar ventanas viejas es llegar a ese 7 %, pero hay que demostrarlo con el certificado energético de después.</p></div>';
 if(otras){{var d40=Math.min(imp,7500)*0.4;h+='<div class="card"><span class="tag">Posible deducción del 40 %</span><div class="big">hasta '+e(d40)+'</div><p style="margin:0;line-height:1.6">Si junto a las ventanas hay otras mejoras y el conjunto reduce un 30 % el consumo de energía primaria no renovable (o la vivienda sube a letra A o B), la deducción sube al 40 % sobre una base de 7.500 € (tope de 3.000 €). Hay que verlo con el técnico que haga el certificado.</p></div>';}}
 h+='<div class="card"><span class="tag">Qué necesitas</span><ol style="margin:0;padding-left:20px;line-height:1.8"><li>Certificado energético antes de la obra.</li><li>Factura de la obra, pagada por banco: transferencia, tarjeta o financiación.</li><li>Certificado energético después, emitido antes del 31 de diciembre de 2026.</li></ol></div>';
}}
h+='<div class="card" style="gap:14px;background:#12202B;color:#fff"><h3 style="margin:0;font-size:22px">¿Calculamos tu obra?</h3><p style="margin:0;color:#D3DBE2">Te medimos gratis, te damos un presupuesto cerrado y, si lo quieres, te ponemos en contacto con un técnico para el certificado.</p><div style="display:flex;flex-wrap:wrap;gap:12px"><a class="b1" href="/configurador">Calcular mi precio</a><a href="/financiacion" style="display:inline-flex;align-items:center;min-height:54px;padding:0 22px;border-radius:6px;border:1px solid #5B6B78;color:#fff;text-decoration:none;font-weight:600">Ver financiación</a></div></div>';
o.innerHTML=h;}}
['at','ai','ao','af'].forEach(function(i){{g(i).addEventListener('input',f);g(i).addEventListener('change',f);}});f();
}})();
</script>'''
    return ("/comprobador-ayudas", "comprobador-ayudas.html", "¿Puedo recibir ayudas por cambiar mis ventanas? Comprobador | AMS Cerramientos",
            "Comprueba qué ayudas y deducciones del IRPF existen de verdad para cambiar ventanas en Madrid y cuánto podrías recuperar. Revisado en octubre de 2026.", body)


def p_medir():
    from menu_iconos import IC
    ic = lambda k: f'<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">{IC[k]}</svg>'
    pasos = [
        ("Mide el ancho en tres puntos", "Arriba, en medio y abajo del hueco, de pared a pared. Si no coinciden, es normal: las paredes casi nunca están a escuadra."),
        ("Mide el alto en tres puntos", "A la izquierda, en el centro y a la derecha, del alféizar al dintel."),
        ("Quédate con la más pequeña", "Es la que manda: la ventana nueva tiene que caber por el punto más estrecho."),
        ("Fotografía el hueco", "Una de frente con la persiana subida y otra de cerca del cajón y de la esquina."),
        ("Anota lo que no se ve", "Tipo de persiana, si abre hacia dentro o fuera, rejas, toldos o radiador debajo."),
    ]
    li = "".join(f'<li class="mp" data-i="{i}"><label><input type="checkbox"><span class="mn">{i+1}</span><span class="mt"><strong>{t}</strong><span>{d}</span></span></label></li>' for i, (t, d) in enumerate(pasos))
    dib = """<svg viewBox="0 0 320 250" class="md" role="img" aria-label="Hueco de ventana con tres medidas de ancho y tres de alto" xmlns="http://www.w3.org/2000/svg" fill="none" stroke-linecap="round">
<rect x="60" y="30" width="200" height="170" rx="3" fill="#FFF6EC" stroke="#12202B" stroke-width="5"/>
<rect x="78" y="48" width="164" height="134" fill="#DCEBF5" stroke="#12202B" stroke-width="2"/>
<path d="M78 48L150 182M170 48L242 120" stroke="#fff" stroke-width="6" opacity=".5"/>
<g stroke="#D9694D" stroke-width="2.5"><path d="M60 62H260M60 115H260M60 168H260"/></g>
<g stroke="#2B7A9B" stroke-width="2.5"><path d="M95 30V200M160 30V200M225 30V200"/></g>
<g font-family="Inter,sans-serif" font-size="13" font-weight="700"><text x="270" y="66" fill="#D9694D">1</text><text x="270" y="119" fill="#D9694D">2</text><text x="270" y="172" fill="#D9694D">3</text>
<text x="91" y="222" fill="#2B7A9B">A</text><text x="156" y="222" fill="#2B7A9B">B</text><text x="221" y="222" fill="#2B7A9B">C</text></g>
<g font-family="Inter,sans-serif" font-size="12" fill="#3B5168" text-anchor="middle"><text x="160" y="20">ancho: 3 medidas</text><text x="160" y="243">alto: 3 medidas</text></g></svg>"""
    nec = "".join(f'<span class="mc">{ic(k)}{t}</span>' for k, t in [("regla", "Metro rígido"), ("doc", "Papel y boli"), ("lupa", "El móvil para las fotos")])
    errs = [("Medir la ventana vieja, no el hueco", "El marco viejo puede ocupar parte del hueco. Lo que cuenta es la pared.", "Mide de pared a pared, sin marco."),
            ("Medir solo una vez", "Una pared torcida te engaña con una sola medida.", "Tres anchos y tres altos, siempre."),
            ("Olvidar el cajón de persiana", "La ventana nueva puede llevar cajón aislado y cambia el alto.", "Fotografía el cajón y anota si es de obra o de PVC.")]
    er = "".join(f'<div class="me"><div class="mm"><b>Mal</b>{a}<p>{b}</p></div><div class="mb"><b>Bien</b><p>{c}</p></div></div>' for a, b, c in errs)
    body = hero("Cómo medir tus ventanas", "Cómo medir tus ventanas para pedir un presupuesto",
        "Cinco pasos y un metro. No hace falta ser experto: con unas medidas aproximadas y dos fotos te damos un presupuesto orientativo. La medición definitiva la hacemos nosotros, gratis.")
    body += f"""<style>
.mw{{max-width:980px;margin:0 auto;padding:36px 24px 72px;display:flex;flex-direction:column;gap:28px}}
.mg{{display:grid;grid-template-columns:1fr 1fr;gap:24px;align-items:start}}
.mk{{background:#fff;border:1px solid #EFE3D5;border-radius:20px;padding:22px;box-shadow:0 6px 20px rgba(18,32,43,.06)}}
.mk h2{{margin:0 0 12px;font-size:21px}}.md{{width:100%;height:auto;display:block}}
.mcs{{display:flex;flex-wrap:wrap;gap:10px;margin-top:14px}}.mc{{display:inline-flex;align-items:center;gap:8px;background:#FCEBE4;color:#8A3A22;border-radius:999px;padding:8px 14px;font-weight:600;font-size:14px}}
.mpl{{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:10px}}
.mp label{{display:flex;gap:14px;align-items:flex-start;padding:12px;border-radius:14px;border:1px solid #EFE3D5;cursor:pointer;background:#FFFBF6;transition:.2s}}
.mp input{{position:absolute;opacity:0}}.mn{{flex:none;width:34px;height:34px;border-radius:50%;background:#12202B;color:#fff;display:grid;place-items:center;font-weight:700;transition:.2s}}
.mt{{display:flex;flex-direction:column;gap:2px;line-height:1.5;font-size:15px}}.mt strong{{font-size:17px}}
.mp input:checked~.mn{{background:#2E9E6B;font-size:0}}.mp input:checked~.mn:after{{content:"\\2713";font-size:18px}}
.mp label:has(input:checked){{background:#EAF6EF;border-color:#9FD3B6}}.mp input:focus-visible~.mn{{outline:3px solid #F2C14E}}
.mbar{{height:10px;border-radius:99px;background:#EFE3D5;overflow:hidden;margin:4px 0 12px}}.mbar i{{display:block;height:100%;width:0;background:#2E9E6B;transition:width .4s}}
.mf{{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}}.mf label{{font-size:13px;font-weight:700;display:flex;flex-direction:column;gap:4px}}.mf input{{min-height:44px;border:1px solid #CBB9A4;border-radius:10px;padding:0 10px;font-size:16px;width:100%}}
.mr{{margin-top:12px;padding:14px;border-radius:14px;background:#12202B;color:#fff;line-height:1.5}}.mr b{{color:#F2C14E;font-size:20px}}
.me{{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px}}.mm,.mb{{border-radius:14px;padding:14px;font-size:15px;line-height:1.5}}.mm{{background:#FDECE8;border:1px solid #F1B8A9}}.mb{{background:#EAF6EF;border:1px solid #9FD3B6}}.mm b,.mb b{{display:block;font-size:12px;letter-spacing:.06em;text-transform:uppercase;margin-bottom:4px}}.mm p,.mb p{{margin:4px 0 0}}
@media(max-width:760px){{.mg,.me{{grid-template-columns:1fr}}.mw{{padding:24px 16px 56px}}}}
</style>
<section class="hx" style="background:#F3F5F7"><div class="mw">
<div class="mg"><div class="mk"><h2>Así se ve</h2>{dib}<p style="margin:8px 0 0;font-size:14px;color:#3B5168">Líneas naranjas: los tres anchos (1, 2, 3). Líneas azules: los tres altos (A, B, C).</p><div class="mcs">{nec}</div></div>
<div class="mk"><h2>Tu lista, paso a paso</h2><div class="mbar"><i id="mpb"></i></div><p id="mpt" style="margin:0 0 12px;font-weight:600">0 de 5 hechos</p><ol class="mpl">{li}</ol></div></div>
<div class="mk"><h2>Escribe tus medidas y te digo cuál manda</h2><p style="margin:0 0 10px;font-size:15px">Pon en milímetros o en centímetros, como lo hayas medido.</p>
<div class="mf"><label>Ancho 1<input id="w0" type="number" inputmode="decimal"></label><label>Ancho 2<input id="w1" type="number" inputmode="decimal"></label><label>Ancho 3<input id="w2" type="number" inputmode="decimal"></label>
<label>Alto A<input id="h0" type="number" inputmode="decimal"></label><label>Alto B<input id="h1" type="number" inputmode="decimal"></label><label>Alto C<input id="h2" type="number" inputmode="decimal"></label></div>
<div id="mres" class="mr" aria-live="polite">Rellena las seis y te digo con cuál medida pedir.</div></div>
<div class="mk"><h2>Tres errores comunes</h2>{er}<p style="margin:0">Más sobre el proceso en <a class="l" href="/blog/instalacion-ventanas-pvc">cómo se instala una ventana de PVC</a> y en el <a class="l" href="/glosario#hueco">glosario</a>.</p></div>
<div class="card" style="gap:14px;background:#12202B;color:#fff"><h3 style="margin:0;font-size:22px">Ya tengo las medidas</h3><p style="margin:0;color:#D3DBE2">Ponlas en la calculadora para ver un precio, o mándanos las fotos por WhatsApp y te contestamos.</p><div style="display:flex;flex-wrap:wrap;gap:12px"><a class="b1" href="/configurador">Calcular mi precio</a><a href="{WA}" style="display:inline-flex;align-items:center;min-height:54px;padding:0 22px;border-radius:6px;border:1px solid #5B6B78;color:#fff;text-decoration:none;font-weight:600">Mandar fotos por WhatsApp</a></div></div>
</div></section>{CSS}
<script>
(function(){{
var c=document.querySelectorAll('.mp input'),b=document.getElementById('mpb'),t=document.getElementById('mpt');
function p(){{var n=0;c.forEach(function(x){{if(x.checked)n++;}});b.style.width=(n*20)+'%';t.textContent=n+' de 5 hechos'+(n==5?' - ¡listo!':'');}}
c.forEach(function(x){{x.addEventListener('change',p);}});
var r=document.getElementById('mres');
function f(){{var w=[],h=[],i,v;for(i=0;i<3;i++){{v=parseFloat(document.getElementById('w'+i).value);if(v>0)w.push(v);v=parseFloat(document.getElementById('h'+i).value);if(v>0)h.push(v);}}
if(w.length<3||h.length<3){{r.textContent='Rellena las seis y te digo con cuál medida pedir.';return;}}
var mw=Math.min.apply(null,w),mh=Math.min.apply(null,h),dw=Math.max.apply(null,w)-mw,dh=Math.max.apply(null,h)-mh,k=Math.max(dw/mw,dh/mh)>0.01;
r.innerHTML='Pide con <b>'+mw+' x '+mh+'</b> (ancho x alto, la más pequeña de cada una).'+(k?' Ojo: hay más de un 1 % de diferencia entre tus medidas, la pared no está a escuadra. Mejor que lo veamos en persona.':' Tus medidas son muy parecidas: buena señal.');}}
document.querySelectorAll('.mf input').forEach(function(x){{x.addEventListener('input',f);}});
}})();
</script>"""
    return ("/como-medir-ventanas", "como-medir-ventanas.html", "Cómo medir tus ventanas para pedir presupuesto | AMS Cerramientos",
            "Guía en cinco pasos para medir el hueco de tus ventanas, con dibujo, lista para ir marcando y calculadora de la medida que manda. La medición definitiva la hacemos gratis.", body)


def p_permisos():
    sel = lambda ident, items: f'<select id="{ident}">' + "".join(f'<option value="{v}">{t}</option>' for v, t in items) + '</select>'
    lab = lambda t, i: f'<label for="{i}" style="font-weight:700">{t}</label>'
    body = hero("Permisos para cerrar tu terraza", "¿Necesito permiso para cerrar mi terraza?",
        "Tres preguntas y te decimos qué conviene tener resuelto antes de encargar. Es una guía orientativa: lo concreto depende de tu comunidad y de tu ayuntamiento.")
    body += f'''<section class="hx" style="background: #F3F5F7"><div style="max-width: 820px; margin: 0 auto; padding: 40px 24px 72px; display: flex; flex-direction: column; gap: 24px">
<div class="card" style="gap: 14px">
{lab("¿Dónde está la terraza?", "pt")}{sel("pt", [("edif", "En un piso, en un edificio con comunidad"), ("casa", "En una casa o chalet")])}
{lab("¿Qué quieres hacer?", "pq")}{sel("pq", [("cerrar", "Cerrar con cristal o aluminio"), ("pergola", "Poner una pérgola o un toldo"), ("ventanas", "Solo cambiar las ventanas")])}
{lab("¿En qué municipio?", "pm")}{sel("pm", [("alcala", "Alcalá de Henares"), ("otro", "Otro municipio")])}
</div>
<div id="pe-out" style="display:flex;flex-direction:column;gap:16px" aria-live="polite"></div>
<p style="margin:0;font-size:14px;color:#4A5A68;line-height:1.5">Orientación general, no asesoramiento jurídico. Para tu caso confirma con la administración de tu comunidad y con el ayuntamiento. Nosotros te ayudamos con la documentación técnica (fotos, medidas y presupuesto).</p>
</div></section>{CSS}
<script>
(function(){{
var g=function(i){{return document.getElementById(i);}},o=g('pe-out');
function f(){{
var t=g('pt').value,q=g('pq').value,m=g('pm').value,L=[];
if(t==='edif'&&q!=='ventanas')L.push(['Comunidad de propietarios','Cerrar una terraza o poner una estructura cambia la fachada, que es un elemento común. Normalmente necesitas el acuerdo de la comunidad. Mira primero los estatutos y pregunta al administrador qué exigen y si ya hay un modelo aprobado en tu edificio.']);
if(t==='edif'&&q==='ventanas')L.push(['Comunidad de propietarios','Cambiar las ventanas suele afectar al aspecto de la fachada. Pregunta si hay un color y un modelo aprobados; si no, conviene respetar el aspecto actual.']);
if(q==='ventanas')L.push(['Ayuntamiento','Para cambiar ventanas en una vivienda normalmente no se pide licencia de obra mayor, pero depende del municipio y de si la fachada está protegida. Confírmalo en tu ayuntamiento.']);
else L.push(['Ayuntamiento',m==='alcala'?'En Alcalá de Henares suelen pedir una foto de la fachada, la conformidad de la comunidad (si hay) y el presupuesto. Según la obra será licencia o declaración responsable; la confirmas en la oficina de urbanismo.':'Según el municipio y la obra, puede hacer falta licencia o declaración responsable. Pregunta en la oficina de urbanismo de tu ayuntamiento.']);
if(t==='casa'&&q!=='ventanas')L.push(['Normas urbanísticas','En una casa, cerrar o cubrir una terraza puede contar como superficie construida y estar limitado por la normativa urbanística de tu parcela. Lo mira el ayuntamiento al tramitar.']);
L.push(['Qué te preparamos nosotros','Fotos y medidas de la zona, planos sencillos y un presupuesto detallado, que son lo que te van a pedir en la comunidad y en el ayuntamiento. La visita y la medición son gratis.']);
var h='';L.forEach(function(x,i){{h+='<div class="card"><span class="tag">Paso '+(i+1)+'</span><h3 style="margin:0;font-size:20px">'+x[0]+'</h3><p style="margin:0;line-height:1.6">'+x[1]+'</p></div>';}});
h+='<div class="card" style="gap:14px;background:#12202B;color:#fff"><h3 style="margin:0;font-size:22px">Empieza por la visita</h3><p style="margin:0;color:#D3DBE2">Te medimos, te preparamos la documentación y te damos un presupuesto cerrado.</p><div style="display:flex;flex-wrap:wrap;gap:12px"><a class="b1" href="/contacto">Pedir visita gratis</a><a href="/blog/precio-cerrar-terraza" style="display:inline-flex;align-items:center;min-height:54px;padding:0 22px;border-radius:6px;border:1px solid #5B6B78;color:#fff;text-decoration:none;font-weight:600">Cuánto cuesta cerrar una terraza</a></div></div>';
o.innerHTML=h;}}
['pt','pq','pm'].forEach(function(i){{g(i).addEventListener('change',f);}});f();
}})();
</script>'''
    return ("/permisos-cerrar-terraza", "permisos-cerrar-terraza.html", "¿Necesito permiso para cerrar mi terraza? Guía orientativa | AMS Cerramientos",
            "Qué conviene tener resuelto con la comunidad y el ayuntamiento antes de cerrar una terraza o cambiar ventanas en Alcalá de Henares y Madrid.", body)


def p_visualizador():
    body = hero("Visualizador", "Mira cómo quedarían tus ventanas, con tu foto",
        "Estamos preparando una herramienta que cambia tu ventana por una nueva en tu propia foto: otro color, otra apertura, con o sin persiana. Está en construcción.")
    body += f'''<section class="hx" style="background: #F3F5F7"><div style="max-width: 820px; margin: 0 auto; padding: 40px 24px 72px; display: flex; flex-direction: column; gap: 24px">
<div class="card" style="align-items:center;text-align:center;gap:16px"><span class="tag">En construcción</span>
<div style="display:grid;gap:12px;grid-template-columns:1fr 1fr;width:100%;max-width:560px"><figure style="margin:0"><img src="/img/ejemplo-ventana-antes.jpg" alt="Ventana antigua, antes" style="width:100%;border-radius:10px;display:block" loading="lazy"><figcaption style="font-size:14px;margin-top:6px;color:#4A5A68">Antes</figcaption></figure><figure style="margin:0"><img src="/img/ejemplo-ventana-despues.jpg" alt="Ventana nueva, después" style="width:100%;border-radius:10px;display:block" loading="lazy"><figcaption style="font-size:14px;margin-top:6px;color:#4A5A68">Después (ejemplo)</figcaption></figure></div>
<p style="margin:0;max-width:560px;line-height:1.6">Mientras la terminamos, puedes hacerlo a mano: mándanos una foto de tu ventana por WhatsApp y te la preparamos con el modelo que más te guste.</p>
<div style="display:flex;flex-wrap:wrap;gap:12px;justify-content:center"><a class="b1" href="{WA}?text=Hola%2C%20os%20mando%20una%20foto%20de%20mi%20ventana%20para%20ver%20c%C3%B3mo%20quedar%C3%ADa">Mandar mi foto por WhatsApp</a><a href="/configurador" style="{OUTB}">Configurar mi ventana</a></div></div>
</div></section>{CSS}'''
    return ("/visualizador", "visualizador.html", "Visualizador de ventanas con tu foto (próximamente) | AMS Cerramientos",
            "Próximamente: sube la foto de tu ventana y mira cómo quedaría con otro color, apertura o persiana. Mientras tanto, mándanosla por WhatsApp.", body)
