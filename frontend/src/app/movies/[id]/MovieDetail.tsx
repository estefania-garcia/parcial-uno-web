'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { moviesApi } from '@/lib/api';
import { Movie } from '@/lib/types';
import { formatDate } from '@/lib/format';
import { Alert } from '@/components/Alert';
import { State } from '@/components/State';

export default function MovieDetail() {
  const params = useParams();
  const id = params.id as string;

  const [movie, setMovie] = useState<Movie | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        setMovie(await moviesApi.get(id));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'No se pudo cargar.');
      }
    })();
  }, [id]);

  return (
    <main>
      <div className="page-head">
        <Link href="/movies" className="btn btn-soft">
          ← Volver al catálogo
        </Link>
      </div>

      <Alert>{error}</Alert>

      {!movie && !error && <State emoji="⏳">Cargando película…</State>}

      {movie && (
        <>
          <div className="detail">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="detail-poster"
              src={movie.poster}
              alt={movie.title}
              onError={(e) => {
                (e.target as HTMLImageElement).style.visibility = 'hidden';
              }}
            />

            <div>
              <h1 className="page-title" style={{ fontSize: 34 }}>
                {movie.title}
              </h1>
              <p className="page-subtitle" style={{ marginTop: 6 }}>
                📅 {formatDate(movie.releaseDate)} · 🌍 {movie.country || '—'}
              </p>

              <div className="meta-grid">
                <div className="meta-item">
                  <div className="label">Duración</div>
                  <div className="value">{movie.duration ?? '—'} min</div>
                </div>
                <div className="meta-item">
                  <div className="label">Popularidad</div>
                  <div className="value">⭐ {movie.popularity ?? '—'}</div>
                </div>
                <div className="meta-item">
                  <div className="label">País</div>
                  <div className="value">{movie.country || '—'}</div>
                </div>
                <div className="meta-item">
                  <div className="label">Director</div>
                  <div className="value">{movie.director?.name ?? '—'}</div>
                </div>
                <div className="meta-item">
                  <div className="label">Género</div>
                  <div className="value">{movie.genre?.name ?? '—'}</div>
                </div>
              </div>

              {movie.prizes && movie.prizes.length > 0 && (
                <div
                  style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}
                >
                  {movie.prizes.map((prize) => (
                    <span key={prize.id} className="chip chip-yellow">
                      🏆 {prize.name} ({prize.year})
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <h2 className="section-title">🎭 Actores</h2>
          {movie.actors && movie.actors.length > 0 ? (
            <div className="people-row">
              {movie.actors.map((actor) => (
                <div key={actor.id} className="person-chip">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={actor.photo}
                    alt={actor.name}
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.visibility =
                        'hidden';
                    }}
                  />
                  {actor.name}
                </div>
              ))}
            </div>
          ) : (
            <p className="page-subtitle">
              Esta película todavía no tiene actores asociados.
            </p>
          )}
        </>
      )}
    </main>
  );
}
