import type { Metadata } from 'next';
import './globals.css';
import NavBar from '@/components/NavBar';

export const metadata: Metadata = {
  title: 'Arte7 · Cine para todos',
  description: 'Explora actores y películas en un mundo lleno de color.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <div className="app-shell">
          <NavBar />
          {children}
        </div>
      </body>
    </html>
  );
}
