
import React from 'react';
import SEOHead from '@/components/SEOHead';
import { Link } from 'react-router-dom';
import { MessageSquare, Video, Calculator, Home, ArrowRight, CheckCircle2 } from '@/lib/icons';
import { motion } from '@/lib/motion';

const FeaturesOverviewPage = () => {
  const features = [
    {
      id: 'forum',
      title: 'Community Forum',
      description: 'Connect with fellow expats, ask questions, and share your experiences about living in Frankfurt.',
      icon: MessageSquare,
      path: '/forum',
      color: 'bg-blue-50 text-blue-600',
      benefits: ['Ask questions to local experts', 'Find housing & job leads', 'Connect with others'],
      stats: '1,200+ Posts'
    },
    {
      id: 'videos',
      title: 'Video Tutorials',
      description: 'Watch step-by-step guides on navigating German bureaucracy, from Anmeldung to tax returns.',
      icon: Video,
      path: '/tutorials',
      color: 'bg-rose-50 text-rose-600',
      benefits: ['Visual walkthroughs', 'Expert explanations', 'Bilingual subtitles'],
      stats: '50+ Hours'
    },
    {
      id: 'calculator',
	      title: 'Free Planning Tools',
	      description: 'Estimate German net salary and convert relocation budgets after creating a free account.',
	      icon: Calculator,
	      path: '/tools',
	      color: 'bg-amber-50 text-amber-600',
	      benefits: ['Free account access', 'German wage tax estimate', 'Currency conversion'],
	      stats: 'Beta access'
    },
    {
      id: 'apartments',
	      title: 'Housing Resources',
	      description: 'Use curated Frankfurt housing guidance and third-party portal links without copied apartment listings.',
	      icon: Home,
	      path: '/apartments',
	      color: 'bg-teal-50 text-teal-600',
	      benefits: ['Original guidance', 'Neighborhood context', 'Portal links'],
	      stats: 'Curated resources'
    }
  ];

  return (
    <>
      <SEOHead
        title="Features | Frankfurt Expat Services"
        description="Explore all features on Frankfurt Expat Services: free tools, personalised checklists, document templates, apartment tracking, and the expat service directory."
        canonical="/features"
      />

      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Explore All Features</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to make your move to Frankfurt smooth and stress-free.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="p-8">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${feature.color}`}>
                    <feature.icon className="w-8 h-8" />
                  </div>
                  
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h2>
                  <p className="text-gray-600 mb-6 text-lg">{feature.description}</p>
                  
                  <div className="space-y-3 mb-8">
                    {feature.benefits.map((benefit, i) => (
                      <div key={i} className="flex items-center text-gray-700">
                        <CheckCircle2 className="w-5 h-5 text-teal-500 mr-3" />
                        {benefit}
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between mt-auto pt-6 border-t border-gray-100">
                    <span className="text-sm font-semibold text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
                      {feature.stats}
                    </span>
                    <Link 
                      to={feature.path}
                      className="inline-flex items-center px-6 py-3 bg-gray-900 text-white rounded-lg font-bold hover:bg-black transition-colors"
                    >
                      Get Started <ArrowRight className="w-5 h-5 ml-2" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default FeaturesOverviewPage;
