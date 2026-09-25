'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { moviesApi } from '@/lib/api';
import { Movie } from '@/lib/types';
import { formatDate } from '@/lib/format';
import { Alert } from '@/components/Alert';
import { State } from '@/components/State';

export default function MoviesList() {
  const [movies, setMovies] = useState<Movie[] | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        setMovies(await moviesApi.list());
      } catch (err) {
        setError(err instanceof Error ? err.message : 'No se pudo cargar.');
        setMovies([]);
      }
    })();
  }, []);

  return (
    <main>
      <div className="page-head">
        <div>
          <h1 className="page-title">🎬 Películas</h1>
          <p className="page-subtitle">
            {movies ? `${movies.length} en el catálogo` : 'Cargando…'}
          </p>
        </div>
        <Link href="/movies/new" className="btn btn-primary">
          ✨ Crear película
        </Link>
      </div>

      <Alert>{error}</Alert>

      {movies === null && <State emoji="⏳">Cargando películas…</State>}

      {movies && movies.length === 0 && !error && (
        <State emoji="🍿">Aún no hay películas. ¡Crea la primera!</State>
      )}

      {movies && movies.length > 0 && (
        <div className="grid">
          {movies.map((movie) => {
            const author =
              movie.actors && movie.actors.length > 0
                ? movie.actors[0].name
                : null;
            const prize =
              movie.prizes && movie.prizes.length > 0
                ? movie.prizes[0].name
                : null;
            return (
              <Link
                key={movie.id}
                href={`/movies/${movie.id}`}
                className="card"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="card-media"
                  src={movie.poster}
                  alt={movie.title}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.visibility = 'hidden';
                  }}
                />
                <div className="card-pad">
                  <h3>{movie.title}</h3>
                  <p className="page-subtitle" style={{ marginTop: 4 }}>
                    📅 {formatDate(movie.releaseDate)}
                  </p>
                  <div
                    style={{
                      display: 'flex',
                      gap: 8,
                      flexWrap: 'wrap',
                      marginTop: 12,
                    }}
                  >
                    <span className="chip chip-pink">
                      🎭 {author ?? 'Sin autor'}
                    </span>
                    <span className="chip chip-yellow">
                      🏆 {prize ?? 'Sin premio'}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </main>
  );
}
