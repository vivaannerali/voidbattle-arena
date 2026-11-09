import { base44 } from '@/api/base44Client';

export const MAX_VIDEO_BYTES = 100 * 1024 * 1024;

export function formatVideoSize(bytes) {
  if (!bytes) return 'this file';
  const mb = bytes / (1024 * 1024);
  return mb >= 1024 ? `${(mb / 1024).toFixed(1)} GB` : `${Math.round(mb)} MB`;
}

export async function listTheatreVideos() {
  const page = await base44.entities.TheatreVideo.filter({}, { sort: '-created_date', limit: 24 });
  return page.items;
}

export async function uploadTheatreVideo(file) {
  const { file_url } = await base44.integrations.Core.UploadPublicFile({ file });
  const title = file.name.replace(/\.[^.]+$/, '').slice(0, 80) || 'Untitled presentation';
  return base44.entities.TheatreVideo.create({
    title,
    file_url,
    size_mb: Math.round(file.size / (1024 * 1024)),
  });
}