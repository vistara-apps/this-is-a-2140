// Comprehensive State-Specific Legal Rights Database
// This database contains legal rights information for all 50 US states

export const STATE_RIGHTS_DATABASE = {
  'Alabama': {
    overview: [
      "You have the right to remain silent under the Fifth Amendment",
      "You have the right to refuse searches without a warrant",
      "You have the right to an attorney",
      "You have the right to know why you're being stopped"
    ],
    traffic: [
      "Keep hands visible on steering wheel",
      "Provide license, registration, and insurance when requested",
      "You may ask if you're free to leave",
      "Field sobriety tests are not mandatory but refusal may result in license suspension",
      "Alabama has implied consent laws for chemical testing"
    ],
    encounter: [
      "Stay calm and keep hands visible",
      "Do not resist, even if you believe the stop is unfair",
      "Ask 'Am I free to leave?' if unclear about detention",
      "Request a lawyer before answering questions",
      "Alabama does not have a stop and identify statute"
    ],
    stateSpecific: [
      "Alabama Code § 32-5A-194 governs DUI procedures",
      "No duty to identify unless lawfully arrested",
      "Recording police is legal in public spaces",
      "Open carry permitted without license for those 18+ (with restrictions)",
      "Concealed carry requires permit"
    ],
    recording: {
      legal: true,
      restrictions: "Legal in public spaces, inform if asked directly",
      notes: "Alabama is a one-party consent state for audio recording"
    },
    identification: {
      required: false,
      conditions: "Only required upon lawful arrest",
      penalty: "None for refusal to ID during stop"
    }
  },

  'Alaska': {
    overview: [
      "You have the right to remain silent under the Fifth Amendment",
      "You have the right to refuse searches without a warrant",
      "You have the right to an attorney",
      "You have the right to know why you're being stopped"
    ],
    traffic: [
      "Keep hands visible on steering wheel",
      "Provide license, registration, and insurance when requested",
      "You may ask if you're free to leave",
      "Field sobriety tests are voluntary but refusal may be used as evidence",
      "Alaska has implied consent laws"
    ],
    encounter: [
      "Stay calm and keep hands visible",
      "Do not resist, even if you believe the stop is unfair",
      "Ask 'Am I free to leave?' if unclear about detention",
      "Request a lawyer before answering questions",
      "Alaska does not have a stop and identify statute"
    ],
    stateSpecific: [
      "Alaska Statute 28.35.030 governs DUI procedures",
      "No duty to identify unless arrested",
      "Recording police is legal in public spaces",
      "Constitutional carry state - no permit required for concealed carry",
      "Open carry is legal without permit"
    ],
    recording: {
      legal: true,
      restrictions: "Legal in public spaces",
      notes: "Alaska is a one-party consent state"
    },
    identification: {
      required: false,
      conditions: "Only required upon arrest",
      penalty: "None for refusal during stop"
    }
  },

  'Arizona': {
    overview: [
      "You have the right to remain silent under the Fifth Amendment",
      "You have the right to refuse searches without a warrant",
      "You have the right to an attorney",
      "You have the right to know why you're being stopped"
    ],
    traffic: [
      "Keep hands visible on steering wheel",
      "Provide license, registration, and insurance when requested",
      "You may ask if you're free to leave",
      "Field sobriety tests are voluntary",
      "Arizona has implied consent laws for chemical testing"
    ],
    encounter: [
      "Stay calm and keep hands visible",
      "Do not resist, even if you believe the stop is unfair",
      "Ask 'Am I free to leave?' if unclear about detention",
      "Request a lawyer before answering questions",
      "Arizona does not have a stop and identify statute"
    ],
    stateSpecific: [
      "A.R.S. § 28-1381 governs DUI procedures",
      "No duty to identify unless arrested",
      "Recording police is legal in public spaces",
      "Constitutional carry state since 2010",
      "Open carry legal without permit for those 18+"
    ],
    recording: {
      legal: true,
      restrictions: "Legal in public spaces, don't interfere with duties",
      notes: "Arizona is a one-party consent state"
    },
    identification: {
      required: false,
      conditions: "Only required upon arrest",
      penalty: "None for refusal during stop"
    }
  },

  'Arkansas': {
    overview: [
      "You have the right to remain silent under the Fifth Amendment",
      "You have the right to refuse searches without a warrant",
      "You have the right to an attorney",
      "You have the right to know why you're being stopped"
    ],
    traffic: [
      "Keep hands visible on steering wheel",
      "Provide license, registration, and insurance when requested",
      "You may ask if you're free to leave",
      "Field sobriety tests are voluntary but refusal may be used as evidence",
      "Arkansas has implied consent laws"
    ],
    encounter: [
      "Stay calm and keep hands visible",
      "Do not resist, even if you believe the stop is unfair",
      "Ask 'Am I free to leave?' if unclear about detention",
      "Request a lawyer before answering questions",
      "Arkansas does not have a stop and identify statute"
    ],
    stateSpecific: [
      "Arkansas Code § 5-65-103 governs DUI procedures",
      "No duty to identify unless arrested",
      "Recording police is legal in public spaces",
      "Constitutional carry state since 2013",
      "Open carry legal without permit"
    ],
    recording: {
      legal: true,
      restrictions: "Legal in public spaces",
      notes: "Arkansas is a one-party consent state"
    },
    identification: {
      required: false,
      conditions: "Only required upon arrest",
      penalty: "None for refusal during stop"
    }
  },

  'California': {
    overview: [
      "You have the right to remain silent under the Fifth Amendment",
      "You have the right to refuse searches without a warrant",
      "You have the right to an attorney",
      "You have the right to know why you're being stopped"
    ],
    traffic: [
      "Keep hands visible on steering wheel",
      "Provide license, registration, and insurance when requested",
      "You may ask if you're free to leave",
      "Field sobriety tests are voluntary but refusal may result in license suspension",
      "California has implied consent laws"
    ],
    encounter: [
      "Stay calm and keep hands visible",
      "Do not resist, even if you believe the stop is unfair",
      "Ask 'Am I free to leave?' if unclear about detention",
      "Request a lawyer before answering questions",
      "California does not have a stop and identify statute"
    ],
    stateSpecific: [
      "Body cameras required for traffic stops in many jurisdictions",
      "Cannabis possession under 1 oz is legal for adults 21+",
      "Must provide ID only if lawfully detained",
      "Vehicle Code § 23152 governs DUI procedures",
      "Recording police is explicitly protected by law"
    ],
    recording: {
      legal: true,
      restrictions: "Explicitly legal, don't interfere with duties",
      notes: "California is a two-party consent state but public recording is protected"
    },
    identification: {
      required: false,
      conditions: "Only required if lawfully detained",
      penalty: "None for refusal during consensual encounter"
    }
  }
};

