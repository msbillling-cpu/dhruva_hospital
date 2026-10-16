'use client';
import { useState, useEffect, useMemo, useRef } from 'react';
import {
  X,
  Calendar,
  User,
  Phone,
  Stethoscope,
  Clock,
  MessageSquare,
  CheckCircle2,
  Award,
  Send,
  ShieldCheck,
  ArrowRight,
  RotateCcw,
  Sparkles,
  MapPin,
  Building2,
  Printer,
  ChevronRight,
  AlertCircle,
  Heart,
  Baby,
  Users,
  Upload,
  FileText,
  Scan,
  RefreshCw,
  CheckSquare,
  ExternalLink,
  Camera,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import toast from 'react-hot-toast';
import { checkImageClarity, extractTextFromAadhaar, parseAadhaarText } from '@/lib/aadhaarParser';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  doctorId?: string;
  doctorName?: string;
  serviceName?: string;
  specialty?: string;
  consultationFee?: number;
  profilePic?: string;
}

interface DoctorOption {
  doctorId: string;
  doctorName: string;
  specialties: string[];
  primarySpecialty: string;
  consultationFee: number;
  profilePic?: string;
  allowedSessions?: {
    morning: { start: string; end: string; available: boolean };
    evening: { start: string; end: string; available: boolean };
  };
}

interface ConfirmedPass {
  id: string;
  appointmentId: string;
  tokenNumber: number;
  doctorName: string;
  specialty: string;
  date: string;
  session: string;
  sessionLabel: string;
  estimatedTime: string;
  patientName: string;
  mrn: string;
  hospitalName: string;
  hospitalAddress: string;
  hospitalPhone: string;
  digitalPassUrl?: string;
}

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5003/api';
const HOSPITAL_ID = process.env.NEXT_PUBLIC_HOSPITAL_ID || '69a7b003c84f8f6e66180872'; // Horizon Hospital for testing

export const VINAY_KUMAR_DOCTOR: DoctorOption = {
  doctorId: 'dr-m-vinay-kumar',
  doctorName: 'Dr. M Vinay Kumar',
  specialties: ['General & Laser Surgery', 'Laparoscopic Surgery'],
  primarySpecialty: 'General & Laser Surgeon',
  consultationFee: 300,
  profilePic: '/doctors/dr-vinay.png',
  allowedSessions: {
    morning: { start: '09:00 AM', end: '01:00 PM', available: true },
    evening: { start: '02:00 PM', end: '05:00 PM', available: true },
  },
};

function isDoctorMatch(doc: DoctorOption, qId?: string, qName?: string): boolean {
  if (!qId && !qName) return false;

  const qIdLower = (qId || '').toLowerCase().trim();
  const qNameLower = (qName || '').toLowerCase().trim();
  const docIdLower = (doc.doctorId || '').toLowerCase().trim();
  const docNameLower = (doc.doctorName || '').toLowerCase().trim();

  // 1. Direct ID match
  if (qId && docIdLower === qIdLower) return true;

  // 2. Doctor specific keyword matching
  if ((qIdLower.includes('mounika') || qNameLower.includes('mounika')) &&
      (docIdLower.includes('mounika') || docNameLower.includes('mounika'))) {
    return true;
  }
  if ((qIdLower.includes('sudarshan') || qNameLower.includes('sudarshan')) &&
      (docIdLower.includes('sudarshan') || docNameLower.includes('sudarshan'))) {
    return true;
  }
  if ((qIdLower.includes('surya') || qNameLower.includes('surya')) &&
      (docIdLower.includes('surya') || docNameLower.includes('surya'))) {
    return true;
  }
  if ((qIdLower.includes('vinay') || qNameLower.includes('vinay')) &&
      (docIdLower.includes('vinay') || docNameLower.includes('vinay'))) {
    return true;
  }

  // 3. Clean word tokens match
  const cleanQ = qNameLower.replace(/\b(dr|doctor)\b/gi, '').replace(/[^a-z0-9\s]/g, ' ').trim();
  const cleanDoc = docNameLower.replace(/\b(dr|doctor)\b/gi, '').replace(/[^a-z0-9\s]/g, ' ').trim();

  const qTokens = cleanQ.split(/\s+/).filter(t => t.length > 2);
  const docTokens = cleanDoc.split(/\s+/).filter(t => t.length > 2);

  if (qTokens.some(qt => docTokens.includes(qt))) return true;
  if (cleanQ && cleanDoc && (cleanQ.includes(cleanDoc) || cleanDoc.includes(cleanQ))) return true;

  return false;
}

