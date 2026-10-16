'use client';

import { useState, useEffect } from 'react';
import { doctors as staticDoctors } from './data';
import type { Doctor } from '@repo/types';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5003/api';
const HOSPITAL_ID = process.env.NEXT_PUBLIC_HOSPITAL_ID || '6a0850656ecbe4898e5d0dfe';

export function useDynamicDoctors() {
  const [doctorsList, setDoctorsList] = useState<Doctor[]>(staticDoctors);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function fetchDoctors() {
      try {
        setLoading(true);
        const res = await fetch(`${BACKEND_URL}/public/appointments/doctors/${HOSPITAL_ID}`);
        if (!res.ok) return;

        const data = await res.json();
        if (!data.success || !Array.isArray(data.doctors)) return;

        const dbDocs: any[] = data.doctors;

        const merged: Doctor[] = [];
        const matchedStaticIds = new Set<string>();

        // 1. Process DB doctors and match against static rich profile
        for (const dbDoc of dbDocs) {
          const rawDbName = (dbDoc.doctorName || '').toLowerCase();

          // Match by name keyword
          const matchedStatic = staticDoctors.find((sd) => {
            const sdLower = sd.name.toLowerCase();
            if (rawDbName.includes('sudarshan') && sdLower.includes('sudarshan')) return true;
            if (rawDbName.includes('mounika') && sdLower.includes('mounika')) return true;
            if (rawDbName.includes('surya') && sdLower.includes('surya')) return true;
            if (rawDbName.includes('vinay') && sdLower.includes('vinay')) return true;
            return false;
          });

          if (matchedStatic) {
            matchedStaticIds.add(matchedStatic.id);
            merged.push({
              ...matchedStatic,
              id: matchedStatic.id, // keep stable id for roleBadges & styling
              specialization: matchedStatic.specialization || dbDoc.primarySpecialty,
              qualifications: (dbDoc.qualifications && dbDoc.qualifications.length > 0)
                ? dbDoc.qualifications
                : matchedStatic.qualifications,
              bio: matchedStatic.bio || dbDoc.bio,
            });
          } else {
            // Truly new doctor from database
            const initials = (dbDoc.doctorName || 'Dr')
              .split(' ')
              .map((p: string) => p[0])
              .filter(Boolean)
              .slice(0, 2)
              .join('')
              .toUpperCase();

            merged.push({
              id: dbDoc.doctorId || `doc-${Math.random()}`,
              name: dbDoc.doctorName || 'Doctor',
              initials,
              qualifications: dbDoc.qualifications?.length ? dbDoc.qualifications : ['MBBS'],
              specialization: dbDoc.primarySpecialty || 'General Physician',
              designation: dbDoc.primarySpecialty ? `${dbDoc.primarySpecialty} Specialist` : 'Senior Consultant',
              image: dbDoc.profilePic || '/doctors/dr-sudarshan.png',
              bio: dbDoc.bio || `Specialist at Dhruva Hospitals.`,
              fellowships: [],
              experiences: ['Consultant – Dhruva Hospitals'],
              languages: ['Telugu', 'English'],
              slug: (dbDoc.doctorName || 'doctor').toLowerCase().replace(/\s+/g, '-'),
            });
          }
        }

        // 2. Append any static doctors not in DB (like Dr. Vinay Kumar)
        for (const sd of staticDoctors) {
          if (!matchedStaticIds.has(sd.id)) {
            merged.push(sd);
          }
        }

        if (isMounted && merged.length > 0) {
          setDoctorsList(merged);
        }
      } catch (err) {
        console.warn('[useDynamicDoctors] Could not fetch live doctors, using static fallback:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchDoctors();

    return () => {
      isMounted = false;
    };
  }, []);

  return { doctors: doctorsList, loading };
}
