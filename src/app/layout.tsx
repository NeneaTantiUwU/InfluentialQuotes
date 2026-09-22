import type { Metadata } from "next";
import { Spectral, Source_Serif_4 } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

const spectral = Spectral({
  subsets: ["latin"],
  variable: "--font-spectral",
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-source-serif",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Citate Influente",
  description:
    "Descoperă citate memorabile de la personalități influente.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ro" data-scroll-behavior="smooth">
      <body className={`${spectral.variable} ${sourceSerif.variable}`}>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
