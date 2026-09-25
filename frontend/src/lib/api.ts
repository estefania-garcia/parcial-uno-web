import {
  Actor,
  ActorInput,
  Movie,
  MovieInput,
  Prize,
  PrizeInput,
} from './types';

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
    ...options,
  });

  if (!res.ok) {
    let message = `Error ${res.status}`;
    try {
      const body = await res.json();
      if (body?.message) {
        message = Array.isArray(body.message)
          ? body.message.join(', ')
          : body.message;
      }
    } catch {
      /* keep default message */
    }
    throw new Error(message);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

/* ---------- Actors ---------- */
export const actorsApi = {
  list: () => request<Actor[]>('/actors'),
  get: (id: string) => request<Actor>(`/actors/${id}`),
  create: (data: ActorInput) =>
    request<Actor>('/actors', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: ActorInput) =>
    request<Actor>(`/actors/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  remove: (id: string) =>
    request<void>(`/actors/${id}`, { method: 'DELETE' }),
};

/* ---------- Movies ---------- */
export const moviesApi = {
  list: () => request<Movie[]>('/movies'),
  get: (id: string) => request<Movie>(`/movies/${id}`),
  create: (data: MovieInput) =>
    request<Movie>('/movies', { method: 'POST', body: JSON.stringify(data) }),
  addActor: (movieId: string, actorId: string) =>
    request<Actor>(`/actors/${actorId}/movies/${movieId}`, { method: 'POST' }),
  addPrize: (movieId: string, prizeId: string) =>
    request<Movie>(`/movies/${movieId}/prizes/${prizeId}`, { method: 'POST' }),
};

/* ---------- Prizes ---------- */
export const prizesApi = {
  create: (data: PrizeInput) =>
    request<Prize>('/prizes', { method: 'POST', body: JSON.stringify(data) }),
};
