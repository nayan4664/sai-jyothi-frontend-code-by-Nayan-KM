import React from 'react';
import { CalendarDays, Clock3, MapPin, Sparkles } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const pastEvents = [
  {
    title: 'Nagpur Readers Meet 2025',
    date: 'December 14, 2025',
    venue: 'Sai Jyothi Hall, Nagpur',
    summary: 'A community event with author talks, student discounts, and a curated academic and fiction showcase.',
  },
  {
    title: 'Back-to-School Book Fair',
    date: 'June 22, 2025',
    venue: 'Reshimbagh Community Centre',
    summary: 'Families explored school essentials, workbooks, and activity titles with educator guidance sessions.',
  },
  {
    title: 'Competitive Exam Prep Expo',
    date: 'February 9, 2025',
    venue: 'Online + In-store Hybrid',
    summary: 'Featured UPSC, NEET, JEE, SSC, and banking resource recommendations with mentor-led strategy sessions.',
  },
];

const upcomingEvents = [
  {
    title: 'College Starter Kit Festival',
    date: 'May 18, 2026',
    time: '11:00 AM to 6:00 PM',
    venue: 'Sai Jyothi Publication Store, Nagpur',
    summary: 'A curated launch for college books, semester bundles, and freshers-only combo offers.',
  },
  {
    title: 'School Success Weekend',
    date: 'June 7, 2026',
    time: '10:00 AM to 5:00 PM',
    venue: 'City Education Pavilion',
    summary: 'School book displays, parent counselling desk, and grade-wise study planning sessions.',
  },
  {
    title: 'Aspirants Career Book Camp',
    date: 'July 19, 2026',
    time: '9:30 AM to 4:30 PM',
    venue: 'Online Webinar + Book Counter',
    summary: 'Focused on competitive exam books, daily planning methods, and mentor Q&A for aspirants.',
  },
];

export const Events: React.FC = () => {
  const { language } = useLanguage();

  const copy =
    language === 'hi'
      ? {
          title: 'Events',
          subtitle: 'See the literary, academic, and student-focused events we have hosted and what is coming next.',
          pastTitle: 'Previously Hosted',
          upcomingTitle: 'Coming Up Next',
        }
      : {
          title: 'Events',
          subtitle: 'See the literary, academic, and student-focused events we have hosted and what is coming next.',
          pastTitle: 'Previously Hosted',
          upcomingTitle: 'Coming Up Next',
        };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 via-white to-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/50">
          <div className="inline-flex items-center rounded-full border border-amber-300/50 bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-amber-800">
            <Sparkles className="mr-2 h-3.5 w-3.5" />
            Community Calendar
          </div>
          <h1 className="mt-4 text-4xl font-black text-slate-900">{copy.title}</h1>
          <p className="mt-3 max-w-3xl text-base leading-relaxed text-slate-600">{copy.subtitle}</p>
        </section>

        <section className="mt-8">
          <div className="flex items-center gap-3">
            <CalendarDays className="h-5 w-5 text-slate-700" />
            <h2 className="text-2xl font-black text-slate-900">{copy.pastTitle}</h2>
          </div>
          <div className="mt-5 grid gap-5 lg:grid-cols-3">
            {pastEvents.map((event) => (
              <article key={event.title} className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/40">
                <p className="text-sm font-semibold text-cyan-700">{event.date}</p>
                <h3 className="mt-2 text-xl font-bold text-slate-900">{event.title}</h3>
                <div className="mt-4 flex items-start text-sm text-slate-600">
                  <MapPin className="mr-2 mt-0.5 h-4 w-4 flex-shrink-0 text-slate-500" />
                  <span>{event.venue}</span>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-slate-600">{event.summary}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <div className="flex items-center gap-3">
            <Clock3 className="h-5 w-5 text-slate-700" />
            <h2 className="text-2xl font-black text-slate-900">{copy.upcomingTitle}</h2>
          </div>
          <div className="mt-5 grid gap-5 lg:grid-cols-3">
            {upcomingEvents.map((event) => (
              <article key={event.title} className="rounded-[1.75rem] border border-cyan-200 bg-gradient-to-br from-cyan-50 to-white p-6 shadow-lg shadow-cyan-100/50">
                <p className="text-sm font-semibold text-cyan-700">{event.date}</p>
                <h3 className="mt-2 text-xl font-bold text-slate-900">{event.title}</h3>
                <div className="mt-4 flex items-start text-sm text-slate-600">
                  <Clock3 className="mr-2 mt-0.5 h-4 w-4 flex-shrink-0 text-cyan-700" />
                  <span>{event.time}</span>
                </div>
                <div className="mt-2 flex items-start text-sm text-slate-600">
                  <MapPin className="mr-2 mt-0.5 h-4 w-4 flex-shrink-0 text-cyan-700" />
                  <span>{event.venue}</span>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-slate-600">{event.summary}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