export default function AppointmentModal({
  isOpen,
  onClose,
  doctorId,
  doctorName,
  serviceName,
  specialty,
  consultationFee,
  profilePic,
}: Props) {
  const { lang, t } = useLanguage();

  // Multi-step modal state: 'form' | 'otp' | 'confirmed'
  const [step, setStep] = useState<'form' | 'otp' | 'confirmed'>('form');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);

  // Config & Doctor data from backend
  const [hospitalName, setHospitalName] = useState('HORIZIN HOSPITAL');
  const [bookingWindowDays, setBookingWindowDays] = useState(10);
  const [doctorsList, setDoctorsList] = useState<DoctorOption[]>([]);
  const [isLoadingDoctors, setIsLoadingDoctors] = useState(false);
  const [hospitalSessions, setHospitalSessions] = useState<{
    morning?: { start: string; end: string };
    evening?: { start: string; end: string };
  }>({
    morning: { start: '09:00 AM', end: '01:00 PM' },
    evening: { start: '05:00 PM', end: '09:00 PM' },
  });

  // Form Fields
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>(doctorId || '');
  const [selectedDoctorName, setSelectedDoctorName] = useState<string>(doctorName || '');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>(specialty || serviceName || 'General Physician');
  const [selectedFee, setSelectedFee] = useState<number>(consultationFee || 500);
  const [selectedPic, setSelectedPic] = useState<string>(profilePic || '');

  // Patient Identity Fields
  const [relation, setRelation] = useState<'Myself' | 'Spouse' | 'Child' | 'Parent'>('Myself');
  const [honorific, setHonorific] = useState<string>('Mr.');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  const [age, setAge] = useState('');
  const [ageUnit, setAgeUnit] = useState<'Years' | 'Months' | 'Days'>('Years');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [address, setAddress] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [bloodGroup, setBloodGroup] = useState('Unknown');
  const [selectedDate, setSelectedDate] = useState('');
  const [sessionName, setSessionName] = useState<'Morning' | 'Evening'>('Morning');
  const [reason, setReason] = useState('');

  // Aadhaar OCR Scan State
  const [isScanningAadhaar, setIsScanningAadhaar] = useState(false);
  const [aadhaarScanStatus, setAadhaarScanStatus] = useState<{
    type: 'success' | 'warning' | 'error';
    message: string;
  } | null>(null);

  // Live Doctor Availability & Dynamic Session state from Backend
  const [availability, setAvailability] = useState<{
    isAvailable: boolean;
    reason?: string;
    bookedCount?: number;
    sessions?: {
      morning?: { start?: string; end?: string; label?: string; available?: boolean; reason?: string };
      evening?: { start?: string; end?: string; label?: string; available?: boolean; reason?: string };
    };
  } | null>(null);
  const [isLoadingAvailability, setIsLoadingAvailability] = useState(false);

  // OTP Fields & 60-Second Cooldown Timer
  const [otpCode, setOtpCode] = useState('');
  const [cooldown, setCooldown] = useState(0);
  const [hasActiveOtpSession, setHasActiveOtpSession] = useState(false);
  const [isReadMoreOpen, setIsReadMoreOpen] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Lock background body scrolling when modal is open
  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  // Auto-restore active OTP session on page refresh
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const saved = sessionStorage.getItem('mscurechain_active_otp_session');
      if (saved) {
        const data = JSON.parse(saved);
        if (data && data.step === 'otp' && data.phone) {
          setHasActiveOtpSession(true);
          setStep('otp');
          if (data.phone) setPhone(data.phone);
          if (data.fullName) setFullName(data.fullName);
          if (data.honorific) setHonorific(data.honorific);
          if (data.dob) setDob(data.dob);
          if (data.age) setAge(String(data.age));
          if (data.ageUnit) setAgeUnit(data.ageUnit);
          if (data.gender) setGender(data.gender);
          if (data.fatherName) setFatherName(data.fatherName);
          if (data.bloodGroup) setBloodGroup(data.bloodGroup);
          if (data.address) setAddress(data.address);
          if (data.reason) setReason(data.reason);
          if (data.selectedDate) setSelectedDate(data.selectedDate);
          if (data.sessionName) setSessionName(data.sessionName);
          if (data.selectedDoctorId) setSelectedDoctorId(data.selectedDoctorId);
          if (data.selectedDoctorName) setSelectedDoctorName(data.selectedDoctorName);
          if (data.selectedSpecialty) setSelectedSpecialty(data.selectedSpecialty);
          if (data.selectedFee) setSelectedFee(data.selectedFee);
          if (data.selectedPic) setSelectedPic(data.selectedPic);

          if (data.otpExpiry) {
            const remaining = Math.max(0, Math.floor((data.otpExpiry - Date.now()) / 1000));
            setCooldown(remaining);
          }
        }
      }
    } catch (e) {
      console.warn('Failed to restore active booking session:', e);
    }
  }, []);

  // Confirmed Digital Pass
  const [confirmedPass, setConfirmedPass] = useState<ConfirmedPass | null>(null);

  // Calculate min & max dates according to Admin Booking Window (7-10 days)
  const { minDateStr, maxDateStr } = useMemo(() => {
    const today = new Date();
    const minStr = today.toISOString().split('T')[0] || '';

    const max = new Date();
    max.setDate(today.getDate() + (bookingWindowDays || 10));
    const maxStr = max.toISOString().split('T')[0] || '';

    return { minDateStr: minStr, maxDateStr: maxStr };
  }, [bookingWindowDays]);

  // Fetch Hospital Config & Dynamic Doctor list from backend
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    const fetchHospitalData = async () => {
      try {
        setIsLoadingDoctors(true);
        // 1. Fetch Config
        const configRes = await fetch(`${BACKEND_URL}/public/appointments/config/${HOSPITAL_ID}`).catch(() => null);
        if (configRes && configRes.ok) {
          const configData = await configRes.json();
          if (configData.hospital?.name) {
            setHospitalName(configData.hospital.name);
          }
          if (configData.hospital?.bookingWindowDays) {
            setBookingWindowDays(configData.hospital.bookingWindowDays);
          }
          if (configData.hospital?.allowedSessions) {
            setHospitalSessions(configData.hospital.allowedSessions);
          }
        }

        // 2. Fetch Doctors
        const docRes = await fetch(`${BACKEND_URL}/public/appointments/doctors/${HOSPITAL_ID}`).catch(() => null);
        if (docRes && docRes.ok) {
          const docData = await docRes.json();
          if (docData.doctors && Array.isArray(docData.doctors) && docData.doctors.length > 0) {
            const hasVinay = docData.doctors.some((d: any) => (d.doctorName || '').toLowerCase().includes('vinay'));
            const merged = hasVinay ? docData.doctors : [...docData.doctors, VINAY_KUMAR_DOCTOR];
            if (isMounted) setDoctorsList(merged);
          }
        }
      } catch (err) {
        console.warn('Backend public API fetch failed, using local context:', err);
      } finally {
        if (isMounted) setIsLoadingDoctors(false);
      }
    };

    fetchHospitalData();
    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  // Priority 1: When modal opens or doctor props change, match and lock the requested doctor
  useEffect(() => {
    if (!isOpen) return;

    // Do NOT reset to 'form' if restoring an active OTP session from sessionStorage
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('mscurechain_active_otp_session');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed && parsed.step === 'otp') {
            return;
          }
        } catch (e) {}
      }
    }

    // Reset step & default date
    setStep('form');
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setSelectedDate(tomorrow.toISOString().split('T')[0] || '');

    if (doctorId || doctorName) {
      const match = doctorsList.find(d => isDoctorMatch(d, doctorId, doctorName));
      if (match) {
        setSelectedDoctorId(match.doctorId);
        setSelectedDoctorName(match.doctorName);
        setSelectedSpecialty(match.primarySpecialty || match.specialties?.[0] || specialty || 'General Physician');
        setSelectedFee(match.consultationFee ?? (consultationFee || 300));
        setSelectedPic(match.profilePic || profilePic || '');
        return;
      }

      // If not yet matched in doctorsList, set directly from passed props
      if (doctorId) setSelectedDoctorId(doctorId);
      if (doctorName) setSelectedDoctorName(doctorName);
      if (specialty) setSelectedSpecialty(specialty);
      if (consultationFee) setSelectedFee(consultationFee);
      if (profilePic) setSelectedPic(profilePic);
    }
  }, [isOpen, doctorId, doctorName, specialty, consultationFee, profilePic, doctorsList]);

  // Priority 2: Keep selected doctor synced with loaded doctorsList
  useEffect(() => {
    if (doctorsList.length === 0) return;

    // 1. If doctor prop requested, prioritize that match
    if (doctorId || doctorName) {
      const match = doctorsList.find(d => isDoctorMatch(d, doctorId, doctorName));
      if (match) {
        setSelectedDoctorId(match.doctorId);
        setSelectedDoctorName(match.doctorName);
        setSelectedSpecialty(match.primarySpecialty || match.specialties?.[0] || specialty || 'General Physician');
        setSelectedFee(match.consultationFee ?? (consultationFee || 300));
        setSelectedPic(match.profilePic || profilePic || '');
        return;
      }
    }

    // 2. If a doctor is currently selected, keep its details up to date
    if (selectedDoctorId) {
      const current = doctorsList.find(d => d.doctorId === selectedDoctorId || isDoctorMatch(d, selectedDoctorId, selectedDoctorName));
      if (current) {
        setSelectedDoctorId(current.doctorId);
        setSelectedDoctorName(current.doctorName);
        setSelectedSpecialty(current.primarySpecialty || current.specialties?.[0] || 'General Physician');
        setSelectedFee(current.consultationFee ?? 300);
        setSelectedPic(current.profilePic || profilePic || '');
        return;
      }
    }

    // 3. Fallback only if no doctor is requested or selected
    if (!doctorId && !doctorName && !selectedDoctorId && doctorsList[0]) {
      const defaultDoc = doctorsList[0];
      setSelectedDoctorId(defaultDoc.doctorId);
      setSelectedDoctorName(defaultDoc.doctorName);
      setSelectedSpecialty(defaultDoc.primarySpecialty || defaultDoc.specialties?.[0] || 'General Physician');
      setSelectedFee(defaultDoc.consultationFee ?? 300);
      setSelectedPic(defaultDoc.profilePic || '');
    }
  }, [doctorsList, doctorId, doctorName]);

  // Sync selected doctor object if user chooses from dropdown
  const handleDoctorChange = (docId: string) => {
    setSelectedDoctorId(docId);
    const found = doctorsList.find(d => d.doctorId === docId);
    if (found) {
      setSelectedDoctorName(found.doctorName);
      setSelectedSpecialty(found.primarySpecialty || found.specialties?.[0] || 'General Physician');
      setSelectedFee(found.consultationFee ?? 300);
      setSelectedPic(found.profilePic || '');
    }
  };

  // Fetch real doctor availability and session status when doctor or date changes
  useEffect(() => {
    if (!selectedDoctorId || !selectedDate) return;

    // Handle non-MongoDB ID (e.g. Dr. Vinay Kumar)
    if (!/^[0-9a-fA-F]{24}$/.test(selectedDoctorId)) {
      setAvailability({
        isAvailable: true,
        sessions: {
          morning: { start: '09:00 AM', end: '01:00 PM', label: 'Morning (09:00 AM - 01:00 PM)', available: true },
          evening: { start: '02:00 PM', end: '05:00 PM', label: 'Evening (02:00 PM - 05:00 PM)', available: true },
        },
      });
      return;
    }

    let isMounted = true;
    const fetchAvailability = async () => {
      try {
        setIsLoadingAvailability(true);
        const res = await fetch(`${BACKEND_URL}/public/appointments/doctors/${selectedDoctorId}/availability?date=${selectedDate}`).catch(() => null);
        if (res && res.ok) {
          const data = await res.json();
          if (isMounted && data.success) {
            setAvailability(data);
            if (data.isAvailable === false) {
              toast.error(data.reason || 'Doctor is not available on this date.');
            } else if (data.sessions) {
              const morningAvail = data.sessions.morning?.available !== false;
              const eveningAvail = data.sessions.evening?.available !== false;
              if (sessionName === 'Morning' && !morningAvail && eveningAvail) {
                setSessionName('Evening');
              } else if (sessionName === 'Evening' && !eveningAvail && morningAvail) {
                setSessionName('Morning');
              }
            }
          }
        }
      } catch (err) {
        console.warn('Availability check failed:', err);
      } finally {
        if (isMounted) setIsLoadingAvailability(false);
      }
    };

    fetchAvailability();
    return () => {
      isMounted = false;
    };
  }, [selectedDoctorId, selectedDate]);

  // Bi-directional Age & DOB calculation
  const calculateDobFromAge = (numStr: string, unit: 'Years' | 'Months' | 'Days') => {
    const num = parseInt(numStr, 10);
    if (isNaN(num) || num < 0) return '';
    const date = new Date();
    if (unit === 'Years') {
      date.setFullYear(date.getFullYear() - num);
    } else if (unit === 'Months') {
      date.setMonth(date.getMonth() - num);
    } else if (unit === 'Days') {
      date.setDate(date.getDate() - num);
    }
    return date.toISOString().split('T')[0] || '';
  };

  const handleAgeChange = (val: string) => {
    setAge(val);
    if (val !== '') {
      const calculatedDob = calculateDobFromAge(val, ageUnit);
      if (calculatedDob) setDob(calculatedDob);
    } else {
      setDob('');
    }
  };

  const handleAgeUnitChange = (unit: 'Years' | 'Months' | 'Days') => {
    setAgeUnit(unit);
    if (age !== '') {
      const calculatedDob = calculateDobFromAge(age, unit);
      if (calculatedDob) setDob(calculatedDob);
    }
  };

  // Auto-calculate age and appropriate unit (Years, Months, Days) from DOB
  const applyDob = (val: string) => {
    setDob(val);
    if (val) {
      const birth = new Date(val);
      const today = new Date();
      let diffTime = today.getTime() - birth.getTime();
      if (diffTime < 0) diffTime = 0;

      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      const diffMonths = Math.floor(diffDays / 30.4375);
      const diffYears = Math.floor(diffDays / 365.25);

      if (diffYears >= 1) {
        setAge(String(diffYears));
        setAgeUnit('Years');
      } else if (diffMonths >= 1) {
        setAge(String(diffMonths));
        setAgeUnit('Months');
      } else {
        setAge(String(diffDays));
        setAgeUnit('Days');
      }
    } else {
      setAge('');
    }
  };

  const handleDobChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    applyDob(e.target.value);
  };

  // Upload & OCR Scan Aadhaar card with blur validation and autofill
  const processAadhaarDocument = async (file: File) => {
    try {
      setIsScanningAadhaar(true);
      setAadhaarScanStatus(null);

      // 1. Check clarity & blur
      const clarity = await checkImageClarity(file);
      if (!clarity.isClear && clarity.warning) {
        toast.error(clarity.warning);
        setAadhaarScanStatus({ type: 'warning', message: clarity.warning });
        setIsScanningAadhaar(false);
        return;
      }

      // 2. Perform client-side OCR & QR decode
      const { text: rawText, qrData } = await extractTextFromAadhaar(file);
      if ((!rawText || rawText.trim().length < 15) && !qrData) {
        toast.error('Could not detect readable text from document. Please ensure photo is clear and well-lit.');
        setAadhaarScanStatus({ type: 'error', message: 'Could not extract text. Please ensure document is sharp and clear.' });
        setIsScanningAadhaar(false);
        return;
      }

      // 3. Parse fields (merging QR data + OCR patterns)
      const parsed = parseAadhaarText(rawText, qrData);

      let filledCount = 0;
      if (parsed.fullName) {
        setFullName(parsed.fullName);
        filledCount++;
      }
      if (parsed.dob) {
        applyDob(parsed.dob);
        filledCount++;
      }
      if (parsed.gender) {
        setGender(parsed.gender);
        filledCount++;
      }
      if (parsed.fatherName) {
        setFatherName(parsed.fatherName);
        filledCount++;
      }
      if (parsed.phone) {
        setPhone(parsed.phone);
        filledCount++;
      }
      if (parsed.address) {
        setAddress(parsed.address);
        filledCount++;
      }

      if (filledCount > 0) {
        toast.success(`Aadhaar details autofilled successfully (${filledCount} fields).`);
        setAadhaarScanStatus({
          type: 'success',
          message: `Autofilled Name, DOB, Gender, Father's Name & Address. All fields are editable.`,
        });
      } else {
        toast.error('Could not identify Aadhaar fields. Please enter details manually.');
        setAadhaarScanStatus({ type: 'warning', message: 'Details not clearly identified. You can type them manually.' });
      }
    } catch (err: any) {
      console.error('Aadhaar OCR Error:', err);
      toast.error('Failed to process document. Please upload a clear photo or PDF.');
      setAadhaarScanStatus({ type: 'error', message: 'Failed to process document. Please upload a clear photo.' });
    } finally {
      setIsScanningAadhaar(false);
    }
  };

  const handleAadhaarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await processAadhaarDocument(file);
    }
    e.target.value = '';
  };

  // Cooldown countdown timer effect
  useEffect(() => {
    if (cooldown > 0) {
      timerRef.current = setTimeout(() => {
        setCooldown(prev => prev - 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [cooldown]);

  // If modal is closed, return null
  if (!isOpen) return null;

  const handleClose = () => {
    setStep('form');
    setOtpCode('');
    setConfirmedPass(null);
    setHasActiveOtpSession(false);
    try {
      sessionStorage.removeItem('mscurechain_active_otp_session');
    } catch (e) {}
    onClose();
  };

  const handleEditDetails = () => {
    setStep('form');
    setHasActiveOtpSession(false);
    try {
      sessionStorage.removeItem('mscurechain_active_otp_session');
    } catch (e) {}
  };

  // Step 1: Dispatch WhatsApp OTP
  const handleProceedToOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!phone || phone.replace(/\D/g, '').length !== 10) {
      toast.error('Please enter a valid 10-digit Indian phone number.');
      return;
    }

    if (!fullName.trim()) {
      toast.error('Please enter patient name.');
      return;
    }

    if (!address.trim()) {
      toast.error('Please enter residential address.');
      return;
    }

    if (!selectedDate) {
      toast.error('Please select an appointment date.');
      return;
    }

    if (availability && availability.isAvailable === false) {
      toast.error(availability.reason || 'Selected doctor is not available on this date.');
      return;
    }

    const isMorningAvail = availability?.sessions?.morning ? availability.sessions.morning.available !== false : true;
    const isEveningAvail = availability?.sessions?.evening ? availability.sessions.evening.available !== false : true;
    if (sessionName === 'Morning' && !isMorningAvail) {
      toast.error('Morning session is not available on this date. Please select Evening session.');
      return;
    }
    if (sessionName === 'Evening' && !isEveningAvail) {
      toast.error('Evening session is not available on this date. Please select Morning session.');
      return;
    }

    setIsSendingOtp(true);
    try {
      const res = await fetch(`${BACKEND_URL}/public/appointments/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: phone.replace(/\D/g, ''),
          hospitalId: HOSPITAL_ID,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(`Verification code dispatched to your WhatsApp!`);
        const cd = data.cooldown || 60;
        setCooldown(cd);
        setStep('otp');
        setHasActiveOtpSession(true);

        try {
          const otpExpiry = Date.now() + cd * 1000;
          sessionStorage.setItem(
            'mscurechain_active_otp_session',
            JSON.stringify({
              step: 'otp',
              phone: phone.replace(/\D/g, ''),
              fullName: fullName.trim(),
              honorific,
              dob,
              age,
              ageUnit,
              gender,
              fatherName: fatherName.trim(),
              bloodGroup,
              address: address.trim(),
              reason: reason.trim(),
              selectedDate,
              sessionName,
              selectedDoctorId,
              selectedDoctorName,
              selectedSpecialty,
              selectedFee,
              selectedPic,
              otpExpiry,
            })
          );
        } catch (storageErr) {
          console.warn('Failed to cache OTP session:', storageErr);
        }
      } else {
        toast.error(data.message || 'Failed to dispatch WhatsApp OTP. Please check phone number.');
      }
    } catch (err: any) {
      toast.error('Network error. Connecting to WhatsApp service...');
      // Fallback in local testing if backend mock is offline
      setStep('otp');
      setCooldown(60);
      setHasActiveOtpSession(true);
    } finally {
      setIsSendingOtp(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (cooldown > 0) return;
    setIsSendingOtp(true);
    try {
      const res = await fetch(`${BACKEND_URL}/public/appointments/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: phone.replace(/\D/g, ''),
          hospitalId: HOSPITAL_ID,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success('Fresh 4-digit code sent via WhatsApp!');
        setCooldown(data.cooldown || 60);
      } else {
        toast.error(data.message || 'Please wait before requesting another code.');
      }
    } catch (err) {
      toast.error('Failed to resend. Please try again.');
    } finally {
      setIsSendingOtp(false);
    }
  };

  // Step 2: Verify OTP & Complete Booking
  const handleVerifyAndBook = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!otpCode || otpCode.trim().length !== 4) {
      toast.error('Please enter the 4-digit verification code.');
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Verify OTP
      const verifyRes = await fetch(`${BACKEND_URL}/public/appointments/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: phone.replace(/\D/g, ''),
          otp: otpCode.trim(),
          hospitalId: HOSPITAL_ID,
        }),
      });

      const verifyData = await verifyRes.json();
      if (!verifyRes.ok || !verifyData.success) {
        toast.error(verifyData.message || 'Invalid or expired code. Please retry.');
        setIsSubmitting(false);
        return;
      }

      // 2. Book Consultation with Phone+DOB Matching & Atomic Counter
      const targetDocId = selectedDoctorId || (doctorsList[0]?.doctorId) || '69a7b665c84f8f6e66180df6';

      const bookRes = await fetch(`${BACKEND_URL}/public/appointments/book`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hospitalId: HOSPITAL_ID,
          doctorId: targetDocId,
          date: selectedDate,
          sessionName: sessionName,
          honorific: honorific || 'Mr.',
          name: fullName.trim(),
          fatherName: fatherName.trim() || undefined,
          phone: phone.replace(/\D/g, ''),
          dob: dob || undefined,
          age: age ? Number(age) : undefined,
          ageUnit: ageUnit || 'Years',
          gender: gender,
          address: address.trim(),
          bloodGroup: bloodGroup || 'Unknown',
          relation: relation,
          reason: reason.trim() || undefined,
          otp: otpCode.trim(),
        }),
      });

      const bookData = await bookRes.json();
      if (bookRes.ok && bookData.success) {
        setConfirmedPass(bookData.appointment);
        setStep('confirmed');
        setHasActiveOtpSession(false);
        try {
          sessionStorage.removeItem('mscurechain_active_otp_session');
        } catch (e) {}
        toast.success('Consultation Pre-Booked! WhatsApp Pass Dispatched.');
      } else {
        toast.error(bookData.message || 'Booking failed. Please try again.');
      }
    } catch (err) {
      toast.error('Connection issue. Please verify backend is running on port 5003.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Print Digital Pass (Instant 1-Page Receipt, isolated from heavy website background)
  const handlePrintPass = () => {
    if (!confirmedPass || typeof window === 'undefined') return;

    const printHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" />
        <title>Appointment Pass #${confirmedPass.tokenNumber} - ${confirmedPass.hospitalName || 'Hospital'}</title>
        <style>
          @page { size: A4 portrait; margin: 12mm 15mm; }
          * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
          body { background: #ffffff; color: #111827; padding: 10px; font-size: 13px; }
          .receipt-card { max-width: 480px; margin: 0 auto; border: 1.5px solid #d1d5db; border-radius: 16px; padding: 22px 24px; }
          .header { text-align: center; border-bottom: 2px dashed #059669; padding-bottom: 14px; margin-bottom: 14px; }
          .hospital-title { font-size: 19px; font-weight: 800; color: #006837; letter-spacing: 0.5px; text-transform: uppercase; }
          .sub-badge { font-size: 11px; font-weight: 700; color: #059669; letter-spacing: 1.5px; margin-top: 3px; }
          .token-box { background: #f0fdf4; border: 1.5px solid #bbf7d0; border-radius: 12px; padding: 12px 14px; text-align: center; margin: 12px 0 16px 0; }
          .token-title { font-size: 10px; font-weight: 700; color: #166534; text-transform: uppercase; letter-spacing: 1px; }
          .token-num { font-size: 34px; font-weight: 900; color: #006837; margin: 2px 0; }
          .token-salute { font-size: 12.5px; color: #374151; font-weight: 600; }
          .info-table { width: 100%; border-collapse: collapse; }
          .info-table td { padding: 7px 4px; vertical-align: top; border-bottom: 1px solid #f3f4f6; }
          .label { font-size: 10px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; width: 38%; }
          .val { font-size: 12.5px; font-weight: 700; color: #111827; }
          .sub-val { font-size: 11px; font-weight: 500; color: #4b5563; }
          .instructions { margin-top: 14px; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 10px; padding: 10px 12px; }
          .instructions-title { font-size: 11px; font-weight: 700; color: #111827; margin-bottom: 4px; }
          .instructions ul { padding-left: 16px; font-size: 10.5px; color: #4b5563; line-height: 1.45; }
          .footer { text-align: center; font-size: 10px; color: #6b7280; margin-top: 14px; padding-top: 10px; border-top: 1px solid #e5e7eb; font-weight: 500; }
        </style>
      </head>
      <body>
        <div class="receipt-card">
          <div class="header">
            <div class="hospital-title">${confirmedPass.hospitalName || 'HORIZIN HOSPITAL'}</div>
            <div class="sub-badge">APPOINTMENT CONFIRMATION PASS</div>
          </div>
          <div class="token-box">
            <div class="token-title">OPD Consultation Queue</div>
            <div class="token-num">Token #${confirmedPass.tokenNumber}</div>
            <div class="token-salute">Dear <strong>${confirmedPass.patientName}</strong>, your appointment is confirmed.</div>
          </div>
          <table class="info-table">
            <tr>
              <td class="label">Consulting Doctor</td>
              <td class="val">${confirmedPass.doctorName}<div class="sub-val">${confirmedPass.specialty}</div></td>
            </tr>
            <tr>
              <td class="label">Appointment Date</td>
              <td class="val">${confirmedPass.date}<div class="sub-val">${confirmedPass.sessionLabel || confirmedPass.session}</div></td>
            </tr>
            <tr>
              <td class="label">Est. Reporting Time</td>
              <td class="val" style="color: #006837;">${confirmedPass.estimatedTime} <span class="sub-val">(Report 10m before)</span></td>
            </tr>
            <tr>
              <td class="label">Unique Health ID (UHID)</td>
              <td class="val" style="font-family: monospace;">${confirmedPass.mrn || 'Assigned at Frontdesk'}</td>
            </tr>
            <tr>
              <td class="label">Hospital Address</td>
              <td class="val" style="font-size: 11.5px; font-weight: 500;">${confirmedPass.hospitalAddress || 'Dwaraka Nagar, Near RTC Bus Stand, Kadapa, AP'}</td>
            </tr>
            <tr>
              <td class="label">Reception Desk</td>
              <td class="val">${confirmedPass.hospitalPhone || '08562-318419'}</td>
            </tr>
          </table>
          <div class="instructions">
            <div class="instructions-title">Instructions for Your Visit:</div>
            <ul>
              <li>Please present this printout or your WhatsApp confirmation at the hospital reception.</li>
              <li>Reception staff will verify your token and assist with initial vitals check.</li>
              <li>No advance payment required. Consultation fee is settled at the billing counter.</li>
            </ul>
          </div>
          <div class="footer">
            MSCURECHAIN HOSPITAL ERP GATEWAY • Thank you for choosing ${confirmedPass.hospitalName || 'HORIZIN HOSPITAL'}
          </div>
        </div>
      </body>
      </html>
    `;

    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (doc) {
      doc.open();
      doc.write(printHtml);
      doc.close();
      iframe.contentWindow?.focus();
      setTimeout(() => {
        iframe.contentWindow?.print();
        setTimeout(() => iframe.remove(), 2500);
      }, 50);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-5 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#06140e]/80 backdrop-blur-md transition-opacity animate-fade-in"
        onClick={handleClose}
      />

      {/* Modal Container */}
      <div className={`relative w-full ${step === 'form' ? 'max-w-6xl' : 'max-w-md sm:max-w-lg'} bg-white rounded-[24px] sm:rounded-[36px] shadow-2xl overflow-hidden animate-scale-in max-h-[96dvh] sm:max-h-[94vh] flex flex-col md:flex-row border border-gray-100 z-10 transition-all duration-300`}>

        {/* ─── LEFT BRANDING BAR (Only shown during Form filling) ─── */}
        {step === 'form' && (
          <div className="hidden md:flex md:w-[32%] lg:w-[30%] bg-gradient-to-br from-[#0a1d16] via-[#122e23] to-[#1a4232] p-8 lg:p-10 text-white flex-col justify-between relative overflow-hidden shrink-0 border-r border-[#9b7745]/20">
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#9b7745]/15 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl translate-y-1/3 pointer-events-none" />

            <div className="space-y-6 relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-[#c5a880] text-xs font-bold tracking-wider uppercase">
                <ShieldCheck size={14} className="text-[#c5a880]" />
                <span>Verified Hospital Portal</span>
              </div>

              <div className="space-y-2">
                <h2 className="text-3xl font-serif font-bold text-[#fcfbf9] leading-tight">
                  Direct Doctor Booking
                </h2>
                <p className="text-emerald-100/75 text-xs leading-relaxed">
                  Connects directly to the hospital Frontdesk & Doctor Queue. Free instant confirmation pass sent to your WhatsApp.
                </p>
              </div>

              {/* Context-Aware Doctor Preview Card */}
              {(selectedDoctorName || doctorName) && (
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 space-y-3">
                  <div className="text-[10px] font-black uppercase tracking-widest text-[#c5a880]">
                    Locked Doctor Context
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0a1d16] to-[#153427] border-2 border-[#9b7745]/50 flex items-center justify-center text-lg font-serif font-bold text-[#c5a880] overflow-hidden shrink-0">
                      {selectedPic ? (
                        <img src={selectedPic} alt={selectedDoctorName} className="w-full h-full object-cover" />
                      ) : (
                        selectedDoctorName.replace('Dr. ', '').slice(0, 2).toUpperCase()
                      )}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-white truncate">{selectedDoctorName}</h4>
                      <p className="text-xs text-[#c5a880] truncate font-medium">{selectedSpecialty}</p>
                      <p className="text-[10px] text-emerald-200/80 mt-0.5">Consultation Fee: ₹{selectedFee}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Feature Highlights */}
              <div className="space-y-3 pt-2">
                {[
                  { icon: CheckCircle2, text: 'No Advance Payment Required' },
                  { icon: Clock, text: 'Admin 10-Day Booking Window' },
                  { icon: ShieldCheck, text: 'WhatsApp Digital Queue Pass' },
                  { icon: Users, text: 'Family Dependents Supported' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-xs font-semibold text-emerald-100/90">
                    <item.icon size={15} className="text-[#c5a880] shrink-0" />
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-white/10 text-[10px] font-black uppercase tracking-[0.2em] text-[#c5a880]/80">
              MSCureChain Hospital ERP Gateway
            </div>
          </div>
        )}

        {/* ─── RIGHT INTERACTIVE CONTENT ─── */}
        <div className={`flex-1 ${step === 'form' ? 'p-4 sm:p-8 lg:p-10' : 'p-4 sm:p-7'} relative overflow-y-auto bg-white flex flex-col justify-between`}>
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors z-20 cursor-pointer"
          >
            <X size={20} />
          </button>

          {/* ═══════════════════════════════════════════════════════ */}
          {/* STEP 1: CONSULTATION & PATIENT FORM                   */}
          {/* ═══════════════════════════════════════════════════════ */}
          {step === 'form' && (
            <form onSubmit={handleProceedToOtp} className="space-y-6 animate-fade-in">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#9b7745] mb-1">
                  <Sparkles size={14} />
                  <span>Step 1 of 2: Consultation Details</span>
                </div>
                <h3 className="text-2xl font-serif font-bold text-gray-900">
                  Book Your Consultation
                </h3>
                <p className="text-gray-500 text-xs mt-0.5">
                  Select your doctor, schedule, and patient details. You will receive an instant WhatsApp token.
                </p>
              </div>

              {/* Dependent Relation Selector (Myself, Spouse, Child, Parent) */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">
                  Who is this consultation for?
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(['Myself', 'Spouse', 'Child', 'Parent'] as const).map(rel => (
                    <button
                      key={rel}
                      type="button"
                      onClick={() => setRelation(rel)}
                      className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all border ${
                        relation === rel
                          ? 'bg-[#0a1d16] text-[#c5a880] border-[#0a1d16] shadow-sm'
                          : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {rel}
                    </button>
                  ))}
                </div>
              </div>

              {/* ─── Smart Aadhaar / ID Card OCR Autofill ─── */}
              <div className="p-3.5 bg-gradient-to-r from-emerald-50/70 via-stone-50 to-amber-50/40 rounded-2xl border border-emerald-200/80 shadow-sm space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start sm:items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-[#0a2e22] text-[#c5a880] flex items-center justify-center shrink-0 shadow-sm mt-0.5 sm:mt-0">
                      <Scan size={16} />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs font-serif font-bold text-[#0a2e22]">
                          Instant Aadhaar Autofill
                        </span>
                        <span className="text-[9px] font-bold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-full">
                          AI / OCR
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-500 leading-tight">
                        Snap with camera or upload Aadhaar image / PDF to auto-fill Name, DOB, Gender &amp; Address.
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    {/* Native Mobile Camera Button */}
                    <label
                      className={`inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer select-none ${
                        isScanningAadhaar
                          ? 'bg-stone-200 text-stone-500 cursor-wait pointer-events-none'
                          : 'bg-[#0a2e22] text-[#c5a880] hover:bg-[#124232] hover:shadow-md active:scale-95'
                      }`}
                      title="Use device camera to snap Aadhaar card"
                    >
                      {isScanningAadhaar ? (
                        <>
                          <RefreshCw size={13} className="animate-spin" />
                          <span>Reading Card...</span>
                        </>
                      ) : (
                        <>
                          <Camera size={13} />
                          <span>Use Camera</span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        disabled={isScanningAadhaar}
                        onChange={handleAadhaarUpload}
                        className="hidden"
                      />
                    </label>

                    {/* Upload File / PDF Button */}
                    <label
                      className={`inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer select-none ${
                        isScanningAadhaar
                          ? 'bg-stone-100 text-stone-400 cursor-wait pointer-events-none border border-stone-200'
                          : 'bg-white text-stone-700 border border-stone-300 hover:bg-stone-100 hover:border-stone-400 active:scale-95'
                      }`}
                      title="Upload an existing image or PDF from device"
                    >
                      <Upload size={13} />
                      <span>Upload File</span>
                      <input
                        type="file"
                        accept="image/*,application/pdf"
                        disabled={isScanningAadhaar}
                        onChange={handleAadhaarUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {aadhaarScanStatus && (
                  <div className={`text-[11px] font-semibold px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 ${
                    aadhaarScanStatus.type === 'success'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : aadhaarScanStatus.type === 'warning'
                      ? 'bg-amber-100 text-amber-800 border border-amber-200'
                      : 'bg-rose-100 text-rose-800 border border-rose-200'
                  }`}>
                    <span>{aadhaarScanStatus.message}</span>
                  </div>
                )}
              </div>

              {/* Doctor & Specialty Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">
                    Select Doctor
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <select
                      value={selectedDoctorId}
                      onChange={e => handleDoctorChange(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#9b7745]/30 focus:border-[#9b7745] transition-all"
                    >
                      {doctorsList.length > 0 ? (
                        doctorsList.map(doc => (
                          <option key={doc.doctorId} value={doc.doctorId}>
                            {doc.doctorName} ({doc.primarySpecialty})
                          </option>
                        ))
                      ) : (
                        <option value={selectedDoctorId || 'default'}>
                          {selectedDoctorName || 'Dr. Ramesh (General Physician)'}
                        </option>
                      )}
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">
                    Specialty / Department
                  </label>
                  <div className="relative">
                    <Stethoscope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="text"
                      readOnly
                      value={selectedSpecialty}
                      className="w-full pl-10 pr-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-xs sm:text-sm font-semibold text-gray-700 cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              {/* Date & Session Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between ml-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                      Date (Max 10 Days)
                    </label>
                    <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                      Open Slots
                    </span>
                  </div>
                  <div className="relative">
                    <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      required
                      type="date"
                      min={minDateStr}
                      max={maxDateStr}
                      value={selectedDate}
                      onChange={e => setSelectedDate(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#9b7745]/30 focus:border-[#9b7745] transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between ml-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                      Preferred Session
                    </label>
                    {isLoadingAvailability ? (
                      <span className="text-[9px] font-bold text-amber-600 animate-pulse">
                        Checking schedule...
                      </span>
                    ) : availability && availability.isAvailable === false ? (
                      <span className="text-[9px] font-bold text-rose-600">
                        Unavailable on Date
                      </span>
                    ) : null}
                  </div>
                  {(() => {
                    const formatTo12Hour = (timeStr?: string): string => {
                      if (!timeStr) return '';
                      const trimmed = timeStr.trim();
                      if (/am|pm/i.test(trimmed)) {
                        const match = trimmed.match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)$/i);
                        if (match && match[1]) {
                          const h = parseInt(match[1], 10);
                          const m = match[2] || '00';
                          const ampm = (match[3] || 'AM').toUpperCase();
                          return `${h.toString().padStart(2, '0')}:${m} ${ampm}`;
                        }
                        return trimmed;
                      }
                      const match24 = trimmed.match(/^(\d{1,2}):(\d{2})/);
                      if (match24 && match24[1] && match24[2]) {
                        let h = parseInt(match24[1], 10);
                        const m = match24[2];
                        const ampm = h >= 12 ? 'PM' : 'AM';
                        h = h % 12;
                        if (h === 0) h = 12;
                        return `${h.toString().padStart(2, '0')}:${m} ${ampm}`;
                      }
                      return trimmed;
                    };

                    const isDocAvail = availability ? availability.isAvailable !== false : true;
                    const isMornAvail = isDocAvail && (availability?.sessions?.morning ? availability.sessions.morning.available !== false : true);
                    const isEveAvail = isDocAvail && (availability?.sessions?.evening ? availability.sessions.evening.available !== false : true);

                    const currentDoc = doctorsList.find(d => d.doctorId === selectedDoctorId);
                    const mornData = availability?.sessions?.morning;
                    const eveData = availability?.sessions?.evening;

                    const rawMornStart = mornData?.start || currentDoc?.allowedSessions?.morning?.start || hospitalSessions?.morning?.start || '09:00 AM';
                    const rawMornEnd = mornData?.end || currentDoc?.allowedSessions?.morning?.end || hospitalSessions?.morning?.end || '01:00 PM';
                    const rawEveStart = eveData?.start || currentDoc?.allowedSessions?.evening?.start || hospitalSessions?.evening?.start || '05:00 PM';
                    const rawEveEnd = eveData?.end || currentDoc?.allowedSessions?.evening?.end || hospitalSessions?.evening?.end || '09:00 PM';

                    const mornLabel = rawMornStart && rawMornEnd
                      ? `Morning (${formatTo12Hour(rawMornStart)} - ${formatTo12Hour(rawMornEnd)})`
                      : mornData?.label || 'Morning';

                    const eveLabel = rawEveStart && rawEveEnd
                      ? `Evening (${formatTo12Hour(rawEveStart)} - ${formatTo12Hour(rawEveEnd)})`
                      : eveData?.label || 'Evening';

                    return (
                      <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            disabled={!isMornAvail}
                            onClick={() => isMornAvail && setSessionName('Morning')}
                            className={`py-3 px-3 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-1.5 ${
                              !isMornAvail
                                ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-60 line-through'
                                : sessionName === 'Morning'
                                  ? 'bg-[#0a1d16] text-[#c5a880] border-[#0a1d16] shadow-sm'
                                  : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                            }`}
                          >
                            <Clock size={13} />
                            <span>{mornLabel}</span>
                          </button>
                          <button
                            type="button"
                            disabled={!isEveAvail}
                            onClick={() => isEveAvail && setSessionName('Evening')}
                            className={`py-3 px-3 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-1.5 ${
                              !isEveAvail
                                ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-60 line-through'
                                : sessionName === 'Evening'
                                  ? 'bg-[#0a1d16] text-[#c5a880] border-[#0a1d16] shadow-sm'
                                  : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                            }`}
                          >
                            <Clock size={13} />
                            <span>{eveLabel}</span>
                          </button>
                        </div>
                        {availability && availability.isAvailable === false && (
                          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-rose-600 bg-rose-50 px-2.5 py-1.5 rounded-lg border border-rose-200">
                            <AlertCircle size={13} className="shrink-0" />
                            <span>{availability.reason || 'Doctor is not available on this date'}</span>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Patient Demographics: Honorific, Name, Phone, DOB, Age + Unit, Gender, Address, Blood Group */}
              <div className="space-y-4 pt-1 border-t border-gray-100">
                {/* Row 1: Honorific + Full Name + WhatsApp Number */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                  <div className="sm:col-span-3 space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">
                      Honorific <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={honorific}
                      onChange={e => setHonorific(e.target.value)}
                      className="w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#9b7745]/30 focus:border-[#9b7745] transition-all cursor-pointer"
                    >
                      <option value="Mr.">Mr.</option>
                      <option value="Mrs.">Mrs.</option>
                      <option value="Ms.">Ms.</option>
                      <option value="Miss">Miss</option>
                      <option value="Master">Master</option>
                      <option value="Baby">Baby</option>
                      <option value="Baby of (B/o)">Baby of (B/o)</option>
                      <option value="Dr.">Dr.</option>
                      <option value="Prof.">Prof.</option>
                    </select>
                  </div>

                  <div className="sm:col-span-5 space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">
                      Full Name <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <input
                        required
                        type="text"
                        placeholder="Name"
                        value={fullName}
                        onChange={e => setFullName(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#9b7745]/30 focus:border-[#9b7745]"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-4 space-y-1.5">
                    <div className="flex items-center justify-between ml-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                        WhatsApp Number <span className="text-rose-500">*</span>
                      </label>
                      <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                        OTP & Pass
                      </span>
                    </div>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <input
                        required
                        type="tel"
                        placeholder="10-digit number"
                        value={phone}
                        maxLength={10}
                        onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#9b7745]/30 focus:border-[#9b7745]"
                      />
                    </div>
                  </div>
                </div>

                {/* Row 2: Date of Birth + Age (Unit: Yrs / Mos / Days) + Gender */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                  <div className="sm:col-span-4 space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">
                      Date of Birth <span className="text-rose-500">*</span>
                    </label>
                    <input
                      required
                      type="date"
                      value={dob}
                      onChange={handleDobChange}
                      className="w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#9b7745]/30 focus:border-[#9b7745]"
                    />
                  </div>

                  <div className="sm:col-span-4 space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">
                      Age <span className="text-rose-500">*</span>
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Age"
                        min={0}
                        max={120}
                        value={age}
                        onChange={e => handleAgeChange(e.target.value)}
                        className="w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#9b7745]/30 focus:border-[#9b7745]"
                      />
                      <select
                        value={ageUnit}
                        onChange={e => handleAgeUnitChange(e.target.value as any)}
                        className="px-2.5 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 w-[78px] shrink-0 focus:outline-none focus:ring-2 focus:ring-[#9b7745]/30 focus:border-[#9b7745] cursor-pointer"
                      >
                        <option value="Years">Yrs</option>
                        <option value="Months">Mos</option>
                        <option value="Days">Days</option>
                      </select>
                    </div>
                  </div>

                  <div className="sm:col-span-4 space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">
                      Gender <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={gender}
                      onChange={e => setGender(e.target.value as any)}
                      className="w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#9b7745]/30 focus:border-[#9b7745] cursor-pointer"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                {/* Row 3: Father's Name + Blood Group */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                  <div className="sm:col-span-8 space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">
                      Father&apos;s Name / Guardian (S/O, C/O)
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <input
                        type="text"
                        placeholder="Father or Guardian Name"
                        value={fatherName}
                        onChange={e => setFatherName(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#9b7745]/30 focus:border-[#9b7745]"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-4 space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">
                      Blood Group
                    </label>
                    <select
                      value={bloodGroup}
                      onChange={e => setBloodGroup(e.target.value)}
                      className="w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#9b7745]/30 focus:border-[#9b7745] cursor-pointer"
                    >
                      <option value="Unknown">Unknown</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                    </select>
                  </div>
                </div>

                {/* Row 4: Residential Address */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">
                    Residential Address <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-3.5 text-gray-400" size={16} />
                    <input
                      required
                      type="text"
                      placeholder="Full address (Door No, Street, City, PIN)"
                      value={address}
                      onChange={e => setAddress(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#9b7745]/30 focus:border-[#9b7745]"
                    />
                  </div>
                </div>

                {/* Row 4: Chief Complaint / Symptoms */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">
                    Chief Complaint / Symptoms (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Fever, routine follow-up, general checkup"
                    value={reason}
                    onChange={e => setReason(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#9b7745]/30 focus:border-[#9b7745]"
                  />
                </div>
              </div>

              {/* Submit Button - Sticky on Mobile, Static on Desktop */}
              <div className="sticky bottom-0 bg-white/95 backdrop-blur-md pt-3 pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:static sm:bg-transparent border-t border-gray-100 sm:border-0 z-30 shadow-[0_-4px_12px_rgba(0,0,0,0.03)] sm:shadow-none">
                <button
                  type="submit"
                  disabled={isSendingOtp}
                  className="w-full bg-[#006837] hover:bg-[#00522c] active:scale-[0.99] text-[#fcfbf9] py-3.5 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 transition-all shadow-xl shadow-[#006837]/20 disabled:opacity-70 border border-[#9b7745]/30 cursor-pointer"
                >
                  {isSendingOtp ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending WhatsApp OTP...
                    </span>
                  ) : (
                    <>
                      <MessageSquare size={18} className="text-[#25D366] fill-[#25D366]" />
                      <span>Continue with WhatsApp</span>
                      <ArrowRight size={18} className="text-[#c5a880]" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* ═══════════════════════════════════════════════════════ */}
          {/* STEP 2: WHATSAPP OTP VERIFICATION SCREEN (SCREENSHOT 1) */}
          {/* ═══════════════════════════════════════════════════════ */}
          {step === 'otp' && (
            <form onSubmit={handleVerifyAndBook} className="space-y-4 animate-fade-in my-auto">
              {/* Header matching Screenshot 1 */}
              <div className="flex items-center gap-3 pr-8">
                <div className="w-11 h-11 rounded-2xl bg-[#e8f5e9] border border-[#c8e6c9] flex items-center justify-center text-[#1b5e20] shrink-0">
                  <svg className="w-6 h-6 text-[#1b5e20]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 21h18M5 21V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v14M8 9h8M8 13h8M12 7v8M10 7h4" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-[#006837] font-bold text-base sm:text-lg tracking-wide uppercase font-sans leading-tight">
                    {hospitalName || 'HORIZIN HOSPITAL'}
                  </h2>
                  <p className="text-[10px] sm:text-[11px] font-semibold tracking-wider text-[#6b7280] uppercase mt-0.5">
                    APPOINTMENT VERIFICATION
                  </p>
                </div>
              </div>

              {/* Subtle Divider */}
              <div className="border-b border-gray-100 my-3" />

              {/* Greeting */}
              <p className="text-[14px] sm:text-[15px] text-[#1f2937] font-normal leading-snug">
                Hello! Your appointment verification code is:
              </p>

              {/* Grey Card Box */}
              <div className="bg-[#f3f4f6] border border-[#e5e7eb] rounded-2xl p-4 sm:p-5 text-center space-y-1">
                <p className="text-xs sm:text-[13px] text-[#4b5563] font-normal">
                  Your One-Time Password (OTP)
                </p>

                {/* 4-Digit OTP Input */}
                <div className="py-1">
                  <input
                    autoFocus
                    required
                    type="text"
                    maxLength={4}
                    placeholder="••••"
                    value={otpCode}
                    onChange={e => setOtpCode(e.target.value.replace(/\D/g, ''))}
                    className="w-44 mx-auto text-center text-3xl sm:text-4xl font-extrabold tracking-[0.35em] py-1 bg-transparent text-[#00875a] focus:outline-none placeholder:text-gray-300 border-b-2 border-[#00875a]/30 focus:border-[#00875a] transition-all"
                  />
                </div>

                <p className="text-[11px] sm:text-xs text-[#6b7280] font-normal">
                  Valid for 5 minutes
                </p>

                {/* Resend Cooldown */}
                <div className="pt-1.5 flex items-center justify-center text-xs text-[#6b7280] gap-2">
                  {cooldown > 0 ? (
                    <span className="text-[#9b7745] font-semibold">
                      Resend code in {String(Math.floor(cooldown / 60)).padStart(2, '0')}:{String(cooldown % 60).padStart(2, '0')}s
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={isSendingOtp}
                      className="text-[#00875a] font-bold hover:underline inline-flex items-center gap-1"
                    >
                      <RotateCcw size={12} />
                      <span>Resend OTP</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Security Reminder Box */}
              <div className="pt-1 space-y-1">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck size={16} className="text-[#059669] shrink-0" />
                  <span className="font-bold text-[#111827] text-xs sm:text-sm">Security Reminder</span>
                </div>
                <p className="text-[11px] sm:text-xs text-[#1f2937] leading-relaxed pl-5">
                  Never share this OTP with anyone, including hospital staff. Use it only to verify your appointment.
                </p>
              </div>

              {/* Footer disclaimer */}
              <p className="text-[11px] text-[#6b7280] pt-1">
                If you did not request this code, please ignore this message.
              </p>

              {/* Action Buttons - Sticky on Mobile, Static on Desktop */}
              <div className="space-y-2 pt-2 sticky bottom-0 bg-white/95 backdrop-blur-md -mx-4 px-4 py-2 sm:mx-0 sm:px-0 sm:static sm:bg-transparent z-20 border-t border-gray-100 sm:border-0">
                <button
                  type="submit"
                  disabled={isSubmitting || otpCode.length !== 4}
                  className="w-full bg-[#006837] hover:bg-[#00522c] active:scale-[0.99] text-white py-3.5 rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Pre-Booking Consultation...
                    </span>
                  ) : (
                    <>
                      <span>Verify & Pre-Book Consultation</span>
                      <CheckCircle2 size={18} />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleEditDetails}
                  className="w-full text-xs text-[#6b7280] hover:text-[#111827] font-semibold py-1.5 text-center transition-colors cursor-pointer"
                >
                  ← Edit consultation details or phone number
                </button>
              </div>
            </form>
          )}

          {/* ═══════════════════════════════════════════════════════ */}
          {/* STEP 3: INSTANT DIGITAL PASS SCREEN (SCREENSHOT 2)    */}
          {/* ═══════════════════════════════════════════════════════ */}
          {step === 'confirmed' && confirmedPass && (
            <div className="space-y-4 animate-scale-in my-auto">
              {/* Header matching Screenshot 2 */}
              <div className="flex items-center justify-between gap-3 pr-8">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-[#e8f5e9] border border-[#c8e6c9] flex items-center justify-center text-[#1b5e20] shrink-0">
                    <svg className="w-6 h-6 text-[#1b5e20]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 21h18M5 21V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v14M8 9h8M8 13h8M12 7v8M10 7h4" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-[#006837] font-bold text-base sm:text-lg tracking-wide uppercase font-sans leading-tight">
                      {confirmedPass.hospitalName || hospitalName || 'HORIZIN HOSPITAL'}
                    </h2>
                    <p className="text-[10px] sm:text-[11px] font-semibold tracking-wider text-[#6b7280] uppercase mt-0.5">
                      APPOINTMENT CONFIRMATION
                    </p>
                  </div>
                </div>
                <div className="shrink-0 text-[#059669]">
                  <CheckCircle2 size={24} className="text-[#059669]" />
                </div>
              </div>

              {/* Subtle Divider */}
              <div className="border-b border-gray-100 my-2" />

              {/* Highlight Box matching Screenshot 2 */}
              <div className="bg-[#f3f4f6] border border-[#e5e7eb] rounded-2xl p-4 sm:p-5 text-center">
                <h3 className="text-[15px] sm:text-base font-bold text-[#111827]">
                  Appointment Confirmed
                </h3>
                <p className="text-[11px] sm:text-xs text-[#6b7280] mt-0.5">
                  Your consultation has been pre-booked successfully.
                </p>
                <div className="text-2xl sm:text-[28px] font-black text-[#00875a] mt-1.5 tracking-tight">
                  Token #{confirmedPass.tokenNumber}
                </div>
              </div>

              {/* Salutation */}
              <div className="text-xs sm:text-[13px] text-[#111827] space-y-0.5">
                <p>
                  Dear <span className="italic font-medium">{confirmedPass.patientName}</span>,
                </p>
                <p className="text-[#1f2937]">Your appointment details are provided below.</p>
              </div>

              {/* Appointment Details List (Combined close lines) */}
              <div className="space-y-2 pt-0.5">
                {/* 1. Consulting Doctor */}
                <div className="flex items-start gap-2.5">
                  <User size={15} className="text-[#059669] shrink-0 mt-0.5" />
                  <div className="leading-tight">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#6b7280]">
                      CONSULTING DOCTOR:{" "}
                    </span>
                    <span className="text-xs sm:text-[13px] font-bold text-[#111827]">
                      {confirmedPass.doctorName}
                    </span>
                    <span className="text-[11px] text-[#4b5563] ml-1">
                      ({confirmedPass.specialty})
                    </span>
                  </div>
                </div>

                {/* 2. Appointment Date & Session */}
                <div className="flex items-start gap-2.5">
                  <Calendar size={15} className="text-[#059669] shrink-0 mt-0.5" />
                  <div className="leading-tight">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#6b7280]">
                      APPOINTMENT DATE:{" "}
                    </span>
                    <span className="text-xs sm:text-[13px] font-bold text-[#111827]">
                      {confirmedPass.date}
                    </span>
                    <span className="text-[11px] text-[#4b5563] ml-1">
                      • {confirmedPass.sessionLabel || `${confirmedPass.session} Session`}
                    </span>
                  </div>
                </div>

                {/* 3. Estimated Reporting Time */}
                <div className="flex items-start gap-2.5">
                  <Clock size={15} className="text-[#059669] shrink-0 mt-0.5" />
                  <div className="leading-tight">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#6b7280]">
                      ESTIMATED REPORTING TIME:{" "}
                    </span>
                    <span className="text-xs sm:text-[13px] font-bold text-[#006837]">
                      {confirmedPass.estimatedTime}
                    </span>
                    <span className="text-[11px] text-[#6b7280] ml-1">
                      (Report 10m before)
                    </span>
                  </div>
                </div>

                {/* Read More / Read Less Toggle from Estimated Reporting Time */}
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => setIsReadMoreOpen(!isReadMoreOpen)}
                    className="text-xs font-bold text-[#006837] hover:text-[#00522c] hover:underline inline-flex items-center gap-1 transition-colors"
                  >
                    <span>
                      {isReadMoreOpen
                        ? "▴ Read Less"
                        : "▾ Read More (UHID, Hospital Address & Reception)"}
                    </span>
                  </button>
                </div>

                {/* Collapsible Details: UHID, Hospital Address & Reception Desk */}
                {isReadMoreOpen && (
                  <div className="space-y-2 pt-1 border-t border-dashed border-gray-200 animate-fade-in">
                    {/* 4. Unique Health ID (UHID) */}
                    <div className="flex items-start gap-2.5">
                      <FileText size={15} className="text-[#059669] shrink-0 mt-0.5" />
                      <div className="leading-tight">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#6b7280]">
                          UHID:{" "}
                        </span>
                        <span className="text-xs sm:text-[13px] font-bold font-mono text-[#111827]">
                          {confirmedPass.mrn}
                        </span>
                      </div>
                    </div>

                    {/* 5. Hospital Address */}
                    <div className="flex items-start gap-2.5">
                      <MapPin size={15} className="text-[#059669] shrink-0 mt-0.5" />
                      <div className="leading-tight">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#6b7280]">
                          ADDRESS:{" "}
                        </span>
                        <span className="text-xs text-[#374151]">
                          {confirmedPass.hospitalAddress || "Dwaraka Nagar, Kadapa, AP"}
                        </span>
                      </div>
                    </div>

                    {/* 6. Reception Desk */}
                    <div className="flex items-start gap-2.5">
                      <Phone size={15} className="text-[#059669] shrink-0 mt-0.5" />
                      <div className="leading-tight">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#6b7280]">
                          RECEPTION DESK:{" "}
                        </span>
                        <span className="text-xs font-bold text-[#111827]">
                          {confirmedPass.hospitalPhone || "08562-318419"}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Subtle Divider */}
              <div className="border-b border-gray-100 my-1.5" />

              {/* Instructions for Your Visit */}
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <CheckSquare size={16} className="text-[#059669] shrink-0" />
                  <span className="font-bold text-[#111827] text-xs sm:text-sm">
                    Instructions for Your Visit
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-[#374151] leading-relaxed pl-5">
                  Please show this WhatsApp confirmation at the hospital reception. The staff will verify your appointment and guide you through registration (if required) and the vitals assessment.
                </p>
              </div>

              {/* Footer text */}
              <p className="text-[11px] sm:text-xs text-[#6b7280] text-center pt-2">
                Thank you for choosing {confirmedPass.hospitalName || hospitalName || 'HORIZIN HOSPITAL'}.
              </p>

              {/* Action Buttons - Sticky on Mobile, Static on Desktop */}
              <div className="space-y-2 pt-2 sticky bottom-0 bg-white/95 backdrop-blur-md -mx-4 px-4 py-2 sm:mx-0 sm:px-0 sm:static sm:bg-transparent z-20 border-t border-gray-100 sm:border-0">
                <a
                  href={confirmedPass.digitalPassUrl || `/pass/${confirmedPass.appointmentId || confirmedPass.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#006837] hover:bg-[#00522c] active:scale-[0.99] text-white py-2.5 sm:py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-md transition-all text-center cursor-pointer"
                >
                  <ExternalLink size={15} />
                  <span>Open Live Responsive Digital Pass</span>
                </a>

                <div className="flex items-center gap-2.5 sm:gap-3">
                  <button
                    type="button"
                    onClick={handlePrintPass}
                    className="flex-1 bg-white border border-gray-200 hover:bg-gray-50 text-[#1f2937] py-2.5 sm:py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
                  >
                    <Printer size={15} />
                    <span>Print / Save Pass</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleClose}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-[#1f2937] py-2.5 sm:py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <span>Done / Close</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
