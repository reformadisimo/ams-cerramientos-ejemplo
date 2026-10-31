/* ── La parte soñadora de la mesa de control (27-oct, cl·v916) ──
   Aquí el dueño manda: mueve deslizadores, marca su meta y nos pone a prueba. Todo son ESTIMACIONES hechas con
   sus cifras de los últimos 28 días y con supuestos a la vista (se pueden cambiar). Nunca promesas.
   Sin importaciones de servidor ni de otros ficheros de la mesa salvo Alegria.tsx: se copia tal cual a otro proyecto.
   Lo que el dueño escribe se guarda solo en su navegador (localStorage); el correo lo manda él si quiere. */
"use client";
import { useEffect, useMemo, useState } from "react";
import { Loseta, C, CORREO_ERRORES, MetaDelMes, Adivina, Insignias, CerrarYVolver } from "@/components/mesa/Alegria";
import type { Pregunta } from "@/components/mesa/Alegria";

/** Cifras base de los últimos 28 días con las que juega todo este fichero. Las calcula el servidor (panelCliente.ts)
    o vienen de ejemplo (panelDemo.ts). Si falta algo, cada juego lo dice y usa un supuesto a la vista. */
export type CifrasBase = {
  dias: number;              // días del periodo (28)
  coste: number;             // invertido en anuncios en el periodo (€)
  contactosAnuncios: number; // contactos que las plataformas atribuyen a los anuncios
  contactos: number;         // contactos totales en la web
  visitasPedidas: number;    // de esos, los que pidieron la visita
  leadsCrm?: number;         // contactos en el CRM del periodo
  firmas?: number;           // contratos firmados de esos contactos (CRM)
  ticket?: number;           // importe medio firmado por cliente (€); si no hay, se usa un supuesto
  medicionIncompleta?: boolean; // si los anuncios no se pueden atribuir bien, se avisa más
};

/* Miles con punto siempre (es-ES no lo pone en 4 cifras: "9000" se lee peor que "9.000"). */
const num = (n: number) => String(Math.round(Math.abs(n))).replace(/\B(?=(\d{3})+(?!\d))/g, ".").replace(/^/, n < 0 ? "-" : "");
const eur = (n: number) => `${num(n)} €`;
const pct = (n: number) => `${Math.round(n)} %`;
const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
const fecha = (d: string) => { const [, m, dd] = d.split("-"); return `${Number(dd)} de ${MESES[Number(m) - 1] ?? m}`; };
const lee = <T,>(k: string, v: T): T => { try { const s = localStorage.getItem(k); return s ? (JSON.parse(s) as T) : v; } catch { return v; } };
const guarda = (k: string, v: unknown) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* sin memoria, no pasa nada */ } };

/* ── El modelo (a la vista, para que nadie se crea que es magia) ──
   Cada euro de más rinde menos que el anterior: por encima del gasto actual, los contactos crecen con la
   potencia 0,65 del gasto (doblar la inversión trae ~57 % más contactos, no el doble). Por debajo, en línea recta.
   Es una regla general de los anuncios, no una medición de esta empresa; por eso es una estimación. */
const CURVA = 0.65;
const contactosCon = (gasto: number, base: CifrasBase, cplSupuesto: number) => {
  if (base.coste > 0 && base.contactosAnuncios > 0) {
    const r = gasto / base.coste;
    return base.contactosAnuncios * (r <= 1 ? r : Math.pow(r, CURVA));
  }
  return gasto / cplSupuesto;
};
const gastoPara = (contactos: number, base: CifrasBase, cplSupuesto: number) => {
  if (base.coste > 0 && base.contactosAnuncios > 0) {
    const r = contactos / base.contactosAnuncios;
    return base.coste * (r <= 1 ? r : Math.pow(r, 1 / CURVA));
  }
  return contactos * cplSupuesto;
};

function Aviso({ texto }: { texto?: string }) {
  return (
    <p className="mt-3 flex items-start gap-2 rounded-[12px] bg-[#fff4d6] px-3 py-2 text-[13.5px] leading-snug text-ink/80">
      <Loseta n="escudo" color={C.dinero} tam={26} />
      <span>{texto ?? "Son estimaciones hechas con tus cifras de los últimos 28 días y con supuestos que puedes cambiar. La realidad (y la IA) se pueden equivocar: sirven para pensar, no para decidir a ciegas."}</span>
    </p>
  );
}

function Desliza({ etiqueta, valor, min, max, paso, texto, onChange, color }: { etiqueta: string; valor: number; min: number; max: number; paso: number; texto: string; onChange: (n: number) => void; color: string }) {
  return (
    <label className="block">
      <span className="flex items-baseline justify-between gap-3 text-[14.5px] font-semibold text-ink"><span>{etiqueta}</span><span className="font-serif text-[20px] italic" style={{ color }}>{texto}</span></span>
      <input type="range" min={min} max={max} step={paso} value={valor} onChange={(e) => onChange(Number(e.target.value))} className="mt-1 h-11 w-full cursor-pointer" style={{ accentColor: color }} aria-label={etiqueta} />
    </label>
  );
}

function Cifra({ t, v, color, sub }: { t: string; v: string; color: string; sub?: string }) {
  return (
    <div className="rounded-[14px] border border-line bg-white px-3 py-2.5">
      <p className="text-[12.5px] font-semibold uppercase tracking-wide text-ink/55">{t}</p>
      <p className="font-serif text-[24px] italic leading-tight" style={{ color }}>{v}</p>
      {sub && <p className="text-[12.5px] text-ink/60">{sub}</p>}
    </div>
  );
}

