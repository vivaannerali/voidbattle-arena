export default function HoverTag({ hover }) {
  if (!hover?.pick) return null;
  const width = typeof window !== 'undefined' ? window.innerWidth : 1200;
  const height = typeof window !== 'undefined' ? window.innerHeight : 800;
  const left = Math.min(hover.x + 18, Math.max(12, width - 268));
  const top = Math.min(hover.y + 18, Math.max(12, height - 104));
  return (
    <div className="cinema-hover" style={{ left, top }}>
      <b>{hover.pick.label}</b>
      {hover.pick.hint && <span>{hover.pick.hint}</span>}
    </div>
  );
}