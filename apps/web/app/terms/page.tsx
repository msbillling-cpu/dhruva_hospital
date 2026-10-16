'use client';
import { useLanguage } from '@/context/LanguageContext';

export default function TermsPage() {
  const { lang, t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col">
      <section className="pt-40 pb-20 bg-primary-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-black font-heading mb-6">{t('Terms of Service', 'సేవా నిబంధనలు', 'सेवा की शर्तें')}</h1>
          <p className="text-primary-200 text-xl">{t('Last Updated: April 2026', 'చివరిగా నవీకరించబడింది: ఏప్రిల్ 2026', 'अंतिम अपडेट: अप्रैल 2026')}</p>
        </div>
      </section>
      
      <section className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-primary">
          <h2 className="text-3xl font-bold text-primary-900 mb-8">{t('1. Acceptance of Terms', '1. నిబంధనల అంగీకారం', '1. शर्तों की स्वीकृति')}</h2>
          <p className="text-gray-600 mb-6">
            {t('By accessing and using the services of Dhruva Hospitals, you agree to comply with and be bound by these terms.',
               'ధృవ హాస్పిటల్స్ సేవలను ఉపయోగించడం ద్వారా, మీరు ఈ నిబంధనలకు కట్టుబడి ఉండటానికి అంగీకరిస్తున్నారు.',
               'ध्रुव हॉस्पिटल्स की सेवाओं का उपयोग करके, आप इन शर्तों का पालन करने के लिए सहमत होते हैं।')}
          </p>
          <h2 className="text-3xl font-bold text-primary-900 mb-8">{t('2. Medical Disclaimer', '2. వైద్య నిరాకరణ', '2. चिकित्सा अस्वीकरण')}</h2>
          <p className="text-gray-600 mb-6">
            {t('The information provided on this website is for general informational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment.',
               'ఈ వెబ్‌సైట్‌లో అందించిన సమాచారం సాధారణ సమాచార ప్రయోజనాల కోసం మాత్రమే మరియు ఇది వృత్తిపరమైన వైద్య సలహాకు ప్రత్యామ్నాయం కాదు.',
               'इस वेबसाइट पर प्रदान की गई जानकारी केवल सामान्य सूचनात्मक उद्देश्यों के लिए है और पेशेवर चिकित्सा सलाह का विकल्प नहीं है।')}
          </p>
          <h2 className="text-3xl font-bold text-primary-900 mb-8">{t('3. Appointment Policy', '3. అపాయింట్‌మెంట్ విధానం', '3. अपॉइंटमेंट नीति')}</h2>
          <p className="text-gray-600 mb-6">
            {t('Appointments booked online are subject to confirmation based on specialist availability.',
               'ఆన్‌లైన్‌లో బుక్ చేసిన అపాయింట్‌మెంట్‌లు నిపుణుల లభ్యత ఆధారంగా ధృవీకరణకు లోబడి ఉంటాయి.',
               'ऑनलाइन बुक किए गए अपॉइंटमेंट विशेषज्ञ की उपलब्धता के आधार पर पुष्टि के अधीन हैं।')}
          </p>
        </div>
      </section>
    </div>
  );
}
