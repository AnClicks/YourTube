export interface Video {
  id: string;
  title: string;
  thumbnail: string;
  watched: boolean;
}

export interface Playlist {
  id: string;
  title: string;
  videos: Video[];
  thumbnail: string;
}

export interface WatchedStatus {
  [videoId: string]: boolean;
} 