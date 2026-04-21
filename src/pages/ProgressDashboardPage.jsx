import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from '@/lib/motion';
import { Loader2, TrendingUp, CheckSquare, Calendar, Award } from '@/lib/icons';
import { useProgress } from '@/hooks/useProgress';
import ProgressCard from '@/components/ProgressCard';
import StreakCounter from '@/components/StreakCounter';
import AchievementBadges from '@/components/AchievementBadges';
import { useAuth } from '@/context/AuthContext';

const StatCard = ({ icon: Icon, label, value, colorClass }) => (
  <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
    <div className={`p-3 rounded-lg ${colorClass}`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
    <div>
      <p className="text-sm text-gray-500 font-medium">{label}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  </div>
);

const ProgressDashboardPage = () => {
  const { user } = useAuth();
  const { stats, planProgress, streak, achievements, loading } = useProgress();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-10 h-10 animate-spin text-teal-600" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Progress Dashboard - Frankfurt Expat Services</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>

      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-4"
          >
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900">Your Progress</h1>
              <p className="text-lg text-gray-600 mt-1">
                Every step brings you closer to your new life in Frankfurt! 🏙️
              </p>
            </div>
            <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200 text-sm font-medium text-gray-600">
               Total Completion: <span className="text-teal-600 font-bold ml-1">{stats?.overall_completion_percentage || 0}%</span>
            </div>
          </motion.div>

          {/* Top Section: Streak & Overall Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Streak Card - Takes 1 column */}
            <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ delay: 0.1 }}
               className="lg:col-span-1"
            >
               <StreakCounter streak={streak} />
            </motion.div>

            {/* Stats Grid - Takes 2 columns */}
            <motion.div 
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: 0.2 }}
               className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
               <StatCard 
                 icon={CheckSquare} 
                 label="Tasks Completed" 
                 value={stats?.total_tasks_completed_this_month || 0}
                 colorClass="bg-blue-500" 
               />
               <StatCard 
                 icon={TrendingUp} 
                 label="Plans Active" 
                 value={stats?.total_plans || 0}
                 colorClass="bg-green-500" 
               />
               <StatCard 
                 icon={Award} 
                 label="Badges Earned" 
                 value={`${stats?.unlocked_achievements_count || 0}/${achievements.length}`}
                 colorClass="bg-yellow-500" 
               />
               <StatCard 
                 icon={Calendar} 
                 label="Best Streak" 
                 value={`${streak?.longest_streak || 0} Days`}
                 colorClass="bg-purple-500" 
               />
            </motion.div>
          </div>

          {/* Plans Section */}
          <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.3 }}
          >
             <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
               <TrendingUp className="w-5 h-5 mr-2 text-teal-600" />
               Active Plans
             </h2>
             {planProgress.length > 0 ? (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                 {planProgress.map((plan) => (
                   <div key={plan.id} className="h-full">
                     <ProgressCard plan={plan} />
                   </div>
                 ))}
               </div>
             ) : (
               <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
                  <p className="text-gray-500">No active plans yet. Start by creating a plan!</p>
               </div>
             )}
          </motion.div>

          {/* Achievements Section */}
          <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.4 }}
             className="bg-white rounded-xl shadow-lg p-6"
          >
             <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                  <Award className="w-5 h-5 mr-2 text-yellow-500" />
                  Achievements
                </h2>
                <span className="text-sm font-medium text-gray-500">
                  {stats?.unlocked_achievements_count || 0} of {achievements.length} Unlocked
                </span>
             </div>
             <AchievementBadges achievements={achievements} />
          </motion.div>

        </div>
      </div>
    </>
  );
};

export default ProgressDashboardPage;