interface IArtistManager {
  surname: string;
  firstname: string;
  patronymic: string;
  contact: string;
}

export interface IArtist {
  id: string;
  stage_name: string;
  surname: string;
  firstname: string;
  patronymic: string;
  contact: string;
  manager: IArtistManager;
}

export type ArtistsList = IArtist[];
