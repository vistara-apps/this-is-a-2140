import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Share, BookOpen, Shield, AlertCircle } from 'lucide-react';
import { getStateRights, hasComprehensiveData, getRecordingLaws, getIdentificationLaws } from '../utils/legalDataManager';

const InteractiveGuideCard = ({ state, preview = false, onExpand }) => {
  const [expanded, setExpanded] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');
  
  const rightsData = getStateRights(state);
  const isComprehensive = hasComprehensiveData(state);
  const recordingLaws = getRecordingLaws(state);
  const idLaws = getIdentificationLaws(state);

  const sections = [
    { id: 'overview', title: 'Your Rights', icon: Shield },
    { id: 'traffic', title: 'Traffic Stops', icon: BookOpen },
    { id: 'encounter', title: 'Police Encounters', icon: BookOpen },
    { id: 'stateSpecific', title: `${state} Specific`, icon: AlertCircle },
    { id: 'recording', title: 'Recording Laws', icon: BookOpen },
    { id: 'identification', title: 'ID Requirements', icon: BookOpen }
  ];

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${state} Legal Rights Guide`,
        text: `Know your rights in ${state}`,
        url: window.location.href
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (preview) {
    return (
      <div className="bg-surface rounded-lg p-4 border border-gray-700 cursor-pointer" onClick={onExpand}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <h3 className="text-white font-semibold">Your Rights in {state}</h3>
            {isComprehensive ? (
              <div className="bg-accent/20 text-accent px-2 py-1 rounded-full text-xs">
                Comprehensive
              </div>
            ) : (
              <div className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full text-xs">
                Generic
              </div>
            )}
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </div>
        <div className="space-y-2">
          {rightsData.overview.slice(0, 2).map((right, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-accent rounded-full"></div>
              <span className="text-sm text-gray-300">{right}</span>
            </div>
          ))}
          <p className="text-xs text-gray-400 mt-2">Tap to view complete guide</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-lg border border-gray-700 overflow-hidden">
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">{state} Legal Rights Guide</h2>
          <button
            onClick={handleShare}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <Share className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Section Navigation */}
      <div className="border-b border-gray-700">
        <div className="flex overflow-x-auto">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex-shrink-0 px-4 py-3 text-sm font-medium transition-colors ${
                activeSection === section.id
                  ? 'text-accent border-b-2 border-accent'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {section.title}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="space-y-3">
          {activeSection === 'recording' ? (
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="text-gray-300">
                    <strong>Legal:</strong> {recordingLaws.legal ? 'Yes' : 'No'}
                  </p>
                  <p className="text-gray-400 text-sm mt-1">{recordingLaws.restrictions}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-300">{recordingLaws.notes}</p>
              </div>
            </div>
          ) : activeSection === 'identification' ? (
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="text-gray-300">
                    <strong>Required:</strong> {idLaws.required ? 'Yes' : 'No'}
                  </p>
                  <p className="text-gray-400 text-sm mt-1">{idLaws.conditions}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-300">
                  <strong>Penalty for refusal:</strong> {idLaws.penalty}
                </p>
              </div>
            </div>
          ) : (
            rightsData[activeSection]?.map((item, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-300">{item}</p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Important Disclaimer */}
      <div className="px-4 pb-4">
        <div className="bg-yellow-900/20 border border-yellow-700 rounded-md p-3">
          <p className="text-yellow-200 text-xs">
            <strong>Disclaimer:</strong> This information is for educational purposes only and does not constitute legal advice. 
            Laws vary by jurisdiction and situation. Consult with a qualified attorney for specific legal guidance.
          </p>
        </div>
      </div>
    </div>
  );
};

export default InteractiveGuideCard;
