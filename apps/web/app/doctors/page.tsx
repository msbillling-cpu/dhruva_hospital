'use client';
import DoctorCard from '@/components/DoctorCard';
import { useDynamicDoctors } from '@/lib/useDynamicDoctors';
import { Stethoscope, Award, GraduationCap, Microscope, Scale, HeartPulse, Building2, Calendar, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function DoctorsPage() {
  const { lang, t } = useLanguage();
  const { doctors } = useDynamicDoctors();

  return (
    <div className="flex flex-col bg-[#fcfbf9]">
      {/* ─── HERO SECTION ─── */}
      <section className="relative pt-36 pb-20 bg-gradient-to-b from-[#f8faf9] via-white to-[#f4f7f5] text-stone-900 border-b border-stone-200 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#0a2e22_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.03] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center lg:text-left">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full text-[#0a2e22] text-xs font-bold tracking-wider uppercase mb-6 mx-auto lg:mx-0">
              <Stethoscope size={13} className="text-[#9b7745]" />
              <span>{t('Senior Medical Directorate', 'సీనియర్ మెడికల్ డైరెక్టరేట్', 'वरिष्ठ चिकित्सा निदेशालय')}</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-[#0a2e22] mb-6 leading-tight">
              {t('Distinguished Clinical Faculty & Specialists.', 'విశిష్ట క్లినికల్ ఫ్యాకల్టీ & నిపుణులు.', 'प्रतिष्ठित नैदानिक संकाय और विशेषज्ञ।')}
            </h1>
            <p className="text-lg text-stone-600 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-normal">
              {t('Fellowship-trained clinicians and senior consultants dedicated to advanced maternity, neonatal intensive care, laparoscopic surgery, and critical medicine in Kadapa.',
                 'కడపలో అధునాతన ప్రసూతి, నియోనాటల్ ఇంటెన్సివ్ కేర్, లాపరోస్కోపిక్ సర్జరీ మరియు క్రిటికల్ మెడిసిన్‌కు అంకితమైన ఫెలోషిప్-శిక్షణ పొందిన వైద్యులు మరియు సీనియర్ కన్సల్టెంట్లు.',
                 'कडप्पा में उन्नत मातृत्व, नवजात गहन देखभाल, लेप्रोस्कोपिक सर्जरी और क्रिटिकल मेडिसिन के लिए समर्पित फेलोशिप-प्रशिक्षित चिकित्सक और वरिष्ठ सलाहकार।')}
            </p>
          </div>
        </div>
      </section>

      {/* ─── DOCTORS LIST ─── */}
      <section className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {doctors.map((doctor) => (
              <div key={doctor.id} className="space-y-6">
                <div>
                  <DoctorCard doctor={doctor} />
                </div>
                
                <div className="bg-white rounded-3xl p-8 md:p-10 space-y-8 border border-stone-200/80 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <div className="space-y-3">
                    <div className="text-xs font-bold uppercase tracking-widest text-[#9b7745]">
                      {t('Clinical Dossier & Philosophy', 'క్లినికల్ సమాచారం & దృష్టికోణం', 'नैदानिक विवरण और दर्शन')}
                    </div>
                    <p className="text-stone-700 text-base leading-relaxed italic font-serif">
                      &ldquo;{t(doctor.bio, doctor.bio, doctor.bio)}&rdquo;
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-stone-100">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-[#0a1d16] font-semibold text-xs tracking-wider uppercase">
                        <Award size={15} className="text-[#9b7745]" />
                        <span>{t('Experience Record', 'అనుభవ వివరాలు', 'अनुभव रिकॉर्ड')}</span>
                      </div>
                      <ul className="space-y-2">
                        {doctor.experiences.map((exp: string, i: number) => (
                          <li key={i} className="flex items-start gap-2.5 text-stone-600 text-xs leading-snug">
                            <CheckCircle2 size={13} className="text-[#9b7745] mt-0.5 shrink-0" />
                            <span>{exp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-[#0a1d16] font-semibold text-xs tracking-wider uppercase">
                        <GraduationCap size={15} className="text-[#9b7745]" />
                        <span>{t('Fellowships & Training', 'ఫెలోషిప్స్ & శిక్షణ', 'फेलोशिप और प्रशिक्षण')}</span>
                      </div>
                      <ul className="space-y-2">
                        {doctor.fellowships.map((f: string, i: number) => (
                          <li key={i} className="flex items-start gap-2.5 text-stone-700 text-xs font-medium leading-snug">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#9b7745] mt-1.5 shrink-0" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CLINICAL STANDARDS ─── */}
      <section className="py-20 bg-[#0a1d16] text-[#fcfbf9] relative overflow-hidden border-t border-[#9b7745]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#9b7745]/20 border border-[#9b7745]/30 rounded-full text-[#c5a880] text-xs font-semibold tracking-wider uppercase mb-4">
            <Building2 size={13} className="text-[#c5a880]" />
            <span>{t('Institutional Governance', 'సంస్థాగత పాలన', 'संस्थागत शासन')}</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#fcfbf9] mb-4">
            {t('Hospital Clinical Benchmarks', 'హాస్పిటల్ క్లినికల్ ప్రమాణాలు', 'अस्पताल के नैदानिक मानक')}
          </h2>
          <p className="text-emerald-100/70 max-w-2xl mx-auto mb-16 text-sm font-light">
            {t('Strict adherence to national medical council standards and accredited infection control guidelines.',
               'జాతీయ వైద్య మండలి ప్రమాణాలు మరియు ఇన్ఫెక్షన్ కంట్రోల్ మార్గదర్శకాలకు కచ్చితమైన కట్టుబాటు.',
               'राष्ट्रीय चिकित्सा परिषद के मानकों और संक्रमण नियंत्रण दिशानिर्देशों का कड़ाई से पालन।')}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                Icon: Microscope, 
                title: t('Evidence-Based Medicine', 'ఆధారిత వైద్యం', 'साक्ष्य आधारित चिकित्सा'), 
                desc: t('Diagnostic pathways and patient protocols aligned with AIIMS, Apollo, and international clinical guidelines.', 
                        'ఎయిమ్స్, అపోలో మరియు అంతర్జాతీయ క్లినికల్ మార్గదర్శకాలకు అనుగుణంగా రోగ నిర్ధారణ మరియు చికిత్స ప్రోటోకాల్‌లు.', 
                        'एम्स, अपोलो और अंतरराष्ट्रीय नैदानिक ​​दिशानिर्देशों के अनुरूप नैदानिक ​​मार्ग और रोगी प्रोटोकॉल।') 
              },
              { 
                Icon: Scale, 
                title: t('Ethical Transparency', 'నైతిక పారదర్శకత', 'नैतिक पारदर्शिता'), 
                desc: t('Zero unnecessary investigations, complete fee schedule disclosure, and full informed patient consent.', 
                        'అనవసరమైన పరీక్షలు లేకుండా, సంపూర్ణ రుసుము వివరణ మరియు రోగి పూర్తి సమ్మతితో చికిత్స.', 
                        'शून्य अनावश्यक जांच, पूर्ण शुल्क प्रकटीकरण और पूर्ण सूचित रोगी सहमति।') 
              },
              { 
                Icon: HeartPulse, 
                title: t('Patient Dignity & Privacy', 'రోగి గౌరవం & గోప్యత', 'रोगी की गरिमा और गोपनीयता'), 
                desc: t('Confidential consultation suites, dedicated female attendants for OBG, and secure electronic health records.', 
                        'గోప్యమైన కన్సల్టేషన్ గదులు, ప్రసూతి కోసం మహిళా సహాయకులు మరియు సురక్షితమైన వైద్య రికార్డులు.', 
                        'गोपनीय परामर्श सूट, ओबीजी के लिए समर्पित महिला परिचारक और सुरक्षित इलेक्ट्रॉनिक स्वास्थ्य रिकॉर्ड।') 
              },
            ].map((item, i) => (
              <div key={i} className="text-left p-8 bg-[#122e23] rounded-2xl border border-[#9b7745]/20 hover:border-[#9b7745]/40 transition-colors">
                <div className="w-14 h-14 rounded-xl bg-[#0a1d16] border border-[#9b7745]/30 flex items-center justify-center text-[#c5a880] mb-6">
                  <item.Icon className="w-7 h-7 text-[#c5a880]" />
                </div>
                <h3 className="text-xl font-serif font-bold text-[#fcfbf9] mb-3">{item.title}</h3>
                <p className="text-emerald-100/75 leading-relaxed text-xs">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
