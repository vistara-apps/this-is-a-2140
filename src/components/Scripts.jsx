import React, { useState } from 'react';
import { Copy, Volume2, Search } from 'lucide-react';
import ScriptButton from './ScriptButton';

const SCRIPT_CATEGORIES = {
  traffic: {
    title: 'Traffic Stops',
    scripts: {
      en: [
        "I invoke my right to remain silent.",
        "I do not consent to any searches.",
        "Am I free to leave?",
        "I would like to speak with an attorney.",
        "I am not discussing my day.",
        "I don't answer questions."
      ],
      es: [
        "Invoco mi derecho a permanecer en silencio.",
        "No consiento a ningún registro.",
        "¿Soy libre de irme?",
        "Me gustaría hablar con un abogado.",
        "No voy a hablar de mi día.",
        "No respondo preguntas."
      ]
    }
  },
  encounter: {
    title: 'Police Encounters',
    scripts: {
      en: [
        "I am exercising my right to remain silent.",
        "I do not consent to a search.",
        "I want to speak to a lawyer.",
        "Am I being detained or am I free to go?",
        "I invoke my Fifth Amendment rights.",
        "I am not answering any questions."
      ],
      es: [
        "Estoy ejerciendo mi derecho a permanecer en silencio.",
        "No consiento a un registro.",
        "Quiero hablar con un abogado.",
        "¿Estoy detenido o soy libre de irme?",
        "Invoco mis derechos de la Quinta Enmienda.",
        "No voy a responder ninguna pregunta."
      ]
    }
  },
  detention: {
    title: 'If Detained',
    scripts: {
      en: [
        "I invoke my right to remain silent and I want a lawyer.",
        "I do not waive any of my rights.",
        "I want to make a phone call.",
        "I do not consent to any search of my person or belongings.",
        "I request to speak with my attorney before answering questions.",
        "I am invoking my Miranda rights."
      ],
      es: [
        "Invoco mi derecho a permanecer en silencio y quiero un abogado.",
        "No renuncio a ninguno de mis derechos.",
        "Quiero hacer una llamada telefónica.",
        "No consiento a ningún registro de mi persona o pertenencias.",
        "Solicito hablar con mi abogado antes de responder preguntas.",
        "Estoy invocando mis derechos Miranda."
      ]
    }
  }
};

const Scripts = ({ user }) => {
  const [selectedCategory, setSelectedCategory] = useState('traffic');
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedScript, setCopiedScript] = useState(null);

  const language = user?.preferredLanguage || 'en';

  const handleCopy = async (script, index) => {
    try {
      await navigator.clipboard.writeText(script);
      setCopiedScript(index);
      setTimeout(() => setCopiedScript(null), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const handleSpeak = (script) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(script);
      utterance.lang = language === 'es' ? 'es-ES' : 'en-US';
      speechSynthesis.speak(utterance);
    }
  };

  const filteredScripts = SCRIPT_CATEGORIES[selectedCategory].scripts[language].filter(script =>
    script.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Scripted Responses</h1>
        <p className="text-gray-300">
          Pre-written phrases to protect your rights during interactions
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search scripts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-surface text-white rounded-md border border-gray-700 focus:border-primary focus:outline-none"
        />
      </div>

      {/* Category Tabs */}
      <div className="flex overflow-x-auto mb-6 space-x-1">
        {Object.entries(SCRIPT_CATEGORIES).map(([key, category]) => (
          <button
            key={key}
            onClick={() => setSelectedCategory(key)}
            className={`flex-shrink-0 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              selectedCategory === key
                ? 'bg-primary text-white'
                : 'bg-surface text-gray-400 hover:text-white'
            }`}
          >
            {category.title}
          </button>
        ))}
      </div>

      {/* Scripts */}
      <div className="space-y-3">
        {filteredScripts.map((script, index) => (
          <div key={index} className="bg-surface rounded-lg p-4 border border-gray-700">
            <div className="flex items-start justify-between">
              <p className="text-white flex-1 mr-4">{script}</p>
              <div className="flex space-x-2 flex-shrink-0">
                <ScriptButton
                  variant="secondary"
                  onClick={() => handleCopy(script, index)}
                  className="p-2"
                >
                  <Copy className={`w-4 h-4 ${copiedScript === index ? 'text-accent' : 'text-gray-400'}`} />
                </ScriptButton>
                <ScriptButton
                  variant="secondary"
                  onClick={() => handleSpeak(script)}
                  className="p-2"
                >
                  <Volume2 className="w-4 h-4 text-gray-400" />
                </ScriptButton>
              </div>
            </div>
            {copiedScript === index && (
              <p className="text-accent text-xs mt-2">Copied to clipboard!</p>
            )}
          </div>
        ))}
      </div>

      {filteredScripts.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-400">No scripts found matching your search.</p>
        </div>
      )}

      {/* Important Notice */}
      <div className="mt-8 bg-yellow-900/20 border border-yellow-700 rounded-lg p-4">
        <h3 className="text-yellow-200 font-semibold mb-2">Important Guidelines</h3>
        <ul className="text-yellow-200 text-sm space-y-1">
          <li>• Remain calm and polite when using these phrases</li>
          <li>• Do not resist physically, even if you believe your rights are violated</li>
          <li>• These scripts assert your constitutional rights</li>
          <li>• Document the interaction when possible</li>
        </ul>
      </div>
    </div>
  );
};

export default Scripts;