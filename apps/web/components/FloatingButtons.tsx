'use client';

import { Phone, MessageCircle } from 'lucide-react';
import { contactInfo } from '@/lib/data';
import { useLanguage } from '@/context/LanguageContext';
import { useSettings } from '@/context/SettingsContext';

export default function FloatingButtons() {
  const { lang, t } = useLanguage();
  const { settings } = useSettings();

  const whatsappNum = settings?.whatsappNumber || contactInfo.whatsapp;
  const primaryPhone = settings?.primaryPhone || '9036852311';

  return (
    <div className="hidden lg:flex fixed bottom-6 right-4 z-50 flex-col gap-3">
      {/* WhatsApp */}
      <a
        href={`https://wa.me/${whatsappNum.replace(/\D/g, '')}?text=Hello%2C%20I%20would%20like%20to%20book%20an%20appointment%20at%20Dhruva%20Hospitals.`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp"
        className="group relative w-14 h-14 bg-[#25D366] rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform duration-200"
      >
        {/* Pulse ring */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-30" />
        <MessageCircle size={26} className="text-white fill-white" />
        <span className="absolute right-16 bg-gray-800 text-white text-xs font-medium px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
          {t('WhatsApp Us', 'మాకు వాట్సాప్ చేయండి', 'हमें व्हाट्सएप करें')}
        </span>
      </a>

      {/* Call Now */}
      <a
        href={`tel:${primaryPhone.replace(/\D/g, '')}`}
        aria-label="Call Now"
        className="group relative w-14 h-14 bg-accent-500 rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform duration-200"
      >
        <Phone size={24} className="text-white" />
        <span className="absolute right-16 bg-gray-800 text-white text-xs font-medium px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
          {t('Call:', 'కాల్ చేయండి:', 'कॉल करें:')} {primaryPhone}
        </span>
      </a>
    </div>
  );
}
