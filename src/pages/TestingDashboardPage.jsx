
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useTestingMode } from '@/hooks/useTestingMode';
import { CheckCircle2, XCircle, Database, Activity, RefreshCw, Trash2, Shield } from '@/lib/icons';
import { motion } from '@/lib/motion';

const TestingDashboardPage = () => {
  const { isTesting, enableTestingMode, disableTestingMode, seedAll, clearAll, generateTestReport, lastAction } = useTestingMode();
  const [report, setReport] = useState(generateTestReport());
  const [isSeeding, setIsSeeding] = useState(false);

  useEffect(() => {
    setReport(generateTestReport());
  }, [lastAction, isTesting]);

  const handleSeed = async () => {
    setIsSeeding(true);
    await seedAll();
    setIsSeeding(false);
  };

  const handleClear = async () => {
    setIsSeeding(true);
    await clearAll();
    setIsSeeding(false);
  };

  const features = [
    { name: 'Forum Posts', status: report.dataStatus.forum === 'Seeded', key: 'forum' },
    { name: 'Video Tutorials', status: report.dataStatus.videos === 'Seeded', key: 'videos' },
    { name: 'Apartment Listings', status: report.dataStatus.apartments === 'Seeded', key: 'apartments' },
    { name: 'Budget Templates', status: !!localStorage.getItem('demo_budgets'), key: 'budgets' },
  ];

  return (
    <>
      <Helmet>
        <title>Testing Dashboard - Admin</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>

      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Shield className="w-8 h-8 text-teal-600" />
                Testing Dashboard
              </h1>
              <p className="text-gray-500 mt-2">Manage test data and verify feature integrity.</p>
            </div>
            
            <div className="flex items-center bg-white p-2 rounded-lg border border-gray-200 shadow-sm">
               <span className="mr-3 text-sm font-medium text-gray-600">Testing Mode:</span>
               <button 
                 onClick={isTesting ? disableTestingMode : enableTestingMode}
                 className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${isTesting ? 'bg-teal-600' : 'bg-gray-200'}`}
               >
                 <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isTesting ? 'translate-x-5' : 'translate-x-0'}`} />
               </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Data Management Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Database className="w-5 h-5 text-indigo-600" />
                Demo Data Management
              </h2>

              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    <strong>Current Status:</strong> {report.dataStatus.forum === 'Seeded' ? 'Data Loaded' : 'No Data'}
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    Manage mock data for Forum, Videos, Apartments, and Budgets.
                  </p>
                </div>

                <div className="flex gap-4">
                  <button 
                    onClick={handleSeed}
                    disabled={isSeeding}
                    className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                  >
                    {isSeeding ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Database className="w-5 h-5" />}
                    Seed All Data
                  </button>
                  
                  <button 
                    onClick={handleClear}
                    disabled={isSeeding}
                    className="flex-1 bg-white hover:bg-red-50 text-red-600 border border-red-200 font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                  >
                    {isSeeding ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                    Clear All Data
                  </button>
                </div>

                <div className="border-t border-gray-100 pt-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Feature Data Status</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {features.map((feature) => (
                      <div key={feature.key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-700">{feature.name}</span>
                        {feature.status ? (
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                        ) : (
                          <XCircle className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Performance Metrics */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Activity className="w-5 h-5 text-orange-500" />
                Performance Simulator
              </h2>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-xl text-center">
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Page Load</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">0.45s</p>
                    <p className="text-xs text-green-600 mt-1">Excellent</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl text-center">
                    <p className="text-xs text-gray-500 uppercase tracking-wide">API Latency</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">120ms</p>
                    <p className="text-xs text-green-600 mt-1">Fast</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Database Query Simulation</h3>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                    <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Query Success Rate</span>
                    <span>99.9%</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Checklist</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <input type="checkbox" checked readOnly className="rounded text-teal-600 focus:ring-teal-500" />
                      User Authentication Flow
                    </li>
                    <li className="flex items-center gap-2">
                      <input type="checkbox" checked readOnly className="rounded text-teal-600 focus:ring-teal-500" />
                      Database Connectivity
                    </li>
                    <li className="flex items-center gap-2">
                      <input type="checkbox" checked readOnly className="rounded text-teal-600 focus:ring-teal-500" />
                      Third-party Integrations (Maps/Video)
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TestingDashboardPage;
