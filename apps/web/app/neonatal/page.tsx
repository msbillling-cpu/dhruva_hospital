'use client';
import Image from 'next/image';
import Link from 'next/link';
import { 
  HeartPulse, Baby, Clock, 
  Syringe, CheckCircle2, Phone, Calendar 
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { contactInfo } from '@/lib/data';

export default function NeonatalPage() {
  const { lang, t } = useLanguage();

  return (
    <div className="flex flex-col bg-white">
      {/* ─── 1. LUMINOUS HERO SECTION ─── */}
      <section className="relative pt-36 pb-24 lg:pt-44 lg:pb-32 bg-gradient-to-b from-[#f8faf9] via-white to-[#f4f7f5] text-stone-900 border-b border-stone-200 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#0a2e22_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.03] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Column */}
            <div className="lg:col-span-7 space-y-7">
              <div className="inline-flex items-center px-3.5 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full text-[#0a2e22] text-xs font-bold uppercase tracking-wider">
                <span>{t('Level-III NICU & Neonatal Critical Care', 'లెవల్-III NICU క్రిటికల్ కేర్', 'स्तर-III एनआईसीयू क्रिटिकल केयर')}</span>
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-bold text-[#0a2e22] leading-[1.08] tracking-tight">
                {t('Giving Every Newborn', 'ప్రతి నవజాత శిశువుకు', 'हर नवजात शिशु को')} <br />
                <span className="italic font-light text-[#9b7745]">
                  {t('a Strong, Safe Start.', 'బలమైన, సురక్షితమైన ఆరంభం.', 'एक मजबूत, सुरक्षित शुरुआत।')}
                </span>
              </h1>

              <p className="text-base sm:text-lg text-stone-600 leading-relaxed font-normal max-w-2xl">
                {t(
                  'Equipped with advanced German & Japanese incubators, high-frequency oscillatory ventilation, and round-the-clock neonatal intensive care led by Hospital Founder & Senior Neonatologist Dr. Sudarshan Reddy K (DNB Peds, Apollo; IAP Neonatology Fellow, Ankura).',
                  'అత్యాధునిక ఇంక్యుబేటర్లు, వెంటిలేషన్ మరియు హాస్పిటల్ వ్యవస్థాపకుడు & సీనియర్ నియోనాటాలజిస్ట్ డాక్టర్ సుదర్శన్ రెడ్డి గారి పర్యవేక్షణలో 24/7 నవజాత శిశు నిపుణులతో ప్రాణదానమైన సహాయం అందించే కడప యొక్క ప్రధాన కేర్ యూనిట్.',
                  'उन्नत इनक्यूबेटर, वेंटिलेशन और अस्पताल के संस्थापक एवं वरिष्ठ नवजात रोग विशेषज्ञ डॉ. सुदर्शन रेड्डी के नेतृत्व में 24/7 नवजात क्रिटिकल केयर यूनिट।'
                )}
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a 
                  href="tel:9036852311" 
                  className="flex items-center gap-3.5 bg-red-50 hover:bg-red-100/80 border border-red-200 px-5 py-3.5 rounded-2xl transition-all shadow-xs"
                >
                  <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center shadow-sm">
                    <Phone size={18} />
                  </div>
                  <div className="text-left">
                    <span className="block text-[10px] uppercase font-bold text-red-600 tracking-wider">24/7 NICU Emergency</span>
                    <span className="text-base font-mono font-bold text-stone-900">9036852311</span>
                  </div>
                </a>

                <Link
                  href="/contact"
                  className="px-7 py-4 bg-[#0a2e22] hover:bg-[#134937] text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-[#0a2e22]/20 flex items-center gap-2"
                >
                  <Calendar size={16} className="text-[#c5a880]" />
                  <span>{t('Consult Pediatrician', 'పీడియాట్రీషియన్‌ను సంప్రదించండి', 'बाल रोग विशेषज्ञ से परामर्श')}</span>
                </Link>
              </div>
            </div>

            {/* Right Column: High Definition Image Card */}
            <div className="lg:col-span-5">
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border border-stone-200 bg-stone-100">
                <Image
                  src="/nicu.png"
                  alt="Dhruva Hospital Level-III NICU Care"
                  fill
                  className="object-cover object-center"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <span className="text-xs uppercase tracking-widest text-[#c5a880] font-mono font-bold block mb-1">
                    Tertiary Intensive Care
                  </span>
                  <p className="text-lg font-serif font-bold">
                    Zero-Infection Sterile NICU Suites
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─── 2. NICU CLINICAL CAPABILITIES ─── */}
      <section className="py-24 lg:py-32 bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mb-16">
            <div className="inline-flex items-center px-3.5 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full text-[#0a2e22] text-xs font-bold uppercase tracking-wider mb-4">
              <span>{t('Tertiary Capabilities', 'క్లినికల్ సామర్థ్యాలు', 'नैदानिक क्षमताएं')}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#0a2e22] leading-tight">
              {t('Advanced Neonatal', 'అధునాతన నవజాత శిశు', 'उन्नत नवजात')} <br />
              <span className="italic font-light text-[#9b7745]">
                {t('Intensive Care Infrastructure.', 'ఇంటెన్సివ్ కేర్ మౌలిక సదుపాయాలు.', 'गहन देखभाल अवसंरचना।')}
              </span>
            </h2>
            <p className="text-stone-600 text-base md:text-lg mt-5 font-normal leading-relaxed">
              {t(
                'Our Level III NICU is specifically engineered to support extremely low birth weight babies (under 1000g), preterm deliveries before 28 weeks, and complex neonatal resuscitation with continuous multi-parameter monitoring.',
                'మా లెవల్ III NICU తక్కువ బరువుతో మరియు నెలలు నిండకుండా పుట్టిన శిశువులకు 24/7 వైద్య పర్యవేక్షణతో నైపుణ్యమైన సంరక్షణను అందిస్తుంది.',
                'हमारा लेवल III एनआईसीयू विशेष रूप से 24/7 निगरानी के साथ समय से पहले जन्मे बच्चों और गंभीर रूप से बीमार नवजात शिशुओं की देखभाल के लिए डिज़ाइन किया गया है।'
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { 
                icon: Baby, 
                title: t('Preterm & ELBW Care', 'ప్రీటర్మ్ కేర్', 'समय से पहले देखभाल'), 
                desc: t('Expert management for micro-preemies born before 28 weeks with surfactant therapy.', '28 వారాల కంటే ముందు పుట్టిన శిశువులకు నిపుణుల సంరక్షణ.', 'समय से पहले पैदा हुए बच्चों के लिए विशेषज्ञ प्रबंधन।')
              },
              { 
                icon: HeartPulse, 
                title: t('Advanced Ventilation', 'శ్వాసకోశ సహాయం', 'श्वसन सहायता'), 
                desc: t('High-Frequency Oscillatory Ventilation (HFOV), CPAP, and heated humidified HFNC.', 'శ్వాస ఇబ్బందుల కోసం అధునాతన HFNC మరియు CPAP.', 'साँस लेने में कठिनाई के लिए उन्नत HFNC और CPAP।')
              },
              { 
                icon: CheckCircle2, 
                title: t('24/7 Bedside Monitoring', '24/7 వైటల్ మానిటరింగ్', '24/7 महत्वपूर्ण निगरानी'), 
                desc: t('Real-time hemodynamic arterial blood pressure, continuous capnography, and core temperature tracking.', 'ఆక్సిజన్, హృదయ స్పందన రేటు మరియు ఉష్ణోగ్రత యొక్క నిరంతర పర్యవేక్షణ.', 'ऑक्सीजन, हृदय गति और तापमान की निरंतर ट्रैकिंग।')
              },
              { 
                icon: Clock, 
                title: t('Rapid Resuscitation Bay', 'త్వరిత ప్రతిస్పందన', 'त्वरित प्रतिक्रिया'), 
                desc: t('Dedicated round-the-clock neonatal emergency resuscitation team stationed in the hospital.', 'నవజాత శిశు అత్యవసర బృందం రోజుకు 24 గంటలు సిద్ధంగా ఉంటుంది.', 'नवजात आपातकालीन टीम दिन के 24 घंटे तैयार रहती है।')
              }
            ].map((feature, i) => (
              <div 
                key={i} 
                className="bg-[#fafcfa] rounded-3xl p-7 border border-stone-200 hover:border-emerald-700/30 hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 bg-emerald-50 text-[#0a2e22] rounded-2xl flex items-center justify-center mb-6 border border-emerald-100">
                    <feature.icon size={22} className="text-[#9b7745]" />
                  </div>
                  <h3 className="text-lg font-serif font-bold text-[#0a2e22] mb-2">{feature.title}</h3>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ─── 3. PEDIATRIC & CHILD HEALTHCARE ─── */}
      <section className="py-24 lg:py-32 bg-[#f8faf9] border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <span className="text-[#9b7745] font-mono text-xs uppercase tracking-widest font-bold block mb-2">
              Continuum of Care
            </span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#0a2e22]">
              {t('Comprehensive Child Healthcare.', 'సమగ్ర పిల్లల ఆరోగ్య సంరక్షణ.', 'व्यापक बाल स्वास्थ्य देखभाल।')}
            </h2>
            <p className="text-stone-600 mt-4 text-base md:text-lg font-normal leading-relaxed">
              {t(
                'Ensuring healthy development from infancy through adolescence with compassionate pediatric care and evidence-based protocols.',
                'పిల్లల దశ నుండి బాల్యం వరకు ఆరోగ్యకరమైన పెరుగుదలను నిపుణులైన పీడియాట్రిక్ నైపుణ్యంతో నిర్ధారించడం.',
                'विशेष बाल चिकित्सा विशेषज्ञता के साथ बचपन के माध्यम से स्वस्थ विकास सुनिश्चित करना।'
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Baby,
                title: t('Growth & Neurodevelopment', 'పెరుగుదల పర్యవేక్షణ', 'विकास की निगरानी'),
                desc: t('Meticulous developmental assessment, cognitive milestones, and nutritional counseling for infants and young children.', 'ఆరోగ్యకరమైన బాల్యం కోసం శారీరక మరియు అభివృద్ధి మైలురాళ్ల యొక్క ఖచ్చితమైన ట్రాకింగ్.', 'एक स्वस्थ बचपन के लिए शारीरिक और विकासात्मक मील के पत्थर की सावधानीपूर्वक ट्रैकिंग।')
              },
              {
                icon: Syringe,
                title: t('IAP Immunization Clinic', 'టీకాల కేంద్రం', 'टीकाकरण केंद्र'),
                desc: t('Strict temperature-controlled vaccine administration adhering to Indian Academy of Pediatrics (IAP) schedules.', 'IAP మార్గదర్శకాల ప్రకారం పూర్తి రోగనిరోధక షెడ్యూల్స్.', 'आईएपी दिशानिर्देशों के अनुसार पूर्ण टीकाकरण कार्यक्रम।')
              },
              {
                icon: HeartPulse,
                title: t('Neonatal Jaundice Care', 'జాండీస్ నిర్వహణ', 'पीलिया प्रबंधन'),
                desc: t('Intensive narrow-band LED phototherapy and exchange transfusion facilities for high bilirubin management.', 'నవజాత శిశు కామెర్ల సమర్థవంతమైన చికిత్స కోసం సరికొత్త ఫోటోథెరపీ టెక్నాలజీ.', 'नवजात पीलिया के प्रभावी उपचार के लिए नवीनतम फोटोथेरेपी तकनीक।')
              }
            ].map((service, i) => (
              <div 
                key={i} 
                className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-stone-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-left"
              >
                <div className="w-14 h-14 bg-emerald-50 text-[#0a2e22] rounded-2xl flex items-center justify-center mb-6 border border-emerald-100">
                  <service.icon size={26} className="text-[#9b7745]" />
                </div>
                <h3 className="text-xl font-serif font-bold text-[#0a2e22] mb-3">{service.title}</h3>
                <p className="text-stone-600 text-sm leading-relaxed">{service.desc}</p>
              </div>
            ))}
          </div>

          {/* Founder's Pediatric OPD Clinic Spotlight */}
          <div className="mt-16 bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xl grid grid-cols-1 lg:grid-cols-12 items-center">
            <div className="lg:col-span-5 relative aspect-[4/3] lg:aspect-auto lg:h-full min-h-[300px]">
              <Image
                src="/consultation.png"
                alt="Dr. Sudarshan Reddy K examining a child patient in pediatric OPD"
                fill
                className="object-cover object-center"
              />
            </div>
            <div className="lg:col-span-7 p-8 md:p-12 space-y-5 text-left">
              <div className="inline-flex items-center px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-full text-[#0a2e22] text-xs font-bold uppercase tracking-wider">
                <span>{t('Founder Consultation Clinic', 'వ్యవస్థాపక వైద్యుల కన్సల్టేషన్', 'संस्थापक परामर्श क्लिनिक')}</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#0a2e22]">
                {t('Personalized Pediatric OPD Care with Dr. Sudarshan Reddy K', 'డాక్టర్ సుదర్శన్ రెడ్డి గారితో వ్యక్తిగత పీడియాట్రిక్ సంరక్షణ', 'डॉ. सुदर्शन रेड्डी के साथ व्यक्तिगत बाल रोग देखभाल')}
              </h3>
              <p className="text-stone-600 text-sm sm:text-base leading-relaxed font-normal">
                {t(
                  'As the Founder of Dhruva Hospitals and a fellowship-trained Neonatologist and Children’s Doctor, Dr. Sudarshan Reddy provides comprehensive clinical evaluations for newborns, infants, and growing children with compassionate bedside care.',
                  'ధృవ హాస్పిటల్స్ వ్యవస్థాపకుడు మరియు నవజాత శిశు నిపుణుడిగా (నియోనాటాలజిస్ట్), డాక్టర్ సుదర్శన్ రెడ్డి గారు పిల్లల సంరక్షణలో అత్యున్నత వైద్య ప్రమాణాలను అందిస్తున్నారు.',
                  'ध्रुव हॉस्पिटल्स के संस्थापक और वरिष्ठ नवजात रोग विशेषज्ञ के रूप में, डॉ. सुदर्शन रेड्डी बच्चों की देखभाल में उच्चतम नैदानिक मानक प्रदान करते हैं।'
                )}
              </p>
              <div className="pt-2">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#0a2e22] hover:bg-[#134937] text-white font-bold rounded-xl text-xs sm:text-sm transition-all shadow-md shadow-[#0a2e22]/20"
                >
                  <Calendar size={16} className="text-[#c5a880]" />
                  <span>{t('Book Pediatric Consultation', 'పీడియాట్రిక్ అపాయింట్‌మెంట్ బుక్ చేయండి', 'बाल रोग परामर्श बुक करें')}</span>
                </Link>
              </div>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
