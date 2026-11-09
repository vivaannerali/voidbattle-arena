import { Loader2, Play, Upload } from 'lucide-react';
import TheatreLinkForm from '@/components/cinema/TheatreLinkForm';
import '@/components/cinema/theatreVideos.css';

export default function TheatreVideoLibrary({ videos, loading, uploading, onPlay, onUpload, onAddLink, onClose }) {
  return (
    <aside className="theatre-library" aria-label="Community videos">
      <header>
        <h2>Community Videos</h2>
        <button type="button" onClick={onClose}>Close</button>
      </header>
      <p className="theatre-library-note">
        Everything here is public and permanent. Uploads are capped at 100 MB per film — for a full-length movie,
        add a direct video link instead (no size limit).
      </p>
      <button type="button" className="theatre-library-upload" onClick={onUpload} disabled={uploading}>
        {uploading ? <Loader2 size={14} className="theatre-library-spin" /> : <Upload size={14} />}
        {uploading ? 'Uploading…' : 'Upload Video'}
      </button>
      <TheatreLinkForm onAdd={onAddLink} />
      {loading ? (
        <p className="theatre-library-empty">
          <Loader2 size={13} className="theatre-library-spin" /> Loading the reel…
        </p>
      ) : videos.length ? (
        <ul>
          {videos.map((video) => (
            <li key={video.id}>
              <button type="button" onClick={() => onPlay(video)}>
                <Play size={11} />
                <b>{video.title}</b>
                <small>{video.size_mb ? `${video.size_mb} MB` : 'Linked'}</small>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="theatre-library-empty">No films yet — add yours and it stays on this screen for everyone.</p>
      )}
    </aside>
  );
}