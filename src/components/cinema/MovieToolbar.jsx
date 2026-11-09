import { snackById } from '@/cinema/snacks';
import { getSeat, seatLabel } from '@/cinema/seatLayout';

export default function MovieToolbar({
  experience,
  seat,
  held,
  onLobby,
  onChangeMovie,
  onEat,
  subtitlesOn,
  onSubtitles,
  narration,
  onNarration,
  video,
  videoPlaying,
  onLoadVideo,
  onToggleVideo,
  fileInputRef,
}) {
  const latest = held.length ? snackById(held[held.length - 1]) : null;

  return (
    <div className="cinema-toolbar" role="toolbar" aria-label="Movie controls">
      <span className="cinema-toolbar-title">
        <b>{video ? 'Your 70mm video' : experience?.marquee}</b>
        <small>{seatLabel(getSeat(seat))} · Drag to look around</small>
      </span>
      <button type="button" onClick={onLobby} title="Back to the candy bar lobby">Return to Lobby</button>
      <button type="button" onClick={onChangeMovie} title="Choose a different presentation">Change Movie</button>
      <button type="button" onClick={() => fileInputRef.current?.click()} title="Play a video from this computer on the big screen">
        Load Video
      </button>
      <input
        ref={fileInputRef}
        className="cinema-file-input"
        type="file"
        accept="video/*,.mov,.mp4,.webm"
        onChange={(event) => {
          const file = event.target.files?.[0];
          event.target.value = '';
          if (file) onLoadVideo(file);
        }}
      />
      {video && (
        <button type="button" onClick={onToggleVideo}>{videoPlaying ? 'Pause' : 'Play'}</button>
      )}
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