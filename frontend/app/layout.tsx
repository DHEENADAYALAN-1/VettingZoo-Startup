import type { Metadata, Viewport } from "next";
import { Sora, Manrope } from "next/font/google";
import "./globals.css";
import GlowBackground from "./components/GlowBackground";

const sora = Sora({ variable: "--font-sora", subsets: ["latin"], weight: ["300", "400", "600"] });
const manrope = Manrope({ variable: "--font-manrope", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Vetting Zoo | AI Hiring Intelligence",
  description: "Screen resumes, rank candidates and get AI recruiter insights.",
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#02040a" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${sora.variable} ${manrope.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <GlowBackground />
        {children}
      </body>
    </html>
  );
}
