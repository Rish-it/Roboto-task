export interface BlogHit {
  objectID: string;
  title: string;
  description?: string;
  slug: string;
  publishedAt?: string;
  author?: {
    name: string;
    position?: string;
  };
  imageUrl?: string;
}

export interface SearchState {
  query: string;
  isSearching: boolean;
  showSuggestions: boolean;
  suggestions: BlogHit[];
} 