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
      <section className="relative pt-20 sm:pt-24 lg:pt-30 pb-6 sm:pb-10 lg:pb-12 bg-gradient-to-b from-[#f8faf9] via-white to-[#f4f7f5] text-stone-900 border-b border-stone-200 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#0a2e22_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.03] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center px-3 py-1 sm:px-3.5 sm:py-1.5 bg-emerald-50 border border-emerald-200 rounded-full text-[#0a2e22] text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-3 sm:mb-5">
              <span>{t('Comprehensive Clinical Specialties', 'సమగ్ర క్లినికల్ విభాగాలు', 'व्यापक नैदानिक ​​विशिष्टताएं')}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-[#0a2e22] mb-3 sm:mb-5 leading-tight">
              {t('Advanced Surgical & Clinical Departments.', 'అధునాతన సర్జికల్ & క్లినికల్ విభాగాలు.', 'उन्नत सर्जिकल और नैदानिक विभाग।')}
            </h1>
            <p className="text-xs sm:text-base lg:text-lg text-stone-600 leading-relaxed max-w-2xl font-normal">
              {t('From fertility medicine and high-risk maternity to Level-III neonatal intensive care and minimally invasive laparoscopy in Kadapa.',
                 'కడపలో సంతానలేమి చికిత్స మరియు హై-రిస్క్ ప్రసూతి నుండి లెవల్-III నియోనాటల్ ఇంటెన్సివ్ కేర్ మరియు లాపరోస్కోపిక్ సర్జరీ వరకు.',
                 'कडप्पा में प्रजनन चिकित्सा और उच्च जोखिम वाले मातृत्व से लेकर स्तर-III नवजात गहन देखभाल और लेप्रोस्कोपी तक।')}
            </p>
          </div>
        </div>
      </section>

      {/* ─── SERVICES GRID ─── */}
      <section className="py-8 sm:py-12 lg:py-16 bg-white relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8 lg:gap-10">
            {serviceCategories.map((category) => (
              <div key={category.id} id={category.id} className="scroll-mt-28">
                <ServiceCard category={category} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── DETAILED SECTIONS ─── */}
      <section className="py-10 sm:py-16 lg:py-20 bg-[#f8fbff] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-20 lg:space-y-28">
          
          {/* Fertility Highlight */}
          <div id="fertility" className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center scroll-mt-28">
            <div className="space-y-4 sm:space-y-6">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-rose-100 rounded-2xl flex items-center justify-center text-rose-600 shadow-sm">
                <Heart size={28} />
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary-900 font-heading leading-tight">
                {t('Pioneering', 'అగ్రగామిగా', 'अग्रणी')} <span className="text-rose-600">{t('Fertility', 'ఫెర్టిలిటీ', 'प्रजनन')}</span> {t('Solutions', 'పరిష్కారాలు', 'समाधान')}
              </h2>
              <p className="text-gray-600 text-xs sm:text-base leading-relaxed">
                {t('Our fertility clinic is the most advanced in Kadapa, featuring a modular embryology lab and world-class ICSI facilities.',
                   'మా ఫెర్టిలిటీ క్లినిక్ కడపలో అత్యంత అధునాతనమైనది, ఇందులో మాడ్యులర్ ఎంబ్రియాలజీ ల్యాబ్ మరియు ప్రపంచ స్థాయి ICSI సదుపాయాలు ఉన్నాయి.',
                   'हमारा प्रजनन क्लिनिक कडप्पा में सबसे उन्नत है, जिसमें एक मॉड्यूलर भ्रूणविज्ञान लैब और विश्व स्तरीय आईसीएसआई सुविधाएं हैं।')}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {[
                  { title: t('IUI & IVF', 'IUI & IVF', 'आईयूआई और आईवीएफ'), desc: t('Success rates matching international standards.', 'అంతర్జాతీయ ప్రమాణాలకు సరిపోయే విజయావకాశాలు.', 'अंतरराष्ट्रीय मानकों से मेल खाती सफलता दर।') },
                  { title: t('Advanced ICSI', 'అధునాతన ICSI', 'उन्नत आईसीएसआई'), desc: t('Precision technology for male infertility.', 'పురుష వంధ్యత్వం కోసం ఖచ్చితమైన సాంకేతికత.', 'पुरुष बांझपन के लिए सटीक तकनीक।') },
                  { title: t('Semen Analysis', 'వీర్య విశ్లేషణ', 'वीर्य विश्लेषण'), desc: t('Computer-aided diagnostic testing.', 'కంప్యూటర్ ఆధారిత డయాగ్నస్టిక్ టెస్టింగ్.', 'कंप्यूटर सहायता प्राप्त नैदानिक परीक्षण।') },
                  { title: t('Ovulation Study', 'అండం పెరుగుదల అధ్యయనం', 'ओव्यूलेशन अध्ययन'), desc: t('Meticulous follicular monitoring.', 'ఖచ్చితమైన ఫోలిక్యులర్ పర్యవేక్షణ.', 'सावधानीपूर्वक कूपिक निगरानी।') },
                ].map((item, i) => (
                  <div key={i} className="p-4 bg-white rounded-2xl border border-gray-100 shadow-xs">
                    <h4 className="font-bold text-sm sm:text-base text-primary-800 mb-1">{item.title}</h4>
                    <p className="text-[11px] sm:text-xs text-gray-500 leading-snug">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-rose-50 rounded-2xl sm:rounded-3xl p-6 sm:p-10 relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-rose-200 rounded-full blur-3xl pointer-events-none" />
              <ul className="space-y-3.5 sm:space-y-4">
                {[
                  t('Personalized fertility protocols', 'వ్యక్తిగతీకరించిన ఫెర్టిలిటీ ప్రోటోకాల్స్', 'व्यक्तिगत प्रजनन प्रोटोकॉल'),
                  t('High success rates in first cycle', 'మొదటి సైకిల్‌లోనే అధిక విజయావకాశాలు', 'पहले चक्र में उच्च सफलता दर'),
                  t('Transparent cost structures', 'పారదర్శక ధరల విధానం', 'पारदर्शी लागत संरचनाएं'),
                  t('Compassionate emotional support', 'దయతో కూడిన మానసిక మద్దతు', 'करुणामय भावनात्मक समर्थन'),
                  t('Pre-conception genetic screening', 'గర్భధారణకు ముందు జెనెటిక్ స్క్రీనింగ్', 'पूर्व-गर्भाधान आनुवंशिक स्क्रीनिंग')
                ].map((point, i) => (
                  <li key={i} className="flex items-center gap-3 text-xs sm:text-sm text-gray-700 font-bold">
                    <CheckCircle2 className="text-rose-500 shrink-0" size={18} />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Maternity & NICU Highlight */}
          <div id="neonatal" className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center scroll-mt-28">
            <div className="lg:order-2 space-y-4 sm:space-y-6">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-cyan-100 rounded-2xl flex items-center justify-center text-cyan-600 shadow-sm">
                <Baby size={28} />
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary-900 font-heading leading-tight">
                {t('Neonatal &', 'నవజాత శిశు &', 'नवजात और')} <span className="text-[#9b7745]">{t('Paediatric Care', 'పిల్లల సంరక్షణ', 'बाल रोग देखभाल')}</span>
              </h2>
              <p className="text-gray-600 text-xs sm:text-base leading-relaxed">
                {t('Led by Hospital Founder & Senior Neonatologist Dr. Sudarshan Reddy K, we provide continuous care from Level-III NICU survival to comprehensive pediatric OPD and child wellness.',
                   'హాస్పిటల్ వ్యవస్థాపకుడు & సీనియర్ నియోనాటాలజిస్ట్ డాక్టర్ సుదర్శన్ రెడ్డి గారి పర్యవేక్షణలో, మా విభాగం లెవల్-III NICU మరియు సమగ్ర పిల్లల వైద్య సేవలను అందిస్తుంది.',
                   'अस्पताल के संस्थापक और वरिष्ठ नवजात रोग विशेषज्ञ डॉ. सुदर्शन रेड्डी के नेतृत्व में हम लेवल-III एनआईसीयू और बाल रोग ओपीडी सेवाएं प्रदान करते हैं।')}
              </p>
              <div className="space-y-3">
                {[
                  t('Founder Consultation with Dr. Sudarshan Reddy K', 'వ్యవస్థాపక వైద్యులు డాక్టర్ సుదర్శన్ రెడ్డి గారితో సంప్రదింపులు', 'संस्थापक डॉ. सुदर्शन रेड्डी के साथ परामर्श'),
                  t('Level III NICU with specialized neonatologists', 'నిపుణులైన నియోనాటాలజిస్టులతో లెవల్ III NICU', 'विशेषज्ञ नियोनेटोलॉजिस्ट के साथ लेवल III एनआईसीयू'),
                  t('High-Frequency Oscillatory Ventilation & CPAP', 'అధునాతన వెంటిలేషన్ & CPAP సహాయం', 'उन्नत वेंटिलेशन और सीपीएपी सहायता'),
                  t('IAP Immunization Clinic & Growth Milestones', 'టీకాల కేంద్రం & పెరుగుదల పర్యవేక్షణ', 'टीकाकरण क्लिनिक और विकास की निगरानी')
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3.5 bg-white rounded-xl border border-emerald-100">
                    <div className="w-2 h-2 bg-emerald-600 rounded-full shrink-0" />
                    <span className="text-xs sm:text-sm font-bold text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:order-1 relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border-4 sm:border-8 border-white">
              <img 
                src="/consultation.png" 
                alt="Dr. Sudarshan Reddy K Pediatric Care" 
                className="w-full h-[260px] sm:h-[380px] lg:h-[450px] object-cover"
              />
            </div>
          </div>

          {/* Pregnancy & High-Risk Obstetrics */}
          <div id="pregnancy" className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center scroll-mt-28">
            <div className="space-y-4 sm:space-y-6">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600 shadow-sm">
                <Heart size={28} />
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary-900 font-heading leading-tight">
                {t('High-Risk', 'హై-రిస్క్', 'उच्च जोखिम')} <span className="text-purple-600">{t('Maternity Care', 'ప్రసూతి సంరక్షణ', 'मातृत्व देखभाल')}</span>
              </h2>
              <p className="text-gray-600 text-xs sm:text-base leading-relaxed">
                {t('Under the guidance of Dr. S Mounika Reddy, we manage complex pregnancies with high blood pressure, gestational diabetes, and multiple gestations with dedicated ICU and neonatal backup.',
                   'డాక్టర్ ఎస్ మౌనిక రెడ్డి గారి మార్గదర్శకత్వంలో, హై బిపి, మధుమేహం మరియు ఇతర సమస్యలతో కూడిన సంక్లిష్ట గర్భధారణలకు అత్యుత్తమ చికిత్స అందిస్తున్నాము.',
                   'डॉ. एस मोनिका रेड्डी के मार्गदर्शन में हम आईसीयू और नवजात बैकअप के साथ जटिल गर्भधारण का प्रबंधन करते हैं।')}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {[
                  t('Painless Normal Delivery Options', 'నొప్పి లేని సాధారణ ప్రసవ ఎంపికలు', 'दर्द रहित सामान्य प्रसव के विकल्प'),
                  t('Emergency C-Section Ready 24/7', '24/7 అత్యవసర సి-సెక్షన్ సదుపాయం', '24/7 आपातकालीन सी-सेक्शन तैयार'),
                  t('Continuous Fetal Heart Monitoring', 'నిరంతర పిండం గుండె పర్యవేక్షణ', 'निरंतर भ्रूण हृदय की निगरानी'),
                  t('Postpartum Recovery Suites', 'ప్రసవానంతర రికవరీ గదులు', 'प्रसवोत्तर रिकवरी सूट')
                ].map((item, i) => (
                  <div key={i} className="p-3.5 bg-white rounded-xl border border-purple-50 text-xs sm:text-sm font-bold text-gray-700 flex items-center gap-2.5">
                    <CheckCircle2 size={16} className="text-purple-600 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border-4 sm:border-8 border-white">
              <img 
                src="/room.jpg" 
                alt="Dhruva Hospitals Maternity Suites" 
                className="w-full h-[260px] sm:h-[380px] lg:h-[450px] object-cover"
              />
            </div>
          </div>

          {/* Laparoscopic Gynaecology Surgery */}
          <div id="gynaecology" className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center scroll-mt-28">
            <div className="lg:order-2 space-y-4 sm:space-y-6">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm">
                <Microscope size={28} />
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary-900 font-heading leading-tight">
                {t('Minimally Invasive', 'లాపరోస్కోపిక్', 'मिनिमली इनवेसिव')} <span className="text-emerald-600">{t('Laparoscopy', 'శస్త్రచికిత్సలు', 'लेप्रोस्कोपी')}</span>
              </h2>
              <p className="text-gray-600 text-xs sm:text-base leading-relaxed">
                {t('Advanced keyhole surgeries for uterine fibroids, ovarian cysts, endometriosis, and fertility enhancement with minimal pain and same-day mobilization.',
                   'గర్భాశయ ఫైబ్రాయిడ్లు, అండాశయ తిత్తులు మరియు ఇతర సమస్యలకు తక్కువ నొప్పి, వేగవంతమైన కోలుకునే అధునాతన కీహోల్ సర్జరీలు.',
                   'न्यूनतम दर्द और तेजी से ठीक होने के साथ गर्भाशय फाइब्रॉएड, डिम्बग्रंथि सिस्ट और प्रजनन क्षमता बढ़ाने के लिए उन्नत कीहोल सर्जरी।')}
              </p>
              <div className="space-y-2.5">
                {[
                  t('Total Laparoscopic Hysterectomy (TLH)', 'టోటల్ లాపరోస్కోపిక్ హిస్టెరెక్టమీ (TLH)', 'टोटल लेप्रोस्कोपिक हिस्टेरेक्टॉमी'),
                  t('Laparoscopic Ovarian Cystectomy & Myomectomy', 'సిస్టెక్టమీ & మయోమెక్టమీ సర్జరీ', 'लेप्रोस्कोपिक डिम्बग्रंथि सिस्टेक्टॉमी'),
                  t('Diagnostic & Operative Hysteroscopy', 'డయాగ్నస్టిక్ & ఆపరేటివ్ హిస్టెరోస్కోపీ', 'डायग्नोस्टिक एवं ऑपरेटिव हिस्टेरोस्कोपी'),
                  t('Day-Care Discharge for Minor Procedures', 'చిన్న ప్రక్రియలకు అదే రోజు డిశ్చార్జ్', 'मामूली प्रक्रियाओं के लिए डे-केयर डिस्चार्ज')
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-emerald-50 text-xs sm:text-sm font-semibold text-gray-700">
                    <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border-4 sm:border-8 border-white">
              <img 
                src="/operation-theatre.png" 
                alt="Laparoscopic Gynaecology Surgery" 
                className="w-full h-[260px] sm:h-[380px] lg:h-[450px] object-cover"
              />
            </div>
          </div>

          {/* Cancer Screening Highlight */}
          <div id="cancer" className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center scroll-mt-28">
            <div className="space-y-4 sm:space-y-6">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-rose-100 rounded-2xl flex items-center justify-center text-rose-600 shadow-sm">
                <Microscope size={28} />
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary-900 font-heading leading-tight">
                {t('Early', 'ముందస్తు', 'शीघ्र')} <span className="text-rose-600">{t('Cancer', 'క్యాన్సర్', 'कैंसर')}</span> {t('Screening', 'స్క్రీనింగ్', 'स्क्रीनिंग')}
              </h2>
              <p className="text-gray-600 text-xs sm:text-base leading-relaxed">
                {t('Comprehensive screening programs for early detection of female-specific cancers, ensuring timely intervention and peace of mind.',
                   'మహిళలకు సంభవించే క్యాన్సర్లను ముందస్తుగా గుర్తించడానికి సమగ్ర స్క్రీనింగ్ ప్రోగ్రామ్‌లు.',
                   'महिला विशिष्ट कैंसर का शीघ्र पता लगाने के लिए व्यापक स्क्रीनिंग कार्यक्रम, समय पर हस्तक्षेप और मन की शांति सुनिश्चित करना।')}
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  t('Cervical Cancer', 'గర్భాశయ క్యాన్సర్', 'गर्भाशय ग्रीवा का कैंसर'),
                  t('Breast Cancer', 'రొమ్ము క్యాన్సర్', 'स्तन कैंसर'),
                  t('Ovarian Cancer', 'అండాశయ క్యాన్సర్', 'डिम्बग्रंथि के कैंसर'),
                  t('Uterine Cancer', 'యూటెరైన్ క్యాన్సర్', 'गर्भाशय कैंसर')
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2.5 p-3 bg-white rounded-xl border border-rose-50 text-xs sm:text-sm font-bold text-gray-700">
                    <div className="w-2 h-2 bg-rose-500 rounded-full shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border-4 sm:border-8 border-white">
              <img 
                src="/operation-theatre.png" 
                alt="Cancer Care & Surgical OT" 
                className="w-full h-[260px] sm:h-[350px] lg:h-[400px] object-cover"
              />
            </div>
          </div>

          {/* Diagnostics Highlight */}
          <div id="diagnostics" className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center scroll-mt-28">
            <div className="lg:order-2 space-y-4 sm:space-y-6">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600 shadow-sm">
                <Stethoscope size={28} />
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary-900 font-heading leading-tight">
                {t('Precision', 'ఖచ్చితమైన', 'सटीक')} <span className="text-amber-600">{t('Diagnostics', 'డయాగ్నస్టిక్స్', 'डायग्नोस्टिक्स')}</span>
              </h2>
              <p className="text-gray-600 text-xs sm:text-base leading-relaxed">
                {t('Our in-house laboratory and imaging units provide accurate results with rapid turnaround times for better clinical decisions.',
                   'మా ఇన్‌హౌస్ లాబొరేటరీ మరియు ఇమేజింగ్ యూనిట్లు మెరుగైన క్లినికల్ నిర్ణయాల కోసం ఖచ్చితమైన ఫలితాలను అందిస్తాయి.',
                   'हमारी इन-हाउस प्रयोगशाला और इमेजिंग इकाइयाँ बेहतर नैदानिक निर्णयों के लिए त्वरित बदलाव के साथ सटीक परिणाम प्रदान करती हैं।')}
              </p>
              <div className="flex flex-wrap gap-2.5">
                {[
                  t('Digital X-Ray', 'డిజిటల్ ఎక్స్-రే', 'डिजिटल एक्स-रे'),
                  t('Ultrasound', 'అల్ట్రాసౌండ్', 'अल्ट्रासाउंड'),
                  t('Doppler', 'డాప్లర్', 'डॉप्लर'),
                  t('Hormone Lab', 'హార్మోన్ ల్యాబ్', 'हार्मोन लैब'),
                  t('Semen Analysis', 'వీర్య విశ్లేషణ', 'वीర్య विश्लेषण')
                ].map((item, i) => (
                  <span key={i} className="px-3.5 py-1.5 bg-amber-50 text-amber-700 rounded-xl text-xs font-bold border border-amber-100">
                    {item}
                  </span>
                ))}
              </div>
            </div>
            <div className="lg:order-1 relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border-4 sm:border-8 border-white">
              <img 
                src="/pharmacy.png" 
                alt="Diagnostics Lab & Pharmacy" 
                className="w-full h-[260px] sm:h-[350px] lg:h-[400px] object-cover"
              />
            </div>
          </div>

        </div>
      </section>

      {/* ─── QUICK CONTACT ─── */}
      <section className="py-12 sm:py-16 lg:py-24 bg-primary-900 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6 sm:space-y-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-heading">{t('Need a Specialized Consultation?', 'ప్రత్యేక సంప్రదింపులు కావాలా?', 'एक विशेष परामर्श की आवश्यकता है?')}</h2>
          <p className="text-xs sm:text-base lg:text-lg text-primary-200">
            {t('Our specialists are available for both routine checkups and critical consultations. Experience healthcare that prioritizes your recovery.',
               'మా నిపుణులు రొటీన్ చెకప్‌లు మరియు క్రిటికల్ కన్సల్టేషన్‌ల కోసం అందుబాటులో ఉన్నారు.',
               'हमारे विशेषज्ञ नियमित जांच और महत्वपूर्ण परामर्श दोनों के लिए उपलब्ध हैं।')}
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <Link href="/contact" className="bg-white text-primary-900 px-6 sm:px-8 py-3.5 rounded-2xl text-xs sm:text-sm font-bold hover:bg-primary-50 transition-all shadow-lg">
              {t('Book Appointment Now', 'ఇప్పుడే అపాయింట్‌మెంట్ బుక్ చేయండి', 'अभी अपॉइंटमेंट बुक करें')}
            </Link>
            <a href="tel:9036852311" className="border-2 border-white/20 px-6 sm:px-8 py-3.5 rounded-2xl text-xs sm:text-sm font-bold hover:bg-white/10 transition-all">
              {t('Call:', 'కాల్ చేయండి:', 'कॉल करें:')} 9036852311
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
