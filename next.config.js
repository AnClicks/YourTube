/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    PORT: process.env.PORT || 3000,
    YOUTUBE_API_QUOTA_LIMIT: process.env.YOUTUBE_API_QUOTA_LIMIT || 10000,
    YOUTUBE_API_QUOTA_PERIOD: process.env.YOUTUBE_API_QUOTA_PERIOD || '24h',
    PLAYLIST_CACHE_DURATION: process.env.PLAYLIST_CACHE_DURATION || 3600,
  },
  // Enable image domains for YouTube thumbnails
  images: {
    domains: ['i.ytimg.com', 'img.youtube.com'],
  },
} 