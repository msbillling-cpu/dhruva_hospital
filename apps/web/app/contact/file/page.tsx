'use client';
import { useState } from 'react';
import { Lock, Download, FileText, ShieldAlert, CheckCircle2, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function HiddenFilePage() {
  const { t } = useLanguage();
  const [password, setPassword] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [error, setError] = useState('');

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'mahe@123') {
      setIsAuthorized(true);
      setError('');
    } else {
      setError(t('Incorrect password. Access denied.', 'తప్పు పాస్‌వర్డ్. యాక్సెస్ తిరస్కరించబడింది.', 'गलत पासवर्ड। पहुंच अस्वीकृत।'));
    }
  };

  const handleDownload = () => {
    window.location.href = `/api/contact/file?password=${encodeURIComponent(password)}`;
  };

  return (
    <div className="min-h-screen bg-[#fafcff] flex items-center justify-center p-6">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[60%] h-[60%] bg-primary-50 rounded-full blur-[120px] opacity-60" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent-50 rounded-full blur-[100px] opacity-40" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {!isAuthorized ? (
          <div className="bg-white rounded-[40px] shadow-2xl p-10 border border-primary-50 animate-scale-in">
            <div className="w-20 h-20 bg-primary-100 rounded-3xl flex items-center justify-center text-primary-600 mb-8 mx-auto shadow-inner">
              <Lock size={40} />
            </div>
            
            <div className="text-center mb-10">
              <h1 className="text-3xl font-extrabold text-primary-900 font-heading mb-3">
                {t('Protected Access', 'రక్షిత యాక్సెస్', 'सुरक्षित पहुंच')}
              </h1>
              <p className="text-gray-500 text-sm">
                {t('Please enter the security password to access the administrative files.', 
                   'అడ్మినిస్ట్రేటివ్ ఫైళ్లను యాక్సెస్ చేయడానికి దయచేసి సెక్యూరిటీ పాస్‌వర్డ్‌ను నమోదు చేయండి.', 
                   'प्रशासनिक फाइलों तक पहुंचने के लिए कृपया सुरक्षा पासवर्ड दर्ज करें।')}
              </p>
            </div>

            <form onSubmit={handleVerify} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                  {t('Security Password', 'సెక్యూరిటీ పాస్‌వర్డ్', 'सुरक्षा पासवर्ड')}
                </label>
                <input 
                  type="password" 
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoFocus
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-500 text-xs font-bold bg-red-50 p-4 rounded-xl border border-red-100 animate-shake">
                  <ShieldAlert size={16} />
                  {error}
                </div>
              )}

              <button 
                type="submit" 
                className="w-full bg-primary-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-primary-700 shadow-xl shadow-primary-100 transition-all active:scale-[0.98] flex items-center justify-center gap-3 group"
              >
                {t('Unlock Files', 'ఫైళ్ళను అన్‌లాక్ చేయండి', 'फाइलें अनलॉक करें')}
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </div>
        ) : (
          <div className="bg-white rounded-[40px] shadow-2xl p-10 border border-primary-50 animate-scale-in">
            <div className="w-20 h-20 bg-green-100 rounded-3xl flex items-center justify-center text-green-600 mb-8 mx-auto shadow-inner">
              <CheckCircle2 size={40} />
            </div>
            
            <div className="text-center mb-10">
              <h1 className="text-3xl font-extrabold text-primary-900 font-heading mb-3">
                {t('Access Granted', 'యాక్సెస్ మంజూరు చేయబడింది', 'पहुंच प्रदान की गई')}
              </h1>
              <p className="text-gray-500 text-sm">
                {t('You can now download the latest appointment data.', 
                   'మీరు ఇప్పుడు తాజా అపాయింట్‌మెంట్ డేటాను డౌన్‌లోడ్ చేసుకోవచ్చు.', 
                   'अब आप नवीनतम अपॉइंटमेंट डेटा डाउनलोड कर सकते हैं।')}
              </p>
            </div>

            <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100 mb-8 flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary-600">
                <FileText size={24} />
              </div>
              <div className="flex-1">
                <p className="font-bold text-gray-900 text-sm">appointments.xlsx</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-black">Excel Spreadsheet</p>
              </div>
            </div>

            <button 
              onClick={handleDownload}
              className="w-full bg-accent-500 text-white py-5 rounded-2xl font-black text-lg hover:bg-accent-600 shadow-xl shadow-accent-100 transition-all active:scale-[0.98] flex items-center justify-center gap-3 group"
            >
              <Download size={20} className="group-hover:translate-y-1 transition-transform" />
              {t('Download Spreadsheet', 'స్ప్రెడ్‌షీట్‌ను డౌన్‌లోడ్ చేయండి', 'स्प्रेडशीट डाउनलोड करें')}
            </button>

            <button 
              onClick={() => setIsAuthorized(false)}
              className="w-full mt-4 text-gray-400 text-xs font-bold hover:text-primary-600 transition-colors"
            >
              {t('Lock Session', 'సెషన్‌ను లాక్ చేయండి', 'सत्र लॉक करें')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
