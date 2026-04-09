import React from 'react';
import { Link } from 'react-router';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, ArrowRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import logoUrl from '../assets/sjp-logo-latest.jpeg';

export const Footer: React.FC = () => {
  const { t, categoryLabel } = useLanguage();

  return (
    <footer className="relative mt-20 overflow-hidden bg-slate-950 text-slate-300">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -left-16 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute -bottom-24 right-0 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
      </div>

      <div className="relative border-b border-white/10 bg-gradient-to-r from-blue-600/25 via-cyan-500/20 to-teal-500/20">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-4 px-4 py-6 sm:px-6 lg:flex-row lg:items-center lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-200">{t('footer.club')}</p>
            <h3 className="mt-1 text-xl font-bold text-white">{t('footer.releases')}</h3>
          </div>
          <Link
            to="/books"
            className="inline-flex items-center rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-cyan-100"
          >
            {t('common.browseCollection')}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link to="/" className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 transition hover:border-cyan-300/40 hover:bg-white/10">
              <img src={logoUrl} alt="SJP logo" className="h-6 w-6 rounded-full object-cover" />
              <span className="font-semibold text-white">Sai Jyothi {t('navbar.publication')}</span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-300">
              {t('footer.about')}
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t('footer.facebook')}
                className="rounded-full border border-white/15 bg-white/5 p-2.5 text-slate-200 transition hover:border-cyan-300 hover:bg-cyan-300/10 hover:text-cyan-200"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t('footer.x')}
                className="rounded-full border border-white/15 bg-white/5 p-2.5 text-slate-200 transition hover:border-cyan-300 hover:bg-cyan-300/10 hover:text-cyan-200"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t('footer.instagram')}
                className="rounded-full border border-white/15 bg-white/5 p-2.5 text-slate-200 transition hover:border-cyan-300 hover:bg-cyan-300/10 hover:text-cyan-200"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t('footer.linkedin')}
                className="rounded-full border border-white/15 bg-white/5 p-2.5 text-slate-200 transition hover:border-cyan-300 hover:bg-cyan-300/10 hover:text-cyan-200"
              >
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-cyan-200">{t('footer.quickLinks')}</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="transition hover:text-cyan-200">{t('navbar.home')}</Link>
              </li>
              <li>
                <Link to="/books" className="transition hover:text-cyan-200">{t('footer.allBooks')}</Link>
              </li>
              <li>
                <Link to="/books?category=Programming" className="transition hover:text-cyan-200">{categoryLabel('Programming')}</Link>
              </li>
              <li>
                <Link to="/books?category=Fiction" className="transition hover:text-cyan-200">{categoryLabel('Fiction')}</Link>
              </li>
              <li>
                <Link to="/books?category=Academic" className="transition hover:text-cyan-200">{categoryLabel('Academic')}</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-cyan-200">{t('footer.customerService')}</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/customer-support" className="transition hover:text-cyan-200">Customer Support</Link>
              </li>
              <li>
                <Link to="/events" className="transition hover:text-cyan-200">Events</Link>
              </li>
              <li>
                <Link to="/about" className="transition hover:text-cyan-200">{t('footer.aboutUs')}</Link>
              </li>
              <li>
                <Link to="/faq" className="transition hover:text-cyan-200">{t('footer.faq')}</Link>
              </li>
              <li>
                <Link to="/shipping-returns" className="transition hover:text-cyan-200">{t('footer.shippingReturns')}</Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="transition hover:text-cyan-200">{t('footer.privacyPolicy')}</Link>
              </li>
              <li>
                <Link to="/terms-conditions" className="transition hover:text-cyan-200">{t('footer.terms')}</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-cyan-200">{t('footer.contactUs')}</h3>
            <ul className="space-y-3.5 text-sm">
              <li className="rounded-xl border border-white/10 bg-white/5 p-3">
                <a
                  href="https://www.google.com/maps/search/?api=1&query=43HQ%2BPG6%20jattarodi%2C%20Indra%20Nagar%2C%20Nagpur%2C%20Maharashtra%20440003"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start transition hover:text-cyan-200"
                >
                  <MapPin className="mr-2 h-4 w-4 flex-shrink-0 text-cyan-300" />
                  <span>43HQ+PG6 jattarodi, Indra Nagar, Nagpur, Maharashtra 440003</span>
                </a>
              </li>
              <li className="flex items-center rounded-xl border border-white/10 bg-white/5 p-3">
                <Phone className="mr-2 h-4 w-4 flex-shrink-0 text-cyan-300" />
                <a href="tel:9923693506" className="transition hover:text-cyan-200">+91 9923693506</a>
              </li>
              <li className="flex items-center rounded-xl border border-white/10 bg-white/5 p-3">
                <Mail className="mr-2 h-4 w-4 flex-shrink-0 text-cyan-300" />
                <a href="mailto:info@saijyothi.com" className="transition hover:text-cyan-200">info@saijyothi.com</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-center text-xs text-slate-400">
          <p>&copy; {new Date().getFullYear()} Sai Jyothi {t('navbar.publication')}. {t('footer.rights')}</p>
          <p className="mt-2">
            Designed and developed by{' '}
            <a
              href="https://kavyainfoweb.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-cyan-200 transition hover:text-cyan-100"
            >
              Kavya Infoweb Private Limited
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};
