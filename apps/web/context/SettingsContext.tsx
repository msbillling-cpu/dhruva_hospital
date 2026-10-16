'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { HospitalSettings } from '@/lib/settings';

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

interface SettingsContextType {
  settings: HospitalSettings;
  updateSettings: (newSettings: Partial<HospitalSettings>) => Promise<boolean>;
  refreshSettings: () => Promise<void>;
  isLoading: boolean;
}

const SettingsContext = createContext<SettingsContextType>({
  settings: DEFAULT_SETTINGS,
  updateSettings: async () => false,
  refreshSettings: async () => {},
  isLoading: true,
});

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<HospitalSettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        if (data.settings) {
          setSettings(data.settings);
        }
      }
    } catch (err) {
      console.error('Failed to load dynamic hospital settings:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const updateSettings = async (newSettings: Partial<HospitalSettings>): Promise<boolean> => {
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.settings) {
          setSettings(data.settings);
          return true;
        }
      }
      return false;
    } catch (err) {
      console.error('Failed to save settings:', err);
      return false;
    }
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSettings,
        refreshSettings: fetchSettings,
        isLoading,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
