import Image from 'next/image';

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white">
      {/* Abstract background shapes */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-100 rounded-full blur-[100px] opacity-30 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-100 rounded-full blur-[100px] opacity-20 animate-pulse" />
      
      <div className="relative flex flex-col items-center gap-8">
        {/* Hospital Brand Badge */}
        <div className="relative">
          <div className="w-24 h-24 bg-white border border-stone-200 rounded-[30px] flex items-center justify-center p-3 shadow-xl shadow-emerald-950/5 animate-pulse">
            <Image src="/logo.png" alt="Dhruva Hospitals" width={72} height={32} className="object-contain" priority />
          </div>
          {/* Animated rings */}
          <div className="absolute -inset-4 border-2 border-primary-100 rounded-[35px] animate-ping opacity-20" />
          <div className="absolute -inset-8 border border-primary-50 rounded-[40px] animate-ping opacity-10 [animation-delay:0.5s]" />
        </div>
        
        <div className="flex flex-col items-center gap-2">
          <h2 className="text-xl font-bold text-primary-950 font-heading tracking-tight">
            Dhruva Hospitals
          </h2>
          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <div 
                key={i} 
                className="w-1.5 h-1.5 bg-accent-500 rounded-full animate-bounce" 
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
