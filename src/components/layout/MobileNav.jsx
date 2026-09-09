import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from '@/lib/motion';
import { X, LogOut, Shield, LineChart, Wrench, User, Home, FileText, CheckSquare, Files, MessageSquare, Video, Calculator, FileCheck, BookOpen, Wallet } from '@/lib/icons';

const MobileNav = ({ isOpen, onClose, user, isAdmin, logout }) => {
  const location = useLocation();

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: Home },
    { name: 'Plan', path: '/plan', icon: FileText },
    { name: 'Checklist Tracker', path: '/frankfurt-first-30-days-checklist', icon: CheckSquare },
    { name: 'Tasks', path: '/tasks', icon: CheckSquare },
    { name: 'Forum', path: '/forum', icon: MessageSquare },
    { name: 'Blog', path: '/blog', icon: BookOpen },
    { name: 'Videos', path: '/tutorials', icon: Video },
    { name: 'Budget', path: '/cost-calculator', icon: Calculator },
    { name: 'Tax Prep', path: '/tax-prep', icon: FileCheck },
    { name: 'Creator Records', path: '/creator-records', icon: Wallet },
    { name: 'Housing', path: '/apartments', icon: Home },
    { name: 'Documents', path: '/documents', icon: Files },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  const adminNav = [
    { name: 'Tasks Registry', path: '/admin/tasks-registry', icon: Shield },
    { name: 'Testing', path: '/admin/testing', icon: Wrench },
    { name: 'Analytics', path: '/admin/analytics', icon: LineChart },
  ];

  const sidebarVariants = {
    closed: { x: '-100%', transition: { type: 'spring', stiffness: 300, damping: 30 } },
    open: { x: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
  };

  const overlayVariants = {
    closed: { opacity: 0 },
    open: { opacity: 1 },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={overlayVariants}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
          />

          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={sidebarVariants}
            className="fixed inset-y-0 left-0 w-64 bg-white shadow-2xl z-50 md:hidden flex flex-col"
          >
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">F</span>
                </div>
                <span className="font-bold text-lg text-gray-900 leading-tight">Frankfurt<br />Expat Services</span>
              </div>
              <button onClick={onClose} className="p-2 text-gray-500 hover:bg-gray-200 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4">
              <nav className="px-2 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={onClose}
                    className={`group flex items-center px-3 py-3 text-base font-medium rounded-md transition-colors ${
                      location.pathname === link.path
                        ? 'bg-teal-50 text-teal-700'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <link.icon className={`mr-3 h-5 w-5 flex-shrink-0 ${
                      location.pathname === link.path ? 'text-teal-600' : 'text-gray-400 group-hover:text-gray-500'
                    }`} />
                    {link.name}
                  </Link>
                ))}

                {isAdmin && (
                  <div className="mt-8">
                    <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Administration
                    </h3>
                    {adminNav.map((link) => (
                      <Link
                        key={link.path}
                        to={link.path}
                        onClick={onClose}
                        className={`group flex items-center px-3 py-3 text-base font-medium rounded-md transition-colors ${
                          location.pathname === link.path
                            ? 'bg-purple-50 text-purple-700'
                            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        <link.icon className={`mr-3 h-5 w-5 flex-shrink-0 ${
                          location.pathname === link.path ? 'text-purple-600' : 'text-gray-400 group-hover:text-gray-500'
                        }`} />
                        {link.name}
                      </Link>
                    ))}
                  </div>
                )}
              </nav>
            </div>

            <div className="border-t border-gray-200 p-4 bg-gray-50">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold text-xs mr-3">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">{user?.name || 'User'}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  logout();
                  onClose();
                }}
                className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileNav;
