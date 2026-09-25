'use client';

import { useState } from 'react';
import { ActorInput } from '@/lib/types';
import { Alert } from './Alert';

interface Props {
  initial?: ActorInput;
  submitLabel: string;
  onSubmit: (data: ActorInput) => Promise<void>;
}

const empty: ActorInput = {
  name: '',
  photo: '',
  nationality: '',
  birthDate: '',
  biography: '',
};

function isValidUrl(value: string) {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

export default function ActorForm({ initial, submitLabel, onSubmit }: Props) {
  const [form, setForm] = useState<ActorInput>(initial ?? empty);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState('');
  const [saving, setSaving] = useState(false);

  const update =
    (field: keyof ActorInput) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  function validate(): boolean {
    const next: Record<string, string> = {};
    if (!form.name.trim()) next.name = 'El nombre es obligatorio.';
    if (!form.photo.trim()) next.photo = 'La foto es obligatoria.';
    else if (!isValidUrl(form.photo)) next.photo = 'Debe ser una URL válida.';
    if (!form.nationality.trim())
      next.nationality = 'La nacionalidad es obligatoria.';
    if (!form.birthDate) next.birthDate = 'La fecha es obligatoria.';
    if (!form.biography.trim())
      next.biography = 'La biografía es obligatoria.';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setApiError('');
    if (!validate()) return;
    setSaving(true);
    try {
      await onSubmit({
        ...form,
        birthDate: new Date(form.birthDate).toISOString(),
      });
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Ocurrió un error.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="form-card" onSubmit={handleSubmit} noValidate>
      <Alert>{apiError}</Alert>

      <div className="field">
        <label htmlFor="name">Nombre</label>
        <input
          id="name"
          className="input"
          value={form.name}
          onChange={update('name')}
          placeholder="Ej. Zendaya"
        />
        {errors.name && <p className="field-error">{errors.name}</p>}
      </div>

      <div className="field">
        <label htmlFor="photo">Foto (URL)</label>
        <input
          id="photo"
          className="input"
          value={form.photo}
          onChange={update('photo')}
          placeholder="https://..."
        />
        {errors.photo && <p className="field-error">{errors.photo}</p>}
      </div>

      <div className="form-row">
        <div className="field">
          <label htmlFor="nationality">Nacionalidad</label>
          <input
            id="nationality"
            className="input"
            value={form.nationality}
            onChange={update('nationality')}
            placeholder="Ej. Estadounidense"
          />
          {errors.nationality && (
            <p className="field-error">{errors.nationality}</p>
          )}
        </div>

        <div className="field">
          <label htmlFor="birthDate">Fecha de nacimiento</label>
          <input
            id="birthDate"
            type="date"
            className="input"
            value={form.birthDate ? form.birthDate.slice(0, 10) : ''}
            onChange={update('birthDate')}
          />
          {errors.birthDate && (
            <p className="field-error">{errors.birthDate}</p>
          )}
        </div>
      </div>

      <div className="field">
        <label htmlFor="biography">Biografía</label>
        <textarea
          id="biography"
          className="textarea"
          value={form.biography}
          onChange={update('biography')}
          placeholder="Cuenta algo sobre este actor..."
        />
        {errors.biography && (
          <p className="field-error">{errors.biography}</p>
        )}
      </div>

      <div className="actions">
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? 'Guardando…' : submitLabel}
        </button>
      </div>
    </form>
  );
}
