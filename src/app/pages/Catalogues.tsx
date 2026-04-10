import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { BookMarked, Download, ArrowRight } from 'lucide-react';
import { contentApi } from '../lib/content-api';
import { useLanguage } from '../contexts/LanguageContext';
import type { Catalogue } from '../types/content';

export const Catalogues: React.FC = () => {
  const [catalogues, setCatalogues] = useState<Catalogue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { language } = useLanguage();

  const copy =
    language === 'hi'
      ? {
          title: 'कैटलॉग',
          subtitle: 'स्कूलों, कॉलेजों, पुस्तकालयों, कोचिंग केंद्रों और थोक पुस्तक खरीदारों के लिए सावधानीपूर्वक व्यवस्थित कैटलॉग संग्रह।',
          badge: 'प्रकाशक कैटलॉग डेस्क',
          recommendedFor: 'की सिफारिश की गई:',
          loading: 'कैटलॉग लोड हो रहे हैं...',
          error: 'कैटलॉग लोड नहीं किए जा सके।',
        }
      : {
          title: 'Catalogues',
          subtitle: 'Carefully arranged catalogue collections for schools, colleges, libraries, coaching centres, and bulk book buyers.',
          badge: 'Publisher catalogue desk',
          recommendedFor: 'Recommended for:',
          loading: 'Loading catalogues...',
          error: 'Could not load catalogues.',
        };

  useEffect(() => {
    let isActive = true;

    const loadCatalogues = async () => {
      try {
        const content = await contentApi.getStoreContent();
        if (isActive) {
          setCatalogues(content.catalogues);
          setError(null);
        }
      } catch (loadError) {
        if (isActive) {
          setError(loadError instanceof Error ? loadError.message : copy.error);
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    void loadCatalogues();

    return () => {
      isActive = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 via-white to-cyan-50">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="overflow-hidden rounded-[2rem] bg-slate-950 px-8 py-10 text-white shadow-2xl">
          <div className="max-w-3xl">
            <div className="inline-flex items-center rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200">
              <BookMarked className="mr-2 h-3.5 w-3.5" />
              {copy.badge}
            </div>
            <h1 className="mt-4 text-4xl font-black sm:text-5xl">{copy.title}</h1>
            <p className="mt-3 text-base leading-relaxed text-slate-300">
              {copy.subtitle}
            </p>
          </div>
        </section>

        <section className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {isLoading && <div className="rounded-3xl bg-white p-6 shadow-lg">{copy.loading}</div>}
          {error && <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-rose-700">{error}</div>}
          {!isLoading &&
            !error &&
            catalogues.map((catalogue) => (
              <article key={catalogue.title} className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60">
                <div className="inline-flex rounded-2xl bg-cyan-100 p-3 text-cyan-700">
                  <Download className="h-5 w-5" />
                </div>
                <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700">{catalogue.format}</p>
                <h2 className="mt-2 text-2xl font-black text-slate-900">{catalogue.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{catalogue.description}</p>
                <p className="mt-4 text-sm font-medium text-slate-700">{copy.recommendedFor} {catalogue.audience}</p>
                <Link
                  to={catalogue.downloadUrl}
                  className="mt-6 inline-flex items-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-cyan-600"
                >
                  {catalogue.downloadLabel}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </article>
            ))}
        </section>
      </div>
    </div>
  );
};
