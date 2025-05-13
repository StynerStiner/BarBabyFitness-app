// src/services/contentService.ts
// Using local storage as fallback instead of AWS DynamoDB
import type { PageContent } from "../types/aws/content";

// Local storage content cache
const contentCache = new Map<string, PageContent>();

export class ContentService {
  async getContent(id: string, path: string): Promise<PageContent | null> {
    try {
      // Use local storage as fallback
      const cacheKey = `${id}:${path}`;
      const cachedItem = contentCache.get(cacheKey);

      // Return cached content if available
      if (cachedItem) {
        console.log(`Retrieved cached content for ${id}:${path}`);
        return cachedItem;
      }
      
      // Try to get from localStorage
      const localStorageKey = `content_${id}_${path}`;
      const storedContent = localStorage.getItem(localStorageKey);
      
      if (storedContent) {
        const parsedContent = JSON.parse(storedContent) as PageContent;
        contentCache.set(cacheKey, parsedContent);
        return parsedContent;
      }
      
      console.log(`No content found for ${id}:${path}`);
      return null;
    } catch (error) {
      console.error('Error fetching content:', error);
      return null;
    }
  }

  async updateContent(content: PageContent): Promise<void> {
    try {
      const cacheKey = `${content.id}:${content.path}`;
      const updatedContent = {
        ...content,
        lastModified: new Date().toISOString(),
        version: Date.now()
      };
      
      // Update cache
      contentCache.set(cacheKey, updatedContent);
      
      // Update localStorage as fallback
      const localStorageKey = `content_${content.id}_${content.path}`;
      localStorage.setItem(localStorageKey, JSON.stringify(updatedContent));
      
      console.log(`Content updated for ${content.id}:${content.path}`);
    } catch (error) {
      console.error('Error updating content:', error);
    }
  }
}

export const contentService = new ContentService();