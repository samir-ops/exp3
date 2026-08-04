export interface User {
  id: string;
  username: string;
  role: string;
}

export interface Post {
  id: string;
  content: string;
  platforms: string[];
  createdAt: string;
  status: 'published' | 'draft';
}

export interface Draft {
  id: string;
  content: string;
  platforms: string[];
  updatedAt: string;
}

export type Platform = 'twitter' | 'facebook' | 'linkedin';

export interface PlatformConfig {
  id: Platform;
  name: string;
  charLimit: number;
}
