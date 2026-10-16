'use client';
import { useLanguage } from '@/context/LanguageContext';

export default function PrivacyPage() {
  const { lang, t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col">
      <section className="pt-40 pb-20 bg-primary-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-black font-heading mb-6">{t('Privacy Policy', 'గోప్యతా విధానం', 'गोपनीयता नीति')}</h1>
          <p className="text-primary-200 text-xl">{t('Last Updated: April 2026', 'చివరిగా నవీకరించబడింది: ఏప్రిల్ 2026', 'अंतिम अपडेट: अप्रैल 2026')}</p>
        </div>
      </section>
      
      <section className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-primary">
          <h2 className="text-3xl font-bold text-primary-900 mb-8">{t('1. Introduction', '1. పరిచయం', '1. परिचय')}</h2>
          <p className="text-gray-600 mb-6">
            {t('At Dhruva Hospitals, we are committed to protecting your personal and medical information. This policy explains how we collect, use, and safeguard your data.',
               'ధృవ హాస్పిటల్స్‌లో, మీ వ్యక్తిగత మరియు వైద్య సమాచారాన్ని రక్షించడానికి మేము కట్టుబడి ఉన్నాము.',
               'ध्रुव हॉस्पिटल्स में, हम आपकी व्यक्तिगत और चिकित्सा जानकारी की सुरक्षा के लिए प्रतिबद्ध हैं।')}
          </p>
          <h2 className="text-3xl font-bold text-primary-900 mb-8">{t('2. Information Collection', '2. సమాచార సేకరణ', '2. सूचना संग्रह')}</h2>
          <p className="text-gray-600 mb-6">
            {t('We collect information when you book an appointment, visit our facility, or interact with our website. This includes contact details and medical history relevant to your care.',
               'మీరు అపాయింట్‌మెంట్ బుక్ చేసినప్పుడు, మా కేంద్రాన్ని సందర్శించినప్పుడు లేదా మా వెబ్‌సైట్‌తో ఇంటరాక్ట్ అయినప్పుడు మేము సమాచారాన్ని సేకరిస్తాము.',
               'जब आप अपॉइंटमेंट बुक करते हैं, हमारी सुविधा पर जाते हैं, या हमारी वेबसाइट के साथ बातचीत करते हैं तो हम जानकारी एकत्र करते हैं।')}
          </p>
          <h2 className="text-3xl font-bold text-primary-900 mb-8">{t('3. Data Security', '3. డేటా భద్రత', '3. डेटा सुरक्षा')}</h2>
          <p className="text-gray-600 mb-6">
            {t('Your data is stored in secure, HIPAA-compliant systems and is only accessible to authorized medical personnel involved in your treatment.',
               'మీ డేటా సురక్షితమైన సిస్టమ్స్‌లో నిల్వ చేయబడుతుంది మరియు మీ చికిత్సలో పాల్గొనే అధీకృత వైద్య సిబ్బందికి మాత్రమే అందుబాటులో ఉంటుంది.',
               'आपका डेटा सुरक्षित सिस्टम में संग्रहीत है और केवल आपके उपचार में शामिल अधिकृत चिकित्सा कर्मियों के लिए सुलभ है।')}
          </p>
        </div>
      </section>
    </div>
  );
}
