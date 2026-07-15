import type { Metadata } from "next";
import "./globals.css";
import { IconeSprite } from "@/components/Icones";

export const metadata: Metadata = {
  title: "Track Food — Organizador financeiro para restaurantes",
  description:
    "Controle de CMV, fichas técnicas e ponto de equilíbrio para donos de restaurante.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <IconeSprite />
        {children}
      </body>
    </html>
  );
}
