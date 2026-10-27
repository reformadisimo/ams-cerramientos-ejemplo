import type { Config } from "tailwindcss";

/**
 * Sistema visual de la mesa de control (copiado de Reformadísimo, igual que el original).
 * Azul corporativo: Pantone 7704 U · R50 G140 B171 · #328CAB
 * Amarillo corporativo: Pantone Yellow C · R255 G222 B0 · #FFDE00
 * Tipografía: Roboto (Light / Regular / Medium)
 */
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        teal: "#2C7C98", // 10-oct (cl·v609): antes #328CAB; un punto más hondo para leerse bien en texto pequeño (contraste AA)
        "teal-deep": "#236278",
        "teal-mid": "#5AAABF",
        "teal-soft": "#8CC4D3",
        "teal-pale": "#C5E2EB",
        "teal-dark": "#1a3d47",
        ink: "#1a3d47",
        yellow: "#FFDE00",
        cream: "#FBFAF7",
        // 25-oct (cl·v799): arena rosada para los bloques que pasan de oscuro a claro (más cálido y acogedor)
        arena: "#F6EDE6",
        "arena-deep": "#EADBD0",
        paper: "#fffdf9",
        line: "#e9e2d4",
        amber: "#b8924a",
        "amber-deep": "#7c5e27",
        "amber-soft": "#efe2c4",
        "amber-line": "#e6d5b0",
        brown: "#5e3a1f",
      },
      fontFamily: {
        // cl·v612: "Roboto Fallback" va aparte (globals.css), con las mismas medidas de siempre
        sans: ["var(--font-roboto)", '"Roboto Fallback"', "system-ui", "sans-serif"],
        // 25-oct (cl·v799): los titulares vuelven a la letra de revista de la marca (Lora)
        serif: ["var(--font-lora)", "Georgia", '"Times New Roman"', "serif"],
        bitter: ["var(--font-lora)", "Georgia", '"Times New Roman"', "serif"],
      },
      borderRadius: { cta: "4px" },
      maxWidth: { content: "1180px", prose: "720px" },
      lineHeight: { relaxed: "1.65" },
    },
  },
  plugins: [],
};
export default config;
