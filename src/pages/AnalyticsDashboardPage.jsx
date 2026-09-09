
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useAnalytics } from '@/hooks/useAnalytics';
import { Users, MousePointer, Video, MessageSquare, TrendingUp } from '@/lib/icons';
import { motion } from '@/lib/motion';

const AnalyticsDashboardPage = () => {
  const { getFeatureStats } = useAnalytics();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    getFeatureStats().then(setStats);
  }, [getFeatureStats]);

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

  const maxInteractions = Math.max(...data.map((item) => item.interactions));
  const maxFeatureUsage = Math.max(...featureUsage.map((item) => item.value));

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
              <div className="flex h-80 items-end gap-3 rounded-lg border border-gray-100 bg-gray-50 p-4">
                {data.map((item) => (
                  <div key={item.name} className="flex flex-1 flex-col items-center gap-2">
                    <div className="flex h-56 w-full items-end justify-center gap-1">
                      <div
                        className="w-3 rounded-t bg-indigo-500"
                        style={{ height: `${Math.max(8, (item.users / 450) * 100)}%` }}
                        title={`${item.name}: ${item.users} users`}
                      />
                      <div
                        className="w-3 rounded-t bg-teal-600"
                        style={{ height: `${Math.max(8, (item.interactions / maxInteractions) * 100)}%` }}
                        title={`${item.name}: ${item.interactions} interactions`}
                      />
                    </div>
                    <span className="text-xs font-medium text-gray-500">{item.name}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center gap-4 text-xs font-medium text-gray-500">
                <span className="inline-flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-sm bg-indigo-500" /> Users</span>
                <span className="inline-flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-sm bg-teal-600" /> Interactions</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Feature Popularity</h3>
              <div className="space-y-5 rounded-lg border border-gray-100 bg-gray-50 p-4">
                {featureUsage.map((item) => (
                  <div key={item.name}>
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="font-medium text-gray-700">{item.name}</span>
                      <span className="font-bold text-teal-700">{item.value}%</span>
                    </div>
                    <div className="h-3 overflow-hidden rounded-full bg-white">
                      <div
                        className="h-full rounded-full bg-teal-600"
                        style={{ width: `${(item.value / maxFeatureUsage) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
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
