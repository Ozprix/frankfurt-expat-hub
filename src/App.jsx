
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import Layout from '@/components/layout/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';
import ScrollToTop from '@/components/ScrollToTop';
import DatabaseErrorBoundary from '@/components/DatabaseErrorBoundary';

// Public Pages
const HomePage = lazy(() => import('@/pages/HomePage'));
const HowItWorksPage = lazy(() => import('@/pages/HowItWorksPage'));
const PricingPage = lazy(() => import('@/pages/PricingPage'));
const FAQPage = lazy(() => import('@/pages/FAQPage'));
const AboutPage = lazy(() => import('@/pages/AboutPage'));
const ContactPage = lazy(() => import('@/pages/ContactPage'));
const ToolsPage = lazy(() => import('@/pages/ToolsPage'));
const DirectoryPage = lazy(() => import('@/pages/DirectoryPage'));
const PartnersPage = lazy(() => import('@/pages/PartnersPage'));
const BlogPage = lazy(() => import('@/pages/BlogPage'));
const BlogPostPage = lazy(() => import('@/pages/BlogPostPage'));
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const SignupPage = lazy(() => import('@/pages/SignupPage'));
const ResetPasswordPage = lazy(() => import('@/pages/ResetPasswordPage'));
const ImprintPage = lazy(() => import('@/pages/ImprintPage'));
const PrivacyPolicyPage = lazy(() => import('@/pages/PrivacyPolicyPage'));
const TermsPage = lazy(() => import('@/pages/TermsPage'));
const DatabaseStatusPage = lazy(() => import('@/pages/DatabaseStatusPage'));
const First30DaysChecklistPage = lazy(() => import('@/pages/First30DaysChecklistPage'));

// Feature Pages
const ForumPage = lazy(() => import('@/pages/ForumPage'));
const ForumCategoryPage = lazy(() => import('@/pages/ForumCategoryPage'));
const ForumCreatePostPage = lazy(() => import('@/pages/ForumCreatePostPage'));
const ForumPostDetailPage = lazy(() => import('@/pages/ForumPostDetailPage'));
const DirectoryCategoryPage = lazy(() => import('@/pages/DirectoryCategoryPage'));
const ToolLandingPage = lazy(() => import('@/pages/ToolLandingPage'));
const VideoTutorialsPage = lazy(() => import('@/pages/VideoTutorialsPage'));
const CostCalculatorPage = lazy(() => import('@/pages/CostCalculatorPage'));
const ApartmentFinderPage = lazy(() => import('@/pages/ApartmentFinderPage'));
const FeaturesOverviewPage = lazy(() => import('@/pages/FeaturesOverviewPage'));

// Budget Pages
const BudgetEditorPage = lazy(() => import('@/pages/BudgetEditorPage'));
const BudgetTemplatesPage = lazy(() => import('@/pages/BudgetTemplatesPage'));

// Admin / Testing
const TestingDashboardPage = lazy(() => import('@/pages/TestingDashboardPage'));
const AnalyticsDashboardPage = lazy(() => import('@/pages/AnalyticsDashboardPage'));

// Protected Pages
const OnboardingFlow = lazy(() => import('@/pages/OnboardingFlow'));
const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
const PlanPage = lazy(() => import('@/pages/PlanPage'));
const TasksPage = lazy(() => import('@/pages/TasksPage'));
const DocumentsPage = lazy(() => import('@/pages/DocumentsPage'));
const AccountPage = lazy(() => import('@/pages/AccountPage'));
const UserProfilePage = lazy(() => import('@/pages/UserProfilePage'));
const TasksRegistryEditor = lazy(() => import('@/components/TasksRegistryEditor'));
const NotificationPreferencesPage = lazy(() => import('@/pages/NotificationPreferencesPage'));
const TemplatesPage = lazy(() => import('@/pages/TemplatesPage'));
const ProgressDashboardPage = lazy(() => import('@/pages/ProgressDashboardPage'));

// Calendar
const CalendarIntegrationPage = lazy(() => import('@/pages/CalendarIntegrationPage'));
const CalendarOAuthCallback = lazy(() => import('@/pages/CalendarOAuthCallback'));

const PageFallback = () => (
  <div className="flex min-h-[50vh] items-center justify-center bg-[#f3f4ef]">
    <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#dbe1d8] border-t-[#0f766e]" />
  </div>
);

const RedirectIfAuthenticated = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
};

