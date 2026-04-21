
import React from 'react';
import { AlertTriangle, RefreshCw, ExternalLink, LifeBuoy } from '@/lib/icons';

const DatabaseRecoveryGuide = ({ onRetry }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-orange-100 overflow-hidden">
      <div className="bg-orange-50 px-6 py-4 border-b border-orange-100 flex items-center">
        <AlertTriangle className="w-5 h-5 text-orange-600 mr-3" />
        <h3 className="font-semibold text-orange-900">Database Recovery Guide</h3>
      </div>
      
      <div className="p-6 space-y-6">
        <div>
          <h4 className="font-medium text-gray-900 mb-2">Troubleshooting Steps</h4>
          <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
            <li>Check your internet connection to ensure you are online.</li>
            <li>Wait 30-60 seconds and try the <strong>Retry Connection</strong> button below.</li>
            <li>If the issue persists, the database might be undergoing maintenance or paused.</li>
          </ol>
        </div>

        <div className="bg-gray-50 rounded-md p-4 text-sm text-gray-700">
          <p className="font-medium mb-1">Status Code: CONNECTION_REFUSED</p>
          <p>The application cannot reach the Supabase backend. This usually indicates a network issue or a paused database instance.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={onRetry}
            className="flex items-center justify-center px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors font-medium text-sm"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry Connection
          </button>
          
          <a
            href="https://status.supabase.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors font-medium text-sm"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Check Supabase Status
          </a>
          
          <a
            href="mailto:hello@frankfurtexpatservices.com"
            className="flex items-center justify-center px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors font-medium text-sm"
          >
            <LifeBuoy className="w-4 h-4 mr-2" />
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
};

export default DatabaseRecoveryGuide;
