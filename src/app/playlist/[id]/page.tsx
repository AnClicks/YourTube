'use client';

import { useParams } from 'next/navigation';
import PlaylistClient from './PlaylistClient';

export default function Page() {
  const params = useParams();
  const id = params?.id as string;

  if (!id) {
    return <div>Invalid playlist ID</div>;
  }

  return <PlaylistClient playlistId={id} />;
} 