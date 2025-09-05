import React, { useState, useEffect } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import RightsGuide from './components/RightsGuide';
import Scripts from './components/Scripts';
import Recording from './components/Recording';
import Onboarding from './components/Onboarding';
import { UserProvider } from './context/UserContext';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [user, setUser] = useState(null);
  const [isOnboarded, setIsOnboarded] = useState(false);

  useEffect(() => {
    // Check if user has completed onboarding
    const onboardingStatus = localStorage.getItem('pocket-protector-onboarded');
    const userData = localStorage.getItem('pocket-protector-user');
    
    if (onboardingStatus && userData) {
      setIsOnboarded(true);
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleOnboardingComplete = (userData) => {
    setUser(userData);
    setIsOnboarded(true);
    localStorage.setItem('pocket-protector-onboarded', 'true');
    localStorage.setItem('pocket-protector-user', JSON.stringify(userData));
  };

  if (!isOnboarded) {
    return (
      <UserProvider value={{ user, setUser }}>
        <div className="min-h-screen bg-bg">
          <Onboarding onComplete={handleOnboardingComplete} />
        </div>
      </UserProvider>
    );
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'rights':
        return <RightsGuide user={user} />;
      case 'scripts':
        return <Scripts user={user} />;
      case 'recording':
        return <Recording user={user} />;
      default:
        return <Dashboard user={user} onNavigate={setCurrentView} />;
    }
  };

  return (
    <UserProvider value={{ user, setUser }}>
      <div className="min-h-screen bg-bg">
        <Header 
          currentView={currentView} 
          onNavigate={setCurrentView}
          user={user}
        />
        <main className="pb-20">
          {renderCurrentView()}
        </main>
      </div>
    </UserProvider>
  );
}

export default App;