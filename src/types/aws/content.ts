// src/types/aws/content.ts
export interface PageContent {
  id: string;
  content: string;
  lastModified: string;
  contentType: 'text' | 'html' | 'json';
  version: number;
  path: string;
}