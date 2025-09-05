import React from 'react';
import { BookOpen, MessageSquare, Video, AlertTriangle, Settings, CreditCard } from 'lucide-react';
import InteractiveGuideCard from './InteractiveGuideCard';
import RecordButton from './RecordButton';

const Dashboard = ({ user, onNavigate }) => {
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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={action.action}
              className={`${action.color} p-4 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-card`}
            >
              <action.icon className="w-8 h-8 text-white mb-2" />
              <h3 className="text-white font-semibold text-sm">{action.title}</h3>
              <p className="text-gray-200 text-xs">{action.description}</p>
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
            <CreditCard className="w-5 h-5 text-accent" />
            <div>
              <h3 className="text-white font-medium">
                {user?.subscriptionStatus === 'premium' ? 'Premium Account' : 'Free Account'}
              </h3>
              <p className="text-gray-400 text-sm">
                {user?.subscriptionStatus === 'premium' 
                  ? 'All features unlocked' 
                  : 'Upgrade for full access'
                }
              </p>
            </div>
          </div>
          {user?.subscriptionStatus !== 'premium' && (
            <button className="bg-accent hover:bg-teal-600 text-white px-4 py-2 rounded-md text-sm transition-colors">
              Upgrade
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;