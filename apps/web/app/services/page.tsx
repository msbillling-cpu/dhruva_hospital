'use client';
import Link from 'next/link';
import ServiceCard from '@/components/ServiceCard';
import { serviceCategories } from '@/lib/data';
import { CheckCircle2, Microscope, Stethoscope, Heart, Baby } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function ServicesPage() {
  const { lang, t } = useLanguage();

  return (
    <div className="flex flex-col">
      {/* ─── HERO SECTION ─── */}
      <section className="relative pt-36 pb-20 bg-gradient-to-b from-[#f8faf9] via-white to-[#f4f7f5] text-stone-900 border-b border-stone-200 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#0a2e22_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.03] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center px-3.5 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full text-[#0a2e22] text-xs font-bold uppercase tracking-wider mb-6">
              <span>{t('Comprehensive Clinical Specialties', 'సమగ్ర క్లినికల్ విభాగాలు', 'व्यापक नैदानिक ​​विशिष्टताएं')}</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-[#0a2e22] mb-6 leading-tight">
              {t('Advanced Surgical & Clinical Departments.', 'అధునాతన సర్జికల్ & క్లినికల్ విభాగాలు.', 'उन्नत सर्जिकल और नैदानिक विभाग।')}
            </h1>
            <p className="text-lg text-stone-600 leading-relaxed max-w-2xl font-normal">
              {t('From fertility medicine and high-risk maternity to Level-III neonatal intensive care and minimally invasive laparoscopy in Kadapa.',
                 'కడపలో సంతానలేమి చికిత్స మరియు హై-రిస్క్ ప్రసూతి నుండి లెవల్-III నియోనాటల్ ఇంటెన్సివ్ కేర్ మరియు లాపరోస్కోపిక్ సర్జరీ వరకు.',
                 'कडप्पा में प्रजनन चिकित्सा और उच्च जोखिम वाले मातृत्व से लेकर स्तर-III नवजात गहन देखभाल और लेप्रोस्कोपी तक।')}
            </p>
          </div>
        </div>
      </section>

      {/* ─── SERVICES GRID ─── */}
      <section className="py-24 bg-white relative z-10 -mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {serviceCategories.map((category) => (
              <div key={category.id} id={category.id} className="scroll-mt-32">
                <ServiceCard category={category} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── DETAILED SECTIONS ─── */}
      <section className="py-24 bg-[#f8fbff] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-32">
          
          {/* Fertility Highlight */}
          <div id="fertility" className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center scroll-mt-32">
            <div className="space-y-8">
              <div className="w-20 h-20 bg-rose-100 rounded-[30px] flex items-center justify-center text-rose-600 shadow-lg">
                <Heart size={40} />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-primary-900 font-heading leading-tight">
                {t('Pioneering', 'అగ్రగామిగా', 'अग्रणी')} <span className="text-rose-600">{t('Fertility', 'ఫెర్టిలిటీ', 'प्रजनन')}</span> {t('Solutions', 'పరిష్కారాలు', 'समाधान')}
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                {t('Our fertility clinic is the most advanced in Kadapa, featuring a modular embryology lab and world-class ICSI facilities.',
                   'మా ఫెర్టిలిటీ క్లినిక్ కడపలో అత్యంత అధునాతనమైనది, ఇందులో మాడ్యులర్ ఎంబ్రియాలజీ ల్యాబ్ మరియు ప్రపంచ స్థాయి ICSI సదుపాయాలు ఉన్నాయి.',
                   'हमारा प्रजनन क्लिनिक कडप्पा में सबसे उन्नत है, जिसमें एक मॉड्यूलर भ्रूणविज्ञान लैब और विश्व स्तरीय आईसीएसआई सुविधाएं हैं।')}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  { title: t('IUI & IVF', 'IUI & IVF', 'आईयूआई और आईवीएफ'), desc: t('Success rates matching international standards.', 'అంతర్జాతీయ ప్రమాణాలకు సరిపోయే విజయావకాశాలు.', 'अंतरराष्ट्रीय मानकों से मेल खाती सफलता दर।') },
                  { title: t('Advanced ICSI', 'అధునాతన ICSI', 'उन्नत आईसीएसआई'), desc: t('Precision technology for male infertility.', 'పురుష వంధ్యత్వం కోసం ఖచ్చితమైన సాంకేతికత.', 'पुरुष बांझपन के लिए सटीक तकनीक।') },
                  { title: t('Semen Analysis', 'వీర్య విశ్లేషణ', 'वीर्य विश्लेषण'), desc: t('Computer-aided diagnostic testing.', 'కంప్యూటర్ ఆధారిత డయాగ్నస్టిక్ టెస్టింగ్.', 'कंप्यूटर सहायता प्राप्त नैदानिक परीक्षण।') },
                  { title: t('Ovulation Study', 'అండం పెరుగుదల అధ్యయనం', 'ओव्यूलेशन अध्ययन'), desc: t('Meticulous follicular monitoring.', 'ఖచ్చితమైన ఫోలిక్యులర్ పర్యవేక్షణ.', 'सावधानीपूर्वक कूपिक निगरानी।') },
                ].map((item, i) => (
                  <div key={i} className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm">
                    <h4 className="font-bold text-primary-800 mb-1">{item.title}</h4>
                    <p className="text-xs text-gray-500">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-rose-50 rounded-[60px] p-12 relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-rose-200 rounded-full blur-3xl" />
              <ul className="space-y-6">
                {[
                  t('Personalized fertility protocols', 'వ్యక్తిగతీకరించిన ఫెర్టిలిటీ ప్రోటోకాల్స్', 'व्यक्तिगत प्रजनन प्रोटोकॉल'),
                  t('High success rates in first cycle', 'మొదటి సైకిల్‌లోనే అధిక విజయావకాశాలు', 'पहले चक्र में उच्च सफलता दर'),
                  t('Transparent cost structures', 'పారదర్శక ధరల విధానం', 'पारदर्शी लागत संरचनाएं'),
                  t('Compassionate emotional support', 'దయతో కూడిన మానసిక మద్దతు', 'करुणामय भावनात्मक समर्थन'),
                  t('Pre-conception genetic screening', 'గర్భధారణకు ముందు జెనెటిక్ స్క్రీనింగ్', 'पूर्व-गर्भाधान आनुवंशिक स्क्रीनिंग')
                ].map((point, i) => (
                  <li key={i} className="flex items-center gap-4 text-gray-700 font-bold">
                    <CheckCircle2 className="text-rose-500" size={24} />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Maternity & NICU Highlight */}
          <div id="neonatal" className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center scroll-mt-32">
            <div className="lg:order-2 space-y-8">
              <div className="w-20 h-20 bg-cyan-100 rounded-[30px] flex items-center justify-center text-cyan-600 shadow-lg">
                <Baby size={40} />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-primary-900 font-heading leading-tight">
                {t('Neonatal &', 'నవజాత శిశు &', 'नवजात और')} <span className="text-[#9b7745]">{t('Paediatric Care', 'పిల్లల సంరక్షణ', 'बाल रोग देखभाल')}</span>
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                {t('Led by Hospital Founder & Senior Neonatologist Dr. Sudarshan Reddy K, we provide continuous care from Level-III NICU survival to comprehensive pediatric OPD and child wellness.',
                   'హాస్పిటల్ వ్యవస్థాపకుడు & సీనియర్ నియోనాటాలజిస్ట్ డాక్టర్ సుదర్శన్ రెడ్డి గారి పర్యవేక్షణలో, మా విభాగం లెవల్-III NICU మరియు సమగ్ర పిల్లల వైద్య సేవలను అందిస్తుంది.',
                   'अस्पताल के संस्थापक और वरिष्ठ नवजात रोग विशेषज्ञ डॉ. सुदर्शन रेड्डी के नेतृत्व में हम लेवल-III एनआईसीयू और बाल रोग ओपीडी सेवाएं प्रदान करते हैं।')}
              </p>
              <div className="space-y-4">
                {[
                  t('Founder Consultation with Dr. Sudarshan Reddy K', 'వ్యవస్థాపక వైద్యులు డాక్టర్ సుదర్శన్ రెడ్డి గారితో సంప్రదింపులు', 'संस्थापक डॉ. सुदर्शन रेड्डी के साथ परामर्श'),
                  t('Level III NICU with specialized neonatologists', 'నిపుణులైన నియోనాటాలజిస్టులతో లెవల్ III NICU', 'विशेषज्ञ नियोनेटोलॉजिस्ट के साथ लेवल III एनआईसीयू'),
                  t('High-Frequency Oscillatory Ventilation & CPAP', 'అధునాతన వెంటిలేషన్ & CPAP సహాయం', 'उन्नत वेंटिलेशन और सीपीएपी सहायता'),
                  t('IAP Immunization Clinic & Growth Milestones', 'టీకాల కేంద్రం & పెరుగుదల పర్యవేక్షణ', 'टीकाकरण क्लिनिक और विकास की निगरानी')
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-emerald-100">
                    <div className="w-2 h-2 bg-emerald-600 rounded-full" />
                    <span className="text-sm font-bold text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:order-1 relative rounded-[60px] overflow-hidden shadow-2xl border-[16px] border-white">
              <img 
                src="/consultation.png" 
                alt="Dr. Sudarshan Reddy K examining a child patient" 
                className="w-full h-[600px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/75 via-transparent to-transparent flex items-end p-12">
                <div>
                  <span className="text-xs uppercase font-mono tracking-widest text-[#c5a880] block font-bold mb-1">
                    Pediatric OPD & Neonatal Directorate
                  </span>
                  <p className="text-white text-2xl font-bold font-serif">{t('Founder • Dr. Sudarshan Reddy K', 'వ్యవస్థాపకుడు • డా|| సుదర్శన్ రెడ్డి', 'संस्थापक • डॉ. सुदर्शन रेड्डी')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Gynaecology Highlight */}
          <div id="gynaecology" className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center scroll-mt-32">
            <div className="space-y-8">
              <div className="w-20 h-20 bg-indigo-100 rounded-[30px] flex items-center justify-center text-indigo-600 shadow-lg">
                <Stethoscope size={40} />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-primary-900 font-heading leading-tight">
                {t('Advanced', 'అధునాతన', 'उन्नत')} <span className="text-indigo-600">{t('Gynaecology', 'స్త్రీ రోగ చికిత్స', 'स्त्री रोग विज्ञान')}</span> & {t('Surgery', 'సర్జరీ', 'सर्जरी')}
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                {t('Specializing in minimally invasive laparoscopic surgeries and comprehensive women\'s health management.',
                   'కనిష్టంగా ఇన్వాసివ్ లాపరోస్కోపిక్ సర్జరీలు మరియు సమగ్ర మహిళల ఆరోగ్య నిర్వహణలో నైపుణ్యం.',
                   'न्यूनतम इनवेसिव लैप्रोस्कोपिक सर्जरी और व्यापक महिलाओं के स्वास्थ्य प्रबंधन में विशेषज्ञता।')}
              </p>
              <div className="space-y-4">
                {[
                  t('Laparoscopic Hysterectomy & Cystectomy', 'లాపరోస్కోపిక్ హిస్టెరెక్టమీ & సిస్టెక్టమీ', 'लैप्रोस्कोपिक हिस्टेरेक्टॉमी और सिस्टेक्टॉमी'),
                  t('Fibroid & PCOD management', 'ఫైబ్రాయిడ్ & PCOD మేనేజ్‌మెంట్', 'फाइब्रॉएड और पीसीओडी प्रबंधन'),
                  t('Family Planning & Contraception', 'కుటుంబ నియంత్రణ & గర్భనిరోధం', 'परिवार नियोजन और गर्भनिरोधक'),
                  t('Adolescent Gynaecology', 'అడోలెసెంట్ గైనకాలజీ', 'किशोर स्त्री रोग विज्ञान')
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-indigo-100">
                    <CheckCircle2 className="text-indigo-500" size={20} />
                    <span className="text-sm font-bold text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative rounded-[60px] overflow-hidden shadow-2xl border-[16px] border-white">
              <img 
                src="/operation-theatre.png" 
                alt="Laparoscopic Gynaecology Surgery" 
                className="w-full h-[500px] object-cover"
              />
            </div>
          </div>

          {/* Cancer Screening Highlight */}
          <div id="cancer" className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center scroll-mt-32">
            <div className="space-y-8">
              <div className="w-20 h-20 bg-rose-100 rounded-[30px] flex items-center justify-center text-rose-600 shadow-lg">
                <Microscope size={40} />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-primary-900 font-heading leading-tight">
                {t('Early', 'ముందస్తు', 'शीघ्र')} <span className="text-rose-600">{t('Cancer', 'క్యాన్సర్', 'कैंसर')}</span> {t('Screening', 'స్క్రీనింగ్', 'स्क्रीनिंग')}
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                {t('Comprehensive screening programs for early detection of female-specific cancers, ensuring timely intervention and peace of mind.',
                   'మహిళలకు సంభవించే క్యాన్సర్లను ముందస్తుగా గుర్తించడానికి సమగ్ర స్క్రీనింగ్ ప్రోగ్రామ్‌లు.',
                   'महिला विशिष्ट कैंसर का शीघ्र पता लगाने के लिए व्यापक स्क्रीनिंग कार्यक्रम, समय पर हस्तक्षेप और मन की शांति सुनिश्चित करना।')}
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  t('Cervical Cancer', 'గర్భాశయ క్యాన్సర్', 'गर्भाशय ग्रीवा का कैंसर'),
                  t('Breast Cancer', 'రొమ్ము క్యాన్సర్', 'स्तन कैंसर'),
                  t('Ovarian Cancer', 'అండాశయ క్యాన్సర్', 'डिम्बग्रंथि के कैंसर'),
                  t('Uterine Cancer', 'యూటెరైన్ క్యాన్సర్', 'गर्भाशय कैंसर')
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-rose-50 text-sm font-bold text-gray-700">
                    <div className="w-2 h-2 bg-rose-500 rounded-full" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative rounded-[60px] overflow-hidden shadow-2xl border-[16px] border-white">
              <img 
                src="/operation-theatre.png" 
                alt="Cancer Care & Surgical OT" 
                className="w-full h-[400px] object-cover"
              />
            </div>
          </div>

          {/* Diagnostics Highlight */}
          <div id="diagnostics" className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center scroll-mt-32">
            <div className="lg:order-2 space-y-8">
              <div className="w-20 h-20 bg-amber-100 rounded-[30px] flex items-center justify-center text-amber-600 shadow-lg">
                <Stethoscope size={40} />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-primary-900 font-heading leading-tight">
                {t('Precision', 'ఖచ్చితమైన', 'सटीक')} <span className="text-amber-600">{t('Diagnostics', 'డయాగ్నస్టిక్స్', 'डायग्नोस्टिक्स')}</span>
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                {t('Our in-house laboratory and imaging units provide accurate results with rapid turnaround times for better clinical decisions.',
                   'మా ఇన్‌హౌస్ లాబొరేటరీ మరియు ఇమేజింగ్ యూనిట్లు మెరుగైన క్లినికల్ నిర్ణయాల కోసం ఖచ్చితమైన ఫలితాలను అందిస్తాయి.',
                   'हमारी इन-हाउस प्रयोगशाला और इमेजिंग इकाइयाँ बेहतर नैदानिक निर्णयों के लिए त्वरित बदलाव के साथ सटीक परिणाम प्रदान करती हैं।')}
              </p>
              <div className="flex flex-wrap gap-3">
                {[
                  t('Digital X-Ray', 'డిజిటల్ ఎక్స్-రే', 'डिजिटल एक्स-रे'),
                  t('Ultrasound', 'అల్ట్రాసౌండ్', 'अल्ट्रासाउंड'),
                  t('Doppler', 'డాప్లర్', 'डॉप्लर'),
                  t('Hormone Lab', 'హార్మోన్ ల్యాబ్', 'हार्मोन लैब'),
                  t('Semen Analysis', 'వీర్య విశ్లేషణ', 'वीर्य विश्लेषण')
                ].map((item, i) => (
                  <span key={i} className="px-4 py-2 bg-amber-50 text-amber-700 rounded-xl text-xs font-black border border-amber-100">
                    {item}
                  </span>
                ))}
              </div>
            </div>
            <div className="lg:order-1 relative rounded-[60px] overflow-hidden shadow-2xl border-[16px] border-white">
              <img 
                src="/pharmacy.png" 
                alt="Diagnostics Lab & Pharmacy" 
                className="w-full h-[400px] object-cover"
              />
            </div>
          </div>

        </div>
      </section>

      {/* ─── QUICK CONTACT ─── */}
      <section className="py-24 bg-primary-900 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-10">
          <h2 className="text-4xl font-bold font-heading">{t('Need a Specialized Consultation?', 'ప్రత్యేక సంప్రదింపులు కావాలా?', 'एक विशेष परामर्श की आवश्यकता है?')}</h2>
          <p className="text-xl text-primary-200">
            {t('Our specialists are available for both routine checkups and critical consultations. Experience healthcare that prioritizes your recovery.',
               'మా నిపుణులు రొటీన్ చెకప్‌లు మరియు క్రిటికల్ కన్సల్టేషన్‌ల కోసం అందుబాటులో ఉన్నారు.',
               'हमारे विशेषज्ञ नियमित जांच और महत्वपूर्ण परामर्श दोनों के लिए उपलब्ध हैं।')}
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <Link href="/contact" className="bg-white text-primary-900 px-10 py-5 rounded-3xl font-bold hover:bg-primary-50 transition-all shadow-xl">
              {t('Book Appointment Now', 'ఇప్పుడే అపాయింట్‌మెంట్ బుక్ చేయండి', 'अभी अपॉइंटमेंट बुक करें')}
            </Link>
            <a href="tel:9036852311" className="border-2 border-white/20 px-10 py-5 rounded-3xl font-bold hover:bg-white/10 transition-all">
              {t('Call:', 'కాల్ చేయండి:', 'कॉल करें:')} 9036852311
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
