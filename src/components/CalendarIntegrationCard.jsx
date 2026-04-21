import React, { useState } from 'react';
import { Calendar, RefreshCw, Trash2, CheckCircle, AlertCircle } from '@/lib/icons';
import { formatSyncTime } from '@/utils/calendarUtils';
import { useToast } from '@/components/ui/use-toast';

const CalendarIntegrationCard = ({ provider, integration, onConnect, onDisconnect }) => {
  const isConnected = !!integration;
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleDisconnect = async () => {
    if (!confirm('Are you sure you want to disconnect? This will stop syncing tasks.')) return;
    
    setLoading(true);
    try {
      await onDisconnect(provider);
      toast({ title: "Disconnected", description: "Calendar has been disconnected." });
    } catch (e) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = () => {
    onConnect();
  };

  return (
    <div className={`rounded-xl shadow-lg p-6 border transition-all ${isConnected ? 'bg-white border-teal-100' : 'bg-gray-50 border-gray-200'}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center">
           <div className={`p-3 rounded-lg mr-4 ${provider === 'google' ? 'bg-blue-50 text-blue-600' : 'bg-indigo-50 text-indigo-600'}`}>
             <Calendar className="w-8 h-8" />
           </div>
           <div>
             <h3 className="text-lg font-bold text-gray-900 capitalize">{provider} Calendar</h3>
             <p className="text-sm text-gray-500">
               {isConnected ? `Connected to ${integration.calendar_id}` : 'Sync tasks automatically'}
             </p>
           </div>
        </div>
        
        {isConnected && (
            <span className="flex items-center text-xs font-semibold text-green-700 bg-green-100 px-2 py-1 rounded-full">
              <CheckCircle className="w-3 h-3 mr-1" /> Active
            </span>
        )}
      </div>

      <div className="mt-6 border-t border-gray-100 pt-4 flex items-center justify-between">
         <div className="text-xs text-gray-400">
           {isConnected ? (
             <span className="flex items-center">
                <RefreshCw className="w-3 h-3 mr-1" />
                Synced {formatSyncTime(integration.synced_at)}
             </span>
           ) : (
             <span>Not connected</span>
           )}
         </div>

         <div>
            {isConnected ? (
              <button 
                onClick={handleDisconnect}
                disabled={loading}
                className="text-red-600 text-sm font-medium hover:text-red-800 transition-colors flex items-center"
              >
                <Trash2 className="w-4 h-4 mr-1" /> Disconnect
              </button>
            ) : (
              <button
                onClick={handleConnect}
                className="px-4 py-2 bg-gray-900 text-white text-sm font-bold rounded-lg hover:bg-black transition-colors shadow-md"
              >
                Connect
              </button>
            )}
         </div>
      </div>
    </div>
  );
};

export default CalendarIntegrationCard;