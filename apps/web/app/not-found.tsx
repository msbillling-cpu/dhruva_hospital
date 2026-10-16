import Link from 'next/link';
import { Home, ChevronLeft, Stethoscope } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen pt-32 flex flex-col items-center justify-center bg-[#fafcff] px-4 overflow-hidden relative">
      {/* Background Decor */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary-100 rounded-full blur-[120px] opacity-40" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-accent-100 rounded-full blur-[120px] opacity-30" />

      <div className="relative z-10 text-center space-y-12 max-w-2xl">
        {/* Error Visual */}
        <div className="relative inline-block">
          <h1 className="text-[180px] font-black text-primary-900/5 leading-none select-none">404</h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 bg-white rounded-[30px] shadow-2xl flex items-center justify-center text-accent-500 animate-float border border-primary-50">
              <Stethoscope size={48} />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-4xl md:text-5xl font-bold text-primary-950 font-heading">Page Not Found</h2>
          <p className="text-lg text-gray-500 leading-relaxed">
            The page you're looking for doesn't exist or has been moved. 
            Don't worry, our team is still here to take care of you.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-5 justify-center pt-8">
          <Link href="/" className="btn-primary !px-10 !py-5 !rounded-2xl shadow-xl shadow-primary-100">
            <Home size={20} /> Back to Home
          </Link>
          <Link href="/services" className="btn-outline !px-10 !py-5 !rounded-2xl !bg-white">
            <ChevronLeft size={20} /> Our Services
          </Link>
        </div>
      </div>
    </div>
  );
}
