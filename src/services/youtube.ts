import { Playlist, Video } from '@/types';

const YOUTUBE_API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY || "AIzaSyDzOdn8Un7fSPR-TcP-rwjX9z5Mg9XP30w";
const YOUTUBE_API_BASE_URL = 'https://www.googleapis.com/youtube/v3';
const QUOTA_LIMIT = parseInt(process.env.YOUTUBE_API_QUOTA_LIMIT || '10000');
const CACHE_DURATION = parseInt(process.env.PLAYLIST_CACHE_DURATION || '3600');

// Simple in-memory cache
const cache: { [key: string]: { data: Playlist; timestamp: number } } = {};

export async function fetchPlaylistData(playlistId: string): Promise<Playlist> {
  if (!YOUTUBE_API_KEY) {
    throw new Error('YouTube API key is not configured');
  }

  // Check cache first
  const cached = cache[playlistId];
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION * 1000) {
    return cached.data;
  }

  try {
    // Fetch playlist details
    const playlistResponse = await fetch(
      `${YOUTUBE_API_BASE_URL}/playlists?part=snippet&id=${playlistId}&key=${YOUTUBE_API_KEY}`
    );
    
    if (!playlistResponse.ok) {
      const error = await playlistResponse.json();
      throw new Error(error.error?.message || 'Failed to fetch playlist');
    }

    const playlistData = await playlistResponse.json();

    if (!playlistData.items?.length) {
      throw new Error('Playlist not found');
    }

    const playlist = playlistData.items[0];

    // Fetch playlist items
    const itemsResponse = await fetch(
      `${YOUTUBE_API_BASE_URL}/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}&key=${YOUTUBE_API_KEY}`
    );

    if (!itemsResponse.ok) {
      const error = await itemsResponse.json();
      throw new Error(error.error?.message || 'Failed to fetch playlist items');
    }

    const itemsData = await itemsResponse.json();

    const videos: Video[] = itemsData.items.map((item: any) => ({
      id: item.snippet.resourceId.videoId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default?.url,
      watched: false,
    }));

    const playlistInfo: Playlist = {
      id: playlistId,
      title: playlist.snippet.title,
      thumbnail: playlist.snippet.thumbnails.medium?.url || playlist.snippet.thumbnails.default?.url,
      videos,
    };

    // Cache the result
    cache[playlistId] = {
      data: playlistInfo,
      timestamp: Date.now(),
    };

    return playlistInfo;
  } catch (error) {
    console.error('Error fetching playlist:', error);
    throw error;
  }
} 