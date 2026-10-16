'use client';

import { Phone, MessageCircle } from 'lucide-react';
import { contactInfo } from '@/lib/data';
import { useLanguage } from '@/context/LanguageContext';
import { useSettings } from '@/context/SettingsContext';

export default function MobileStickyActions() {
  const { lang, t } = useLanguage();
  const { settings } = useSettings();
  const phoneNumber = (settings?.primaryPhone || contactInfo.phones[1] || '9036852311').replace(/\D/g, '');
  const whatsappNumber = (settings?.whatsappNumber || contactInfo.whatsapp || '919036852311').replace(/\D/g, '');

  return (
    <div className="lg:hidden fixed bottom-0 inset-x-0 z-[40] bg-white/80 backdrop-blur-2xl border-t border-primary-50 p-4 px-6 pb-8 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
      <div className="flex gap-4 items-center">
        {/* CALL NOW BUTTON */}
        <a 
          href={`tel:${phoneNumber}`}
          className="flex-1 bg-[#021526] text-white flex items-center justify-center gap-3 py-3.5 rounded-2xl shadow-xl active:scale-95 transition-transform"
        >
          <Phone size={18} className="text-white fill-white" />
          <span className="font-black uppercase tracking-widest text-[10px]">
            {t('Call Now', 'కాల్ చేయండి', 'कॉल करें')}
          </span>
        </a>

        {/* WHATSAPP BUTTON */}
        <a 
          href={`https://wa.me/${whatsappNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 bg-[#25D366] text-white flex items-center justify-center gap-3 py-3.5 rounded-2xl shadow-xl active:scale-95 transition-transform"
        >
          <MessageCircle size={18} className="text-white fill-white" />
          <span className="font-black uppercase tracking-widest text-[10px]">
            {t('WhatsApp', 'వాట్సాప్', 'व्हाट्सएप')}
          </span>
        </a>
      </div>
    </div>
  );
}
