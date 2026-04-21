
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useAnalytics } from '@/hooks/useAnalytics';
import { Users, MousePointer, Video, MessageSquare, TrendingUp } from '@/lib/icons';
import { motion } from '@/lib/motion';

const AnalyticsDashboardPage = () => {
  const { getFeatureStats } = useAnalytics();
  const [stats, setStats] = useState(null);
  const [charts, setCharts] = useState(null);

  useEffect(() => {
    getFeatureStats().then(setStats);
    import('recharts').then(setCharts).catch((error) => {
      console.error('Failed to load analytics charts:', error);
      setCharts(false);
    });
  }, []);

  const data = [
    { name: 'Mon', users: 400, interactions: 2400 },
    { name: 'Tue', users: 300, interactions: 1398 },
    { name: 'Wed', users: 200, interactions: 9800 },
    { name: 'Thu', users: 278, interactions: 3908 },
    { name: 'Fri', users: 189, interactions: 4800 },
    { name: 'Sat', users: 239, interactions: 3800 },
    { name: 'Sun', users: 349, interactions: 4300 },
  ];

  const featureUsage = [
    { name: 'Forum', value: 65 },
    { name: 'Videos', value: 85 },
    { name: 'Apartments', value: 45 },
    { name: 'Calculator', value: 30 },
  ];

  const {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
  } = charts || {};

  return (
    <>
      <Helmet>
        <title>Analytics Dashboard - Admin</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>

      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-indigo-600" />
            Analytics Overview
          </h1>

          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="bg-blue-100 p-3 rounded-lg text-blue-600">
                  <Users className="w-6 h-6" />
                </div>
                <span className="text-green-500 text-xs font-bold">+12%</span>
              </div>
              <h3 className="text-gray-500 text-sm font-medium">Daily Active Users</h3>
              <p className="text-2xl font-bold text-gray-900">{stats?.dailyActiveUsers || '...'}</p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="bg-purple-100 p-3 rounded-lg text-purple-600">
                  <MousePointer className="w-6 h-6" />
                </div>
                <span className="text-green-500 text-xs font-bold">+5%</span>
              </div>
              <h3 className="text-gray-500 text-sm font-medium">Total Interactions</h3>
              <p className="text-2xl font-bold text-gray-900">{stats?.totalInteractions || '...'}</p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="bg-teal-100 p-3 rounded-lg text-teal-600">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <span className="text-green-500 text-xs font-bold">+18%</span>
              </div>
              <h3 className="text-gray-500 text-sm font-medium">Forum Posts</h3>
              <p className="text-2xl font-bold text-gray-900">1,204</p>
            </motion.div>

             <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="bg-rose-100 p-3 rounded-lg text-rose-600">
                  <Video className="w-6 h-6" />
                </div>
                <span className="text-green-500 text-xs font-bold">+8%</span>
              </div>
              <h3 className="text-gray-500 text-sm font-medium">Video Views</h3>
              <p className="text-2xl font-bold text-gray-900">8,540</p>
            </motion.div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-6">User Growth & Activity</h3>
              <div className="h-80">
                {charts ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="users" stroke="#4f46e5" strokeWidth={2} />
                      <Line type="monotone" dataKey="interactions" stroke="#0d9488" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-gray-500">
                    Loading chart...
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Feature Popularity</h3>
              <div className="h-80">
                {charts ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={featureUsage} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={100} />
                      <Tooltip />
                      <Bar dataKey="value" fill="#0d9488" radius={[0, 4, 4, 0]} barSize={30} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-gray-500">
                    Loading chart...
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Recent Activity List */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">Top Content This Week</h3>
            </div>
            <div className="divide-y divide-gray-100">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-gray-400 font-bold w-6">#{i}</span>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Guide to German Health Insurance</p>
                      <p className="text-xs text-gray-500">Video Tutorial • 1.2k views</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-teal-600">Trending</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AnalyticsDashboardPage;
