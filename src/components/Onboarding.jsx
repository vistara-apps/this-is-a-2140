import React, { useState } from 'react';
import { Shield, ChevronRight, Check } from 'lucide-react';

const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 
  'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 
  'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 
  'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 
  'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 
  'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 
  'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 
  'Wisconsin', 'Wyoming'
];

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
];

const Onboarding = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [selectedState, setSelectedState] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [emergencyContacts, setEmergencyContacts] = useState([{ name: '', phone: '' }]);

  const handleStateSelect = (state) => {
    setSelectedState(state);
  };

  const handleLanguageSelect = (langCode) => {
    setSelectedLanguage(langCode);
  };

  const addEmergencyContact = () => {
    setEmergencyContacts([...emergencyContacts, { name: '', phone: '' }]);
  };

  const updateEmergencyContact = (index, field, value) => {
    const updated = emergencyContacts.map((contact, i) => 
      i === index ? { ...contact, [field]: value } : contact
    );
    setEmergencyContacts(updated);
  };

  const removeEmergencyContact = (index) => {
    if (emergencyContacts.length > 1) {
      setEmergencyContacts(emergencyContacts.filter((_, i) => i !== index));
    }
  };

  const handleComplete = () => {
    const userData = {
      userId: Date.now().toString(),
      state: selectedState,
      preferredLanguage: selectedLanguage,
      emergencyContacts: emergencyContacts.filter(contact => contact.name && contact.phone),
      subscriptionStatus: 'free',
      createdAt: new Date().toISOString()
    };
    
    onComplete(userData);
  };

  const nextStep = () => {
    if (step < 4) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Progress indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-2">
            {[1, 2, 3, 4].map((num) => (
              <div
                key={num}
                className={`w-3 h-3 rounded-full ${
                  num <= step ? 'bg-accent' : 'bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="bg-surface rounded-lg p-6 shadow-card">
          {step === 1 && (
            <div className="text-center">
              <Shield className="w-16 h-16 text-accent mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-white mb-2">Welcome to Pocket Protector</h1>
              <p className="text-gray-300 mb-6">
                Your rights, your script, instantly. Get state-specific legal guidance and protection tools.
              </p>
              <div className="space-y-3 text-left mb-6">
                <div className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-accent" />
                  <span className="text-sm text-gray-300">State-specific legal rights guides</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-accent" />
                  <span className="text-sm text-gray-300">Scripted responses for interactions</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-accent" />
                  <span className="text-sm text-gray-300">One-tap incident recording</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-accent" />
                  <span className="text-sm text-gray-300">Automated alerts to trusted contacts</span>
                </div>
              </div>
              <button
                onClick={nextStep}
                className="w-full bg-primary hover:bg-blue-600 text-white py-3 px-4 rounded-md transition-colors flex items-center justify-center space-x-2"
              >
                <span>Get Started</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-xl font-semibold text-white mb-2">Select Your State</h2>
              <p className="text-gray-300 mb-4">
                Choose your primary state to receive tailored legal information.
              </p>
              <div className="max-h-64 overflow-y-auto space-y-2 mb-6">
                {US_STATES.map((state) => (
                  <button
                    key={state}
                    onClick={() => handleStateSelect(state)}
                    className={`w-full text-left p-3 rounded-md transition-colors ${
                      selectedState === state
                        ? 'bg-primary text-white'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    {state}
                  </button>
                ))}
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={prevStep}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 px-4 rounded-md transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={nextStep}
                  disabled={!selectedState}
                  className="flex-1 bg-primary hover:bg-blue-600 text-white py-3 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-xl font-semibold text-white mb-2">Preferred Language</h2>
              <p className="text-gray-300 mb-4">
                Select your preferred language for scripts and guidance.
              </p>
              <div className="space-y-3 mb-6">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageSelect(lang.code)}
                    className={`w-full text-left p-3 rounded-md transition-colors ${
                      selectedLanguage === lang.code
                        ? 'bg-primary text-white'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    {lang.name}
                  </button>
                ))}
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={prevStep}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 px-4 rounded-md transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={nextStep}
                  className="flex-1 bg-primary hover:bg-blue-600 text-white py-3 px-4 rounded-md transition-colors"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <h2 className="text-xl font-semibold text-white mb-2">Emergency Contacts</h2>
              <p className="text-gray-300 mb-4">
                Add trusted contacts who will be notified during incidents (optional).
              </p>
              <div className="space-y-3 mb-4">
                {emergencyContacts.map((contact, index) => (
                  <div key={index} className="space-y-2">
                    <input
                      type="text"
                      placeholder="Contact name"
                      value={contact.name}
                      onChange={(e) => updateEmergencyContact(index, 'name', e.target.value)}
                      className="w-full p-3 bg-gray-800 text-white rounded-md border border-gray-700 focus:border-primary focus:outline-none"
                    />
                    <div className="flex space-x-2">
                      <input
                        type="tel"
                        placeholder="Phone number"
                        value={contact.phone}
                        onChange={(e) => updateEmergencyContact(index, 'phone', e.target.value)}
                        className="flex-1 p-3 bg-gray-800 text-white rounded-md border border-gray-700 focus:border-primary focus:outline-none"
                      />
                      {emergencyContacts.length > 1 && (
                        <button
                          onClick={() => removeEmergencyContact(index)}
                          className="px-3 py-3 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              {emergencyContacts.length < 3 && (
                <button
                  onClick={addEmergencyContact}
                  className="w-full p-3 border border-gray-600 border-dashed rounded-md text-gray-400 hover:text-white hover:border-gray-500 transition-colors mb-6"
                >
                  + Add Another Contact
                </button>
              )}

              <div className="flex space-x-3">
                <button
                  onClick={prevStep}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 px-4 rounded-md transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleComplete}
                  className="flex-1 bg-accent hover:bg-teal-600 text-white py-3 px-4 rounded-md transition-colors"
                >
                  Complete Setup
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;