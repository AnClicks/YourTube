'use client';

import { useEffect, useState } from 'react';
import YouTube from 'react-youtube';
import { Playlist, Video } from '@/types';
import { getPlaylists } from '@/services/storage';
import { markVideoAsWatched, isVideoWatched } from '@/services/storage';

type PlaylistClientProps = {
  playlistId: string;
};

export default function PlaylistClient({ playlistId }: PlaylistClientProps) {
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);
  const [watchedVideos, setWatchedVideos] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Load playlist data
    const playlists = getPlaylists();
    const foundPlaylist = playlists.find(p => p.id === playlistId);
    if (foundPlaylist) {
      setPlaylist(foundPlaylist);
      
      // Load watched status for all videos
      const watchedStatus = new Set(
        foundPlaylist.videos
          .filter(video => isVideoWatched(video.id))
          .map(video => video.id)
      );
      setWatchedVideos(watchedStatus);
    }
  }, [playlistId]);

  const handleVideoEnd = () => {
    if (currentVideo) {
      markVideoAsWatched(currentVideo.id);
      setWatchedVideos(prev => new Set([...prev, currentVideo.id]));
    }
  };

  if (!playlist) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Playlist not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{playlist.title}</h1>
      
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-3/4">
          {currentVideo ? (
            <div className="aspect-video">
              <YouTube
                videoId={currentVideo.id}
                className="w-full h-full"
                opts={{
                  width: '100%',
                  height: '100%',
                  playerVars: {
                    autoplay: 1,
                  },
                }}
                onEnd={handleVideoEnd}
              />
            </div>
          ) : (
            <div className="aspect-video bg-gray-100 flex items-center justify-center">
              <p className="text-gray-500">Select a video to play</p>
            </div>
          )}

          {currentVideo && (
            <div className="mt-4">
              <h2 className="text-xl font-semibold">{currentVideo.title}</h2>
            </div>
          )}
        </div>

        <div className="lg:w-1/4">
          <h2 className="text-xl font-semibold mb-4">Videos</h2>
          <div className="space-y-4">
            {playlist.videos.map((video) => (
              <div
                key={video.id}
                onClick={() => setCurrentVideo(video)}
                className={`cursor-pointer p-2 rounded-lg ${
                  currentVideo?.id === video.id
                    ? 'bg-indigo-100'
                    : 'hover:bg-gray-100'
                }`}
              >
                <div className="relative aspect-video mb-2">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover rounded"
                  />
                  {watchedVideos.has(video.id) && (
                    <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                      Watched
                    </div>
                  )}
                </div>
                <h3 className="text-sm font-medium">{video.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 