import Link from 'next/link';
import { serviceCategories } from '@/lib/data';
import { ChevronRight, Globe, Shield, FileText, Info, Users, Phone } from 'lucide-react';

export default function SitemapPage() {
  const sections = [
    {
      title: 'Main Navigation',
      icon: Globe,
      links: [
        { name: 'Home', href: '/' },
        { name: 'About Us', href: '/about' },
        { name: 'Our Doctors', href: '/doctors' },
        { name: 'Services Overview', href: '/services' },
        { name: 'Contact Us', href: '/contact' },
      ]
    },
    {
      title: 'Medical Services',
      icon: Shield,
      links: serviceCategories.map(cat => ({ name: cat.name, href: `/services/${cat.id}` }))
    },
    {
      title: 'Legal & Info',
      icon: FileText,
      links: [
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'Terms of Service', href: '/terms' },
        { name: 'Sitemap', href: '/sitemap' },
      ]
    },
    {
      title: 'Emergency',
      icon: Phone,
      links: [
        { name: 'Neonatal / NICU', href: '/services/neonatal' },
        { name: 'Emergency Contact', href: '/contact' },
      ]
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <section className="pt-40 pb-20 bg-[#fafcff] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[40%] h-[100%] bg-primary-50 rounded-full blur-[120px] opacity-60" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center lg:text-left">
          <h1 className="text-5xl font-black text-primary-900 font-heading mb-6">Sitemap</h1>
          <p className="text-xl text-gray-500 max-w-2xl">
            A comprehensive overview of all pages and services available at Dhruva Hospitals.
          </p>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
            {sections.map((section, i) => (
              <div key={i} className="space-y-8 animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-600 shadow-sm border border-primary-100">
                    <section.icon size={24} />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">{section.title}</h2>
                </div>
                <ul className="space-y-4">
                  {section.links.map((link, j) => (
                    <li key={j}>
                      <Link href={link.href} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:bg-white hover:border-primary-100 hover:shadow-lg transition-all group">
                        <span className="text-gray-600 group-hover:text-primary-700 font-medium transition-colors">
                          {link.name}
                        </span>
                        <ChevronRight size={16} className="text-gray-300 group-hover:text-primary-400 group-hover:translate-x-1 transition-all" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
