import type { Metadata } from "next";

import "../app/globals.css";
import { Providers } from "../app/providers";


export const metadata: Metadata = {
  metadataBase: new URL('https://framev2-analizer.vercel.app/'),
  title: 'Mi Frame - Analizador de Curriculums',
  description: 'Recibe feedback inteligente sobre tu curriculum usando IA.',
  openGraph: {
    title: 'Mi Frame - Analizador de Curriculums',
    description: 'Recibe feedback inteligente sobre tu curriculum usando IA.',
    images: [
      {
        url: 'https://framev2-analizer.vercel.app/skinner-logo5.png', // imagen desde vercel
        width: 800,
        height: 600,
      },
    ],
  },
  other: {
    'farcaster:frame': 'true',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}