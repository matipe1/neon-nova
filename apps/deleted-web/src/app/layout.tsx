import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata } from 'next';
import './globals.css';

import { Navbar } from '../components/layout/Navbar';

export const metadata: Metadata = {
  title: "Neon Nova 3D",
  description: "Servicios de impresión 3D y cartelería neón LED de alta calidad"
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>
          {children}
          <SpeedInsights />
        </main>
      </body>
    </html>
  );
}
