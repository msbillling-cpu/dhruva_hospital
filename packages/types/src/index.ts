export interface Doctor {
  id: string;
  doctorId?: string;
  name: string;
  teluguName?: string;
  hindiName?: string;
  qualifications: string[];
  specialization: string;
  designation: string;
  initials: string;
  image?: string;
  bio: string;
  fellowships: string[];
  experiences: string[];
  languages: string[];
  slug: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
  teluguName: string;
  hindiName?: string;
  description: string;
  icon: string;
  color: string;
  services: string[];
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  content: string;
  teluguContent: string;
  hindiContent?: string;
  rating: number;
  service: string;
}

export interface FAQItem {
  id: string;
  question: string;
  teluguQuestion: string;
  hindiQuestion?: string;
  answer: string;
  teluguAnswer: string;
  hindiAnswer?: string;
}

export interface Appointment {
  id?: string;
  name: string;
  phone: string;
  email?: string;
  service: string;
  doctor: string;
  date: string;
  message?: string;
  status?: 'pending' | 'confirmed' | 'cancelled';
  createdAt?: string;
}

export type Language = 'en' | 'te' | 'hi';
