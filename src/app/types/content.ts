export interface UpcomingHighlight {
  title: string;
  description: string;
  dateLabel: string;
  audience: string;
  ctaLabel: string;
  ctaPath: string;
}

export interface UniversitySegment {
  name: string;
  description: string;
  category: string;
  icon: string;
  ctaLabel: string;
  ctaPath: string;
}

export interface Testimonial {
  name: string;
  role: string;
  city: string;
  rating: number;
  quote: string;
}

export interface Catalogue {
  title: string;
  description: string;
  format: string;
  audience: string;
  downloadLabel: string;
  downloadUrl: string;
}

export interface Distributor {
  city: string;
  partnerName: string;
  contactPerson: string;
  phone: string;
  address: string;
  mapQuery: string;
}

export interface StoreContent {
  upcoming: UpcomingHighlight[];
  universitySegments: UniversitySegment[];
  testimonials: Testimonial[];
  catalogues: Catalogue[];
  distributors: Distributor[];
}
