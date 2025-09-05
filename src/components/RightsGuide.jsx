import React from 'react';
import { ArrowLeft } from 'lucide-react';
import InteractiveGuideCard from './InteractiveGuideCard';

const RightsGuide = ({ user }) => {
  return (
    <div className="max-w-xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Legal Rights Guide</h1>
        <p className="text-gray-300">
          Know your rights and stay protected in {user?.state}
        </p>
      </div>

      <InteractiveGuideCard state={user?.state} />
    </div>
  );
};

export default RightsGuide;