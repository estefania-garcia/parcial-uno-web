'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { actorsApi } from '@/lib/api';
import { Actor } from '@/lib/types';
import { Alert } from '@/components/Alert';
import { State } from '@/components/State';

export default function ActorsList() {
  const [actors, setActors] = useState<Actor[] | null>(null);
  const [error, setError] = useState('');

  async function load() {
    try {
      setError('');
      setActors(await actorsApi.list());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo cargar.');
      setActors([]);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete(actor: Actor) {
    if (!confirm(`¿Eliminar a ${actor.name}?`)) return;
    try {
      await actorsApi.remove(actor.id);
      setActors((prev) => prev?.filter((a) => a.id !== actor.id) ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo eliminar.');
    }
  }

  return (
    <main>
      <div className="page-head">
        <div>
          <h1 className="page-title">🎭 Actores</h1>
          <p className="page-subtitle">
            {actors ? `${actors.length} en la plataforma` : 'Cargando…'}
          </p>
        </div>
        <Link href="/actors/new" className="btn btn-green">
          + Crear actor
        </Link>
      </div>

      <Alert>{error}</Alert>

      {actors === null && <State emoji="⏳">Cargando actores…</State>}

      {actors && actors.length === 0 && !error && (
        <State emoji="🎬">
          Aún no hay actores. ¡Crea el primero!
        </State>
      )}

      {actors && actors.length > 0 && (
        <div className="grid">
          {actors.map((actor) => (
            <div key={actor.id} className="card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="avatar"
                src={actor.photo}
                alt={actor.name}
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    '/assets/images/foto_actor.jpg';
                }}
              />
              <div className="card-pad">
                <h3>{actor.name}</h3>
                <p className="page-subtitle" style={{ marginTop: 4 }}>
                  {actor.nationality}
                </p>
                <div className="actions" style={{ marginTop: 14 }}>
                  <Link
                    href={`/actors/${actor.id}/edit`}
                    className="btn btn-soft btn-sm"
                  >
                    ✏️ Editar
                  </Link>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(actor)}
                  >
                    🗑️ Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
