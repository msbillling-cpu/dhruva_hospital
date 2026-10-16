'use client';
import { Users, Baby, Award, HeartPulse } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useHospitalStats } from '@/lib/useHospitalStats';

export default function StatsBar() {
  const { lang, t } = useLanguage();
  const { patientsCount, ivfDeliveries } = useHospitalStats();

  const stats = [
    { 
      label: t('Happy Patients', 'సంతోషకరమైన రోగులు', 'खुश मरीज'), 
      value: patientsCount, 
      icon: Users, 
      color: 'text-emerald-700' 
    },
    { 
      label: t('IVF Deliveries', 'IVF విజయాలు', 'आईवीएफ सफलताएं'), 
      value: ivfDeliveries, 
      icon: HeartPulse, 
      color: 'text-[#9b7745]' 
    },
    { 
      label: t('NICU Bed Capacity', 'NICU బెడ్ సామర్థ్యం', 'एनआईसीयू बिस्तर क्षमता'), 
      value: '24/7', 
      icon: Baby, 
      color: 'text-cyan-500' 
    },
    { 
      label: t('Expert Specialists', 'నిపుణులైన వైద్యులు', 'विशेषज्ञ डॉक्टर'), 
      value: '15+', 
      icon: Award, 
      color: 'text-amber-500' 
    },
  ];

  return (
    <section className="py-20 bg-white border-y border-gray-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {stats.map((stat, i) => (
            <div key={i} className="flex flex-col items-center text-center space-y-4 group">
              <div className={`w-16 h-16 rounded-3xl bg-gray-50 flex items-center justify-center ${stat.color} transition-all duration-500 group-hover:scale-110 group-hover:shadow-xl group-hover:bg-white`}>
                <stat.icon size={28} />
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-black text-primary-950 font-heading">
                  {stat.value}
                </div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
