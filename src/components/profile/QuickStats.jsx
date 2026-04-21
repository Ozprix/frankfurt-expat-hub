
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, MessageSquare, Home, Video, Calculator } from '@/lib/icons';
import { Link } from 'react-router-dom';

const StatCard = ({ icon: Icon, label, value, href, color }) => (
  <Link to={href} className="block group">
    <Card className="hover:shadow-md transition-all duration-200 border-l-4" style={{ borderLeftColor: color }}>
      <CardContent className="p-4 flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-full bg-opacity-10 group-hover:scale-110 transition-transform`} style={{ backgroundColor: `${color}20` }}>
          <Icon className="w-5 h-5" style={{ color: color }} />
        </div>
      </CardContent>
    </Card>
  </Link>
);

const QuickStats = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard 
        icon={Calculator} 
        label="Budgets" 
        value={stats?.total_budgets || 0} 
        href="/cost-calculator" 
        color="#0d9488" // Teal
      />
      <StatCard 
        icon={MessageSquare} 
        label="Forum Posts" 
        value={stats?.total_forum_posts || 0} 
        href="/forum" 
        color="#3b82f6" // Blue
      />
      <StatCard 
        icon={Home} 
        label="Saved Homes" 
        value={stats?.total_apartments_saved || 0} 
        href="/apartments" 
        color="#f59e0b" // Amber
      />
      <StatCard 
        icon={Video} 
        label="Watched" 
        value={stats?.total_videos_watched || 0} 
        href="/tutorials" 
        color="#ef4444" // Red
      />
    </div>
  );
};

export default QuickStats;
