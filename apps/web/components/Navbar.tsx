'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu, X, Phone, Calendar, Globe, ChevronDown, Heart,
  Baby, Stethoscope, HeartPulse, Microscope, Dna, MapPin
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useSettings } from '@/context/SettingsContext';
import AppointmentModal from './AppointmentModal';
import { contactInfo, serviceCategories } from '@/lib/data';
import type { Language } from '@/types';

const IconMap: Record<string, any> = {
  HeartPulse,
  Microscope,
  Baby,
  Dna,
  Stethoscope,
};

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const pathname = usePathname();
  const { lang, setLang, t } = useLanguage();
  const { settings } = useSettings();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-reopen verification modal on non-home pages if user refreshed during OTP verification
  useEffect(() => {
    if (typeof window === 'undefined' || pathname === '/') return;
    try {
      const saved = sessionStorage.getItem('mscurechain_active_otp_session');
      if (saved) {
        const data = JSON.parse(saved);
        if (data && data.step === 'otp' && data.phone) {
          setIsModalOpen(true);
        }
      }
    } catch (e) {}
  }, [pathname]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { name: t('Home', 'హోమ్', 'होम'), href: '/' },
    { name: t('About', 'గురించి', 'हमारे बारे में'), href: '/about' },
    { name: t('Doctors', 'వైద్యులు', 'डॉक्टरों'), href: '/doctors' },
    { name: t('Services', 'సేవలు', 'सेवाएं'), href: '/services', hasDropdown: true },
    { name: t('Neonatal Care', 'నవజాత శిశు సంరక్షణ', 'नवजात देखभाल'), href: '/neonatal' },
    { name: t('Contact', 'సంప్రదించండి', 'संपर्क करें'), href: '/contact' },
  ];

  const languages: { code: Language; label: string; native: string }[] = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'te', label: 'Telugu', native: 'తెలుగు' },
    { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
        {/* ─── 1. TOP UTILITY / EMERGENCY BAR (APOLLO / MAYO CLINIC STANDARD) ─── */}
        <div className="bg-[#061e16] text-[#e2d5c3] text-xs border-b border-[#9b7745]/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-wrap items-center justify-between gap-2">
            
            {/* Left: Emergency Casualty & Location */}
            <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
              <a 
                href={`tel:${(settings?.casualtyPhone || '08562-318419').replace(/\D/g, '')}`} 
                className="inline-flex items-center gap-2 font-semibold hover:text-white transition-colors group"
              >
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-red-400 uppercase tracking-wider font-bold text-[10px] sm:text-xs">
                  {t('24/7 Casualty:', '24/7 అత్యవసరం:', '24/7 आपातकालीन:')}
                </span>
                <span className="text-[#fcfbf9] tracking-wide font-mono font-bold">
                  {settings?.casualtyPhone || '08562-318419'}
                </span>
              </a>

              <div className="hidden md:flex items-center gap-1.5 text-stone-300/80">
                <MapPin size={12} className="text-[#c5a880]" />
                <span className="truncate max-w-xs lg:max-w-none text-[11px]">
                  {t('Dwaraka Nagar, Near RTC Bus Stand, Kadapa', 'ద్వారకా నగర్, RTC బస్ స్టాండ్ దగ్గర, కడప', 'द्वारका नगर, आरटीसी बस स्टैंड, कडप्पा')}
                </span>
              </div>

              <div className="hidden lg:flex items-center gap-2 text-[#c5a880]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#c5a880]" />
                <span className="text-[11px] font-medium tracking-wide">
                  {t('NABH-Aligned Healthcare Standards', 'NABH-ఆధారిత వైద్య ప్రమాణాలు', 'एनएबीएच-संरेखित स्वास्थ्य मानक')}
                </span>
              </div>
            </div>

            {/* Right: Helpdesk & Language Selector */}
            <div className="flex items-center gap-3 sm:gap-4 ml-auto">
              <span className="hidden sm:inline-block text-[11px] text-emerald-200/80 bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-800/60">
                {t('Emergency Patient Care Desk', 'అత్యవసర రోగి సహాయ కేంద్రం', 'आपातकालीन रोगी सेवा केंद्र')}
              </span>

              {/* Language Switcher */}
              <div className="relative" ref={langRef}>
                <button
                  onClick={() => setIsLangOpen(!isLangOpen)}
                  className="px-2.5 py-1 rounded-lg bg-[#0e2c21] hover:bg-[#133d2e] text-[#fcfbf9] border border-[#9b7745]/30 transition-colors flex items-center gap-1.5 text-xs font-semibold"
                >
                  <Globe size={13} className="text-[#c5a880]" />
                  <span className="uppercase text-[11px] font-bold tracking-wider">{lang}</span>
                  <ChevronDown size={11} className={`transition-transform ${isLangOpen ? 'rotate-180' : ''}`} />
                </button>

                {isLangOpen && (
                  <div className="absolute top-[120%] right-0 w-44 bg-white rounded-2xl shadow-2xl border border-stone-200 p-2 z-50 text-stone-800 animate-fade-in-up">
                    {languages.map((l) => (
                      <button
                        key={l.code}
                        onClick={() => {
                          setLang(l.code);
                          setIsLangOpen(false);
                        }}
                        className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all ${
                          lang === l.code ? 'bg-[#0a2e22] text-white' : 'hover:bg-stone-100 text-stone-700'
                        }`}
                      >
                        <span className="text-xs font-bold">{l.native}</span>
                        <span className="text-[10px] opacity-60 uppercase">{l.code}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* ─── 2. MAIN HOSPITAL NAVIGATION (SOLID WHITE ARCHITECTURAL) ─── */}
        <div className="bg-white/98 backdrop-blur-md shadow-sm border-b border-stone-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20 sm:h-24">
              
              {/* Official Logo */}
              <Link href="/" className="flex items-center gap-3 group shrink-0">
                <div className="relative w-48 h-14 sm:w-60 sm:h-16 lg:w-72 lg:h-20 transition-transform duration-300 group-hover:scale-[1.02]">
                  <Image
                    src="/logo.png"
                    alt="Dhruva Hospitals Kadapa"
                    fill
                    className="object-contain object-left"
                    sizes="(max-width: 640px) 192px, (max-width: 1024px) 240px, 288px"
                    priority
                  />
                </div>
              </Link>

              {/* Desktop Navigation Links */}
              <div className="hidden lg:flex items-center gap-7">
                {navLinks.map((link) => (
                  <div key={link.name} className="relative" ref={link.hasDropdown ? dropdownRef : null}>
                    <button
                      onClick={() => link.hasDropdown && setIsDropdownOpen(!isDropdownOpen)}
                      className={`text-sm font-semibold transition-colors flex items-center gap-1.5 py-2 group ${
                        pathname === link.href ? 'text-[#0a2e22] font-bold' : 'text-stone-700 hover:text-[#0a2e22]'
                      }`}
                    >
                      {link.hasDropdown ? (
                        <span className="cursor-pointer tracking-tight">{link.name}</span>
                      ) : (
                        <Link href={link.href} className="tracking-tight">{link.name}</Link>
                      )}
                      
                      {link.hasDropdown && (
                        <ChevronDown 
                          size={14} 
                          className={`transition-transform duration-300 text-stone-500 ${isDropdownOpen ? 'rotate-180 text-[#0a2e22]' : ''}`} 
                        />
                      )}

                      {/* Active Indicator Bar */}
                      <span className={`absolute bottom-0 left-0 h-[2.5px] bg-[#9b7745] rounded-full transition-all duration-300 ${
                        pathname === link.href ? 'w-full' : 'w-0 group-hover:w-full'
                      }`} />
                    </button>

                    {/* Services Dropdown */}
                    {link.hasDropdown && isDropdownOpen && (
                      <div className="absolute top-[120%] left-1/2 -translate-x-1/2 w-[340px] bg-white rounded-2xl shadow-2xl border border-stone-200 p-4 z-50 animate-fade-in-up">
                        <div className="space-y-1">
                          {serviceCategories.map((cat) => {
                            const Icon = IconMap[cat.icon as string] || Stethoscope;
                            return (
                              <Link 
                                key={cat.id} 
                                href={`/services/${cat.id}`}
                                onClick={() => setIsDropdownOpen(false)}
                                className="flex items-center gap-3.5 p-3 rounded-xl hover:bg-stone-50 transition-all group/item"
                              >
                                <div className="w-10 h-10 bg-emerald-50 text-[#0a2e22] rounded-xl flex items-center justify-center group-hover/item:bg-[#0a2e22] group-hover/item:text-[#c5a880] transition-colors shrink-0">
                                  <Icon size={18} />
                                </div>
                                <div>
                                  <h4 className="text-sm font-bold text-stone-900 group-hover/item:text-[#0a2e22] tracking-tight">
                                    {t(cat.name, cat.teluguName, cat.hindiName)}
                                  </h4>
                                  <p className="text-[11px] text-stone-500 leading-snug line-clamp-1">{cat.description}</p>
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Action Buttons: Emergency Dial + Book Appointment */}
              <div className="hidden sm:flex items-center gap-3">
                <a
                  href={`tel:${(settings?.casualtyPhone || '08562-318419').replace(/\D/g, '')}`}
                  className="hidden xl:flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-stone-200 hover:border-red-300 bg-stone-50 hover:bg-red-50/50 text-stone-800 transition-all"
                >
                  <div className="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center">
                    <Phone size={14} className="fill-current" />
                  </div>
                  <div className="text-left">
                    <span className="block text-[10px] uppercase font-bold text-red-600 tracking-wider leading-none">24/7 Casualty</span>
                    <span className="text-xs font-bold text-stone-900 font-mono">{settings?.casualtyPhone || '08562-318419'}</span>
                  </div>
                </a>

                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-[#0a2e22] hover:bg-[#134937] text-white px-5 sm:px-6 py-3 rounded-xl font-bold text-sm shadow-md shadow-[#0a2e22]/20 active:scale-95 transition-all flex items-center gap-2"
                >
                  <Calendar size={16} className="text-[#c5a880]" />
                  <span>{t('Book Consultation', 'కన్సల్టేషన్ బుక్ చేయండి', 'परामर्श बुक करें')}</span>
                </button>
              </div>

              {/* Mobile Menu Toggle */}
              <div className="lg:hidden flex items-center gap-2">
                <a
                  href="tel:08562318419"
                  className="w-10 h-10 rounded-xl bg-red-50 text-red-600 border border-red-200 flex items-center justify-center"
                >
                  <Phone size={18} />
                </a>
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="w-10 h-10 rounded-xl bg-stone-100 text-stone-800 flex items-center justify-center"
                >
                  {isOpen ? <X size={22} /> : <Menu size={22} />}
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* ─── MOBILE LANG MENU ─── */}
        <div className={`lg:hidden absolute top-[100%] inset-x-0 bg-white border-b border-gray-100 p-6 flex justify-around shadow-2xl transition-all duration-300 z-[999] ${
          isLangOpen ? 'translate-y-0 opacity-100 visible' : '-translate-y-4 opacity-0 invisible pointer-events-none'
        }`}>
          {languages.map((l) => (
            <button
              key={l.code}
              type="button"
              onClick={() => {
                setLang(l.code);
                setIsLangOpen(false);
              }}
              className={`flex-1 flex flex-col items-center gap-1 mx-2 py-4 rounded-2xl transition-all active:scale-90 ${
                lang === l.code 
                ? 'bg-primary-600 text-white shadow-xl scale-105' 
                : 'bg-gray-50 text-gray-700 border border-gray-100'
              }`}
            >
              <span className="text-base font-black leading-none">{l.native}</span>
              <span className="text-[10px] uppercase tracking-widest opacity-70 font-bold">{l.label}</span>
            </button>
          ))}
        </div>

        {/* ─── MOBILE NAVIGATION MENU ─── */}
        <div className={`lg:hidden fixed inset-x-0 top-[100%] bg-white backdrop-blur-3xl transition-all duration-500 ease-out border-b border-gray-100 shadow-2xl overflow-y-auto max-h-[calc(100vh-80px)] ${
          isOpen ? 'translate-y-0 opacity-100 visible' : '-translate-y-10 opacity-0 invisible'
        }`}>
          <div className="px-8 py-12 space-y-10">
            <div className="space-y-6">
              {navLinks.map((link) => (
                <div key={link.name} className="space-y-6">
                  <Link
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`block text-3xl font-black tracking-tight ${
                      pathname === link.href ? 'text-primary-600' : 'text-primary-950'
                    }`}
                  >
                    {link.name}
                  </Link>
                  {link.hasDropdown && (
                    <div className="grid grid-cols-1 gap-4 pl-4">
                      {serviceCategories.map((cat) => {
                        const Icon = IconMap[cat.icon as string] || Stethoscope;
                        return (
                          <Link 
                            key={cat.id} 
                            href={`/services/${cat.id}`}
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-4 p-5 bg-gray-50 rounded-3xl text-xs font-black text-primary-950/70"
                          >
                            <Icon size={20} className="text-primary-500 shrink-0" />
                            <span className="truncate uppercase tracking-wider">{t(cat.name, cat.teluguName, cat.hindiName)}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="pt-8 border-t border-gray-100">
              <button
                onClick={() => {
                  setIsOpen(false);
                  setIsModalOpen(true);
                }}
                className="w-full bg-emerald-900 text-white py-6 rounded-[24px] font-black text-lg shadow-2xl flex items-center justify-center gap-4 hover:bg-emerald-800"
              >
                <Calendar size={24} />
                {t('Book Now', 'బుక్ చేయండి', 'बुक करें')}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Layout Spacer so page content begins neatly below fixed enterprise navbar */}
      <div className="h-28 sm:h-32" />

      <AppointmentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
