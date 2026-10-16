"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2,
  Calendar,
  Clock,
  User,
  MapPin,
  Phone,
  Printer,
  Share2,
  Navigation,
  ArrowLeft,
  ShieldCheck,
  Building2,
  Sparkles,
  AlertCircle,
  ExternalLink,
} from "lucide-react";

interface AppointmentPassData {
  appointmentId: string;
  tokenNumber: string | number;
  status: string;
  doctorName: string;
  specialty: string;
  patientName: string;
  gender: string;
  age: string;
  uhid: string;
  date: string;
  session: string;
  sessionLabel: string;
  estimatedTime: string;
  hospitalName: string;
  hospitalAddress: string;
  hospitalPhone: string;
  hospitalEmail?: string;
}

export default function DigitalPassPage() {
  const params = useParams();
  const router = useRouter();
  const passId = (params?.id as string) || "";

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pass, setPass] = useState<AppointmentPassData | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!passId) return;

    const fetchPass = async () => {
      try {
        setLoading(true);
        setError(null);
        const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5003/api";
        const res = await fetch(`${apiBase}/public/appointments/pass/${passId}`);
        const data = await res.json();

        if (data.success && data.pass) {
          setPass(data.pass);
        } else {
          setError(data.message || "Unable to locate appointment pass.");
        }
      } catch (err: any) {
        setError("Network error fetching appointment pass. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchPass();
  }, [passId]);

  const handlePrint = () => {
    if (!pass || typeof window === "undefined") return;

    const printHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" />
        <title>Appointment Pass #${pass.tokenNumber} - ${pass.hospitalName || "Hospital"}</title>
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
            <div class="hospital-title">${pass.hospitalName || "HORIZIN HOSPITAL"}</div>
            <div class="sub-badge">APPOINTMENT CONFIRMATION PASS</div>
          </div>
          <div class="token-box">
            <div class="token-title">OPD Consultation Queue</div>
            <div class="token-num">Token #${pass.tokenNumber}</div>
            <div class="token-salute">Dear <strong>${pass.patientName}</strong>, your appointment is confirmed.</div>
          </div>
          <table class="info-table">
            <tr>
              <td class="label">Consulting Doctor</td>
              <td class="val">${pass.doctorName}<div class="sub-val">${pass.specialty}</div></td>
            </tr>
            <tr>
              <td class="label">Appointment Date</td>
              <td class="val">${pass.date}<div class="sub-val">${pass.sessionLabel || pass.session}</div></td>
            </tr>
            <tr>
              <td class="label">Est. Reporting Time</td>
              <td class="val" style="color: #006837;">${pass.estimatedTime} <span class="sub-val">(Report 10m before)</span></td>
            </tr>
            <tr>
              <td class="label">Unique Health ID (UHID)</td>
              <td class="val" style="font-family: monospace;">${pass.uhid || "Assigned at Frontdesk"}</td>
            </tr>
            <tr>
              <td class="label">Hospital Address</td>
              <td class="val" style="font-size: 11.5px; font-weight: 500;">${pass.hospitalAddress || "Dwaraka Nagar, Near RTC Bus Stand, Kadapa, AP"}</td>
            </tr>
            <tr>
              <td class="label">Reception Desk</td>
              <td class="val">${pass.hospitalPhone || "08562-318419"}</td>
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
            MSCURECHAIN HOSPITAL ERP GATEWAY • Thank you for choosing ${pass.hospitalName || "HORIZIN HOSPITAL"}
          </div>
        </div>
      </body>
      </html>
    `;

    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
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

  const handleShare = async () => {
    if (typeof window !== "undefined") {
      const url = window.location.href;
      if (navigator.share) {
        try {
          await navigator.share({
            title: `${pass?.hospitalName || "Hospital"} Appointment Pass #${pass?.tokenNumber}`,
            text: `Appointment Pass for ${pass?.patientName} with ${pass?.doctorName} (Token #${pass?.tokenNumber})`,
            url,
          });
        } catch {
          // ignore share cancellations
        }
      } else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f4fbf7] via-slate-50 to-[#eef6f1] text-slate-800 antialiased py-6 sm:py-12 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        {/* Navigation Bar / Return to Home */}
        <div className="flex items-center justify-between mb-6 print:hidden">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-emerald-800 hover:text-emerald-950 bg-white/80 backdrop-blur px-3 py-1.5 rounded-full border border-emerald-100 shadow-sm transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Hospital Portal
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200 shadow-sm transition-all"
              title="Share or Copy Link"
            >
              <Share2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>{copied ? "Copied Link!" : "Share"}</span>
            </button>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800 px-3.5 py-1.5 rounded-full shadow-sm transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Pass</span>
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-3xl p-12 text-center shadow-lg border border-emerald-100/60">
            <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-800">Loading Digital Pass...</h3>
            <p className="text-sm text-slate-500 mt-1">Fetching live queue token and verified details.</p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="bg-white rounded-3xl p-8 sm:p-10 text-center shadow-lg border border-red-100">
            <div className="w-14 h-14 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">Appointment Pass Not Found</h3>
            <p className="text-sm text-slate-600 max-w-md mx-auto mb-6">{error}</p>
            <Link
              href="/"
              className="inline-flex items-center justify-center px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-xl text-sm transition-all"
            >
              Book an Appointment
            </Link>
          </div>
        )}

        {/* Pass Render (Screenshot 2 Aesthetic, Responsive HTML) */}
        {!loading && pass && (
          <div className="bg-white rounded-3xl shadow-xl shadow-emerald-950/5 border border-emerald-100/70 overflow-hidden print:shadow-none print:border-none">
            {/* Top Security Banner */}
            <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white px-6 py-3 flex items-center justify-between text-xs font-medium">
              <span className="flex items-center gap-1.5 text-emerald-200">
                <ShieldCheck className="w-4 h-4 text-emerald-300" />
                VERIFIED HOSPITAL PASS • NABH ACCREDITED
              </span>
              <span className="text-emerald-100/80 font-mono text-[11px] tracking-wider">
                ID: {pass.appointmentId}
              </span>
            </div>

            {/* Hospital Branding Header */}
            <div className="p-6 sm:p-8 border-b border-slate-100">
              <div className="flex items-center gap-4">
                <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-emerald-800 shadow-sm shrink-0">
                  <Building2 className="w-7 h-7 text-emerald-700" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    {pass.hospitalName.toUpperCase()}
                  </h1>
                  <p className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5 inline text-emerald-600" />
                    APPOINTMENT CONFIRMATION
                  </p>
                </div>
              </div>
            </div>

            {/* Token Hero Banner */}
            <div className="bg-gradient-to-br from-slate-50 via-emerald-50/40 to-teal-50/30 p-6 sm:p-8 border-b border-emerald-100/60 text-center relative overflow-hidden">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/80 text-emerald-900 font-bold text-xs mb-3">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                Consultation Pre-Booked
              </div>
              <p className="text-xs uppercase tracking-widest font-semibold text-slate-500">OPD QUEUE PASS</p>
              <div className="text-4xl sm:text-5xl font-black text-emerald-800 tracking-tight mt-1 mb-2">
                Token #{pass.tokenNumber}
              </div>
              <p className="text-xs sm:text-sm text-slate-600 font-medium">
                Dear <strong className="text-slate-900 font-bold">{pass.patientName}</strong>, your appointment is confirmed.
              </p>
            </div>

            {/* Pass Metadata List */}
            <div className="p-6 sm:p-8 space-y-4 sm:space-y-5">
              {/* Consulting Doctor */}
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50/70 border border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-emerald-100/70 text-emerald-800 flex items-center justify-center shrink-0">
                  <User className="w-5 h-5 text-emerald-700" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    Consulting Doctor
                  </span>
                  <p className="text-base sm:text-lg font-bold text-slate-900 truncate">{pass.doctorName}</p>
                  <p className="text-xs sm:text-sm text-emerald-700 font-semibold">{pass.specialty}</p>
                </div>
              </div>

              {/* Grid: Date & Session + Estimated Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Appointment Date */}
                <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-slate-50/70 border border-slate-100">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                      Appointment Date
                    </span>
                    <p className="text-sm sm:text-base font-bold text-slate-900">{pass.date}</p>
                    <p className="text-xs text-slate-500 font-medium">{pass.sessionLabel}</p>
                  </div>
                </div>

                {/* Estimated Reporting Time */}
                <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-slate-50/70 border border-slate-100">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                      Est. Reporting Time
                    </span>
                    <p className="text-sm sm:text-base font-bold text-slate-900">{pass.estimatedTime}</p>
                    <p className="text-xs text-amber-700 font-medium">Please report 10m before</p>
                  </div>
                </div>
              </div>

              {/* Grid: UHID & Patient Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* UHID */}
                <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-100">
                  <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    Unique Health ID (UHID)
                  </span>
                  <p className="text-sm sm:text-base font-mono font-bold text-emerald-800 mt-0.5">
                    {pass.uhid || "Generated on Visit"}
                  </p>
                </div>

                {/* Patient Profile */}
                <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-100">
                  <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    Patient Details
                  </span>
                  <p className="text-sm sm:text-base font-bold text-slate-900 capitalize mt-0.5">
                    {pass.patientName} {pass.age ? `• ${pass.age}` : ""} {pass.gender ? `• ${pass.gender}` : ""}
                  </p>
                </div>
              </div>

              {/* Hospital Location & Reception */}
              <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/40 border border-emerald-100/80 space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-emerald-900 block">
                      Hospital Location
                    </span>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                      {pass.hospitalAddress}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-emerald-100/70">
                  <a
                    href={`tel:${pass.hospitalPhone.replace(/\s+/g, "")}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-950 transition-colors"
                  >
                    <Phone className="w-4 h-4 text-emerald-600" />
                    Reception Desk: {pass.hospitalPhone}
                  </a>

                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${pass.hospitalName} ${pass.hospitalAddress}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-900 bg-white px-3 py-1 rounded-full border border-emerald-200 shadow-2xs print:hidden"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    Open Google Maps
                    <ExternalLink className="w-3 h-3 ml-0.5 text-emerald-500" />
                  </a>
                </div>
              </div>

              {/* Instructions for Visit */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Instructions for Your Visit
                </h4>
                <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside leading-relaxed font-medium">
                  <li>Show this digital pass or WhatsApp confirmation message at the hospital front desk.</li>
                  <li>Hospital reception staff will verify your appointment and conduct initial vitals assessment.</li>
                  <li>No advance payment required. Consultation fees are settled directly at the hospital billing desk.</li>
                  <li>In case of emergency delays in OPD, token sequences are updated in real-time.</li>
                </ul>
              </div>
            </div>

            {/* Footer Bar */}
            <div className="p-6 bg-slate-900 text-white text-center text-xs">
              <p className="font-semibold text-emerald-400">MSCURECHAIN HOSPITAL ERP GATEWAY</p>
              <p className="text-slate-400 text-[11px] mt-1">
                Thank you for choosing {pass.hospitalName}. For assistance, contact reception at {pass.hospitalPhone}.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
