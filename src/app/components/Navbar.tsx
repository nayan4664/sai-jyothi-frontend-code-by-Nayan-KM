import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { ShoppingCart, Search, Menu, X, User, Moon, Sun, Languages } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import logoUrl from '../assets/sjp-logo-latest.jpeg';

export const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDesktopSearchOpen, setIsDesktopSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mounted, setMounted] = useState(false);
  const { cartCount } = useCart();
  const { user, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/books?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setIsMenuOpen(false);
      setIsDesktopSearchOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleNavLinkClick = (targetPath: string) => {
    setIsMenuOpen(false);

    if (location.pathname === targetPath) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const currentTheme = mounted ? theme : 'light';
  const isDark = currentTheme === 'dark';
  const customerSupportLabel = language === 'hi' ? 'Customer Support' : t('navbar.customerSupport');
  const eventsLabel = language === 'hi' ? 'Events' : t('navbar.events');

  return (
    <nav className="sticky top-0 z-50 border-b border-white/20 bg-white/35 backdrop-blur-xl dark:border-slate-700/50 dark:bg-slate-950/45">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/15 via-cyan-500/12 to-teal-500/15 dark:from-cyan-500/15 dark:via-blue-500/10 dark:to-teal-500/15" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-[72px] items-center justify-between gap-3 py-3">
          <Link to="/" className="group flex items-center gap-3" onClick={() => handleNavLinkClick('/')}>
            <span className="inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-white/40 bg-white/40 shadow-lg shadow-cyan-500/20 backdrop-blur dark:border-slate-700 dark:bg-slate-900/60">
              <img src={logoUrl} alt="SJP logo" className="h-full w-full object-cover" />
            </span>
            <div className="leading-tight">
              <p className="text-base font-bold text-slate-900 transition group-hover:text-cyan-700 dark:text-white dark:group-hover:text-cyan-300">
                Sai Jyothi
              </p>
              <p className="text-xs uppercase tracking-[0.14em] text-slate-600 dark:text-slate-300">
                {t('navbar.publication')}
              </p>
            </div>
          </Link>

          <div className="hidden flex-1 items-center justify-end gap-1 lg:gap-2 md:flex">
            <Link to="/" className="rounded-full border border-transparent px-3 py-2 text-sm font-semibold text-slate-800 transition hover:border-white/40 hover:bg-white/40 hover:text-cyan-700 dark:text-slate-100 dark:hover:border-slate-700 dark:hover:bg-slate-800/70 dark:hover:text-cyan-300 lg:px-4" onClick={() => handleNavLinkClick('/')}>
              {t('navbar.home')}
            </Link>
            <Link to="/books" className="rounded-full border border-transparent px-3 py-2 text-sm font-semibold text-slate-800 transition hover:border-white/40 hover:bg-white/40 hover:text-cyan-700 dark:text-slate-100 dark:hover:border-slate-700 dark:hover:bg-slate-800/70 dark:hover:text-cyan-300 lg:px-4" onClick={() => handleNavLinkClick('/books')}>
              {t('navbar.books')}
            </Link>
            <Link to="/customer-support" className="rounded-full border border-transparent px-3 py-2 text-sm font-semibold text-slate-800 transition hover:border-white/40 hover:bg-white/40 hover:text-cyan-700 dark:text-slate-100 dark:hover:border-slate-700 dark:hover:bg-slate-800/70 dark:hover:text-cyan-300 lg:px-4" onClick={() => handleNavLinkClick('/customer-support')}>
              {customerSupportLabel}
            </Link>
            <Link to="/events" className="rounded-full border border-transparent px-3 py-2 text-sm font-semibold text-slate-800 transition hover:border-white/40 hover:bg-white/40 hover:text-cyan-700 dark:text-slate-100 dark:hover:border-slate-700 dark:hover:bg-slate-800/70 dark:hover:text-cyan-300 lg:px-4" onClick={() => handleNavLinkClick('/events')}>
              {eventsLabel}
            </Link>
            {user?.role === 'ROLE_ADMIN' && (
              <Link to="/admin" className="rounded-full border border-transparent px-3 py-2 text-sm font-semibold text-slate-800 transition hover:border-white/40 hover:bg-white/40 hover:text-cyan-700 dark:text-slate-100 dark:hover:border-slate-700 dark:hover:bg-slate-800/70 dark:hover:text-cyan-300 lg:px-4" onClick={() => handleNavLinkClick('/admin')}>
                {t('navbar.admin')}
              </Link>
            )}
            {user && (
              <Link to="/orders" className="rounded-full border border-transparent px-3 py-2 text-sm font-semibold text-slate-800 transition hover:border-white/40 hover:bg-white/40 hover:text-cyan-700 dark:text-slate-100 dark:hover:border-slate-700 dark:hover:bg-slate-800/70 dark:hover:text-cyan-300 lg:px-4" onClick={() => handleNavLinkClick('/orders')}>
                {t('navbar.orders')}
              </Link>
            )}

            <button
              type="button"
              onClick={() => setIsDesktopSearchOpen((current) => !current)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-cyan-400/40 bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-400"
              aria-label={t('navbar.searchAria')}
            >
              <Search className="h-4 w-4" />
            </button>

            <div className="inline-flex items-center rounded-full border border-white/45 bg-white/45 p-1 backdrop-blur dark:border-slate-700 dark:bg-slate-900/70">
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`rounded-full px-2.5 py-1 text-xs font-semibold transition ${
                  language === 'en'
                    ? 'bg-slate-900 text-white dark:bg-cyan-500 dark:text-slate-950'
                    : 'text-slate-700 hover:text-slate-900 dark:text-slate-200 dark:hover:text-cyan-300'
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLanguage('hi')}
                className={`rounded-full px-2.5 py-1 text-xs font-semibold transition ${
                  language === 'hi'
                    ? 'bg-slate-900 text-white dark:bg-cyan-500 dark:text-slate-950'
                    : 'text-slate-700 hover:text-slate-900 dark:text-slate-200 dark:hover:text-cyan-300'
                }`}
              >
                हिंदी
              </button>
            </div>

            <button
              type="button"
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/45 bg-white/45 px-3 py-2 text-sm font-medium text-slate-800 transition hover:border-cyan-400/50 hover:text-cyan-700 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100 dark:hover:border-cyan-400 dark:hover:text-cyan-300"
              aria-label={t('navbar.themeAria')}
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              <span>{isDark ? t('navbar.toggleLight') : t('navbar.toggleDark')}</span>
            </button>

            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/profile"
                  onClick={() => handleNavLinkClick('/profile')}
                  className="max-w-[120px] rounded-full border border-cyan-300/40 bg-cyan-100/80 px-3 py-1.5 text-sm font-medium text-cyan-800 transition hover:border-cyan-400 hover:bg-cyan-50 dark:border-cyan-400/40 dark:bg-cyan-500/10 dark:text-cyan-300 dark:hover:bg-cyan-500/15 lg:max-w-[140px]"
                >
                  <span className="block truncate">{t('navbar.hiUser')}, {user.name}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="rounded-full border border-transparent px-3 py-2 text-sm font-medium text-slate-800 transition hover:border-white/40 hover:bg-white/40 hover:text-cyan-700 dark:text-slate-100 dark:hover:border-slate-700 dark:hover:bg-slate-800/70 dark:hover:text-cyan-300"
                >
                  {t('navbar.logout')}
                </button>
              </div>
            ) : (
              <Link to="/login" className="inline-flex items-center rounded-full border border-transparent px-3 py-2 text-sm font-medium text-slate-800 transition hover:border-white/40 hover:bg-white/40 hover:text-cyan-700 dark:text-slate-100 dark:hover:border-slate-700 dark:hover:bg-slate-800/70 dark:hover:text-cyan-300" onClick={() => handleNavLinkClick('/login')}>
                <User className="mr-1.5 h-4 w-4" />
                {t('navbar.login')}
              </Link>
            )}

            <Link
              to="/cart"
              onClick={() => handleNavLinkClick('/cart')}
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-cyan-400/40 bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/25 transition hover:bg-cyan-400"
              aria-label={t('navbar.cartAria')}
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-xs font-bold text-white">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <button
              type="button"
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/45 bg-white/45 text-slate-800 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100"
              aria-label={t('navbar.themeAria')}
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/45 bg-white/45 text-slate-800 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100"
              aria-label={t('navbar.menuAria')}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {isDesktopSearchOpen && (
          <div className="hidden border-t border-white/10 pb-3 pt-1 md:block">
            <form onSubmit={handleSearch} className="mx-auto w-full max-w-2xl">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('navbar.searchPlaceholder')}
                  className="w-full rounded-full border border-white/55 bg-white/65 py-2.5 pl-5 pr-12 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-2 focus:ring-cyan-400/35 dark:border-slate-600 dark:bg-slate-900/70 dark:text-slate-100 dark:focus:border-cyan-400 dark:focus:ring-cyan-400/20"
                />
                <button
                  type="submit"
                  aria-label={t('navbar.searchAria')}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full border border-cyan-400/40 bg-cyan-500 p-2 text-slate-950 transition hover:bg-cyan-400"
                >
                  <Search className="h-4 w-4" />
                </button>
              </div>
            </form>
          </div>
        )}

        {isMenuOpen && (
          <div className="mt-1 rounded-2xl border border-white/35 bg-white/45 p-4 backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/70 md:hidden">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('navbar.searchPlaceholder')}
                className="w-full rounded-xl border border-white/55 bg-white/65 px-4 py-2.5 pr-11 text-sm text-slate-900 outline-none focus:border-cyan-500 dark:border-slate-600 dark:bg-slate-900/70 dark:text-slate-100"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-600 dark:text-slate-300"
                aria-label={t('navbar.searchAria')}
              >
                <Search className="h-5 w-5" />
              </button>
            </form>

            <div className="mt-3 flex items-center justify-between rounded-xl border border-white/45 bg-white/55 px-3 py-2 dark:border-slate-700 dark:bg-slate-800/70">
              <div className="flex items-center text-sm font-semibold text-slate-800 dark:text-slate-100">
                <Languages className="mr-2 h-4 w-4" />
                {t('navbar.language')}
              </div>
              <div className="inline-flex items-center rounded-full border border-white/50 bg-white/60 p-1 dark:border-slate-700 dark:bg-slate-900/70">
                <button
                  type="button"
                  onClick={() => setLanguage('en')}
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold transition ${
                    language === 'en'
                      ? 'bg-slate-900 text-white dark:bg-cyan-500 dark:text-slate-950'
                      : 'text-slate-700 dark:text-slate-200'
                  }`}
                >
                  EN
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage('hi')}
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold transition ${
                    language === 'hi'
                      ? 'bg-slate-900 text-white dark:bg-cyan-500 dark:text-slate-950'
                      : 'text-slate-700 dark:text-slate-200'
                  }`}
                >
                  हिंदी
                </button>
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-2">
              <Link to="/" className="rounded-lg px-3 py-2 text-sm font-medium text-slate-800 hover:bg-white/50 dark:text-slate-100 dark:hover:bg-slate-800" onClick={() => handleNavLinkClick('/')}>
                {t('navbar.home')}
              </Link>
              <Link to="/books" className="rounded-lg px-3 py-2 text-sm font-medium text-slate-800 hover:bg-white/50 dark:text-slate-100 dark:hover:bg-slate-800" onClick={() => handleNavLinkClick('/books')}>
                {t('navbar.books')}
              </Link>
              <Link to="/customer-support" className="rounded-lg px-3 py-2 text-sm font-medium text-slate-800 hover:bg-white/50 dark:text-slate-100 dark:hover:bg-slate-800" onClick={() => handleNavLinkClick('/customer-support')}>
                {customerSupportLabel}
              </Link>
              <Link to="/events" className="rounded-lg px-3 py-2 text-sm font-medium text-slate-800 hover:bg-white/50 dark:text-slate-100 dark:hover:bg-slate-800" onClick={() => handleNavLinkClick('/events')}>
                {eventsLabel}
              </Link>
              {user?.role === 'ROLE_ADMIN' && (
                <Link to="/admin" className="rounded-lg px-3 py-2 text-sm font-medium text-slate-800 hover:bg-white/50 dark:text-slate-100 dark:hover:bg-slate-800" onClick={() => handleNavLinkClick('/admin')}>
                  {t('navbar.admin')}
                </Link>
              )}
              {user && (
                <Link to="/orders" className="rounded-lg px-3 py-2 text-sm font-medium text-slate-800 hover:bg-white/50 dark:text-slate-100 dark:hover:bg-slate-800" onClick={() => handleNavLinkClick('/orders')}>
                  {t('navbar.orders')}
                </Link>
              )}
              {user ? (
                <>
                  <Link to="/profile" className="rounded-lg px-3 py-2 text-sm font-medium text-slate-800 hover:bg-white/50 dark:text-slate-100 dark:hover:bg-slate-800" onClick={() => handleNavLinkClick('/profile')}>
                    {t('navbar.hiUser')}, {user.name}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-800 hover:bg-white/50 dark:text-slate-100 dark:hover:bg-slate-800"
                  >
                    {t('navbar.logout')}
                  </button>
                </>
              ) : (
                <Link to="/login" className="rounded-lg px-3 py-2 text-sm font-medium text-slate-800 hover:bg-white/50 dark:text-slate-100 dark:hover:bg-slate-800" onClick={() => handleNavLinkClick('/login')}>
                  {t('navbar.login')}
                </Link>
              )}
              <Link to="/cart" className="rounded-lg px-3 py-2 text-sm font-medium text-slate-800 hover:bg-white/50 dark:text-slate-100 dark:hover:bg-slate-800" onClick={() => handleNavLinkClick('/cart')}>
                {t('navbar.cart')} ({cartCount})
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