/* ───────────────────────── 1) ¿Y si…? (el simulador) ───────────────────────── */
export function YSi({ base, demo }: { base: CifrasBase; demo?: boolean }) {
  const sinAnuncios = !(base.coste > 0 && base.contactosAnuncios > 0);
  const [cpl, setCpl] = useState(80);           // supuesto si no hay anuncios medidos
  const [ticket, setTicket] = useState(base.ticket && base.ticket > 0 ? Math.round(base.ticket) : 40000);
  const tasaReal = base.leadsCrm && base.firmas ? base.firmas / base.leadsCrm : 0;
  const [tasa, setTasa] = useState(tasaReal > 0 ? Math.round(tasaReal * 100) : 8); // de cada 100 contactos, cuántos firman
  const [verSupuestos, setVerSupuestos] = useState(false);
  const costeMes = sinAnuncios ? 2000 : Math.round((base.coste / base.dias) * 30);
  const [gasto, setGasto] = useState(costeMes);
  const [seo, setSeo] = useState(0);
  useEffect(() => { setGasto(costeMes); }, [costeMes]);

  const r = useMemo(() => {
    const factorMes = 30 / base.dias;
    const organicosHoy = Math.max(0, base.contactos - base.contactosAnuncios) * factorMes; // contactos que no vienen de anuncios, al mes
    const anunciosHoy = (sinAnuncios ? 0 : base.contactosAnuncios) * factorMes;
    const pide = base.contactos ? base.visitasPedidas / base.contactos : 0.4;
    const deAnuncios = contactosCon(gasto / factorMes, base, cpl) * factorMes;
    const organicos = organicosHoy * (1 + seo / 100);
    const total = deAnuncios + organicos;
    const totalHoy = anunciosHoy + organicosHoy;
    const obras = total * (tasa / 100);
    const cplAhora = deAnuncios > 0 ? gasto / deAnuncios : 0;
    // con el SEO subido, ¿cuánto anuncio podrías quitar manteniendo los contactos de hoy?
    const faltan = Math.max(0, totalHoy - organicos);
    const gastoNecesario = Math.min(gasto, gastoPara(faltan / factorMes, base, cpl) * factorMes);
    const ahorro = Math.max(0, gasto - gastoNecesario);
    return { total, totalHoy, deAnuncios, organicos, pide, obras, cplAhora, ahorro, gastoNecesario, factura: obras * ticket };
  }, [gasto, seo, base, cpl, tasa, ticket, sinAnuncios]);

  const color = C.camino;
  return (
    <article className="rounded-[20px] border border-line bg-white px-4 py-4" aria-label="Y si">
      <div className="flex items-start gap-3">
        <Loseta n="mando" color={color} tam={44} />
        <div>
          <h3 className="font-serif text-[21px] italic leading-tight text-ink">¿Y si…?</h3>
          <p className="mt-0.5 text-[14px] text-ink/65">Mueve y mira qué pasaría. Sin compromiso: aquí se sueña.</p>
        </div>
      </div>
      <div className="mt-4 space-y-4">
        <Desliza etiqueta="Invierto en anuncios al mes" valor={gasto} min={0} max={Math.max(costeMes * 3, 3000)} paso={100} texto={eur(gasto)} onChange={setGasto} color={C.anuncios} />
        <Desliza etiqueta="Y el SEO sube en 3 a 6 meses" valor={seo} min={0} max={150} paso={10} texto={seo ? `+${pct(seo)} visitas` : "igual que hoy"} onChange={setSeo} color={C.mercado} />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Cifra t="Contactos al mes" v={num(r.total)} color={C.ventas} sub={`hoy, unos ${num(r.totalHoy)} al mes`} />
        <Cifra t="Piden visita" v={num(r.total * r.pide)} color={C.web} sub={`${pct(r.pide * 100)} de los contactos`} />
        <Cifra t="Pedidos" v={num(r.obras)} color={C.camino} sub={`${tasa} de cada 100 firman`} />
        <Cifra t="Facturación" v={eur(r.factura)} color={C.dinero} sub={`a ${eur(ticket)} por pedido`} />
      </div>
      <p className="mt-3 text-[14.5px] leading-snug text-ink/80">
        {gasto > 0 ? <>Con <strong>{eur(gasto)}</strong> al mes, cada contacto de anuncios saldría a unos <strong>{eur(r.cplAhora)}</strong>. </> : <>Sin anuncios, te quedarías con los contactos que llegan solos: unos <strong>{num(r.organicos)}</strong> al mes. </>}
        {gasto > costeMes * 1.5 && "Ojo: cuanto más inviertes, menos rinde cada euro de más (por eso no sube en línea recta). "}
        {seo > 0 && (r.ahorro > 50 ? <>Si el SEO sube un {pct(seo)}, podrías bajar los anuncios hasta <strong>{eur(r.gastoNecesario)}</strong> al mes y mantener los contactos de hoy: <strong>{eur(r.ahorro)}</strong> al mes que te ahorras.</> : <>Con el SEO un {pct(seo)} arriba tendrías unos {num(r.organicos)} contactos al mes sin pagar anuncios.</>)}
      </p>
      {base.medicionIncompleta && <p className="mt-2 text-[13.5px] text-[#9a6b00]">La medición de los anuncios está incompleta: estas cifras valen para jugar, no para quitar campañas.</p>}
      {sinAnuncios && <p className="mt-2 text-[13.5px] text-ink/65">No hay anuncios medidos en estos 28 días, así que uso un supuesto de {eur(cpl)} por contacto (cámbialo abajo).</p>}
      <button type="button" onClick={() => setVerSupuestos(!verSupuestos)} aria-expanded={verSupuestos} className="mt-3 min-h-[44px] rounded-full border border-line bg-cream px-4 text-[14px] font-semibold text-ink">{verSupuestos ? "Ocultar cómo lo calculo" : "Cómo lo calculo (y cambiar los supuestos)"}</button>
      {verSupuestos && (
        <div className="mt-2 rounded-[14px] bg-cream px-3 py-3 text-[14px] leading-snug text-ink/80">
          <p>Parto de tus 28 días: {eur(base.coste)} en anuncios, {num(base.contactosAnuncios)} contactos de anuncios, {num(base.contactos)} contactos en total y {num(base.visitasPedidas)} visitas pedidas. Por encima del gasto de hoy, cada euro de más rinde menos (doblar la inversión trae un 57 % más, no el doble). Es una regla general, no una medición tuya.</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            <label className="block text-[13px] font-semibold">De cada 100 contactos, firman<input type="number" min={1} max={60} value={tasa} onChange={(e) => setTasa(Math.max(1, Math.min(60, Number(e.target.value) || 1)))} className="mt-1 min-h-[44px] w-full rounded-[10px] border border-line bg-white px-3 text-[15px] font-normal" />{tasaReal > 0 ? <span className="font-normal text-ink/55">Tu CRM dice {Math.round(tasaReal * 100)}.</span> : <span className="font-normal text-ink/55">Supuesto: tu CRM aún no tiene firmas de este periodo.</span>}</label>
            <label className="block text-[13px] font-semibold">Cada pedido, de media (€)<input type="number" min={500} step={500} value={ticket} onChange={(e) => setTicket(Math.max(500, Number(e.target.value) || 500))} className="mt-1 min-h-[44px] w-full rounded-[10px] border border-line bg-white px-3 text-[15px] font-normal" />{base.ticket ? <span className="font-normal text-ink/55">Media de tu CRM.</span> : <span className="font-normal text-ink/55">Supuesto.</span>}</label>
            {sinAnuncios && <label className="block text-[13px] font-semibold">Coste por contacto supuesto (€)<input type="number" min={5} step={5} value={cpl} onChange={(e) => setCpl(Math.max(5, Number(e.target.value) || 5))} className="mt-1 min-h-[44px] w-full rounded-[10px] border border-line bg-white px-3 text-[15px] font-normal" /></label>}
          </div>
        </div>
      )}
      <Retrovisor base={base} cpl={cpl} />
      <Aviso />
      {demo && <p className="mt-2 text-[12.5px] font-semibold text-ink/50">Ejemplo con cifras inventadas.</p>}
    </article>
  );
}

