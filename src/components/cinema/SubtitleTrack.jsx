export default function SubtitleTrack({ text, on }) {
  if (!on || !text) return null;
  return (
    <div className="cinema-subtitles" aria-live="polite" key={text}>
      {text}
    </div>
  );
}