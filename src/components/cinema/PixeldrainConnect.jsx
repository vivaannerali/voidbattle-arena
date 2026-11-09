import { useEffect, useState } from 'react';
import { KeyRound, Loader2, Plus, RefreshCw } from 'lucide-react';
import { addPixeldrainFileToTheatre, formatVideoSize, listPixeldrainFiles } from '@/cinema/theatreVideos';

const KEY_STORAGE = 'theatre.pixeldrain.key';

export default function PixeldrainConnect({ onPublished }) {
  const [key, setKey] = useState('');
  const [files, setFiles] = useState([]);
  const [connected, setConnected] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [addingId, setAddingId] = useState('');

  const load = async (apiKey) => {
    setBusy(true);
    setError('');
    try {
      const list = await listPixeldrainFiles(apiKey);
      setFiles(list);
      setConnected(true);
      window.localStorage.setItem(KEY_STORAGE, apiKey);
    } catch (err) {
      setConnected(false);
      setFiles([]);
      setError(err?.message || 'Could not reach pixeldrain.');
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    const stored = window.localStorage.getItem(KEY_STORAGE);
    if (stored) {
      setKey(stored);
      load(stored);
    }
  }, []);

  const publish = async (file) => {
    setAddingId(file.id);
    setError('');
    try {
      await addPixeldrainFileToTheatre(file);
      await onPublished?.();
    } catch (err) {
      setError(err?.message || 'Could not add that film.');
    } finally {
      setAddingId('');
    }
  };

  return (
    <section className="pixeldrain-panel">
      <h3>
        <KeyRound size={11} /> pixeldrain account
      </h3>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (key.trim()) load(key.trim());
        }}
      >
        <input
          type="password"
          value={key}
          onChange={(event) => setKey(event.target.value)}
          placeholder="Your pixeldrain API key"
          autoComplete="off"
          spellCheck={false}
        />
        <button type="submit" disabled={busy || !key.trim()}>
          {busy ? 'Checking…' : connected ? 'Reconnect' : 'Connect'}
        </button>
      </form>
      <p className="pixeldrain-hint">
        The key stays on this device only — copy it from pixeldrain.com/user/api_keys. Upload the film on{' '}
        <a href="https://pixeldrain.com/#upload" target="_blank" rel="noreferrer">pixeldrain</a> (up to 20 GB per file), then
        press refresh here and publish it: it plays in this theatre for everyone, permanently.
      </p>
      {connected && (
        <div className="pixeldrain-files">
          <div className="pixeldrain-files-head">
            <span>Your pixeldrain files</span>
            <button type="button" onClick={() => load(key.trim())} disabled={busy}>
              {busy ? <Loader2 size={10} className="theatre-library-spin" /> : <RefreshCw size={10} />} Refresh
            </button>
          </div>
          {files.length ? (
            <ul>
              {files.map((file) => (
                <li key={file.id}>
                  <span>
                    {file.name}
                    <small>{formatVideoSize(file.size)}</small>
                  </span>
                  <button type="button" onClick={() => publish(file)} disabled={addingId === file.id}>
                    {addingId === file.id ? <Loader2 size={10} className="theatre-library-spin" /> : <Plus size={10} />}
                    {addingId === file.id ? 'Adding' : 'Add'}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="theatre-library-empty">No files on that account yet.</p>
          )}
        </div>
      )}
      {error && <p className="theatre-link-error">{error}</p>}
    </section>
  );
}