'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, notFound } from 'next/navigation';
import { serviceCategories } from '@/lib/data';
import { CheckCircle2, ChevronLeft, Phone, Calendar, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function ServiceDetailPage() {
  const { id } = useParams();
  const { lang, t } = useLanguage();
  const category = serviceCategories.find((c) => c.id === id);

  if (!category) {
    notFound();
  }

  // Map of category IDs to high-quality images
  const images: Record<string, string> = {
    neonatal: '/consultation.png',
    fertility: '/fertility-room.png',
    pregnancy: '/room.jpg',
    gynaecology: '/operation-theatre.png',
    cancer: '/ot-doors.png',
    diagnostics: '/pharmacy.png',
  };

  const currentImage: string = images[category.id] || '/pharmacy.png';

  return (
    <div className="flex flex-col min-h-screen">
      {/* ─── HERO SECTION ─── */}
      <section className="relative h-[60vh] min-h-[400px] flex items-center overflow-hidden pt-32">
        <Image
          src={currentImage}
          alt={category.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-950 via-primary-900/60 to-transparent" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <Link 
            href="/services" 
            className="inline-flex items-center gap-2 text-primary-200 hover:text-white mb-8 transition-colors font-bold"
          >
            <ChevronLeft size={20} /> {t('Back to Services', 'సేవలకు తిరిగి వెళ్లండి', 'सेवाओं पर वापस जाएं')}
          </Link>
          <div className="max-w-2xl space-y-6">
            <div className="inline-flex items-center px-3.5 py-1.5 bg-white/10 backdrop-blur border border-white/20 rounded-full text-white text-xs font-semibold tracking-wider uppercase">
              <span>{t('Specialized Clinical Department', 'ప్రత్యేక క్లినికల్ విభాగం', 'विशेष नैदानिक ​​विभाग')}</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-white font-heading leading-tight">
              {t(category.name, category.teluguName, category.hindiName)}
            </h1>
            <p className="text-xl text-primary-100 leading-relaxed">
              {category.description}
            </p>
          </div>
        </div>
      </section>

      {/* ─── CONTENT SECTION ─── */}
      <section className="py-24 bg-white relative z-10 -mt-12 rounded-t-[60px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-16">
              <div className="space-y-8">
                <h2 className="text-4xl font-bold text-[#0a2e22] font-heading">
                  {t('Our Expertise in', 'మా నైపుణ్యం', 'हमारी विशेषज्ञता')} {t(category.name, category.teluguName, category.hindiName)}
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  {t('At Dhruva Hospitals, we combine clinical excellence with a compassionate approach to provide the best possible outcomes for our patients. Our team of specialists uses the latest technology and evidence-based protocols to ensure your health and well-being.',
                     'ధృవ హాస్పిటల్స్‌లో, మా రోగులకు సాధ్యమైనంత ఉత్తమమైన ఫలితాలను అందించడానికి మేము క్లినికల్ ఎక్సలెన్స్‌ను దయతో కూడిన విధానంతో మిళితం చేస్తాము. మీ ఆరోగ్యం మరియు సంక్షేమాన్ని నిర్ధారించడానికి మా నిపుణుల బృందం తాజా సాంకేతికతను మరియు ఆధారిత ప్రోటోకాల్‌లను ఉపయోగిస్తుంది.',
                     'ध्रुव हॉस्पिटल्स में, हम अपने मरीजों के लिए सर्वोत्तम संभव परिणाम प्रदान करने के लिए नैदानिक उत्कृष्टता को करुणामय दृष्टिकोण के साथ जोड़ते हैं। हमारी विशेषज्ञों की टीम आपके स्वास्थ्य और भलाई को सुनिश्चित करने के लिए नवीनतम तकनीक और साक्ष्य-आधारित प्रोटोकॉल का उपयोग करती है।')}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {category.services.map((service: string, i: number) => (
                  <div key={i} className="flex items-start gap-5 p-8 bg-gray-50 rounded-[40px] border border-gray-100 hover:bg-white hover:shadow-xl transition-all duration-300 group">
                    <div className="w-12 h-12 bg-emerald-50 text-[#0a2e22] rounded-2xl flex items-center justify-center border border-emerald-100 shrink-0 group-hover:scale-110 transition-transform">
                      <CheckCircle2 size={24} />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-[#0a2e22] mb-2">{service}</h4>
                      <p className="text-sm text-gray-500 leading-relaxed">
                        {t('Comprehensive care and advanced treatment protocols for', 'సమగ్ర సంరక్షణ మరియు అధునాతన చికిత్స ప్రోటోకాల్స్', 'व्यापक देखभाल और उन्नत उपचार प्रोटोकॉल')} {service.toLowerCase()}.
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-[#0a2e22] rounded-3xl p-10 md:p-12 text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-accent-500/10 rounded-full blur-3xl" />
                <div className="relative z-10 space-y-6">
                  <h3 className="text-3xl font-bold font-heading">{t('Why Choose Us?', 'మమ్మల్ని ఎందుకు ఎంచుకోవాలి?', 'हमें क्यों चुनें?')}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {[
                      t('Expert Fellowship-Trained Doctors', 'నిపుణులైన ఫెలోషిప్-శిక్షణ పొందిన వైద్యులు', 'विशेषज्ञ फेलोशिप-प्रशिक्षित डॉक्टर'),
                      t('24/7 Emergency & ICU Support', '24/7 ఎమర్జెన్సీ & ICU సపోర్ట్', '24/7 आपातकालीन और आईसीयू सहायता'),
                      t('Advanced Modular Operation Theaters', 'అధునాతన మాడ్యులర్ ఆపరేషన్ థియేటర్లు', 'उन्नत मॉड्यूलर ऑपरेशन थिएटर'),
                      t('Patient-Centric Transparent Care', 'రోగి-కేంద్రీకృత పారదర్శక సంరక్షణ', 'रोगी-केंद्रित पारदर्शी देखभाल'),
                      t('Modern Infrastructure & Equipment', 'ఆధునిక మౌలిక సదుపాయాలు & పరికరాలు', 'आधुनिक बुनियादी ढांचा और उपकरण'),
                      t('Affordable & Ethical Treatment', 'సరసమైన & నైతిక చికిత్స', 'किफायती और नैतिक उपचार')
                    ].map((point, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-accent-500 rounded-full" />
                        <span className="font-medium text-primary-100">{point}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar / Quick Actions */}
            <div className="space-y-8">
              <div className="bg-gray-50 rounded-[40px] p-10 border border-gray-100 sticky top-32">
                <h3 className="text-2xl font-bold text-[#0a2e22] font-heading mb-8">{t('Book an Appointment', 'అపాయింట్‌మెంట్ బుక్ చేయండి', 'अपॉइंटमेंट बुक करें')}</h3>
                <div className="space-y-6">
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {t('Consult with our specialists for a personalized treatment plan tailored to your needs.', 'మీ అవసరాలకు అనుగుణంగా వ్యక్తిగతీకరించిన చికిత్స ప్రణాళిక కోసం మా నిపుణులను సంప్రదించండి.', 'अपनी आवश्यकताओं के अनुरूप व्यक्तिगत उपचार योजना के लिए हमारे विशेषज्ञों से परामर्श लें।')}
                  </p>
                  <Link 
                    href="/contact" 
                    className="w-full bg-[#0a2e22] hover:bg-[#134937] text-white py-4 rounded-xl text-sm font-bold shadow-lg shadow-emerald-950/20 flex items-center justify-center gap-3 transition-colors"
                  >
                    <Calendar size={20} /> {t('Schedule Now', 'ఇప్పుడే షెడ్యూల్ చేయండి', 'अभी शेड्यूल करें')}
                  </Link>
                  <a 
                    href="tel:9036852311" 
                    className="w-full flex items-center justify-center gap-3 py-4 rounded-xl border border-stone-200 text-stone-800 font-bold text-sm hover:bg-stone-50 transition-all"
                  >
                    <Phone size={20} /> 9036852311
                  </a>
                </div>

                <div className="mt-12 pt-8 border-t border-gray-200">
                  <h4 className="font-bold text-[#0a2e22] mb-6">{t('Other Services', 'ఇతర సేవలు', 'अन्य सेवाएँ')}</h4>
                  <div className="space-y-4">
                    {serviceCategories.filter(c => c.id !== category.id).slice(0, 3).map((other) => (
                      <Link 
                        key={other.id} 
                        href={`/services/${other.id}`}
                        className="flex items-center justify-between group py-2"
                      >
                        <span className="text-gray-600 font-medium group-hover:text-primary-600 transition-colors">
                          {t(other.name, other.teluguName, other.hindiName)}
                        </span>
                        <ArrowRight size={16} className="text-gray-300 group-hover:text-primary-500 group-hover:translate-x-1 transition-all" />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>


    </div>
  );
}
