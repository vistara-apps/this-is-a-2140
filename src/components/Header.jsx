import React from 'react';
import { Shield, Menu, Settings } from 'lucide-react';
import { ConnectButton } from '@rainbow-me/rainbowkit';

const Header = ({ currentView, onNavigate, user }) => {
  return (
    <header className="sticky top-0 z-50 bg-surface border-b border-gray-800">
      <div className="max-w-xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div 
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => onNavigate('dashboard')}
          >
            <Shield className="w-6 h-6 text-accent" />
            <span className="text-lg font-semibold text-white">Pocket Protector</span>
          </div>
          
          <div className="flex items-center space-x-3">
            {user?.state && (
              <span className="text-sm text-gray-400 bg-gray-800 px-2 py-1 rounded-sm">
                {user.state}
              </span>
            )}
            <ConnectButton />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;