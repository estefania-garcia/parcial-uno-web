export interface Actor {
  id: string;
  name: string;
  photo: string;
  nationality: string;
  birthDate: string;
  biography: string;
  movies?: Movie[];
  prizes?: Prize[];
}

export type ActorInput = Omit<Actor, 'id' | 'movies' | 'prizes'>;

export interface Prize {
  id: string;
  name: string;
  category: string;
  year: number;
  status: 'won' | 'nominated';
}

export type PrizeInput = Omit<Prize, 'id'>;

export interface Director {
  id: string;
  name: string;
}

export interface Genre {
  id: string;
  name: string;
}

export interface Movie {
  id: string;
  title: string;
  poster: string;
  duration: number;
  country: string;
  releaseDate: string;
  popularity: number;
  director?: Director | null;
  genre?: Genre | null;
  actors?: Actor[];
  prizes?: Prize[];
}

export type MovieInput = Omit<
  Movie,
  'id' | 'director' | 'genre' | 'actors' | 'prizes'
>;
