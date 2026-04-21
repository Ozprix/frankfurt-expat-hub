import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { ChevronDown, ChevronUp, Book, CreditCard } from '@/lib/icons';

const AdminHelp = () => {
  const [openSection, setOpenSection] = useState(null);

  const sections = [
    {
      title: "Understanding Logic Conditions",
      content: (
        <div className="space-y-2">
           <p>Logic conditions determine whether a task appears for a specific user. The system evaluates all conditions using an <strong>AND</strong> operator (all must be true).</p>
           <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><strong>==</strong>: Checks for exact match (e.g., <code>visaType == 'Student'</code>)</li>
              <li><strong>!=</strong>: Checks for inequality (e.g., <code>visaType != 'EU'</code>)</li>
              <li><strong>includes</strong>: Useful for array fields (not currently used extensively)</li>
              <li><strong>exists</strong>: Checks if a field has any value (not null/undefined)</li>
           </ul>
        </div>
      )
    },
    {
      title: "Managing Dependencies",
      content: (
        <div>
           <p>Dependencies prevent tasks from being marked as "Complete" until prerequisite tasks are finished. This creates a logical flow for the user.</p>
           <p className="mt-2">For example, setting <strong>Tax ID</strong> to depend on <strong>Anmeldung</strong> means the Tax ID task will show a lock icon until Anmeldung is checked off.</p>
        </div>
      )
    },
    {
      title: "Payment & Subscriptions",
      content: (
        <div className="space-y-3">
           <p>Paid checkout is currently paused while the platform focuses on traffic, free tools, directory growth, and community adoption.</p>
           
           <h4 className="font-semibold text-gray-900 mt-2">Setup Checklist:</h4>
           <ul className="list-disc pl-5 space-y-1">
              <li>Keep Stripe configuration in the codebase for future reactivation.</li>
              <li>Do not promote paid checkout links during the current growth phase.</li>
              <li>Prioritize directory curation, search traffic, lead capture, and free account creation.</li>
           </ul>

           <h4 className="font-semibold text-gray-900 mt-2">Managing Customers:</h4>
           <p>When monetization is re-enabled, refunds, cancellations, upgrades, and customer lookup should be handled in the Stripe Dashboard.</p>
           
           <a 
             href="https://dashboard.stripe.com/" 
             target="_blank" 
             rel="noreferrer"
             className="text-teal-600 hover:underline inline-flex items-center mt-2"
           >
             Go to Stripe Dashboard <CreditCard className="w-3 h-3 ml-1" />
           </a>
        </div>
      )
    }
  ];

  return (
    <>
      <Helmet>
        <title>Admin Help - Frankfurt Expat Services</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>

      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
             <div className="p-3 bg-teal-100 rounded-full text-teal-600">
                <Book className="w-8 h-8" />
             </div>
             <div>
                <h1 className="text-3xl font-bold text-gray-900">Admin Documentation</h1>
                <p className="text-gray-500">Guides and reference for managing the task registry</p>
             </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
             {sections.map((section, idx) => (
                <div key={idx} className="border-b border-gray-100 last:border-0">
                   <button 
                     onClick={() => setOpenSection(openSection === idx ? null : idx)}
                     className="w-full px-6 py-4 flex justify-between items-center hover:bg-gray-50 text-left"
                   >
                      <span className="font-medium text-gray-900">{section.title}</span>
                      {openSection === idx ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-400" />}
                   </button>
                   {openSection === idx && (
                      <div className="px-6 pb-6 text-sm text-gray-600 leading-relaxed">
                         {section.content}
                      </div>
                   )}
                </div>
             ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminHelp;
