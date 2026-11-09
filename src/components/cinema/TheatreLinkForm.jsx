import { useState } from 'react';
import { Link2, Loader2 } from 'lucide-react';

export default function TheatreLinkForm({ onAdd }) {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setSaving(true);
    try {
      await onAdd(title, url);
      setTitle('');
      setUrl('');
    } catch (err) {
      setError(err?.message || 'Could not save that link.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="theatre-link-form" onSubmit={submit}>
      <label>
        <span>Film title</span>
        <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="My 70mm feature" maxLength={80} />
      </label>
      <label>
        <span>Direct video link (mp4 / webm / mov)</span>
        <input value={url} onChange={(event) => setUrl(event.target.value)} placeholder="https://…/film.mp4" required />
      </label>
      <button type="submit" disabled={saving || !url.trim()}>
        {saving ? <Loader2 size={13} className="theatre-library-spin" /> : <Link2 size={13} />}
        {saving ? 'Saving…' : 'Save Film'}
      </button>
      {error && <p className="theatre-link-error">{error}</p>}
    </form>
  );
}