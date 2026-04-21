
import React from 'react';
import { Database, AlertTriangle } from '@/lib/icons';
import DatabaseStatusPage from '@/pages/DatabaseStatusPage';

class DatabaseErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error("DatabaseErrorBoundary caught an error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  isDatabaseError(error) {
    if (!error) return false;
    const msg = error.message?.toLowerCase() || '';
    return (
      msg.includes('supabase') || 
      msg.includes('fetch failed') || 
      msg.includes('network request failed') ||
      msg.includes('connection refused') ||
      msg.includes('503') ||
      msg.includes('504')
    );
  }

  render() {
    if (this.state.hasError) {
      const isDbError = this.isDatabaseError(this.state.error);

      // If it looks like a DB error, show the status page directly or a simplified version
      if (isDbError) {
        return (
          <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
             <div className="max-w-lg w-full bg-white rounded-xl shadow-xl overflow-hidden">
                <div className="bg-red-50 p-6 flex items-center border-b border-red-100">
                  <Database className="w-8 h-8 text-red-600 mr-4" />
                  <div>
                    <h2 className="text-xl font-bold text-red-900">Connection Error</h2>
                    <p className="text-red-700 text-sm">We couldn't reach our servers.</p>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 mb-4">
                    The application encountered a critical error while trying to communicate with the database. 
                    This might be due to a network interruption or temporary maintenance.
                  </p>
                  <div className="bg-gray-100 p-3 rounded text-xs font-mono text-gray-700 mb-6 overflow-auto max-h-32">
                    {this.state.error?.toString()}
                  </div>
                  <div className="flex gap-3">
                    <button 
                      onClick={this.handleRetry}
                      className="flex-1 bg-teal-600 text-white py-2 px-4 rounded-lg hover:bg-teal-700 transition font-medium"
                    >
                      Retry Connection
                    </button>
                    <a href="/database-status" className="flex-1 bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition font-medium text-center">
                      View Status
                    </a>
                  </div>
                </div>
             </div>
          </div>
        );
      }

      // Fallback for non-DB errors (generic)
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
           <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
             <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
             <h2 className="text-xl font-bold text-gray-900 mb-2">Something went wrong</h2>
             <p className="text-gray-600 mb-6">An unexpected error occurred. Please try reloading the page.</p>
             <button 
                onClick={this.handleRetry}
                className="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-black transition"
             >
               Reload Application
             </button>
           </div>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default DatabaseErrorBoundary;
