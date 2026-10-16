'use client';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Phone, Mail, MapPin, Facebook, Instagram, Youtube, 
  ArrowRight, CheckCircle2, Award, Clock, HeartPulse,
  Navigation, ChevronRight, Stethoscope, Building2
} from 'lucide-react';
import { contactInfo, serviceCategories } from '@/lib/data';
import { useLanguage } from '@/context/LanguageContext';
import { useSettings } from '@/context/SettingsContext';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { lang, t } = useLanguage();
  const { settings } = useSettings();

  return (
    <footer className="relative mt-24 bg-[#f8faf9] text-stone-800 border-t border-stone-200">
      
      {/* ─── 1. EXECUTIVE PRE-FOOTER CLINICAL ACTION BANNER ─── */}
      <div className="bg-white border-b border-stone-200 shadow-sm relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
            
            {/* Left: Authoritative Headline */}
            <div className="space-y-3.5 text-center lg:text-left max-w-2xl">
              <div className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-[#0a2e22] text-xs font-mono font-bold uppercase tracking-wider">
                <span>{t('24/7 Emergency Casualty & Critical Care', '24/7 అత్యవసర & క్రిటికల్ కేర్', '24/7 आपातकालीन एवं क्रिटिकल केयर')}</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#0a2e22] tracking-tight leading-tight">
                {t('World-Class Healthcare,', 'ప్రపంచ స్థాయి వైద్యం,', 'विश्व स्तरीय स्वास्थ्य सेवा,')} <br className="hidden sm:inline" />
                <span className="italic font-light text-[#9b7745]">
                  {t('Delivered with Ethical Integrity.', 'నైతిక విలువలతో కూడిన సంరక్షణ.', 'नैतिक निष्ठा के साथ प्रदान की गई।')}
                </span>
              </h2>
              <p className="text-stone-600 text-sm sm:text-base font-normal leading-relaxed">
                {t(
                  'Immediate triage for newborn critical emergencies (Level-3 NICU), high-risk pregnancy complications, and scheduled OPD consultations with senior consultants in Kadapa.',
                  'నవజాత శిశు క్రిటికల్ ఎమర్జెన్సీలు (లెవల్-3 NICU), హై-రిస్క్ ప్రసూతి మరియు సీనియర్ వైద్యుల కన్సల్టేషన్ల కోసం కడపలో తక్షణ వైద్య సేవలు.',
                  'कडप्पा में नवजात आपात स्थितियों (लेवल-3 एनआईसीयू), उच्च जोखिम वाले मातृत्व और वरिष्ठ सलाहकारों के साथ ओपीडी परामर्श के लिए तत्काल सेवा।'
                )}
              </p>
            </div>

            {/* Right: High-Impact Direct Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0 w-full lg:w-auto">
              <Link 
                href="/contact" 
                className="w-full sm:w-auto px-8 py-4 bg-[#0a2e22] hover:bg-[#134937] text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2.5 text-xs sm:text-sm uppercase tracking-wider group"
              >
                <span>{t('Book OPD Consultation', 'OPD కన్సల్టేషన్ బుక్ చేయండి', 'ओपीडी परामर्श बुक करें')}</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform text-[#c5a880]" />
              </Link>

              <a 
                href={`tel:${(settings?.casualtyPhone || '08562-318419').replace(/\D/g, '')}`} 
                className="w-full sm:w-auto px-8 py-4 bg-red-50 hover:bg-red-100 border border-red-200 text-red-950 font-bold rounded-xl transition-all shadow-sm hover:-translate-y-0.5 flex items-center justify-center gap-3 text-xs sm:text-sm group"
              >
                <div className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
                <Phone size={16} className="text-red-600" />
                <div className="text-left">
                  <span className="block text-[10px] text-red-600 uppercase tracking-widest font-mono font-bold">24/7 Casualty Hotline</span>
                  <span className="text-sm font-mono font-bold text-stone-900 tracking-wider">
                    {settings?.casualtyPhone || '08562–318419'}
                  </span>
                </div>
              </a>
            </div>

          </div>
        </div>
      </div>

      {/* ─── 2. MAIN INSTITUTIONAL FOOTER ─── */}
      <div className="pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-14 pb-14 border-b border-stone-200">
            
            {/* Column 1 (4 cols): Authentic Logo, Brand, & Medical Leadership */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Authentic Crisp Full-Color Logo sitting naturally on light background */}
              <Link href="/" className="inline-block group">
                <div className="relative w-52 h-14 transition-transform group-hover:scale-102 duration-300">
                  <Image
                    src="/logo.png"
                    alt="Dhruva Hospitals Kadapa"
                    fill
                    className="object-contain object-left"
                    sizes="208px"
                  />
                </div>
              </Link>

              <p className="text-stone-600 text-sm leading-relaxed font-normal">
                {t(
                  'Rayalaseema’s benchmark tertiary healthcare institution — engineered for Advanced Infertility (IVF/ICSI), High-Risk Obstetrics, Level-III Neonatal Critical Care (NICU), and Minimally Invasive Laparoscopic Surgery.',
                  'అధునాతన సంతానలేమి (IVF), హై-రిస్క్ ప్రసూతి, లెవల్-III నియోనాటల్ క్రిటికల్ కేర్ (NICU) మరియు లాపరోస్కోపిక్ సర్జరీలకు రాయలసీమ యొక్క ప్రధాన వైద్య కేంద్రం.',
                  'उन्नत प्रजनन (आईवीएफ), उच्च जोखिम वाले प्रसूति, स्तर-III नवजात क्रिटिकल केयर (एनआईसीयू) और लेप्रोस्कोपिक सर्जरी के लिए रायलसीमा का प्रमुख स्वास्थ्य केंद्र।'
                )}
              </p>

              {/* Distinguished Clinical Directorate Box */}
              <div className="p-5 rounded-2xl bg-white border border-stone-200 space-y-3 shadow-xs">
                <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#9b7745]">
                  <Building2 size={14} className="text-[#9b7745]" />
                  <span>Clinical Leadership Directorate</span>
                </div>
                <div className="space-y-2 text-xs text-stone-700">
                  <div>
                    <strong className="text-[#0a2e22] text-sm font-serif block">Dr. Sudarshan Reddy K</strong>
                    <span className="text-stone-500 text-[11px] font-medium">Founder & Chairman • Senior Neonatologist (Children&apos;s Specialist)</span>
                  </div>
                  <div className="pt-2 border-t border-stone-100">
                    <strong className="text-[#0a2e22] text-sm font-serif block">Dr. S Mounika Reddy</strong>
                    <span className="text-stone-500 text-[11px] font-medium">Director • Laparoscopic Surgeon & IVF Specialist</span>
                  </div>
                </div>
              </div>

              {/* Verified Hospital Handles */}
              <div className="flex items-center gap-3 pt-1">
                <span className="text-xs uppercase font-mono text-stone-500 font-bold tracking-wider mr-1">Social:</span>
                {[
                  { Icon: Facebook, href: 'https://www.facebook.com/p/Dhruva-Hospital-61588717175038/', label: 'Facebook' },
                  { Icon: Instagram, href: 'https://www.instagram.com/dhruva_hospitals_kadapa/', label: 'Instagram' },
                  { Icon: Youtube, href: 'https://www.youtube.com/@DhruvaHospitals-r1z', label: 'YouTube' }
                ].map((item, i) => (
                  <a 
                    key={i} 
                    href={item.href} 
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={item.label}
                    className="w-9 h-9 rounded-xl bg-white border border-stone-200 flex items-center justify-center hover:bg-[#0a2e22] hover:text-white hover:border-[#0a2e22] transition-all text-stone-600 shadow-xs"
                  >
                    <item.Icon size={15} />
                  </a>
                ))}
              </div>
            </div>

            {/* Column 2 (2 cols): Hospital Navigation */}
            <div className="lg:col-span-2 space-y-5">
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#9b7745] block">
                  Directory
                </span>
                <h3 className="text-lg font-serif font-bold text-[#0a2e22] tracking-wide">
                  {t('Hospital', 'హాస్పిటల్', 'अस्पताल')}
                </h3>
              </div>

              <ul className="space-y-3">
                {[
                  { name: t('Home', 'హోమ్', 'होम'), path: '/' },
                  { name: t('About Institution', 'సంస్థ చరిత్ర', 'संस्थान के बारे में'), path: '/about' },
                  { name: t('Specialist Faculty', 'వైద్య నిపుణులు', 'विशेषज्ञ डॉक्टर'), path: '/doctors' },
                  { name: t('Level-III NICU Care', 'లెవల్-3 NICU కేర్', 'स्तर-3 एनआईसीयू'), path: '/neonatal' },
                  { name: t('Clinical Departments', 'క్లినికల్ విభాగాలు', 'नैदानिक विभाग'), path: '/services' },
                  { name: t('OPD Appointments', 'అపాయింట్‌మెంట్లు', 'अपॉइंटमेंट'), path: '/contact' },
                ].map((item) => (
                  <li key={item.path}>
                    <Link 
                      href={item.path} 
                      className="text-stone-600 hover:text-[#0a2e22] transition-all text-sm flex items-center gap-2 group"
                    >
                      <ChevronRight size={13} className="text-[#9b7745] opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                      <span className="group-hover:translate-x-0.5 transition-transform">{item.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3 (3 cols): Clinical Specialties */}
            <div className="lg:col-span-3 space-y-5">
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#9b7745] block">
                  Excellence
                </span>
                <h3 className="text-lg font-serif font-bold text-[#0a2e22] tracking-wide">
                  {t('Specialties', 'విభాగాలు', 'विशिष्टताएं')}
                </h3>
              </div>

              <ul className="space-y-3">
                {serviceCategories.slice(0, 6).map((cat) => (
                  <li key={cat.id}>
                    <Link 
                      href={`/services/${cat.id}`} 
                      className="text-stone-600 hover:text-[#0a2e22] transition-all text-sm flex items-start gap-2 group"
                    >
                      <ChevronRight size={13} className="text-[#9b7745] opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all mt-1 shrink-0" />
                      <span className="group-hover:translate-x-0.5 transition-transform">
                        {t(cat.name, cat.teluguName, cat.hindiName)}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4 (3 cols): Campus Location & Direct Contact Dossier */}
            <div className="lg:col-span-3 space-y-5">
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#9b7745] block">
                  24/7 Access
                </span>
                <h3 className="text-lg font-serif font-bold text-[#0a2e22] tracking-wide">
                  {t('Campus & Contact', 'క్యాంపస్ & సంప్రదింపులు', 'परिसर एवं संपर्क')}
                </h3>
              </div>

              <div className="space-y-4 text-sm">
                
                {/* Physical Location */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-stone-900 font-bold text-xs uppercase tracking-wider">
                    <MapPin size={15} className="text-[#9b7745] shrink-0" />
                    <span>{t('Hospital Campus', 'హాస్పిటల్ చిరునామా', 'अस्पताल परिसर')}</span>
                  </div>
                  <p className="text-stone-600 leading-relaxed text-xs pl-6">
                    {settings?.address || t(contactInfo.address, contactInfo.teluguAddress, contactInfo.hindiAddress)}
                  </p>
                  <div className="pl-6 pt-0.5">
                    <a 
                      href={settings?.googleMapsUrl || "https://maps.google.com/?q=Dhruva+Hospitals+Kadapa"} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-flex items-center gap-1.5 text-[#0a2e22] hover:text-[#9b7745] text-xs font-bold transition-colors group"
                    >
                      <Navigation size={12} className="group-hover:translate-x-0.5 transition-transform text-[#9b7745]" />
                      <span>Get Directions on Google Maps →</span>
                    </a>
                  </div>
                </div>

                {/* Direct Helplines */}
                <div className="space-y-1.5 pt-2 border-t border-stone-200">
                  <div className="flex items-center gap-2 text-stone-900 font-bold text-xs uppercase tracking-wider">
                    <Phone size={15} className="text-[#9b7745] shrink-0" />
                    <span>{t('Direct Helplines', 'ఫోన్ నంబర్లు', 'सीधे फोन नंबर')}</span>
                  </div>
                  <div className="space-y-1 font-mono text-xs pl-6">
                    <a href={`tel:${(settings?.casualtyPhone || '08562-318419').replace(/\D/g, '')}`} className="block text-[#0a2e22] hover:text-[#9b7745] transition-colors font-bold">
                      Casualty: {settings?.casualtyPhone || '08562–318419'}
                    </a>
                    <a href={`tel:${(settings?.primaryPhone || '9036852311').replace(/\D/g, '')}`} className="block text-[#0a2e22] hover:text-[#9b7745] transition-colors font-bold">
                      Mobile & ICU: {settings?.primaryPhone || '9036852311'}
                    </a>
                  </div>
                </div>

                {/* OPD Timings & Email */}
                <div className="space-y-1 pt-2 border-t border-stone-200 text-xs text-stone-600 pl-6">
                  <div className="flex items-center gap-2 -ml-6 text-stone-900 font-bold uppercase tracking-wider">
                    <Clock size={15} className="text-[#9b7745] shrink-0" />
                    <span>Working Hours</span>
                  </div>
                  <p className="text-[11px] text-stone-600">
                    {settings?.opdTimings || 'OPD: Mon – Sat: 9:00 AM – 9:00 PM • Emergency: 24 Hours'}
                  </p>
                  <a href={`mailto:${settings?.email || contactInfo.email}`} className="inline-flex items-center gap-1.5 text-stone-600 hover:text-[#0a2e22] transition-colors pt-1">
                    <Mail size={13} className="text-[#9b7745]" />
                    <span>{settings?.email || contactInfo.email}</span>
                  </a>
                </div>

              </div>
            </div>

          </div>

          {/* ─── 3. INSTITUTIONAL QUALITY & GOVERNANCE PILLARS ─── */}
          <div className="py-8 grid grid-cols-1 md:grid-cols-3 gap-6 border-b border-stone-200">
            <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#0a2e22] shrink-0">
                <CheckCircle2 size={22} className="text-[#9b7745]" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#0a2e22] tracking-wide">
                  {t('NABH-Aligned Standards', 'NABH-ఆధారిత నాణ్యతా ప్రమాణాలు', 'एनएबीएच-संरेखित मानक')}
                </p>
                <p className="text-xs text-stone-500">Strict clinical governance & sterile OT hygiene</p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#0a2e22] shrink-0">
                <HeartPulse size={22} className="text-[#9b7745]" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#0a2e22] tracking-wide">
                  {t('Level-III Advanced NICU', 'లెవల్-3 అత్యాధునిక NICU', 'स्तर-3 उन्नत एनआईसीयू')}
                </p>
                <p className="text-xs text-stone-500">German incubators & round-the-clock neonatologists</p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#0a2e22] shrink-0">
                <Clock size={22} className="text-[#9b7745]" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#0a2e22] tracking-wide">
                  {t('24/7 Casualty & In-House Pharmacy', '24/7 ఎమర్జెన్సీ & ఫార్మసీ', '24/7 आपातकालीन एवं फार्मेसी')}
                </p>
                <p className="text-xs text-stone-500">Round-the-clock emergency medical response</p>
              </div>
            </div>
          </div>

          {/* ─── 4. LEGAL COMPLIANCE & ATTRIBUTION BAR ─── */}
          <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-stone-500">
            <div className="space-y-0.5 text-center sm:text-left">
              <p>© {currentYear} Dhruva Hospitals, Kadapa. All rights reserved.</p>
              <p className="text-[11px] text-stone-500">
                Pioneering Tertiary Fertility, Obstetrics & Neonatal Care for families across Rayalaseema.
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs text-stone-500">
              <Link href="/privacy" className="hover:text-stone-900 transition-colors">Privacy Policy</Link>
              <span>•</span>
              <Link href="/terms" className="hover:text-stone-900 transition-colors">Terms of Service</Link>
              <span>•</span>
              <Link href="/contact" className="hover:text-stone-900 transition-colors">Emergency Triage</Link>
              <span>•</span>
              <Link href="/admin" className="hover:text-[#9b7745] font-semibold transition-colors flex items-center gap-1">
                <span>Staff Portal</span>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}
