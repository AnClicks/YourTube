import { Playlist, WatchedStatus } from '@/types';

const PLAYLISTS_KEY = 'yourtube_playlists';
const WATCHED_VIDEOS_KEY = 'yourtube_watched_videos';

export function savePlaylists(playlists: Playlist[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(PLAYLISTS_KEY, JSON.stringify(playlists));
}

export function getPlaylists(): Playlist[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(PLAYLISTS_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveWatchedStatus(status: WatchedStatus): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(WATCHED_VIDEOS_KEY, JSON.stringify(status));
}

export function getWatchedStatus(): WatchedStatus {
  if (typeof window === 'undefined') return {};
  const data = localStorage.getItem(WATCHED_VIDEOS_KEY);
  return data ? JSON.parse(data) : {};
}

export function markVideoAsWatched(videoId: string): void {
  const status = getWatchedStatus();
  status[videoId] = true;
  saveWatchedStatus(status);
}

export function isVideoWatched(videoId: string): boolean {
  const status = getWatchedStatus();
  return !!status[videoId];
} 