import type { StoreContent } from '../types/content';

const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim() || 'http://localhost:8080/api';

const fallbackStoreContent: StoreContent = {
  upcoming: [
    {
      title: 'Academic Selection Week',
      description:
        'A guided showcase of semester-ready titles, faculty recommendations, and curated bundles for campus readers.',
      dateLabel: '15-21 April 2026',
      audience: 'Students, faculty, and institutions',
      ctaLabel: 'See Event Details',
      ctaPath: '/events',
    },
    {
      title: 'Summer Reading Campaign',
      description:
        'Fresh arrivals and themed reading packs for school readers, parents, and community libraries.',
      dateLabel: 'Starting 25 April 2026',
      audience: 'Schools, families, and libraries',
      ctaLabel: 'Browse the Collection',
      ctaPath: '/books?category=Kids',
    },
    {
      title: 'Institutional Order Window',
      description:
        'Priority support for schools and colleges placing catalogue-based orders for the upcoming academic cycle.',
      dateLabel: 'Open this month',
      audience: 'Schools, colleges, and bulk buyers',
      ctaLabel: 'View Our Catalogues',
      ctaPath: '/catalogues',
    },
  ],
  universitySegments: [
    {
      name: 'Engineering & Polytechnic',
      description:
        'Core subject books, practical manuals, and exam-focused references for technical learners.',
      category: 'Academic',
      icon: 'graduation-cap',
      ctaLabel: 'Explore Engineering Titles',
      ctaPath: '/books?category=Academic',
    },
    {
      name: 'Competitive & Entrance',
      description:
        'Objective practice books, solved papers, and strong foundation material for entrance preparation.',
      category: 'Competitive',
      icon: 'briefcase',
      ctaLabel: 'See Competitive Collection',
      ctaPath: '/books?category=Competitive',
    },
    {
      name: 'School & Junior College',
      description:
        'Reliable titles for higher secondary learners, classroom support, and concept-building revision.',
      category: 'School',
      icon: 'book-open',
      ctaLabel: 'Browse School Titles',
      ctaPath: '/books?category=School',
    },
    {
      name: 'Commerce & Professional',
      description:
        'Focused resources for commerce, business studies, communication, and career-ready learning.',
      category: 'Business',
      icon: 'landmark',
      ctaLabel: 'View Commerce Shelf',
      ctaPath: '/books?category=Business',
    },
  ],
  testimonials: [
    {
      name: 'Dr. Meera Kulkarni',
      role: 'College Librarian',
      city: 'Nagpur',
      rating: 5,
      quote:
        'Sai Jyothi Publication made academic sourcing far more organized for our library team. The catalogue support and regional availability saved us valuable time.',
    },
    {
      name: 'Rohan Tiwari',
      role: 'Engineering Student',
      city: 'Amravati',
      rating: 5,
      quote:
        'The website makes it easy to find subject books, place orders, and follow delivery updates without confusion. The experience feels simple and dependable.',
    },
    {
      name: 'Pooja Sharma',
      role: 'School Coordinator',
      city: 'Wardha',
      rating: 5,
      quote:
        'For institutional requirements, the catalogue section and nearby distributor details are exactly what schools and parents expect from a serious book supplier.',
    },
  ],
  catalogues: [
    {
      title: 'Academic Essentials Catalogue',
      description:
        'A well-organized catalogue covering semester books, reference titles, and institution-friendly bundles.',
      format: 'PDF',
      audience: 'Colleges, universities, and departments',
      downloadLabel: 'View Academic Catalogue',
      downloadUrl: '/books?category=Academic',
    },
    {
      title: 'School Learning Catalogue',
      description:
        'A focused collection for classrooms, supplementary reading, and parent-friendly recommendations.',
      format: 'PDF',
      audience: 'Schools, teachers, and parents',
      downloadLabel: 'Browse School Collection',
      downloadUrl: '/books?category=School',
    },
    {
      title: 'Competitive Preparation Catalogue',
      description:
        'A preparation-first list of titles for aptitude, entrance, and competitive exam practice.',
      format: 'PDF',
      audience: 'Aspirants and coaching centers',
      downloadLabel: 'Explore Competitive Titles',
      downloadUrl: '/books?category=Competitive',
    },
  ],
  distributors: [
    {
      city: 'Nagpur',
      partnerName: 'Sai Jyothi Publication Store',
      contactPerson: 'Main store and dispatch desk',
      phone: '+91 99236 93506',
      address: '43HQ+PG6 Jattarodi, Indra Nagar, Nagpur, Maharashtra 440003',
      mapQuery: '43HQ+PG6 jattarodi, Indra Nagar, Nagpur, Maharashtra 440003',
    },
    {
      city: 'Amravati',
      partnerName: 'Shree Book Distributors',
      contactPerson: 'Academic supply partner',
      phone: '+91 90210 11882',
      address: 'Rajapeth Market Road, Amravati, Maharashtra 444601',
      mapQuery: 'Rajapeth Market Road, Amravati, Maharashtra 444601',
    },
    {
      city: 'Wardha',
      partnerName: 'Vidya Publication Point',
      contactPerson: 'School and institution support',
      phone: '+91 97664 22115',
      address: 'Bachelor Road, Wardha, Maharashtra 442001',
      mapQuery: 'Bachelor Road, Wardha, Maharashtra 442001',
    },
    {
      city: 'Chandrapur',
      partnerName: 'Scholars Book Hub',
      contactPerson: 'Regional distribution partner',
      phone: '+91 93718 44220',
      address: 'Civil Lines, Chandrapur, Maharashtra 442402',
      mapQuery: 'Civil Lines, Chandrapur, Maharashtra 442402',
    },
  ],
};

const parseJson = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
};

export const contentApi = {
  async getStoreContent(): Promise<StoreContent> {
    try {
      const response = await fetch(`${API_BASE_URL}/content`);
      return await parseJson<StoreContent>(response);
    } catch {
      return fallbackStoreContent;
    }
  },
};
