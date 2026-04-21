import React, { useState } from 'react';
import { Calendar, Check, Loader2, AlertCircle } from '@/lib/icons';
import { useCalendarIntegration } from '@/hooks/useCalendarIntegration';
import { useToast } from '@/components/ui/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const CalendarSyncToggle = ({ task }) => {
  const { integrations, syncTask } = useCalendarIntegration();
  const { toast } = useToast();
  const [syncing, setSyncing] = useState(false);
  const [synced, setSynced] = useState(false); // Ideally this state comes from task data props if stored in DB

  const hasIntegration = integrations.length > 0;
  
  const handleSync = async () => {
    if (!hasIntegration) {
        toast({ title: "No Calendar Connected", description: "Please connect a calendar in settings first.", variant: "destructive" });
        return;
    }
    
    if (!task.dueDate) {
        toast({ title: "Missing Date", description: "Task must have a due date to sync.", variant: "destructive" });
        return;
    }

    setSyncing(true);
    try {
        // Sync to primary active integration
        const provider = integrations[0].provider;
        await syncTask(task, provider);
        setSynced(true);
        toast({ title: "Synced", description: "Task added to your calendar." });
    } catch (e) {
        toast({ title: "Sync Failed", description: e.message, variant: "destructive" });
    } finally {
        setSyncing(false);
    }
  };

  if (!hasIntegration) return null;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
            <button 
              onClick={handleSync}
              disabled={syncing || synced}
              className={`p-1.5 rounded-md transition-colors ${
                  synced 
                    ? 'text-green-600 bg-green-50 cursor-default' 
                    : 'text-gray-400 hover:text-teal-600 hover:bg-gray-100'
              }`}
            >
              {syncing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
              ) : synced ? (
                  <Check className="w-4 h-4" />
              ) : (
                  <Calendar className="w-4 h-4" />
              )}
            </button>
        </TooltipTrigger>
        <TooltipContent>
            {synced ? 'Synced to Calendar' : 'Sync to Calendar'}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default CalendarSyncToggle;