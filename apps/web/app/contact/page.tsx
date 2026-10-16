'use client';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { 
  Phone, Mail, MapPin, Clock, Send, ChevronDown, 
  MessageCircle, ExternalLink, Headphones, ShieldCheck,
  User, Stethoscope, Calendar, UserCheck, Navigation,
  AlertCircle, CheckCircle2
} from 'lucide-react';
import { contactInfo } from '@/lib/data';
import { useLanguage } from '@/context/LanguageContext';
import { useSettings } from '@/context/SettingsContext';

export default function ContactPage() {
  const { lang, t } = useLanguage();
  const { settings } = useSettings();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    service: 'General Consultation Inquiry',
    doctor: 'Available Senior Consultant on Duty',
    date: new Date().toISOString().split('T')[0],
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedName = formData.name.trim();
    const trimmedPhone = formData.phone.trim();

    if (!trimmedName) {
      toast.error(t('Please enter your full name.', 'దయచేసి మీ పూర్తి పేరును నమోదు చేయండి.', 'कृपया अपना पूरा नाम दर्ज करें।'));
      return;
    }

    if (!/^[6-9]\d{9}$/.test(trimmedPhone)) {
      toast.error(t('Please enter a valid 10-digit Indian mobile number.', 'దయచేసి సరైన 10 అంకెల మొబైల్ నంబర్‌ను నమోదు చేయండి.', 'कृपया 10 अंकों का वैध भारतीय मोबाइल नंबर दर्ज करें।'));
      return;
    }

    setIsSubmitting(true);

    // Construct professional WhatsApp formatted message
    const whatsappText = 
      `🏥 *DHRUVA HOSPITALS, KADAPA*\n` +
      `📋 *Clinical Inquiry & Consultation Request*\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `👤 *Patient/Attendant:* ${trimmedName}\n` +
      `📞 *Mobile Number:* +91 ${trimmedPhone}\n` +
      `🩺 *Department:* ${formData.service}\n` +
      `👨‍⚕️ *Consulting Specialist:* ${formData.doctor}\n` +
      `📅 *Preferred Date:* ${formData.date}\n` +
      (formData.message.trim() ? `💬 *Clinical Note:* ${formData.message.trim()}\n` : '') +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `_Sent via Dhruva Hospitals Official Patient Desk_`;

    const targetWhatsapp = (settings?.whatsappNumber || contactInfo.whatsapp).replace(/\D/g, '');
    const whatsappUrl = `https://wa.me/${targetWhatsapp}?text=${encodeURIComponent(whatsappText)}`;

    // 1. Immediately launch WhatsApp
    const openedWindow = window.open(whatsappUrl, '_blank');
    if (!openedWindow || openedWindow.closed || typeof openedWindow.closed === 'undefined') {
      window.location.href = whatsappUrl;
    }

    const activeWhatsapp = (settings?.whatsappNumber || contactInfo.whatsapp).replace(/\D/g, '');
    toast.success(t(
      `Connecting to Dhruva Hospitals WhatsApp (+${activeWhatsapp})...`,
      `ధృవ హాస్పిటల్స్ వాట్సాప్ (+${activeWhatsapp}) కు కనెక్ట్ అవుతోంది...`,
      `ध्रुव हॉस्पिटल्स व्हाट्सएप (+${activeWhatsapp}) से जोड़ा जा रहा है...`
    ));

    // 2. Asynchronously save inquiry to internal appointments system/Excel
    fetch('/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: trimmedName,
        phone: trimmedPhone,
        service: formData.service,
        doctor: formData.doctor,
        date: formData.date,
        message: formData.message.trim() || 'Direct WhatsApp Clinical Submission',
      }),
    }).catch((err) => {
      console.error('Error logging appointment:', err);
    }).finally(() => {
      setIsSubmitting(false);
    });
  };

  return (
    <div className="flex flex-col bg-[#fcfdfd]">
      
      {/* ─── 1. LUMINOUS INSTITUTIONAL HERO ─── */}
      <section className="relative pt-36 pb-20 lg:pt-40 lg:pb-24 bg-gradient-to-b from-[#f8faf9] via-white to-[#f4f7f5] text-stone-900 border-b border-stone-200 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#0a2e22_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.03] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full text-[#0a2e22] text-xs font-mono font-bold uppercase tracking-wider">
              <Headphones size={14} className="text-[#9b7745]" />
              <span>{t('24/7 Patient Care Desk & Casualty', '24/7 రోగి సహాయ కేంద్రం & అత్యవసర విభాగం', '24/7 रोगी सहायता एवं आपातकालीन डेस्क')}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-[#0a2e22] tracking-tight leading-[1.15]">
              {t('Connect with Dhruva Hospitals.', 'ధృవ హాస్పిటల్స్‌ను సంప్రదించండి.', 'ध्रुव हॉस्पिटल्स से संपर्क करें।')}
            </h1>

            <p className="text-base sm:text-lg text-stone-600 leading-relaxed font-normal max-w-2xl mx-auto">
              {t(
                'Direct access to senior clinical consultants, 24/7 newborn critical care (Level-3 NICU), and immediate patient assistance at Dwaraka Nagar, Kadapa.',
                'కడప ద్వారకా నగర్‌లో సీనియర్ వైద్య నిపుణులు, 24/7 నవజాత శిశు క్రిటికల్ కేర్ (లెవల్-3 NICU) మరియు తక్షణ రోగి సహాయ సేవలు.',
                'कडप्पा के द्वारका नगर में वरिष्ठ चिकित्सकों, 24/7 नवजात क्रिटिकल केयर (लेवल-3 एनआईसीयू) और तत्काल रोगी सहायता के लिए संपर्क करें।'
              )}
            </p>
          </div>
        </div>
      </section>

      {/* ─── 2. MAIN CLINICAL CONTACT & INQUIRY GRID ─── */}
      <section className="py-16 lg:py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            {/* ─── LEFT COLUMN: INSTITUTIONAL CONTACT DOSSIER (5 COLS) ─── */}
            <div className="lg:col-span-5 space-y-8">
              
              <div className="space-y-2">
                <span className="text-[11px] font-mono font-bold uppercase tracking-[0.2em] text-[#9b7745] block">
                  {t('Direct Access Channels', 'నేరుగా సంప్రదించే మార్గాలు', 'सीधे संपर्क के माध्यम')}
                </span>
                <h2 className="text-3xl font-serif font-bold text-[#0a2e22] tracking-tight">
                  {t('Contact Information', 'సంప్రదింపు సమాచారం', 'संपर्क विवरण')}
                </h2>
                <p className="text-stone-600 text-sm leading-relaxed">
                  {t(
                    'Reach our clinical teams round-the-clock for emergencies or schedule an OPD consultation during hospital hours.',
                    'అత్యవసర సేవల కోసం 24 గంటలూ లేదా ఓపీడీ కన్సల్టేషన్ల కోసం హాస్పిటల్ పని వేళల్లో సంప్రదించండి.',
                    'आपात स्थिति के लिए 24 घंटे या ओपीडी परामर्श के लिए अस्पताल के समय के दौरान संपर्क करें।'
                  )}
                </p>
              </div>

              {/* Dossier Cards List */}
              <div className="space-y-4">
                
                {/* 1. Physical Location Card */}
                <div className="p-5 sm:p-6 rounded-2xl bg-white border border-stone-200/90 shadow-sm hover:border-[#0a2e22]/30 transition-all group">
                  <div className="flex gap-4 items-start">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200/80 text-[#0a2e22] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <MapPin size={22} className="text-[#9b7745]" />
                    </div>
                    <div className="space-y-1.5 flex-1">
                      <h3 className="text-sm font-serif font-bold text-[#0a2e22]">
                        {t('Hospital Campus & Address', 'హాస్పిటల్ చిరునామా', 'अस्पताल परिसर एवं पता')}
                      </h3>
                      <p className="text-stone-700 text-xs sm:text-sm leading-relaxed">
                        {settings?.address || t(contactInfo.address, contactInfo.teluguAddress, contactInfo.hindiAddress)}
                      </p>
                      <p className="text-[11px] text-[#9b7745] font-semibold">
                        {settings?.landmark || t(contactInfo.landmark, 'రైతు బజార్ ప్రక్కన, సంధ్యా సర్కిల్, కడప RTC బస్ స్టాండ్ సమీపంలో', 'रायथू बाजार के पास, संध्या सर्किल, आरटीसी बस स्टैंड के निकट')}
                      </p>
                      <div className="pt-2">
                        <a 
                          href={settings?.googleMapsUrl || "https://maps.google.com/?q=Dhruva+Hospitals+Kadapa"} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0a2e22] hover:text-[#9b7745] transition-colors"
                        >
                          <Navigation size={13} className="text-[#9b7745]" />
                          <span>{t('Open in Google Maps →', 'గూగుల్ మ్యాప్స్‌లో చూడండి →', 'गूगल मैप्स पर देखें →')}</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Emergency Helplines Card */}
                <div className="p-5 sm:p-6 rounded-2xl bg-white border border-stone-200/90 shadow-sm hover:border-red-300 transition-all group">
                  <div className="flex gap-4 items-start">
                    <div className="w-12 h-12 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <Phone size={22} className="text-red-600" />
                    </div>
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-serif font-bold text-[#0a2e22]">
                          {t('24/7 Casualty & Helplines', '24/7 అత్యవసర నంబర్లు', '24/7 आपातकालीन नंबर')}
                        </h3>
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-50 border border-red-200 text-[10px] font-mono font-bold text-red-700 uppercase">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
                          24/7 Live
                        </span>
                      </div>
                      <div className="space-y-1 font-mono text-xs sm:text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-stone-500 text-xs">Casualty Hotline:</span>
                          <a href={`tel:${(settings?.casualtyPhone || '08562318419').replace(/\D/g, '')}`} className="font-bold text-[#0a2e22] hover:text-red-700 transition-colors">
                            {settings?.casualtyPhone || '08562–318419'}
                          </a>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-stone-500 text-xs">Mobile & ICU:</span>
                          <a href={`tel:${(settings?.primaryPhone || '9036852311').replace(/\D/g, '')}`} className="font-bold text-[#0a2e22] hover:text-red-700 transition-colors">
                            {settings?.primaryPhone || '9036852311'}
                          </a>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-stone-500 text-xs">Emergency Desk:</span>
                          <a href={`tel:${(settings?.secondaryPhone || '8008508384').replace(/\D/g, '')}`} className="font-bold text-[#0a2e22] hover:text-red-700 transition-colors">
                            {settings?.secondaryPhone || '8008508384'}
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Working Hours Card */}
                <div className="p-5 sm:p-6 rounded-2xl bg-white border border-stone-200/90 shadow-sm hover:border-[#0a2e22]/30 transition-all group">
                  <div className="flex gap-4 items-start">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200/80 text-[#0a2e22] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <Clock size={22} className="text-[#9b7745]" />
                    </div>
                    <div className="space-y-1 flex-1">
                      <h3 className="text-sm font-serif font-bold text-[#0a2e22]">
                        {t('Clinical Operating Hours', 'క్లినికల్ పని వేళలు', 'नैदानिक ​​कार्य समय')}
                      </h3>
                      <div className="space-y-1 text-xs sm:text-sm text-stone-700 pt-0.5">
                        <div className="flex justify-between">
                          <span className="text-stone-500">OPD Consultations:</span>
                          <span className="font-semibold text-stone-900">{settings?.opdTimings || 'Mon – Sat: 9:00 AM – 8:00 PM'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-stone-500">Casualty & Labour OT:</span>
                          <span className="font-bold text-[#0a2e22]">24 Hours Round-the-Clock</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-stone-500">Level-III NICU Unit:</span>
                          <span className="font-bold text-[#0a2e22]">24 Hours Continuous Care</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4. Official Email Card */}
                <div className="p-5 sm:p-6 rounded-2xl bg-white border border-stone-200/90 shadow-sm hover:border-[#0a2e22]/30 transition-all group">
                  <div className="flex gap-4 items-start">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200/80 text-[#0a2e22] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <Mail size={22} className="text-[#9b7745]" />
                    </div>
                    <div className="space-y-1 flex-1">
                      <h3 className="text-sm font-serif font-bold text-[#0a2e22]">
                        {t('Patient Concierge Email', 'పేషెంట్ కేర్ ఇమెయిల్', 'रोगी सहायता ईमेल')}
                      </h3>
                      <a 
                        href={`mailto:${settings?.email || contactInfo.email}`}
                        className="block font-medium text-xs sm:text-sm text-[#0a2e22] hover:text-[#9b7745] transition-colors"
                      >
                        {settings?.email || contactInfo.email}
                      </a>
                      <p className="text-[11px] text-stone-500">
                        {t('Inquiries addressed within 24 business hours', '24 పని గంటలలోపు స్పందన', '24 कार्य घंटों के भीतर उत्तर')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 5. Verified WhatsApp Patient Care Card */}
                <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200 shadow-sm space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#25D366] text-white flex items-center justify-center shadow-sm">
                      <MessageCircle size={22} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#0a2e22]">
                        {t('Direct WhatsApp Assistance', 'వాట్సాప్ ద్వారా తక్షణ సహాయం', 'व्हाट्सएप पर सीधी सहायता')}
                      </h4>
                      <p className="text-xs text-stone-600">
                        {t('Fast appointment scheduling & report inquiries', 'త్వరిత అపాయింట్‌మెంట్లు & రిపోర్ట్‌ల వివరాలు', 'त्वरित अपॉइंटमेंट और रिपोर्ट पूछताछ')}
                      </p>
                    </div>
                  </div>
                  <a 
                    href={`https://wa.me/${(settings?.whatsappNumber || contactInfo.whatsapp).replace(/\D/g, '')}?text=Hello%20Dhruva%20Hospitals,%20I%20would%20like%20to%20inquire%20about%20a%20consultation.`}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full py-3 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 text-xs uppercase tracking-wider group"
                  >
                    <MessageCircle size={16} />
                    <span>{t('Chat with Patient Coordinator', 'వాట్సాప్‌లో సంప్రదించండి', 'व्हाट्सएप पर बात करें')}</span>
                    <ExternalLink size={13} className="group-hover:translate-x-0.5 transition-transform" />
                  </a>
                </div>

              </div>
            </div>

            {/* ─── RIGHT COLUMN: THE PERFECT CLINICAL INQUIRY FORM (7 COLS) ─── */}
            <div className="lg:col-span-7">
              <div className="bg-white rounded-3xl p-8 sm:p-12 border border-stone-200 shadow-xl shadow-stone-200/50 relative overflow-hidden">
                
                {/* Executive Architectural Gold Accent Bar */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#0a2e22] via-[#9b7745] to-[#0a2e22]" />

                <div className="space-y-8 relative z-10">
                  
                  {/* Form Header */}
                  <div className="space-y-2 border-b border-stone-100 pb-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[#0a2e22] text-[11px] font-mono font-bold uppercase tracking-wider">
                      <Stethoscope size={13} className="text-[#9b7745]" />
                      <span>{t('Patient Desk & Inquiry', 'రోగి విచారణ విభాగం', 'रोगी पूछताछ डेस्क')}</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#0a2e22] tracking-tight">
                      {t('Send a Message or Consultation Request', 'సందేశం లేదా అపాయింట్‌మెంట్ అభ్యర్థన పంపండి', 'संदेश या परामर्श अनुरोध भेजें')}
                    </h2>
                    <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
                      {t(
                        'Fill out the clinical form below. Our coordination desk will review your details and reach out to confirm your visit.',
                        'దిగువ ఫారమ్‌ను పూరించండి. మా పేషెంట్ కోఆర్డినేషన్ బృందం మీ వివరాలను పరిశీలించి త్వరలోనే సంప్రదిస్తుంది.',
                        'नीचे दिया गया फॉर्म भरें। हमारी समन्वय टीम आपकी जानकारी की समीक्षा कर पुष्टि के लिए संपर्क करेगी।'
                      )}
                    </p>
                  </div>

                  {/* Form Element */}
                  <form onSubmit={handleSubmit} className="space-y-6">
                    
                    {/* Row 1: Name & Phone */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      
                      {/* Full Name */}
                      <div className="space-y-2">
                        <label className="block text-xs font-mono font-bold uppercase tracking-wider text-stone-700">
                          {t('Patient / Attendant Name', 'రోగి / సంరక్షకుడి పేరు', 'रोगी / परिचारक का नाम')} <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none">
                            <User size={17} />
                          </div>
                          <input 
                            required
                            type="text" 
                            placeholder={t('e.g. Ramesh Kumar', 'ఉదా. రమేష్ కుమార్', 'उदा. रमेश कुमार')} 
                            className="w-full pl-11 pr-4 py-3.5 bg-stone-50/80 border border-stone-300 rounded-xl text-stone-900 text-sm font-medium placeholder:text-stone-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0a2e22]/15 focus:border-[#0a2e22] transition-all"
                            value={formData.name}
                            maxLength={50}
                            onChange={e => {
                              const val = e.target.value.replace(/[0-9]/g, '');
                              setFormData({ ...formData, name: val });
                            }}
                          />
                        </div>
                      </div>

                      {/* Phone Number */}
                      <div className="space-y-2">
                        <label className="block text-xs font-mono font-bold uppercase tracking-wider text-stone-700">
                          {t('Mobile Number', 'మొబైల్ నంబర్', 'मोबाइल नंबर')} <span className="text-red-500">*</span>
                        </label>
                        <div className="relative flex">
                          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none flex items-center gap-1">
                            <Phone size={15} />
                            <span className="text-xs font-mono font-bold text-stone-600 pl-1 border-r border-stone-300 pr-2">+91</span>
                          </div>
                          <input 
                            required
                            type="tel" 
                            placeholder="98765 43210" 
                            className="w-full pl-20 pr-4 py-3.5 bg-stone-50/80 border border-stone-300 rounded-xl text-stone-900 text-sm font-mono font-medium placeholder:text-stone-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0a2e22]/15 focus:border-[#0a2e22] transition-all"
                            value={formData.phone}
                            maxLength={10}
                            onChange={e => {
                              const val = e.target.value.replace(/\D/g, '');
                              setFormData({ ...formData, phone: val });
                            }}
                          />
                        </div>
                      </div>

                    </div>

                    {/* Row 2: Specialty / Reason for Inquiry */}
                    <div className="space-y-2">
                      <label className="block text-xs font-mono font-bold uppercase tracking-wider text-stone-700">
                        {t('Clinical Department / Purpose', 'విభాగం / విచారణ కారణం', 'चिकित्सा विभाग / पूछताछ का कारण')} <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none">
                          <Stethoscope size={17} />
                        </div>
                        <select 
                          required
                          className="w-full pl-11 pr-10 py-3.5 bg-stone-50/80 border border-stone-300 rounded-xl text-stone-900 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0a2e22]/15 focus:border-[#0a2e22] transition-all appearance-none cursor-pointer"
                          value={formData.service}
                          onChange={e => setFormData({ ...formData, service: e.target.value })}
                        >
                          <option value="General Consultation Inquiry">{t('General Consultation Inquiry', 'సాధారణ సంప్రదింపు విచారణ', 'सामान्य परामर्श पूछताछ')}</option>
                          <option value="Neonatal & Paediatric Care (Level-3 NICU)">{t('Neonatal & Paediatric Care (Level-3 NICU)', 'నవజాత శిశు & పీడియాట్రిక్ కేర్ (లెవల్-3 NICU)', 'नवजात एवं बाल रोग (स्तर-3 एनआईसीयू)')}</option>
                          <option value="Advanced Infertility & IVF / ICSI">{t('Advanced Infertility & IVF / ICSI', 'అధునాతన సంతానలేమి & IVF / ICSI', 'उन्नत प्रजनन एवं आईवीएफ')}</option>
                          <option value="High-Risk Pregnancy & Maternity Care">{t('High-Risk Pregnancy & Maternity Care', 'హై-రిస్క్ ప్రెగ్నెన్సీ & ప్రసూతి సంరక్షణ', 'उच्च जोखिम गर्भावस्था एवं मातृत्व')}</option>
                          <option value="Minimally Invasive Laparoscopic Surgery">{t('Minimally Invasive Laparoscopic Surgery', 'లాపరోస్కోపిక్ సర్జరీ', 'लेप्रोस्कोपिक सर्जरी')}</option>
                          <option value="Emergency Casualty & Ambulance Triage">{t('Emergency Casualty & Ambulance Triage', 'అత్యవసర క్యాజువాలిటీ & అంబులెన్స్', 'आपातकालीन कैजुअल्टी एवं एम्बुलेंस')}</option>
                        </select>
                        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none">
                          <ChevronDown size={16} />
                        </div>
                      </div>
                    </div>

                    {/* Row 3: Consulting Specialist & Preferred Date */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      
                      {/* Doctor Selection */}
                      <div className="space-y-2">
                        <label className="block text-xs font-mono font-bold uppercase tracking-wider text-stone-700">
                          {t('Consulting Specialist', 'వైద్య నిపుణులు', 'परामर्श विशेषज्ञ')} <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none">
                            <UserCheck size={17} />
                          </div>
                          <select 
                            required
                            className="w-full pl-11 pr-10 py-3.5 bg-stone-50/80 border border-stone-300 rounded-xl text-stone-900 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0a2e22]/15 focus:border-[#0a2e22] transition-all appearance-none cursor-pointer"
                            value={formData.doctor}
                            onChange={e => setFormData({ ...formData, doctor: e.target.value })}
                          >
                            <option value="Available Senior Consultant on Duty">{t('Available Senior Consultant on Duty', 'అందుబాటులో ఉన్న సీనియర్ కన్సల్టెంట్', 'ड्यूटी पर उपलब्ध वरिष्ठ सलाहकार')}</option>
                            <option value="Dr. Sudarshan Reddy K (Founder & Neonatologist)">Dr. Sudarshan Reddy K (Founder & Neonatologist)</option>
                            <option value="Dr. S Mounika Reddy (Director • IVF & Laparoscopy)">Dr. S Mounika Reddy (Director • IVF & Laparoscopy)</option>
                            <option value="Dr. B Surya (Physician & Diabetologist)">Dr. B Surya (Physician & Diabetologist)</option>
                            <option value="Dr. M Vinay Kumar (General & Laser Surgeon)">Dr. M Vinay Kumar (General & Laser Surgeon)</option>
                          </select>
                          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none">
                            <ChevronDown size={16} />
                          </div>
                        </div>
                      </div>

                      {/* Date Selection */}
                      <div className="space-y-2">
                        <label className="block text-xs font-mono font-bold uppercase tracking-wider text-stone-700">
                          {t('Preferred Date', 'ఇష్టపడే తేదీ', 'पसंदीदा तारीख')} <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none">
                            <Calendar size={17} />
                          </div>
                          <input 
                            required
                            type="date" 
                            min={new Date().toISOString().split('T')[0]}
                            className="w-full pl-11 pr-4 py-3.5 bg-stone-50/80 border border-stone-300 rounded-xl text-stone-900 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0a2e22]/15 focus:border-[#0a2e22] transition-all"
                            value={formData.date}
                            onChange={e => setFormData({ ...formData, date: e.target.value })}
                          />
                        </div>
                      </div>

                    </div>

                    {/* Row 4: Message / Clinical Concern */}
                    <div className="space-y-2">
                      <label className="block text-xs font-mono font-bold uppercase tracking-wider text-stone-700">
                        {t('Clinical Concern / Message', 'సందేశం / వివరణ', 'चिकित्सीय विवरण / संदेश')}
                      </label>
                      <textarea 
                        rows={4} 
                        placeholder={t(
                          'Describe symptoms, medical history, or timing requirements...',
                          'లక్షణాలు, మునుపటి వైద్య చరిత్ర లేదా సమయ వివరాలను ఇక్కడ వివరించండి...',
                          'लक्षण, पूर्व चिकित्सा इतिहास या समय संबंधी विवरण यहां साझा करें...'
                        )} 
                        className="w-full p-4 bg-stone-50/80 border border-stone-300 rounded-xl text-stone-900 text-sm font-medium placeholder:text-stone-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0a2e22]/15 focus:border-[#0a2e22] transition-all resize-none"
                        value={formData.message}
                        onChange={e => setFormData({ ...formData, message: e.target.value })}
                      />
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2 space-y-3">
                      <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="w-full py-4.5 bg-[#0a2e22] hover:bg-[#134937] text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-3 text-sm sm:text-base uppercase tracking-wider group disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                      >
                        {isSubmitting ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>{t('Opening WhatsApp...', 'వాట్సాప్‌కు కనెక్ట్ అవుతోంది...', 'व्हाट्सएप से जोड़ा जा रहा है...')}</span>
                          </div>
                        ) : (
                          <>
                            <div className="w-6 h-6 rounded-lg bg-[#25D366] text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-110 transition-transform">
                              <MessageCircle size={15} className="fill-white" />
                            </div>
                            <span>{t('Submit Clinical Inquiry via WhatsApp', 'వాట్సాప్ ద్వారా విచారణ పంపండి', 'व्हाट्सएप के माध्यम से पूछताछ भेजें')}</span>
                            <Send size={16} className="text-[#c5a880] group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform" />
                          </>
                        )}
                      </button>

                      {/* Direct WhatsApp Notice */}
                      <div className="flex items-center justify-center gap-2 text-xs text-emerald-900 bg-emerald-50/90 border border-emerald-200/80 py-2.5 px-3 rounded-xl text-center">
                        <MessageCircle size={14} className="text-[#25D366] shrink-0" />
                        <span>
                          {t(
                            `Your inquiry is pre-filled and sent directly to Hospital WhatsApp (+${(settings?.whatsappNumber || '919036852311').replace(/\D/g, '')}).`,
                            `మీ వివరాలు ఆటోమేటిక్‌గా హాస్పిటల్ వాట్సాప్ (+${(settings?.whatsappNumber || '919036852311').replace(/\D/g, '')}) కు పంపబడతాయి.`,
                            `आपकी पूछताछ सीधे अस्पताल के व्हाट्सएप (+${(settings?.whatsappNumber || '919036852311').replace(/\D/g, '')}) पर भेजी जाएगी।`
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Patient Privacy Reassurance */}
                    <div className="flex items-center justify-center gap-2 text-xs text-stone-500 pt-1 text-center">
                      <ShieldCheck size={15} className="text-[#9b7745] shrink-0" />
                      <span>
                        {t(
                          'Your medical inquiry is encrypted & strictly confidential under clinical privacy protocols.',
                          'మీ వైద్య సమాచారం అత్యంత గోప్యంగా ఉంచబడుతుంది.',
                          'आपकी चिकित्सा जानकारी नैदानिक ​​गोपनीयता प्रोटोकॉल के तहत सुरक्षित है।'
                        )}
                      </span>
                    </div>

                  </form>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─── 3. INTERACTIVE CAMPUS MAP & DIRECTIONS ─── */}
      <section className="relative w-full h-[520px] bg-stone-100 border-t border-stone-200 overflow-hidden">
        <iframe
          src={contactInfo.mapUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen={true}
          loading="lazy"
          title="Dhruva Hospitals Kadapa Campus Location"
          className="w-full h-full filter contrast-105"
        />
        
        {/* Floating Executive Direction Badge */}
        <div className="absolute top-6 left-6 z-20 max-w-sm hidden sm:block">
          <div className="bg-white/95 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-stone-200 space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#9b7745]">
              <Navigation size={14} className="text-[#9b7745]" />
              <span>Hospital Landmark</span>
            </div>
            <div>
              <h3 className="font-serif font-bold text-[#0a2e22] text-lg">
                Dhruva Hospitals Campus
              </h3>
              <p className="text-stone-600 text-xs leading-relaxed mt-1">
                Opposite Sandhya Circle, Adjacent to Rythu Bazar, Dwaraka Nagar, Kadapa. 
                Immediate triage entrance accessible 24/7.
              </p>
            </div>
            <div className="pt-1">
              <a 
                href="https://maps.google.com/?q=Dhruva+Hospitals+Kadapa" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0a2e22] hover:bg-[#134937] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-sm group"
              >
                <span>Navigate on Google Maps</span>
                <ExternalLink size={13} className="text-[#c5a880] group-hover:translate-x-0.5 transition-transform" />
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
