import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from '@/lib/motion';
import { Mail, Lock, AlertCircle, Loader2, CheckCircle } from '@/lib/icons';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);
  const { signIn, resendVerificationEmail } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setNeedsVerification(false);
    setIsSubmitting(true);

    if (!email || !password) {
      setError('Please fill in all fields');
      setIsSubmitting(false);
      return;
    }

    const result = await signIn(email, password);
    
    if (result.success) {
      navigate(from, { replace: true });
    } else {
      if (result.error === 'email_not_confirmed') {
        setNeedsVerification(true);
        setError('Your email address has not been verified yet.');
      } else {
        setError(result.error || 'Failed to sign in. Please check your credentials.');
      }
    }
    
    setIsSubmitting(false);
  };

  const handleResendVerification = async () => {
    if (!email) return;
    setIsSubmitting(true);
    const result = await resendVerificationEmail(email);
    setIsSubmitting(false);

    if (result.success) {
      toast({
        title: "Email Sent",
        description: "Please check your inbox for the verification link.",
      });
    } else {
      let errorMsg = result.error;
      if (result.error === 'over_email_send_rate_limit') {
        errorMsg = "Too many attempts. Please wait a few minutes before trying again.";
      }
      
      toast({
        title: "Error",
        description: errorMsg || "Failed to send verification email.",
        variant: "destructive"
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>Login - Frankfurt Expat Services</title>
        <meta name="robots" content="noindex,nofollow" />
        <meta name="description" content="Log in to your Frankfurt Expat Services account." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-md w-full"
        >
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-teal-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-2xl">F</span>
                </div>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
              <p className="text-gray-600">Log in to continue your relocation journey</p>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
              >
                <div className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <span className="text-sm text-red-700 block">{error}</span>
                    {needsVerification && (
                      <div className="mt-2">
                        <p className="text-xs text-red-600 mb-2">
                          Please check your inbox (and spam folder) for the confirmation link.
                        </p>
                        <button
                          type="button"
                          onClick={handleResendVerification}
                          className="text-sm font-medium text-red-700 hover:text-red-800 underline flex items-center"
                        >
                          Resend verification email
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent transition-colors text-gray-900"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent transition-colors text-gray-900"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember"
                    type="checkbox"
                    className="h-4 w-4 text-teal-600 focus:ring-teal-600 border-gray-300 rounded"
                  />
                  <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>

                <Link
                  to="/reset-password"
                  className="text-sm font-medium text-teal-600 hover:text-teal-700 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Processing...
                  </>
                ) : (
                  'Log In'
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <Link to="/signup" className="font-medium text-teal-600 hover:text-teal-700 transition-colors">
                  Sign up for free
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default LoginPage;