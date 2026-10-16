'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowRight, ChevronRight, Calendar, User, Phone, 
  CheckCircle2, Star, Clock, Award,
  MapPin, Stethoscope, HeartHandshake, Baby,
  MessageCircle, Maximize2, X
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useLanguage } from '@/context/LanguageContext';
import { 
  serviceCategories, hospitalFeatures, 
  contactInfo, testimonials, stats 
} from '@/lib/data';
import { useDynamicDoctors } from '@/lib/useDynamicDoctors';
import VirtualTourSequence from '@/components/VirtualTourSequence';
import AppointmentModal from '@/components/AppointmentModal';
import { useSettings } from '@/context/SettingsContext';

export default function HomePage() {
  const { lang, t } = useLanguage();
  const { settings } = useSettings();
  const { doctors } = useDynamicDoctors();

  // Modal State for full appointment booking & 4K Image Lightbox
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<string | undefined>(undefined);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | undefined>(undefined);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | undefined>(undefined);
  const [selectedProfilePic, setSelectedProfilePic] = useState<string | undefined>(undefined);
  const [selectedService, setSelectedService] = useState<string | undefined>(undefined);

  // Auto-reopen verification modal if user refreshed the page during OTP verification
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const saved = sessionStorage.getItem('mscurechain_active_otp_session');
      if (saved) {
        const data = JSON.parse(saved);
        if (data && data.step === 'otp' && data.phone) {
          setIsModalOpen(true);
          if (data.selectedDoctorName) setSelectedDoctor(data.selectedDoctorName);
          if (data.selectedDoctorId) setSelectedDoctorId(data.selectedDoctorId);
          if (data.selectedSpecialty) setSelectedSpecialty(data.selectedSpecialty);
          if (data.selectedPic) setSelectedProfilePic(data.selectedPic);
        }
      }
    } catch (e) {}
  }, []);

  const openBookingForService = (serviceName?: string) => {
    setSelectedService(serviceName);
    setSelectedDoctor(undefined);
    setSelectedDoctorId(undefined);
    setSelectedSpecialty(undefined);
    setSelectedProfilePic(undefined);
    setIsModalOpen(true);
  };

  const openBookingForDoctor = (doc: { id?: string; name: string; specialization?: string; image?: string }) => {
    setSelectedDoctor(doc.name);
    setSelectedDoctorId(doc.id);
    setSelectedSpecialty(doc.specialization);
    setSelectedProfilePic(doc.image);
    setSelectedService(undefined);
    setIsModalOpen(true);
  };

  // Quick Lead Form State in Hero
  const [leadForm, setLeadForm] = useState({
    name: '',
    phone: '',
    department: '',
    doctor: '',
    date: '',
  });
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!leadForm.name.trim()) {
      toast.error(t('Please enter patient name.', 'దయచేసి రోగి పేరు నమోదు చేయండి.', 'कृपया मरीज का नाम दर्ज करें।'));
      return;
    }

    if (!/^[6-9]\d{9}$/.test(leadForm.phone)) {
      toast.error(t('Please enter a valid 10-digit Indian mobile number.', 'దయచేసి సరైన 10 అంకెల మొబైల్ నంబర్ నమోదు చేయండి.', 'कृपया एक वैध 10-अंकीय मोबाइल नंबर दर्ज करें।'));
      return;
    }

    setIsSubmittingLead(true);
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: leadForm.name.trim(),
          phone: leadForm.phone.trim(),
          service: leadForm.department || 'General Consultation',
          doctor: leadForm.doctor || 'Any Specialist',
          date: leadForm.date || new Date().toISOString().split('T')[0],
          message: 'Fast Consultation Request from Homepage Hero',
        }),
      });

      if (res.ok) {
        toast.success(
          t(
            'Consultation requested! Our Dhruva Care Team will call you within 15 minutes.',
            'కన్సల్టేషన్ అభ్యర్థించబడింది! ధృవ కేర్ టీమ్ 15 నిమిషాల్లో మీకు కాల్ చేస్తుంది.',
            'परामर्श का अनुरोध किया गया! हमारी टीम 15 मिनट में आपसे संपर्क करेगी।'
          )
        );
        // Reset form
        setLeadForm({ name: '', phone: '', department: '', doctor: '', date: '' });
      } else {
        throw new Error();
      }
    } catch {
      toast.error(
        t(
          'Could not submit directly. Please call our 24/7 emergency line: 08562-318419.',
          'దయచేసి మా 24/7 అత్యవసర నంబర్‌కు కాల్ చేయండి: 08562-318419.',
          'कृपया सीधे सबमिट नहीं किया जा सका। हमारी 24/7 आपातकालीन लाइन पर कॉल करें: 08562-318419.'
        )
      );
    } finally {
      setIsSubmittingLead(false);
    }
  };

  return (
    <div className="flex flex-col overflow-hidden bg-white">
      {/* ─── 1. HERO SECTION: LUMINOUS ENTERPRISE HEALTHCARE WITH 4K UNCROPPED RECEPTION ─── */}
      <section className="relative w-full overflow-hidden bg-gradient-to-b from-[#f8faf9] via-white to-[#f4f7f5] text-stone-900 pt-8 pb-14 lg:py-16 border-b border-stone-200">
        {/* Subtle Architectural Medical Grid & Ambient Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(#0a2e22_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.03] pointer-events-none" />
        <div className="absolute top-10 right-1/4 w-[500px] h-[500px] bg-emerald-100/35 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute -bottom-20 left-10 w-[450px] h-[450px] bg-[#9b7745]/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* Left Column: Institutional Clinical Authority (Balanced 6 Columns) */}
            <div className="lg:col-span-6 space-y-6 animate-fade-in-up">
              
              {/* Accreditation Badge */}
              <div className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-[#0a2e22] text-xs font-bold tracking-wider uppercase shadow-xs">
                <span>{t("NABH-Aligned Multi-Specialty Hospital • Kadapa", "కడపలో NABH-ఆధారిత మల్టీస్పెషాలిటీ హాస్పిటల్", "कडप्पा में एनएबीएच-संरेखित मल्टीस्पेशलिटी अस्पताल")}</span>
              </div>
              
              {/* Editorial Serif & Sans Headline */}
              <h1 className="text-3xl sm:text-4xl lg:text-[2.85rem] text-[#0a2e22] font-serif font-bold leading-[1.14] tracking-tight">
                {t('Advanced Medical Science.', 'అధునాతన వైద్య శాస్త్రం.', 'उन्नत चिकित्सा विज्ञान।')} <br/>
                <span className="font-light italic text-[#9b7745] font-serif">
                  {t('Compassionate Human Care.', 'కరుణతో కూడిన సంరక్షణ.', 'करुणामय मानवीय देखभाल।')}
                </span>
              </h1>
              
              {/* Reassuring Clinical Mission Statement */}
              <p className="text-sm sm:text-base text-stone-600 max-w-lg font-normal leading-relaxed">
                {t(
                  'Rayalaseema’s benchmark multi-specialty institution for Advanced Infertility (IVF/ICSI), High-Risk Maternity, Level-III Neonatal Intensive Care (NICU), and Laparoscopic Surgery. Trusted by over 15,000 families in Kadapa, Proddatur & Rayachoti.',
                  'రాయలసీమలోనే అగ్రగామిగా నిలిచిన ధృవ హాస్పిటల్స్ — అధునాతన సంతానలేమి (IVF/ICSI), హై-రిస్క్ ప్రసూతి, లెవల్-III నియోనాటల్ ICU మరియు లాపరోస్కోపిక్ సర్జరీలలో అత్యున్నత ప్రమాణాలు.',
                  'उन्नत प्रजनन क्षमता (आईवीएफ), उच्च जोखिम वाले मातृत्व, स्तर-III एनआईसीयू और लेप्रोस्कोपिक सर्जरी के लिए रायलसीमा का प्रमुख स्वास्थ्य केंद्र।'
                )}
              </p>

              {/* Direct Triage & Emergency Action Row (Side-by-Side Harmonized Alignment) */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-1">
                <a 
                  href={`tel:${(settings?.casualtyPhone || contactInfo.phones[0] || '08562318419').replace(/\D/g, '')}`} 
                  className="h-14 flex items-center gap-3 bg-red-50 hover:bg-red-100/80 border border-red-200/80 px-4 rounded-2xl transition-all shadow-xs hover:shadow"
                >
                  <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center group-hover:scale-105 transition-transform shadow-md shrink-0">
                    <Phone size={17} className="fill-current" />
                  </div>
                  <div className="flex flex-col text-left pr-1">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                      <span className="text-[10px] uppercase font-bold tracking-wider text-red-600">{t('24/7 Casualty', '24/7 అత్యవసరం', '24/7 आपातकाल')}</span>
                    </div>
                    <span className="text-base font-mono font-bold text-stone-900 tracking-wide">{settings?.casualtyPhone || contactInfo.phones[0]}</span>
                  </div>
                </a>

                <button
                  onClick={() => setIsModalOpen(true)}
                  className="h-14 px-6 bg-[#0a2e22] hover:bg-[#134937] text-white font-bold rounded-2xl text-sm tracking-wide transition-all shadow-lg shadow-[#0a2e22]/20 flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
                >
                  <Calendar size={16} className="text-[#c5a880]" />
                  <span>{t('Book OPD Consultation', 'OPD బుక్ చేయండి', 'ओपीडी बुक करें')}</span>
                  <ChevronRight size={15} className="text-[#c5a880]" />
                </button>
              </div>

              {/* Quick Institutional Clinical Benchmarks */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-stone-200">
                {[
                  { num: '15,000+', lbl: t('Patients Treated', 'రోగుల చికిత్స', 'मरीजों का इलाज') },
                  { num: '500+', lbl: t('IVF Deliveries', 'IVF విజయాలు', 'आईवीएफ प्रसव') },
                  { num: 'Level-III', lbl: t('Advanced NICU', 'అధునాతన NICU', 'उन्नत एनआईसीयू') },
                  { num: '24/7', lbl: t('Casualty & Pharmacy', 'అత్యవసర & ఫార్మసీ', 'आपातकालीन एवं फार्मेसी') },
                ].map((item, idx) => (
                  <div key={idx} className="flex flex-col">
                    <span className="text-lg sm:text-xl font-serif font-bold text-[#0a2e22]">{item.num}</span>
                    <span className="text-[10px] text-stone-500 font-medium leading-tight">{item.lbl}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Full 4K Authentic Executive Reception (Balanced 6 Columns, 100% Uncropped & Crystal Clear) */}
            <div className="lg:col-span-6 relative animate-fade-in-up">
              
              {/* Outer Decorative Ambient Glow */}
              <div className="absolute -inset-3 bg-gradient-to-tr from-[#0a2e22]/10 via-[#9b7745]/15 to-transparent rounded-[32px] blur-2xl -z-10" />

              {/* Main 4K Image Container with Exact Native Aspect Ratio (1024x725 = aspect-[1024/725] - No Zoom, No Cropping!) */}
              <div className="relative aspect-[1024/725] rounded-3xl overflow-hidden shadow-2xl border border-stone-200/90 bg-stone-900 group">
                <Image 
                  src="/hero-reception-4k.webp" 
                  alt="Dhruva Hospitals Executive Reception - 4K Ultra HD" 
                  fill 
                  priority
                  quality={100}
                  className="object-cover group-hover:scale-[1.015] transition-transform duration-700" 
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />

                {/* Bottom Status Dock */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
                  <div className="bg-[#0a2e22]/90 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-[#9b7745]/30 text-white shadow-xl flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                    <span className="text-[11px] font-serif font-medium text-stone-200 truncate">
                      Executive Reception Desk
                    </span>
                  </div>

                  <button
                    onClick={() => setIsImageViewerOpen(true)}
                    className="pointer-events-auto bg-black/80 hover:bg-black text-[#c5a880] hover:text-white px-3 py-1.5 rounded-xl backdrop-blur-md text-[10px] font-mono font-bold uppercase tracking-wider border border-white/20 shadow-xl flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
                    title="Open 4K Ultra HD Full Screen"
                  >
                    <Maximize2 size={12} />
                    <span>4K Full Screen</span>
                  </button>
                </div>

              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ─── 1.5 INSTITUTIONAL CAPABILITIES & 24/7 TRIAGE ─── */}
      <section className="bg-white border-y border-stone-200 py-8 px-4 sm:px-6 lg:px-8 relative z-20 shadow-xs">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { 
              icon: Stethoscope, 
              tag: 'DOCTORATE • FACULTY',
              title: t('Senior Medical Faculty', 'సీనియర్ వైద్యులు', 'वरिष्ठ चिकित्सा संकाय'),
              desc: t('Fellowship-trained specialists from Apollo, Ankura & KIMS', 'అపోలో, అంకుర, కిమ్స్ నుండి నిపుణులు', 'अपोलो और अंकुरा के विशेषज्ञ'),
              href: '/doctors'
            },
            { 
              icon: Baby, 
              tag: 'CRITICAL CARE • NICU',
              title: t('Level-III NICU & Critical Care', 'లెవల్-III నియోనాటల్ ICU', 'स्तर-III एनआईसीयू'),
              desc: t('24/7 dedicated neonatal intensivists & incubators', '24/7 నవజాత శిశు సంరక్షణ', '24/7 नवजात गहन देखभाल'),
              href: '/neonatal'
            },
            { 
              icon: Phone, 
              tag: 'CASUALTY • 24/7',
              title: t('24/7 Emergency Casualty', '24/7 అత్యవసర సేవలు', '24/7 आपातकालीन दुर्घटना'),
              desc: t('Immediate trauma resuscitation at Dwaraka Nagar', 'ద్వారకా నగర్ వద్ద తక్షణ సేవలు', 'द्वारका नगर में तत्काल सेवा'),
              href: `tel:${(settings?.casualtyPhone || '08562318419').replace(/\D/g, '')}`
            },
            { 
              icon: CheckCircle2, 
              tag: 'GENUINE MEDICINES',
              title: t('24/7 Pharmacy & Diagnostics', '24/7 ఫార్మసీ & ల్యాబ్', '24/7 फार्मेसी और लैब'),
              desc: t('Round-the-clock emergency pharmacy and sterile OT hygiene', 'అన్ని అత్యవసర మందులు మరియు సురక్షిత ల్యాబ్', 'सभी आवश्यक दवाएं और स्वच्छ लैब'),
              href: '/services'
            },
          ].map((action, i) => (
            <Link 
              key={i} 
              href={action.href}
              className="group p-5 rounded-2xl bg-[#fcfdfd] hover:bg-white border border-stone-200/80 hover:border-[#0a2e22]/20 hover:shadow-md transition-all duration-300 flex items-start gap-4"
            >
              <div className="w-12 h-12 rounded-full bg-emerald-50/90 border border-emerald-200 text-[#0a2e22] flex items-center justify-center shrink-0 group-hover:bg-[#0a2e22] group-hover:border-[#0a2e22] transition-all duration-300 shadow-xs">
                <action.icon size={22} className="text-[#0a2e22] group-hover:text-[#c5a880] transition-colors" />
              </div>
              <div className="space-y-1 flex-1">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#9b7745] block">
                  {action.tag}
                </span>
                <h4 className="font-serif font-bold text-sm text-[#0a2e22] group-hover:text-[#9b7745] transition-colors flex items-center justify-between">
                  <span>{action.title}</span>
                  <ChevronRight size={13} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 text-[#9b7745] transition-all" />
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed font-normal">{action.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* â”€â”€â”€ 3. EDITORIAL INTRO / EXCELLENCE SECTION â”€â”€â”€ */}
      <section className="py-24 lg:py-32 px-6 lg:px-8 max-w-7xl mx-auto w-full bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          <div className="lg:col-span-6 relative">
            <div className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-[#9b7745]/15 border border-[#9b7745]/30 text-[#0a1d16] text-xs font-semibold uppercase tracking-wider mb-6">
              <span>{t('Center of Clinical Excellence', 'క్లినికల్ ఎక్సలెన్స్ సెంటర్', 'नैदानिक उत्कृष्टता केंद्र')}</span>
            </div>

            <h2 className="text-4xl md:text-5xl lg:text-[3.25rem] font-heading text-emerald-950 leading-tight mb-8">
              {t('Excellence in specialized medical care.', 'కడప కుటుంబాల కోసం ప్రత్యేక వైద్య సంరక్షణలో శ్రేష్ఠత.', 'विशेष चिकित्सा देखभाल में उत्कृष्टता।')}
            </h2>

            <div className="space-y-6">
              <p className="text-emerald-900/80 text-base md:text-lg leading-relaxed font-light mb-8">
                {t(
                  'Founded with a vision to bring high-tech medical treatments to Kadapa, Dhruva Hospitals has become the region\'s preferred destination for critical healthcare needs. Led by highly qualified specialists from Apollo, JIPMER, and Ankura, we deliver ethical, compassionate, and life-saving medical care.',
                  'కడపకు అత్యాధునిక వైద్య చికిత్సలను అందించాలనే దృక్పథంతో స్థాపించబడిన ధృవ హాస్పిటల్స్, క్లిష్టమైన ఆరోగ్య అవసరాలకు ఈ ప్రాంతంలో అత్యంత ఇష్టపడే గమ్యస్థానంగా మారింది.',
                  'कडप्पा में उच्च तकनीक चिकित्सा उपचार लाने के दृष्टिकोण के साथ स्थापित, ध्रुव हॉस्पिटल्स महत्वपूर्ण स्वास्थ्य देखभाल आवश्यकताओं के लिए क्षेत्र का पसंदीदा स्थान बन गया है।'
                )}
              </p>
              
              {hospitalFeatures.slice(0, 4).map((feature, i) => (
                <div key={i} className="flex gap-4 border-t border-emerald-900/10 pt-5">
                  <span className="text-primary-600 font-mono text-base font-bold tracking-widest mt-0.5">
                    0{i+1}
                  </span>
                  <div>
                    <h4 className="font-heading text-xl text-emerald-950 mb-1">
                      {t(feature.title, feature.teluguTitle, feature.title)}
                    </h4>
                    <p className="text-emerald-800/70 text-sm font-light">
                      {t(feature.desc, feature.teluguDesc, feature.desc)}
                    </p>
                  </div>
                </div>
              ))}
              
              <div className="pt-6">
                <Link 
                  href="/about" 
                  className="inline-flex items-center gap-2 text-primary-600 font-bold hover:text-primary-700 uppercase tracking-widest text-xs transition-colors mt-4 group"
                >
                  <span>{t('Learn Our Full Story', 'మా పూర్తి కథ తెలుసుకోండి', 'हमारी पूरी कहानी जानें')}</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
          
          {/* Overlapping Hospital Photos (Real Reception & Real NICU) */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-6 relative">
            <div className="absolute -top-16 -right-12 text-[14rem] font-heading text-primary-200/20 leading-none z-0 pointer-events-none select-none">
              &ldquo;
            </div>
            
            {/* Exterior Campus Card */}
            <div className="relative z-10 pt-16 group">
              <div className="aspect-[3/4] relative overflow-hidden rounded-3xl shadow-2xl border border-emerald-900/10">
                <Image 
                  src="/exterior.jpg" 
                  alt="Dhruva Hospitals Exterior Campus Kadapa" 
                  fill 
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/85 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="text-[10px] uppercase tracking-widest text-[#c5a880] font-bold block">Hospital Campus</span>
                  <span className="text-sm font-heading font-medium">Dhruva Hospitals, Kadapa</span>
                </div>
              </div>
            </div>

            {/* NICU Card */}
            <div className="relative z-10 pb-16 group">
              <div className="aspect-[3/4] relative overflow-hidden rounded-3xl shadow-2xl border border-emerald-900/10">
                <Image 
                  src="/nicu.png" 
                  alt="Dhruva Hospital NICU Neonatal Ward" 
                  fill 
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="text-[10px] uppercase tracking-widest text-primary-300 font-bold block">Newborn Critical Care</span>
                  <span className="text-sm font-heading font-medium">Level-3 NICU Suites</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ─── 4. SPECIALIZED CARE FOR EVERY PHASE (LUMINOUS ARCHITECTURAL CLINICAL DEPARTMENTS) ─── */}
      <section className="bg-[#f8faf9] py-24 lg:py-32 text-stone-900 relative overflow-hidden border-t border-stone-200">
        <div className="absolute inset-0 bg-[radial-gradient(#0a2e22_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.03] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 border-b border-stone-200 pb-8">
            <div>
              <div className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-[#0a2e22] text-xs font-bold uppercase tracking-widest mb-4">
                <span>{t('Clinical Departments & Specialties', 'క్లినికల్ విభాగాలు', 'नैदानिक विभाग')}</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#0a2e22] leading-tight">
                <span className="italic font-light text-[#9b7745]">{t('Specialized Care', 'ప్రత్యేక సంరక్షణ', 'विशेष देखभाल')}</span><br/>
                {t('For Every Phase of Life.', 'జీవితంలోని ప్రతి దశలో.', 'जीवन के हर चरण के लिए।')}
              </h2>
            </div>
            
            <Link 
              href="/services" 
              className="mt-6 md:mt-0 inline-flex items-center gap-2 text-[#0a2e22] hover:text-[#9b7745] uppercase tracking-widest text-xs font-bold transition-colors group"
            >
              <span>{t('Explore All Services', 'అన్ని సేవలను అన్వేషించండి', 'सभी सेवाओं का पता लगाएं')}</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* 6 Clean Clinical Service Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {serviceCategories.slice(0, 6).map((service, i) => {
              const categoryImageMap: Record<string, string> = {
                neonatal: '/consultation.png', // Dr. Sudarshan Reddy K (Founder & Children's Specialist / Neonatologist) examining a child
                fertility: '/fertility-room.png', // Specialized IVF/Fertility procedure room
                pregnancy: '/room.jpg', // Private maternity recovery suite
                gynaecology: '/operation-theatre.png', // Modular OT for Laparoscopic & Gynaecologic Surgeries
                cancer: '/ot-doors.png', // Specialized clinical screening suite
                diagnostics: '/pharmacy.png', // 24/7 hospital pharmacy & diagnostics
              };
              const cardImage = categoryImageMap[service.id] || '/consultation.png';
              return (
                <div 
                  key={i} 
                  className="group bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
                >
                  {/* Photo Container */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-stone-100">
                    <Image 
                      src={cardImage} 
                      alt={service.name} 
                      fill 
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-700" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-80" />
                    <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-[#0a2e22] px-3 py-1 rounded-full text-xs font-mono font-bold">
                      0{i+1}
                    </span>
                  </div>
                  
                  {/* Card Content */}
                  <div className="p-7 flex flex-col flex-1 justify-between space-y-5">
                    <div>
                      {service.id === 'neonatal' && (
                        <div className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-[#0a2e22] text-[10px] font-bold uppercase tracking-wider mb-2.5">
                          <span>{t('Founder Led • Dr. Sudarshan Reddy K', 'వ్యవస్థాపక వైద్యులు • డా|| సుదర్శన్ రెడ్డి', 'संस्थापक नेतृत्व • डॉ. सुदर्शन रेड्डी')}</span>
                        </div>
                      )}
                      {service.id === 'fertility' && (
                        <div className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-[#0a2e22] text-[10px] font-bold uppercase tracking-wider mb-2.5">
                          <span>{t('Director Led • Dr. S Mounika Reddy', 'డైరెక్టర్ • డా|| మౌనిక రెడ్డి', 'निदेशक नेतृत्व • डॉ. एस मोनिका रेड्डी')}</span>
                        </div>
                      )}

                      <h3 className="text-xl font-serif font-bold text-[#0a2e22] mb-2 leading-snug group-hover:text-[#9b7745] transition-colors">
                        {t(service.name, service.teluguName, service.hindiName)}
                      </h3>

                      <p className="text-stone-600 font-normal text-xs sm:text-sm line-clamp-2 leading-relaxed mb-4">
                        {t(service.description, service.description, service.description)}
                      </p>

                      {/* Service Sub-bullets */}
                      <div className="flex flex-wrap gap-1.5">
                        {service.services.slice(0, 3).map((sub: string, sIdx: number) => (
                          <span key={sIdx} className="text-[10px] bg-stone-50 text-stone-700 px-2 py-1 rounded-lg border border-stone-200 font-medium">
                            {sub}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Card Footer Actions */}
                    <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                      <button
                        onClick={() => openBookingForService(service.name)}
                        className="text-xs uppercase tracking-wider font-bold text-[#0a2e22] hover:text-[#9b7745] transition-colors flex items-center gap-1.5"
                      >
                        <span>{t('Book Consultation', 'కన్సల్టేషన్ బుక్ చేయండి', 'परामर्श बुक करें')}</span>
                        <ChevronRight size={14} />
                      </button>

                      <Link 
                        href={`/services/${service.id}`} 
                        className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-emerald-50 text-[#0a2e22] hover:bg-[#0a2e22] hover:text-white transition-colors"
                      >
                        <ArrowRight size={15} />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ─── 5. DISTINGUISHED CLINICAL FACULTY & MEDICAL DIRECTORATE ─── */}
      <section className="py-24 lg:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full bg-white">
        <div className="text-center mb-16 max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-[#0a2e22] text-xs font-mono font-bold uppercase tracking-wider">
            <span>{t('Senior Medical Directorate', 'సీనియర్ మెడికల్ డైరెక్టరేట్', 'वरिष्ठ चिकित्सा निदेशालय')}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#0a2e22] leading-tight tracking-tight">
            {t('Distinguished Clinical Faculty & Specialists.', 'విశిష్ట క్లినికల్ ఫ్యాకల్టీ & నిపుణులు.', 'प्रतिष्ठित नैदानिक संकाय और विशेषज्ञ।')}
          </h2>

          <p className="text-stone-600 text-sm sm:text-base font-normal leading-relaxed max-w-2xl mx-auto">
            {t(
              'Fellowship-trained clinicians and senior consultants dedicated to advanced maternity, Level-III neonatal intensive care, laparoscopic surgery, and critical medicine in Kadapa.', 
              'కడపలో అధునాతన ప్రసూతి, లెవల్-3 నియోనాటల్ ఇంటెన్సివ్ కేర్, లాపరోస్కోపిక్ సర్జరీ మరియు క్రిటికల్ మెడిసిన్‌కు అంకితమైన సీనియర్ నిపుణులు.', 
              'कडप्पा में उन्नत मातृत्व, स्तर-3 नवजात गहन देखभाल, लेप्रोस्कोपिक सर्जरी और क्रिटिकल मेडिसिन के लिए समर्पित वरिष्ठ सलाहकार।'
            )}
          </p>
        </div>
        
        {/* Doctor Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7 lg:gap-8 w-full">
          {doctors.map((doc, idx) => {
            const roleBadges: Record<string, { role: string; badgeClass: string; dept: string; institutes: string }> = {
              'dr-sudarshan-reddy': {
                role: 'FOUNDER & CHAIRMAN',
                badgeClass: 'bg-[#0a2e22] text-[#c5a880] border-[#9b7745]/40',
                dept: 'Level-III NICU & Paediatrics',
                institutes: 'Apollo Mysore • Ankura Hospital',
              },
              'dr-mounika-reddy': {
                role: 'HOSPITAL DIRECTOR',
                badgeClass: 'bg-[#0a2e22] text-[#c5a880] border-[#9b7745]/40',
                dept: 'IVF & Advanced Laparoscopy',
                institutes: 'KIMS • Ferty9 • Hegde Hospital',
              },
              'dr-b-surya': {
                role: 'CHIEF PHYSICIAN',
                badgeClass: 'bg-stone-900 text-emerald-300 border-white/10',
                dept: 'Medicine & Diabetology',
                institutes: 'JIPMER Puducherry • Critical Care',
              },
              'dr-m-vinay-kumar': {
                role: 'SENIOR SURGEON',
                badgeClass: 'bg-stone-900 text-emerald-300 border-white/10',
                dept: 'General & Laser Laparoscopy',
                institutes: 'Minimal Access Surgery • FMAS',
              },
            };

            const meta = roleBadges[doc.id] || {
              role: 'SENIOR CONSULTANT',
              badgeClass: 'bg-stone-900 text-stone-200 border-white/20',
              dept: doc.specialization,
              institutes: doc.qualifications[0] || 'Medical Specialist',
            };

            return (
              <div 
                key={idx} 
                className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-md hover:shadow-2xl transition-all duration-500 flex flex-col justify-between group hover:-translate-y-2 relative"
              >
                <div>
                  {/* Doctor Portrait Frame */}
                  <div className="relative aspect-[4/5] overflow-hidden rounded-2xl mb-5 bg-stone-100 border border-stone-200/70 shadow-inner">
                    <Image 
                      src={doc.image || '/doctors/dr-sudarshan.png'} 
                      alt={doc.name} 
                      fill 
                      unoptimized={Boolean(doc.image && doc.image.startsWith('http'))}
                      className="object-cover object-top transition-transform duration-700 group-hover:scale-105" 
                    />
                    
                    {/* Subtle Depth Scrim */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

                    {/* Distinguished Role Badge (Top-Right) */}
                    <div className={`absolute top-3 right-3 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border shadow-sm flex items-center ${meta.badgeClass}`}>
                      <span>{meta.role}</span>
                    </div>

                    {/* Department Tag (Bottom of Photo) */}
                    <div className="absolute bottom-3 left-3 right-3">
                      <span className="inline-block px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-[11px] font-mono font-semibold text-emerald-200 border border-white/10">
                        {meta.dept}
                      </span>
                    </div>
                  </div>

                  {/* Doctor Identity */}
                  <div className="space-y-1">
                    <h3 className="text-xl font-serif font-bold text-[#0a2e22] group-hover:text-[#9b7745] transition-colors leading-snug">
                      {t(doc.name, doc.teluguName, doc.hindiName)}
                    </h3>

                    <p className="text-[#9b7745] font-mono text-xs font-bold uppercase tracking-wider line-clamp-1">
                      {t(doc.specialization, doc.specialization, doc.specialization)}
                    </p>
                  </div>

                  {/* Academic Qualifications Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-3">
                    {doc.qualifications.map((q, i) => (
                      <span 
                        key={i} 
                        className="px-2 py-0.5 bg-stone-50 text-[10px] font-semibold text-stone-700 rounded-md border border-stone-200"
                      >
                        {q}
                      </span>
                    ))}
                  </div>

                  {/* Institute Training Credential */}
                  <div className="pt-3 border-t border-stone-100 mt-3">
                    <p className="text-[11px] font-mono text-[#0a2e22] font-semibold flex items-center gap-1.5">
                      <Award size={13} className="text-[#9b7745]" />
                      <span className="truncate">{meta.institutes}</span>
                    </p>
                  </div>

                  {/* Bio Summary */}
                  <p className="text-stone-600 text-xs font-normal line-clamp-2 leading-relaxed mt-2 mb-6">
                    {t(doc.bio, doc.bio, doc.bio)}
                  </p>
                </div>

                {/* Dual Consultation Action Buttons */}
                <div className="flex items-center gap-2 pt-2 border-t border-stone-100">
                  <button
                    onClick={() => openBookingForDoctor(doc)}
                    className="flex-1 py-3 px-3 bg-[#0a2e22] hover:bg-[#134937] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2 group/btn cursor-pointer"
                  >
                    <Calendar size={14} className="text-[#c5a880]" />
                    <span>{t('Book Consultation', 'కన్సల్టేషన్ బుక్ చేయండి', 'परामर्श बुक करें')}</span>
                  </button>

                  <a
                    href={`https://wa.me/${contactInfo.whatsapp}?text=${encodeURIComponent(`Hello Dhruva Hospitals, I would like to consult with ${doc.name}.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={`Inquire about ${doc.name} via WhatsApp`}
                    className="w-10 h-10 rounded-xl bg-emerald-50 hover:bg-[#25D366] text-[#0a2e22] hover:text-white border border-emerald-200 hover:border-[#25D366] flex items-center justify-center transition-all shrink-0 shadow-xs group/wa cursor-pointer"
                  >
                    <MessageCircle size={16} className="text-[#25D366] group-hover/wa:text-white transition-colors" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Institutional Faculty Link */}
        <div className="mt-14 text-center">
          <Link 
            href="/doctors" 
            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl bg-[#f8faf9] hover:bg-white border border-stone-200 hover:border-[#0a2e22] text-[#0a2e22] font-bold text-xs uppercase tracking-wider shadow-sm hover:shadow-md transition-all group"
          >
            <span>{t('View Complete Medical Faculty & Clinical Records', 'పూర్తి వైద్యుల జాబితా & అనుభవ వివరాలు చూడండి', 'पूर्ण चिकित्सा संकाय और नैदानिक रिकॉर्ड देखें')}</span>
            <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform text-[#9b7745]" />
          </Link>
        </div>
      </section>

      {/* â”€â”€â”€ 6. INTERACTIVE FACILITY & LOCATION TOUR â”€â”€â”€ */}
      <VirtualTourSequence />

      {/* â”€â”€â”€ 8. STORIES OF HEALING / TESTIMONIALS â”€â”€â”€ */}
      <section className="bg-[#f8faf9] py-24 lg:py-32 overflow-hidden border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-start md:items-end justify-between mb-16">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-primary-600 block mb-2">
                Real Patient Stories
              </span>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#0a2e22]">
                {t('Stories of', 'యొక్క కథలు', 'की कहानियाँ')} <br/>
                <span className="italic font-light text-[#9b7745]">{t('Healing', 'స్వస్థత', 'चिकित्सा')}</span>
              </h2>
            </div>
            
            <p className="text-emerald-800/70 text-base md:text-lg font-light border-l-2 border-[#9b7745] pl-6 max-w-lg text-stone-600">
              {t('Hear from the families whose lives have been transformed by our dedicated team of doctors and nurses.', 'మా సంరక్షణ ద్వారా జీవితాలను మార్చుకున్న కుటుంబాల మాటలు వినండి.', 'उन परिवारों से सुनें जिनके जीवन हमारी देखभाल से बदल गए हैं।')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.slice(0, 3).map((test) => (
              <div key={test.id} className="bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-emerald-900/5 flex flex-col justify-between">
                <div>
                  <div className="flex gap-1 text-primary-500 mb-6">
                    {[...Array(test.rating)].map((_, i) => (
                      <Star key={i} size={18} fill="currentColor" />
                    ))}
                  </div>
                  
                  <p className="text-emerald-950 text-base md:text-lg font-medium leading-relaxed mb-8">
                    &ldquo;{t(test.content, test.teluguContent, test.hindiContent)}&rdquo;
                  </p>
                </div>

                <div className="flex items-center gap-4 border-t border-emerald-50 pt-6">
                  <div className="w-11 h-11 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-sm">
                    {test.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-emerald-950 text-sm">{test.name}</h4>
                    <p className="text-xs text-emerald-800/60 font-medium">{test.location} • {test.service}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Appointment Modal Popup */}
      <AppointmentModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        doctorId={selectedDoctorId}
        doctorName={selectedDoctor}
        specialty={selectedSpecialty}
        profilePic={selectedProfilePic}
        serviceName={selectedService}
      />

      {/* 4K Ultra HD Reception Image Lightbox Modal */}
      {isImageViewerOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col justify-between p-4 sm:p-8 animate-fade-in"
          onClick={() => setIsImageViewerOpen(false)}
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between z-10" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <div>
                <h3 className="text-white font-serif font-bold text-base sm:text-lg">Dhruva Hospitals Executive Reception</h3>
                <p className="text-xs text-stone-400 font-mono">Dwaraka Nagar, Kadapa • 4K Ultra High Definition (4096 × 2900)</p>
              </div>
            </div>

            <button
              onClick={() => setIsImageViewerOpen(false)}
              className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              aria-label="Close Full Screen"
            >
              <X size={22} />
            </button>
          </div>

          {/* Central 4K Image (Uncropped, Full-Screen Aspect) */}
          <div 
            className="relative flex-1 w-full max-w-6xl mx-auto my-4 flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-full max-h-[82vh] aspect-[1024/725] mx-auto rounded-2xl overflow-hidden shadow-2xl border border-white/10">
              <Image 
                src="/hero-reception-4k.webp" 
                alt="Dhruva Hospitals 4K Ultra HD Reception" 
                fill 
                className="object-contain" 
                priority
                quality={100}
              />
            </div>
          </div>

          {/* Bottom Bar Details */}
          <div className="text-center text-xs text-stone-400 font-mono z-10" onClick={(e) => e.stopPropagation()}>
            Click anywhere or press Esc to close • Official Dhruva Hospitals Healthcare Facility
          </div>
        </div>
      )}

    </div>
  );
}
