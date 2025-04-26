'use client';

import { useEffect, useState } from 'react';
import AddPlaylist from '@/components/AddPlaylist';
import PlaylistCard from '@/components/PlaylistCard';
import { Playlist } from '@/types';
import { fetchPlaylistData } from '@/services/youtube';
import { getPlaylists, savePlaylists } from '@/services/storage';
import { extractPlaylistId } from '@/utils/youtube';

export default function Home() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load saved playlists on mount
    const savedPlaylists = getPlaylists();
    setPlaylists(savedPlaylists);
  }, []);

  const handleAddPlaylist = async (url: string) => {
    setError(null);
    setLoading(true);

    try {
      const playlistId = extractPlaylistId(url);
      if (!playlistId) {
        throw new Error('Invalid playlist URL');
      }

      // Check if playlist already exists
      if (playlists.some(p => p.id === playlistId)) {
        throw new Error('Playlist already added');
      }

      const playlist = await fetchPlaylistData(playlistId);
      const updatedPlaylists = [...playlists, playlist];
      setPlaylists(updatedPlaylists);
      savePlaylists(updatedPlaylists);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add playlist');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <AddPlaylist onAdd={handleAddPlaylist} />
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {loading && (
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent"></div>
        </div>
      )}
      
      {!loading && playlists.length === 0 ? (
        <div className="text-center text-gray-500 mt-8">
          No playlists added yet. Add your first playlist above!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {playlists.map((playlist) => (
            <PlaylistCard key={playlist.id} playlist={playlist} />
          ))}
        </div>
      )}
    </div>
  );
}
