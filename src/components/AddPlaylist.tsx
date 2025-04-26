import { useState } from 'react';
import { isValidYouTubeUrl, extractPlaylistId } from '../utils/youtube';

interface AddPlaylistProps {
  onAdd: (url: string) => void;
}

export default function AddPlaylist({ onAdd }: AddPlaylistProps) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isValidYouTubeUrl(url)) {
      setError('Please enter a valid YouTube URL');
      return;
    }

    const playlistId = extractPlaylistId(url);
    if (!playlistId) {
      setError('Could not find playlist ID in the URL');
      return;
    }

    onAdd(url);
    setUrl('');
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="playlist-url" className="block text-sm font-medium text-gray-700">
            Add YouTube Playlist
          </label>
          <div className="mt-1">
            <input
              type="text"
              id="playlist-url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste YouTube playlist URL here"
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2"
            />
          </div>
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </div>
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Add Playlist
        </button>
      </form>
    </div>
  );
} 