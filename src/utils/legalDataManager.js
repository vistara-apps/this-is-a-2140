// Legal Data Manager - Handles state-specific legal rights data
import { STATE_RIGHTS_DATABASE, getRightsData, US_STATES } from '../data/stateRights';
import { EXTENDED_STATE_RIGHTS } from '../data/stateRightsExtended';

// Combine all state rights data
const ALL_STATE_RIGHTS = { ...STATE_RIGHTS_DATABASE, ...EXTENDED_STATE_RIGHTS };

/**
 * Get comprehensive legal rights data for a specific state
 * @param {string} state - The state name
 * @returns {object} Complete rights data for the state
 */
export const getStateRights = (state) => {
  if (!state || typeof state !== 'string') {
    throw new Error('State parameter is required and must be a string');
  }

  const normalizedState = state.trim();
  
  // Check if state exists in our database
  if (ALL_STATE_RIGHTS[normalizedState]) {
    return {
      ...ALL_STATE_RIGHTS[normalizedState],
      state: normalizedState,
      lastUpdated: new Date().toISOString(),
      dataSource: 'comprehensive'
    };
  }

  // Fallback to generic rights data
  console.warn(`State '${normalizedState}' not found in database, using generic rights`);
  return {
    ...getRightsData(normalizedState),
    state: normalizedState,
    lastUpdated: new Date().toISOString(),
    dataSource: 'generic'
  };
};

/**
 * Validate if a state is supported
 * @param {string} state - The state name to validate
 * @returns {boolean} True if state is supported
 */
export const isStateSupported = (state) => {
  return US_STATES.includes(state);
};

/**
 * Get all supported states
 * @returns {Array} Array of all supported state names
 */
export const getSupportedStates = () => {
  return [...US_STATES];
};

/**
 * Search for states by partial name
 * @param {string} query - Search query
 * @returns {Array} Array of matching state names
 */
export const searchStates = (query) => {
  if (!query || typeof query !== 'string') {
    return US_STATES;
  }

  const normalizedQuery = query.toLowerCase().trim();
  return US_STATES.filter(state => 
    state.toLowerCase().includes(normalizedQuery)
  );
};

/**
 * Get recording laws for a specific state
 * @param {string} state - The state name
 * @returns {object} Recording laws and restrictions
 */
export const getRecordingLaws = (state) => {
  const stateData = getStateRights(state);
  return stateData.recording || {
    legal: true,
    restrictions: "Check local laws for specific restrictions",
    notes: "Generally legal in public spaces"
  };
};

/**
 * Get identification requirements for a specific state
 * @param {string} state - The state name
 * @returns {object} ID requirements and penalties
 */
export const getIdentificationLaws = (state) => {
  const stateData = getStateRights(state);
  return stateData.identification || {
    required: false,
    conditions: "Varies by state - generally only upon arrest",
    penalty: "Varies by jurisdiction"
  };
};

/**
 * Get traffic stop specific rights for a state
 * @param {string} state - The state name
 * @returns {Array} Array of traffic stop rights
 */
export const getTrafficRights = (state) => {
  const stateData = getStateRights(state);
  return stateData.traffic || [];
};

/**
 * Get general encounter rights for a state
 * @param {string} state - The state name
 * @returns {Array} Array of general encounter rights
 */
export const getEncounterRights = (state) => {
  const stateData = getStateRights(state);
  return stateData.encounter || [];
};

/**
 * Get state-specific legal information
 * @param {string} state - The state name
 * @returns {Array} Array of state-specific legal points
 */
export const getStateSpecificRights = (state) => {
  const stateData = getStateRights(state);
  return stateData.stateSpecific || [];
};

/**
 * Generate a comprehensive rights summary for sharing
 * @param {string} state - The state name
 * @param {object} options - Options for summary generation
 * @returns {object} Formatted rights summary
 */
export const generateRightsSummary = (state, options = {}) => {
  const {
    includeTraffic = true,
    includeEncounter = true,
    includeStateSpecific = true,
    includeRecording = true,
    includeIdentification = true
  } = options;

  const stateData = getStateRights(state);
  const summary = {
    state,
    title: `Legal Rights Guide for ${state}`,
    overview: stateData.overview,
    sections: {}
  };

  if (includeTraffic) {
    summary.sections.traffic = {
      title: 'Traffic Stop Rights',
      content: stateData.traffic
    };
  }

  if (includeEncounter) {
    summary.sections.encounter = {
      title: 'Police Encounter Rights',
      content: stateData.encounter
    };
  }

  if (includeStateSpecific) {
    summary.sections.stateSpecific = {
      title: `${state} Specific Laws`,
      content: stateData.stateSpecific
    };
  }

  if (includeRecording) {
    summary.sections.recording = {
      title: 'Recording Laws',
      content: stateData.recording
    };
  }

  if (includeIdentification) {
    summary.sections.identification = {
      title: 'Identification Requirements',
      content: stateData.identification
    };
  }

  return summary;
};

/**
 * Check if state has comprehensive data or uses generic fallback
 * @param {string} state - The state name
 * @returns {boolean} True if state has comprehensive data
 */
export const hasComprehensiveData = (state) => {
  return ALL_STATE_RIGHTS.hasOwnProperty(state);
};

/**
 * Get data coverage statistics
 * @returns {object} Statistics about data coverage
 */
export const getDataCoverage = () => {
  const totalStates = US_STATES.length;
  const comprehensiveStates = Object.keys(ALL_STATE_RIGHTS).length;
  const genericStates = totalStates - comprehensiveStates;

  return {
    total: totalStates,
    comprehensive: comprehensiveStates,
    generic: genericStates,
    coveragePercentage: Math.round((comprehensiveStates / totalStates) * 100)
  };
};

// Export for debugging and development
export const __dev__ = {
  ALL_STATE_RIGHTS,
  STATE_RIGHTS_DATABASE,
  EXTENDED_STATE_RIGHTS
};

