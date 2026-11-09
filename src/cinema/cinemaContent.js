import matchFilms from '@/cinema/films/matchFilms';
import originFilms from '@/cinema/films/originFilms';
import storyFilm from '@/cinema/films/storyFilm';

// Original dramatizations; Story Mode follows the playable prologue and Chapter I.
export const EXPERIENCES = [...matchFilms, ...originFilms, storyFilm].map(film => ({
  ...film,
  title: film.title || film.marquee,
  kind: film.id === 'story-mode' ? 'Story Mode adaptation · 3D animated short' : 'Original Bed Wars cinematic short',
  blurb: film.tagline,
  duration: film.shots.length * 12,
  palette: ['#070b18', '#26243c', '#080b12'],
  subtitles: film.shots.map((shot, index) => ({ t: index * 12 + .3, text: shot[1] })),
  narration: film.shots.map((shot, index) => ({ t: index * 12 + 1, text: shot[1] })),
  cues: film.shots.map((shot, index) => ({ t: index * 12, mood: shot[2] })),
}));

export const experienceById = (id) => EXPERIENCES.find((item) => item.id === id) || null;

export const MOOD_ENERGY = { quiet: 0.1, tense: 0.45, gasp: 0.5, cheer: 0.92, hype: 1 };