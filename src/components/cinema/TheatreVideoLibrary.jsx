import { Loader2, Play, Upload } from 'lucide-react';
import '@/components/cinema/theatreVideos.css';

export default function TheatreVideoLibrary({ videos, loading, uploading, onPlay, onUpload, onClose }) {
  return (
    <aside className="theatre-library" aria-label="Community videos">
      <header>
        <h2>Community Videos</h2>
        <button type="button" onClick={onClose}>Close</button>
      </header>
      <p className="theatre-library-note">
        Uploads are saved publicly in the theatre and stay here for everyone. Up to 100 MB per film.
      </p>
      <button type="button" className="theatre-library-upload" onClick={onUpload} disabled={uploading}>
        {uploading ? <Loader2 size={14} className="theatre-library-spin" /> : <Upload size={14} />}
        {uploading ? 'Uploading…' : 'Upload Video'}
      </button>
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
                <small>{video.size_mb ? `${video.size_mb} MB` : 'Film'}</small>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="theatre-library-empty">No uploads yet — be the first to put a film on the big screen.</p>
      )}
    </aside>
  );
}