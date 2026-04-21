
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Activity, Database, Server, CheckCircle, XCircle, Clock, RefreshCw } from '@/lib/icons';
import { useHealthCheck } from '@/hooks/useHealthCheck';
import DatabaseRecoveryGuide from '@/components/DatabaseRecoveryGuide';
import { motion } from '@/lib/motion';

const StatusRow = ({ label, status, detail }) => (
  <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
    <div className="flex items-center">
      <div className={`w-2 h-2 rounded-full mr-3 ${status === 'healthy' ? 'bg-green-500' : 'bg-red-500'}`} />
      <span className="text-sm font-medium text-gray-700">{label}</span>
    </div>
    <div className="flex items-center">
      <span className={`text-sm ${status === 'healthy' ? 'text-green-600' : 'text-red-600'} mr-3`}>
        {detail || (status === 'healthy' ? 'Operational' : 'Issues Detected')}
      </span>
      {status === 'healthy' ? (
        <CheckCircle className="w-4 h-4 text-green-500" />
      ) : (
        <XCircle className="w-4 h-4 text-red-500" />
      )}
    </div>
  </div>
);

const DatabaseStatusPage = () => {
  const { isHealthy, lastChecked, errors, details, loading, checkNow } = useHealthCheck();
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = async () => {
    setIsRetrying(true);
    await checkNow();
    setTimeout(() => setIsRetrying(false), 500);
  };

  return (
    <>
      <Helmet>
        <title>System Status - Frankfurt Expat Services</title>
      </Helmet>

      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-extrabold text-gray-900 flex items-center justify-center">
              <Activity className="w-8 h-8 mr-3 text-teal-600" />
              System Status
            </h1>
            <p className="mt-2 text-gray-600">
              Current operational status of platform services and database connectivity.
            </p>
          </div>

          <div className="grid gap-6">
            {/* Main Status Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
            >
              <div className={`p-6 border-b border-gray-200 ${isHealthy ? 'bg-green-50' : 'bg-red-50'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`p-3 rounded-full mr-4 ${isHealthy ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                      <Database className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">Database Connection</h2>
                      <p className={`text-sm font-medium ${isHealthy ? 'text-green-700' : 'text-red-700'}`}>
                        {loading ? 'Checking...' : isHealthy ? 'All Systems Operational' : 'Connection Failed'}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={handleRetry}
                    disabled={isRetrying || loading}
                    className="p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-all text-gray-600 hover:text-teal-600 disabled:opacity-50"
                  >
                    <RefreshCw className={`w-5 h-5 ${isRetrying ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <StatusRow 
                  label="Supabase API" 
                  status={isHealthy ? 'healthy' : 'unhealthy'} 
                  detail={details?.connection === 'connected' ? 'Connected' : 'Unreachable'}
                />
                <StatusRow 
                  label="User Tables (Read)" 
                  status={!errors.some(e => e.includes('Table')) ? 'healthy' : 'unhealthy'}
                  detail={details?.tables?.users === 'accessible' || details?.tables?.users === 'restricted' ? 'Accessible' : 'Failed'} 
                />
                <StatusRow 
                  label="RPC Functions" 
                  status={!errors.some(e => e.includes('RPC')) ? 'healthy' : 'unhealthy'} 
                />
                
                <div className="mt-6 flex items-center justify-between text-xs text-gray-400 bg-gray-50 p-3 rounded-lg">
                  <span className="flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    Last Checked: {lastChecked ? lastChecked.toLocaleTimeString() : 'Never'}
                  </span>
                  <span>Latency: {details?.latency || 0}ms</span>
                </div>
              </div>
            </motion.div>

            {/* Error Details & Recovery Guide */}
            {!isHealthy && !loading && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <DatabaseRecoveryGuide onRetry={handleRetry} />
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default DatabaseStatusPage;
