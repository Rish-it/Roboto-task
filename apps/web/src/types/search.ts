export interface BlogHit {
  [key: string]: unknown;
  objectID: string;
  _id: string;
  _type: string;
  title: string;
  description?: string;
  slug: string;
  publishedAt?: string;
  orderRank?: string;
  author?: {
    name: string;
    position?: string;
  };
  category?: {
    title: string;
    slug: string;
    color: string;
    icon?: string;
  };
  content?: string;
  imageUrl?: string;
}

export interface SearchState {
  query: string;
  isSearching: boolean;
  showSuggestions: boolean;
  suggestions: BlogHit[];
} 