import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import {
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  ArrowRight,
  BookOpen,
  Truck,
  Shield,
  Headphones,
  Sparkles,
  Code2,
  BookText,
  GraduationCap,
  Baby,
  HeartHandshake,
  UserCircle2,
  Landmark,
  Briefcase,
  Flower2,
  Palette,
  Tag,
  Gift,
  MessageCircle,
} from 'lucide-react';
import { BookCard } from '../components/BookCard';
import { useBooks } from '../contexts/BooksContext';
import { useLanguage } from '../contexts/LanguageContext';
import type { Book } from '../types/book';

const heroImages = [
  {
    url: 'https://images.unsplash.com/photo-1635891714190-4f4ad45f46ce?w=1920&h=1080&fit=crop',
    gradient: 'from-purple-900/80 via-purple-800/70 to-transparent',
  },
  {
    url: 'https://images.unsplash.com/photo-1661097403554-c3462f9df413?w=1920&h=1080&fit=crop',
    gradient: 'from-blue-900/80 via-blue-800/70 to-transparent',
  },
  {
    url: 'https://images.unsplash.com/photo-1725582204839-a094baf03e36?w=1920&h=1080&fit=crop',
    gradient: 'from-amber-900/80 via-amber-800/70 to-transparent',
  },
  {
    url: 'https://images.unsplash.com/photo-1697490189369-73d34e07be80?w=1920&h=1080&fit=crop',
    gradient: 'from-emerald-900/80 via-emerald-800/70 to-transparent',
  },
  {
    url: 'https://images.unsplash.com/photo-1680439633343-39c11e99f685?w=1920&h=1080&fit=crop',
    gradient: 'from-rose-900/80 via-rose-800/70 to-transparent',
  },
];

const categoryIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Programming: Code2,
  Fiction: BookText,
  Academic: GraduationCap,
  Kids: Baby,
  'Self-Help': HeartHandshake,
  Biography: UserCircle2,
  History: Landmark,
  Business: Briefcase,
  Spirituality: Flower2,
  Comics: Palette,
};

interface BookMarqueeSectionProps {
  title: string;
  description: string;
  books: Book[];
  sectionClassName: string;
  speedClassName?: string;
  headerContent?: React.ReactNode;
  action?: React.ReactNode;
}

