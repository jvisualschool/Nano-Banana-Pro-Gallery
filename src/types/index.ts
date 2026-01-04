export interface Prompt {
  id: string;
  title: string;
  description: string;
  category: string;
  categoryId: number;
  imageUrl?: string;
  imageAlt?: string;
  prompt: string;
  promptType: 'text' | 'json';
  source?: {
    name: string;
    url?: string;
  };
}

export interface Category {
  id: number;
  name: string;
  description: string;
  icon?: string;
}

