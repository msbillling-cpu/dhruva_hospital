import * as fs from 'fs';
import * as path from 'path';
import type { Appointment } from '@repo/types';

export interface ExtendedAppointment extends Omit<Appointment, 'status'> {
  id: string;
  uhid?: string;
  status: 'pending' | 'contacted' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
  notes?: string;
  location?: string;
  age?: number;
  gender?: string;
  priority?: 'routine' | 'urgent' | 'emergency';
  token?: number;
  consultationType?: 'OPD Consultation' | 'IPD Admission' | 'Emergency Casualty' | 'Telehealth';
}

const DATA_DIR = path.join(process.cwd(), 'data');
const JSON_FILE_PATH = path.join(DATA_DIR, 'appointments.json');

// Default initial seed data reflecting actual Kadapa regional inquiries
const INITIAL_SEED: ExtendedAppointment[] = [
  {
    id: 'APT-1081',
    uhid: 'DH-2026-8491',
    name: 'Lakshmi Prasanna',
    phone: '9848022341',
    email: 'lakshmi.p@gmail.com',
    service: 'fertility',
    doctor: 'Dr. S Mounika Reddy',
    date: '2026-10-15',
    message: 'Seeking consultation for secondary infertility & IVF evaluation. Referred from Proddatur.',
    status: 'pending',
    createdAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(), // 35 mins ago
    location: 'Proddatur',
    age: 29,
    gender: 'Female',
    priority: 'urgent',
    token: 18,
    consultationType: 'OPD Consultation',
  },
  {
    id: 'APT-1080',
    uhid: 'DH-2026-8490',
    name: 'K. Venkateswara Rao (Father)',
    phone: '9440188923',
    email: 'venkat.k@yahoo.com',
    service: 'neonatal',
    doctor: 'Dr. Sudarshan Reddy K',
    date: '2026-10-14',
    message: 'Newborn born at 33 weeks needing preterm growth follow-up and pediatric review in NICU.',
    status: 'contacted',
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
    location: 'Kadapa Town',
    age: 34,
    gender: 'Male',
    priority: 'urgent',
    token: 19,
    consultationType: 'OPD Consultation',
  },
  {
    id: 'APT-1079',
    uhid: 'DH-2026-8489',
    name: 'Shaik Fatima Begum',
    phone: '8978234110',
    email: '',
    service: 'gynaecology',
    doctor: 'Dr. S Mounika Reddy',
    date: '2026-10-16',
    message: 'Severe pelvic pain and fibroid assessment for advanced 3D laparoscopic surgery.',
    status: 'confirmed',
    createdAt: new Date(Date.now() - 1000 * 60 * 360).toISOString(), // 6 hours ago
    location: 'Rayachoti',
    age: 38,
    gender: 'Female',
    priority: 'routine',
    token: 21,
    consultationType: 'OPD Consultation',
  },
  {
    id: 'APT-1078',
    uhid: 'DH-2026-8488',
    name: 'S. Ramanjaneyulu',
    phone: '9177894562',
    email: 'ram.s@outlook.com',
    service: 'emergency',
    doctor: 'Any Available Specialist',
    date: '2026-10-13',
    message: 'Emergency trauma casualty inquiry after road accident near RTC bus stand.',
    status: 'completed',
    createdAt: new Date(Date.now() - 1000 * 60 * 720).toISOString(), // 12 hours ago
    location: 'Kadapa (RTC Bus Stand)',
    age: 45,
    gender: 'Male',
    priority: 'emergency',
    token: 2,
    consultationType: 'Emergency Casualty',
  },
  {
    id: 'APT-1077',
    uhid: 'DH-2026-8487',
    name: 'Ananya Reddy',
    phone: '7032194855',
    email: 'ananya.reddy@gmail.com',
    service: 'pregnancy',
    doctor: 'Dr. S Mounika Reddy',
    date: '2026-10-17',
    message: 'High-risk maternity registration (Twin gestation, 26 weeks, Doppler review).',
    status: 'confirmed',
    createdAt: new Date(Date.now() - 1000 * 60 * 1440).toISOString(), // 1 day ago
    location: 'Pulivendula',
    age: 27,
    gender: 'Female',
    priority: 'urgent',
    token: 24,
    consultationType: 'OPD Consultation',
  },
  {
    id: 'APT-1076',
    uhid: 'DH-2026-8486',
    name: 'B. Haritha Devi',
    phone: '9989412356',
    email: '',
    service: 'cancer',
    doctor: 'Dr. S Mounika Reddy',
    date: '2026-10-18',
    message: 'Preventive cervical Pap smear and mammography screening package.',
    status: 'contacted',
    createdAt: new Date(Date.now() - 1000 * 60 * 2880).toISOString(), // 2 days ago
    location: 'Mydukur',
    age: 42,
    gender: 'Female',
    priority: 'routine',
    token: 26,
    consultationType: 'OPD Consultation',
  },
  {
    id: 'APT-1075',
    uhid: 'DH-2026-8485',
    name: 'M. Chenna Reddy',
    phone: '9652341908',
    email: '',
    service: 'neonatal',
    doctor: 'Dr. Sudarshan Reddy K',
    date: '2026-10-12',
    message: 'Infant phototherapy and high bilirubin treatment post-delivery review.',
    status: 'completed',
    createdAt: new Date(Date.now() - 1000 * 60 * 4320).toISOString(), // 3 days ago
    location: 'Badvel',
    age: 31,
    gender: 'Male',
    priority: 'urgent',
    token: 28,
    consultationType: 'IPD Admission',
  },
];

