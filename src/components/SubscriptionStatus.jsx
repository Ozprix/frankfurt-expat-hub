import React from 'react';
import { useSubscription } from '@/hooks/useSubscription';
import { CheckCircle, CreditCard, Loader2 } from '@/lib/icons';

const SubscriptionStatus = () => {
    const { tier, status, renewal_date, renewal_price, loading, isFree } = useSubscription();

    if (loading) return <div className="p-4"><Loader2 className="w-6 h-6 animate-spin text-teal-600" /></div>;

    const isActive = status === 'active' || status === 'trialing';

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-teal-500">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                    <CreditCard className="w-5 h-5 text-teal-600 mr-2" />
                    <h2 className="text-xl font-bold text-gray-900">Subscription & Billing</h2>
                </div>
                <span className={`px-4 py-1.5 rounded-full text-sm font-semibold flex items-center ${
                    isFree ? 'bg-gray-100 text-gray-700' : 'bg-teal-100 text-teal-800'
                }`}>
                    {isActive && <CheckCircle className="w-3 h-3 mr-1" />}
                    {tier} Plan
                </span>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <p className="text-sm text-gray-500 mb-1">Status</p>
                        <p className={`font-medium flex items-center gap-1 capitalize ${
                            isActive ? 'text-green-600' : 'text-gray-900'
                        }`}>
                            {status || 'Inactive'}
                            {isActive && <CheckCircle className="w-4 h-4" />}
                        </p>
                    </div>

                    {!isFree && (
                        <>
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Renewal Date</p>
                                <p className="font-medium text-gray-900">
                                    {renewal_date ? renewal_date.toLocaleDateString() : 'N/A'}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Renewal Amount</p>
                                <p className="font-medium text-gray-900">
                                    €{(renewal_price / 100).toFixed(2)}
                                </p>
                            </div>
                        </>
                    )}
                </div>
            </div>

            <div className="rounded-lg border border-teal-100 bg-teal-50 px-4 py-3 text-sm text-teal-900">
                Paid checkout is paused while access is free. Billing controls will return after the traffic and directory growth phase.
            </div>
        </div>
    );
};

export default SubscriptionStatus;
