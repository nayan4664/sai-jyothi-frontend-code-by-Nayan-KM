import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface InfoPageProps {
  translationKey: 'about' | 'faq' | 'shipping' | 'privacy' | 'terms';
}

export const InfoPage: React.FC<InfoPageProps> = ({ translationKey }) => {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-slate-900">{t(`info.${translationKey}.title`)}</h1>
          <p className="mt-4 leading-relaxed text-slate-600">{t(`info.${translationKey}.description`)}</p>
        </div>
      </div>
    </div>
  );
};
