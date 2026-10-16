'use client';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Target, Eye, Award, CheckCircle2, 
  HeartHandshake, Baby, Building2, 
  Users, Microscope, Phone, ArrowRight, Stethoscope, 
  ChevronRight, BadgeCheck, Clock
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useSettings } from '@/context/SettingsContext';
import { useHospitalStats } from '@/lib/useHospitalStats';
import { doctors, contactInfo, stats as baseStats } from '@/lib/data';

export default function AboutPage() {
  const { lang, t } = useLanguage();
  const { settings } = useSettings();
  const { patientsCount, ivfDeliveries } = useHospitalStats();

  const dynamicStats = [
    { value: patientsCount, label: 'Patients Treated', teluguLabel: 'చికిత్స పొందిన రోగులు', icon: 'Users' },
    { value: ivfDeliveries, label: 'IVF & Miracle Deliveries', teluguLabel: 'IVF విజయాలు', icon: 'HeartPulse' },
    { value: 'Level-3', label: 'Advanced NICU & PICU', teluguLabel: 'లెవల్-3 నియోనాటల్ ICU', icon: 'Building2' },
    { value: '24/7', label: 'Emergency & Trauma Care', teluguLabel: 'అత్యవసర & ట్రామా సేవలు', icon: 'Ambulance' },
  ];

  return (
    <div className="flex flex-col bg-[#fcfbf9] text-gray-900 overflow-hidden">
      
      {/* ─── 1. ENTERPRISE HERO SECTION ─── */}
      <section className="relative pt-20 sm:pt-24 lg:pt-30 pb-6 sm:pb-10 lg:pb-14 bg-gradient-to-b from-[#f8faf9] via-white to-[#f4f7f5] text-stone-900 border-b border-stone-200 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#0a2e22_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.03] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column (7 cols): Institutional Profile Story & Actions */}
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full text-[#0a2e22] text-xs font-mono font-bold uppercase tracking-widest animate-fade-in">
                <Building2 size={13} className="text-[#9b7745]" />
                <span>{t('Institutional Profile & Heritage', 'సంస్థ ప్రొఫైల్ & చరిత్ర', 'संस्थागत प्रोफ़ाइल और विरासत')}</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-5xl font-serif font-bold text-[#0a2e22] leading-[1.12] tracking-tight">
                {t('Pioneering', 'అగ్రగామిగా', 'अग्रणी')} <br />
                <span className="italic font-light text-[#9b7745]">
                  {t('Clinical Excellence in Kadapa.', 'కడపలో క్లినికల్ శ్రేష్ఠత.', 'कडप्पा में नैदानिक उत्कृष्टता।')}
                </span>
              </h1>

              <p className="text-base sm:text-lg text-stone-600 leading-relaxed font-normal max-w-2xl">
                {t(
                  'Established to bridge the gap in tertiary critical care, Dhruva Hospitals delivers university-grade medical treatments in Fertility, High-Risk Obstetrics, and Level-III Neonatal Care to families across the Rayalaseema region.',
                  'అత్యాధునిక క్రిటికల్ కేర్ చికిత్సలను అందించడానికి స్థాపించబడిన ధృవ హాస్పిటల్స్, రాయలసీమ ప్రాంతంలోని కుటుంబాలకు ఫెర్టిలిటీ, ప్రసూతి మరియు లెవల్-3 నియోనాటల్ కేర్‌లో ప్రపంచ స్థాయి వైద్యాన్ని అందిస్తోంది.',
                  'तृतीयक महत्वपूर्ण देखभाल में अंतर को पाटने के लिए स्थापित, ध्रुव हॉस्पिटल्स पूरे रायलसीमा क्षेत्र में परिवारों को प्रजनन, उच्च जोखिम वाले प्रसूति और लेवल-3 नवजात देखभाल में विश्वविद्यालय-ग्रेड चिकित्सा उपचार प्रदान करता है।'
                )}
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <Link 
                  href="/doctors" 
                  className="px-8 py-4 bg-[#0a2e22] hover:bg-[#134937] text-white font-bold rounded-xl text-xs sm:text-sm tracking-wider uppercase transition-all shadow-md shadow-[#0a2e22]/20 flex items-center gap-2.5 group"
                >
                  <span>{t('Meet Our Specialists', 'వైద్యులను కలవండి', 'विशेषज्ञों से मिलें')}</span>
                  <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform text-[#c5a880]" />
                </Link>
                <a 
                  href={`tel:${(settings?.casualtyPhone || contactInfo.phones[0] || '08562318419').replace(/\D/g, '')}`}
                  className="px-8 py-4 bg-white hover:bg-stone-50 border border-stone-200 text-stone-800 font-bold rounded-xl text-xs sm:text-sm tracking-wider uppercase transition-all shadow-xs flex items-center gap-2.5"
                >
                  <Phone size={15} className="text-red-600" />
                  <span>Casualty: {settings?.casualtyPhone || '08562–318419'}</span>
                </a>
              </div>

              {/* Institutional Core Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-5 border-t border-stone-200/80">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#0a2e22] shrink-0">
                    <CheckCircle2 size={16} className="text-[#9b7745]" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-[#0a2e22]">NABH Aligned</span>
                    <span className="text-[11px] text-stone-500">Quality Governance</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#0a2e22] shrink-0">
                    <Baby size={16} className="text-[#9b7745]" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-[#0a2e22]">Level-III NICU</span>
                    <span className="text-[11px] text-stone-500">24/7 Intensivists</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#0a2e22] shrink-0">
                    <Clock size={16} className="text-[#9b7745]" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-[#0a2e22]">24/7 Triage</span>
                    <span className="text-[11px] text-stone-500">Casualty & Pharmacy</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column (5 cols): Grand Hospital Architecture in Balanced Landscape Ratio */}
            <div className="lg:col-span-5 relative">
              
              {/* Outer Decorative Glow */}
              <div className="absolute -inset-3 bg-gradient-to-tr from-[#0a2e22]/10 via-[#9b7745]/10 to-transparent rounded-[32px] blur-2xl -z-10" />

              {/* Main Architectural Image Container (Balanced Landscape Aspect Ratio, Zero Stretch) */}
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-stone-200/90 bg-stone-900 group">
                <Image 
                  src="/exterior.jpg" 
                  alt="Dhruva Hospitals Campus Kadapa" 
                  fill 
                  className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
                  priority
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
                
                {/* Subtle Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent pointer-events-none" />

                {/* Top-Right Quality Badge */}
                <div className="absolute top-3.5 right-3.5 bg-[#0a2e22]/90 backdrop-blur-md px-3 py-1 rounded-full border border-[#9b7745]/40 text-[#c5a880] text-[10px] font-mono font-bold uppercase tracking-wider shadow-md">
                  <span>NABH Aligned</span>
                </div>

                {/* Bottom Campus Detail Card */}
                <div className="absolute bottom-3 left-3 right-3 bg-[#0a2e22]/95 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-[#9b7745]/30 text-white shadow-xl flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                    <div className="min-w-0">
                      <p className="font-serif font-bold text-sm text-white truncate">
                        Dhruva Hospitals, Kadapa
                      </p>
                      <p className="text-[11px] text-stone-300 font-light truncate">
                        Dwaraka Nagar • Near RTC Bus Stand
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#c5a880] shrink-0 ml-2">
                    24/7 Casualty
                  </span>
                </div>

              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ─── 2. ENTERPRISE KEY METRICS BANNER ─── */}
      <section className="bg-white border-b border-emerald-900/10 py-7 px-6 lg:px-8 relative z-20">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6 divide-y lg:divide-y-0 lg:divide-x divide-emerald-900/10">
          {dynamicStats.map((s, i) => (
            <div key={i} className={`flex flex-col items-center text-center ${i > 0 ? 'pt-5 lg:pt-0' : ''}`}>
              <span className="text-3xl lg:text-4xl font-heading font-bold text-emerald-950 mb-0.5">
                {s.value}
              </span>
              <span className="text-xs lg:text-sm font-semibold uppercase tracking-wider text-primary-600">
                {t(s.label, s.teluguLabel, s.label)}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 3. EXECUTIVE CLINICAL LEADERSHIP MESSAGE ─── */}
      <section className="py-14 lg:py-18 px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Chairman & Founders Portraits */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-4 relative">
            <div className="relative aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl border border-emerald-900/10 group">
              <Image 
                src="/doctors/dr-sudarshan.png" 
                alt="Dr. Sudarshan Reddy K" 
                fill 
                className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-[10px] uppercase font-bold text-[#c5a880] block">Founder, Chairman & Neonatologist</span>
                <span className="text-sm font-heading font-bold">Dr. Sudarshan Reddy K</span>
              </div>
            </div>

            <div className="relative aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl border border-emerald-900/10 group mt-8">
              <Image 
                src="/doctors/dr-mounika.png" 
                alt="Dr. S Mounika Reddy" 
                fill 
                className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-[10px] uppercase font-bold text-primary-300 block">Director & IVF Specialist</span>
                <span className="text-sm font-heading font-bold">Dr. S Mounika Reddy</span>
              </div>
            </div>
          </div>

          {/* Letter / Vision from Medical Directors */}
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-100 text-primary-700 text-xs font-bold uppercase tracking-wider">
              <HeartHandshake size={14} />
              <span>{t('Founders’ Clinical Vision', 'వ్యవస్థాపకుల క్లినికల్ విజన్', 'संस्थापकों का नैदानिक दृष्टिकोण')}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-heading text-emerald-950 leading-tight">
              {t('A Promise of Ethical, World-Class Healthcare for Every Family.', 'ప్రతి కుటుంబానికి నైతిక, ప్రపంచ స్థాయి వైద్యం అందించే వాగ్దానం.', 'प्रत्येक परिवार के लिए नैतिक, विश्व स्तरीय स्वास्थ्य सेवा का वादा।')}
            </h2>

            <div className="space-y-4 text-emerald-900/80 font-light text-base lg:text-lg leading-relaxed">
              <p>
                {t(
                  '“When we established Dhruva Hospitals in Kadapa, our primary commitment was clear: families in our district should never have to travel 400 kilometers to metro cities like Bangalore or Chennai for critical newborn survival or complex pregnancy interventions.”',
                  '“మేము కడపలో ధృవ హాస్పిటల్స్‌ను ప్రారంభించినప్పుడు, మా ప్రధాన లక్ష్యం స్పష్టంగా ఉంది: అత్యవసర నవజాత శిశు సంరక్షణ లేదా క్లిష్టమైన ప్రసూతి చికిత్సల కోసం మా ప్రాంత ప్రజలు బెంగళూరు లేదా చెన్నై వంటి నగరాలకు ప్రయాణించాల్సిన అవసరం ఉండకూడదు.”',
                  '“जब हमने कडप्पा में ध्रुव हॉस्पिटल्स की स्थापना की, तो हमारी प्रतिबद्धता स्पष्ट थी: हमारे जिले के परिवारों को महत्वपूर्ण नवजात जीवन रक्षा के लिए महानगरों की यात्रा नहीं करनी चाहिए।”'
                )}
              </p>
              <p>
                {t(
                  '“By investing in continuous medical education, high-precision German & Japanese surgical instrumentation, and a Level-III NICU staffed 24/7 by trained intensivists, Dhruva has evolved into a regional benchmark for clinical governance, clinical safety, and human warmth.”',
                  '“అత్యాధునిక పరికరాలు, నిరంతర వైద్య పరిశోధన మరియు 24/7 నిపుణులైన వైద్యులతో కూడిన లెవల్-3 NICU ద్వారా, ధృవ హాస్పిటల్స్ క్లినికల్ ప్రమాణాలు మరియు రోగి సంరక్షణలో ఒక ప్రమాణంగా నిలిచింది.”',
                  '“निरंतर चिकित्सा शिक्षा, उच्च-सटीक सर्जिकल उपकरणों और प्रशिक्षित गहन देखभाल विशेषज्ञों द्वारा 24/7 संचालित लेवल-3 एनआईसीयू में निवेश करके, ध्रुव क्षेत्रीय मानक बन गया है।”'
                )}
              </p>
            </div>

            {/* Doctor Credentials Badges */}
            <div className="pt-6 border-t border-emerald-900/10 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white border border-emerald-900/10 shadow-sm">
                <h4 className="text-sm font-heading font-bold text-emerald-950">Dr. Sudarshan Reddy K</h4>
                <p className="text-xs text-primary-600 font-semibold mb-1">MBBS, DNB Pediatrics (Apollo Mysore)</p>
                <p className="text-[11px] text-gray-500">IAP Neonatology Fellow (Ankura Hyderabad) • Ex-Consultant RIMS</p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-emerald-900/10 shadow-sm">
                <h4 className="text-sm font-heading font-bold text-emerald-950">Dr. S Mounika Reddy</h4>
                <p className="text-xs text-primary-600 font-semibold mb-1">MBBS, MS (OBG), FMAS (KIMS)</p>
                <p className="text-[11px] text-gray-500">FRM (Hegde Hospital) • Infertility & Advanced Laparoscopy</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─── 4. ENTERPRISE MISSION & VISION (ARCHITECTURAL LUXURY DESIGN) ─── */}
      <section className="py-14 lg:py-18 bg-[#f8faf9] text-stone-900 relative overflow-hidden border-y border-stone-200">
        <div className="absolute inset-0 bg-[radial-gradient(#0a2e22_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.03] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-[#9b7745] font-mono text-xs uppercase tracking-widest font-bold block mb-1.5">
              Institutional Foundation
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#0a2e22]">
              <span className="italic font-light text-[#9b7745]">Guided by Purpose,</span> Driven by Care
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Mission Card */}
            <div className="bg-white border border-stone-200 p-10 lg:p-14 rounded-3xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-[#0a2e22] flex items-center justify-center mb-8 border border-emerald-100">
                <Target size={32} />
              </div>
              <span className="text-[#9b7745] font-mono text-xs uppercase tracking-widest font-bold block mb-2">01 • Core Mission</span>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#0a2e22] mb-5">
                {t('Our Clinical Mission', 'మా క్లినికల్ మిషన్', 'हमारा नैदानिक मिशन')}
              </h3>
              <p className="text-stone-600 text-base lg:text-lg leading-relaxed font-normal mb-8">
                {t(
                  'To deliver accessible, high-precision, and compassionate medical interventions that uphold the dignity of every patient. We blend tertiary clinical protocols with genuine human empathy to ensure superior survival and recovery rates for our community.',
                  'ప్రతి రోగి గౌరవాన్ని కాపాడేలా సురక్షితమైన మరియు అత్యాధునిక వైద్య సేవలను అందించడం. క్లినికల్ ప్రోటోకాల్స్‌ను మానవీయ విలువలతో మిళితం చేసి అత్యుత్తమ వైద్య ఫలితాలను అందించడమే మా లక్ష్యం.',
                  'प्रत्येक रोगी की गरिमा को बनाए रखने वाले सुलभ, उच्च-सटीक और दयालु चिकित्सा हस्तक्षेप प्रदान करना।'
                )}
              </p>
              <ul className="space-y-3 pt-4 border-t border-stone-100 text-xs sm:text-sm text-stone-700">
                <li className="flex items-center gap-3">
                  <BadgeCheck size={18} className="text-[#9b7745] shrink-0" />
                  <span>Zero-compromise neonatal ICU sterile protocols</span>
                </li>
                <li className="flex items-center gap-3">
                  <BadgeCheck size={18} className="text-[#9b7745] shrink-0" />
                  <span>Transparent clinical treatment plans with no hidden tests</span>
                </li>
              </ul>
            </div>

            {/* Vision Card */}
            <div className="bg-white border border-stone-200 p-10 lg:p-14 rounded-3xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-[#0a2e22] flex items-center justify-center mb-8 border border-emerald-100">
                <Eye size={32} />
              </div>
              <span className="text-[#9b7745] font-mono text-xs uppercase tracking-widest font-bold block mb-2">02 • Institutional Vision</span>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#0a2e22] mb-5">
                {t('Our Institutional Vision', 'మా విజన్', 'हमारा विज़न')}
              </h3>
              <p className="text-stone-600 text-base lg:text-lg leading-relaxed font-normal mb-8">
                {t(
                  'To establish Kadapa as a recognized center for healthcare excellence across Andhra Pradesh, where scientific innovation, advanced surgical outcomes, and ethical medicine are standard for every citizen regardless of circumstance.',
                  'ఆంధ్రప్రదేశ్‌లోనే కడపను ఒక ప్రముఖ వైద్య కేంద్రంగా తీర్చిదిద్దడం, ఇక్కడ అధునాతన వైద్య చికిత్సలు మరియు నైతిక వైద్య ప్రమాణాలు అందరికీ అందుబాటులో ఉంటాయి.',
                  'आंध्र प्रदेश भर में कडप्पा को स्वास्थ्य सेवा उत्कृष्टता के एक मान्यता प्राप्त केंद्र के रूप में स्थापित करना।'
                )}
              </p>
              <ul className="space-y-3 pt-4 border-t border-stone-100 text-xs sm:text-sm text-stone-700">
                <li className="flex items-center gap-3">
                  <BadgeCheck size={18} className="text-[#9b7745] shrink-0" />
                  <span>Ranked regional reference hospital for complex fetal medicine</span>
                </li>
                <li className="flex items-center gap-3">
                  <BadgeCheck size={18} className="text-[#9b7745] shrink-0" />
                  <span>Continuous technological modernization and NABH quality alignment</span>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </section>


      {/* ─── 5. CLINICAL GOVERNANCE & PATIENT SAFETY STANDARDS ─── */}
      <section className="py-14 lg:py-18 px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-primary-600 block mb-2">
            Quality Assurance & Governance
          </span>
          <h2 className="text-2xl sm:text-4xl font-heading text-emerald-950 leading-snug">
            {t('Built on Trust, Rigor, and Zero Compromise.', 'నమ్మకం, క్రమశిక్షణ మరియు నాణ్యతతో నిర్మించబడింది.', 'विश्वास, कठोरता और शून्य समझौते पर निर्मित।')}
          </h2>
          <p className="text-emerald-800/70 text-base sm:text-lg mt-4 font-light">
            Every clinical protocol at Dhruva Hospitals aligns with international medical guidelines to ensure patient safety at every touchpoint.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: Microscope,
              title: 'Evidence-Based Protocols',
              teluguTitle: 'ఆధారిత వైద్య విధానం',
              desc: 'Clinical diagnostic and treatment guidelines curated from AIIMS, Apollo, and international neonatal standards.',
            },
            {
              icon: CheckCircle2,
              title: 'Sterile Infection Control',
              teluguTitle: 'స్టెరైల్ ఇన్ఫెక్షన్ కంట్రోల్',
              desc: 'Multi-stage air filtration, autoclave sterilization, and zero-tolerance cross-infection prevention in OT & NICU.',
            },
            {
              icon: Clock,
              title: '15-Min Critical Response',
              teluguTitle: 'తక్షణ ఎమర్జెన్సీ రెస్పాన్స్',
              desc: 'On-duty emergency trauma physicians, neonatal intensivists, and crash-cart resuscitation teams ready 24/7.',
            },
            {
              icon: Users,
              title: '100% Patient Privacy',
              teluguTitle: 'పూర్తి రోగి గోప్యత',
              desc: 'Sound-insulated consultation suites, confidential ultrasound diagnostics, and protected electronic medical records.',
            },
          ].map((item, idx) => (
            <div 
              key={idx} 
              className="bg-white p-8 rounded-3xl border border-emerald-900/10 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
            >
              <div>
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-900 group-hover:bg-primary-500 group-hover:text-emerald-950 transition-colors flex items-center justify-center mb-6">
                  <item.icon size={26} />
                </div>
                <h3 className="text-xl font-heading font-bold text-emerald-950 mb-3">
                  {t(item.title, item.teluguTitle, item.title)}
                </h3>
                <p className="text-emerald-900/70 text-sm font-light leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-emerald-900/5 flex items-center gap-2 text-xs font-semibold text-primary-600">
                <CheckCircle2 size={14} />
                <span>NABH Standard Compliance</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 6. REAL HOSPITAL INFRASTRUCTURE SHOWCASE ─── */}
      <section className="py-14 lg:py-18 bg-white border-y border-emerald-900/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-primary-600 block mb-1.5">
                Tangible Clinical Infrastructure
              </span>
              <h2 className="text-2xl sm:text-4xl font-heading text-emerald-950">
                {t('Advanced Infrastructure Built for Healing.', 'వైద్యం కోసం నిర్మించబడిన అత్యాధునిక మౌలిక సదుపాయాలు.', 'उपचार के लिए निर्मित उन्नत बुनियादी ढांचा।')}
              </h2>
            </div>
            
            <p className="text-gray-500 text-sm max-w-md font-light">
              Every facility shown below is live and operational inside our main building at Dwaraka Nagar, Kadapa.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* OT Photo Card */}
            <div className="bg-[#fcfbf9] rounded-3xl overflow-hidden border border-emerald-900/10 shadow-md group">
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image 
                  src="/operation-theatre.png" 
                  alt="Modular Operation Theatre" 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <span className="absolute top-3 left-3 bg-emerald-950/80 backdrop-blur-md text-primary-300 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                  Surgical Complex
                </span>
              </div>
              <div className="p-6">
                <h4 className="font-heading font-bold text-lg text-emerald-950 mb-1">Modular OT Complex</h4>
                <p className="text-xs text-gray-500 font-light">Equipped with laminar air flow, HEPA filters, C-arm imaging, and laser surgical suites.</p>
              </div>
            </div>

            {/* NICU Photo Card */}
            <div className="bg-[#fcfbf9] rounded-3xl overflow-hidden border border-emerald-900/10 shadow-md group">
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image 
                  src="/nicu.png" 
                  alt="Level-III NICU Incubators" 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <span className="absolute top-3 left-3 bg-emerald-950/80 backdrop-blur-md text-primary-300 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                  Neonatal Intensive Care
                </span>
              </div>
              <div className="p-6">
                <h4 className="font-heading font-bold text-lg text-emerald-950 mb-1">Level-III NICU Suites</h4>
                <p className="text-xs text-gray-500 font-light">Servo-controlled warmers, bubble CPAP, HFNC, and round-the-clock neonatal intensivist monitoring.</p>
              </div>
            </div>

            {/* Reception Photo Card */}
            <div className="bg-[#fcfbf9] rounded-3xl overflow-hidden border border-emerald-900/10 shadow-md group">
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image 
                  src="/reception-real.png" 
                  alt="Dhruva Reception Lounge" 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <span className="absolute top-3 left-3 bg-emerald-950/80 backdrop-blur-md text-primary-300 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                  OP & Triage Lounge
                </span>
              </div>
              <div className="p-6">
                <h4 className="font-heading font-bold text-lg text-emerald-950 mb-1">Central Reception Desk</h4>
                <p className="text-xs text-gray-500 font-light">Air-conditioned patient lounge, digital token management, and dedicated patient helpdesk.</p>
              </div>
            </div>

            {/* 24/7 Pharmacy Photo Card */}
            <div className="bg-[#fcfbf9] rounded-3xl overflow-hidden border border-emerald-900/10 shadow-md group">
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image 
                  src="/pharmacy.png" 
                  alt="Dhruva In-House Pharmacy" 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <span className="absolute top-3 left-3 bg-emerald-950/80 backdrop-blur-md text-primary-300 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                  24/7 Round-the-Clock
                </span>
              </div>
              <div className="p-6">
                <h4 className="font-heading font-bold text-lg text-emerald-950 mb-1">24/7 Pharmacy & Lab</h4>
                <p className="text-xs text-gray-500 font-light">100% genuine temperature-sensitive emergency drugs and fully automated diagnostics lab.</p>
              </div>
            </div>

          </div>

        </div>
      </section>



    </div>
  );
}
