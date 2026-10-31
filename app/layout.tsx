import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { VERSION } from "@/lib/version";

/* Mismas letras que la mesa de control original (Roboto y Lora, servidas desde casa). */
const roboto = localFont({
  src: [
    { path: "./fuentes/roboto-latin-normal-300.woff2", weight: "300", style: "normal" },
    { path: "./fuentes/roboto-latin-normal.woff2", weight: "400", style: "normal" },
    { path: "./fuentes/roboto-latin-normal.woff2", weight: "500", style: "normal" },
    { path: "./fuentes/roboto-latin-normal.woff2", weight: "700", style: "normal" },
    { path: "./fuentes/roboto-latin-italic-300.woff2", weight: "300", style: "italic" },
    { path: "./fuentes/roboto-latin-italic.woff2", weight: "400", style: "italic" },
    { path: "./fuentes/roboto-latin-italic.woff2", weight: "500", style: "italic" },
    { path: "./fuentes/roboto-latin-italic.woff2", weight: "700", style: "italic" },
  ],
  variable: "--font-roboto", display: "swap", preload: false, adjustFontFallback: false,
  declarations: [{ prop: "unicode-range", value: "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD" }],
});
const lora = localFont({
  src: [
    { path: "./fuentes/lora-latin-normal.woff2", weight: "400 700", style: "normal" },
    { path: "./fuentes/lora-latin-italic.woff2", weight: "400 700", style: "italic" },
  ],
  variable: "--font-lora", display: "swap", preload: true, fallback: ["Georgia", "Times New Roman", "serif"],
  declarations: [{ prop: "unicode-range", value: "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD" }],
});

export const metadata: Metadata = { title: "AMS Cerramientos · mesa de control", robots: { index: false, follow: false, nocache: true } };
export const viewport: Viewport = { width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${roboto.variable} ${lora.variable}`}>
      <body>
        <main id="contenido">{children}</main>
        <span data-versionante aria-hidden="true" className="pointer-events-none fixed bottom-2 left-2 z-[60] rounded-full bg-white/85 px-2 py-0.5 text-[10.5px] font-semibold text-ink/45 ring-1 ring-black/5">{VERSION}</span>
      </body>
    </html>
  );
}
