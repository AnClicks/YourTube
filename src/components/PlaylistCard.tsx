import { Playlist } from '../types';
import Link from 'next/link';
import Image from 'next/image';

interface PlaylistCardProps {
  playlist: Playlist;
}

export default function PlaylistCard({ playlist }: PlaylistCardProps) {
  const watchedCount = playlist.videos.filter(video => video.watched).length;
  const progress = (watchedCount / playlist.videos.length) * 100;

  return (
    <Link href={`/playlist/${playlist.id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <div className="relative h-48">
          <Image
            src={playlist.thumbnail}
            alt={playlist.title}
            fill
            className="object-cover"
          />
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-2 truncate">{playlist.title}</h3>
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>{playlist.videos.length} videos</span>
            <span>{Math.round(progress)}% watched</span>
          </div>
          <div className="mt-2 bg-gray-200 rounded-full h-2">
            <div
              className="bg-indigo-600 h-2 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </Link>
  );
} 