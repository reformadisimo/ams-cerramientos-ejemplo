import type { Modulo, Reloj, Tarea, Resumen } from "@/lib/mesaTipos";
import { ventanasDe, detalleDemo } from "@/lib/mesaDemo";

/* Pantalla principal de la mesa de control de EJEMPLO para AMS: mismas piezas que la de verdad
   (luces, qué hago hoy, relojes), con cifras INVENTADAS. Todo sale de lib/mesaDemo.ts, la misma
   fuente que la vista completa, así que las cifras coinciden. */

const nf = new Intl.NumberFormat("es-ES");
const nf1 = new Intl.NumberFormat("es-ES", { maximumFractionDigits: 1 });
const eur = (n: number) => `${nf.format(Math.round(n))} €`;
const cambio = (a: number, b: number) => (b ? `${a >= b ? "+" : "-"}${nf.format(Math.round((Math.abs(a - b) / b) * 100))} % frente a antes` : "sin dato antes");
const suma = (s: string, n: number) => { const d = new Date(`${s}T12:00:00Z`); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };

export function panelDemo(hoy: string): { temas: Modulo[]; resumen: Resumen; tareas: Tarea[]; relojes: Reloj[] } {
  const { act, ant, fichaAct, fichaAnt } = ventanasDe(hoy);
  const det = detalleDemo(suma(hoy, -28), suma(hoy, -1), hoy);
  const lupaVis = det.lupa.reduce((s, x) => s + x.visitas, 0);
  const ppv = act.sesiones ? act.vistas / act.sesiones : 0;
  const pOrt = det.lupa[0];
  const wa = det.clicsPagina.filter((c) => c.canal === "whatsapp").sort((x, y) => y.n - x.n)[0];
  const toques = det.lupa.map((l) => ({ p: l.pagina, t: l.toques_sin_respuesta[0] })).sort((x, y) => y.t[1] - x.t[1])[0];
  const adsCont = act.canales["Google Ads"], adsContAnt = ant.canales["Google Ads"];
  const cpc = adsCont ? act.inversion / adsCont : 0, cpcAnt = adsContAnt ? ant.inversion / adsContAnt : 0;
  const sinOrigen = act.canales["Directo o sin dato"];
  const camp = act.campanas;
  const peor = camp.filter((c) => c.conv === 0).sort((x, y) => y.coste - x.coste)[0];
  const mejor = camp[0];
  const fichaSube = cambio(fichaAct[0], fichaAnt[0]);
  const pideVisita = act.contactos ? Math.round((act.visitas / act.contactos) * 100) : 0;
  const nota = 4.8, resenas = 63;
  const chContactos = ant.contactos ? Math.round(((act.contactos - ant.contactos) / ant.contactos) * 100) : 0;

  const temas: Modulo[] = [
    { id: "web", titulo: "La web", ver: "Ver con la lupa", que: "Qué hace la gente en tu web y si todo funciona", luz: "ambar",
      conclusion: `3 cosas de la web para mirar. La primera: en la portada la mitad de la gente no pasa del ${pOrt.scroll_mediano} % de la página.`,
      filas: [
        { t: "Visitas con la lupa (28 días)", v: `${nf.format(lupaVis)} visitas · ${nf1.format(ppv)} páginas por visita` },
        { t: "Para mirar 1", v: `En la portada la mitad de la gente no pasa del ${pOrt.scroll_mediano} % de la página.`, luz: "ambar" },
        { t: "Para mirar 2", v: `En ${toques.p}, ${toques.t[1]} toques en la ${toques.t[0]} que no hacen nada.`, luz: "ambar" },
        { t: "Para mirar 3", v: `${sinOrigen} de los ${act.contactos} contactos llegan sin que se sepa de dónde vienen.`, luz: "ambar" },
        { t: "Lo que funciona", v: `Donde más se pulsa WhatsApp es ${wa.pagina === "/" ? "la portada" : wa.pagina}.`, luz: "verde" },
        { t: "Sistemas", v: "Todo al día", luz: "verde" },
      ], enlaces: [] },
    { id: "dicen", titulo: "Reputación e IA", ver: "Ver las consultas", que: "Tus reseñas y qué responden las inteligencias artificiales", luz: "ambar",
      conclusion: `Una reseña de 3 estrellas lleva 9 días sin contestar. Google ${nf1.format(nota)} con ${resenas} reseñas.`,
      filas: [
        { t: "Google", v: `${nf1.format(nota)} de 5 · ${resenas} opiniones (2 más que hace 5 semanas)`, luz: "verde" },
        { t: "Reseña de 3 estrellas", v: "Lleva 9 días sin contestar.", luz: "ambar" },
        { t: "Espejo de la IA", v: "Nos nombran en 3 de 10 preguntas (antes 2)", luz: "ambar" },
        { t: "Ficha de Google: veces que sale", v: `${nf.format(fichaAct[0])} (${fichaSube})`, luz: "verde" },
      ], enlaces: [] },
    { id: "mercado", titulo: "Competencia", ver: "Ver cambios", que: "Los cambios importantes de tu competencia", luz: "ambar",
      conclusion: "El competidor B baja un 10 % las ventanas de PVC hasta el 15 de noviembre.",
      filas: [
        { t: "Competidor B", v: "Baja un 10 % las ventanas de PVC hasta el 15 de noviembre. Conviene mirarlo, no copiarlo.", luz: "ambar" },
        { t: "Competidor C", v: "Estrena cancelas de aluminio en su web.", luz: "ambar" },
        { t: "Competidores A y D", v: "Sin cambios importantes.", luz: "verde" },
      ], enlaces: [] },
    { id: "anuncios", titulo: "Anuncios", ver: "Ver campañas", que: "Cuántos contactos llegan y cuánto cuestan", luz: "ambar", estado: "Medición incompleta",
      conclusion: `Google Ads dice que trajo ${act.adsConv} contactos, pero la web solo ve ${adsCont}. La medición está incompleta.`,
      filas: [
        { t: "Contactos en la web", v: `${act.contactos} (${cambio(act.contactos, ant.contactos)})`, luz: "verde" },
        { t: "Invertido en anuncios", v: `${eur(act.inversion)} (${cambio(act.inversion, ant.inversion)})` },
        { t: "Coste por contacto", v: `${eur(cpc)} (${cambio(cpc, cpcAnt)})`, luz: "ambar" },
        { t: `Google · ${mejor.nombre}`, v: `${eur(mejor.coste)} · ${mejor.conv} conversiones · ${eur(mejor.coste / Math.max(1, mejor.conv))} cada una`, luz: "verde" },
        ...(peor ? [{ t: `Google · ${peor.nombre}`, v: `${eur(peor.coste)} · 0 conversiones · sin contactos`, luz: "rojo" as const }] : []),
      ], enlaces: [] },
    { id: "tuyo", titulo: "Ventas", que: "Tus ventas y tus clientes. Lo usas si quieres", luz: "azul", estado: "En curso", ver: "Ver recorrido comercial",
      conclusion: `Hay ${act.visitas} visitas, ${act.presupuestos} presupuestos y ${act.firmas} firmas de los contactos de este periodo.`,
      filas: [
        { t: "Ventas (CRM)", v: `${act.contactos} contactos · ${act.visitas} visitas` },
        { t: "Contratos firmados", v: `${act.firmas}`, luz: "azul" },
        { t: "Índice de valor", v: "Preparado: qué trabajos valen más, sin decir cuánto facturas", luz: "azul" },
      ], enlaces: [] },
  ];

  const resumen: Resumen = { titulo: "Hay una cosa que requiere atención", texto: `Tienes ${act.sinRespuesta} contactos esperando respuesta. Cuanto antes se contestan, más presupuestos se ganan.` };

  const tareas: Tarea[] = [
    { id: "d1", texto: `Contesta a los ${act.sinRespuesta} contactos que esperan respuesta`, porque: "Llevan más de un día sin respuesta y quien pide presupuesto suele quedarse con el primero que contesta.", donde: "Ventas", ir: "tuyo", boton: "Ver los contactos" },
    { id: "d2", texto: "Contesta a la reseña de 3 estrellas", porque: "Lleva 9 días sin respuesta y la ve quien busca ventanas en Alcalá.", donde: "Reputación e IA", ir: "dicen", boton: "Ver las reseñas" },
    { id: "d3", texto: "Revisa cómo se miden los anuncios", porque: `Google Ads cuenta ${act.adsConv} contactos y la web solo ve ${adsCont}.`, donde: "Anuncios", ir: "anuncios", boton: "Ver campañas" },
  ];

  const relojes: Reloj[] = [
    { frase: `${act.contactos} personas dejaron sus datos`, detalle: `${Math.abs(chContactos)} % ${chContactos >= 0 ? "más" : "menos"} que antes.`, t: "Contactos", v: `${act.contactos}`, sub: cambio(act.contactos, ant.contactos), lleno: 0.7, luz: "verde", ayuda: "Personas distintas que han enviado un formulario desde la web. Una misma persona solo cuenta una vez al día." },
    { frase: `${act.visitas} pidieron una visita`, detalle: `Son ${pideVisita} de cada 100 personas que dejaron sus datos.`, t: "Piden la visita", v: `${pideVisita} %`, sub: "de los contactos", lleno: pideVisita / 100, luz: "verde", ayuda: "De cada 100 personas que dejaron sus datos, cuántas solicitaron una visita." },
    { frase: `Cada contacto de anuncios costó ${eur(cpc)}`, detalle: `Antes costaba ${eur(cpcAnt)}.`, t: "Coste por contacto", v: eur(cpc), sub: cambio(cpc, cpcAnt), lleno: 0.6, luz: "ambar", ayuda: "El dinero gastado en anuncios dividido entre los contactos conseguidos por esos anuncios. Cuanto más bajo, mejor." },
    { frase: `Tus clientes te valoran con un ${nf1.format(nota)}`, detalle: `Sobre 5, con ${resenas} reseñas de Google.`, t: "Nota en Google", v: nf1.format(nota), sub: `${resenas} reseñas`, lleno: nota / 5, luz: "verde", ayuda: "La valoración media que han dejado los clientes en Google, sobre 5." },
  ];
  return { temas, resumen, tareas, relojes };
}
