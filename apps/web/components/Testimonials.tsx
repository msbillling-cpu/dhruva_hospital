'use client';

import { Star, Quote } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { testimonials } from '@/lib/data';

export default function Testimonials() {
  const { t } = useLanguage();

  // Duplicate testimonials for infinite effect
  const duplicatedTestimonials = [...testimonials, ...testimonials, ...testimonials];

  return (
    <section className="py-32 bg-[#0a192f] relative overflow-hidden">
      {/* Premium Background Effects */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] rounded-full bg-primary-600/10 blur-[150px] -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full bg-accent-500/5 blur-[120px] translate-y-1/2 -translate-x-1/3" />
      
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-20 space-y-4">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-md text-primary-300 text-[10px] font-black uppercase tracking-[0.3em] rounded-full border border-white/10">
            <Star size={12} className="text-accent-500 animate-pulse" />
            {t('Patient Voices', 'రోగుల అనుభవాలు', 'मरीजों की राय')}
          </span>
          <h2 className="text-4xl md:text-6xl font-bold text-white font-heading leading-tight">
            {t('Trusted by Thousands', 'వేలాది మంది నమ్మకం', 'हजारों का भरोसा')} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-300 to-accent-400">
              {t('of Happy Families.', 'సంతోషకరమైన కుటుంబాలు.', 'सुखी परिवारों का।')}
            </span>
          </h2>
        </div>

        {/* Infinite Scrolling Marquee */}
        <div className="flex overflow-hidden group select-none py-10 mask-fade-edges">
          <motion.div 
            className="flex gap-4 md:gap-8 whitespace-nowrap"
            animate={{
              x: [0, -2000],
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 60,
                ease: "linear",
              },
            }}
            style={{ width: "max-content" }}
          >
            {duplicatedTestimonials.map((item, i) => (
              <div
                key={`${item.id}-${i}`}
                className="inline-block w-[300px] sm:w-[400px] md:w-[450px] whitespace-normal bg-white/5 backdrop-blur-xl border border-white/10 rounded-[32px] md:rounded-[40px] p-6 md:p-10 hover:bg-white/10 hover:border-primary-500/30 hover:shadow-2xl transition-all duration-500 group/card cursor-pointer"
              >
                <div className="space-y-6">
                  {/* Stars */}
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} size={16} className={j < item.rating ? "text-accent-500 fill-accent-500" : "text-white/10"} />
                    ))}
                  </div>

                  {/* Quote Icon */}
                  <Quote size={40} className="text-primary-500/20 absolute right-8 top-8 group-hover/card:rotate-12 transition-transform duration-700" />

                  {/* Content */}
                  <p className="text-lg md:text-xl text-primary-50 font-medium leading-relaxed italic">
                    &ldquo;{t(item.content, item.teluguContent, item.hindiContent)}&rdquo;
                  </p>

                  <div className="flex items-center gap-4 pt-6 border-t border-white/5">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-black text-lg shadow-lg">
                      {item.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-white tracking-wide">{item.name}</p>
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent-500" />
                        <p className="text-primary-400 text-xs font-bold uppercase tracking-widest">{item.location}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
