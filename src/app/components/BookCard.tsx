import React from 'react';
import { Link } from 'react-router';
import { Star, ShoppingCart } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useLanguage } from '../contexts/LanguageContext';
import { toast } from 'sonner';
import type { Book } from '../types/book';

interface BookCardProps {
  book: Book;
}

export const BookCard: React.FC<BookCardProps> = ({ book }) => {
  const { addToCart } = useCart();
  const { t, categoryLabel } = useLanguage();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();

    try {
      await addToCart(book);
      toast.success(`${book.title} ${t('common.addedToCart')}`, { duration: 500 });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not update cart.');
    }
  };

  return (
    <Link
      to={`/book/${book.id}`}
      className="group animate-card-flow flex h-full flex-col overflow-hidden rounded-lg bg-white shadow-md transition-shadow duration-300 hover:shadow-xl"
    >
      <div className="relative aspect-[3/4] overflow-hidden">
        <img
          src={book.image}
          alt={book.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute right-2 top-2 flex items-center rounded bg-yellow-400 px-2 py-1 text-sm font-semibold text-gray-900">
          <Star className="mr-1 h-4 w-4 fill-current" />
          {book.rating}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="mb-1 text-xs font-semibold uppercase text-blue-600">{categoryLabel(book.category)}</div>
        <h3 className="mb-1 min-h-[3.5rem] line-clamp-2 font-semibold text-gray-900 transition group-hover:text-blue-600">
          {book.title}
        </h3>
        <p className="mb-2 min-h-[1.25rem] line-clamp-1 text-sm text-gray-600">{t('common.by')} {book.author}</p>

        <div className="mt-auto flex items-center justify-between pt-3">
          <span className="text-lg font-bold text-gray-900">₹{book.price}</span>
          <button
            onClick={(e) => void handleAddToCart(e)}
            className="flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm text-white transition hover:bg-blue-700"
          >
            <ShoppingCart className="mr-1 h-4 w-4" />
            {t('common.add')}
          </button>
        </div>
      </div>
    </Link>
  );
};
