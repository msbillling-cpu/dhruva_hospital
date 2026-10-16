'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingButtons from '@/components/FloatingButtons';
import MobileStickyActions from '@/components/MobileStickyActions';

export default function ClientShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  if (isAdmin) {
    // Isolated enterprise admin workstation - clean canvas without consumer chrome
    return <>{children}</>;
  }

  return (
    <>
      <div className="flex flex-col min-h-screen pb-24 lg:pb-0">
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </div>
      <FloatingButtons />
      <MobileStickyActions />
    </>
  );
}
