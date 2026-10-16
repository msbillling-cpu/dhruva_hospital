'use client';
import Link from 'next/link';
import { 
  ChevronRight, HeartPulse, Microscope, 
  Baby, Dna, FlaskConical, Stethoscope 
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import type { ServiceCategory } from '@/types';

const IconMap: Record<string, any> = {
  HeartPulse,
  Microscope,
  Baby,
  Dna,
  FlaskConical,
  Stethoscope
};

export default function ServiceCard({ category }: { category: ServiceCategory }) {
  const { t } = useLanguage();
  const Icon = IconMap[category.icon as string] || Stethoscope;

  return (
    <div className="group relative p-5 sm:p-7 rounded-2xl sm:rounded-3xl bg-white border border-stone-200 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-emerald-700/30 overflow-hidden flex flex-col justify-between h-full">
      {/* Ambient subtle glow on hover */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#9b7745]/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      <div className="relative z-10 space-y-4 sm:space-y-6">
        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-emerald-50 text-[#0a2e22] rounded-xl sm:rounded-2xl flex items-center justify-center border border-emerald-100 transition-transform duration-300 group-hover:scale-105 shadow-xs">
          <Icon size={24} className="text-[#9b7745]" />
        </div>
        
        <div className="space-y-2.5 sm:space-y-3">
          <h3 className="text-lg sm:text-xl font-serif font-bold text-[#0a2e22] group-hover:text-[#9b7745] transition-colors leading-snug">
            {t(category.name, category.teluguName, category.hindiName)}
          </h3>
          
          <p className="text-stone-600 text-xs sm:text-sm leading-relaxed line-clamp-3">
            {category.description}
          </p>
          
          <div className="pt-2 flex flex-wrap gap-1.5">
            {category.services.slice(0, 3).map((s, i) => (
              <span key={i} className="px-2.5 py-1 bg-stone-50 text-[10px] font-medium text-stone-700 rounded-lg border border-stone-200">
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-stone-100 mt-6 relative z-10 flex items-center justify-between">
        <Link 
          href={`/services/${category.id}`} 
          className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-bold text-[#0a2e22] group-hover:text-[#9b7745] transition-colors"
        >
          <span>{t('Learn More', 'మరింత తెలుసుకోండి', 'अधिक जानें')}</span>
          <ChevronRight size={14} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
      
      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 h-1 w-0 bg-[#0a2e22] transition-all duration-500 group-hover:w-full" />
    </div>
  );
}
