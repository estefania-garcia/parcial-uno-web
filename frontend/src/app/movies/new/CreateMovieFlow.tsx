'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { actorsApi, moviesApi, prizesApi } from '@/lib/api';
import { ActorInput, MovieInput, PrizeInput } from '@/lib/types';
import { Alert } from '@/components/Alert';

type StepKey = 'movie' | 'actor' | 'prize' | 'link';

const stepLabels: { key: StepKey; label: string }[] = [
  { key: 'movie', label: 'Película' },
  { key: 'actor', label: 'Actor principal' },
  { key: 'prize', label: 'Premio' },
  { key: 'link', label: 'Asociaciones' },
];

const emptyMovie: MovieInput = {
  title: '',
  poster: '',
  duration: 0,
  country: '',
  releaseDate: '',
  popularity: 0,
};

const emptyActor: ActorInput = {
  name: '',
  photo: '',
  nationality: '',
  birthDate: '',
  biography: '',
};

const emptyPrize: PrizeInput = {
  name: '',
  category: '',
  year: new Date().getFullYear(),
  status: 'won',
};

function isValidUrl(value: string) {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

export default function CreateMovieFlow() {
  const router = useRouter();

  const [movie, setMovie] = useState<MovieInput>(emptyMovie);
  const [actor, setActor] = useState<ActorInput>(emptyActor);
  const [prize, setPrize] = useState<PrizeInput>(emptyPrize);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState('');
  const [progress, setProgress] = useState<StepKey | 'done' | null>(null);
  const [saving, setSaving] = useState(false);

  function validate(): boolean {
    const next: Record<string, string> = {};

    if (!movie.title.trim()) next.title = 'El título es obligatorio.';
    if (!movie.poster.trim()) next.poster = 'El póster es obligatorio.';
    else if (!isValidUrl(movie.poster))
      next.poster = 'El póster debe ser una URL válida.';
    if (!movie.country.trim()) next.country = 'El país es obligatorio.';
    if (!movie.releaseDate) next.releaseDate = 'La fecha es obligatoria.';
    if (!(movie.duration > 0)) next.duration = 'Duración mayor a 0.';
    if (!(movie.popularity >= 0))
      next.popularity = 'Popularidad inválida.';

    if (!actor.name.trim()) next.actorName = 'El nombre es obligatorio.';
    if (!actor.photo.trim()) next.actorPhoto = 'La foto es obligatoria.';
    else if (!isValidUrl(actor.photo))
      next.actorPhoto = 'La foto debe ser una URL válida.';
    if (!actor.nationality.trim())
      next.actorNationality = 'La nacionalidad es obligatoria.';
    if (!actor.birthDate) next.actorBirthDate = 'La fecha es obligatoria.';
    if (!actor.biography.trim())
      next.actorBiography = 'La biografía es obligatoria.';

    if (!prize.name.trim()) next.prizeName = 'El nombre es obligatorio.';
    if (!prize.category.trim())
      next.prizeCategory = 'La categoría es obligatoria.';
    if (!(prize.year > 0)) next.prizeYear = 'Año inválido.';

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setApiError('');
    if (!validate()) {
      setApiError('Revisa los campos marcados antes de continuar.');
      return;
    }

    setSaving(true);
    try {
      // 1. Crear película por aparte
      setProgress('movie');
      const createdMovie = await moviesApi.create({
        ...movie,
        duration: Number(movie.duration),
        popularity: Number(movie.popularity),
        releaseDate: new Date(movie.releaseDate).toISOString(),
      });

      // 2. Crear actor por aparte
      setProgress('actor');
      const createdActor = await actorsApi.create({
        ...actor,
        birthDate: new Date(actor.birthDate).toISOString(),
      });

      // 3. Crear premio por aparte
      setProgress('prize');
      const createdPrize = await prizesApi.create({
        ...prize,
        year: Number(prize.year),
      });

      // 4. Asociaciones vía endpoints
      setProgress('link');
      await moviesApi.addActor(createdMovie.id, createdActor.id);
      await moviesApi.addPrize(createdMovie.id, createdPrize.id);

      setProgress('done');
      router.push(`/movies/${createdMovie.id}`);
      router.refresh();
    } catch (err) {
      setApiError(
        err instanceof Error
          ? `Falló en el paso "${progress}": ${err.message}`
          : 'Ocurrió un error al crear la película.',
      );
      setSaving(false);
    }
  }

  const currentStepIndex =
    progress === 'done'
      ? stepLabels.length
      : stepLabels.findIndex((s) => s.key === progress);

  return (
    <main>
      <div className="page-head">
        <div>
          <h1 className="page-title">✨ Crear película</h1>
          <p className="page-subtitle">
            Registramos la película, el actor y el premio, y luego los
            asociamos automáticamente.
          </p>
        </div>
        <Link href="/movies" className="btn btn-soft">
          ← Volver
        </Link>
      </div>

      <div className="stepper">
        {stepLabels.map((step, index) => (
          <span
            key={step.key}
            className={`step${
              saving && index < currentStepIndex ? ' done' : ''
            }`}
          >
            <span className="num">{index + 1}</span>
            {step.label}
          </span>
        ))}
      </div>

      <Alert>{apiError}</Alert>

      <form className="form-card" onSubmit={handleSubmit} noValidate>
        {/* -------- Película -------- */}
        <h2 className="section-title" style={{ marginTop: 0 }}>
          🎬 Datos de la película
        </h2>

        <div className="field">
          <label htmlFor="title">Título</label>
          <input
            id="title"
            className="input"
            value={movie.title}
            onChange={(e) => setMovie({ ...movie, title: e.target.value })}
            placeholder="Ej. El mundo de Nora"
          />
          {errors.title && <p className="field-error">{errors.title}</p>}
        </div>

        <div className="field">
          <label htmlFor="poster">Póster (URL)</label>
          <input
            id="poster"
            className="input"
            value={movie.poster}
            onChange={(e) => setMovie({ ...movie, poster: e.target.value })}
            placeholder="https://..."
          />
          {errors.poster && <p className="field-error">{errors.poster}</p>}
        </div>

        <div className="form-row">
          <div className="field">
            <label htmlFor="country">País</label>
            <input
              id="country"
              className="input"
              value={movie.country}
              onChange={(e) =>
                setMovie({ ...movie, country: e.target.value })
              }
              placeholder="Ej. Colombia"
            />
            {errors.country && (
              <p className="field-error">{errors.country}</p>
            )}
          </div>
          <div className="field">
            <label htmlFor="releaseDate">Fecha de lanzamiento</label>
            <input
              id="releaseDate"
              type="date"
              className="input"
              value={movie.releaseDate ? movie.releaseDate.slice(0, 10) : ''}
              onChange={(e) =>
                setMovie({ ...movie, releaseDate: e.target.value })
              }
            />
            {errors.releaseDate && (
              <p className="field-error">{errors.releaseDate}</p>
            )}
          </div>
        </div>

        <div className="form-row">
          <div className="field">
            <label htmlFor="duration">Duración (min)</label>
            <input
              id="duration"
              type="number"
              min={1}
              className="input"
              value={movie.duration || ''}
              onChange={(e) =>
                setMovie({ ...movie, duration: Number(e.target.value) })
              }
            />
            {errors.duration && (
              <p className="field-error">{errors.duration}</p>
            )}
          </div>
          <div className="field">
            <label htmlFor="popularity">Popularidad</label>
            <input
              id="popularity"
              type="number"
              min={0}
              step="0.1"
              className="input"
              value={movie.popularity || ''}
              onChange={(e) =>
                setMovie({ ...movie, popularity: Number(e.target.value) })
              }
            />
            {errors.popularity && (
              <p className="field-error">{errors.popularity}</p>
            )}
          </div>
        </div>

        {/* -------- Actor principal -------- */}
        <h2 className="section-title">🎭 Actor principal</h2>

        <div className="field">
          <label htmlFor="actorName">Nombre</label>
          <input
            id="actorName"
            className="input"
            value={actor.name}
            onChange={(e) => setActor({ ...actor, name: e.target.value })}
            placeholder="Ej. Sofía Vergara"
          />
          {errors.actorName && (
            <p className="field-error">{errors.actorName}</p>
          )}
        </div>

        <div className="field">
          <label htmlFor="actorPhoto">Foto (URL)</label>
          <input
            id="actorPhoto"
            className="input"
            value={actor.photo}
            onChange={(e) => setActor({ ...actor, photo: e.target.value })}
            placeholder="https://..."
          />
          {errors.actorPhoto && (
            <p className="field-error">{errors.actorPhoto}</p>
          )}
        </div>

        <div className="form-row">
          <div className="field">
            <label htmlFor="actorNationality">Nacionalidad</label>
            <input
              id="actorNationality"
              className="input"
              value={actor.nationality}
              onChange={(e) =>
                setActor({ ...actor, nationality: e.target.value })
              }
              placeholder="Ej. Colombiana"
            />
            {errors.actorNationality && (
              <p className="field-error">{errors.actorNationality}</p>
            )}
          </div>
          <div className="field">
            <label htmlFor="actorBirthDate">Fecha de nacimiento</label>
            <input
              id="actorBirthDate"
              type="date"
              className="input"
              value={actor.birthDate ? actor.birthDate.slice(0, 10) : ''}
              onChange={(e) =>
                setActor({ ...actor, birthDate: e.target.value })
              }
            />
            {errors.actorBirthDate && (
              <p className="field-error">{errors.actorBirthDate}</p>
            )}
          </div>
        </div>

        <div className="field">
          <label htmlFor="actorBiography">Biografía</label>
          <textarea
            id="actorBiography"
            className="textarea"
            value={actor.biography}
            onChange={(e) =>
              setActor({ ...actor, biography: e.target.value })
            }
            placeholder="Cuenta algo sobre este actor..."
          />
          {errors.actorBiography && (
            <p className="field-error">{errors.actorBiography}</p>
          )}
        </div>

        {/* -------- Premio -------- */}
        <h2 className="section-title">🏆 Premio</h2>

        <div className="field">
          <label htmlFor="prizeName">Nombre</label>
          <input
            id="prizeName"
            className="input"
            value={prize.name}
            onChange={(e) => setPrize({ ...prize, name: e.target.value })}
            placeholder="Ej. Óscar"
          />
          {errors.prizeName && (
            <p className="field-error">{errors.prizeName}</p>
          )}
        </div>

        <div className="form-row">
          <div className="field">
            <label htmlFor="prizeCategory">Categoría</label>
            <input
              id="prizeCategory"
              className="input"
              value={prize.category}
              onChange={(e) =>
                setPrize({ ...prize, category: e.target.value })
              }
              placeholder="Ej. Mejor película"
            />
            {errors.prizeCategory && (
              <p className="field-error">{errors.prizeCategory}</p>
            )}
          </div>
          <div className="field">
            <label htmlFor="prizeYear">Año</label>
            <input
              id="prizeYear"
              type="number"
              className="input"
              value={prize.year || ''}
              onChange={(e) =>
                setPrize({ ...prize, year: Number(e.target.value) })
              }
            />
            {errors.prizeYear && (
              <p className="field-error">{errors.prizeYear}</p>
            )}
          </div>
        </div>

        <div className="field">
          <label htmlFor="prizeStatus">Estado</label>
          <select
            id="prizeStatus"
            className="input"
            value={prize.status}
            onChange={(e) =>
              setPrize({
                ...prize,
                status: e.target.value as PrizeInput['status'],
              })
            }
          >
            <option value="won">Ganado</option>
            <option value="nominated">Nominado</option>
          </select>
        </div>

        <div className="actions">
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Creando…' : '🎬 Crear película'}
          </button>
        </div>
      </form>
    </main>
  );
}
