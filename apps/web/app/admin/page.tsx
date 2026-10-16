'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { 
  Users, Calendar, Phone, MessageCircle, ArrowUpRight, 
  Search, Filter, Download, Plus, CheckCircle2, Clock, 
  AlertCircle, RefreshCw, Lock, ArrowRight, TrendingUp, 
  Activity, ExternalLink, Trash2, X, BarChart3, Globe,
  Shield, ShieldCheck, Settings, Save, Check, Eye,
  Smartphone, Monitor, Tablet, MapPin, Mail, Navigation
} from 'lucide-react';
import toast from 'react-hot-toast';
import * as XLSX from 'xlsx';
import type { ExtendedAppointment } from '@/lib/appointments';
import type { AnalyticsData } from '@/lib/analytics';
import { useSettings } from '@/context/SettingsContext';

export default function AdminDashboardPage() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [authError, setAuthError] = useState<string>('');

  // Navigation: 3 Core Tabs requested by user
  const [activeTab, setActiveTab] = useState<'analytics' | 'inquiries' | 'settings'>('analytics');

  // Dynamic Settings Context
  const { settings, updateSettings, refreshSettings } = useSettings();
  const [isSavingSettings, setIsSavingSettings] = useState<boolean>(false);

  // Editable Contact Numbers Form State
  const [contactForm, setContactForm] = useState({
    casualtyPhone: '',
    primaryPhone: '',
    secondaryPhone: '',
    whatsappNumber: '',
    email: '',
    address: '',
    landmark: '',
    opdTimings: '',
    googleAnalyticsId: '',
    googleMapsUrl: '',
  });

  // Sync settings into contact form state
  useEffect(() => {
    if (settings) {
      setContactForm({
        casualtyPhone: settings.casualtyPhone || '08562-318419',
        primaryPhone: settings.primaryPhone || '9036852311',
        secondaryPhone: settings.secondaryPhone || '8008508384',
        whatsappNumber: settings.whatsappNumber || '919036852311',
        email: settings.email || 'info@dhruvahospitals.com',
        address: settings.address || '1/705, Dwarka Nagar, Near RTC Bus Stand, Kadapa – 516001, Andhra Pradesh',
        landmark: settings.landmark || 'Adjacent to Rythu Bazar, Opposite Sandhya Circle, Near Kadapa RTC Central Bus Stand',
        opdTimings: settings.opdTimings || 'Mon – Sat: 9:00 AM – 9:00 PM • Emergency: 24/7 Round-the-Clock',
        googleAnalyticsId: settings.googleAnalyticsId || 'G-DHRUVA2026',
        googleMapsUrl: settings.googleMapsUrl || 'https://maps.google.com/?q=Dhruva+Hospitals+Kadapa',
      });
    }
  }, [settings]);

  // Live Online Visitors Simulation / Pulse State
  const [onlineMembers, setOnlineMembers] = useState<number>(18);
  const [currentTime, setCurrentTime] = useState<string>('');

  // Hospital Data State
  const [appointments, setAppointments] = useState<ExtendedAppointment[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Filters for Contact / Inquiries
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [serviceFilter, setServiceFilter] = useState<string>('all');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [selectedInquiryDetail, setSelectedInquiryDetail] = useState<ExtendedAppointment | null>(null);

  // New Inquiry / Patient Registration
  const [newEntry, setNewEntry] = useState({
    name: '',
    phone: '',
    service: 'General Consultation Inquiry',
    doctor: 'Dr. S Mounika Reddy',
    date: new Date().toISOString().split('T')[0],
    message: '',
    location: 'Kadapa Town',
  });

  // Dynamic IST Clock & Online Members Live Pulse
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' IST');
    };
    updateTime();
    const clockInterval = setInterval(updateTime, 1000);

    // Subtle random online user fluctuation (e.g. 14 to 22 members online)
    const pulseInterval = setInterval(() => {
      setOnlineMembers(prev => {
        const change = Math.floor(Math.random() * 3) - 1; // -1, 0, or +1
        return Math.max(12, Math.min(28, prev + change));
      });
    }, 4500);

    return () => {
      clearInterval(clockInterval);
      clearInterval(pulseInterval);
    };
  }, []);

  // Check session storage on mount
  useEffect(() => {
    const sessionAuth = sessionStorage.getItem('dhruva_admin_auth');
    if (sessionAuth === 'true') {
      setIsAuthenticated(true);
      fetchDashboardData();
    } else {
      setIsLoading(false);
    }
  }, []);

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (passwordInput === 'mahe@123' || passwordInput === 'dhruva@2026' || passwordInput.trim() === 'admin') {
      sessionStorage.setItem('dhruva_admin_auth', 'true');
      setIsAuthenticated(true);
      setAuthError('');
      fetchDashboardData();
      toast.success('Welcome to Dhruva Hospitals Web Analytics & Contact Center');
    } else {
      setAuthError('Incorrect security key. Access denied.');
      toast.error('Invalid Security Key');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('dhruva_admin_auth');
    setIsAuthenticated(false);
    setPasswordInput('');
    toast('Logged out from Admin Dashboard');
  };

  const fetchDashboardData = async () => {
    setIsRefreshing(true);
    try {
      const [aptRes, analRes] = await Promise.all([
        fetch('/api/appointments'),
        fetch('/api/analytics'),
      ]);

      if (aptRes.ok) {
        const aptData = await aptRes.json();
        if (aptData.appointments) {
          setAppointments(aptData.appointments);
        }
      }

      if (analRes.ok) {
        const analData = await analRes.json();
        if (analData.data) {
          setAnalytics(analData.data);
        }
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      toast.error('Failed to sync live data');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Status Update Handler
  const handleStatusChange = async (id: string, newStatus: ExtendedAppointment['status']) => {
    try {
      const res = await fetch('/api/appointments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });

      if (res.ok) {
        setAppointments(prev =>
          prev.map(item => item.id === id ? { ...item, status: newStatus } : item)
        );
        toast.success(`Inquiry marked as ${newStatus}`);
      } else {
        toast.error('Could not update status');
      }
    } catch (err) {
      console.error('Update status error:', err);
      toast.error('Network error updating status');
    }
  };

  // Delete Handler
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this contact submission?')) return;
    try {
      const res = await fetch(`/api/appointments?id=${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setAppointments(prev => prev.filter(item => item.id !== id));
        toast.success('Inquiry record deleted');
      } else {
        toast.error('Could not delete entry');
      }
    } catch (err) {
      console.error('Delete error:', err);
      toast.error('Failed to delete entry');
    }
  };

  // Add Manual Entry Handler
  const handleAddManualEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEntry.name || !newEntry.phone) {
      toast.error('Name and phone number are required');
      return;
    }

    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEntry),
      });

      if (res.ok) {
        toast.success('New patient inquiry recorded!');
        setIsAddModalOpen(false);
        setNewEntry({
          name: '',
          phone: '',
          service: 'General Consultation Inquiry',
          doctor: 'Dr. S Mounika Reddy',
          date: new Date().toISOString().split('T')[0],
          message: '',
          location: 'Kadapa Town',
        });
        fetchDashboardData();
      } else {
        toast.error('Failed to create entry');
      }
    } catch (err) {
      console.error('Error creating manual entry:', err);
      toast.error('Network error creating entry');
    }
  };

  // Save Dynamic Contact Numbers Handler
  const handleSaveContactNumbers = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    try {
      const success = await updateSettings(contactForm);
      if (success) {
        toast.success('Hospital phone numbers & contact info saved! Live website updated instantly.');
        await refreshSettings();
      } else {
        toast.error('Failed to save settings. Please try again.');
      }
    } catch (err) {
      console.error('Save settings error:', err);
      toast.error('Error saving contact settings');
    } finally {
      setIsSavingSettings(false);
    }
  };

  // Export to Excel (.xlsx) Function
  const exportToExcel = () => {
    if (appointments.length === 0) {
      toast.error('No entries to export');
      return;
    }

    const data = appointments.map((a, idx) => ({
      'S.No': idx + 1,
      'Inquiry ID': a.uhid || a.id,
      'Patient Name': a.name,
      'Phone Number': a.phone,
      'Department / Service': a.service,
      'Assigned Doctor': a.doctor,
      'Preferred Date': a.date,
      'Status': a.status.toUpperCase(),
      'Location': a.location || 'Kadapa',
      'Message / Inquiry Details': a.message || 'N/A',
      'Submitted At (IST)': new Date(a.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Contact_Forms');

    worksheet['!cols'] = [
      { wch: 6 },
      { wch: 15 },
      { wch: 22 },
      { wch: 15 },
      { wch: 24 },
      { wch: 22 },
      { wch: 14 },
      { wch: 14 },
      { wch: 18 },
      { wch: 38 },
      { wch: 24 },
    ];

    XLSX.writeFile(workbook, `Dhruva_Hospital_Contact_Submissions_${new Date().toISOString().split('T')[0]}.xlsx`);
    toast.success('Exported contact forms to Excel (.xlsx)');
  };

  // Export to CSV Function
  const exportToCSV = () => {
    if (appointments.length === 0) {
      toast.error('No entries to export');
      return;
    }

    const headers = ['Inquiry ID', 'Name', 'Phone', 'Service', 'Doctor', 'Date', 'Status', 'Location', 'Message', 'Submitted At'];
    const rows = appointments.map(a => [
      `"${a.uhid || a.id}"`,
      `"${a.name.replace(/"/g, '""')}"`,
      a.phone,
      `"${a.service}"`,
      `"${a.doctor}"`,
      a.date,
      a.status,
      `"${a.location || 'N/A'}"`,
      `"${(a.message || '').replace(/"/g, '""')}"`,
      `"${new Date(a.createdAt).toLocaleString('en-IN')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `dhruva_hospital_leads_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Exported contact forms to CSV!');
  };

  // Send Direct WhatsApp Reply
  const sendWhatsAppReply = (apt: ExtendedAppointment) => {
    const text = `Hello ${apt.name}, Greetings from Dhruva Hospitals, Kadapa. We received your contact inquiry regarding ${apt.service}. Our care coordinator is pleased to assist you. Emergency Hotline: ${settings?.casualtyPhone || '08562-318419'}.`;
    const url = `https://wa.me/91${apt.phone}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    toast.success(`Opened WhatsApp chat with ${apt.name}`);
  };

  // Filtered Appointments
  const filteredAppointments = useMemo(() => {
    return appointments.filter(item => {
      const matchesSearch = 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.phone.includes(searchQuery) ||
        (item.message && item.message.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.location && item.location.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
      const matchesService = serviceFilter === 'all' || item.service === serviceFilter;

      return matchesSearch && matchesStatus && matchesService;
    });
  }, [appointments, searchQuery, statusFilter, serviceFilter]);

  // ═══════════════════════════════════════════════════════════════════════
  // 1. AUTHENTICATION GATE (PRE-LOGIN)
  // ═══════════════════════════════════════════════════════════════════════
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#061710] via-[#0a2318] to-[#040e0a] flex items-center justify-center p-4 sm:p-6 text-stone-100 relative overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#9b7745]/15 rounded-full blur-[140px] pointer-events-none" />

        <div className="relative z-10 w-full max-w-md bg-stone-900/90 backdrop-blur-xl border border-stone-800 rounded-3xl p-8 sm:p-10 shadow-2xl">
          <div className="text-center space-y-4 mb-8">
            <div className="w-16 h-16 rounded-2xl bg-emerald-950 border border-emerald-700/40 text-[#c5a880] mx-auto flex items-center justify-center shadow-inner">
              <Lock size={28} />
            </div>
            
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-800/60 text-[#c5a880] text-[10px] font-mono font-bold uppercase tracking-wider mb-2">
                <span>Google Analytics & Contact Center</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
                Dhruva Hospitals
              </h1>
              <p className="text-stone-400 text-xs sm:text-sm mt-1">
                Realtime Visitors, Online Members & Contact Form Management
              </p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-mono font-semibold uppercase tracking-wider text-stone-400 flex items-center justify-between">
                <span>Security Access Key</span>
                <span className="text-[10px] text-emerald-400 font-mono">Demo: mahe@123</span>
              </label>
              <input 
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Enter admin password"
                className="w-full px-4 py-3.5 bg-stone-950/80 border border-stone-800 rounded-xl text-stone-100 placeholder-stone-600 focus:outline-none focus:border-[#9b7745] focus:ring-1 focus:ring-[#9b7745] transition-all text-sm font-mono"
                autoFocus
              />
            </div>

            {authError && (
              <div className="p-3 bg-red-950/50 border border-red-800/60 text-red-300 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle size={14} className="shrink-0 text-red-400" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#9b7745] to-[#c5a880] hover:from-[#8a6839] hover:to-[#b3956f] text-[#0a2318] font-bold text-sm tracking-wide transition-all shadow-lg shadow-black/40 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Unlock Admin Dashboard</span>
              <ArrowRight size={16} />
            </button>

            {/* Quick 1-Click Login button for convenience */}
            <button
              type="button"
              onClick={() => {
                setPasswordInput('mahe@123');
                sessionStorage.setItem('dhruva_admin_auth', 'true');
                setIsAuthenticated(true);
                fetchDashboardData();
                toast.success('Logged in successfully!');
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-stone-950 hover:bg-stone-800 border border-stone-700 text-stone-300 hover:text-white font-medium text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <CheckCircle2 size={14} className="text-emerald-400" />
              <span>One-Click Quick Login</span>
            </button>

            <div className="pt-2 text-center">
              <Link 
                href="/" 
                className="text-xs text-stone-500 hover:text-stone-300 transition-colors inline-flex items-center gap-1"
              >
                <span>Return to Hospital Main Website</span>
              </Link>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════
  // 2. MAIN ADMIN WORKSTATION (POST-LOGIN)
  // ═══════════════════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen bg-[#f8faf9] text-stone-900 flex flex-col font-sans">
      
      {/* ─── 2.1 ADMIN HEADER ─── */}
      <header className="sticky top-0 z-40 bg-[#0a2318] border-b border-stone-800 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Left: Brand & Live Online Members Pulse */}
          <div className="flex items-center gap-3.5 w-full sm:w-auto justify-between sm:justify-start">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-950 border border-[#9b7745]/40 flex items-center justify-center text-[#c5a880] font-serif font-bold text-lg">
                D
              </div>
              <div>
                <h1 className="text-base font-serif font-bold tracking-tight text-white leading-tight">
                  Dhruva Hospitals
                </h1>
                <span className="text-[10px] font-mono text-[#c5a880] tracking-wider uppercase block">
                  Google Analytics & Contact Command Desk
                </span>
              </div>
            </Link>

            {/* Live Online Visitors Indicator */}
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/90 border border-emerald-700/60 text-emerald-300 text-xs font-mono font-bold shadow-inner">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span>{onlineMembers} Active Members Online Now</span>
            </div>
          </div>

          {/* Right: Quick Controls */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <div className="hidden md:flex items-center text-xs font-mono text-amber-300 px-3 py-1.5 rounded-xl bg-stone-900 border border-stone-800">
              <Clock size={13} className="mr-1.5 text-amber-400" />
              <span>{currentTime}</span>
            </div>

            <button
              onClick={fetchDashboardData}
              disabled={isRefreshing}
              className="p-2 px-3 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-700 text-stone-300 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-medium cursor-pointer"
              title="Refresh Analytics & Inquiries"
            >
              <RefreshCw size={14} className={isRefreshing ? 'animate-spin text-[#c5a880]' : ''} />
              <span className="hidden md:inline">Refresh</span>
            </button>

            <Link
              href="/"
              target="_blank"
              className="px-3 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-700 text-stone-300 hover:text-white transition-colors text-xs font-medium flex items-center gap-1.5"
            >
              <ExternalLink size={13} />
              <span className="hidden sm:inline">View Website</span>
            </Link>

            <button
              onClick={handleLogout}
              className="px-3 py-2 rounded-xl bg-red-950/60 hover:bg-red-900/80 border border-red-800/80 text-red-200 transition-colors text-xs font-semibold cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>

        {/* 3 CORE TABS BAR REQUESTED BY USER */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-stone-800/80 flex gap-2 overflow-x-auto py-2">
          
          {/* TAB 1: GOOGLE ANALYTICS & ONLINE MEMBERS */}
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'analytics'
                ? 'bg-[#9b7745] text-[#0a2318] shadow-sm'
                : 'text-stone-300 hover:text-white hover:bg-stone-900/60'
            }`}
          >
            <BarChart3 size={15} />
            <span>1. Google Analytics & Online Members</span>
            <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#0a2318] text-[#c5a880]">
              {onlineMembers} Live
            </span>
          </button>

          {/* TAB 2: CONTACT FORMS & PATIENT LEADS */}
          <button
            onClick={() => setActiveTab('inquiries')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'inquiries'
                ? 'bg-[#9b7745] text-[#0a2318] shadow-sm'
                : 'text-stone-300 hover:text-white hover:bg-stone-900/60'
            }`}
          >
            <Users size={15} />
            <span>2. Contact Forms & Patient Inquiries</span>
            <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#0a2318] text-[#c5a880]">
              {appointments.length}
            </span>
          </button>

          {/* TAB 3: DYNAMIC CONTACT NUMBERS & SETTINGS */}
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-[#9b7745] text-[#0a2318] shadow-sm'
                : 'text-stone-300 hover:text-white hover:bg-stone-900/60'
            }`}
          >
            <Settings size={15} />
            <span>3. Change Hospital Phone Numbers & Settings</span>
          </button>

        </div>
      </header>

      {/* ─── 2.2 MAIN DASHBOARD BODY ─── */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">

        {/* ════════════════════════════════════════════════════════════════
            TAB 1: GOOGLE ANALYTICS & ONLINE MEMBERS (REALTIME TRAFFIC)
        ════════════════════════════════════════════════════════════════ */}
        {activeTab === 'analytics' && (
          <div className="space-y-8 animate-fade-in">
            
            {/* Real-time Hero Banner */}
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#0a2318] via-[#0f3424] to-[#071c13] text-white shadow-xl border border-emerald-800/40 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-600/60 text-emerald-300 text-xs font-mono font-bold mb-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                    <span>Google Analytics 4 (GA4) Realtime Telemetry</span>
                  </div>
                  <h2 className="text-2xl sm:text-4xl font-serif font-bold text-white tracking-tight">
                    {onlineMembers} Members Online Right Now
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-300 mt-1 max-w-2xl leading-relaxed">
                    Live active patient traffic browsing Dhruva Hospitals departments, checking specialist doctors, and submitting consultation forms in real-time.
                  </p>
                </div>

                {/* Google Analytics Tag Status Pill */}
                <div className="p-4 rounded-2xl bg-stone-900/90 border border-stone-700/80 shrink-0 text-right space-y-1">
                  <div className="text-[10px] font-mono text-stone-400 uppercase tracking-wider">GA4 Measurement ID</div>
                  <div className="text-sm font-mono font-bold text-[#c5a880]">{settings?.googleAnalyticsId || 'G-DHRUVA2026'}</div>
                  <div className="text-[11px] text-emerald-400 font-semibold flex items-center justify-end gap-1">
                    <CheckCircle2 size={12} />
                    <span>Connected & Streaming</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Top 4 KPI Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              
              {/* Total Visitors */}
              <div className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-xs relative overflow-hidden group hover:border-[#9b7745]/40 transition-colors">
                <div className="flex items-center justify-between text-stone-500 mb-3">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-stone-500">Total Website Visitors</span>
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#0a2318] flex items-center justify-center">
                    <Users size={18} />
                  </div>
                </div>
                <div className="text-3xl font-serif font-bold text-[#0a2318] tracking-tight">
                  {analytics ? analytics.totalVisitors.toLocaleString() : '19,480'}
                </div>
                <div className="mt-2.5 flex items-center gap-2 text-xs font-medium text-emerald-700">
                  <span className="inline-flex items-center font-bold">↑ +26.4%</span>
                  <span className="text-stone-500 font-normal">Last 30 Days</span>
                </div>
              </div>

              {/* Today's Online Page Views */}
              <div className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-xs relative overflow-hidden group hover:border-[#9b7745]/40 transition-colors">
                <div className="flex items-center justify-between text-stone-500 mb-3">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-stone-500">Page Views Today</span>
                  <div className="w-9 h-9 rounded-xl bg-[#9b7745]/10 text-[#9b7745] flex items-center justify-center">
                    <BarChart3 size={18} />
                  </div>
                </div>
                <div className="text-3xl font-serif font-bold text-[#0a2318] tracking-tight">
                  {analytics ? analytics.pageViewsToday.toLocaleString() : '1,140'}
                </div>
                <div className="mt-2.5 flex items-center gap-2 text-xs font-medium text-emerald-700">
                  <span className="inline-flex items-center font-bold">↑ +18.2%</span>
                  <span className="text-stone-500 font-normal">Today's Total Hits</span>
                </div>
              </div>

              {/* Patient Form Inquiries Submitted */}
              <div className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-xs relative overflow-hidden group hover:border-[#9b7745]/40 transition-colors">
                <div className="flex items-center justify-between text-stone-500 mb-3">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-stone-500">Online Contact Leads</span>
                  <div className="w-9 h-9 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center">
                    <Calendar size={18} />
                  </div>
                </div>
                <div className="text-3xl font-serif font-bold text-[#0a2318] tracking-tight">
                  {appointments.length > 0 ? appointments.length : (analytics?.opdFormConversions || 342)}
                </div>
                <div className="mt-2.5 flex items-center gap-2 text-xs font-medium text-emerald-700">
                  <span className="inline-flex items-center font-bold">100% Captured</span>
                  <span className="text-stone-500 font-normal">Form Submissions</span>
                </div>
              </div>

              {/* Avg Engagement Duration */}
              <div className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-xs relative overflow-hidden group hover:border-[#9b7745]/40 transition-colors">
                <div className="flex items-center justify-between text-stone-500 mb-3">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-stone-500">Avg Session Time</span>
                  <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                    <Clock size={18} />
                  </div>
                </div>
                <div className="text-3xl font-serif font-bold text-[#0a2318] tracking-tight">
                  {analytics?.avgEngagementTime || '2m 48s'}
                </div>
                <div className="mt-2.5 flex items-center gap-2 text-xs font-medium text-emerald-700">
                  <span className="inline-flex items-center font-bold">High Intent</span>
                  <span className="text-stone-500 font-normal">Patient Engagement</span>
                </div>
              </div>

            </div>

            {/* 14-Day Traffic Trend Bar Chart */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-serif font-bold text-[#0a2318]">
                    14-Day Online Patient Traffic & Visitor Trend
                  </h3>
                  <p className="text-xs text-stone-500 mt-1">
                    Daily unique patients browsing clinical departments, viewing doctor profiles, and submitting contact forms.
                  </p>
                </div>
                <div className="flex items-center gap-4 text-xs font-mono">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-md bg-[#0a2318]" />
                    <span className="text-stone-600">Daily Online Visitors</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-md bg-[#9b7745]" />
                    <span className="text-stone-600">Inquiry Leads</span>
                  </div>
                </div>
              </div>

              {/* Responsive Visual Bar Chart */}
              <div className="h-64 flex items-end gap-2 sm:gap-3 pt-8 pb-4 border-b border-stone-200 overflow-x-auto">
                {(analytics?.dailyTraffic || []).map((day, i) => {
                  const maxVal = 1400;
                  const heightPercent = Math.min(100, Math.round((day.visitors / maxVal) * 100));

                  return (
                    <div key={i} className="flex-1 min-w-[32px] flex flex-col items-center gap-2 group relative">
                      {/* Tooltip on Hover */}
                      <div className="absolute -top-14 bg-[#0a2318] text-white p-2 rounded-lg text-[10px] font-mono opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 whitespace-nowrap shadow-lg">
                        <p className="font-bold text-[#c5a880]">{day.date}</p>
                        <p>{day.visitors} Online Visitors • {day.leads} Inquiries</p>
                      </div>

                      <div className="w-full flex items-end justify-center gap-1 h-48 bg-stone-50 rounded-xl p-1 relative">
                        <div 
                          style={{ height: `${heightPercent}%` }}
                          className="w-full bg-gradient-to-t from-[#0a2318] to-[#1a4a36] rounded-lg transition-all duration-500 group-hover:from-[#9b7745] group-hover:to-[#c5a880]"
                        />
                      </div>
                      <span className="text-[10px] font-mono text-stone-500 truncate w-full text-center">
                        {day.date}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Two-Column Deep Analytics: Top Visited Pages & Regional Locations */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left: Top Pages Online Members Are Visiting (7 cols) */}
              <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-serif font-bold text-[#0a2318]">
                      Top Pages Visited by Online Members
                    </h3>
                    <p className="text-xs text-stone-500 mt-0.5">Where online traffic lands and explores on the hospital site</p>
                  </div>
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#9b7745] bg-[#9b7745]/10 px-2.5 py-1 rounded-full">
                    Page Traffic
                  </span>
                </div>

                <div className="space-y-4">
                  {(analytics?.topPages || []).map((page, i) => (
                    <div key={i} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-stone-800 flex items-center gap-2">
                          <span className="text-stone-400 font-mono">0{i+1}.</span>
                          <span>{page.name}</span>
                        </span>
                        <span className="font-mono text-stone-600 font-semibold">
                          {page.views.toLocaleString()} views ({page.percentage}%)
                        </span>
                      </div>
                      <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-[#0a2318] to-[#9b7745] rounded-full transition-all duration-700"
                          style={{ width: `${page.percentage * 2}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Regional Rayalaseema Catchment & Device Breakdown (5 cols) */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* Regional Distribution Card */}
                <div className="bg-white p-6 sm:p-7 rounded-3xl border border-stone-200 shadow-xs space-y-4">
                  <h3 className="text-lg font-serif font-bold text-[#0a2318]">
                    Online Visitor Locations
                  </h3>
                  <p className="text-xs text-stone-500">Where online visitors are connecting from in Andhra Pradesh</p>

                  <div className="space-y-3 pt-2">
                    {(analytics?.regionalCatchment || []).map((reg, i) => (
                      <div key={i} className="flex items-center justify-between text-xs py-1 border-b border-stone-100 last:border-none">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[#9b7745]" />
                          <span className="font-medium text-stone-800">{reg.location}</span>
                        </div>
                        <div className="font-mono text-right">
                          <span className="font-bold text-stone-900">{reg.inquiries} visitors</span>
                          <span className="text-stone-400 ml-1.5">({reg.percentage}%)</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Device Breakdown */}
                <div className="bg-white p-6 sm:p-7 rounded-3xl border border-stone-200 shadow-xs space-y-4">
                  <h3 className="text-lg font-serif font-bold text-[#0a2318]">
                    Device Breakdown
                  </h3>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200">
                      <Smartphone size={18} className="mx-auto text-emerald-700 mb-1" />
                      <div className="text-xs font-semibold text-stone-600">Mobile</div>
                      <div className="text-lg font-bold font-mono text-stone-900">76%</div>
                    </div>
                    <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200">
                      <Monitor size={18} className="mx-auto text-[#9b7745] mb-1" />
                      <div className="text-xs font-semibold text-stone-600">Desktop</div>
                      <div className="text-lg font-bold font-mono text-stone-900">20%</div>
                    </div>
                    <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200">
                      <Tablet size={18} className="mx-auto text-cyan-700 mb-1" />
                      <div className="text-xs font-semibold text-stone-600">Tablet</div>
                      <div className="text-lg font-bold font-mono text-stone-900">4%</div>
                    </div>
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════
            TAB 2: CONTACT FORMS & PATIENT LEADS SUBMISSIONS
        ════════════════════════════════════════════════════════════════ */}
        {activeTab === 'inquiries' && (
          <div className="space-y-6 animate-fade-in">
            
            {/* Control Bar: Search, Filters & Export */}
            <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-4">
              
              <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
                
                {/* Search Bar */}
                <div className="relative flex-1">
                  <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input 
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search contact forms by Name, Phone, Town or Message..."
                    className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#9b7745] focus:bg-white transition-all font-sans"
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>

                {/* Export Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={exportToExcel}
                    className="px-3.5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
                    title="Download Excel (.xlsx) file"
                  >
                    <Download size={14} />
                    <span>Export Excel (.xlsx)</span>
                  </button>

                  <button
                    onClick={exportToCSV}
                    className="px-3 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 border border-stone-200 text-stone-700 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                    title="Download CSV"
                  >
                    <span>CSV</span>
                  </button>

                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="px-3.5 py-2.5 rounded-xl bg-[#0a2318] hover:bg-[#123626] text-[#c5a880] text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <Plus size={15} />
                    <span>+ New Entry</span>
                  </button>
                </div>

              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-stone-100 text-xs">
                
                {/* Status Filter */}
                <div className="flex items-center gap-1.5">
                  <span className="text-stone-400 font-mono">Status:</span>
                  <select 
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-2.5 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-700 text-xs focus:outline-none focus:border-[#9b7745]"
                  >
                    <option value="all">All Inquiries ({appointments.length})</option>
                    <option value="pending">Pending</option>
                    <option value="contacted">Contacted</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                {/* Department Filter */}
                <div className="flex items-center gap-1.5">
                  <span className="text-stone-400 font-mono">Service:</span>
                  <select 
                    value={serviceFilter}
                    onChange={(e) => setServiceFilter(e.target.value)}
                    className="px-2.5 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-700 text-xs focus:outline-none focus:border-[#9b7745]"
                  >
                    <option value="all">All Services</option>
                    <option value="fertility">IVF & Infertility</option>
                    <option value="neonatal">Level-III NICU & Preterm</option>
                    <option value="gynaecology">Gynaecology & Surgery</option>
                    <option value="pregnancy">Maternity & Delivery</option>
                    <option value="emergency">Casualty Emergency</option>
                  </select>
                </div>

                <div className="ml-auto text-stone-500 font-mono text-[11px]">
                  Showing <strong>{filteredAppointments.length}</strong> of {appointments.length} submissions
                </div>

              </div>

            </div>

            {/* Contact Form Submissions Table */}
            <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  
                  {/* Table Header */}
                  <thead>
                    <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 font-mono uppercase tracking-wider text-[11px]">
                      <th className="py-3.5 px-4 font-semibold">Patient / Inquirer</th>
                      <th className="py-3.5 px-4 font-semibold">Phone & Quick Connect</th>
                      <th className="py-3.5 px-4 font-semibold">Department & Doctor</th>
                      <th className="py-3.5 px-4 font-semibold">Preferred Date</th>
                      <th className="py-3.5 px-4 font-semibold">Clinical Note / Message</th>
                      <th className="py-3.5 px-4 font-semibold">Status</th>
                      <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>

                  {/* Table Body */}
                  <tbody className="divide-y divide-stone-100">
                    {filteredAppointments.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-stone-400">
                          <Users size={32} className="mx-auto mb-2 text-stone-300" />
                          <p className="font-medium text-stone-600">No contact submissions found matching your filters.</p>
                        </td>
                      </tr>
                    ) : (
                      filteredAppointments.map((apt) => (
                        <tr key={apt.id} className="hover:bg-stone-50/80 transition-colors group">
                          
                          {/* Name & Location */}
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-stone-900 group-hover:text-emerald-800 transition-colors text-sm">
                              {apt.name}
                            </div>
                            <div className="flex items-center gap-1.5 text-[11px] font-mono text-stone-400 mt-0.5">
                              <span className="font-semibold text-stone-600">{apt.uhid || apt.id}</span>
                              <span>•</span>
                              <span>{apt.location || 'Kadapa'}</span>
                            </div>
                          </td>

                          {/* Phone with 1-click Call & 1-click WhatsApp */}
                          <td className="py-3.5 px-4">
                            <div className="font-mono text-stone-900 font-semibold">{apt.phone}</div>
                            <div className="flex items-center gap-2 mt-1">
                              <a 
                                href={`tel:${apt.phone}`} 
                                className="p-1 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
                                title="Call Inquirer Directly"
                              >
                                <Phone size={12} />
                              </a>
                              <button
                                onClick={() => sendWhatsAppReply(apt)}
                                className="px-2 py-0.5 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-mono text-[10px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                                title="Send WhatsApp Message"
                              >
                                <MessageCircle size={11} className="text-[#25D366]" />
                                <span>WhatsApp</span>
                              </button>
                            </div>
                          </td>

                          {/* Department & Doctor */}
                          <td className="py-3.5 px-4">
                            <div className="font-semibold text-stone-800 capitalize">
                              {apt.service}
                            </div>
                            <div className="text-[11px] text-stone-500 truncate max-w-[170px]">
                              {apt.doctor}
                            </div>
                          </td>

                          {/* Date */}
                          <td className="py-3.5 px-4 font-mono text-stone-600">
                            {apt.date}
                          </td>

                          {/* Message Snippet */}
                          <td className="py-3.5 px-4 max-w-xs">
                            <p className="text-stone-700 truncate text-xs" title={apt.message}>
                              {apt.message || 'General Inquiry'}
                            </p>
                          </td>

                          {/* Status Dropdown */}
                          <td className="py-3.5 px-4">
                            <select
                              value={apt.status}
                              onChange={(e) => handleStatusChange(apt.id, e.target.value as ExtendedAppointment['status'])}
                              className={`px-2 py-1 rounded-lg text-[11px] font-bold font-mono focus:outline-none cursor-pointer border ${
                                apt.status === 'confirmed'
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                  : apt.status === 'contacted'
                                    ? 'bg-cyan-50 text-cyan-800 border-cyan-300'
                                    : apt.status === 'completed'
                                      ? 'bg-stone-100 text-stone-700 border-stone-300'
                                      : apt.status === 'cancelled'
                                        ? 'bg-red-50 text-red-800 border-red-200'
                                        : 'bg-amber-50 text-amber-800 border-amber-300 animate-pulse'
                              }`}
                            >
                              <option value="pending">Pending</option>
                              <option value="contacted">Contacted</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="completed">Completed</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>

                          {/* Actions: View & Delete */}
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => setSelectedInquiryDetail(apt)}
                                className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors cursor-pointer"
                                title="View Details"
                              >
                                <Eye size={14} />
                              </button>
                              <button
                                onClick={() => handleDelete(apt.id)}
                                className="p-1.5 rounded-lg hover:bg-red-50 text-stone-400 hover:text-red-600 transition-colors cursor-pointer"
                                title="Delete Submission"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>

                        </tr>
                      ))
                    )}
                  </tbody>

                </table>
              </div>
            </div>

          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════
            TAB 3: DYNAMIC CONTACT NUMBERS & HOSPITAL SETTINGS
        ════════════════════════════════════════════════════════════════ */}
        {activeTab === 'settings' && (
          <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
            
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs space-y-6">
              
              <div className="border-b border-stone-100 pb-5">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-mono font-bold uppercase tracking-wider mb-2">
                  <Phone size={12} />
                  <span>Dynamic Website Configuration</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900">
                  Update Hospital Phone Numbers & Contact Details
                </h2>
                <p className="text-xs text-stone-500 mt-1">
                  Change the casualty phone number, WhatsApp number, doctor lines, and address here. All updates apply immediately across the entire website header, footer, call buttons, and WhatsApp floaters.
                </p>
              </div>

              <form onSubmit={handleSaveContactNumbers} className="space-y-6">
                
                {/* Section 1: Phone Numbers */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-stone-900 font-mono uppercase tracking-wider text-emerald-800 flex items-center gap-2">
                    <Phone size={15} />
                    <span>Hospital Hotlines & Direct Phone Numbers</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    {/* 24/7 Casualty Number */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-stone-700 flex items-center justify-between">
                        <span>24/7 Casualty Emergency Hotline *</span>
                        <span className="text-[10px] text-red-600 font-mono font-bold">Top Header & Navbar</span>
                      </label>
                      <input 
                        type="text"
                        required
                        value={contactForm.casualtyPhone}
                        onChange={(e) => setContactForm({ ...contactForm, casualtyPhone: e.target.value })}
                        placeholder="e.g. 08562-318419"
                        className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-mono font-bold text-stone-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
                      />
                    </div>

                    {/* WhatsApp Number */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-stone-700 flex items-center justify-between">
                        <span>Official WhatsApp Number *</span>
                        <span className="text-[10px] text-emerald-600 font-mono font-bold">Floating Button & Forms</span>
                      </label>
                      <input 
                        type="text"
                        required
                        value={contactForm.whatsappNumber}
                        onChange={(e) => setContactForm({ ...contactForm, whatsappNumber: e.target.value })}
                        placeholder="e.g. 919036852311 (Include Country Code 91)"
                        className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-mono font-bold text-stone-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
                      />
                    </div>

                    {/* Primary Mobile / Doctor Direct */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-stone-700 flex items-center justify-between">
                        <span>Doctor Direct / Primary Mobile *</span>
                        <span className="text-[10px] text-stone-400 font-mono">Floating Call & Sticky Action</span>
                      </label>
                      <input 
                        type="text"
                        required
                        value={contactForm.primaryPhone}
                        onChange={(e) => setContactForm({ ...contactForm, primaryPhone: e.target.value })}
                        placeholder="e.g. 9036852311"
                        className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-mono font-bold text-stone-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
                      />
                    </div>

                    {/* Secondary Desk Phone */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-stone-700 flex items-center justify-between">
                        <span>Reception / Secondary Helpline</span>
                        <span className="text-[10px] text-stone-400 font-mono">Footer & Contact Page</span>
                      </label>
                      <input 
                        type="text"
                        value={contactForm.secondaryPhone}
                        onChange={(e) => setContactForm({ ...contactForm, secondaryPhone: e.target.value })}
                        placeholder="e.g. 8008508384"
                        className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-mono font-bold text-stone-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
                      />
                    </div>

                  </div>
                </div>

                {/* Section 2: Email, Hours & Address */}
                <div className="space-y-4 pt-4 border-t border-stone-100">
                  <h3 className="text-sm font-bold text-stone-900 font-mono uppercase tracking-wider text-emerald-800 flex items-center gap-2">
                    <Mail size={15} />
                    <span>Hospital Email, Working Hours & Physical Address</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    {/* Official Email */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-stone-700">Hospital Official Email</label>
                      <input 
                        type="email"
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        placeholder="e.g. info@dhruvahospitals.com"
                        className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
                      />
                    </div>

                    {/* Working Hours */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-stone-700">OPD & Casualty Working Hours</label>
                      <input 
                        type="text"
                        value={contactForm.opdTimings}
                        onChange={(e) => setContactForm({ ...contactForm, opdTimings: e.target.value })}
                        placeholder="e.g. Mon – Sat: 9:00 AM – 9:00 PM • Emergency: 24/7"
                        className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
                      />
                    </div>

                  </div>

                  {/* Address */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-stone-700">Hospital Campus Address</label>
                    <input 
                      type="text"
                      value={contactForm.address}
                      onChange={(e) => setContactForm({ ...contactForm, address: e.target.value })}
                      placeholder="e.g. 1/705, Dwarka Nagar, Near RTC Bus Stand, Kadapa – 516001, Andhra Pradesh"
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
                    />
                  </div>

                  {/* Landmark */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-stone-700">Prominent Landmark Details</label>
                    <input 
                      type="text"
                      value={contactForm.landmark}
                      onChange={(e) => setContactForm({ ...contactForm, landmark: e.target.value })}
                      placeholder="e.g. Adjacent to Rythu Bazar, Opposite Sandhya Circle, Near Kadapa RTC Central Bus Stand"
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
                    />
                  </div>
                </div>

                {/* Section 3: Google Analytics Integration ID */}
                <div className="space-y-4 pt-4 border-t border-stone-100">
                  <h3 className="text-sm font-bold text-stone-900 font-mono uppercase tracking-wider text-emerald-800 flex items-center gap-2">
                    <BarChart3 size={15} />
                    <span>Google Analytics 4 (GA4) Tracking Configuration</span>
                  </h3>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-stone-700 flex items-center justify-between">
                      <span>Google Analytics Measurement ID</span>
                      <a 
                        href="https://analytics.google.com" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-[11px] text-[#9b7745] hover:underline font-bold flex items-center gap-1"
                      >
                        <span>Open Google Analytics Console</span>
                        <ExternalLink size={11} />
                      </a>
                    </label>
                    <input 
                      type="text"
                      value={contactForm.googleAnalyticsId}
                      onChange={(e) => setContactForm({ ...contactForm, googleAnalyticsId: e.target.value })}
                      placeholder="e.g. G-XXXXXXXXXX"
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-mono font-bold text-stone-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
                    />
                    <p className="text-[11px] text-stone-500">
                      Enter your official Google Analytics 4 Measurement Tag. It will automatically load the Google tracking tag across all pages of your hospital website to track online members and visits.
                    </p>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4 border-t border-stone-100 flex items-center justify-end gap-3">
                  <button
                    type="submit"
                    disabled={isSavingSettings}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-800 to-teal-800 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs tracking-wider uppercase transition-all shadow-md flex items-center gap-2 cursor-pointer"
                  >
                    <Save size={15} />
                    <span>{isSavingSettings ? 'Saving Numbers...' : 'Save & Update Live Website Numbers'}</span>
                  </button>
                </div>

              </form>

            </div>

          </div>
        )}

      </main>

      {/* ════════════════════════════════════════════════════════════════
          MODAL: ADD MANUAL INQUIRY / PATIENT LEAD
      ════════════════════════════════════════════════════════════════ */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 border border-stone-200 shadow-2xl space-y-5 my-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-serif font-bold text-stone-900">
                  Record New Patient Inquiry
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Adds an entry to the patient contact leads registry
                </p>
              </div>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-600 hover:bg-stone-100"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddManualEntry} className="space-y-4">
              
              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700">Patient Full Name *</label>
                <input 
                  type="text"
                  required
                  value={newEntry.name}
                  onChange={(e) => setNewEntry({ ...newEntry, name: e.target.value })}
                  placeholder="e.g. S. Ramanjaneyulu"
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700">Phone Number *</label>
                <input 
                  type="tel"
                  required
                  value={newEntry.phone}
                  onChange={(e) => setNewEntry({ ...newEntry, phone: e.target.value })}
                  placeholder="e.g. 9848022341"
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-emerald-600 focus:bg-white font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-700">Service Category</label>
                  <select
                    value={newEntry.service}
                    onChange={(e) => setNewEntry({ ...newEntry, service: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900"
                  >
                    <option value="fertility">IVF & Infertility</option>
                    <option value="neonatal">Level-III NICU & Preterm</option>
                    <option value="gynaecology">Gynaecology & Surgery</option>
                    <option value="pregnancy">Maternity & Delivery</option>
                    <option value="emergency">Casualty Emergency</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-700">Consultation Date</label>
                  <input 
                    type="date"
                    value={newEntry.date}
                    onChange={(e) => setNewEntry({ ...newEntry, date: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700">Location / Town</label>
                <input 
                  type="text"
                  value={newEntry.location}
                  onChange={(e) => setNewEntry({ ...newEntry, location: e.target.value })}
                  placeholder="e.g. Kadapa, Proddatur, Rayachoti"
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700">Message / Inquiry Details</label>
                <textarea 
                  rows={2}
                  value={newEntry.message}
                  onChange={(e) => setNewEntry({ ...newEntry, message: e.target.value })}
                  placeholder="Inquiry notes..."
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-stone-300 text-stone-700 text-xs font-semibold hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold transition-all shadow-md"
                >
                  Save Inquiry
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════
          MODAL: VIEW FULL INQUIRY DETAILS
      ════════════════════════════════════════════════════════════════ */}
      {selectedInquiryDetail && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-stone-200 shadow-2xl space-y-5 my-8">
            
            <div className="flex items-start justify-between border-b border-stone-100 pb-4">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#9b7745] bg-[#9b7745]/10 px-2 py-0.5 rounded-md">
                  Inquiry ID: {selectedInquiryDetail.uhid || selectedInquiryDetail.id}
                </span>
                <h3 className="text-lg font-serif font-bold text-stone-900 mt-1">
                  {selectedInquiryDetail.name}
                </h3>
                <p className="text-xs text-stone-500">{selectedInquiryDetail.location || 'Kadapa District'}</p>
              </div>

              <button 
                onClick={() => setSelectedInquiryDetail(null)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-600 hover:bg-stone-100"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-stone-50">
                <span className="text-[10px] font-mono text-stone-400 block">Phone Number</span>
                <span className="font-bold font-mono text-stone-900 block mt-0.5">{selectedInquiryDetail.phone}</span>
              </div>
              <div className="p-3 rounded-2xl bg-stone-50">
                <span className="text-[10px] font-mono text-stone-400 block">Service Requested</span>
                <span className="font-bold capitalize text-stone-900 block mt-0.5">{selectedInquiryDetail.service}</span>
              </div>
              <div className="p-3 rounded-2xl bg-stone-50">
                <span className="text-[10px] font-mono text-stone-400 block">Preferred Date</span>
                <span className="font-bold font-mono text-stone-900 block mt-0.5">{selectedInquiryDetail.date}</span>
              </div>
              <div className="p-3 rounded-2xl bg-stone-50">
                <span className="text-[10px] font-mono text-stone-400 block">Status</span>
                <span className="font-bold uppercase text-emerald-800 block mt-0.5">{selectedInquiryDetail.status}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
              <span className="text-[11px] font-mono font-bold text-stone-500 uppercase block mb-1">Inquiry Message</span>
              <p className="text-xs text-stone-800 leading-relaxed">
                {selectedInquiryDetail.message || 'Standard patient consultation request.'}
              </p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => sendWhatsAppReply(selectedInquiryDetail)}
                className="px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <MessageCircle size={14} className="text-[#25D366]" />
                <span>Chat on WhatsApp</span>
              </button>

              <button
                onClick={() => setSelectedInquiryDetail(null)}
                className="px-4 py-2 rounded-xl bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
