import { snackById } from '@/cinema/snacks';

export default function MovieToolbar({ experience, held, onLobby, onChangeMovie, onEat, subtitlesOn, onSubtitles, narration, onNarration }) {
  const latest = held.length ? snackById(held[held.length - 1]) : null;

  return (
    <div className="cinema-toolbar" role="toolbar" aria-label="Movie controls">
      <span className="cinema-toolbar-title">
        <b>{experience?.marquee}</b>
        <small>Original animated experience · live synthesis</small>
      </span>
      <button type="button" onClick={onLobby} title="Back to the candy bar lobby">Return to Lobby</button>
      <button type="button" onClick={onChangeMovie} title="Choose a different presentation">Change Movie</button>
      <button type="button" onClick={() => latest && onEat(latest.id)} disabled={!latest} title={latest ? latest.bite : 'No snacks held'}>
        {latest ? `Eat / Drink · ${latest.short}` : 'No snacks held'}
      </button>
      <button type="button" onClick={onSubtitles} aria-pressed={subtitlesOn}>
        Subtitles {subtitlesOn ? 'On' : 'Off'}
      </button>
      <label className="cinema-narration">
        <span>Narration</span>
        <input type="range" min="0" max="100" value={narration} onChange={(event) => onNarration(Number(event.target.value))} />
        <b>{narration}%</b>
      </label>
    </div>
  );
}