'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import ActorForm from '@/components/ActorForm';
import { actorsApi } from '@/lib/api';
import { ActorInput } from '@/lib/types';
import { Alert } from '@/components/Alert';
import { State } from '@/components/State';

export default function EditActorPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [initial, setInitial] = useState<ActorInput | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const actor = await actorsApi.get(id);
        setInitial({
          name: actor.name,
          photo: actor.photo,
          nationality: actor.nationality,
          birthDate: actor.birthDate,
          biography: actor.biography,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'No se pudo cargar.');
      }
    })();
  }, [id]);

  async function handleUpdate(data: ActorInput) {
    await actorsApi.update(id, data);
    router.push('/actors');
    router.refresh();
  }

  return (
    <main>
      <div className="page-head">
        <div>
          <h1 className="page-title">✏️ Editar actor</h1>
          <p className="page-subtitle">Actualiza la información del actor.</p>
        </div>
        <Link href="/actors" className="btn btn-soft">
          ← Volver
        </Link>
      </div>

      <Alert>{error}</Alert>

      {!initial && !error && <State emoji="⏳">Cargando…</State>}

      {initial && (
        <ActorForm
          initial={initial}
          submitLabel="Guardar cambios"
          onSubmit={handleUpdate}
        />
      )}
    </main>
  );
}
