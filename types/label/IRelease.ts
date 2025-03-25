import { ReleaseStatus, ReleaseType } from '~/constants/release';

interface Status {
  label: ReleaseStatus;
  message?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface HistoryEntry {
  editor: string;
  status: Status;
}

interface CurrentStatus {
  label: ReleaseStatus;
  message?: string;
  history?: HistoryEntry[];
  createdAt?: string;
  updatedAt?: string;
}

interface ArtistInfo {
  userId: string;
  stageName: string;
}

export interface Authors {
  lyricists: string[];
  producers: string[];
}

interface Lyrics {
  text?: string;
  ttmlKey?: string;
}

interface FileInfo {
  key: string;
  duration: number;
}

export interface Track {
  release: string;
  index: number;
  name?: string;
  file: FileInfo;
  feat?: string[];
  authors: Authors;
  lyrics?: Lyrics;
  explicit?: boolean;
  isrc?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Release {
  id: string;
  artist: ArtistInfo;
  name?: string;
  type?: ReleaseType;
  date?: string | Date;
  cover?: string;
  feat?: string[];
  authors: Authors;
  status?: CurrentStatus;
  upc?: string;
  tracks?: Track[];
  createdAt?: string;
  updatedAt?: string;
}
