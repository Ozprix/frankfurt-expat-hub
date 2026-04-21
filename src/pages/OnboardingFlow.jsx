import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { motion } from '@/lib/motion';
import { Calendar, Users, FileText, CheckCircle, ArrowRight, ArrowLeft } from '@/lib/icons';
import { useAuth } from '@/context/AuthContext';
import { usePlan } from '@/hooks/usePlan';
import { supabaseClient } from '@/config/supabaseClient';

const OnboardingFlow = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    arrivalDate: '',
    householdType: '',
    visaType: '',
    hasAnmeldung: null,
    hasInsurance: null
  });
  const { user, updateUser } = useAuth();
  const { regeneratePlan } = usePlan();
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const steps = [
    {
      id: 'arrivalDate',
      title: 'When are you arriving in Frankfurt?',
      icon: Calendar,
      component: (
        <div className="space-y-4">
          <label htmlFor="arrivalDate" className="block text-sm font-medium text-gray-700">
            Select your arrival date
          </label>
          <input
            id="arrivalDate"
            type="date"
            value={formData.arrivalDate}
            onChange={(e) => setFormData({ ...formData, arrivalDate: e.target.value })}
            min={new Date().toISOString().split('T')[0]}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent text-gray-900"
          />
        </div>
      )
    },
    {
      id: 'householdType',
      title: 'What is your household type?',
      icon: Users,
      component: (
        <div className="space-y-3">
          {['Solo', 'Couple', 'Family'].map((type) => (
            <button
              key={type}
              onClick={() => setFormData({ ...formData, householdType: type })}
              className={`w-full px-6 py-4 rounded-lg border-2 transition-all text-left ${
                formData.householdType === type
                  ? 'border-teal-600 bg-teal-50 text-teal-900'
                  : 'border-gray-200 hover:border-teal-300 text-gray-900'
              }`}
            >
              <span className="font-medium">{type}</span>
            </button>
          ))}
        </div>
      )
    },
    {
      id: 'visaType',
      title: 'What is your visa/residence status?',
      icon: FileText,
      component: (
        <div className="space-y-4">
          <label htmlFor="visaType" className="block text-sm font-medium text-gray-700">
            Select your visa type
          </label>
          <select
            id="visaType"
            value={formData.visaType}
            onChange={(e) => setFormData({ ...formData, visaType: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent text-gray-900"
          >
            <option value="">Choose an option</option>
            <option value="EU">EU Citizen</option>
            <option value="Work Visa">Work Visa / Blue Card</option>
            <option value="Student">Student Visa</option>
            <option value="Other">Other</option>
          </select>
        </div>
      )
    },
    {
      id: 'hasAnmeldung',
      title: 'Have you completed your Anmeldung?',
      icon: CheckCircle,
      component: (
        <div className="space-y-3">
          {[
            { value: true, label: 'Yes, I have completed Anmeldung' },
            { value: false, label: 'No, not yet' }
          ].map((option) => (
            <button
              key={option.value.toString()}
              onClick={() => setFormData({ ...formData, hasAnmeldung: option.value })}
              className={`w-full px-6 py-4 rounded-lg border-2 transition-all text-left ${
                formData.hasAnmeldung === option.value
                  ? 'border-teal-600 bg-teal-50 text-teal-900'
                  : 'border-gray-200 hover:border-teal-300 text-gray-900'
              }`}
            >
              <span className="font-medium">{option.label}</span>
            </button>
          ))}
        </div>
      )
    },
    {
      id: 'hasInsurance',
      title: 'Do you have German health insurance?',
      icon: CheckCircle,
      component: (
        <div className="space-y-3">
          {[
            { value: true, label: 'Yes, I have health insurance' },
            { value: false, label: 'No, not yet' }
          ].map((option) => (
            <button
              key={option.value.toString()}
              onClick={() => setFormData({ ...formData, hasInsurance: option.value })}
              className={`w-full px-6 py-4 rounded-lg border-2 transition-all text-left ${
                formData.hasInsurance === option.value
                  ? 'border-teal-600 bg-teal-50 text-teal-900'
                  : 'border-gray-200 hover:border-teal-300 text-gray-900'
              }`}
            >
              <span className="font-medium">{option.label}</span>
            </button>
          ))}
        </div>
      )
    }
  ];

  const currentStepData = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  const canProceed = formData[currentStepData.id] !== '' && formData[currentStepData.id] !== null;

  const handleNext = () => {
    if (canProceed && !isLastStep) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    if (!canProceed || submitting) return;
    setSubmitting(true);

    localStorage.setItem(`onboarding_${user.id}`, JSON.stringify(formData));

    try {
      await supabaseClient
        .from('user_profiles')
        .upsert({
          user_id: user.id,
          onboarding_completed: true,
          profile_data: formData,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id' });
    } catch (error) {
      console.warn('Could not sync onboarding profile; local fallback is saved.', error);
    }

    if (updateUser) {
      await updateUser({ onboardingCompleted: true });
    }

    await regeneratePlan(formData);
    setSubmitting(false);
    navigate('/dashboard');
  };

  return (
    <>
      <Helmet>
        <title>Onboarding | Frankfurt Expat Services</title>
        <meta name="robots" content="noindex,nofollow" />
        <meta name="description" content="Complete your onboarding to get your personalized Frankfurt relocation plan." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl w-full">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-600">
                Step {currentStep + 1} of {steps.length}
              </span>
              <span className="text-sm font-medium text-teal-600">
                {Math.round(((currentStep + 1) / steps.length) * 100)}% Complete
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className="bg-teal-600 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Question Card */}
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-teal-600 rounded-lg flex items-center justify-center mr-4">
                <currentStepData.icon className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">{currentStepData.title}</h2>
            </div>

            <div className="mb-8">
              {currentStepData.component}
            </div>

            <div className="flex justify-between items-center">
              <button
                onClick={handleBack}
                disabled={currentStep === 0}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </button>

              {isLastStep ? (
	                <button
	                  onClick={handleComplete}
	                  disabled={!canProceed || submitting}
	                  className="px-8 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center font-semibold"
	                >
	                  <CheckCircle className="w-5 h-5 mr-2" />
	                  {submitting ? 'Saving...' : 'Complete & Generate Plan'}
	                </button>
              ) : (
                <button
                  onClick={handleNext}
                  disabled={!canProceed}
                  className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default OnboardingFlow;
