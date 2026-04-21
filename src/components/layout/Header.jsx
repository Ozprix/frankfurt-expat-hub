import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Menu,
  LogOut,
  Shield,
  LineChart,
  Wrench,
  User,
  MessageSquare,
  Video,
  Calculator,
  Home,
  Wrench as Tools,
  BookOpen,
  ChevronDown,
} from '@/lib/icons';
import { useAuth } from '@/context/AuthContext';
import { useHealthCheck } from '@/hooks/useHealthCheck';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import FeatureAnnouncementBanner from '@/components/FeatureAnnouncementBanner';

const Header = ({ onOpenMobileMenu }) => {
  const { user, isAdmin, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { isHealthy } = useHealthCheck(60000);
  const [toolsOpen, setToolsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname.startsWith(path);

  // ── Authenticated nav items ────────────────────────────────────────────────
  const navItems = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Plan', path: '/plan' },
    { name: 'Forum', path: '/forum', icon: MessageSquare },
    { name: 'Videos', path: '/tutorials', icon: Video },
    { name: 'Budget', path: '/cost-calculator', icon: Calculator },
    { name: 'Housing', path: '/apartments', icon: Home },
  ];

  const adminItems = [
    { name: 'Tasks Registry', path: '/admin/tasks-registry', icon: Shield },
    { name: 'Testing', path: '/admin/testing', icon: Wrench },
    { name: 'Analytics', path: '/admin/analytics', icon: LineChart },
  ];

  // ── Public "Tools" mega-dropdown items ────────────────────────────────────
  const toolLinks = [
    { name: 'All Tools', path: '/tools', desc: 'Tax calculator, QR codes, converters & more' },
    { name: 'Checklist Tracker', path: '/frankfurt-first-30-days-checklist', desc: 'First 30 days setup tracker' },
    { name: 'Salary & Tax', path: '/tools#tax', desc: 'German net pay estimator' },
    { name: 'Currency Converter', path: '/tools#currency', desc: 'Live ECB rates' },
    { name: 'QR Generator', path: '/tools#qr', desc: 'Business cards, Wi-Fi, vCards' },
    { name: 'Password Generator', path: '/tools#password', desc: 'Secure, cryptographic passwords' },
  ];

  return (
    <>
      <FeatureAnnouncementBanner />

      <header className="sticky top-0 z-40 w-full border-b border-[#e2e8f0] bg-white shadow-[0_1px_3px_rgba(15,23,42,0.06)]">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">

          {/* ── Logo ── */}
          <Link to="/" className="group flex flex-shrink-0 items-center gap-2.5">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-[#0f766e] transition-transform group-hover:scale-105">
              <span className="text-lg font-black text-white leading-none">F</span>
            </div>
            <div className="hidden flex-col sm:flex">
              <span className="text-sm font-black leading-tight text-[#0f172a]">Frankfurt</span>
              <span className="text-[11px] font-semibold leading-tight text-[#64748b]">Expat Services</span>
            </div>
          </Link>

          {/* ── Desktop nav ── */}
          {isAuthenticated ? (
            <>
              {/* Authenticated centre nav */}
              <nav className="hidden flex-1 items-center justify-center gap-0.5 lg:flex">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                      isActive(item.path)
                        ? 'bg-[#ecfdf5] text-[#0f766e]'
                        : 'text-[#475569] hover:bg-[#f8fafc] hover:text-[#0f172a]'
                    }`}
                  >
                    {item.icon && <item.icon className="h-4 w-4" />}
                    {item.name}
                  </Link>
                ))}
              </nav>

              {/* Authenticated right section */}
              <div className="hidden items-center gap-3 lg:flex">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link to="/database-status" className="flex items-center">
                        <div className={`h-2 w-2 rounded-full ${isHealthy ? 'bg-emerald-500' : 'bg-red-500 animate-pulse'}`} />
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{isHealthy ? 'System Operational' : 'System Issues Detected'}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                {isAdmin && (
                  <div className="flex items-center gap-1 border-r border-[#e2e8f0] pr-3 mr-1">
                    {adminItems.map((item) => (
                      <Link key={item.path} to={item.path}
                        className="rounded-lg p-2 text-[#94a3b8] transition hover:bg-[#f5f3ff] hover:text-[#7c3aed]"
                        title={item.name}>
                        <item.icon className="h-4 w-4" />
                      </Link>
                    ))}
                  </div>
                )}

                <Link to="/profile"
                  className="flex items-center gap-2 rounded-lg border border-[#e2e8f0] px-3 py-1.5 text-sm font-semibold text-[#0f172a] transition hover:border-[#0f766e] hover:text-[#0f766e]">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#ecfdf5]">
                    <User className="h-3.5 w-3.5 text-[#0f766e]" />
                  </div>
                  <span className="max-w-[100px] truncate">
                    {user?.user_metadata?.full_name?.split(' ')[0] || 'Account'}
                  </span>
                </Link>

                <button onClick={handleLogout}
                  className="rounded-lg p-2 text-[#94a3b8] transition hover:bg-[#fef2f2] hover:text-[#dc2626]"
                  title="Log out">
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Public centre nav */}
              <nav className="hidden flex-1 items-center justify-center gap-0.5 md:flex">
                {/* Tools dropdown */}
                <div className="relative" onMouseLeave={() => setToolsOpen(false)}>
                  <button
                    onMouseEnter={() => setToolsOpen(true)}
                    onClick={() => setToolsOpen((p) => !p)}
                    className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                      isActive('/tools') ? 'bg-[#ecfdf5] text-[#0f766e]' : 'text-[#475569] hover:bg-[#f8fafc] hover:text-[#0f172a]'
                    }`}
                  >
                    <Tools className="h-4 w-4" />
                    Free Tools
                    <ChevronDown className={`h-3.5 w-3.5 transition-transform ${toolsOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {toolsOpen && (
                    <div className="absolute left-0 top-full z-50 mt-1 w-72 rounded-xl border border-[#e2e8f0] bg-white p-2 shadow-[0_8px_24px_rgba(15,23,42,0.12)]">
                      {toolLinks.map((t) => (
                        <Link key={t.path} to={t.path}
                          onClick={() => setToolsOpen(false)}
                          className="block rounded-lg px-3 py-2.5 transition hover:bg-[#f8fafc]">
                          <p className="text-sm font-semibold text-[#0f172a]">{t.name}</p>
                          <p className="text-xs text-[#64748b]">{t.desc}</p>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                <Link to="/directory"
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                    isActive('/directory') ? 'bg-[#ecfdf5] text-[#0f766e]' : 'text-[#475569] hover:bg-[#f8fafc] hover:text-[#0f172a]'
                  }`}>
                  <BookOpen className="h-4 w-4" />
                  Directory
                </Link>

                <Link to="/partners"
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                    isActive('/partners') ? 'bg-[#ecfdf5] text-[#0f766e]' : 'text-[#475569] hover:bg-[#f8fafc] hover:text-[#0f172a]'
                  }`}>
                  Partners
                </Link>

                {[
                  { name: 'Apartments', path: '/apartments', icon: Home },
                  { name: 'Forum', path: '/forum', icon: MessageSquare },
                  { name: 'Blog', path: '/blog', icon: BookOpen },
                  { name: 'About', path: '/about' },
                ].map(({ name, path, icon: Icon }) => (
                  <Link key={path} to={path}
                    className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                      isActive(path) ? 'bg-[#ecfdf5] text-[#0f766e]' : 'text-[#475569] hover:bg-[#f8fafc] hover:text-[#0f172a]'
                    }`}>
                    {Icon && <Icon className="h-4 w-4" />}
                    {name}
                  </Link>
                ))}
              </nav>

              {/* Public right section */}
              <div className="hidden items-center gap-2 md:flex">
                <Link to="/login"
                  className="rounded-lg px-4 py-2 text-sm font-semibold text-[#475569] transition hover:text-[#0f172a]">
                  Log in
                </Link>
                <Link to="/signup"
                  className="rounded-lg bg-[#0f766e] px-4 py-2 text-sm font-bold text-white shadow-[0_4px_12px_rgba(15,118,110,0.3)] transition hover:bg-[#115e59] hover:-translate-y-px">
                  Get Started Free
                </Link>
              </div>
            </>
          )}

          {/* ── Mobile menu button ── */}
          <button
            onClick={onOpenMobileMenu}
            className="rounded-lg p-2 text-[#475569] transition hover:bg-[#f8fafc] lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>
    </>
  );
};

export default Header;
