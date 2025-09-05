// Pinata Service - Handles IPFS storage via Pinata API
import axios from 'axios';

// Pinata configuration
const PINATA_CONFIG = {
  apiKey: process.env.REACT_APP_PINATA_API_KEY || 'demo_api_key',
  secretApiKey: process.env.REACT_APP_PINATA_SECRET_API_KEY || 'demo_secret_key',
  baseUrl: 'https://api.pinata.cloud',
  gatewayUrl: 'https://gateway.pinata.cloud/ipfs'
};

class PinataService {
  constructor() {
    this.apiClient = axios.create({
      baseURL: PINATA_CONFIG.baseUrl,
      headers: {
        'pinata_api_key': PINATA_CONFIG.apiKey,
        'pinata_secret_api_key': PINATA_CONFIG.secretApiKey
      }
    });
  }

  // Test authentication with Pinata
  async testAuthentication() {
    try {
      const response = await this.apiClient.get('/data/testAuthentication');
      return { success: true, message: response.data.message };
    } catch (error) {
      console.error('Pinata authentication failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Pin file to IPFS
  async pinFile(file, metadata = {}) {
    try {
      const formData = new FormData();
      formData.append('file', file);

      // Add metadata
      const pinataMetadata = {
        name: metadata.name || file.name,
        keyvalues: {
          app: 'pocket-protector',
          type: metadata.type || 'recording',
          timestamp: new Date().toISOString(),
          ...metadata.keyvalues
        }
      };

      formData.append('pinataMetadata', JSON.stringify(pinataMetadata));

      // Add pinning options
      const pinataOptions = {
        cidVersion: 1,
        wrapWithDirectory: false,
        ...metadata.options
      };

      formData.append('pinataOptions', JSON.stringify(pinataOptions));

      const response = await this.apiClient.post('/pinning/pinFileToIPFS', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity
      });

      return {
        success: true,
        ipfsHash: response.data.IpfsHash,
        pinSize: response.data.PinSize,
        timestamp: response.data.Timestamp,
        url: `${PINATA_CONFIG.gatewayUrl}/${response.data.IpfsHash}`,
        metadata: pinataMetadata
      };
    } catch (error) {
      console.error('Failed to pin file to IPFS:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message
      };
    }
  }

  // Pin JSON data to IPFS
  async pinJSON(jsonData, metadata = {}) {
    try {
      const pinataContent = {
        ...jsonData,
        _metadata: {
          app: 'pocket-protector',
          timestamp: new Date().toISOString(),
          version: '1.0'
        }
      };

      const pinataMetadata = {
        name: metadata.name || 'pocket-protector-data',
        keyvalues: {
          app: 'pocket-protector',
          type: metadata.type || 'json-data',
          timestamp: new Date().toISOString(),
          ...metadata.keyvalues
        }
      };

      const pinataOptions = {
        cidVersion: 1,
        ...metadata.options
      };

      const requestBody = {
        pinataContent,
        pinataMetadata,
        pinataOptions
      };

      const response = await this.apiClient.post('/pinning/pinJSONToIPFS', requestBody);

      return {
        success: true,
        ipfsHash: response.data.IpfsHash,
        pinSize: response.data.PinSize,
        timestamp: response.data.Timestamp,
        url: `${PINATA_CONFIG.gatewayUrl}/${response.data.IpfsHash}`,
        metadata: pinataMetadata
      };
    } catch (error) {
      console.error('Failed to pin JSON to IPFS:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message
      };
    }
  }

  // Get pinned files list
  async getPinnedFiles(options = {}) {
    try {
      const params = {
        status: 'pinned',
        pageLimit: options.limit || 10,
        pageOffset: options.offset || 0,
        ...options.filters
      };

      const response = await this.apiClient.get('/data/pinList', { params });

      return {
        success: true,
        files: response.data.rows.map(file => ({
          ipfsHash: file.ipfs_pin_hash,
          size: file.size,
          timestamp: file.date_pinned,
          name: file.metadata?.name,
          keyvalues: file.metadata?.keyvalues,
          url: `${PINATA_CONFIG.gatewayUrl}/${file.ipfs_pin_hash}`
        })),
        count: response.data.count
      };
    } catch (error) {
      console.error('Failed to get pinned files:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message
      };
    }
  }

  // Unpin file from IPFS
  async unpinFile(ipfsHash) {
    try {
      await this.apiClient.delete(`/pinning/unpin/${ipfsHash}`);
      return { success: true };
    } catch (error) {
      console.error('Failed to unpin file:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message
      };
    }
  }

  // Get file from IPFS
  async getFile(ipfsHash) {
    try {
      const response = await axios.get(`${PINATA_CONFIG.gatewayUrl}/${ipfsHash}`, {
        responseType: 'blob'
      });

      return {
        success: true,
        data: response.data,
        contentType: response.headers['content-type'],
        url: `${PINATA_CONFIG.gatewayUrl}/${ipfsHash}`
      };
    } catch (error) {
      console.error('Failed to get file from IPFS:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get JSON data from IPFS
  async getJSON(ipfsHash) {
    try {
      const response = await axios.get(`${PINATA_CONFIG.gatewayUrl}/${ipfsHash}`);
      return {
        success: true,
        data: response.data,
        url: `${PINATA_CONFIG.gatewayUrl}/${ipfsHash}`
      };
    } catch (error) {
      console.error('Failed to get JSON from IPFS:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Update file metadata
  async updateMetadata(ipfsHash, metadata) {
    try {
      const requestBody = {
        ipfsPinHash: ipfsHash,
        name: metadata.name,
        keyvalues: metadata.keyvalues
      };

      const response = await this.apiClient.put('/pinning/hashMetadata', requestBody);

      return { success: true, data: response.data };
    } catch (error) {
      console.error('Failed to update metadata:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message
      };
    }
  }

  // Pin recording with encryption
  async pinRecording(recordingBlob, metadata = {}) {
    try {
      // Create file from blob
      const file = new File([recordingBlob], metadata.filename || 'recording.webm', {
        type: recordingBlob.type
      });

      // Pin to IPFS with recording-specific metadata
      const result = await this.pinFile(file, {
        name: metadata.filename || `recording-${Date.now()}`,
        type: 'recording',
        keyvalues: {
          recordingType: metadata.recordingType || 'audio',
          duration: metadata.duration || 0,
          location: metadata.location ? JSON.stringify(metadata.location) : null,
          timestamp: metadata.timestamp || new Date().toISOString(),
          userId: metadata.userId,
          encrypted: metadata.encrypted || false
        }
      });

      return result;
    } catch (error) {
      console.error('Failed to pin recording:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Pin encounter card data
  async pinEncounterCard(cardData, metadata = {}) {
    try {
      const result = await this.pinJSON(cardData, {
        name: metadata.name || `encounter-card-${Date.now()}`,
        type: 'encounter-card',
        keyvalues: {
          state: metadata.state,
          location: metadata.location ? JSON.stringify(metadata.location) : null,
          timestamp: metadata.timestamp || new Date().toISOString(),
          userId: metadata.userId,
          version: '1.0'
        }
      });

      return result;
    } catch (error) {
      console.error('Failed to pin encounter card:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get user's recordings
  async getUserRecordings(userId, options = {}) {
    try {
      const result = await this.getPinnedFiles({
        limit: options.limit || 50,
        offset: options.offset || 0,
        filters: {
          'metadata[keyvalues][userId]': userId,
          'metadata[keyvalues][type]': 'recording'
        }
      });

      return result;
    } catch (error) {
      console.error('Failed to get user recordings:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get user's encounter cards
  async getUserEncounterCards(userId, options = {}) {
    try {
      const result = await this.getPinnedFiles({
        limit: options.limit || 20,
        offset: options.offset || 0,
        filters: {
          'metadata[keyvalues][userId]': userId,
          'metadata[keyvalues][type]': 'encounter-card'
        }
      });

      return result;
    } catch (error) {
      console.error('Failed to get user encounter cards:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Generate shareable link
  generateShareableLink(ipfsHash, options = {}) {
    const baseUrl = options.customGateway || PINATA_CONFIG.gatewayUrl;
    return `${baseUrl}/${ipfsHash}`;
  }

  // Check if service is available
  async isAvailable() {
    try {
      const result = await this.testAuthentication();
      return result.success;
    } catch (error) {
      return false;
    }
  }

  // Get storage usage statistics
  async getStorageStats(userId) {
    try {
      const recordings = await this.getUserRecordings(userId);
      const encounterCards = await this.getUserEncounterCards(userId);

      if (!recordings.success || !encounterCards.success) {
        throw new Error('Failed to fetch storage data');
      }

      const totalFiles = recordings.files.length + encounterCards.files.length;
      const totalSize = [
        ...recordings.files,
        ...encounterCards.files
      ].reduce((sum, file) => sum + (file.size || 0), 0);

      return {
        success: true,
        stats: {
          totalFiles,
          totalSize,
          recordings: recordings.files.length,
          encounterCards: encounterCards.files.length,
          formattedSize: this.formatBytes(totalSize)
        }
      };
    } catch (error) {
      console.error('Failed to get storage stats:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Utility: Format bytes to human readable
  formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }
}

// Create singleton instance
const pinataService = new PinataService();

export default pinataService;

// Named exports
export {
  pinataService,
  PINATA_CONFIG
};

