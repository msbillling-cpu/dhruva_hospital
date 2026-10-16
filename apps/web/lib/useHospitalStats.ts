'use client';

import { useState, useEffect } from 'react';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5003/api';
const HOSPITAL_ID = process.env.NEXT_PUBLIC_HOSPITAL_ID || '6a0850656ecbe4898e5d0dfe';

export interface HospitalStats {
  patientsCount: string;
  ivfDeliveries: string;
  loading: boolean;
}

export function useHospitalStats(): HospitalStats {
  const [stats, setStats] = useState<HospitalStats>({
    patientsCount: '15,000+',
    ivfDeliveries: '500+',
    loading: true,
  });

  useEffect(() => {
    let isMounted = true;

    async function fetchStats() {
      try {
        const res = await fetch(`${BACKEND_URL}/public/appointments/stats/${HOSPITAL_ID}`, {
          cache: 'no-store',
        });
        if (!res.ok) return;

        const data = await res.json();
        if (data.success && isMounted) {
          setStats({
            patientsCount: data.formattedPatients || (data.livePatientCount > 0 ? `${data.livePatientCount.toLocaleString('en-IN')}+` : '15,000+'),
            ivfDeliveries: data.formattedIvf || (data.liveIvfCount > 0 ? `${data.liveIvfCount.toLocaleString('en-IN')}+` : '500+'),
            loading: false,
          });
        }
      } catch (e) {
        // Fallback gracefully
      }
    }

    fetchStats();
    const interval = setInterval(fetchStats, 30000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return stats;
}
