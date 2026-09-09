import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Header from './Header';
import Breadcrumb from './Breadcrumb';
import MobileNav from './MobileNav';
import CookieConsentBanner from '@/components/CookieConsentBanner';

const footerLinks = [
  {
    heading: 'Tools',
    links: [
      { label: 'Tax Calculator', to: '/tools#tax' },
      { label: 'Checklist Tracker', to: '/frankfurt-first-30-days-checklist' },
      { label: 'Currency Converter', to: '/tools#currency' },
      { label: 'QR Code Generator', to: '/tools#qr' },
      { label: 'Password Generator', to: '/tools#password' },
      { label: 'Creator Taxes', to: '/creator-taxes' },
    ],
  },
  {
    heading: 'Platform',
    links: [
      { label: 'Service Directory', to: '/directory' },
      { label: 'Partner Offers', to: '/partners' },
      { label: 'Apartment Finder', to: '/apartments' },
      { label: 'Community Forum', to: '/forum' },
      { label: 'Video Tutorials', to: '/tutorials' },
      { label: 'Pricing', to: '/pricing' },
      { label: 'How It Works', to: '/how-it-works' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About Us', to: '/about' },
      { label: 'Contact', to: '/contact' },
      { label: 'FAQ', to: '/faq' },
      { label: 'Privacy Policy', to: '/privacy-policy' },
      { label: 'Terms of Service', to: '/terms' },
      { label: 'Imprint', to: '/imprint' },
    ],
  },
];

const Layout = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, user, logout, isAdmin } = useAuth();

  return (
    <div className="flex min-h-screen flex-col bg-[#f3f4ef]">
      <Header onOpenMobileMenu={() => setMobileMenuOpen(true)} />

      {isAuthenticated && <Breadcrumb />}

      <MobileNav
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        user={user}
        isAdmin={isAdmin}
        logout={logout}
      />

      <main className="w-full flex-1">{children}</main>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <footer className="mt-auto border-t border-[#1e3a35] bg-[#0c2622] text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          {/* Top section */}
          <div className="grid gap-10 py-14 lg:grid-cols-[1.4fr_repeat(3,1fr)]">

            {/* Brand block */}
            <div className="space-y-4">
              <Link to="/" className="group flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0f766e] transition-transform group-hover:scale-105">
                  <span className="text-xl font-black leading-none text-white">F</span>
                </div>
                <div>
                  <p className="text-base font-black leading-tight text-white">Frankfurt Expat Services</p>
                  <p className="text-xs font-medium text-[#5eead4]">frankfurtexpatservices.com</p>
                </div>
              </Link>

	              <p className="max-w-xs text-sm leading-relaxed text-[#94a3b8]">
	                Free account tools and a vetted English-speaking service directory to help newcomers
	                settle into Frankfurt with confidence.
	              </p>

              <div className="flex flex-wrap gap-2">
                <Link to="/signup"
                  className="rounded-lg bg-[#0f766e] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#0d9488]">
                  Create Free Account
                </Link>
                <Link to="/tools"
                  className="rounded-lg border border-[#1e3a35] px-4 py-2 text-xs font-bold text-[#cbd5e1] transition hover:border-[#0f766e] hover:text-white">
                  Open Free Tools
                </Link>
              </div>
            </div>

            {/* Link columns */}
            {footerLinks.map(({ heading, links }) => (
              <div key={heading}>
                <p className="mb-4 text-xs font-black uppercase tracking-[0.18em] text-[#5eead4]">{heading}</p>
                <ul className="space-y-2.5">
                  {links.map(({ label, to }) => (
                    <li key={to}>
                      <Link to={to} className="text-sm text-[#94a3b8] transition hover:text-white">
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div className="flex flex-col items-center justify-between gap-4 border-t border-[#1e3a35] py-6 sm:flex-row">
            <p className="text-xs text-[#64748b]">
              © {new Date().getFullYear()} Frankfurt Expat Services · Free Tools · Trusted Directory · Community Focused
            </p>
            <div className="flex items-center gap-4">
              <Link to="/privacy-policy" className="text-xs text-[#64748b] transition hover:text-[#94a3b8]">Privacy</Link>
              <Link to="/terms" className="text-xs text-[#64748b] transition hover:text-[#94a3b8]">Terms</Link>
              <Link to="/imprint" className="text-xs text-[#64748b] transition hover:text-[#94a3b8]">Imprint</Link>
              <button
                type="button"
                onClick={() => window.dispatchEvent(new Event('fes:open-consent'))}
                className="text-xs text-[#64748b] transition hover:text-[#94a3b8]"
              >
                Cookie Settings
              </button>
            </div>
          </div>

        </div>
      </footer>
      <CookieConsentBanner />
    </div>
  );
};

export default Layout;
