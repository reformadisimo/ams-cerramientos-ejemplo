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
  iva_incluido: false
};
