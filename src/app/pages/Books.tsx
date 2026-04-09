import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { Filter, SlidersHorizontal, Sparkles, Star } from 'lucide-react';
import { BookCard } from '../components/BookCard';
import { useBooks } from '../contexts/BooksContext';
import { useLanguage } from '../contexts/LanguageContext';

export const Books: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { books, categories, isLoading, error } = useBooks();
  const { language, categoryLabel } = useLanguage();

  const copy =
    language === 'hi'
      ? {
          loading: 'पुस्तकें लोड हो रही हैं...',
          loadError: 'पुस्तकें लोड नहीं हो सकीं',
          curatedCollection: 'चयनित कलेक्शन',
          resultsFor: (query: string) => `"${query}" के लिए परिणाम`,
          allBooks: 'सभी पुस्तकें',
          foundCount: (count: number, categoryCount: number) =>
            `${count} पुस्तकें मिलीं, ${categoryCount} श्रेणियों में।`,
          activeFilters: (count: number) => `${count} सक्रिय फ़िल्टर`,
          filters: 'फ़िल्टर',
          category: 'श्रेणी',
          priceRange: 'मूल्य सीमा',
          min: 'न्यूनतम',
          max: 'अधिकतम',
          minimumRating: 'न्यूनतम रेटिंग',
          sortBy: 'क्रमबद्ध करें',
          resetFilters: 'फ़िल्टर रीसेट करें',
          defaultSort: 'डिफ़ॉल्ट',
          nameAZ: 'नाम (अ-ह)',
          priceLow: 'कीमत: कम से ज़्यादा',
          priceHigh: 'कीमत: ज़्यादा से कम',
          highestRated: 'सबसे अधिक रेटेड',
          noBooksFound: 'कोई पुस्तक नहीं मिली',
          tryAdjusting: 'अपने फ़िल्टर या खोज मानदंड बदलकर फिर से देखें।',
        }
      : {
          loading: 'Loading books...',
          loadError: 'Could not load books',
          curatedCollection: 'Curated Collection',
          resultsFor: (query: string) => `Results for "${query}"`,
          allBooks: 'All Books',
          foundCount: (count: number, categoryCount: number) =>
            `${count} ${count === 1 ? 'book' : 'books'} found across ${categoryCount} genres.`,
          activeFilters: (count: number) => `${count} active filter${count > 1 ? 's' : ''}`,
          filters: 'Filters',
          category: 'Category',
          priceRange: 'Price Range',
          min: 'Min',
          max: 'Max',
          minimumRating: 'Minimum Rating',
          sortBy: 'Sort By',
          resetFilters: 'Reset Filters',
          defaultSort: 'Default',
          nameAZ: 'Name (A-Z)',
          priceLow: 'Price: Low to High',
          priceHigh: 'Price: High to Low',
          highestRated: 'Highest Rated',
          noBooksFound: 'No books found',
          tryAdjusting: 'Try adjusting your filters or search criteria.',
        };

  const maxPrice = useMemo(() => {
    if (books.length === 0) {
      return 0;
    }

    return Math.max(...books.map((book) => book.price));
  }, [books]);

  const [filteredBooks, setFilteredBooks] = useState(books);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 0 });
  const [sortBy, setSortBy] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [minRating, setMinRating] = useState(0);

  const categoryFromUrl = searchParams.get('category');
  const searchQuery = searchParams.get('search')?.trim() || '';

  useEffect(() => {
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
      return;
    }

    setSelectedCategory('All');
  }, [categoryFromUrl]);

  useEffect(() => {
    setPriceRange((current) => {
      if (maxPrice === 0) {
        return { min: 0, max: 0 };
      }

      if (current.max === 0 || current.max > maxPrice) {
        return { min: Math.min(current.min, maxPrice), max: maxPrice };
      }

      return current;
    });
  }, [maxPrice]);

  useEffect(() => {
    let result = [...books];

    if (searchQuery) {
      const lowercaseQuery = searchQuery.toLowerCase();
      result = result.filter(
        (book) =>
          book.title.toLowerCase().includes(lowercaseQuery) ||
          book.author.toLowerCase().includes(lowercaseQuery) ||
          book.category.toLowerCase().includes(lowercaseQuery) ||
          book.description.toLowerCase().includes(lowercaseQuery)
      );
    }

    const activeCategory =
      categoryFromUrl && categoryFromUrl !== 'All' ? categoryFromUrl : selectedCategory;
    if (activeCategory !== 'All') {
      result = result.filter((book) => book.category === activeCategory);
    }

    result = result.filter((book) => book.price >= priceRange.min && book.price <= priceRange.max);

    if (minRating > 0) {
      result = result.filter((book) => book.rating >= minRating);
    }

    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'name') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    }

    setFilteredBooks(result);
  }, [books, selectedCategory, priceRange, sortBy, searchQuery, categoryFromUrl, minRating]);

  const resetFilters = () => {
    navigate('/books');
    setSelectedCategory('All');
    setPriceRange({ min: 0, max: maxPrice });
    setSortBy('');
    setMinRating(0);
  };

  const activeFiltersCount =
    Number(selectedCategory !== 'All') +
    Number(priceRange.min > 0 || priceRange.max < maxPrice) +
    Number(sortBy !== '') +
    Number(minRating > 0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-100 to-slate-50 dark:from-slate-950 dark:to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">{copy.loading}</h1>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-100 to-slate-50 dark:from-slate-950 dark:to-slate-900">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">{copy.loadError}</h1>
          <p className="mt-3 text-slate-600 dark:text-slate-300">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 to-slate-50 dark:from-slate-950 dark:to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <section className="relative overflow-hidden rounded-3xl border border-white/50 bg-white/60 p-6 shadow-xl shadow-slate-300/35 backdrop-blur-lg dark:border-slate-700 dark:bg-slate-900/60 dark:shadow-slate-950/60 md:p-8">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-20 -right-16 h-56 w-56 rounded-full bg-cyan-400/20 blur-3xl" />
            <div className="absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-blue-400/15 blur-3xl" />
          </div>

          <div className="relative flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="inline-flex items-center rounded-full border border-cyan-300/40 bg-cyan-100/60 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-300">
                <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                {copy.curatedCollection}
              </div>
              <h1 className="mt-3 text-4xl font-black text-slate-900 dark:text-white">
                {searchQuery ? copy.resultsFor(searchQuery) : copy.allBooks}
              </h1>
              <p className="mt-2 text-slate-600 dark:text-slate-300">
                {copy.foundCount(filteredBooks.length, Math.max(categories.length - 1, 0))}
              </p>
            </div>

            {activeFiltersCount > 0 && (
              <div className="inline-flex items-center rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/30">
                {copy.activeFilters(activeFiltersCount)}
              </div>
            )}
          </div>
        </section>

        <div className="mt-6 flex flex-wrap gap-2">
          {categories.filter((category) => category !== 'All').map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                selectedCategory === category
                  ? 'bg-slate-900 text-white dark:bg-cyan-500 dark:text-slate-950'
                  : 'border border-slate-300 bg-white text-slate-700 hover:border-cyan-400 hover:text-cyan-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-cyan-400 dark:hover:text-cyan-300'
              }`}
            >
              {categoryLabel(category)}
            </button>
          ))}
        </div>

        <div className="mt-7 flex flex-col gap-8 lg:flex-row">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-3 font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          >
            <SlidersHorizontal className="mr-2 h-5 w-5" />
            {copy.filters}
          </button>

          <aside className={`${showFilters ? 'block' : 'hidden'} lg:block w-full lg:w-72 flex-shrink-0`}>
            <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto rounded-2xl border border-white/60 bg-white/70 p-6 shadow-lg backdrop-blur-md dark:border-slate-700 dark:bg-slate-900/70">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="flex items-center text-lg font-bold text-slate-900 dark:text-white">
                  <Filter className="mr-2 h-5 w-5" />
                  {copy.filters}
                </h2>
                <button
                  onClick={resetFilters}
                  className="text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-cyan-300 dark:hover:text-cyan-200"
                >
                  {copy.resetFilters}
                </button>
              </div>

              <div className="mb-6">
                <h3 className="mb-3 font-semibold text-slate-900 dark:text-slate-100">{copy.category}</h3>
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {categories.map((category) => (
                    <label key={category} className="flex cursor-pointer items-center">
                      <input
                        type="radio"
                        name="category"
                        value={category}
                        checked={selectedCategory === category}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="h-4 w-4 text-blue-600"
                      />
                      <span className="ml-2 text-slate-700 dark:text-slate-200">
                        {categoryLabel(category)}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="mb-3 font-semibold text-slate-900 dark:text-slate-100">{copy.priceRange}</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-slate-600 dark:text-slate-300">
                      {copy.min}: ₹{priceRange.min}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max={maxPrice}
                      step="50"
                      value={priceRange.min}
                      onChange={(e) =>
                        setPriceRange((current) => ({
                          ...current,
                          min: Math.min(Number(e.target.value), current.max),
                        }))
                      }
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-slate-600 dark:text-slate-300">
                      {copy.max}: ₹{priceRange.max}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max={maxPrice}
                      step="50"
                      value={priceRange.max}
                      onChange={(e) =>
                        setPriceRange((current) => ({
                          ...current,
                          max: Math.max(Number(e.target.value), current.min),
                        }))
                      }
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="mb-3 font-semibold text-slate-900 dark:text-slate-100">
                  {copy.minimumRating}
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {[0, 4, 4.5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => setMinRating(rating)}
                      className={`rounded-lg border px-2 py-2 text-sm font-semibold transition ${
                        minRating === rating
                          ? 'border-blue-600 bg-blue-600 text-white dark:border-cyan-400 dark:bg-cyan-500 dark:text-slate-950'
                          : 'border-slate-300 bg-white text-slate-700 hover:border-blue-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-cyan-400'
                      }`}
                    >
                      {rating === 0 ? (
                        language === 'hi' ? 'सभी' : 'All'
                      ) : (
                        <span className="inline-flex items-center">
                          {rating}+
                          <Star className="ml-1 h-3.5 w-3.5" />
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="mb-3 font-semibold text-slate-900 dark:text-slate-100">{copy.sortBy}</h3>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:ring-cyan-400"
                >
                  <option value="">{copy.defaultSort}</option>
                  <option value="name">{copy.nameAZ}</option>
                  <option value="price-low">{copy.priceLow}</option>
                  <option value="price-high">{copy.priceHigh}</option>
                  <option value="rating">{copy.highestRated}</option>
                </select>
              </div>
            </div>
          </aside>

          <main className="flex-1">
            {filteredBooks.length > 0 ? (
              <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
                {filteredBooks.map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900">
                <Sparkles className="mx-auto mb-4 h-12 w-12 text-blue-500" />
                <h3 className="mb-2 text-xl font-semibold text-slate-900 dark:text-white">
                  {copy.noBooksFound}
                </h3>
                <p className="mb-4 text-slate-600 dark:text-slate-300">{copy.tryAdjusting}</p>
                <button
                  onClick={resetFilters}
                  className="rounded-lg bg-blue-600 px-6 py-2 font-semibold text-white transition hover:bg-blue-700"
                >
                  {copy.resetFilters}
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