/** "Si hubiera invertido más": mirar atrás con las mismas reglas. */
function Retrovisor({ base, cpl }: { base: CifrasBase; cpl: number }) {
  const [mas, setMas] = useState<number | null>(null);
  const opciones = [25, 50, 100];
  const sinAnuncios = !(base.coste > 0 && base.contactosAnuncios > 0);
  return (
    <div className="mt-4 rounded-[14px] border border-dashed border-line px-3 py-3">
      <p className="flex items-center gap-2 text-[14.5px] font-semibold text-ink"><Loseta n="historia" color={C.ia} tam={28} />Y si en estos 28 días hubiera invertido…</p>
      <p className="mt-2 flex flex-wrap gap-2">
        {opciones.map((o) => <button key={o} type="button" aria-pressed={mas === o} onClick={() => setMas(mas === o ? null : o)} className={`min-h-[44px] rounded-full border px-4 text-[14px] font-semibold ${mas === o ? "border-ink bg-ink text-white" : "border-line bg-white text-ink"}`}>un {o} % más</button>)}
      </p>
      {mas !== null && (() => {
        const gasto = sinAnuncios ? 1000 * (1 + mas / 100) : base.coste * (1 + mas / 100);
        const c = contactosCon(gasto, base, cpl);
        const extra = c - (sinAnuncios ? 0 : base.contactosAnuncios);
        return <p className="mt-2 text-[14.5px] leading-snug text-ink/80">Habrías gastado <strong>{eur(gasto)}</strong> (en vez de {eur(base.coste)}) y, según la regla, habrían llegado unos <strong>{num(extra)} contactos más</strong> ({num(c)} en total de anuncios). Cada uno de esos contactos extra te habría costado unos {eur(extra > 0 ? (gasto - base.coste) / extra : 0)}: más caro que los de ahora, porque los primeros euros son siempre los que mejor rinden.</p>;
      })()}
    </div>
  );
}

/* ───────────────────────── 2) Tu meta, tu sueño ───────────────────────── */
type Meta = { id: string; tipo: string; cifra: number; plazo: number; texto: string; creada: string; linea?: string };
const TIPOS: Record<string, { t: string; unidad: string; icono: string; color: string }> = {
  obras: { t: "Pedidos al año", unidad: "pedidos", icono: "casa", color: C.ventas },
  factura: { t: "Facturación al año", unidad: "€", icono: "moneda", color: C.dinero },
  contactos: { t: "Presupuestos al mes", unidad: "presupuestos", icono: "persona", color: C.web },
  ticket: { t: "Importe medio por pedido", unidad: "€ por pedido", icono: "estrella", color: C.camino },
  otro: { t: "Otra cosa", unidad: "", icono: "rayo", color: C.ia },
};

