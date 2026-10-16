'use client';
import { useState } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { MapPin, Navigation, Phone, CheckCircle2 } from 'lucide-react';
import { contactInfo } from '@/lib/data';

interface TourItem {
  id: string;
  title: string;
  teluguTitle: string;
  hindiTitle: string;
  type: 'image' | 'map';
  image?: string;
  src?: string;
  badge: string;
  description: string;
  teluguDescription: string;
  features: string[];
}

const tours: TourItem[] = [
  {
    id: 'ot',
    title: 'Modular Operation Theatre',
    teluguTitle: 'మాడ్యులర్ ఆపరేషన్ థియేటర్',
    hindiTitle: 'मॉड्यूलर ऑपरेशन थिएटर',
    type: 'image',
    image: '/operation-theatre.png',
    badge: 'NABH Standard Surgical Complex',
    description: 'Equipped with laminar airflow, HEPA filters, C-arm imaging, and advanced multi-parameter monitors for high-precision laparoscopic and laser surgeries.',
    teluguDescription: 'లామినార్ ఎయిర్‌ఫ్లో, HEPA ఫిల్టర్లు మరియు అధునాతన లాప్రోస్కోపిక్ మరియు లేజర్ సర్జరీ సౌకర్యాలు.',
    features: ['Laminar Airflow & Ultra-Clean Air', 'High-Definition Laparoscopy Tower', 'Laser Surgical Equipment', 'Dedicated C-Arm Imaging']
  },
  {
    id: 'nicu',
    title: 'Level-III NICU Ward',
    teluguTitle: 'లెవల్-3 నియోనాటల్ ICU (NICU)',
    hindiTitle: 'लेवल-3 एनआईसीयू वार्ड',
    type: 'image',
    image: '/nicu.png',
    badge: 'Advanced Newborn Critical Care',
    description: 'State-of-the-art Neonatal ICU under Dr. Sudarshan Reddy (Apollo & Ankura trained) with servo-controlled warmers, bubble CPAP, and high-frequency ventilation.',
    teluguDescription: 'డాక్టర్ సుదర్శన్ రెడ్డి గారి పర్యవేక్షణలో అత్యున్నత స్థాయి నవజాత శిశు సంరక్షణ విభాగం.',
    features: ['Servo Incubators & Baby Warmers', 'Bubble CPAP & HFNC Support', 'Double Surface LED Phototherapy', '24/7 Arterial Blood Gas (ABG) Lab']
  },
  {
    id: 'reception',
    title: 'Executive Reception & Lounge',
    teluguTitle: 'ఎగ్జిక్యూటివ్ రిసెప్షన్ & లాంజ్',
    hindiTitle: 'स्वागत कक्ष और लाउंज',
    type: 'image',
    image: '/reception-real.png',
    badge: 'Patient Experience & OP Desk',
    description: 'Comfortable air-conditioned reception and patient helpdesk providing immediate triage, digital token OP management, and patient guidance.',
    teluguDescription: 'సత్వర రిజిస్ట్రేషన్, రోగి సంరక్షణ సహాయ కేంద్రం మరియు సౌకర్యవంతమైన లాంజ్.',
    features: ['Instant OP Registration', 'Dedicated Patient Helpdesk', 'Air-Conditioned Waiting Lounge', 'Wheelchair & Stretcher Access']
  },
  {
    id: 'consultation',
    title: 'Specialist Consultation Suites',
    teluguTitle: 'కన్సల్టేషన్ గదులు',
    hindiTitle: 'परामर्श कक्ष',
    type: 'image',
    image: '/consultation.png',
    badge: 'Private & Confidential Clinical Chambers',
    description: 'Sound-insulated private chambers with dedicated ultrasound imaging for comprehensive gynaecological, paediatric, and general physician consultations.',
    teluguDescription: 'పూర్తి గోప్యతతో కూడిన ప్రైవేట్ కన్సల్టేషన్ గదులు మరియు అల్ట్రాసౌండ్ స్కానింగ్.',
    features: ['Dedicated Ultrasound Scanner', 'Private Examination Area', 'Confidential Couple Counseling', 'Direct EHR Record Integration']
  },
  {
    id: 'pharmacy',
    title: '24/7 In-House Pharmacy & Lab',
    teluguTitle: '24/7 ఫార్మసీ & ల్యాబ్',
    hindiTitle: '24/7 फार्मेसी और लैब',
    type: 'image',
    image: '/pharmacy.png',
    badge: 'Round-the-Clock Emergency Support',
    description: 'Fully stocked in-house pharmacy with 100% genuine temperature-sensitive emergency medicines and fully automated diagnostic pathology lab.',
    teluguDescription: 'అన్ని రకాల అత్యవసర మందులు మరియు పూర్తి ఆటోమేటెడ్ పాథాలజీ ల్యాబ్ 24 గంటలు అందుబాటులో ఉంటాయి.',
    features: ['100% Genuine Temperature-Controlled Drugs', 'Emergency ICU & Pediatric Formulations', 'Rapid Diagnostic Results within 30 Mins', 'Digital & Transparent Billing']
  },
  {
    id: 'location',
    title: 'Hospital Location & Directions',
    teluguTitle: 'లొకేషన్ & రూట్ మ్యాప్',
    hindiTitle: 'स्थान और मार्ग निर्देश',
    type: 'map',
    src: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3863.35372360339!2d78.8227563!3d14.464366700000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bb373c82b1a61ab%3A0x9b0e503d88df328c!2sDhruva%20Hospitals%2C%20Kadapa!5e0!3m2!1sen!2sin!4v1791578886770!5m2!1sen!2sin',
    badge: 'Centrally Located in Kadapa City',
    description: 'Located in Dwaraka Nagar, adjacent to Rythu Bazar and near Kadapa RTC Bus Stand. Easily accessible with 24/7 emergency ambulance drop-off.',
    teluguDescription: 'కడప ఆర్టీసీ బస్టాండ్ సమీపంలో, ద్వారకా నగర్, రైతు బజార్ ప్రక్కన ఉంది.',
    features: ['Near Kadapa RTC Central Bus Stand', 'Opposite Sandhya Circle / Rythu Bazar', 'Dedicated Ambulance Bay & Ramp Access', 'Ample Parking for Patients & Visitors']
  }
];

