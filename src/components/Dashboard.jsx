import React, { useState } from 'react';
import { BookOpen, MessageSquare, Video, AlertTriangle, Settings, CreditCard, Crown, FileText } from 'lucide-react';
import InteractiveGuideCard from './InteractiveGuideCard';
import RecordButton from './RecordButton';
import PaymentModal from './PaymentModal';
import { useSubscription } from '../hooks/useSubscription';

const Dashboard = ({ user, onNavigate }) => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const { isPremium, currentTier, getDaysUntilExpiry } = useSubscription();
  const quickActions = [
    {
      icon: BookOpen,
      title: 'My Rights',
      description: `${user?.state} legal rights guide`,
      action: () => onNavigate('rights'),
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      icon: MessageSquare,
      title: 'Scripts',
      description: 'Ready-to-use phrases',
      action: () => onNavigate('scripts'),
      color: 'bg-purple-600 hover:bg-purple-700'
    },
    {
      icon: Video,
      title: 'Record',
      description: 'Document interactions',
      action: () => onNavigate('recording'),
      color: 'bg-red-600 hover:bg-red-700'
    },
    {
      icon: FileText,
      title: 'Encounter Cards',
      description: 'Generate shareable rights cards',
      action: () => onNavigate('encounter-cards'),
      color: 'bg-teal-600 hover:bg-teal-700',
      premium: true
    }
  ];

  return (
    <div className="max-w-xl mx-auto px-4 py-6 space-y-6">
      {/* Welcome Section */}
      <div className="gradient-surface rounded-lg p-6">
        <h1 className="text-2xl font-bold text-white mb-2">
          Welcome back!
        </h1>
        <p className="text-gray-300">
          Stay protected with instant access to your rights and tools for {user?.state}.
        </p>
      </div>

      {/* Emergency Record Button */}
      <div className="bg-surface rounded-lg p-6 border-l-4 border-red-500">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-white">Emergency Recording</h2>
            <p className="text-sm text-gray-400">Quick access for urgent situations</p>
          </div>
          <AlertTriangle className="w-8 h-8 text-red-500" />
        </div>
        <RecordButton 
          variant="emergency" 
          onRecord={() => onNavigate('recording')}
        />
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={action.premium && !isPremium() ? () => setShowPaymentModal(true) : action.action}
              className={`${action.color} p-4 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-card relative`}
            >
              {action.premium && !isPremium() && (
                <div className="absolute top-2 right-2">
                  <Crown className="w-4 h-4 text-yellow-400" />
                </div>
              )}
              <action.icon className="w-8 h-8 text-white mb-2" />
              <h3 className="text-white font-semibold text-sm">{action.title}</h3>
              <p className="text-gray-200 text-xs">{action.description}</p>
              {action.premium && !isPremium() && (
                <div className="mt-2">
                  <span className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full text-xs">
                    Premium
                  </span>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Guide Preview */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Your Rights Summary</h2>
        <InteractiveGuideCard 
          state={user?.state}
          preview={true}
          onExpand={() => onNavigate('rights')}
        />
      </div>

      {/* Subscription Status */}
      <div className="bg-surface rounded-lg p-4 border border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {isPremium() ? (
              <Crown className="w-5 h-5 text-yellow-400" />
            ) : (
              <CreditCard className="w-5 h-5 text-accent" />
            )}
            <div>
              <h3 className="text-white font-medium flex items-center space-x-2">
                <span>{currentTier.name} Account</span>
                {isPremium() && (
                  <div className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full text-xs">
                    Premium
                  </div>
                )}
              </h3>
              <p className="text-gray-400 text-sm">
                {isPremium() 
                  ? `All features unlocked${getDaysUntilExpiry() ? ` • ${getDaysUntilExpiry()} days remaining` : ''}` 
                  : 'Upgrade for full access to all features'
                }
              </p>
            </div>
          </div>
          {!isPremium() && (
            <button 
              onClick={() => setShowPaymentModal(true)}
              className="bg-accent hover:bg-teal-600 text-white px-4 py-2 rounded-md text-sm transition-colors flex items-center space-x-2"
            >
              <Crown className="w-4 h-4" />
              <span>Upgrade</span>
            </button>
          )}
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        type="subscription"
        onSuccess={() => {
          setShowPaymentModal(false);
          // Refresh the page to update subscription status
          window.location.reload();
        }}
        onError={(error) => {
          console.error('Payment error:', error);
        }}
      />
    </div>
  );
};

export default Dashboard;
