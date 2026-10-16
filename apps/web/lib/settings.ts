import * as fs from 'fs';
import * as path from 'path';

export interface HospitalSettings {
  casualtyPhone: string;
  primaryPhone: string;
  secondaryPhone: string;
  whatsappNumber: string;
  email: string;
  address: string;
  landmark: string;
  opdTimings: string;
  googleAnalyticsId: string;
  googleMapsUrl: string;
}

const DEFAULT_SETTINGS: HospitalSettings = {
  casualtyPhone: '08562-318419',
  primaryPhone: '9036852311',
  secondaryPhone: '8008508384',
  whatsappNumber: '919036852311',
  email: 'info@dhruvahospitals.com',
  address: '1/705, Dwarka Nagar, Near RTC Bus Stand, Kadapa – 516001, Andhra Pradesh',
  landmark: 'Adjacent to Rythu Bazar, Opposite Sandhya Circle, Near Kadapa RTC Central Bus Stand',
  opdTimings: 'Mon – Sat: 9:00 AM – 9:00 PM • Emergency: 24/7 Round-the-Clock',
  googleAnalyticsId: 'G-DHRUVA2026',
  googleMapsUrl: 'https://maps.google.com/?q=Dhruva+Hospitals+Kadapa',
};

const DATA_DIR = path.join(process.cwd(), 'data');
const SETTINGS_FILE_PATH = path.join(DATA_DIR, 'settings.json');

let inMemorySettings: HospitalSettings | null = null;

function ensureSettingsFile(): HospitalSettings {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(SETTINGS_FILE_PATH)) {
      fs.writeFileSync(SETTINGS_FILE_PATH, JSON.stringify(DEFAULT_SETTINGS, null, 2), 'utf-8');
      inMemorySettings = { ...DEFAULT_SETTINGS };
      return inMemorySettings;
    }
    const content = fs.readFileSync(SETTINGS_FILE_PATH, 'utf-8');
    const parsed = JSON.parse(content);
    const loaded: HospitalSettings = { ...DEFAULT_SETTINGS, ...parsed };
    inMemorySettings = loaded;
    return loaded;
  } catch (err) {
    console.error('Error reading settings file:', err);
    const fallback: HospitalSettings = inMemorySettings || { ...DEFAULT_SETTINGS };
    inMemorySettings = fallback;
    return fallback;
  }
}

export function getHospitalSettings(): HospitalSettings {
  if (inMemorySettings) return inMemorySettings;
  return ensureSettingsFile();
}

export function updateHospitalSettings(updated: Partial<HospitalSettings>): HospitalSettings {
  const current = getHospitalSettings();
  const merged: HospitalSettings = {
    ...current,
    ...updated,
  };
  inMemorySettings = merged;

  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(SETTINGS_FILE_PATH, JSON.stringify(merged, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error persisting settings file:', err);
  }

  return merged;
}
