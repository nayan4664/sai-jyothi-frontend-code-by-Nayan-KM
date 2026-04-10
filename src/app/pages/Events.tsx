import React from 'react';
import { CalendarDays, Clock3, MapPin, Sparkles } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const getPastEvents = (language: string) => [
  {
    title: language === 'hi' ? 'नागपुर पाठकों की बैठक 2025' : 'Nagpur Readers Meet 2025',
    date: language === 'hi' ? '14 दिसंबर, 2025' : 'December 14, 2025',
    venue: language === 'hi' ? 'साई ज्योति हॉल, नागपुर' : 'Sai Jyothi Hall, Nagpur',
    summary: language === 'hi' ? 'लेखक भाषणों, छात्र छूट और क्यूरेट किए गए अकादमिक और कथा प्रदर्शन के साथ एक सामुदायिक कार्यक्रम।' : 'A community event with author talks, student discounts, and a curated academic and fiction showcase.',
  },
  {
    title: language === 'hi' ? 'वापस-स्कूल पुस्तक मेला' : 'Back-to-School Book Fair',
    date: language === 'hi' ? '22 जून, 2025' : 'June 22, 2025',
    venue: language === 'hi' ? 'रेशिमबाग कम्युनिटी सेंटर' : 'Reshimbagh Community Centre',
    summary: language === 'hi' ? 'परिवारों ने स्कूल की आवश्यकताओं, कार्यपुस्तिकाओं और गतिविधि शीर्षकों की खोज की शिक्षक निर्देशन सत्रों के साथ।' : 'Families explored school essentials, workbooks, and activity titles with educator guidance sessions.',
  },
  {
    title: language === 'hi' ? 'प्रतिस्पर्धी परीक्षा प्रस्तुति एक्सपो' : 'Competitive Exam Prep Expo',
    date: language === 'hi' ? '9 फरवरी, 2025' : 'February 9, 2025',
    venue: language === 'hi' ? 'ऑनलाइन + इन-स्टोर हाइब्रिड' : 'Online + In-store Hybrid',
    summary: language === 'hi' ? 'UPSC, NEET, JEE, SSC और बैंकिंग संसाधन सिफारिशें प्रस्तुत कीं मार्गदर्शन-नेतृत्व वाली रणनीति सत्रों के साथ।' : 'Featured UPSC, NEET, JEE, SSC, and banking resource recommendations with mentor-led strategy sessions.',
  },
];

const getUpcomingEvents = (language: string) => [
  {
    title: language === 'hi' ? 'कॉलेज स्टार्टर किट त्योहार' : 'College Starter Kit Festival',
    date: language === 'hi' ? '18 मई, 2026' : 'May 18, 2026',
    time: language === 'hi' ? '11:00 पूर्वाह्न से 6:00 अपराह्न' : '11:00 AM to 6:00 PM',
    venue: language === 'hi' ? 'साई ज्योति प्रकाशन स्टोर, नागपुर' : 'Sai Jyothi Publication Store, Nagpur',
    summary: language === 'hi' ? 'कॉलेज की किताबों, सेमेस्टर बंडलों और नए छात्रों के लिए विशेष कॉम्बो ऑफर के लिए एक क्यूरेटेड लॉन्च।' : 'A curated launch for college books, semester bundles, and freshers-only combo offers.',
  },
  {
    title: language === 'hi' ? 'स्कूल सफलता सप्ताहांत' : 'School Success Weekend',
    date: language === 'hi' ? '7 जून, 2026' : 'June 7, 2026',
    time: language === 'hi' ? '10:00 पूर्वाह्न से 5:00 अपराह्न' : '10:00 AM to 5:00 PM',
    venue: language === 'hi' ? 'शहर शिक्षा पैवेलियन' : 'City Education Pavilion',
    summary: language === 'hi' ? 'स्कूल पुस्तक प्रदर्शन, माता-पिता परामर्श डेस्क और ग्रेड-वार अध्ययन नियोजन सत्र।' : 'School book displays, parent counselling desk, and grade-wise study planning sessions.',
  },
  {
    title: language === 'hi' ? 'आकांक्षी करियर पुस्तक शिविर' : 'Aspirants Career Book Camp',
    date: language === 'hi' ? '19 जुलाई, 2026' : 'July 19, 2026',
    time: language === 'hi' ? '9:30 पूर्वाह्न से 4:30 अपराह्न' : '9:30 AM to 4:30 PM',
    venue: language === 'hi' ? 'ऑनलाइन वेबिनार + पुस्तक काउंटर' : 'Online Webinar + Book Counter',
    summary: language === 'hi' ? 'प्रतिस्पर्धी परीक्षा की किताबों, दैनिक योजना विधियों और आकांक्षियों के लिए मार्गदर्शक प्रश्नोत्तरी पर केंद्रित।' : 'Focused on competitive exam books, daily planning methods, and mentor Q&A for aspirants.',
  },
];

export const Events: React.FC = () => {
  const { language } = useLanguage();

  const copy =
    language === 'hi'
      ? {
          title: 'कार्यक्रम',
          subtitle: 'हमारे द्वारा आयोजित साहित्यिक, शैक्षिक और छात्र-केंद्रित कार्यक्रमों को देखें और आगे क्या आ रहा है।',
          pastTitle: 'पहले आयोजित',
          upcomingTitle: 'अगला क्या आ रहा है',
          communityCalendar: 'समुदाय कैलेंडर',
        }
      : {
          title: 'Events',
          subtitle: 'See the literary, academic, and student-focused events we have hosted and what is coming next.',
          pastTitle: 'Previously Hosted',
          upcomingTitle: 'Coming Up Next',
          communityCalendar: 'Community Calendar',
        };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 via-white to-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/50">
          <div className="inline-flex items-center rounded-full border border-amber-300/50 bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-amber-800">
            <Sparkles className="mr-2 h-3.5 w-3.5" />
            {copy.communityCalendar}
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
            {getPastEvents(language).map((event) => (
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
            {getUpcomingEvents(language).map((event) => (
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
