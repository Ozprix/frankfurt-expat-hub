import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from '@/lib/motion';
import { User, Mail, Lock, AlertCircle, Check, Loader2 } from '@/lib/icons';
import { useAuth } from '@/context/AuthContext';
import { trackConversionEvent } from '@/utils/conversionTracking';
import { supabaseClient } from '@/config/supabaseClient';

const SignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const requestParams = new URLSearchParams(location.search);
  const nextPath = requestParams.get('next');
  const signupRequest = requestParams.get('request');
  const requestedChecklist = requestParams.get('checklist') || 'frankfurt-first-30-days';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsSubmitting(true);

    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      setIsSubmitting(false);
      return;
    }

    if (name.length < 2) {
      setError('Name must be at least 2 characters long');
      setIsSubmitting(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      setIsSubmitting(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      setIsSubmitting(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsSubmitting(false);
      return;
    }

    if (!agreeToTerms) {
      setError('Please accept the terms and conditions');
      setIsSubmitting(false);
      return;
    }

    const result = await signUp(email, password, name);
    
	    if (result.success && result.session) {
	      trackConversionEvent('signup_success', { flow: 'email_password', session_created: true }, { userId: result.user?.id });

	      if (signupRequest === 'checklist-email') {
	        const { error: checklistError } = await supabaseClient.functions.invoke('send-checklist', {
	          body: { checklist_slug: requestedChecklist },
	        });

	        if (checklistError) {
	          console.error('Checklist email request failed:', checklistError);
	          setSuccessMessage('Account created, but the checklist email could not be sent. You can request it again from the checklist page.');
	        } else {
	          trackConversionEvent('checklist_email_request', { checklist: requestedChecklist, source: 'signup' }, { userId: result.user?.id });
	          setSuccessMessage('Account created. Checklist sent to your inbox.');
	        }
	      } else {
	        setSuccessMessage('Account created. Taking you to onboarding...');
	      }

	      navigate(signupRequest === 'checklist-email' ? '/dashboard' : (nextPath || '/onboarding'), { replace: true });
	    } else if (result.success) {
	      trackConversionEvent('signup_success', { flow: 'email_password', session_created: false });
	      setSuccessMessage('Account created. Please check your inbox and spam folder for the confirmation email before logging in.');
    } else {
      if (result.error === 'over_email_send_rate_limit') {
        setError('Too many attempts. Please wait a few minutes before trying again.');
      } else {
        setError(result.error || 'Failed to create account.');
      }
    }
    
    setIsSubmitting(false);
  };

  return (
    <>
      <Helmet>
        <title>Sign Up | Frankfurt Expat Services</title>
        <meta name="robots" content="noindex,nofollow" />
        <meta name="description" content="Create your free Frankfurt Expat Services account." />
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
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
              <p className="text-gray-600">Start your Frankfurt journey today</p>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start"
              >
                <AlertCircle className="w-5 h-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-red-700">{error}</span>
              </motion.div>
            )}

            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-start"
              >
                <Check className="w-5 h-5 text-emerald-700 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-sm text-emerald-800">{successMessage}</span>
                  <Link to="/login" className="mt-2 block text-sm font-medium text-emerald-800 underline">
                    Go to login
                  </Link>
                </div>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent transition-colors text-gray-900"
                    placeholder="John Doe"
                  />
                </div>
              </div>

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
                <p className="mt-1 text-xs text-gray-500">At least 6 characters</p>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent transition-colors text-gray-900"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    type="checkbox"
                    checked={agreeToTerms}
                    onChange={(e) => setAgreeToTerms(e.target.checked)}
                    className="h-4 w-4 text-teal-600 focus:ring-teal-600 border-gray-300 rounded"
                  />
                </div>
                <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                  I agree to the{' '}
                  <Link to="/terms" className="text-teal-600 hover:text-teal-700">
                    Terms
                  </Link>
                  {' '}and{' '}
                  <Link to="/privacy-policy" className="text-teal-600 hover:text-teal-700">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5 mr-2" />
                    Create Account
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="font-medium text-teal-600 hover:text-teal-700 transition-colors">
                  Log in
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default SignupPage;
