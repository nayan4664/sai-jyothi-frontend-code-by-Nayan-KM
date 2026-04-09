import React from 'react';
import { Headset, Mail, MessageCircle, Phone, ShieldCheck, Truck, Undo2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const supportHighlights = [
  {
    title: 'Order Help',
    description: 'Need help with placing an order, changing delivery details, or tracking shipment progress?',
    icon: Truck,
  },
  {
    title: 'Returns & Refunds',
    description: 'Get support for damaged books, wrong deliveries, return requests, and refund timelines.',
    icon: Undo2,
  },
  {
    title: 'Account & Security',
    description: 'We can help with login issues, password resets, profile updates, and account safety.',
    icon: ShieldCheck,
  },
];

const faqs = [
  {
    question: 'How quickly will support respond?',
    answer: 'Our team usually responds within 2-6 business hours for email and even faster on WhatsApp during working hours.',
  },
  {
    question: 'Can I modify an order after placing it?',
    answer: 'Yes, if the order has not been packed yet. Contact support with your order number as soon as possible.',
  },
  {
    question: 'Do you support bulk or institutional orders?',
    answer: 'Yes. Schools, colleges, libraries, and coaching centers can contact us for curated bulk-book support.',
  },
];

export const CustomerSupport: React.FC = () => {
  const { language } = useLanguage();

  const copy =
    language === 'hi'
      ? {
          title: 'Customer Support',
          subtitle: 'We are here to help you with orders, returns, account issues, and book recommendations.',
          connectTitle: 'Connect With Us',
          connectText: 'Choose the support channel that works best for you and our team will help you quickly.',
          emailLabel: 'Email Support',
          whatsappLabel: 'WhatsApp Support',
          phoneLabel: 'Call Support',
          hoursTitle: 'Support Hours',
          hoursText: 'Monday to Saturday, 9:30 AM to 7:00 PM',
          faqTitle: 'Frequently Asked Support Questions',
        }
      : {
          title: 'Customer Support',
          subtitle: 'We are here to help you with orders, returns, account issues, and book recommendations.',
          connectTitle: 'Connect With Us',
          connectText: 'Choose the support channel that works best for you and our team will help you quickly.',
          emailLabel: 'Email Support',
          whatsappLabel: 'WhatsApp Support',
          phoneLabel: 'Call Support',
          hoursTitle: 'Support Hours',
          hoursText: 'Monday to Saturday, 9:30 AM to 7:00 PM',
          faqTitle: 'Frequently Asked Support Questions',
        };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 via-white to-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="overflow-hidden rounded-[2rem] border border-white/60 bg-slate-950 p-8 text-white shadow-2xl shadow-slate-300/40">
          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <div className="inline-flex items-center rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200">
                <Headset className="mr-2 h-3.5 w-3.5" />
                Help Desk
              </div>
              <h1 className="mt-4 text-4xl font-black">{copy.title}</h1>
              <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-300">{copy.subtitle}</p>
            </div>

            <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-6 backdrop-blur">
              <h2 className="text-xl font-bold">{copy.connectTitle}</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">{copy.connectText}</p>
              <div className="mt-5 space-y-3 text-sm">
                <a
                  href="mailto:info@saijyothi.com"
                  className="flex items-center rounded-2xl border border-white/10 bg-white/5 px-4 py-3 transition hover:border-cyan-300/40 hover:bg-cyan-300/10"
                >
                  <Mail className="mr-3 h-4 w-4 text-cyan-300" />
                  <span>{copy.emailLabel}: info@saijyothi.com</span>
                </a>
                <a
                  href="https://wa.me/919923693506"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center rounded-2xl border border-white/10 bg-white/5 px-4 py-3 transition hover:border-cyan-300/40 hover:bg-cyan-300/10"
                >
                  <MessageCircle className="mr-3 h-4 w-4 text-cyan-300" />
                  <span>{copy.whatsappLabel}: +91 99236 93506</span>
                </a>
                <a
                  href="tel:9923693506"
                  className="flex items-center rounded-2xl border border-white/10 bg-white/5 px-4 py-3 transition hover:border-cyan-300/40 hover:bg-cyan-300/10"
                >
                  <Phone className="mr-3 h-4 w-4 text-cyan-300" />
                  <span>{copy.phoneLabel}: +91 99236 93506</span>
                </a>
              </div>
              <div className="mt-5 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100">
                <p className="font-semibold">{copy.hoursTitle}</p>
                <p className="mt-1">{copy.hoursText}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-6 md:grid-cols-3">
          {supportHighlights.map(({ title, description, icon: Icon }) => (
            <article key={title} className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/50">
              <div className="inline-flex rounded-2xl bg-cyan-100 p-3 text-cyan-700">
                <Icon className="h-5 w-5" />
              </div>
              <h2 className="mt-4 text-xl font-bold text-slate-900">{title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{description}</p>
            </article>
          ))}
        </section>

        <section className="mt-8 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-lg shadow-slate-200/50">
          <h2 className="text-2xl font-black text-slate-900">{copy.faqTitle}</h2>
          <div className="mt-6 grid gap-4">
            {faqs.map((faq) => (
              <article key={faq.question} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                <h3 className="text-lg font-bold text-slate-900">{faq.question}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{faq.answer}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