export function TuMeta({ base, demo, nombreEmpresa = "nuestra empresa", notaPublico, lineas = [], capacidadTexto = "¿Cuántos trabajos puedes instalar al mes?" }: { base: CifrasBase; demo?: boolean; nombreEmpresa?: string; notaPublico?: string; lineas?: string[]; capacidadTexto?: string }) {
  const [metas, setMetas] = useState<Meta[]>([]);
  const [tipo, setTipo] = useState("obras");
  const [cifra, setCifra] = useState("");
  const [plazo, setPlazo] = useState("");
  const [texto, setTexto] = useState("");
  const [linea, setLinea] = useState("");
  const [capacidad, setCapacidad] = useState("");
  const [resultado, setResultado] = useState<Meta | null>(null);
  useEffect(() => { setMetas(lee<Meta[]>("rd-mesa-metas", [])); setCapacidad(lee<string>("rd-mesa-capacidad", "")); }, []);
  const guardaCapacidad = (v: string) => { setCapacidad(v); guarda("rd-mesa-capacidad", v); };

  const ritmo = useMemo(() => {
    const mes = 30 / base.dias;
    const contactosMes = base.contactos * mes;
    const tasa = base.leadsCrm && base.firmas ? base.firmas / base.leadsCrm : 0.08;
    const ticket = base.ticket && base.ticket > 0 ? base.ticket : 40000;
    const obrasMes = contactosMes * tasa;
    return { contactosMes, obrasMes, obrasAno: obrasMes * 12, facturaAno: obrasMes * 12 * ticket, ticket, tasa, supuestoTasa: !(base.leadsCrm && base.firmas), supuestoTicket: !base.ticket };
  }, [base]);

  function analiza(m: Meta) {
    const T = TIPOS[m.tipo];
    const esSueno = !(m.cifra > 0) || !(m.plazo > 0) || m.tipo === "otro";
    if (m.tipo === "ticket") {
      const hoy = ritmo.ticket;
      const veces = m.cifra / hoy;
      return {
        titulo: esSueno ? "Hoy es un sueño. Vamos a darle forma." : veces <= 1.2 ? "Objetivo a mano" : veces <= 3 ? "Objetivo ambicioso: se consigue cambiando de público" : "Un sueño grande: otra empresa dentro de la tuya",
        lineas: [
          `Hoy cada cliente gasta de media ${eur(hoy)}${ritmo.supuestoTicket ? " (supuesto; el CRM aún no tiene firmas de este periodo)" : " (según tu CRM)"}. Quieres clientes de ${eur(m.cifra)}: ${veces.toFixed(1).replace(".", ",")} veces más.`,
          "Esto no se consigue invirtiendo más en los mismos anuncios: se consigue hablando a otra gente. Haría falta una página distinta para ese cliente (otras fotos, otros precios, otro tono), campañas dirigidas a ese público y una prueba A/B para medir si responde.",
          "Puedes tener las dos cosas a la vez: la mayoría de clientes de hoy y una parte de clientes de más nivel. Dinos qué reparto quieres (por ejemplo, 80 y 20) y lo montamos por separado para que cada público vea lo suyo.",
          veces > 3 ? "Con una diferencia tan grande, lo honesto es decirte que es casi otra marca: se puede, pero lleva meses y un presupuesto propio. Mejor empezar con un escalón intermedio." : "En 3 a 6 meses se puede saber si ese público responde; con un escalón intermedio el camino es más corto.",
          ...(notaPublico ? [notaPublico] : []),
        ],
      };
    }
    const hoyAno = m.tipo === "obras" ? ritmo.obrasAno : m.tipo === "factura" ? ritmo.facturaAno : ritmo.contactosMes;
    const u = m.tipo === "factura" ? eur : (n: number) => `${num(n)} ${T.unidad}`;
    if (esSueno) {
      return {
        titulo: "Hoy es un sueño. Vamos a convertirlo en objetivo.",
        lineas: [
          "Un objetivo tiene cifra y plazo; un sueño todavía no. Ponle los dos y te decimos cuánto costaría llegar.",
          m.tipo !== "otro" ? `Para que te sitúes: al ritmo de hoy vas a ${u(hoyAno)}${m.tipo === "contactos" ? "" : " al año"}${ritmo.supuestoTasa && m.tipo !== "contactos" ? " (con una tasa de firma supuesta del 8 %, tu CRM aún no tiene firmas de este periodo)" : ""}.` : "Cuéntanoslo con tus palabras y lo convertimos juntos en algo medible.",
        ],
      };
    }
    const veces = m.cifra / Math.max(hoyAno, 0.0001);
    const contactosNecesarios = ritmo.contactosMes * veces;
    const mesesAlRitmo = m.tipo === "contactos" ? null : Math.round((m.cifra / Math.max(hoyAno / 12, 0.0001)));
    const gastoHoyMes = (base.coste / base.dias) * 30;
    const extraAnuncios = base.coste > 0 && base.contactosAnuncios > 0 ? gastoPara(base.contactosAnuncios * veces, base, 80) * (30 / base.dias) : contactosNecesarios * 80;
    const cap = Number(capacidad) || 0;
    const obrasMesMeta = m.tipo === "obras" ? m.cifra / 12 : m.tipo === "factura" ? m.cifra / 12 / ritmo.ticket : m.tipo === "contactos" ? m.cifra * ritmo.tasa : 0;
    const topeCap = cap > 0 && obrasMesMeta > cap ? `Tope de capacidad: hoy caben ${num(cap)} instalaciones al mes y esta meta pide unas ${num(obrasMesMeta)}. Para llegar a esa cifra haría falta otro equipo de montaje o más plazo; no te traeremos más de lo que puedes atender bien.` : "";
    return {
      titulo: topeCap ? "Objetivo que supera tu capacidad de hoy" : veces <= 1.05 ? "Ya vas camino: es cuestión de mantenerlo" : veces <= 1.6 ? "Objetivo realista con un empujón" : veces <= 3 ? "Objetivo ambicioso: hay que cambiar cosas" : "Hoy es más sueño que objetivo (y está bien soñar)",
      lineas: [
        `Al ritmo de hoy vas a ${u(hoyAno)}${m.tipo === "contactos" ? "" : " al año"}. Quieres ${u(m.cifra)} en ${m.plazo} ${m.plazo === 1 ? "mes" : "meses"}: ${veces.toFixed(1).replace(".", ",")} veces lo de ahora.`,
        mesesAlRitmo && m.tipo !== "contactos" ? `Sin cambiar nada, esa cifra acumulada llegaría en unos ${mesesAlRitmo} meses (${mesesAlRitmo <= m.plazo ? "dentro de plazo" : "fuera de plazo"}).` : "",
        veces > 1.05 ? `Haría falta pasar de ${num(ritmo.contactosMes)} a unos ${num(contactosNecesarios)} contactos al mes. Solo con anuncios (y cada euro de más rinde menos) serían unos ${eur(extraAnuncios)} al mes en vez de ${eur(gastoHoyMes)}: ${veces <= 1.6 ? "asumible" : veces <= 3 ? "mucho; mejor combinarlo con SEO, reseñas y una web que convierta más" : "demasiado; por aquí no se llega solo con anuncios. Haría falta otro público, otra oferta u otra zona"}.` : "Lo importante aquí es no bajar la guardia: mantener los anuncios que funcionan y cuidar las reseñas.",
        ritmo.supuestoTasa && m.tipo !== "contactos" ? "Cuenta con una tasa de firma supuesta del 8 %, porque tu CRM aún no tiene firmas de este periodo. Con firmas reales el cálculo se afina solo." : "",
        topeCap,
        m.linea ? `Para «${m.linea}» hace falta su propia página y su propia campaña: cada tipo de trabajo se vende con sus fotos y sus palabras.` : "",
      ].filter(Boolean),
    };
  }

  function enviar(e: React.FormEvent) {
    e.preventDefault();
    const m: Meta = { id: String(Date.now()), tipo, cifra: Number(cifra) || 0, plazo: Number(plazo) || 0, texto: texto.trim(), creada: new Date().toISOString().slice(0, 10), linea: linea || undefined };
    setResultado(m);
    if (m.cifra > 0 || m.texto) { const l = [m, ...metas].slice(0, 6); setMetas(l); guarda("rd-mesa-metas", l); }
  }
  const quita = (id: string) => { const l = metas.filter((m) => m.id !== id); setMetas(l); guarda("rd-mesa-metas", l); if (resultado?.id === id) setResultado(null); };
  const an = resultado ? analiza(resultado) : null;
  const T = TIPOS[tipo];
  const mailto = (m: Meta) => `mailto:${CORREO_ERRORES}?subject=${encodeURIComponent("Mi meta para " + nombreEmpresa)}&body=${encodeURIComponent(`Hola. Esta es mi meta:\n\n${TIPOS[m.tipo].t}: ${m.cifra ? num(m.cifra) + " " + TIPOS[m.tipo].unidad : "(sin cifra)"}\nPlazo: ${m.plazo ? m.plazo + " meses" : "(sin plazo)"}\n${m.linea ? "Tipo de obra: " + m.linea + "\n" : ""}${m.texto ? "Con mis palabras: " + m.texto + "\n" : ""}\n¿Qué haría falta para llegar?`)}`;

  return (
    <article className="rounded-[20px] border border-line bg-white px-4 py-4" aria-label="Tu meta">
      <div className="flex items-start gap-3">
        <Loseta n="catalejo" color={C.mercado} tam={44} />
        <div>
          <h3 className="font-serif text-[21px] italic leading-tight text-ink">Tu meta, tu sueño</h3>
          <p className="mt-0.5 text-[14px] text-ink/65">Dinos hasta dónde quieres llegar. Si lo sabemos, te ayudamos a llegar (o te decimos, con cariño, qué falta).</p>
        </div>
      </div>
      <form onSubmit={enviar} className="mt-4 grid gap-3 sm:grid-cols-2">
        <fieldset className="block text-[13px] font-semibold text-ink sm:col-span-2"><legend>Quiero llegar a</legend>
          <span className="mt-1.5 flex flex-wrap gap-2">
            {Object.entries(TIPOS).map(([k, v]) => <button key={k} type="button" aria-pressed={tipo === k} onClick={() => setTipo(k)} className={`inline-flex min-h-[44px] items-center gap-2 rounded-full border py-1 pl-1.5 pr-3.5 text-[14px] font-semibold ${tipo === k ? "border-ink bg-ink text-white" : "border-line bg-white text-ink"}`}><Loseta n={v.icono} color={tipo === k ? "#ffffff55" : v.color} tam={30} />{v.t}</button>)}
          </span>
        </fieldset>
        {tipo !== "otro" && <label className="block text-[13px] font-semibold text-ink">Cifra ({T.unidad})<input inputMode="numeric" value={cifra} onChange={(e) => setCifra(e.target.value.replace(/[^\d]/g, ""))} placeholder={tipo === "factura" ? "3000000" : tipo === "ticket" ? "100000" : "50"} className="mt-1 min-h-[44px] w-full rounded-[10px] border border-line bg-cream px-3 text-[16px] font-normal" /></label>}
        {tipo !== "otro" && tipo !== "ticket" && <label className="block text-[13px] font-semibold text-ink">En cuántos meses<input inputMode="numeric" value={plazo} onChange={(e) => setPlazo(e.target.value.replace(/[^\d]/g, ""))} placeholder="12" className="mt-1 min-h-[44px] w-full rounded-[10px] border border-line bg-cream px-3 text-[16px] font-normal" /></label>}
        {lineas.length > 0 && tipo !== "otro" && <fieldset className="block text-[13px] font-semibold text-ink sm:col-span-2"><legend>¿De qué tipo de trabajo? (opcional)</legend>
          <span className="mt-1.5 flex flex-wrap gap-2">{lineas.map((l) => <button key={l} type="button" aria-pressed={linea === l} onClick={() => setLinea(linea === l ? "" : l)} className={`min-h-[44px] rounded-full border px-3.5 text-[14px] font-semibold ${linea === l ? "border-ink bg-ink text-white" : "border-line bg-white text-ink"}`}>{l}</button>)}</span>
        </fieldset>}
        <label className="block text-[13px] font-semibold text-ink">{capacidadTexto}<input inputMode="numeric" value={capacidad} onChange={(e) => guardaCapacidad(e.target.value.replace(/[^\d]/g, ""))} placeholder="Por ejemplo, 8" className="mt-1 min-h-[44px] w-full rounded-[10px] border border-line bg-cream px-3 text-[16px] font-normal" /><span className="font-normal text-ink/55">Se guarda; con él te avisamos si una meta pide más de lo que cabe.</span></label>
        <label className="block text-[13px] font-semibold text-ink">Con tus palabras (opcional)<input value={texto} onChange={(e) => setTexto(e.target.value)} placeholder={tipo === "ticket" ? "Quiero clientes que gasten más, pero sin perder a los de ahora" : "Por ejemplo: abrir en otra ciudad, salir en una revista…"} className="mt-1 min-h-[44px] w-full rounded-[10px] border border-line bg-cream px-3 text-[16px] font-normal" /></label>
        <p className="sm:col-span-2"><button type="submit" className="min-h-[48px] rounded-full bg-yellow px-6 text-[15px] font-semibold text-ink">¿Es sueño u objetivo? Dímelo</button></p>
      </form>
      {an && resultado && (
        <div className="mt-3 rounded-[16px] bg-cream px-4 py-3">
          <p className="flex items-center gap-2 font-serif text-[19px] italic leading-tight text-ink"><Loseta n={TIPOS[resultado.tipo].icono} color={TIPOS[resultado.tipo].color} tam={30} />{an.titulo}</p>
          <ul className="mt-2 space-y-1.5 text-[14.5px] leading-snug text-ink/85">{an.lineas.map((l, i) => <li key={i}>{l}</li>)}</ul>
          <p className="mt-3">
            {demo ? <span className="text-[13px] font-semibold text-ink/55">Ejemplo: aquí podrías contárnoslo por correo para que lo preparemos.</span>
              : <a href={mailto(resultado)} className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-line bg-white py-1 pl-1.5 pr-4 text-[14.5px] font-semibold text-ink hover:border-ink"><Loseta n="sobre" color={C.ventas} tam={30} />Contárselo al equipo</a>}
          </p>
        </div>
      )}
      {metas.length > 0 && (
        <div className="mt-4">
          <p className="text-[13px] font-semibold uppercase tracking-wide text-ink/55">Tus metas guardadas (solo en este navegador)</p>
          <ul className="mt-2 space-y-2">
            {metas.map((m) => {
              const esSueno = !(m.cifra > 0) || (m.tipo !== "ticket" && !(m.plazo > 0)) || m.tipo === "otro";
              const hoy = m.tipo === "obras" ? ritmo.obrasAno : m.tipo === "factura" ? ritmo.facturaAno : m.tipo === "contactos" ? ritmo.contactosMes : m.tipo === "ticket" ? ritmo.ticket : 0;
              const lleno = m.cifra > 0 && hoy > 0 ? Math.min(1, hoy / m.cifra) : 0;
              return (
                <li key={m.id} className="flex items-center gap-3 rounded-[14px] border border-line px-3 py-2.5">
                  <Loseta n={TIPOS[m.tipo].icono} color={esSueno ? "#c9c2b3" : TIPOS[m.tipo].color} tam={36} />
                  <div className="min-w-0 flex-1">
                    <p className="text-[14.5px] font-semibold leading-tight text-ink">{m.linea ? `${m.linea} · ` : ""}{m.texto || TIPOS[m.tipo].t}{m.cifra ? `: ${m.tipo === "factura" || m.tipo === "ticket" ? eur(m.cifra) : num(m.cifra) + " " + TIPOS[m.tipo].unidad}` : ""}{m.plazo ? ` en ${m.plazo} meses` : ""}</p>
                    <p className="text-[12.5px] text-ink/60">{esSueno ? "Sueño (sin cifra o sin plazo)" : `Objetivo · hoy vas por el ${pct(lleno * 100)} del ritmo necesario`}</p>
                    {!esSueno && <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-line"><div className="h-full rounded-full" style={{ width: `${Math.max(3, lleno * 100)}%`, background: TIPOS[m.tipo].color }} /></div>}
                  </div>
                  <button type="button" onClick={() => setResultado(m)} className="min-h-[44px] rounded-full border border-line px-3 text-[13px] font-semibold text-ink">Ver</button>
                  <button type="button" onClick={() => quita(m.id)} aria-label="Quitar esta meta" className="grid h-11 w-11 place-items-center rounded-full border border-line text-[18px] text-ink/60">×</button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
      <Aviso texto="Lo que te decimos sale de tus cifras de 28 días y de supuestos a la vista (tasa de firma, importe por pedido). Es una orientación para hablarlo, no una promesa." />
    </article>
  );
}

/* ───────────────────────── 3) Ponnos a prueba ───────────────────────── */
type Apuesta = { desde: string; hasta: string; mesa: number; tuya: number | null };
export function PonnosAPrueba({ base, hoy, realEntre, demo }: { base: CifrasBase; hoy: string; realEntre: (desde: string, hasta: string) => number | null; demo?: boolean }) {
  const [ap, setAp] = useState<Apuesta | null>(null);
  const [tuya, setTuya] = useState("");
  const [aciertos, setAciertos] = useState<{ mesa: number; tu: number; total: number }>({ mesa: 0, tu: 0, total: 0 });
  useEffect(() => { setAp(lee<Apuesta | null>("rd-mesa-apuesta", null)); setAciertos(lee("rd-mesa-apuesta-marcador", { mesa: 0, tu: 0, total: 0 })); }, []);
  const prevision = Math.max(1, Math.round((base.contactos / base.dias) * 7));
  const suma = (d: string, n: number) => { const x = new Date(d + "T12:00:00Z"); x.setUTCDate(x.getUTCDate() + n); return x.toISOString().slice(0, 10); };

  function apostar() {
    const a: Apuesta = { desde: hoy, hasta: suma(hoy, 6), mesa: prevision, tuya: tuya ? Number(tuya) : null };
    setAp(a); guarda("rd-mesa-apuesta", a);
  }
  const terminada = ap && hoy > ap.hasta;
  const real = terminada ? realEntre(ap.desde, ap.hasta) : null;
  function cerrar() {
    if (ap && real !== null) {
      const dMesa = Math.abs(real - ap.mesa), dTu = ap.tuya !== null ? Math.abs(real - ap.tuya) : Infinity;
      const m = { mesa: aciertos.mesa + (dMesa <= dTu ? 1 : 0), tu: aciertos.tu + (dTu < dMesa ? 1 : 0), total: aciertos.total + 1 };
      setAciertos(m); guarda("rd-mesa-apuesta-marcador", m);
    }
    setAp(null); guarda("rd-mesa-apuesta", null); setTuya("");
  }
  return (
    <article className="rounded-[20px] border border-line bg-white px-4 py-4" aria-label="Ponnos a prueba">
      <div className="flex items-start gap-3">
        <Loseta n="rayo" color={C.ia} tam={44} />
        <div>
          <h3 className="font-serif text-[21px] italic leading-tight text-ink">Ponnos a prueba</h3>
          <p className="mt-0.5 text-[14px] text-ink/65"><b className="text-ink">Predice los próximos 7 días, como la mesa.</b> Luego verás quién se acercó más.</p>
        </div>
      </div>
      {!ap && (
        <div className="mt-3 rounded-[14px] bg-cream px-3 py-3">
          <p className="text-[15px] text-ink">La mesa dice: <strong>{num(prevision)} contactos</strong> del {fecha(hoy)} al {fecha(suma(hoy, 6))} (es la media de tus últimos 28 días; una semana puede variar mucho).</p>
          <div className="mt-2 flex flex-wrap items-end gap-2">
            <label className="block text-[13px] font-semibold text-ink">Tu apuesta (opcional)<input inputMode="numeric" value={tuya} onChange={(e) => setTuya(e.target.value.replace(/[^\d]/g, ""))} placeholder={String(prevision)} className="mt-1 min-h-[44px] w-32 rounded-[10px] border border-line bg-white px-3 text-[16px] font-normal" /></label>
            <button type="button" onClick={apostar} className="min-h-[44px] rounded-full bg-yellow px-5 text-[14.5px] font-semibold text-ink">Apostado</button>
          </div>
          {demo && <p className="mt-2 text-[12.5px] font-semibold text-ink/50">Ejemplo: en la mesa real, dentro de 7 días se comprueba quién acertó.</p>}
        </div>
      )}
      {ap && !terminada && (
        <div className="mt-3 rounded-[14px] bg-cream px-3 py-3 text-[15px] text-ink">
          <p>Apuesta en marcha del {fecha(ap.desde)} al {fecha(ap.hasta)}: la mesa dice <strong>{num(ap.mesa)}</strong>{ap.tuya !== null && <> y tú <strong>{num(ap.tuya)}</strong></>}. Se comprueba el día siguiente.</p>
          {demo && <p className="mt-2 text-[12.5px] font-semibold text-ink/50">Ejemplo: en la mesa real, dentro de 7 días se comprueba quién acertó. Aquí solo se guarda en tu navegador.</p>}
          <button type="button" onClick={cerrar} className="mt-2 min-h-[44px] rounded-full border border-line px-4 text-[13.5px] font-semibold text-ink">Anular la apuesta</button>
        </div>
      )}
      {ap && terminada && (
        <div className="mt-3 rounded-[14px] bg-cream px-3 py-3 text-[15px] text-ink">
          {real === null ? <p>Ya pasó la semana, pero no tengo los días completos para contarla. Hacemos otra.</p> : (() => {
            const dMesa = Math.abs(real - ap.mesa), dTu = ap.tuya !== null ? Math.abs(real - ap.tuya) : null;
            return <p>Del {fecha(ap.desde)} al {fecha(ap.hasta)} llegaron <strong>{num(real)} contactos</strong>. La mesa dijo {num(ap.mesa)} ({dMesa === 0 ? "clavado" : `se fue por ${num(dMesa)}`}){dTu !== null && <>; tú dijiste {num(ap.tuya!)} ({dTu === 0 ? "clavado" : `por ${num(dTu)}`})</>}. {dTu !== null ? (dTu < dMesa ? "Has ganado tú. Conoces tu negocio mejor que la media." : dTu === dMesa ? "Empate." : "Esta vez la mesa se acercó más.") : dMesa > ap.mesa * 0.35 ? "La mesa falló bastante: una semana suelta no se parece a la media. Por eso no decidimos con una semana." : "La mesa se acercó."}</p>;
          })()}
          <button type="button" onClick={cerrar} className="mt-2 min-h-[44px] rounded-full bg-yellow px-5 text-[14.5px] font-semibold text-ink">Otra apuesta</button>
        </div>
      )}
      {aciertos.total > 0 && <p className="mt-2 text-[13.5px] text-ink/65">Marcador: mesa {aciertos.mesa} · tú {aciertos.tu} · {aciertos.total} {aciertos.total === 1 ? "semana" : "semanas"}.</p>}
    </article>
  );
}

/* ───────────────────────── 4) ¿Qué echas de menos? ───────────────────────── */
export function QueEchasDeMenos({ demo }: { demo?: boolean }) {
  const clase = "inline-flex min-h-[44px] items-center gap-2.5 rounded-full border border-line bg-white py-1 pl-1.5 pr-4 text-[14.5px] font-semibold text-ink hover:border-ink";
  const a = (asunto: string, cuerpo: string) => `mailto:${CORREO_ERRORES}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpo)}`;
  return (
    <article className="rounded-[20px] bg-[#fbf6ea] px-4 py-4" aria-label="Qué echas de menos">
      <div className="flex items-start gap-3">
        <Loseta n="chat" color={C.ventas} tam={44} />
        <div>
          <h3 className="font-serif text-[21px] italic leading-tight text-ink">¿Qué echas de menos?</h3>
          <p className="mt-0.5 text-[14px] text-ink/65">Esta mesa se hace contigo. Pide la herramienta que te falta o cuéntanos el fallo que has visto: nos encanta arreglar cosas.</p>
        </div>
      </div>
      <p className="mt-3 flex flex-wrap gap-2">
        {demo ? <>
          <span className={clase} role="note"><Loseta n="ajustes" color={C.camino} tam={32} />Pedir una herramienta</span>
          <span className={clase} role="note"><Loseta n="campana" color={C.anuncios} tam={32} />¿Qué fallo tenemos?</span>
        </> : <>
          <a href={a("Echo de menos en la mesa", "Hola. En la mesa echo de menos:\n\n\nPara qué me serviría:\n\n")} className={clase}><Loseta n="ajustes" color={C.camino} tam={32} />Pedir una herramienta</a>
          <a href={a("Un fallo en la mesa", "Hola. He visto este fallo:\n\n\nEn qué parte estaba:\n\n")} className={clase}><Loseta n="campana" color={C.anuncios} tam={32} />¿Qué fallo tenemos?</a>
        </>}
      </p>
      {demo && <p className="mt-2 text-[12.5px] font-semibold text-ink/55">Ejemplo: aquí se abriría tu correo.</p>}
    </article>
  );
}

/* ───────────────────────── El bloque entero ───────────────────────── */
/** Un solo bloque plegado: "Cuando quieras jugar". Primero el panel; soñar, después y solo si quiere.
    Rectángulos de colores; se abre uno cada vez. Recuerda el último abierto en este navegador. */
export type Punto = { texto: string; ir?: string };
type Ficha = { id: string; t: string; sub: string; icono: string; color: string; nodo: React.ReactNode };
export function Ludoteca({ base, hoy, realEntre, demo, nombreEmpresa, notaPublico, contactos, preguntas, dolor = [], bien = [], lineas, capacidadTexto }: { dolor?: Punto[]; bien?: Punto[]; lineas?: string[]; capacidadTexto?: string; base?: CifrasBase; hoy: string; realEntre: (desde: string, hasta: string) => number | null; demo?: boolean; nombreEmpresa?: string; notaPublico?: string; contactos?: number; preguntas: Pregunta[] }) {
  const [abierta, setAbierta] = useState<string | null>(null);
  useEffect(() => { setAbierta(lee<string | null>("rd-mesa-ludoteca", null)); }, []);
  const abre = (id: string) => { const n = abierta === id ? null : id; setAbierta(n); guarda("rd-mesa-ludoteca", n); if (n) setTimeout(() => document.getElementById("ludo-" + n)?.scrollIntoView({ behavior: "auto", block: "nearest" }), 50); };
  const fichas: Ficha[] = [
    ...(base ? [
      { id: "ysi", t: "¿Y si…?", sub: "Mueve la inversión y el SEO", icono: "mando", color: C.camino, nodo: <YSi base={base} demo={demo} /> },
      { id: "sueno", t: "Tu meta, tu sueño", sub: "¿Hasta dónde quieres llegar?", icono: "catalejo", color: C.mercado, nodo: <TuMeta base={base} demo={demo} nombreEmpresa={nombreEmpresa} notaPublico={notaPublico} lineas={lineas} capacidadTexto={capacidadTexto} /> },
      { id: "prueba", t: "Ponnos a prueba", sub: "La mesa contra ti, a 7 días", icono: "rayo", color: C.anuncios, nodo: <PonnosAPrueba base={base} hoy={hoy} realEntre={realEntre} demo={demo} /> },
    ] : []),
    { id: "falta", t: "¿Qué echas de menos?", sub: "Pide una herramienta o avisa de un fallo", icono: "chat", color: C.noche, nodo: <QueEchasDeMenos demo={demo} /> },
    ...(contactos !== undefined ? [{ id: "meta", t: "Ponte una meta", sub: "Contactos cada 28 días", icono: "check", color: C.ventas, nodo: <MetaDelMes actual={contactos} /> }] : []),
    ...(preguntas.length ? [{ id: "adivina", t: "Adivina la cifra", sub: "¿Cuánto crees que ha sido?", icono: "lupa", color: C.ia, nodo: <Adivina preguntas={preguntas} /> }] : []),
    { id: "insignias", t: "Tus insignias", sub: "Las que llevas conseguidas", icono: "estrella", color: C.dinero, nodo: <Insignias /> },
  ];
  const f = fichas.find((x) => x.id === abierta) ?? null;
  const [desplegado, setDesplegado] = useState(false);
  useEffect(() => { const f = () => { if (window.location.hash === "#mesa-suenos") setDesplegado(true); }; f(); window.addEventListener("hashchange", f); return () => window.removeEventListener("hashchange", f); }, []);
  /* "Qué hago con esto": abre el apartado "Cómo está cada parte" (plegado) y dentro, la parte que duele */
  const abreParte = (id: string) => { history.replaceState(null, "", "#pl-temas"); window.dispatchEvent(new HashChangeEvent("hashchange")); setTimeout(() => window.dispatchEvent(new CustomEvent("mesa-tema", { detail: id })), 80); };
  return (
    <section className="mt-4" aria-label="Tus sueños y tus cuentas" id="mesa-suenos">
      <button type="button" aria-expanded={desplegado} aria-controls="mesa-suenos-dentro" onClick={() => setDesplegado(!desplegado)} className="flex min-h-[56px] w-full items-center gap-3 rounded-[18px] border border-line bg-white px-3 py-2 text-left hover:border-ink">
        <span className="flex -space-x-2">{fichas.slice(0, 4).map((x) => <span key={x.id} className="grid h-8 w-8 place-items-center rounded-[10px] border-2 border-white" style={{ background: x.color }}><Loseta n={x.icono} color="#ffffff33" tam={24} /></span>)}</span>
        <span className="min-w-0 flex-1"><span className="block font-serif text-[19px] italic leading-tight text-ink">Tus sueños y tus cuentas</span><span className="block text-[13px] leading-tight text-ink/60">Dónde duele, dónde vas bien y qué pasaría si… Aquí mandas tú.</span></span>
        <span className="shrink-0 rounded-full bg-yellow px-3.5 py-2 text-[13.5px] font-semibold text-ink">{desplegado ? "Cerrar" : "Abrir"}</span>
      </button>
      <div id="mesa-suenos-dentro" hidden={!desplegado}>
      {(dolor.length > 0 || bien.length > 0) && (
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {dolor.length > 0 && <div className="rounded-[14px] border border-[#f1c9c9] bg-[#fdf1f1] px-3 py-2.5"><p className="flex items-center gap-2 text-[13px] font-bold uppercase tracking-wide text-[#a3505a]"><Loseta n="campana" color={C.anuncios} tam={24} />Hoy duele</p><ul className="mt-1 space-y-1.5 text-[14.5px] leading-snug text-ink">{dolor.map((x) => <li key={x.texto}>{x.texto}{x.ir && <button type="button" onClick={() => abreParte(x.ir!)} className="ml-2 inline-flex min-h-[44px] items-center rounded-full border border-[#a3505a] bg-white px-2.5 text-[12.5px] font-semibold text-[#a3505a]">Qué hago con esto</button>}</li>)}</ul></div>}
          {bien.length > 0 && <div className="rounded-[14px] border border-[#cfe8d6] bg-[#eef8f1] px-3 py-2.5"><p className="flex items-center gap-2 text-[13px] font-bold uppercase tracking-wide text-[#1d6a42]"><Loseta n="check" color={C.aviso} tam={24} />Hoy va bien</p><ul className="mt-1 space-y-1 text-[14.5px] leading-snug text-ink">{bien.map((x) => <li key={x.texto}>{x.texto}</li>)}</ul></div>}
        </div>
      )}
      <p className="mt-3 text-[14px] text-ink/60">Elige un apartado; lo demás sigue plegado. Si trabajamos en equipo, llegamos a la luna.</p>
      <ul className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4" role="list">
        {fichas.map((x) => {
          const on = abierta === x.id;
          return (
            <li key={x.id}>
              <button type="button" aria-expanded={on} aria-controls={"ludo-" + x.id} onClick={() => abre(x.id)} className="flex min-h-[76px] w-full items-center gap-3 rounded-[16px] px-3 py-2.5 text-left text-white transition-opacity" style={{ background: x.color, opacity: abierta && !on ? 0.55 : 1, boxShadow: on ? `0 0 0 3px #fff, 0 0 0 5px ${x.color}` : "none" }}>
                <Loseta n={x.icono} color="#ffffff33" tam={36} />
                <span className="min-w-0"><span className="block text-[15px] font-semibold leading-tight">{x.t}</span><span className="block text-[12.5px] leading-tight opacity-85">{x.sub}</span></span>
              </button>
            </li>
          );
        })}
      </ul>
      {f && <div id={"ludo-" + f.id} className="mt-3">{f.nodo}<CerrarYVolver onClose={() => { setAbierta(null); guarda("rd-mesa-ludoteca", null); }} a="mesa-suenos" /></div>}
      </div>
    </section>
  );
}
