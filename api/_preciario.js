// Preciario por defecto: solo los precios orientativos que ya publica la web.
// El preciario real de AMS NO va aquí (el repositorio es público): va en la
// variable de entorno PRECIARIO de Vercel, en formato JSON con esta misma forma.
// Lo que no venga en PRECIARIO se toma de aquí.
module.exports = {
  ventana: {
    // precio = (fijo + m2 * superficie) * factores; horquilla = precio * margen_alto
    fijo: 160,
    m2: 180,
    margen_alto: 1.35,
    material: { aluminio: 1, pvc: 1.05 },
    apertura: { corredera: 1, practicable: 1.08, oscilobatiente: 1.15 },
    vidrio: { doble: 1, termico: 1.08, acustico: 1.18, seguridad: 1.15 },
    color: { blanco: 1, color: 1.08, madera: 1.18 },
    persiana: { no: [0, 0], manual: [150, 220], motor: [320, 450] },
    mosquitera: [70, 110]
  },
  terraza: {
    // euros por m2 [bajo, alto]
    pvc: [400, 650],
    aluminio: [500, 800],
    cortina: [600, 1000],
    persiana_m2: [60, 90]
  },
  cerrajeria: {
    cancela: { fijo: 600, m2: 360, margen_alto: 1.3 },
    diseno: { lamas: 1, barrotes: 0.92, ciega: 1.1 },
    corredera: 1.15,
    motor_batiente: [700, 1100],
    motor_corredera: [600, 950],
    cerradura_electrica: [150, 250],
    reja_m2: [180, 300],
    reja_minimo: 150
  },
  iva_incluido: false,

  // Configurador profesional (/configurador). Precios sin IVA, instalado, con
  // medicion, retirada de lo viejo y escombros. Provisionales: referencia de
  // mercado (oct. 2026), por debajo de las redes nacionales de instaladores.
  configurador: {
    iva: 21,
    hoja: { fija: 45, practicable: 80, osc: 110, corredera: 60 },
    hoja_balconera_extra: 40,
    m2: {
      pvc: { eco: 125, confort: 140, premium: 168 },
      alu: { eco: 105, confort: 145, premium: 172 }
    },
    instalacion: { ventana: 85, fijo: 70, balconera: 110, corredera: 85, corredera_grande: 120 },
    vidrio_m2: { doble: 0, bajoe: 12, solar: 22, mate: 15, acustico: 30, seguridad: 35, triple: 45 },
    color: { blanco: 1, color: 1.12, bicolor: 1.18, madera: 1.22, negro: 1.28 },
    fijo_extra: 55,
    umbral_rebajado: 70,
    corredera_elevadora: 450,
    persiana: { fijo: { manual: 110, motor: 300, radio: 340, solar: 430 }, m2: 60 },
    mosquitera: { enrollable: [55, 28], plisada: [85, 35] },
    techo: {
      talla: { '55x78': 520, '55x98': 560, '66x118': 640, '78x98': 650, '78x118': 700, '78x140': 760, '114x118': 850, '114x140': 930 },
      proyectante: 120, electrica: 420, solar: 520, estor: 90, persiana_ext: 330, mosquitera: 110, hueco_nuevo: 450
    },
    claraboya: {
      talla: { '60': 620, '80': 720, '90': 780, '100': 860 },
      electrica: 600, estor: 120, hueco_nuevo: 450
    }
  }
};
