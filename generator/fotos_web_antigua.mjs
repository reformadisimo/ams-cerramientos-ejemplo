// Descarga las fotos elegidas de la web antigua, las optimiza y las guarda en public/img/web-antigua.
// Se ejecuta en GitHub Actions (el entorno de trabajo no puede salir a esa web).
import sharp from "sharp";
import { mkdirSync, writeFileSync } from "node:fs";

const BASE = "https://amscerramientos.es/wp-content/uploads/";
// [numero, nombre, ruta, ancho maximo, sin perdida]
const FOTOS = [
  [1, "cancelas-galeria", "2015/06/1-260x170.jpg", 1400, false],
  [2, "cerramientos-galeria", "2015/04/foto02-260x170.jpg", 1400, false],
  [8, "aluminio-soldado", "2015/04/ALUMINIO_SOLDADO.jpg", 1400, false],
  [10, "cancela-efecto-gris", "2019/05/cancela-aluminio-soldado-efecto-gris.jpeg", 1400, false],
  [12, "reja-mallorquina", "2015/04/rejasm_02-300x300.jpg", 1000, false],
  [16, "cristal-ahorro-energetico", "2015/03/Cristal_Ahorro_Energetico-960x340.jpg", 1400, false],
  [17, "acabados-y-calidades", "2015/03/Calidad_Destacado-960x340.jpg", 1400, false],
  [20, "ventanas-pvc-kommerling", "2023/06/KOMMERLING-Ventanas-PVC_001-960x340.webp", 1400, false],
  [21, "pergolas-alcala", "2024/01/Instalador-Pergolas-Alcala-de-Henares-960x340.webp", 1400, false],
  [22, "cancelas-aluminio", "2026/07/Cancelas-de-Aluminio-Madrid.png", 1400, false],
  [23, "cerramientos-aluminio", "2026/07/Cerramientos-de-Aluminio-Madrid.png", 1400, false],
  [24, "acristalamiento-termico", "2026/07/Aacristalamiento-termico-Madrid.png", 1400, false],
  [25, "ventanas-oscilobatientes", "2026/08/Ventanas-oscilobatientes-en-Alcala-de-Henares-130x130.jpeg", 1400, false],
  [26, "cerramientos-terrazas", "2026/08/Cerramientos-de-terrazas-2026-130x130.jpeg", 1400, false],
  [28, "kommerling-76-ad-xtrem", "2023/05/KOMMERLING76-AD-Xtrem-300x300.png", 1000, true],
  [30, "sistemas-kommerling", "2023/05/Los-sistemas-KOMMERLING-esconden-todo-un-mundo-de-posibilidades.png", 1400, true],
  [31, "colores-ventanas", "2015/03/Colores_Ventanas_Aluminio_PVC.png", 1400, true],
];

// Primero se intenta el original (sin el sufijo -AAAxBBB de miniatura); si no existe, la miniatura.
function candidatas(ruta) {
  const sinSufijo = ruta.replace(/-(\d{2,4})x(\d{2,4})(\.[a-z]+)$/i, "$3");
  const esMiniatura = sinSufijo !== ruta;
  // Las cabeceras de 960x340 son un recorte buscado: se queda el recorte.
  const recorteBuscado = /-960x340\./i.test(ruta);
  return esMiniatura && !recorteBuscado ? [sinSufijo, ruta] : [ruta];
}

async function bajar(ruta) {
  for (const r of candidatas(ruta)) {
    const url = BASE + r.split("/").map(encodeURIComponent).join("/");
    const res = await fetch(url, { headers: { "user-agent": "Mozilla/5.0" } });
    if (res.ok) return { url, buf: Buffer.from(await res.arrayBuffer()) };
    console.log("no disponible:", url, res.status);
  }
  throw new Error("No se pudo bajar " + ruta);
}

mkdirSync("public/img/web-antigua", { recursive: true });
const manifiesto = [];
for (const [n, nombre, ruta, ancho, sinPerdida] of FOTOS) {
  const { url, buf } = await bajar(ruta);
  const img = sharp(buf).rotate();
  const meta = await img.metadata();
  const salida = String(n).padStart(2, "0") + "-" + nombre + ".webp";
  const info = await img
    .resize({ width: ancho, withoutEnlargement: true })
    .webp(sinPerdida ? { nearLossless: true, quality: 90 } : { quality: 80 })
    .toFile("public/img/web-antigua/" + salida);
  manifiesto.push({ n, archivo: salida, origen: url, origenPx: meta.width + "x" + meta.height, origenBytes: buf.length, ancho: info.width, alto: info.height, bytes: info.size });
  console.log(salida, meta.width + "x" + meta.height, "->", info.width + "x" + info.height, info.size + " B");
}
writeFileSync("public/img/web-antigua/manifiesto.json", JSON.stringify(manifiesto, null, 2));
