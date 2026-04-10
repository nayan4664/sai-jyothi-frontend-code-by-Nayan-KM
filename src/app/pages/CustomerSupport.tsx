import React from 'react';
import { Headset, Mail, MessageCircle, Phone, ShieldCheck, Truck, Undo2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const getHighlights = (language: string) => [
  {
    title: language === 'hi' ? 'ऑर्डर मदद' : 'Order Help',
    description: language === 'hi' ? 'क्या आपको ऑर्डर देने, डिलीवरी विवरण बदलने या शिपमेंट प्रगति ट्रैक करने में मदद चाहिए?' : 'Need help with placing an order, changing delivery details, or tracking shipment progress?',
    icon: Truck,
  },
  {
    title: language === 'hi' ? 'रिटर्न और रिफंड' : 'Returns & Refunds',
    description: language === 'hi' ? 'क्षतिग्रस्त किताबों, गलत डिलीवरी, रिटर्न अनुरोध और रिफंड समय के लिए समर्थन प्राप्त करें।' : 'Get support for damaged books, wrong deliveries, return requests, and refund timelines.',
    icon: Undo2,
  },
  {
    title: language === 'hi' ? 'खाता और सुरक्षा' : 'Account & Security',
    description: language === 'hi' ? 'हम लॉगिन समस्याओं, पासवर्ड रीसेट, प्रोफ़ाइल अपडेट और खाता सुरक्षा में मदद कर सकते हैं।' : 'We can help with login issues, password resets, profile updates, and account safety.',
    icon: ShieldCheck,
  },
];

const getFaqs = (language: string) => [
  {
    question: language === 'hi' ? 'सहायता कितनी जल्दी जवाब देगी?' : 'How quickly will support respond?',
    answer: language === 'hi' ? 'हमारी टीम ईमेल के लिए आमतौर पर 2-6 कार्य घंटों में जवाब देती है और कार्य समय के दौरान व्हाट्सएप पर और भी तेजी से जवाब देती है।' : 'Our team usually responds within 2-6 business hours for email and even faster on WhatsApp during working hours.',
  },
  {
    question: language === 'hi' ? 'क्या मैं ऑर्डर देने के बाद इसे संशोधित कर सकता हूं?' : 'Can I modify an order after placing it?',
    answer: language === 'hi' ? 'हां, यदि ऑर्डर पैक नहीं किया गया है। जल्द से जल्द अपने ऑर्डर नंबर के साथ सहायता से संपर्क करें।' : 'Yes, if the order has not been packed yet. Contact support with your order number as soon as possible.',
  },
  {
    question: language === 'hi' ? 'क्या आप बल्क या संस्थागत ऑर्डर का समर्थन करते हैं?' : 'Do you support bulk or institutional orders?',
    answer: language === 'hi' ? 'हां। स्कूल, कॉलेज, पुस्तकालय और कोचिंग केंद्र हमसे संपर्क कर सकते हैं।' : 'Yes. Schools, colleges, libraries, and coaching centers can contact us for curated bulk-book support.',
  },
];

export const CustomerSupport: React.FC = () => {
  const { language } = useLanguage();

  const copy =
    language === 'hi'
      ? {
          title: 'ग्राहक सहायता',
          subtitle: 'हम आपको ऑर्डर, रिटर्न, खाता समस्याओं और किताब की सिफारिशों में मदद करने के लिए यहां हैं।',
          connectTitle: 'हमसे संपर्क करें',
          connectText: 'वह समर्थन चैनल चुनें जो आपके लिए सबसे अच्छा है और हमारी टीम आपको तुरंत मदद करेगी।',
          emailLabel: 'ईमेल सहायता',
          whatsappLabel: 'व्हाट्सएप सहायता',
          phoneLabel: 'कॉल सहायता',
          hoursTitle: 'सहायता समय',
          hoursText: 'सोमवार से शनिवार, सुबह 9:30 बजे से शाम 7:00 बजे तक',
          faqTitle: 'अक्सर पूछे जाने वाली सहायता प्रश्न',
          trackingSupport: 'ट्रैकिंग सहायता',
          trackingDesc: 'लाइव डिलीवरी प्रगति, ट्रैकिंग कोड विवरण और डिस्पैच पता जानकारी के लिए, लॉगिन करने के बाद मेरे ऑर्डर पर जाएं।',
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
          trackingSupport: 'Tracking support',
          trackingDesc: 'For live delivery progress, tracking code details, and dispatch address information, visit My Orders after login.',
        };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 via-white to-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="overflow-hidden rounded-[2rem] border border-white/60 bg-slate-950 p-8 text-white shadow-2xl shadow-slate-300/40">
          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <div className="inline-flex items-center rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200">
                <Headset className="mr-2 h-3.5 w-3.5" />
                {language === 'hi' ? 'सहायता डेस्क' : 'Help Desk'}
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
              <div className="mt-4 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 text-sm text-cyan-100">
                <p className="font-semibold">{copy.trackingSupport}</p>
                <p className="mt-1">{copy.trackingDesc}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-6 md:grid-cols-3">
          {getHighlights(language).map(({ title, description, icon: Icon }) => (
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
            {getFaqs(language).map((faq) => (
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
