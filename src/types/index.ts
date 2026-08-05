export type Category = "All" | "Movies" | "Series" | "Songs" | "Podcasts";

export interface StreamingOffer {
  provider: string;
  type: string;
  price?: string;
  quality?: string;
  url?: string;
  logoColor?: string;
}

export interface Review {
  id: number;
  title: string;
  category: Category;
  creator: string;
  year: number;
  rating: number;
  audienceRating?: number;
  coverColor: string;
  tags: string[];
  excerpt: string;
  description?: string;
  platform?: string;
  cast?: string[];
  duration?: string;
  trailerUrl?: string;
  embedUrl?: string;
  streamingOffers?: StreamingOffer[];
  imageUrl?: string;
  releaseDate?: string;
  country?: string;
  language?: string;
  director?: string;
  production?: string;
  budget?: string;
}

export interface UserReview {
  id: number;
  reviewId: number;
  rating: number;
  content: string;
  author: string;
  date: string;
  helpful: number;
}

export interface DiaryEntry {
  id: number;
  reviewId: number;
  watchedDate: string;
  rating?: number;
  rewatch: boolean;
}

export interface UserList {
  id: string;
  name: string;
  description: string;
  reviewIds: number[];
  createdAt: string;
  gradient: string;
}

export interface UserProfile {
  email: string;
  username: string;
  bio: string;
  avatar: string;
  joinedAt: string;
}

export type SortOption = "newest" | "highest" | "trending" | "discussed";

export interface FilterState {
  category: Category;
  search: string;
  year: string;
  genre: string;
  platform: string;
  minRating: number;
  sort: SortOption;
}

export type ToastType = "success" | "error" | "info";

export interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

export interface EditorialCollection {
  id: number;
  title: string;
  subtitle: string;
  coverImage?: string;
  reviewIds: number[];
  gradient: string;
}

export interface Collection {
  id: string;
  title: string;
  subtitle: string;
  reviewIds: number[];
  gradient: string;
}

export interface LeaderboardItem {
  rank: number;
  title: string;
  category: Category;
  rating: number;
  change: "up" | "down" | "same";
  reviews: number;
}
