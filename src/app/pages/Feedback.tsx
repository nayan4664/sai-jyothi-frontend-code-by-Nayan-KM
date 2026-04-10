import React, { useEffect, useState } from 'react';
import { Star, MessageSquareQuote } from 'lucide-react';
import { contentApi } from '../lib/content-api';
import { useLanguage } from '../contexts/LanguageContext';
import type { Testimonial } from '../types/content';

export const Feedback: React.FC = () => {
  const [feedback, setFeedback] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { language } = useLanguage();

  const copy =
    language === 'hi'
      ? {
          title: 'प्रतिक्रिया',
          subtitle: 'साई ज्योति प्रकाशन के छात्रों, पुस्तकाध्यक्षों, समन्वयकों और नियमित पाठकों द्वारा साझा की गई टिप्पणियां और सिफारिशें।',
          badge: 'पाठक प्रतिक्रिया',
          loading: 'प्रतिक्रिया लोड हो रही है...',
          error: 'प्रतिक्रिया लोड नहीं की जा सकी।',
        }
      : {
          title: 'Feedback',
          subtitle: 'Comments and recommendations shared by students, librarians, coordinators, and regular readers of Sai Jyothi Publication.',
          badge: 'Reader feedback',
          loading: 'Loading feedback...',
          error: 'Could not load feedback.',
        };

  useEffect(() => {
    let isActive = true;

    const loadFeedback = async () => {
      try {
        const content = await contentApi.getStoreContent();
        if (isActive) {
          setFeedback(content.testimonials);
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

    void loadFeedback();

    return () => {
      isActive = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-cyan-950">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="rounded-[2rem] border border-white/10 bg-white/5 px-8 py-10 text-white backdrop-blur">
          <div className="max-w-3xl">
            <div className="inline-flex items-center rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200">
              <MessageSquareQuote className="mr-2 h-3.5 w-3.5" />
              {copy.badge}
            </div>
            <h1 className="mt-4 text-4xl font-black sm:text-5xl">{copy.title}</h1>
            <p className="mt-3 text-base leading-relaxed text-slate-300">
              {copy.subtitle}
            </p>
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-3">
          {isLoading && <div className="rounded-3xl bg-white/10 p-6 text-white">{copy.loading}</div>}
          {error && <div className="rounded-3xl border border-rose-300/30 bg-rose-500/10 p-6 text-rose-100">{error}</div>}
          {!isLoading &&
            !error &&
            feedback.map((item) => (
              <article key={`${item.name}-${item.city}`} className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 text-white backdrop-blur">
                <div className="flex items-center gap-1 text-amber-300">
                  {Array.from({ length: item.rating }).map((_, index) => (
                    <Star key={`${item.name}-${index}`} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="mt-4 text-base leading-relaxed text-white/90">"{item.quote}"</p>
                <div className="mt-6 border-t border-white/10 pt-4">
                  <p className="font-semibold text-white">{item.name}</p>
                  <p className="text-sm text-slate-300">{item.role}</p>
                  <p className="text-sm text-cyan-200">{item.city}</p>
                </div>
              </article>
            ))}
        </section>
      </div>
    </div>
  );
};
