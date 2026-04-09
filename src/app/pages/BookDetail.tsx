import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import {
  Star,
  ShoppingCart,
  ArrowLeft,
  BookOpen,
  Package,
  Globe,
  ScanSearch,
  Heart,
  MessageSquareText,
  Trash2,
  Pencil,
} from 'lucide-react';
import { toast } from 'sonner';
import { useBooks } from '../contexts/BooksContext';
import { useCart } from '../contexts/CartContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { accountApi } from '../lib/account-api';
import type { Review } from '../types/account';

export const BookDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { getBookById, isLoading, error } = useBooks();
  const { language, t, categoryLabel, locale } = useLanguage();
  const { user, authToken, isAuthenticated } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [editingReviewId, setEditingReviewId] = useState<number | null>(null);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [isWishlistSaving, setIsWishlistSaving] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const copy =
    language === 'hi'
      ? {
          loading: 'पुस्तक लोड हो रही है...',
          loadError: 'यह पुस्तक लोड नहीं हो सकी',
          browseAll: 'सभी पुस्तकें देखें',
          notFound: 'पुस्तक नहीं मिली',
          back: 'वापस',
          off: 'छूट',
          deliveryReturns: 'डिलीवरी और रिटर्न',
          freeDelivery: '₹500 से ऊपर के ऑर्डर पर मुफ्त डिलीवरी',
          easyReturn: '7 दिन की आसान रिटर्न नीति',
          cod: 'कैश ऑन डिलीवरी उपलब्ध',
          cartError: 'कार्ट अपडेट नहीं हो सका।',
          addWishlist: 'विशलिस्ट में सेव करें',
          removeWishlist: 'विशलिस्ट से हटाएं',
          wishlistSaved: 'पुस्तक विशलिस्ट में सेव हो गई।',
          wishlistRemoved: 'पुस्तक विशलिस्ट से हटा दी गई।',
          wishlistError: 'विशलिस्ट अपडेट नहीं हो सकी।',
          reviews: 'रीव्यू',
          reviewsHelp: 'इस पुस्तक को पढ़ने वाले पाठकों की राय देखें और अपनी राय दें।',
          writeReview: 'अपना रिव्यू लिखें',
          rating: 'रेटिंग',
          comment: 'टिप्पणी',
          submitReview: 'रिव्यू सबमिट करें',
          updateReview: 'रिव्यू अपडेट करें',
          deleteReview: 'रिव्यू हटाएं',
          editReview: 'रिव्यू एडिट करें',
          noReviews: 'अभी तक कोई रिव्यू नहीं है।',
          noReviewsText: 'इस पुस्तक पर पहला रिव्यू लिखें।',
          reviewPlaceholder: 'इस पुस्तक के बारे में अपनी राय लिखें...',
          reviewSaved: 'रिव्यू सफलतापूर्वक सेव हो गया।',
          reviewDeleted: 'रिव्यू हटा दिया गया।',
          reviewError: 'रिव्यू अपडेट नहीं हो सका।',
          loginToReview: 'रिव्यू लिखने के लिए लॉगिन करें',
          loginToWishlist: 'विशलिस्ट उपयोग करने के लिए लॉगिन करें',
          cancelEdit: 'एडिट रद्द करें',
          loadReviewsError: 'रिव्यू लोड नहीं हो सके।',
          reviewedHint: 'आपने इस पुस्तक पर पहले से रिव्यू दिया है। आप उसे अपडेट कर सकते हैं।',
        }
      : {
          loading: 'Loading book...',
          loadError: 'Could not load this book',
          browseAll: 'Browse all books',
          notFound: 'Book not found',
          back: 'Back',
          off: 'OFF',
          deliveryReturns: 'Delivery & Returns',
          freeDelivery: 'Free delivery on orders above ₹500',
          easyReturn: '7 days easy return policy',
          cod: 'Cash on Delivery available',
          cartError: 'Could not update cart.',
          addWishlist: 'Save to Wishlist',
          removeWishlist: 'Remove from Wishlist',
          wishlistSaved: 'Book saved to wishlist.',
          wishlistRemoved: 'Book removed from wishlist.',
          wishlistError: 'Could not update wishlist.',
          reviews: 'Reviews',
          reviewsHelp: 'See what readers think about this book and share your own review.',
          writeReview: 'Write Your Review',
          rating: 'Rating',
          comment: 'Comment',
          submitReview: 'Submit Review',
          updateReview: 'Update Review',
          deleteReview: 'Delete Review',
          editReview: 'Edit Review',
          noReviews: 'No reviews yet.',
          noReviewsText: 'Be the first reader to review this book.',
          reviewPlaceholder: 'Share what you liked about this book...',
          reviewSaved: 'Review saved successfully.',
          reviewDeleted: 'Review deleted successfully.',
          reviewError: 'Could not update review.',
          loginToReview: 'Login to write a review',
          loginToWishlist: 'Login to use wishlist',
          cancelEdit: 'Cancel Edit',
          loadReviewsError: 'Could not load reviews.',
          reviewedHint: 'You have already reviewed this book. You can update it here.',
        };

  const book = getBookById(Number(id));
  const formatPrice = (value: number) =>
    new Intl.NumberFormat(locale, { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);

  const myReview = useMemo(
    () => reviews.find((review) => review.userId === user?.id) ?? null,
    [reviews, user?.id]
  );

  useEffect(() => {
    if (!id) {
      return;
    }

    let isActive = true;

    const loadReviews = async () => {
      setIsLoadingReviews(true);
      try {
        const response = await accountApi.getReviews(Number(id));
        if (isActive) {
          setReviews(response);
        }
      } catch (loadError) {
        if (isActive) {
          toast.error(loadError instanceof Error ? loadError.message : copy.loadReviewsError);
        }
      } finally {
        if (isActive) {
          setIsLoadingReviews(false);
        }
      }
    };

    void loadReviews();
    return () => {
      isActive = false;
    };
  }, [copy.loadReviewsError, id]);

  useEffect(() => {
    if (!authToken || !id) {
      setIsWishlisted(false);
      return;
    }

    let isActive = true;
    const loadWishlistState = async () => {
      try {
        const items = await accountApi.getWishlist(authToken);
        if (isActive) {
          setIsWishlisted(items.some((item) => item.id === Number(id)));
        }
      } catch {
        if (isActive) {
          setIsWishlisted(false);
        }
      }
    };

    void loadWishlistState();
    return () => {
      isActive = false;
    };
  }, [authToken, id]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="mb-4 text-2xl font-bold text-gray-900">{copy.loading}</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="mb-4 text-2xl font-bold text-gray-900">{copy.loadError}</h2>
          <p className="mb-4 text-gray-600">{error}</p>
          <Link to="/books" className="text-blue-600 hover:text-blue-700">
            {copy.browseAll}
          </Link>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="mb-4 text-2xl font-bold text-gray-900">{copy.notFound}</h2>
          <Link to="/books" className="text-blue-600 hover:text-blue-700">
            {copy.browseAll}
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = async () => {
    try {
      await addToCart(book);
      toast.success(`${book.title} ${t('common.addedToCart')}`, { duration: 500 });
    } catch (loadError) {
      toast.error(loadError instanceof Error ? loadError.message : copy.cartError);
    }
  };

  const handleBuyNow = async () => {
    try {
      await addToCart(book);
      navigate('/cart');
    } catch (loadError) {
      toast.error(loadError instanceof Error ? loadError.message : copy.cartError);
    }
  };

  const handleWishlistToggle = async () => {
    if (!authToken) {
      toast.info(copy.loginToWishlist);
      navigate('/login', { state: { from: { pathname: `/book/${book.id}` } } });
      return;
    }

    setIsWishlistSaving(true);
    try {
      if (isWishlisted) {
        await accountApi.removeWishlistItem(authToken, book.id);
        setIsWishlisted(false);
        toast.success(copy.wishlistRemoved);
      } else {
        await accountApi.addWishlistItem(authToken, book.id);
        setIsWishlisted(true);
        toast.success(copy.wishlistSaved);
      }
    } catch (loadError) {
      toast.error(loadError instanceof Error ? loadError.message : copy.wishlistError);
    } finally {
      setIsWishlistSaving(false);
    }
  };

  const handleReviewSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!authToken) {
      toast.info(copy.loginToReview);
      navigate('/login', { state: { from: { pathname: `/book/${book.id}` } } });
      return;
    }

    setIsSubmittingReview(true);
    try {
      const savedReview = editingReviewId
        ? await accountApi.updateReview(authToken, book.id, editingReviewId, reviewForm)
        : await accountApi.createReview(authToken, book.id, reviewForm);

      setReviews((current) => {
        const others = current.filter((review) => review.id !== savedReview.id);
        return [savedReview, ...others].sort(
          (left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()
        );
      });
      setEditingReviewId(null);
      setReviewForm({ rating: 5, comment: '' });
      toast.success(copy.reviewSaved);
    } catch (loadError) {
      toast.error(loadError instanceof Error ? loadError.message : copy.reviewError);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const startEditingReview = (review: Review) => {
    setEditingReviewId(review.id);
    setReviewForm({
      rating: review.rating,
      comment: review.comment,
    });
  };

  const handleReviewDelete = async (reviewId: number) => {
    if (!authToken) {
      return;
    }

    try {
      await accountApi.deleteReview(authToken, book.id, reviewId);
      setReviews((current) => current.filter((review) => review.id !== reviewId));
      if (editingReviewId === reviewId) {
        setEditingReviewId(null);
        setReviewForm({ rating: 5, comment: '' });
      }
      toast.success(copy.reviewDeleted);
    } catch (loadError) {
      toast.error(loadError instanceof Error ? loadError.message : copy.reviewError);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center text-gray-600 transition hover:text-gray-900"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          {copy.back}
        </button>

        <div className="overflow-hidden rounded-lg bg-white shadow-lg">
          <div className="grid gap-8 p-8 md:grid-cols-2">
            <div className="flex items-start justify-center">
              <div className="relative w-full max-w-md">
                <img src={book.image} alt={book.title} className="w-full rounded-lg shadow-xl" />
                <div className="absolute right-4 top-4 flex items-center rounded-lg bg-yellow-400 px-3 py-2 font-semibold text-gray-900">
                  <Star className="mr-1 h-5 w-5 fill-current" />
                  {book.rating}
                </div>
              </div>
            </div>

            <div className="flex flex-col">
              <div className="mb-4">
                <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-800">
                  {categoryLabel(book.category)}
                </span>
              </div>

              <h1 className="mb-4 text-4xl font-bold text-gray-900">{book.title}</h1>
              <p className="mb-6 text-xl text-gray-600">
                {t('common.by')} <span className="font-semibold">{book.author}</span>
              </p>

              <div className="mb-6 flex items-baseline">
                <span className="text-4xl font-bold text-gray-900">{formatPrice(Number(book.price))}</span>
                <span className="ml-2 text-gray-500 line-through">
                  {formatPrice(Math.round(Number(book.price) * 1.3))}
                </span>
                <span className="ml-2 font-semibold text-green-600">23% {copy.off}</span>
              </div>

              <div className="mb-8 space-y-3">
                <div className="flex items-center text-gray-700">
                  <BookOpen className="mr-3 h-5 w-5 text-blue-600" />
                  <span><strong>{t('common.pages')}:</strong> {book.pages}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <Package className="mr-3 h-5 w-5 text-blue-600" />
                  <span><strong>{t('common.publisher')}:</strong> {book.publisher}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <Globe className="mr-3 h-5 w-5 text-blue-600" />
                  <span><strong>{t('common.language')}:</strong> {book.language}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <ScanSearch className="mr-3 h-5 w-5 text-blue-600" />
                  <span><strong>{t('common.isbn')}:</strong> {book.isbn}</span>
                </div>
              </div>

              <div className="mb-8 flex flex-col gap-4 sm:flex-row">
                <button
                  onClick={() => void handleAddToCart()}
                  className="flex flex-1 items-center justify-center rounded-lg border-2 border-blue-600 bg-white px-6 py-3 font-semibold text-blue-600 transition hover:bg-blue-50"
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  {t('common.addToCart')}
                </button>
                <button
                  onClick={() => void handleBuyNow()}
                  className="flex-1 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
                >
                  {t('common.buyNow')}
                </button>
              </div>

              <button
                onClick={() => void handleWishlistToggle()}
                disabled={isWishlistSaving}
                className={`mb-8 inline-flex items-center justify-center rounded-lg border px-6 py-3 font-semibold transition ${
                  isWishlisted
                    ? 'border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100'
                    : 'border-slate-300 bg-white text-slate-700 hover:border-rose-300 hover:text-rose-600'
                } disabled:cursor-not-allowed disabled:opacity-70`}
              >
                <Heart className={`mr-2 h-5 w-5 ${isWishlisted ? 'fill-current' : ''}`} />
                {isWishlisted ? copy.removeWishlist : copy.addWishlist}
              </button>

              <div className="border-t pt-6">
                <h2 className="mb-3 text-xl font-bold text-gray-900">{t('common.description')}</h2>
                <p className="leading-relaxed text-gray-700">{book.description}</p>
              </div>

              <div className="mt-6 border-t pt-6">
                <h2 className="mb-4 text-xl font-bold text-gray-900">{copy.deliveryReturns}</h2>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start"><span className="mr-2 text-green-600">✓</span><span>{copy.freeDelivery}</span></li>
                  <li className="flex items-start"><span className="mr-2 text-green-600">✓</span><span>{copy.easyReturn}</span></li>
                  <li className="flex items-start"><span className="mr-2 text-green-600">✓</span><span>{copy.cod}</span></li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">
          <div className="flex items-center gap-3">
            <MessageSquareText className="h-5 w-5 text-blue-600" />
            <div>
              <h2 className="text-2xl font-black text-slate-900">{copy.reviews}</h2>
              <p className="text-sm text-slate-500">{copy.reviewsHelp}</p>
            </div>
          </div>

          <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_1.2fr]">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <h3 className="text-xl font-bold text-slate-900">{copy.writeReview}</h3>
              {!isAuthenticated && <p className="mt-2 text-sm text-slate-500">{copy.loginToReview}</p>}
              {myReview && editingReviewId === null && <p className="mt-2 text-sm text-blue-600">{copy.reviewedHint}</p>}

              <form onSubmit={handleReviewSubmit} className="mt-5 space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">{copy.rating}</label>
                  <select
                    value={reviewForm.rating}
                    onChange={(event) => setReviewForm((current) => ({ ...current, rating: Number(event.target.value) }))}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-500"
                  >
                    {[5, 4, 3, 2, 1].map((value) => (
                      <option key={value} value={value}>
                        {value} / 5
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">{copy.comment}</label>
                  <textarea
                    value={reviewForm.comment}
                    onChange={(event) => setReviewForm((current) => ({ ...current, comment: event.target.value }))}
                    rows={5}
                    placeholder={copy.reviewPlaceholder}
                    className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-500"
                  />
                </div>
                <div className="flex flex-wrap gap-3">
                  <button
                    type="submit"
                    disabled={!isAuthenticated || isSubmittingReview}
                    className="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isSubmittingReview ? t('common.loading') : editingReviewId ? copy.updateReview : copy.submitReview}
                  </button>
                  {editingReviewId !== null && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingReviewId(null);
                        setReviewForm({ rating: 5, comment: '' });
                      }}
                      className="rounded-2xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:border-slate-400"
                    >
                      {copy.cancelEdit}
                    </button>
                  )}
                </div>
              </form>
            </div>

            <div>
              {isLoadingReviews ? (
                <div className="rounded-3xl border border-slate-200 bg-slate-50 px-6 py-10 text-slate-500">
                  {t('common.loading')}
                </div>
              ) : reviews.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
                  <h3 className="text-lg font-bold text-slate-900">{copy.noReviews}</h3>
                  <p className="mt-2 text-sm text-slate-500">{copy.noReviewsText}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review) => {
                    const isMine = review.userId === user?.id;
                    return (
                      <article key={review.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="text-lg font-bold text-slate-900">{review.userName}</h3>
                            <p className="text-sm text-slate-500">
                              {new Date(review.createdAt).toLocaleDateString(locale, {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </p>
                          </div>
                          <div className="inline-flex items-center rounded-full bg-yellow-100 px-3 py-1 text-sm font-semibold text-yellow-800">
                            <Star className="mr-1 h-4 w-4 fill-current" />
                            {review.rating}
                          </div>
                        </div>
                        <p className="mt-4 leading-relaxed text-slate-700">{review.comment}</p>
                        {isMine && (
                          <div className="mt-4 flex gap-3">
                            <button
                              type="button"
                              onClick={() => startEditingReview(review)}
                              className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700"
                            >
                              <Pencil className="mr-1 h-4 w-4" />
                              {copy.editReview}
                            </button>
                            <button
                              type="button"
                              onClick={() => void handleReviewDelete(review.id)}
                              className="inline-flex items-center text-sm font-semibold text-rose-600 hover:text-rose-700"
                            >
                              <Trash2 className="mr-1 h-4 w-4" />
                              {copy.deleteReview}
                            </button>
                          </div>
                        )}
                      </article>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
