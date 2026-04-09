import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type Language = 'en' | 'hi';

const translations = {
  en: {
    navbar: {
      admin: 'Admin',
      home: 'Home',
      books: 'Books',
      customerSupport: 'Customer Support',
      events: 'Events',
      orders: 'Orders',
      login: 'Login',
      logout: 'Logout',
      cart: 'Cart',
      searchPlaceholder: 'Search books, categories, authors...',
      toggleDark: 'Dark',
      toggleLight: 'Light',
      hiUser: 'Hi',
      language: 'Language',
      searchAria: 'Search books',
      themeAria: 'Toggle dark mode',
      menuAria: 'Open navigation menu',
      cartAria: 'Go to cart',
      publication: 'Publication',
    },
    common: {
      add: 'Add',
      by: 'by',
      addedToCart: 'added to cart!',
      addToCart: 'Add to Cart',
      buyNow: 'Buy Now',
      back: 'Back',
      browseBooks: 'Browse Books',
      browseCollection: 'Browse Collection',
      continueShopping: 'Continue Shopping',
      loading: 'Loading...',
      reset: 'Reset',
      description: 'Description',
      pages: 'Pages',
      publisher: 'Publisher',
      language: 'Language',
      isbn: 'ISBN',
      category: 'Category',
      quantity: 'Quantity',
      total: 'Total',
      shipping: 'Shipping',
      free: 'FREE',
      home: 'Back to Home',
      viewAll: 'View All',
      all: 'All',
      search: 'Search',
      edit: 'Edit',
      delete: 'Delete',
      previous: 'Previous',
      next: 'Next',
    },
    categories: {
      All: 'All',
      Programming: 'Programming',
      Fiction: 'Fiction',
      Academic: 'Academic',
      Kids: 'Kids',
      'Self-Help': 'Self-Help',
      Biography: 'Biography',
      History: 'History',
      Business: 'Business',
      Spirituality: 'Spirituality',
      Comics: 'Comics',
      College: 'College',
      School: 'School',
      Competitive: 'Competitive',
    },
    orderStatus: {
      PLACED: 'PLACED',
      PROCESSING: 'PROCESSING',
      SHIPPED: 'SHIPPED',
      DELIVERED: 'DELIVERED',
      CANCELLED: 'CANCELLED',
    },
    footer: {
      club: 'Book Lovers Club',
      releases: 'Discover new releases every week',
      about:
        'Your trusted source for quality books across all genres. Empowering readers since 2010.',
      quickLinks: 'Quick Links',
      allBooks: 'All Books',
      customerService: 'Customer Service',
      aboutUs: 'About Us',
      faq: 'FAQ',
      shippingReturns: 'Shipping & Returns',
      privacyPolicy: 'Privacy Policy',
      terms: 'Terms & Conditions',
      contactUs: 'Contact Us',
      rights: 'All rights reserved.',
      crafted: 'Crafted for readers, students, and lifelong learners.',
      up: 'Up',
      facebook: 'Visit our Facebook page',
      x: 'Visit our X profile',
      instagram: 'Visit our Instagram profile',
      linkedin: 'Visit our LinkedIn page',
      scrollTop: 'Scroll to top',
    },
    info: {
      about: {
        title: 'About Us',
        description:
          'Sai Jyothi Publication is dedicated to helping readers, students, and professionals discover meaningful books across genres. We curate quality titles and make book discovery simple and enjoyable.',
      },
      faq: {
        title: 'Frequently Asked Questions',
        description:
          'For this demo store: orders above ₹500 are eligible for free shipping, checkout requires login, and support is available through email and WhatsApp. You can browse by category, search, and track cart items in real time.',
      },
      shipping: {
        title: 'Shipping & Returns',
        description:
          'Standard delivery takes 5-7 business days. Orders above ₹500 ship free. Returns are accepted within 7 days for eligible items in original condition.',
      },
      privacy: {
        title: 'Privacy Policy',
        description:
          'This demo stores basic session data like cart and login details in local storage to improve user experience. No external payment is processed in this demo environment.',
      },
      terms: {
        title: 'Terms & Conditions',
        description:
          'By using this demo storefront, you agree to standard browsing and demo-order behavior. Prices, offers, and availability shown here are for demonstration purposes only.',
      },
    },
  },
  hi: {
    navbar: {
      admin: 'एडमिन',
      home: 'होम',
      books: 'पुस्तकें',
      orders: 'ऑर्डर',
      login: 'लॉगिन',
      logout: 'लॉगआउट',
      cart: 'कार्ट',
      searchPlaceholder: 'पुस्तकें, श्रेणियां, लेखक खोजें...',
      toggleDark: 'डार्क',
      toggleLight: 'लाइट',
      hiUser: 'नमस्ते',
      language: 'भाषा',
      searchAria: 'पुस्तकें खोजें',
      themeAria: 'डार्क मोड बदलें',
      menuAria: 'नेविगेशन मेनू खोलें',
      cartAria: 'कार्ट पर जाएं',
      publication: 'पब्लिकेशन',
    },
    common: {
      add: 'जोड़ें',
      by: 'लेखक',
      addedToCart: 'कार्ट में जोड़ी गई!',
      addToCart: 'कार्ट में जोड़ें',
      buyNow: 'अभी खरीदें',
      back: 'वापस',
      browseBooks: 'पुस्तकें देखें',
      browseCollection: 'कलेक्शन देखें',
      continueShopping: 'खरीदारी जारी रखें',
      loading: 'लोड हो रहा है...',
      reset: 'रीसेट',
      description: 'विवरण',
      pages: 'पृष्ठ',
      publisher: 'प्रकाशक',
      language: 'भाषा',
      isbn: 'आईएसबीएन',
      category: 'श्रेणी',
      quantity: 'मात्रा',
      total: 'कुल',
      shipping: 'डिलीवरी',
      free: 'मुफ्त',
      home: 'होम पर वापस',
      viewAll: 'सभी देखें',
      all: 'सभी',
      search: 'खोजें',
      edit: 'संपादित करें',
      delete: 'हटाएं',
      previous: 'पिछला',
      next: 'अगला',
    },
    categories: {
      All: 'सभी',
      Programming: 'प्रोग्रामिंग',
      Fiction: 'कथा साहित्य',
      Academic: 'शैक्षणिक',
      Kids: 'बच्चों की',
      'Self-Help': 'सेल्फ-हेल्प',
      Biography: 'जीवनी',
      History: 'इतिहास',
      Business: 'बिजनेस',
      Spirituality: 'आध्यात्मिक',
      Comics: 'कॉमिक्स',
    },
    orderStatus: {
      PLACED: 'ऑर्डर किया गया',
      PROCESSING: 'प्रोसेस हो रहा है',
      SHIPPED: 'भेज दिया गया',
      DELIVERED: 'डिलीवर हुआ',
      CANCELLED: 'रद्द',
    },
    footer: {
      club: 'बुक लवर्स क्लब',
      releases: 'हर सप्ताह नई रिलीज़ खोजें',
      about:
        'सभी श्रेणियों में बेहतरीन पुस्तकों का आपका विश्वसनीय स्रोत। 2010 से पाठकों को सशक्त बना रहे हैं।',
      quickLinks: 'त्वरित लिंक',
      allBooks: 'सभी पुस्तकें',
      customerService: 'ग्राहक सेवा',
      aboutUs: 'हमारे बारे में',
      faq: 'सामान्य प्रश्न',
      shippingReturns: 'शिपिंग और रिटर्न',
      privacyPolicy: 'गोपनीयता नीति',
      terms: 'नियम और शर्तें',
      contactUs: 'संपर्क करें',
      rights: 'सर्वाधिकार सुरक्षित।',
      crafted: 'पाठकों, छात्रों और आजीवन शिक्षार्थियों के लिए बनाया गया।',
      up: 'ऊपर',
      facebook: 'हमारा फेसबुक पेज देखें',
      x: 'हमारी एक्स प्रोफाइल देखें',
      instagram: 'हमारी इंस्टाग्राम प्रोफाइल देखें',
      linkedin: 'हमारा लिंक्डइन पेज देखें',
      scrollTop: 'ऊपर जाएं',
    },
    info: {
      about: {
        title: 'हमारे बारे में',
        description:
          'साई ज्योति पब्लिकेशन पाठकों, छात्रों और पेशेवरों को विभिन्न श्रेणियों में सार्थक पुस्तकें खोजने में मदद करने के लिए समर्पित है। हम गुणवत्तापूर्ण शीर्षकों का चयन करते हैं और पुस्तक खोज को आसान और आनंददायक बनाते हैं।',
      },
      faq: {
        title: 'अक्सर पूछे जाने वाले प्रश्न',
        description:
          'इस डेमो स्टोर के लिए: ₹500 से ऊपर के ऑर्डर पर मुफ्त शिपिंग है, चेकआउट के लिए लॉगिन जरूरी है, और सहायता ईमेल तथा व्हाट्सऐप पर उपलब्ध है। आप श्रेणी के अनुसार ब्राउज़ कर सकते हैं, खोज सकते हैं और अपने कार्ट आइटम ट्रैक कर सकते हैं।',
      },
      shipping: {
        title: 'शिपिंग और रिटर्न',
        description:
          'सामान्य डिलीवरी में 5-7 कार्यदिवस लगते हैं। ₹500 से ऊपर के ऑर्डर पर मुफ्त शिपिंग है। योग्य वस्तुओं को मूल स्थिति में 7 दिनों के भीतर लौटाया जा सकता है।',
      },
      privacy: {
        title: 'गोपनीयता नीति',
        description:
          'यह डेमो उपयोगकर्ता अनुभव बेहतर करने के लिए कार्ट और लॉगिन जैसी मूल सत्र जानकारी लोकल स्टोरेज में रखता है। इस डेमो वातावरण में कोई बाहरी भुगतान प्रोसेस नहीं किया जाता।',
      },
      terms: {
        title: 'नियम और शर्तें',
        description:
          'इस डेमो स्टोरफ्रंट का उपयोग करके, आप सामान्य ब्राउज़िंग और डेमो-ऑर्डर व्यवहार से सहमत होते हैं। यहां दिखाए गए मूल्य, ऑफर और उपलब्धता केवल प्रदर्शन उद्देश्यों के लिए हैं।',
      },
    },
  },
} as const;

interface LanguageContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
  categoryLabel: (category: string) => string;
  orderStatusLabel: (status: string) => string;
  locale: string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

const resolveValue = (language: Language, key: string): string => {
  const result = key.split('.').reduce<unknown>((current, part) => {
    if (!current || typeof current === 'string' || typeof current !== 'object') {
      return undefined;
    }
    return (current as Record<string, unknown>)[part];
  }, translations[language]);

  return typeof result === 'string' ? result : key;
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('app-language');
    if (savedLanguage === 'en' || savedLanguage === 'hi') {
      setLanguageState(savedLanguage);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('app-language', language);
    document.documentElement.lang = language === 'hi' ? 'hi' : 'en';
  }, [language]);

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      setLanguage: setLanguageState,
      t: (key: string) => resolveValue(language, key),
      categoryLabel: (category: string) =>
        resolveValue(language, `categories.${category}`) === `categories.${category}`
          ? category
          : resolveValue(language, `categories.${category}`),
      orderStatusLabel: (status: string) =>
        resolveValue(language, `orderStatus.${status}`) === `orderStatus.${status}`
          ? status
          : resolveValue(language, `orderStatus.${status}`),
      locale: language === 'hi' ? 'hi-IN' : 'en-IN',
    }),
    [language]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};
