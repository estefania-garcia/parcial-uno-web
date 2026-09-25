import Link from 'next/link';

export default function HomePage() {
  return (
    <main>
      <section
        className="card card-pad"
        style={{
          background: 'linear-gradient(150deg, #7ec97e, #5db95d)',
          color: '#fff',
          padding: '46px 34px',
          marginTop: 10,
        }}
      >
        <h1 style={{ fontSize: 36, maxWidth: 520 }}>
          Un mundo de cine para explorar 🍿
        </h1>
        <p style={{ fontSize: 18, opacity: 0.95, maxWidth: 520, marginTop: 12 }}>
          Descubre actores, crea películas y guarda tus premios favoritos. Todo
          en un solo lugar lleno de color.
        </p>
        <div className="actions" style={{ marginTop: 22 }}>
          <Link href="/movies" className="btn btn-soft">
            🎬 Ver películas
          </Link>
          <Link href="/movies/new" className="btn btn-soft">
            ✨ Crear película
          </Link>
        </div>
      </section>

      <div className="grid" style={{ marginTop: 26 }}>
        <Link href="/actors" className="card card-pad">
          <span style={{ fontSize: 40 }}>🎭</span>
          <h2 style={{ marginTop: 10 }}>Actores</h2>
          <p className="page-subtitle">
            Crea, edita y organiza el elenco de tu plataforma.
          </p>
        </Link>
        <Link href="/movies" className="card card-pad">
          <span style={{ fontSize: 40 }}>🎬</span>
          <h2 style={{ marginTop: 10 }}>Películas</h2>
          <p className="page-subtitle">
            Explora el catálogo con autores y premios.
          </p>
        </Link>
        <Link href="/movies/new" className="card card-pad">
          <span style={{ fontSize: 40 }}>✨</span>
          <h2 style={{ marginTop: 10 }}>Crear película</h2>
          <p className="page-subtitle">
            Añade película, actor principal y premio en un flujo guiado.
          </p>
        </Link>
      </div>
    </main>
  );
}