let inMemoryStore: ExtendedAppointment[] = [];

function ensureDataFile(): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(JSON_FILE_PATH)) {
      fs.writeFileSync(JSON_FILE_PATH, JSON.stringify(INITIAL_SEED, null, 2), 'utf-8');
      inMemoryStore = [...INITIAL_SEED];
    } else {
      const content = fs.readFileSync(JSON_FILE_PATH, 'utf-8');
      inMemoryStore = JSON.parse(content);
    }
  } catch (err) {
    console.error('Failed to initialize appointments file:', err);
    if (inMemoryStore.length === 0) {
      inMemoryStore = [...INITIAL_SEED];
    }
  }
}

function persistData(): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(JSON_FILE_PATH, JSON.stringify(inMemoryStore, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to persist appointments file:', err);
  }
}

export function getAllAppointments(): ExtendedAppointment[] {
  ensureDataFile();
  return inMemoryStore.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getAppointmentById(id: string): ExtendedAppointment | undefined {
  ensureDataFile();
  return inMemoryStore.find((a) => a.id === id);
}

export function createAppointment(data: Omit<Appointment, 'id' | 'status' | 'createdAt'> & {
  location?: string;
  uhid?: string;
  age?: number;
  gender?: string;
  priority?: 'routine' | 'urgent' | 'emergency';
  token?: number;
  consultationType?: 'OPD Consultation' | 'IPD Admission' | 'Emergency Casualty' | 'Telehealth';
}): ExtendedAppointment {
  ensureDataFile();
  const appointment: ExtendedAppointment = {
    ...data,
    id: `APT-${Date.now().toString().slice(-4)}`,
    uhid: data.uhid || `DH-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    status: 'pending',
    createdAt: new Date().toISOString(),
    location: data.location || 'Kadapa District',
    age: data.age || 28,
    gender: data.gender || 'Female',
    priority: data.priority || 'routine',
    token: data.token || Math.floor(15 + Math.random() * 40),
    consultationType: data.consultationType || 'OPD Consultation',
  };
  inMemoryStore.unshift(appointment);
  persistData();
  return appointment;
}

export function updateAppointmentStatus(id: string, status: ExtendedAppointment['status'], notes?: string): ExtendedAppointment | null {
  ensureDataFile();
  const idx = inMemoryStore.findIndex((a) => a.id === id);
  if (idx === -1) return null;
  
  inMemoryStore[idx] = {
    ...inMemoryStore[idx]!,
    status,
    ...(notes !== undefined ? { notes } : {}),
  };
  persistData();
  return inMemoryStore[idx]!;
}

export function deleteAppointment(id: string): boolean {
  ensureDataFile();
  const initialLen = inMemoryStore.length;
  inMemoryStore = inMemoryStore.filter((a) => a.id !== id);
  if (inMemoryStore.length !== initialLen) {
    persistData();
    return true;
  }
  return false;
}
