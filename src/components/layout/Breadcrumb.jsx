
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ChevronRight, Home } from '@/lib/icons';

const Breadcrumb = () => {
  const location = useLocation();
  
  // Don't show breadcrumbs on public pages
  const publicPaths = [
    '/', 
    '/login', 
    '/signup', 
    '/how-it-works', 
    '/pricing', 
    '/faq', 
    '/imprint', 
    '/privacy-policy'
  ];
  
  if (publicPaths.includes(location.pathname)) {
    return null;
  }

  const pathnames = location.pathname.split('/').filter((x) => x);

  // Map route segments to readable names
  const breadcrumbNameMap = {
    'dashboard': 'Dashboard',
    'plan': 'My Plan',
    'tasks': 'Tasks',
    'documents': 'Documents',
    'account': 'Account',
    'onboarding': 'Onboarding',
    'admin': 'Admin',
    'settings': 'Settings',
    'help': 'Help',
    'tasks-registry': 'Task Registry',
    'forum': 'Forum',
    'tutorials': 'Tutorials',
    'cost-calculator': 'Cost Calculator',
    'apartments': 'Apartments',
    'features': 'Features'
  };

  return (
    <div className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            <li>
              <div>
                <Link to="/" className="text-gray-400 hover:text-gray-500">
                  <Home className="h-4 w-4" aria-hidden="true" />
                  <span className="sr-only">Home</span>
                </Link>
              </div>
            </li>
            
            {pathnames.map((value, index) => {
              const to = `/${pathnames.slice(0, index + 1).join('/')}`;
              const isLast = index === pathnames.length - 1;
              const name = breadcrumbNameMap[value] || value.charAt(0).toUpperCase() + value.slice(1);

              return (
                <li key={to}>
                  <div className="flex items-center">
                    <ChevronRight className="flex-shrink-0 h-4 w-4 text-gray-300" aria-hidden="true" />
                    {isLast ? (
                      <span className="ml-2 text-sm font-medium text-teal-600" aria-current="page">
                        {name}
                      </span>
                    ) : (
                      <Link
                        to={to}
                        className="ml-2 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
                      >
                        {name}
                      </Link>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        </nav>
      </div>
    </div>
  );
};

export default Breadcrumb;