const BookMarqueeSection: React.FC<BookMarqueeSectionProps> = ({
  title,
  description,
  books,
  sectionClassName,
  speedClassName = 'animate-book-marquee',
  headerContent,
  action,
}) => {
  const marqueeBooks = [...books, ...books];

  return (
    <section className={sectionClassName}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex items-center justify-between gap-6">
          <div>
            {headerContent}
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">{title}</h2>
            <p className="text-gray-600">{description}</p>
          </div>
          {action}
        </div>

        <div className="book-marquee-shell">
          <div className={`book-marquee-track ${speedClassName}`}>
            {marqueeBooks.map((book, index) => (
              <div
                key={`${book.id}-${index}`}
                className="book-marquee-card animate-fade-in"
                style={{ animationDelay: `${Math.min(index, books.length - 1) * 70}ms` }}
              >
                <BookCard book={book} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export const Home: React.FC = () => {
  const { books, categories, isLoading, error } = useBooks();
  const { language, t, categoryLabel } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const resumeAutoPlayTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const featuredBooks = books.slice(0, 10);
  const bestSellers = books.filter((book) => book.rating >= 4.7).slice(0, 8);
  const newArrivals = books.slice(10, 18);
  const whatsappLink =
    'https://wa.me/917038890264?text=Hello%2C%20I%20want%20to%20buy%20this%20book.%20Please%20share%20details.';

  const slideCopy =
    language === 'hi'
      ? [
          {
            title: 'आपकी रीडिंग दुनिया में स्वागत है',
            subtitle: 'हजारों प्रेरक और उपयोगी किताबें खोजें',
          },
          {
            title: 'ज्ञान अब आपकी उंगलियों पर',
            subtitle: 'हर श्रेणी में हमारी बड़ी कलेक्शन देखें',
          },
          {
            title: 'आरामदायक पढ़ने के पल',
            subtitle: 'आज ही अपनी पसंदीदा किताब चुनें',
          },
          {
            title: 'अपनी निजी लाइब्रेरी बनाइए',
            subtitle: 'बेस्टसेलर और क्लासिक पुस्तकों की प्रीमियम कलेक्शन',
          },
          {
            title: 'अंदर हैं खास ऑफर',
            subtitle: 'चुनिंदा किताबों पर 50% तक छूट, सीमित समय के लिए',
          },
        ]
      : [
          {
            title: 'Welcome to Your Reading Paradise',
            subtitle: 'Discover thousands of books that inspire and transform',
          },
          {
            title: 'Knowledge at Your Fingertips',
            subtitle: 'Explore our vast collection across all genres',
          },
          {
            title: 'Cozy Reading Moments',
            subtitle: 'Find your perfect book companion today',
          },
          {
            title: 'Build Your Personal Library',
            subtitle: 'Premium collection of bestsellers and classics',
          },
          {
            title: 'Special Offers Inside',
            subtitle: 'Up to 50% off on selected titles - Limited time!',
          },
        ];

  const copy =
    language === 'hi'
      ? {
          loading: 'बुकस्टोर लोड हो रहा है...',
          loadError: 'बुकस्टोर लोड नहीं हो सका',
          exploreBooks: 'पुस्तकें देखें',
          viewFiction: 'कथा साहित्य देखें',
          freeShipping: 'मुफ़्त डिलीवरी',
          freeShippingText: '₹500 से ऊपर के ऑर्डर पर',
          securePayment: 'सुरक्षित भुगतान',
          securePaymentText: '100% सुरक्षित लेन-देन',
          booksCount: `${books.length}+ पुस्तकें`,
          booksCountText: 'विस्तृत चयन',
          support: '24/7 सहायता',
          supportText: 'हम हमेशा मदद के लिए हैं',
          exploreCollections: 'कलेक्शन देखें',
          browseByCategory: 'श्रेणी के अनुसार ब्राउज़ करें',
          browseByCategoryText:
            'चयनित कलेक्शन और hand-picked titles के साथ अपनी पसंदीदा श्रेणियों तक सीधे पहुंचें।',
          titlesAvailable: (count: number) => `${count} शीर्षक उपलब्ध`,
          exploreNow: 'अभी देखें',
          featuredBooks: 'फीचर्ड पुस्तकें',
          featuredBooksText: 'आपके लिए चुनी हुई किताबें',
          bestSellers: 'बेस्ट सेलर्स',
          bestSellersText: 'हमारे पाठकों की सबसे पसंदीदा किताबें',
          newArrivals: 'नई पुस्तकें',
          newArrivalsText: 'हमारे कलेक्शन में नई जोड़',
          limitedTimeOffer: 'सीमित समय ऑफर',
          getUpTo: '50% तक छूट पाएं',
          getUpToText:
            'हर श्रेणी की top-rated किताबों पर शानदार बचत। रोज़ाना फ्लैश डील और वीकेंड कॉम्बो ऑफर उपलब्ध हैं।',
          shopNow: 'अभी खरीदें',
          extraOff: '₹999 से ऊपर के ऑर्डर पर अतिरिक्त 10% छूट',
        }
      : {
          loading: 'Loading bookstore...',
          loadError: 'Could not load the bookstore',
          exploreBooks: 'Explore Books',
          viewFiction: 'View Fiction',
          freeShipping: 'Free Shipping',
          freeShippingText: 'On orders above ₹500',
          securePayment: 'Secure Payment',
          securePaymentText: '100% secure transactions',
          booksCount: `${books.length}+ Books`,
          booksCountText: 'Wide selection',
          support: '24/7 Support',
          supportText: 'Always here to help',
          exploreCollections: 'Explore Collections',
          browseByCategory: 'Browse by Category',
          browseByCategoryText:
            'Jump straight into your favorite genres with curated collections and hand-picked titles.',
          titlesAvailable: (count: number) => `${count} titles available`,
          exploreNow: 'Explore now',
          featuredBooks: 'Featured Books',
          featuredBooksText: 'Hand-picked selections just for you',
          bestSellers: 'Best Sellers',
          bestSellersText: 'Most loved by our readers',
          newArrivals: 'New Arrivals',
          newArrivalsText: 'Fresh additions to our collection',
          limitedTimeOffer: 'LIMITED TIME OFFER',
          getUpTo: 'Get Up to 50% OFF',
          getUpToText:
            'Save big on top-rated books across all genres. Daily flash deals and weekend combo discounts available now.',
          shopNow: 'Shop Now',
          extraOff: 'Extra 10% off on orders above ₹999',
        };

  useEffect(() => {
    if (isAutoPlaying) {
      autoPlayRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % heroImages.length);
      }, 5000);
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
      if (resumeAutoPlayTimeoutRef.current) {
        clearTimeout(resumeAutoPlayTimeoutRef.current);
      }
    };
  }, [isAutoPlaying]);

  const pauseAutoPlay = () => {
    setIsAutoPlaying(false);

    if (resumeAutoPlayTimeoutRef.current) {
      clearTimeout(resumeAutoPlayTimeoutRef.current);
    }

    resumeAutoPlayTimeoutRef.current = setTimeout(() => {
      setIsAutoPlaying(true);
    }, 10000);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    pauseAutoPlay();
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    pauseAutoPlay();
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length);
    pauseAutoPlay();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <h1 className="text-3xl font-bold text-gray-900">{copy.loading}</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">{copy.loadError}</h1>
          <p className="mt-3 text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <section className="relative h-screen w-full overflow-hidden">
        <div
          className="flex h-full transition-transform duration-1000 ease-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {heroImages.map((image, index) => (
            <div key={index} className="relative min-w-full h-full flex-shrink-0">
              <div
                className={`absolute inset-0 bg-cover bg-center transition-transform duration-[20000ms] ${
                  currentSlide === index ? 'scale-110' : 'scale-100'
                }`}
                style={{ backgroundImage: `url(${image.url})` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${image.gradient}`} />
                <div className="absolute inset-0 bg-black/30" />
              </div>

              <div className="relative h-full flex items-center justify-center text-center px-4">
                <div
                  className={`max-w-5xl transition-all duration-1000 ${
                    currentSlide === index ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                  }`}
                >
                  <div className="inline-flex items-center bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full mb-6 border border-white/30">
                    <Sparkles className="h-4 w-4 mr-2" />
                    <span className="text-sm font-semibold">Sai Jyothi Publication</span>
                  </div>
                  <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight">
                    {slideCopy[index].title}
                  </h1>
                  <p className="text-xl md:text-3xl text-white/90 mb-10 font-light">
                    {slideCopy[index].subtitle}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                      to="/books"
                      className="group inline-flex items-center bg-white text-gray-900 px-10 py-4 rounded-full text-lg font-bold hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-2xl hover:shadow-blue-500/50 transform hover:scale-105"
                    >
                      {copy.exploreBooks}
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                      to="/books?category=Fiction"
                      className="inline-flex items-center bg-transparent border-2 border-white text-white px-10 py-4 rounded-full text-lg font-bold hover:bg-white hover:text-gray-900 transition-all duration-300 transform hover:scale-105"
                    >
                      {copy.viewFiction}
                    </Link>
                  </div>
                </div>
              </div>

              <div className="absolute top-10 left-10 w-20 h-20 border-4 border-white/30 rounded-full animate-pulse" />
              <div className="absolute bottom-20 right-20 w-32 h-32 border-4 border-white/20 rounded-full animate-pulse delay-700" />
            </div>
          ))}
        </div>

        <button
          onClick={prevSlide}
          className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 bg-white/30 backdrop-blur-md hover:bg-white/50 text-white p-4 rounded-full transition-all z-10 group border border-white/30 hover:scale-110"
        >
          <ChevronLeft className="h-6 w-6 group-hover:-translate-x-1 transition-transform" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 bg-white/30 backdrop-blur-md hover:bg-white/50 text-white p-4 rounded-full transition-all z-10 group border border-white/30 hover:scale-110"
        >
          <ChevronRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
        </button>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3 z-10">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`rounded-full transition-all duration-300 ${
                currentSlide === index ? 'bg-white w-12 h-3' : 'bg-white/50 w-3 h-3 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      </section>

      <section className="py-8 bg-white shadow-lg relative -mt-16 mx-4 md:mx-8 lg:mx-16 rounded-2xl z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-3">
                <Truck className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-bold text-gray-900">{copy.freeShipping}</h3>
              <p className="text-sm text-gray-600">{copy.freeShippingText}</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-3">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-bold text-gray-900">{copy.securePayment}</h3>
              <p className="text-sm text-gray-600">{copy.securePaymentText}</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-3">
                <BookOpen className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-bold text-gray-900">{copy.booksCount}</h3>
              <p className="text-sm text-gray-600">{copy.booksCountText}</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-3">
                <Headphones className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="font-bold text-gray-900">{copy.support}</h3>
              <p className="text-sm text-gray-600">{copy.supportText}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-b from-white to-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-flex items-center rounded-full bg-blue-100 text-blue-700 px-4 py-1 text-xs font-semibold uppercase tracking-[0.14em] mb-4">
              <Sparkles className="h-3.5 w-3.5 mr-1.5" />
              {copy.exploreCollections}
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">{copy.browseByCategory}</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">{copy.browseByCategoryText}</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
            {categories
              .filter((cat) => cat !== 'All')
              .map((category, index) => {
                const Icon = categoryIconMap[category] ?? BookOpen;
                const count = books.filter((book) => book.category === category).length;

                return (
                  <Link
                    key={category}
                    to={`/books?category=${category}`}
                    className="group relative"
                    style={{ animationDelay: `${index * 60}ms` }}
                  >
                    <div className="relative overflow-hidden rounded-2xl border border-white/50 bg-white p-5 shadow-lg transition-all duration-300 group-hover:-translate-y-1.5 group-hover:shadow-2xl">
                      <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-gradient-to-br from-blue-400/20 to-purple-500/30 blur-2xl transition-all duration-300 group-hover:scale-110" />
                      <div className="relative">
                        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md">
                          <Icon className="h-6 w-6" />
                        </div>
                        <h3 className="font-bold text-lg text-gray-900">{categoryLabel(category)}</h3>
                        <p className="text-sm text-gray-500 mt-1">{copy.titlesAvailable(count)}</p>
                        <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-blue-600">
                          {copy.exploreNow}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
          </div>
        </div>
      </section>

      <BookMarqueeSection
        title={copy.featuredBooks}
        description={copy.featuredBooksText}
        books={featuredBooks}
        sectionClassName="py-20 bg-white"
        speedClassName="animate-book-marquee"
        action={
          <Link
            to="/books"
            className="hidden md:flex items-center text-blue-600 hover:text-blue-700 font-semibold text-lg group"
          >
            {t('common.viewAll')}
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        }
      />

      <section className="py-20 bg-gradient-to-br from-yellow-50 to-orange-50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-yellow-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-200/30 rounded-full blur-3xl" />

        <div className="relative">
          <BookMarqueeSection
            title={copy.bestSellers}
            description={copy.bestSellersText}
            books={bestSellers}
            sectionClassName=""
            speedClassName="animate-book-marquee-slow"
            headerContent={
              <div className="mb-1 flex items-center">
                <div className="bg-yellow-400 p-3 rounded-xl mr-4 animate-pulse">
                  <TrendingUp className="h-8 w-8 text-yellow-900" />
                </div>
              </div>
            }
          />
        </div>
      </section>

      <BookMarqueeSection
        title={copy.newArrivals}
        description={copy.newArrivalsText}
        books={newArrivals}
        sectionClassName="py-20 bg-gradient-to-br from-purple-50 to-pink-50"
        speedClassName="animate-book-marquee-fast"
        headerContent={
          <div className="mb-1 flex items-center">
            <div className="bg-purple-500 p-3 rounded-xl mr-4">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
          </div>
        }
      />

      <section className="py-20 bg-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.25),_transparent_45%),radial-gradient(circle_at_bottom_right,_rgba(236,72,153,0.3),_transparent_45%)]" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-white/15 bg-white/5 backdrop-blur-md px-6 py-12 md:px-10 text-center shadow-2xl">
            <div className="inline-flex items-center rounded-full border border-yellow-300/40 bg-yellow-300/15 px-4 py-2 text-yellow-200 font-semibold mb-6">
              <Tag className="h-4 w-4 mr-2" />
              {copy.limitedTimeOffer}
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white mb-4">{copy.getUpTo}</h2>
            <p className="text-lg md:text-xl text-white/85 max-w-2xl mx-auto mb-8">{copy.getUpToText}</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/books"
                className="inline-flex items-center rounded-full bg-cyan-400 px-8 py-3 text-lg font-bold text-slate-950 transition hover:bg-cyan-300"
              >
                {copy.shopNow}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <span className="inline-flex items-center rounded-full border border-white/25 px-4 py-2 text-sm text-white/90">
                <Gift className="mr-2 h-4 w-4" />
                {copy.extraOff}
              </span>
            </div>
          </div>
        </div>
      </section>

      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-6 right-6 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-2xl shadow-green-500/40 transition hover:scale-105 hover:bg-green-600"
      >
        <MessageCircle className="h-7 w-7" />
      </a>
    </div>
  );
};
