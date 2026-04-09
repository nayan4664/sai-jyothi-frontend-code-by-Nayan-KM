import React, { createContext, useContext, useEffect, useState } from 'react';
import { booksApi } from '../lib/books-api';
import type { Book } from '../types/book';

interface BooksContextType {
  books: Book[];
  categories: string[];
  isLoading: boolean;
  error: string | null;
  refreshBooks: () => Promise<void>;
  getBookById: (id: number) => Book | undefined;
}

const BooksContext = createContext<BooksContextType | undefined>(undefined);

export const BooksProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshBooks = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [bookList, categoryList] = await Promise.all([
        booksApi.getBooks(),
        booksApi.getCategories(),
      ]);

      setBooks(bookList);
      setCategories(['All', ...categoryList]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load books right now.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void refreshBooks();
  }, []);

  return (
    <BooksContext.Provider
      value={{
        books,
        categories,
        isLoading,
        error,
        refreshBooks,
        getBookById: (id: number) => books.find((book) => book.id === id),
      }}
    >
      {children}
    </BooksContext.Provider>
  );
};

export const useBooks = () => {
  const context = useContext(BooksContext);

  if (!context) {
    throw new Error('useBooks must be used within a BooksProvider');
  }

  return context;
};
