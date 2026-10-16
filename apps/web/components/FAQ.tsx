'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { faqs } from '@/lib/data';
import clsx from 'clsx';

export default function FAQ() {
  const { t } = useLanguage();
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <section className="py-20 bg-medical-light">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="section-badge">❓ {t('FAQs', 'తరచుగా అడిగే ప్రశ్నలు', 'सामान्य प्रश्न')}</span>
          <h2 className="section-title">{t('Frequently Asked Questions', 'తరచుగా అడిగే ప్రశ్నలు', 'अक्सर पूछे जाने वाले प्रश्न')}</h2>
          <p className="section-subtitle mx-auto">
            {t('Answers to common questions about our services, facilities and booking.',
               'మా సేవలు, సదుపాయాలు మరియు బుకింగ్ గురించి సాధారణ ప్రశ్నలకు సమాధానాలు.',
               'हमारी सेवाओं, सुविधाओं और बुकिंग के बारे में सामान्य प्रश्नों के उत्तर।')}
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className={clsx(
                  'bg-white rounded-2xl border transition-all duration-300',
                  isOpen ? 'border-primary-300 shadow-medical' : 'border-gray-100 shadow-card hover:border-primary-200'
                )}
              >
                <button
                  onClick={() => setOpenId(isOpen ? null : faq.id)}
                  className="w-full flex items-center justify-between gap-4 p-5 text-left"
                  aria-expanded={isOpen}
                >
                  <span className={clsx('font-semibold text-base transition-colors', isOpen ? 'text-primary-600' : 'text-gray-800')}>
                    {t(faq.question, faq.teluguQuestion, faq.hindiQuestion)}
                  </span>
                  <ChevronDown
                    size={20}
                    className={clsx('shrink-0 text-primary-400 transition-transform duration-300', isOpen && 'rotate-180')}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-gray-600 text-sm leading-relaxed border-t border-primary-50 pt-4 animate-fade-in">
                    {t(faq.answer, faq.teluguAnswer, faq.hindiAnswer)}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-10 text-center bg-white rounded-2xl p-6 shadow-card border border-primary-100">
          <p className="text-gray-700 font-semibold mb-2">
            {t('Still have questions?', 'ఇంకా ప్రశ్నలు ఉన్నాయా?', 'अभी भी प्रश्न हैं?')}
          </p>
          <p className="text-gray-500 text-sm mb-4">
            {t('Our team is available 24/7 to help you.', 'మా బృందం 24/7 మీకు సహాయం చేయడానికి అందుబాటులో ఉంది.', 'हमारी टीम आपकी मदद के लिए 24/7 उपलब्ध है।')}
          </p>
          <a href="tel:9036852311" className="btn-primary inline-flex">
            📞 {t('Call Us Now', 'ఇప్పుడు కాల్ చేయండి', 'हमें अभी कॉल करें')}
          </a>
        </div>
      </div>
    </section>
  );
}
