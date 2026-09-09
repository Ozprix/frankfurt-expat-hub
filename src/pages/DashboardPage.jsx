
import React, { useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from '@/lib/motion';
import { 
  CheckCircle, 
  FileText, 
  FileCheck,
  Bell,
  Crown,
  MessageSquare,
  Video,
  Calculator,
  Home,
  Activity,
  Calendar,
  Layers,
  RefreshCcw,
  User,
  ArrowRight,
  BookOpen,
  ShieldCheck
} from '@/lib/icons';
import { useAuth } from '@/context/AuthContext';
import { useDashboard } from '@/hooks/useDashboard';
import { useActivityLogger } from '@/hooks/useActivityLogger';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  checklistProgressLabel,
  dashboardStarterTasks,
  first30DaysChecklist,
} from '@/data/first30DaysChecklist';
import { useRetentionState } from '@/hooks/useRetentionState';

const DashboardPage = () => {
  const { user } = useAuth();
  const {
    completedTaskIds: completedStarterTasks,
    firstMonthReminders: reminderOptIn,
    loading: retentionLoading,
    setReminderOptIn,
    syncError,
    toggleTask,
  } = useRetentionState();
  const { 
    dashboardData, 
    subscription, 
    monthlyUsage, 
    userStats, 
    loading, 
    error,
    refreshDashboard 
  } = useDashboard(user?.id);
  const { logActivity } = useActivityLogger();

  useEffect(() => {
    if (user?.id) {
      logActivity(user.id, 'dashboard', 'view');
    }
  }, [user, logActivity]);

  const starterTotal = dashboardStarterTasks.length;
  const starterCompleted = completedStarterTasks.length;
  const starterProgress = Math.round((starterCompleted / starterTotal) * 100);
  const nextStarterTask = dashboardStarterTasks.find((task) => !completedStarterTasks.includes(task.id));
  const isFirstLoginExperience = starterCompleted === 0 && monthlyUsage.length === 0;
  const suggestedGuide = useMemo(() => {
    const task = nextStarterTask || first30DaysChecklist[0];
    if (task.id === 'anmeldung') {
      return {
        title: 'Anmeldung in Frankfurt: the practical checklist',
        description: 'Prepare the landlord confirmation, registration form, and address details before your appointment.',
        to: '/blog/anmeldung-frankfurt-checklist',
      };
    }
    if (task.id === 'health-insurance') {
      return {
        title: 'Find the right insurance support',
        description: 'Compare English-speaking insurance brokers for health, liability, and household cover.',
        to: '/directory/insurance-brokers-frankfurt',
      };
    }
    return {
      title: 'Frankfurt First 30 Days Checklist',
      description: 'Use the First 30 Days checklist as your first-month setup map.',
      to: '/frankfurt-first-30-days-checklist',
    };
  }, [nextStarterTask]);

  const toggleReminders = () => {
    setReminderOptIn(!reminderOptIn);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Something went wrong</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button onClick={refreshDashboard} className="bg-teal-600">
          <RefreshCcw className="w-4 h-4 mr-2" /> Retry
        </Button>
      </div>
    );
  }

  const isPro = subscription?.tier === 'pro';
  const renewalDate = subscription?.current_period_end 
    ? new Date(subscription.current_period_end).toLocaleDateString() 
    : null;

  return (
    <>
      <Helmet>
        <title>Dashboard - Frankfurt Expat Services</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4"
          >
            <div>
               <h1 className="text-4xl font-bold text-gray-900 mb-2">
                 Welcome, {user?.user_metadata?.full_name || user?.email?.split('@')[0]}! 👋
               </h1>
               <div className="flex gap-4 text-sm text-gray-600">
                  <span className={`flex items-center gap-1 px-3 py-1 rounded-full border font-medium ${isPro ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-teal-50 text-teal-800 border-teal-100'}`}>
                    <Crown className="w-3 h-3" /> {isPro ? 'Pro Plan' : 'Free Plan'}
                  </span>
                  {renewalDate && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> Renews: {renewalDate}
                    </span>
                  )}
               </div>
            </div>
            
            {!isPro && (
              <Link 
                to="/directory"
                className="bg-teal-700 text-white px-6 py-3 rounded-lg font-bold shadow-md hover:bg-teal-800 hover:shadow-lg transition-all flex items-center"
              >
                <Crown className="w-5 h-5 mr-2" />
                Explore Vetted Services
              </Link>
            )}
          </motion.div>

          {isFirstLoginExperience && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.03 }}
              className="mb-8 rounded-lg border border-teal-100 bg-white p-6 shadow-sm"
            >
              <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-teal-700">First Login</p>
                  <h2 className="mt-2 text-2xl font-black text-gray-900">Set up your Frankfurt plan in five minutes</h2>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-600">
                    Start with the checklist, choose reminders if you want email nudges, then jump to the most relevant guide or directory category.
                  </p>
                </div>
                <div className="grid gap-2 sm:grid-cols-3">
                  <Link to="/frankfurt-first-30-days-checklist" className="rounded-lg bg-teal-700 px-4 py-3 text-center text-sm font-bold text-white transition hover:bg-teal-800">
                    Open checklist
                  </Link>
                  <Link to="/directory" className="rounded-lg border border-gray-200 px-4 py-3 text-center text-sm font-bold text-gray-800 transition hover:bg-gray-50">
                    Browse directory
                  </Link>
                  <Link to="/forum/create" className="rounded-lg border border-gray-200 px-4 py-3 text-center text-sm font-bold text-gray-800 transition hover:bg-gray-50">
                    Ask the forum
                  </Link>
                </div>
              </div>
            </motion.section>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="mb-8 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]"
          >
            <section className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-teal-700">Your Account</p>
                  <h2 className="mt-2 text-2xl font-black text-gray-900">Start with the essentials</h2>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-600">
                    Use this dashboard to keep your relocation plan, tools, forum activity, and profile in one place.
                  </p>
                </div>
                <Link
                  to="/profile"
                  className="inline-flex items-center justify-center rounded-lg border border-teal-200 px-4 py-2 text-sm font-bold text-teal-700 transition hover:bg-teal-50"
                >
                  <User className="mr-2 h-4 w-4" />
                  View Profile
                </Link>
              </div>
            </section>

            <section className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
              <p className="text-sm font-bold text-gray-900">Signed in as</p>
              <p className="mt-1 break-words text-sm text-gray-600">{user?.email}</p>
              {nextStarterTask && (
                <p className="mt-3 text-xs leading-relaxed text-gray-500">
                  Next best action: <span className="font-bold text-gray-800">{nextStarterTask.title}</span>
                </p>
              )}
              <div className="mt-4 flex flex-wrap gap-2">
                <Link to="/profile/edit" className="rounded-lg bg-gray-900 px-3 py-2 text-xs font-bold text-white transition hover:bg-gray-800">
                  Edit profile
                </Link>
                <Link to="/notification-preferences" className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-bold text-gray-700 transition hover:bg-gray-50">
                  Notifications
                </Link>
              </div>
            </section>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Budgets Created</CardTitle>
                <Calculator className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{userStats?.total_budgets || 0}</div>
                <p className="text-xs text-muted-foreground">Financial scenarios</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Forum Activity</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{userStats?.total_forum_posts || 0}</div>
                <p className="text-xs text-muted-foreground">Posts created</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Saved Homes</CardTitle>
                <Home className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{userStats?.total_apartments_saved || 0}</div>
                <p className="text-xs text-muted-foreground">Watchlisted items</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Learning</CardTitle>
                <Video className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{userStats?.total_videos_watched || 0}</div>
                <p className="text-xs text-muted-foreground">Tutorials completed</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mb-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]"
          >
            <section className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-teal-700">First 30 Days</p>
                  <h2 className="mt-2 text-2xl font-black text-gray-900">Complete your Frankfurt setup</h2>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">
                    {checklistProgressLabel(starterCompleted, starterTotal)}
                  </p>
                  {syncError && (
                    <p className="mt-2 text-xs font-semibold text-amber-700">
                      Cross-device sync is temporarily unavailable. Changes are kept locally and will retry later.
                    </p>
                  )}
                </div>
                <div className="min-w-[130px] text-left sm:text-right">
                  <p className="text-3xl font-black text-teal-700">{starterProgress}%</p>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    {starterCompleted}/{starterTotal} done
                  </p>
                </div>
              </div>

              <div className="mt-5 h-3 overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-teal-600 transition-all"
                  style={{ width: `${starterProgress}%` }}
                />
              </div>

              <div className="mt-6 space-y-3">
                {dashboardStarterTasks.map((task) => {
                  const done = completedStarterTasks.includes(task.id);
                  return (
                    <button
                      key={task.id}
                      type="button"
                      onClick={() => toggleTask(task.id)}
                      disabled={retentionLoading}
                      className="flex w-full items-start gap-3 rounded-lg border border-gray-100 bg-gray-50 p-3 text-left transition hover:border-teal-200 hover:bg-teal-50"
                    >
                      <span className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border ${done ? 'border-teal-600 bg-teal-600 text-white' : 'border-gray-300 bg-white text-transparent'}`}>
                        <CheckCircle className="h-3.5 w-3.5" />
                      </span>
                      <span>
                        <span className={`block text-sm font-bold ${done ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                          {task.title}
                        </span>
                        <span className="mt-0.5 block text-xs text-gray-500">{task.dayRange} · {task.category}</span>
                      </span>
                    </button>
                  );
                })}
              </div>

              <Link
                to="/frankfurt-first-30-days-checklist"
                className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-teal-700 transition hover:text-teal-900"
              >
                Open full checklist
                <ArrowRight className="h-4 w-4" />
              </Link>
            </section>

            <aside className="space-y-4">
              <section className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                <BookOpen className="h-5 w-5 text-teal-700" />
                <h3 className="mt-3 text-lg font-black text-gray-900">Suggested next guide</h3>
                <p className="mt-2 text-sm font-bold text-gray-900">{suggestedGuide.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-gray-600">{suggestedGuide.description}</p>
                <Link
                  to={suggestedGuide.to}
                  className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-teal-700 transition hover:text-teal-900"
                >
                  Read next
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </section>

              <section className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                <ShieldCheck className="h-5 w-5 text-teal-700" />
                <h3 className="mt-3 text-lg font-black text-gray-900">Suggested directory category</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  Insurance is one of the first decisions most newcomers need to settle before payroll and healthcare access.
                </p>
                <Link
                  to="/directory/insurance-brokers-frankfurt"
                  className="mt-4 inline-flex items-center gap-2 rounded-lg bg-teal-700 px-4 py-2 text-sm font-bold text-white transition hover:bg-teal-800"
                >
                  View insurance brokers
                </Link>
              </section>

              <section className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <Bell className="h-5 w-5 text-teal-700" />
                    <h3 className="mt-3 text-lg font-black text-gray-900">First-month reminders</h3>
                    <p className="mt-2 text-sm leading-relaxed text-gray-600">
                      Save this preference across devices so first-month reminder emails can use it when scheduling is enabled.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={toggleReminders}
                    className={`mt-1 rounded-full px-3 py-1 text-xs font-bold transition ${reminderOptIn ? 'bg-teal-700 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  >
                    {reminderOptIn ? 'On' : 'Off'}
                  </button>
                </div>
                <Link
                  to="/notification-preferences"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-teal-700 transition hover:text-teal-900"
                >
                  Notification settings
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </section>
            </aside>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Activity & Tools */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Monthly Usage */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-teal-600" /> 
                  Monthly Activity (Last 30 Days)
                </h2>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  {monthlyUsage.length > 0 ? (
                    <div className="space-y-4">
                      {monthlyUsage.map((usage, idx) => (
                        <div key={idx} className="flex items-center justify-between border-b border-gray-50 last:border-0 pb-3 last:pb-0">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center text-teal-600">
                              <Layers className="w-4 h-4" />
                            </div>
                            <span className="font-medium text-gray-700 capitalize">{usage.feature_name.replace('_', ' ')}</span>
                          </div>
                          <div className="text-right">
                            <span className="block font-bold text-gray-900">{usage.usage_count} actions</span>
                            <span className="text-xs text-gray-400">Last: {new Date(usage.last_used).toLocaleDateString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">No activity recorded in the last 30 days.</p>
                  )}
                </div>
              </motion.div>

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                 <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Shortcuts</h2>
                 <div className="grid grid-cols-2 gap-4">
                    <Link to="/cost-calculator" className="p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:border-teal-200 hover:shadow-md transition-all group">
                      <Calculator className="w-6 h-6 text-teal-600 mb-2 group-hover:scale-110 transition-transform" />
                      <h3 className="font-semibold text-gray-900">Budget Planner</h3>
                      <p className="text-xs text-gray-500">Manage finances</p>
                    </Link>
                    <Link to="/tax-prep" className="p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:border-emerald-200 hover:shadow-md transition-all group">
                      <FileCheck className="w-6 h-6 text-emerald-600 mb-2 group-hover:scale-110 transition-transform" />
                      <h3 className="font-semibold text-gray-900">Tax Prep</h3>
                      <p className="text-xs text-gray-500">Organize records</p>
                    </Link>
                    <Link to="/forum" className="p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all group">
                      <MessageSquare className="w-6 h-6 text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
                      <h3 className="font-semibold text-gray-900">Community</h3>
                      <p className="text-xs text-gray-500">Ask questions</p>
                    </Link>
                    <Link to="/apartments" className="p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:border-green-200 hover:shadow-md transition-all group">
                      <Home className="w-6 h-6 text-green-600 mb-2 group-hover:scale-110 transition-transform" />
                      <h3 className="font-semibold text-gray-900">Housing</h3>
                      <p className="text-xs text-gray-500">Find apartments</p>
                    </Link>
                    <Link to="/tutorials" className="p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:border-red-200 hover:shadow-md transition-all group">
                      <Video className="w-6 h-6 text-red-600 mb-2 group-hover:scale-110 transition-transform" />
                      <h3 className="font-semibold text-gray-900">Tutorials</h3>
                      <p className="text-xs text-gray-500">Watch guides</p>
                    </Link>
                 </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="rounded-xl border border-teal-100 bg-teal-50 p-6"
              >
                <MessageSquare className="h-6 w-6 text-teal-700" />
                <h2 className="mt-3 text-xl font-black text-gray-900">Need a Frankfurt-specific answer?</h2>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  Ask the forum when details depend on timing, district, landlord expectations, or appointment availability.
                </p>
                <Link
                  to="/forum/create"
                  className="mt-4 inline-flex items-center gap-2 rounded-lg bg-teal-700 px-4 py-2 text-sm font-bold text-white transition hover:bg-teal-800"
                >
                  Ask the forum
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>

            </div>

            {/* Right Column - Status */}
            <div className="space-y-6">
              {/* Account Status */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
              >
                <h3 className="font-bold text-gray-900 mb-4">Account Status</h3>
                <div className="space-y-4">
                   <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Plan Tier</span>
                      <Badge variant={isPro ? "default" : "secondary"}>{subscription?.tier || 'Free'}</Badge>
                   </div>
                   <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Status</span>
                      <span className="text-sm font-medium capitalize text-gray-900">{subscription?.status || 'Active'}</span>
                   </div>
                   {subscription?.current_period_end && (
                     <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Renews</span>
                        <span className="text-sm font-medium text-gray-900">{new Date(subscription.current_period_end).toLocaleDateString()}</span>
                     </div>
                   )}
                </div>
              </motion.div>

              {/* Progress Summary */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-teal-600 rounded-xl shadow-lg p-6 text-white relative overflow-hidden"
              >
                 <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
                 <h3 className="font-bold text-lg mb-2 relative z-10">Relocation Plan</h3>
                 <div className="mb-4 relative z-10">
                    <span className="text-3xl font-black">{userStats?.completed_tasks || 0}</span>
                    <span className="text-teal-200 text-sm ml-2">tasks completed</span>
                 </div>
                 <Link to="/plan">
                   <Button variant="secondary" className="w-full relative z-10 font-bold text-teal-900">
                     Continue Plan
                   </Button>
                 </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