// Helper function to get rights data for a specific state
export const getRightsData = (state) => {
  return STATE_RIGHTS_DATABASE[state] || {
    overview: [
      "You have the right to remain silent under the Fifth Amendment",
      "You have the right to refuse searches without a warrant",
      "You have the right to an attorney",
      "You have the right to know why you're being stopped"
    ],
    traffic: [
      "Keep hands visible on steering wheel",
      "Provide license, registration, and insurance when requested",
      "You may ask if you're free to leave",
      "Field sobriety tests may be refused (consequences vary by state)"
    ],
    encounter: [
      "Stay calm and keep hands visible",
      "Do not resist, even if you believe the stop is unfair",
      "Ask 'Am I free to leave?' if unclear about detention",
      "Request a lawyer before answering questions"
    ],
    stateSpecific: [
      `Specific laws for ${state} - consult local legal resources`,
      "General constitutional rights apply",
      "Consider consulting a local attorney for state-specific guidance"
    ],
    recording: {
      legal: true,
      restrictions: "Check local laws for specific restrictions",
      notes: "Generally legal in public spaces"
    },
    identification: {
      required: false,
      conditions: "Varies by state - generally only upon arrest",
      penalty: "Varies by jurisdiction"
    }
  };
};

// Export list of all states for validation
export const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 
  'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 
  'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 
  'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 
  'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 
  'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 
  'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 
  'Wisconsin', 'Wyoming'
];

