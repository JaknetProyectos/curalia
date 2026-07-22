import type { Metadata } from "next";
import { Catamaran, Manrope } from "next/font/google";
import ClientBody from "./[locale]/ClientBody";
import "./globals.css";


const catamaran = Catamaran({
  variable: "--font-catamaran",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});


export const metadata: Metadata = {
  title: "Curalia — Equipamiento médico en el que puedes confiar",
  description: "Suministros y equipos médicos de alta calidad para hospitales, clínicas y hogar. Más de 70 productos especializados con precios competitivos y atención personalizada.",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${catamaran.variable} ${manrope.variable}`}
    >
      <head>
      </head>
      <body suppressHydrationWarning className="antialiased">
        <ClientBody>
          {children}
        </ClientBody>
      </body>
    </html>
  );
}
