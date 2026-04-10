import React, { useEffect, useState } from 'react';
import { MapPin, Phone, Building2 } from 'lucide-react';
import { contentApi } from '../lib/content-api';
import { useLanguage } from '../contexts/LanguageContext';
import type { Distributor } from '../types/content';

export const Distributors: React.FC = () => {
  const [distributors, setDistributors] = useState<Distributor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { language } = useLanguage();

  const copy =
    language === 'hi'
      ? {
          title: 'पास के वितरक',
          subtitle: 'आस-पास के शहरों में विश्वसनीय वितरक बिंदु स्टोर सहायता, संस्थागत ऑर्डरिंग और तेजी से स्थानीय पहुंच के लिए।',
          badge: 'क्षेत्रीय पुस्तक नेटवर्क',
          supportDesk: 'समर्थन डेस्क:',
          loading: 'वितरकों को लोड हो रहा है...',
          error: 'वितरकों को लोड नहीं किया जा सका।',
        }
      : {
          title: 'Nearby Distributors',
          subtitle: 'Trusted distributor points across nearby cities for store assistance, institutional ordering, and quicker local access.',
          badge: 'Regional book network',
          supportDesk: 'Support desk:',
          loading: 'Loading distributors...',
          error: 'Could not load distributors.',
        };

  useEffect(() => {
    let isActive = true;

    const loadDistributors = async () => {
      try {
        const content = await contentApi.getStoreContent();
        if (isActive) {
          setDistributors(content.distributors);
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

    void loadDistributors();

    return () => {
      isActive = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-blue-50">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="rounded-[2rem] border border-slate-200 bg-white px-8 py-10 shadow-xl shadow-slate-200/70">
          <div className="max-w-3xl">
            <div className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
              <MapPin className="mr-2 h-3.5 w-3.5" />
              {copy.badge}
            </div>
            <h1 className="mt-4 text-4xl font-black text-slate-900 sm:text-5xl">{copy.title}</h1>
            <p className="mt-3 text-base leading-relaxed text-slate-600">
              {copy.subtitle}
            </p>
          </div>
        </section>

        <section className="mt-8 grid gap-6 md:grid-cols-2">
          {isLoading && <div className="rounded-3xl bg-white p-6 shadow-lg">{copy.loading}</div>}
          {error && <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-rose-700">{error}</div>}
          {!isLoading &&
            !error &&
            distributors.map((distributor) => (
              <article key={`${distributor.city}-${distributor.partnerName}`} className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700">{distributor.city}</p>
                    <h2 className="mt-2 text-2xl font-black text-slate-900">{distributor.partnerName}</h2>
                    <p className="mt-2 text-sm text-slate-600">{copy.supportDesk} {distributor.contactPerson}</p>
                  </div>
                  <div className="inline-flex rounded-2xl bg-cyan-100 p-3 text-cyan-700">
                    <Building2 className="h-5 w-5" />
                  </div>
                </div>

                <div className="mt-5 space-y-3 text-sm text-slate-600">
                  <div className="flex items-start rounded-2xl bg-slate-50 p-4">
                    <MapPin className="mr-3 mt-0.5 h-4 w-4 flex-shrink-0 text-cyan-700" />
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(distributor.mapQuery)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition hover:text-cyan-700"
                    >
                      {distributor.address}
                    </a>
                  </div>
                  <div className="flex items-center rounded-2xl bg-slate-50 p-4">
                    <Phone className="mr-3 h-4 w-4 flex-shrink-0 text-cyan-700" />
                    <a href={`tel:${distributor.phone.replace(/\s+/g, '')}`} className="transition hover:text-cyan-700">
                      {distributor.phone}
                    </a>
                  </div>
                </div>
              </article>
            ))}
        </section>
      </div>
    </div>
  );
};
