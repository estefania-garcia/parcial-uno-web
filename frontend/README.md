# Arte7 · Frontend (NextJS)

## Funcionalidades

### Parte 1 — CRUD de actores
- **Listar** actores (`GET /api/v1/actors`) — `/actors`
- **Crear** actores con un formulario controlado y validado — `/actors/new`
- **Editar** un actor existente — `/actors/[id]/edit`
- **Eliminar** actores de la lista (con confirmación)
- **Navegación** entre páginas con el router de Next.js

### Parte 2 — Películas
1. **Crear película** (`/movies/new`): registra por separado la película
   (`POST /movies`), un actor principal (`POST /actors`) y un premio
   (`POST /prizes`), y luego crea las asociaciones vía
   `POST /actors/:actorId/movies/:movieId` y
   `POST /movies/:movieId/prizes/:prizeId`.
2. **Listado de películas** (`/movies`): muestra título, fecha de lanzamiento,
   nombre de un autor (si tiene) y nombre del premio (si tiene) usando `GET /movies`.
3. **Detalle de película** (`/movies/[id]`): muestra todos los atributos y el
   listado de actores usando `GET /movies/{id}`.

## Requisitos previos

El backend debe estar corriendo. Desde la raíz del proyecto:

```bash
docker-compose up
```

Verifica que `http://localhost:3000/api/v1/actors` responda un JSON.

## Ejecutar el frontend

```bash
cd frontend
npm install
npm run dev
```

Abre `http://localhost:3000`… pero como el backend ya usa el puerto 3000,
Next.js arrancará en el siguiente puerto libre (normalmente
`http://localhost:3001`). Míralo en la salida de la terminal.

La URL del API se configura en `.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
```

## Build de producción

```bash
npm run build
npm run start
```
