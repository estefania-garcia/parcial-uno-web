'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/actors', label: '🎭 Actores' },
  { href: '/movies', label: '🎬 Películas' },
  { href: '/movies/new', label: '✨ Crear película' },
];

export default function NavBar() {
  const pathname = usePathname();

  return (
    <nav className="navbar">
      <Link href="/" className="brand">
        <span className="brand-badge">🎪</span>
        Arte7
      </Link>
      {links.map((link) => {
        const active =
          link.href === '/movies/new'
            ? pathname === '/movies/new'
            : pathname === link.href ||
              (pathname.startsWith(link.href) && link.href !== '/');
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`nav-link${active ? ' active' : ''}`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
