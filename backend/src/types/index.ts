export interface DogBreed {
  name: string;
  image?: string;
}

export interface DogImage {
  url: string;
}

export interface FavoriteBreed {
  breed: string;
  addedAt: string;
  image?: string;
}

export interface DogAPIResponse {
  message: string[] | string;
  status: string;
}

export interface BreedsListResponse {
  message: {
    [breed: string]: string[];
  };
  status: string;
}
