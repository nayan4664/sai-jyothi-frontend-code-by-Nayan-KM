import type { Book } from '../types/book';

const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim() || 'http://localhost:8080/api';

const parseJson = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
};

export const booksApi = {
  async getBooks(): Promise<Book[]> {
    const response = await fetch(`${API_BASE_URL}/books`);
    return parseJson<Book[]>(response);
  },

  async getCategories(): Promise<string[]> {
    const response = await fetch(`${API_BASE_URL}/books/categories`);
    return parseJson<string[]>(response);
  },
};