function App() {
  return (
    <DatabaseErrorBoundary>
      <AuthProvider>
        <Router>
          <ScrollToTop />
          <Layout>
            <Suspense fallback={<PageFallback />}>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/how-it-works" element={<HowItWorksPage />} />
                <Route path="/pricing" element={<PricingPage />} />
                <Route path="/faq" element={<FAQPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/tools" element={<ToolsPage />} />
                <Route path="/directory" element={<DirectoryPage />} />
                <Route path="/partners" element={<PartnersPage />} />
                <Route path="/blog" element={<BlogPage />} />
                <Route path="/blog/:slug" element={<BlogPostPage />} />
                <Route path="/imprint" element={<ImprintPage />} />
                <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                <Route path="/terms" element={<TermsPage />} />
                <Route path="/database-status" element={<DatabaseStatusPage />} />
                <Route path="/frankfurt-first-30-days-checklist" element={<First30DaysChecklistPage />} />
                
                {/* Feature Routes (Public/Hybrid) */}
                <Route path="/features" element={<FeaturesOverviewPage />} />
                <Route path="/forum" element={<ForumPage />} />
                {/* More-specific forum routes MUST come before /forum/:categorySlug */}
                <Route path="/forum/post/:id" element={<ForumPostDetailPage />} />
                <Route path="/forum/create" element={<ProtectedRoute><ForumCreatePostPage /></ProtectedRoute>} />
                <Route path="/forum/:categorySlug" element={<ForumCategoryPage />} />
                <Route path="/tutorials" element={<VideoTutorialsPage />} />
                <Route path="/apartments" element={<ApartmentFinderPage />} />

                {/* Directory category landing pages (SEO) */}
                <Route path="/directory/:categorySlug" element={<DirectoryCategoryPage />} />

                {/* Tool landing pages (SEO — public content + CTA to /tools) */}
                <Route path="/tools/:toolSlug" element={<ToolLandingPage />} />
                
                {/* Budget / Cost Calculator Routes */}
                <Route path="/cost-calculator" element={<ProtectedRoute><CostCalculatorPage /></ProtectedRoute>} />
                <Route path="/budget-templates" element={<ProtectedRoute><BudgetTemplatesPage /></ProtectedRoute>} />
                <Route path="/budget/create" element={<ProtectedRoute><BudgetEditorPage /></ProtectedRoute>} />
                <Route path="/budget/:id/edit" element={<ProtectedRoute><BudgetEditorPage /></ProtectedRoute>} />

                {/* Feature Detail Routes */}
                <Route path="/tutorials/:id" element={<VideoTutorialsPage />} />
                <Route path="/apartments/:id" element={<ApartmentFinderPage />} />

                {/* Calendar OAuth Callbacks (Public) */}
                <Route path="/calendar/google/callback" element={<CalendarOAuthCallback />} />
                <Route path="/calendar/outlook/callback" element={<CalendarOAuthCallback />} />
                
                {/* Checkout is intentionally paused during beta growth. */}
                <Route path="/checkout-success" element={<Navigate to="/pricing" replace />} />
                <Route path="/checkout-cancel" element={<Navigate to="/pricing" replace />} />
                
                {/* Auth */}
                <Route path="/login" element={<RedirectIfAuthenticated><LoginPage /></RedirectIfAuthenticated>} />
                <Route path="/signup" element={<RedirectIfAuthenticated><SignupPage /></RedirectIfAuthenticated>} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />

                {/* Protected */}
                <Route path="/onboarding" element={<ProtectedRoute><OnboardingFlow /></ProtectedRoute>} />
                <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
                <Route path="/plan" element={<ProtectedRoute><PlanPage /></ProtectedRoute>} />
                <Route path="/tasks" element={<ProtectedRoute><TasksPage /></ProtectedRoute>} />
                <Route path="/documents" element={<ProtectedRoute><DocumentsPage /></ProtectedRoute>} />
                <Route path="/account" element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />
                
                {/* Profile Routes */}
                <Route path="/profile" element={<ProtectedRoute><UserProfilePage /></ProtectedRoute>} />
                <Route path="/profile/edit" element={<ProtectedRoute><UserProfilePage /></ProtectedRoute>} />
                <Route path="/profile/password" element={<ProtectedRoute><UserProfilePage /></ProtectedRoute>} />
                <Route path="/profile/subscription" element={<ProtectedRoute><UserProfilePage /></ProtectedRoute>} />

                <Route path="/notification-preferences" element={<ProtectedRoute><NotificationPreferencesPage /></ProtectedRoute>} />
                <Route path="/templates" element={<ProtectedRoute><TemplatesPage /></ProtectedRoute>} />
                <Route path="/progress" element={<ProtectedRoute><ProgressDashboardPage /></ProtectedRoute>} />
                
                <Route path="/calendar/settings" element={<ProtectedRoute><CalendarIntegrationPage /></ProtectedRoute>} />
                
                {/* Admin Routes */}
                <Route path="/admin/tasks-registry" element={<ProtectedRoute><TasksRegistryEditor /></ProtectedRoute>} />
                <Route path="/admin/testing" element={<ProtectedRoute><TestingDashboardPage /></ProtectedRoute>} />
                <Route path="/admin/analytics" element={<ProtectedRoute><AnalyticsDashboardPage /></ProtectedRoute>} />

                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </Layout>
          <Toaster />
        </Router>
      </AuthProvider>
    </DatabaseErrorBoundary>
  );
}

export default App;
