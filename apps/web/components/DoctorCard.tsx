'use client';
import { useState } from 'react';
import { Calendar, Award, Languages, GraduationCap, MapPin, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import AppointmentModal from '@/components/AppointmentModal';
import type { Doctor } from '@/types';

export default function DoctorCard({ doctor }: { doctor: Doctor }) {
  const { t } = useLanguage();
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div className="bg-white rounded-[40px] p-8 border border-gray-100 shadow-sm transition-all duration-500 hover:shadow-2xl hover:border-primary-100 group">
        <div className="flex flex-col sm:flex-row gap-8 items-start sm:items-center">
          {/* Avatar Section */}
          <div className="relative shrink-0">
            {doctor.image ? (
              <div className="relative w-40 h-40 rounded-2xl overflow-hidden shadow-xl border-4 border-white group-hover:border-[#9b7745]/30 transition-all duration-700 ease-out">
                <img 
                  src={doctor.image} 
                  alt={doctor.name} 
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            ) : (
              <div className="w-40 h-40 bg-gradient-to-br from-[#0a1d16] to-[#16382b] rounded-2xl flex items-center justify-center text-4xl font-serif font-bold text-[#c5a880] shadow-xl relative z-10 border-4 border-white">
                {doctor.initials}
              </div>
            )}
            <div className="absolute -bottom-2.5 -right-2 px-3 py-1 bg-[#0a1d16] text-[#c5a880] rounded-full flex items-center shadow-md border-2 border-white z-20 text-[10px] font-bold tracking-wider">
              <span>
                {doctor.id === 'dr-sudarshan-reddy'
                  ? 'FOUNDER & CHAIRMAN'
                  : doctor.id === 'dr-mounika-reddy'
                  ? 'DIRECTOR & SURGEON'
                  : 'SENIOR CONSULTANT'}
              </span>
            </div>
          </div>

          {/* Info Section */}
          <div className="flex-1 space-y-3">
            <div className="space-y-1">
              <h3 className="text-2xl font-serif font-bold text-[#0a1d16] group-hover:text-[#9b7745] transition-colors flex flex-col">
                <span>{doctor.name}</span>
                {doctor.teluguName && (
                  <span className="text-sm font-sans font-medium text-gray-500 mt-0.5">
                    {t('', doctor.teluguName, doctor.hindiName || '')}
                  </span>
                )}
              </h3>
              <p className="text-[#9b7745] font-semibold text-sm tracking-wide">
                {doctor.designation}
              </p>
            </div>
            
            <div className="flex flex-wrap gap-1.5 pt-1">
              {doctor.qualifications.map((q, i) => (
                <span key={i} className="px-2.5 py-1 bg-stone-100 text-[10px] font-semibold text-stone-700 rounded-md border border-stone-200/60 uppercase tracking-tight">
                  {q}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-stone-100 mt-3">
              <div className="flex items-center gap-2 text-xs text-stone-600">
                <GraduationCap size={14} className="text-[#9b7745] shrink-0" />
                <span className="truncate">{doctor.specialization}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-stone-600">
                <Languages size={14} className="text-[#9b7745] shrink-0" />
                <span>{doctor.languages.join(', ')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-6 pt-4 border-t border-stone-100">
          <button 
            onClick={() => setModalOpen(true)}
            className="w-full bg-[#0a1d16] text-[#fcfbf9] py-3.5 rounded-xl font-medium text-sm hover:bg-[#153427] flex items-center justify-center gap-2.5 group/btn shadow-md transition-all duration-300 border border-[#9b7745]/20"
          >
            <Calendar size={16} className="text-[#c5a880]" />
            <span>{t('Book Consultation', 'కన్సల్టేషన్ బుక్ చేయండి', 'परामर्श बुक करें')}</span>
            <ChevronRight size={16} className="text-[#c5a880] group-hover/btn:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      <AppointmentModal 
        isOpen={isModalOpen} 
        onClose={() => setModalOpen(false)} 
        doctorId={doctor.doctorId || doctor.id}
        doctorName={doctor.name}
        specialty={doctor.specialization}
        profilePic={doctor.image}
      />
    </>
  );
}
