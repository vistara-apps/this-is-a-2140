// useIPFSStorage Hook - Simplified IPFS storage via Pinata
import { useState, useCallback } from 'react';
import pinataService from '../services/pinataService';
import { useSubscription } from './useSubscription';

export const useIPFSStorage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { hasFeature } = useSubscription();

  // Check if user has cloud storage access
  const hasCloudStorage = hasFeature('cloudStorage');

  // Upload recording to IPFS
  const uploadRecording = useCallback(async (recordingBlob, metadata = {}) => {
    if (!hasCloudStorage) {
      return {
        success: false,
        error: 'Cloud storage requires premium subscription'
      };
    }

    try {
      setLoading(true);
      setError(null);
      setUploadProgress(0);

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const result = await pinataService.pinRecording(recordingBlob, {
        filename: metadata.filename || `recording-${Date.now()}.webm`,
        recordingType: metadata.type || 'audio',
        duration: metadata.duration || 0,
        location: metadata.location,
        timestamp: metadata.timestamp || new Date().toISOString(),
        userId: metadata.userId || 'anonymous',
        encrypted: metadata.encrypted || false
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (result.success) {
        return {
          success: true,
          ipfsHash: result.ipfsHash,
          url: result.url,
          size: result.pinSize,
          timestamp: result.timestamp
        };
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      setError(err.message);
      return {
        success: false,
        error: err.message
      };
    } finally {
      setLoading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  }, [hasCloudStorage]);

  // Upload encounter card to IPFS
  const uploadEncounterCard = useCallback(async (cardData, metadata = {}) => {
    if (!hasCloudStorage) {
      return {
        success: false,
        error: 'Cloud storage requires premium subscription'
      };
    }

    try {
      setLoading(true);
      setError(null);

      const result = await pinataService.pinEncounterCard(cardData, {
        name: metadata.name || `encounter-card-${Date.now()}`,
        state: metadata.state,
        location: metadata.location,
        timestamp: metadata.timestamp || new Date().toISOString(),
        userId: metadata.userId || 'anonymous'
      });

      if (result.success) {
        return {
          success: true,
          ipfsHash: result.ipfsHash,
          url: result.url,
          size: result.pinSize,
          timestamp: result.timestamp
        };
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      setError(err.message);
      return {
        success: false,
        error: err.message
      };
    } finally {
      setLoading(false);
    }
  }, [hasCloudStorage]);

  // Get user's recordings from IPFS
  const getUserRecordings = useCallback(async (userId, options = {}) => {
    try {
      setLoading(true);
      setError(null);

      const result = await pinataService.getUserRecordings(userId, options);

      if (result.success) {
        return {
          success: true,
          recordings: result.files.map(file => ({
            id: file.ipfsHash,
            ipfsHash: file.ipfsHash,
            url: file.url,
            size: file.size,
            timestamp: file.timestamp,
            name: file.name,
            type: file.keyvalues?.recordingType || 'audio',
            duration: parseInt(file.keyvalues?.duration) || 0,
            location: file.keyvalues?.location ? JSON.parse(file.keyvalues.location) : null
          })),
          count: result.count
        };
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      setError(err.message);
      return {
        success: false,
        error: err.message
      };
    } finally {
      setLoading(false);
    }
  }, []);

  // Get user's encounter cards from IPFS
  const getUserEncounterCards = useCallback(async (userId, options = {}) => {
    try {
      setLoading(true);
      setError(null);

      const result = await pinataService.getUserEncounterCards(userId, options);

      if (result.success) {
        return {
          success: true,
          cards: result.files.map(file => ({
            id: file.ipfsHash,
            ipfsHash: file.ipfsHash,
            url: file.url,
            size: file.size,
            timestamp: file.timestamp,
            name: file.name,
            state: file.keyvalues?.state,
            location: file.keyvalues?.location ? JSON.parse(file.keyvalues.location) : null
          })),
          count: result.count
        };
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      setError(err.message);
      return {
        success: false,
        error: err.message
      };
    } finally {
      setLoading(false);
    }
  }, []);

  // Download file from IPFS
  const downloadFile = useCallback(async (ipfsHash, filename) => {
    try {
      setLoading(true);
      setError(null);

      const result = await pinataService.getFile(ipfsHash);

      if (result.success) {
        // Create download link
        const url = window.URL.createObjectURL(result.data);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename || `file-${ipfsHash}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        return { success: true };
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      setError(err.message);
      return {
        success: false,
        error: err.message
      };
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete file from IPFS
  const deleteFile = useCallback(async (ipfsHash) => {
    try {
      setLoading(true);
      setError(null);

      const result = await pinataService.unpinFile(ipfsHash);

      if (result.success) {
        return { success: true };
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      setError(err.message);
      return {
        success: false,
        error: err.message
      };
    } finally {
      setLoading(false);
    }
  }, []);

  // Get storage statistics
  const getStorageStats = useCallback(async (userId) => {
    try {
      setLoading(true);
      setError(null);

      const result = await pinataService.getStorageStats(userId);

      if (result.success) {
        return {
          success: true,
          stats: result.stats
        };
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      setError(err.message);
      return {
        success: false,
        error: err.message
      };
    } finally {
      setLoading(false);
    }
  }, []);

  // Generate shareable link
  const generateShareableLink = useCallback((ipfsHash, options = {}) => {
    return pinataService.generateShareableLink(ipfsHash, options);
  }, []);

  // Check if IPFS service is available
  const checkAvailability = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const isAvailable = await pinataService.isAvailable();
      return { success: true, available: isAvailable };
    } catch (err) {
      setError(err.message);
      return {
        success: false,
        available: false,
        error: err.message
      };
    } finally {
      setLoading(false);
    }
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    uploadProgress,
    hasCloudStorage,
    uploadRecording,
    uploadEncounterCard,
    getUserRecordings,
    getUserEncounterCards,
    downloadFile,
    deleteFile,
    getStorageStats,
    generateShareableLink,
    checkAvailability,
    clearError
  };
};

// Hook for managing cloud backup sync
export const useCloudBackup = () => {
  const [syncStatus, setSyncStatus] = useState('idle'); // 'idle', 'syncing', 'success', 'error'
  const [syncProgress, setSyncProgress] = useState(0);
  const { uploadRecording, getUserRecordings } = useIPFSStorage();

  // Sync local recordings to cloud
  const syncToCloud = useCallback(async (localRecordings, userId) => {
    try {
      setSyncStatus('syncing');
      setSyncProgress(0);

      const cloudRecordings = await getUserRecordings(userId);
      const cloudHashes = new Set(
        cloudRecordings.success ? cloudRecordings.recordings.map(r => r.id) : []
      );

      const recordingsToSync = localRecordings.filter(recording => 
        !cloudHashes.has(recording.id) && recording.blob
      );

      if (recordingsToSync.length === 0) {
        setSyncStatus('success');
        return { success: true, synced: 0 };
      }

      let syncedCount = 0;
      for (const recording of recordingsToSync) {
        const result = await uploadRecording(recording.blob, {
          filename: `recording-${recording.id}.webm`,
          type: recording.type,
          duration: recording.duration,
          location: recording.location,
          timestamp: recording.timestamp,
          userId
        });

        if (result.success) {
          syncedCount++;
        }

        setSyncProgress((syncedCount / recordingsToSync.length) * 100);
      }

      setSyncStatus('success');
      return { success: true, synced: syncedCount };
    } catch (error) {
      setSyncStatus('error');
      return { success: false, error: error.message };
    }
  }, [uploadRecording, getUserRecordings]);

  // Auto-sync when recordings change
  const enableAutoSync = useCallback((localRecordings, userId, interval = 300000) => { // 5 minutes
    const syncInterval = setInterval(() => {
      if (syncStatus === 'idle') {
        syncToCloud(localRecordings, userId);
      }
    }, interval);

    return () => clearInterval(syncInterval);
  }, [syncToCloud, syncStatus]);

  return {
    syncStatus,
    syncProgress,
    syncToCloud,
    enableAutoSync
  };
};

export default useIPFSStorage;

