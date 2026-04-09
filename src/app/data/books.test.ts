import { describe, expect, it } from 'vitest';
import { getBookById, searchBooks } from './books';

describe('books data helpers', () => {
  it('returns a matching book by id', () => {
    const book = getBookById(1);
    expect(book?.title).toBe('Java Programming Complete Guide');
  });

  it('searches by title and author fields', () => {
    const titleMatches = searchBooks('react');
    const authorMatches = searchBooks('Emily Chen');

    expect(titleMatches.length).toBeGreaterThan(0);
    expect(authorMatches.some((book) => book.author === 'Emily Chen')).toBe(true);
  });
});