export default function VirtualTourSequence() {
  const { t } = useLanguage();
  const [activeTour, setActiveTour] = useState<TourItem>(tours[0]!);

  return (
    <section className="py-24 lg:py-32 bg-[#f8faf9] text-stone-900 relative overflow-hidden border-b border-stone-200">
      {/* Subtle Architectural Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#0a2e22_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.03] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-14 max-w-3xl mx-auto">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-[#0a2e22] text-xs font-bold uppercase tracking-widest mb-5">
            <span>{t('Hospital Infrastructure & Suites', 'హాస్పిటల్ సౌకర్యాలు & మౌలిక సదుపాయాలు', 'अस्पताल के बुनियादी ढांचे का दौरा')}</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#0a2e22] leading-tight">
            <span className="italic font-light text-[#9b7745]">{t('Step Inside', 'లోపలికి అడుగు పెట్టండి', 'अंदर कदम रखें')}</span><br/>
            {t('Our State-of-the-Art Facility.', 'మా అత్యాధునిక సౌకర్యం.', 'हमारी अत्याधुनिक सुविधा।')}
          </h2>

          <p className="text-stone-600 mt-5 text-base md:text-lg max-w-2xl mx-auto font-normal leading-relaxed">
            {t(
              'Explore Dhruva Hospitals’ dedicated clinical suites, sterile operation theatres, and Level-3 NICU designed to deliver exceptional medical outcomes in Kadapa.',
              'కడపలో అద్భుతమైన వైద్య ఫలితాలను అందించడానికి రూపొందించబడిన మా అధునాతన ఆపరేషన్ థియేటర్లు మరియు లెవల్-3 NICUను పరిశీలించండి.',
              'कडप्पा में असाधारण चिकित्सा परिणाम देने के लिए डिज़ाइन किए गए हमारे समर्पित सुइट्स और लेवल-3 एनआईसीयू का अन्वेषण करें।'
            )}
          </p>
        </div>

        {/* FACILITY SELECTOR PILLS */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-10">
          {tours.map((tour) => {
            const isActive = activeTour.id === tour.id;
            return (
              <button
                key={tour.id}
                onClick={() => setActiveTour(tour)}
                className={`px-5 py-2.5 rounded-xl text-xs md:text-sm font-bold tracking-wide transition-all duration-300 ${
                  isActive
                    ? 'bg-[#0a2e22] text-white shadow-md shadow-[#0a2e22]/20 scale-105'
                    : 'bg-white text-stone-700 hover:bg-stone-50 hover:text-[#0a2e22] border border-stone-200 shadow-xs'
                }`}
              >
                <span>{t(tour.title, tour.teluguTitle, tour.hindiTitle)}</span>
              </button>
            );
          })}
        </div>

        {/* ACTIVE TOUR SHOWCASE CARD */}
        <div className="bg-white border border-stone-200 rounded-3xl overflow-hidden shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            
            {/* Visual Screen (Photo or Map) */}
            <div className="lg:col-span-8 relative aspect-[16/10] md:aspect-[16/9] lg:aspect-auto min-h-[380px] md:min-h-[480px] bg-stone-100">
              {activeTour.type === 'image' && activeTour.image ? (
                <>
                  <Image
                    src={activeTour.image}
                    alt={activeTour.title}
                    fill
                    className="object-cover object-center transition-all duration-700"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                </>
              ) : (
                <iframe
                  src={activeTour.src}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full min-h-[400px] border-0"
                />
              )}

              {/* Status Badge */}
              <div className="absolute top-5 left-5 bg-white/90 backdrop-blur-md border border-stone-200/80 px-4 py-2 rounded-full flex items-center gap-2.5 shadow-sm">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
                <span className="text-xs font-bold text-[#0a2e22] tracking-wide">{activeTour.badge}</span>
              </div>
            </div>

            {/* Information Panel */}
            <div className="lg:col-span-4 p-8 md:p-10 flex flex-col justify-between bg-[#fafcfa] border-t lg:border-t-0 lg:border-l border-stone-200">
              <div className="space-y-6">
                <div>
                  <span className="text-[#9b7745] font-mono text-xs uppercase tracking-widest font-bold block mb-2">
                    Dhruva Infrastructure
                  </span>
                  <h3 className="text-2xl md:text-3xl font-serif font-bold text-[#0a2e22]">
                    {t(activeTour.title, activeTour.teluguTitle, activeTour.hindiTitle)}
                  </h3>
                </div>

                <p className="text-stone-600 text-sm leading-relaxed font-normal">
                  {t(activeTour.description, activeTour.teluguDescription, activeTour.description)}
                </p>

                {/* Key Features Bullet List */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#0a2e22]">
                    {t('Key Highlights', 'ప్రధాన ముఖ్యాంశాలు', 'प्रमुख विशेषताएं')}
                  </h4>
                  <ul className="space-y-2.5">
                    {activeTour.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs md:text-sm text-stone-700">
                        <CheckCircle2 size={16} className="text-[#9b7745] shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Bottom Action */}
              <div className="pt-8 border-t border-stone-200 mt-8 flex flex-col sm:flex-row gap-3">
                {activeTour.type === 'map' ? (
                  <a
                    href="https://maps.google.com/?q=Dhruva+Hospitals+Kadapa"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#0a2e22] hover:bg-[#134937] text-white font-bold rounded-xl text-sm transition-colors shadow-md"
                  >
                    <Navigation size={16} />
                    <span>{t('Get Driving Directions', 'రూట్ మ్యాప్ పొందండి', 'दिशा-निर्देश प्राप्त करें')}</span>
                  </a>
                ) : (
                  <a
                    href={`tel:${contactInfo.phones[0]}`}
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white hover:bg-stone-50 text-[#0a2e22] font-bold rounded-xl text-sm transition-colors border border-stone-200 shadow-xs"
                  >
                    <span>{t('Inquire Facility Availability', 'సౌకర్యం వివరాలు అడగండి', 'सुविधा की जानकारी लें')}</span>
                  </a>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* Location Highlights Footer Strip */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-center md:text-left">
          <div className="bg-white border border-stone-200 p-5 rounded-2xl flex items-center gap-4 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#0a2e22] flex items-center justify-center shrink-0 border border-emerald-100">
              <MapPin size={20} />
            </div>
            <div>
              <p className="text-[11px] text-stone-500 font-medium">Hospital Address</p>
              <p className="text-xs text-stone-900 font-bold line-clamp-1">{contactInfo.address}</p>
            </div>
          </div>

          <div className="bg-white border border-stone-200 p-5 rounded-2xl flex items-center gap-4 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#0a2e22] flex items-center justify-center shrink-0 border border-emerald-100">
              <CheckCircle2 size={20} />
            </div>
            <div>
              <p className="text-[11px] text-stone-500 font-medium">Clinical Standards & Hygiene</p>
              <p className="text-xs text-stone-900 font-bold">NABH Standard Infection Control & Safety</p>
            </div>
          </div>

          <div className="bg-white border border-stone-200 p-5 rounded-2xl flex items-center gap-4 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#0a2e22] flex items-center justify-center shrink-0 border border-emerald-100">
              <Phone size={18} />
            </div>
            <div>
              <p className="text-[11px] text-stone-500 font-medium">Emergency Care</p>
              <p className="text-xs text-stone-900 font-bold">24/7 Casualty & Immediate Resuscitation Wing</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
