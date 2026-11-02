import type { Metadata, Viewport } from "next";
import { Geist, Spectral } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });
const spectral = Spectral({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--font-spectral" });
const spectralLightItalic = Spectral({ subsets: ["latin"], weight: "300", style: "italic", variable: "--font-spectral-light-italic" });
const spectralSemiboldItalic = Spectral({ subsets: ["latin"], weight: "600", style: "italic", variable: "--font-spectral-semibold-italic" });

export const metadata: Metadata = {
  title: "Monish S · Full Stack Developer",
  description: "Full-stack developer working on AI agents, NLP and tools that check AI-generated code. Projects, experience and a published paper.",
};
export const viewport: Viewport = { themeColor: "#06070b", colorScheme: "dark", viewportFit: "cover" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} ${spectral.variable} ${spectralLightItalic.variable} ${spectralSemiboldItalic.variable}`}>
      <body>{children}</body>
    </html>
  );
}
