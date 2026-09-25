'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ActorForm from '@/components/ActorForm';
import { actorsApi } from '@/lib/api';
import { ActorInput } from '@/lib/types';

export default function NewActorPage() {
  const router = useRouter();

  async function handleCreate(data: ActorInput) {
    await actorsApi.create(data);
    router.push('/actors');
    router.refresh();
  }

  return (
    <main>
      <div className="page-head">
        <div>
          <h1 className="page-title">✨ Crear actor</h1>
          <p className="page-subtitle">Completa el formulario para añadirlo.</p>
        </div>
        <Link href="/actors" className="btn btn-soft">
          ← Volver
        </Link>
      </div>

      <ActorForm submitLabel="Crear actor" onSubmit={handleCreate} />
    </main>
  );
}
