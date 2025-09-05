// useEncounterCard Hook - Manages encounter card generation and sharing
import { useState, useCallback } from 'react';
import openaiService from '../services/openaiService';
import { useIPFSStorage } from './useIPFSStorage';
import { useSubscription } from './useSubscription';
import html2canvas from 'html2canvas';

export const useEncounterCard = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { uploadEncounterCard } = useIPFSStorage();
  const { hasFeature } = useSubscription();

  // Generate encounter card using AI
  const generateCard = useCallback(async (params) => {
    if (!hasFeature('encounterCards')) {
      return {
        success: false,
        error: 'Encounter cards require premium subscription'
      };
    }

    try {
      setLoading(true);
      setError(null);

      // Check if OpenAI service is available
      if (!openaiService.isAvailable()) {
        // Fallback to template-based generation
        return generateTemplateCard(params);
      }

      const result = await openaiService.generateEncounterCard(params);

      if (result.success) {
        return {
          success: true,
          card: result.encounterCard
        };
      } else {
        // Fallback to template if AI fails
        return generateTemplateCard(params);
      }
    } catch (err) {
      setError(err.message);
      // Fallback to template on error
      return generateTemplateCard(params);
    } finally {
      setLoading(false);
    }
  }, [hasFeature]);

  // Generate template-based card (fallback)
  const generateTemplateCard = useCallback((params) => {
    const { state, situation, location, language = 'en' } = params;

    const templates = {
      en: {
        title: `Legal Rights Card - ${state}`,
        rights: [
          "You have the right to remain silent",
          "You have the right to refuse searches without a warrant",
          "You have the right to an attorney",
          "You have the right to know why you're being stopped"
        ],
        phrases: [
          "I invoke my right to remain silent",
          "I do not consent to any searches",
          "Am I free to leave?",
          "I want to speak with an attorney"
        ],
        stateSpecific: [
          `This card is specific to ${state} laws`,
          "Consult local legal resources for detailed information",
          "Laws may vary by jurisdiction within the state"
        ],
        disclaimer: "This information is for educational purposes only and does not constitute legal advice. Consult with a qualified attorney for specific legal guidance."
      },
      es: {
        title: `Tarjeta de Derechos Legales - ${state}`,
        rights: [
          "Tienes derecho a permanecer en silencio",
          "Tienes derecho a rechazar registros sin una orden judicial",
          "Tienes derecho a un abogado",
          "Tienes derecho a saber por qué te están deteniendo"
        ],
        phrases: [
          "Invoco mi derecho a permanecer en silencio",
          "No consiento ningún registro",
          "¿Soy libre de irme?",
          "Quiero hablar con un abogado"
        ],
        stateSpecific: [
          `Esta tarjeta es específica para las leyes de ${state}`,
          "Consulta recursos legales locales para información detallada",
          "Las leyes pueden variar por jurisdicción dentro del estado"
        ],
        disclaimer: "Esta información es solo para fines educativos y no constituye asesoramiento legal. Consulta con un abogado calificado para orientación legal específica."
      }
    };

    const template = templates[language] || templates.en;

    return {
      success: true,
      card: {
        id: `card-${Date.now()}`,
        title: template.title,
        state,
        situation,
        location,
        language,
        rights: template.rights,
        phrases: template.phrases,
        stateSpecific: template.stateSpecific,
        disclaimer: template.disclaimer,
        timestamp: new Date().toISOString(),
        generatedBy: 'template'
      }
    };
  }, []);

  // Share encounter card
  const shareCard = useCallback(async (cardData) => {
    try {
      setLoading(true);
      setError(null);

      // Upload to IPFS for permanent storage
      const uploadResult = await uploadEncounterCard(cardData, {
        name: cardData.title,
        state: cardData.state,
        location: cardData.location,
        timestamp: cardData.timestamp,
        userId: 'current-user' // In real app, get from user context
      });

      if (uploadResult.success) {
        // Use Web Share API if available
        if (navigator.share) {
          await navigator.share({
            title: cardData.title,
            text: `Legal rights card for ${cardData.state}`,
            url: uploadResult.url
          });
        } else {
          // Fallback: copy link to clipboard
          await navigator.clipboard.writeText(uploadResult.url);
          return {
            success: true,
            message: 'Link copied to clipboard',
            url: uploadResult.url
          };
        }

        return {
          success: true,
          url: uploadResult.url
        };
      } else {
        throw new Error(uploadResult.error);
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
  }, [uploadEncounterCard]);

  // Download encounter card as image
  const downloadCard = useCallback(async (cardElement, filename = 'encounter-card') => {
    try {
      setLoading(true);
      setError(null);

      if (!cardElement) {
        throw new Error('Card element not found');
      }

      // Use html2canvas to convert card to image
      const canvas = await html2canvas(cardElement, {
        backgroundColor: '#ffffff',
        scale: 2, // Higher resolution
        useCORS: true,
        allowTaint: true
      });

      // Create download link
      const link = document.createElement('a');
      link.download = `${filename}.png`;
      link.href = canvas.toDataURL('image/png');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      return { success: true };
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

  // Save card locally
  const saveCardLocally = useCallback((cardData) => {
    try {
      const savedCards = JSON.parse(localStorage.getItem('pocket-protector-encounter-cards') || '[]');
      const updatedCards = [...savedCards, cardData];
      localStorage.setItem('pocket-protector-encounter-cards', JSON.stringify(updatedCards));
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: 'Failed to save card locally'
      };
    }
  }, []);

  // Get saved cards
  const getSavedCards = useCallback(() => {
    try {
      const savedCards = JSON.parse(localStorage.getItem('pocket-protector-encounter-cards') || '[]');
      return {
        success: true,
        cards: savedCards
      };
    } catch (err) {
      return {
        success: false,
        error: 'Failed to retrieve saved cards',
        cards: []
      };
    }
  }, []);

  // Delete saved card
  const deleteSavedCard = useCallback((cardId) => {
    try {
      const savedCards = JSON.parse(localStorage.getItem('pocket-protector-encounter-cards') || '[]');
      const updatedCards = savedCards.filter(card => card.id !== cardId);
      localStorage.setItem('pocket-protector-encounter-cards', JSON.stringify(updatedCards));
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: 'Failed to delete card'
      };
    }
  }, []);

  // Generate QR code for card sharing
  const generateQRCode = useCallback(async (cardUrl) => {
    try {
      // In a real app, you'd use a QR code library
      // For now, we'll use a simple QR code service
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(cardUrl)}`;
      
      return {
        success: true,
        qrCodeUrl: qrUrl
      };
    } catch (err) {
      return {
        success: false,
        error: 'Failed to generate QR code'
      };
    }
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    generateCard,
    shareCard,
    downloadCard,
    saveCardLocally,
    getSavedCards,
    deleteSavedCard,
    generateQRCode,
    clearError
  };
};

// Hook for managing encounter card templates
export const useEncounterCardTemplates = () => {
  const getTemplatesBySituation = useCallback((situation) => {
    const templates = {
      'traffic-stop': {
        title: 'Traffic Stop Rights',
        situations: ['Pulled over', 'License check', 'Sobriety checkpoint'],
        keyRights: [
          'Keep hands visible on steering wheel',
          'Provide license, registration, insurance when requested',
          'You may ask if you are free to leave',
          'Field sobriety tests may be refused (check state laws)'
        ]
      },
      'street-encounter': {
        title: 'Street Encounter Rights',
        situations: ['Approached by officer', 'Stop and frisk', 'Questioning'],
        keyRights: [
          'You are not required to answer questions',
          'Ask "Am I free to leave?"',
          'You may refuse consent to search',
          'Stay calm and keep hands visible'
        ]
      },
      'home-visit': {
        title: 'Home Visit Rights',
        situations: ['Police at door', 'Warrant service', 'Welfare check'],
        keyRights: [
          'You do not have to open the door without a warrant',
          'Ask to see the warrant through the door',
          'You may speak through the door',
          'Do not consent to entry without a warrant'
        ]
      }
    };

    return templates[situation] || templates['street-encounter'];
  }, []);

  return {
    getTemplatesBySituation
  };
};

export default useEncounterCard;

