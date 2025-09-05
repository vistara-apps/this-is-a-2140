# Pocket Protector - Legal Rights Mobile App

A mobile-first web application providing instant, state-specific legal rights information and quick action tools for individuals interacting with law enforcement.

## 🚀 Features

### Core Features
- **State-Specific Legal Rights Guides**: Mobile-optimized legal information tailored to each state
- **Actionable Scripted Responses**: Pre-written phrases in English and Spanish
- **One-Tap Incident Recording**: Discreet audio/video recording functionality
- **Automated Alert & Share**: Emergency contact notification system
- **Shareable Encounter Card Generation**: AI-powered, location-based rights cards

### Premium Features
- **Multi-Language Support**: English and Spanish interface
- **Cloud Storage**: IPFS-based recording backup via Pinata
- **Advanced Scripts**: AI-generated contextual responses
- **Multiple State Access**: All 50 state legal guides
- **Encounter Cards**: Shareable legal rights summaries
- **Priority Support**: Enhanced customer service

## 🏗️ Architecture

### Frontend Stack
- **React 18**: Modern React with hooks and context
- **Tailwind CSS**: Utility-first styling with custom design system
- **Lucide React**: Consistent iconography
- **HTML2Canvas**: Encounter card image generation

### Backend Services
- **OpenAI API**: AI-powered content generation
- **Pinata API**: IPFS storage for recordings and cards
- **Stripe API**: Payment processing and subscription management

### State Management
- **React Context**: User and subscription state management
- **Local Storage**: Offline data persistence
- **Custom Hooks**: Reusable business logic

## 📱 User Interface

### Design System
```css
/* Color Palette */
--bg: hsl(220, 20%, 8%)        /* Dark background */
--surface: hsl(220, 20%, 12%)  /* Card surfaces */
--accent: hsl(170, 70%, 45%)   /* Teal accent */
--primary: hsl(230, 75%, 50%)  /* Blue primary */

/* Typography */
--display: text-4xl font-bold
--heading: text-2xl font-semibold
--body: text-base font-normal leading-6

/* Spacing & Layout */
--container: max-w-xl mx-auto px-4 py-6
--spacing-sm: 8px
--spacing-md: 12px
--spacing-lg: 20px
```

### Components
- **InteractiveGuideCard**: Expandable rights information
- **RecordButton**: Emergency recording interface
- **SubscriptionGate**: Premium feature access control
- **PaymentModal**: Stripe-powered subscription management
- **EncounterCardGenerator**: AI-powered card creation

## 🔐 Subscription System

### Tiers
```javascript
FREE: {
  price: 0,
  features: {
    stateGuides: 1,
    basicScripts: true,
    localRecording: true,
    languages: ['en']
  }
}

PREMIUM: {
  price: 4.99,
  features: {
    stateGuides: 'unlimited',
    cloudStorage: true,
    advancedScripts: true,
    languages: ['en', 'es'],
    encounterCards: true
  }
}
```

### Payment Processing
- **Stripe Integration**: Secure payment processing
- **Subscription Management**: Automated billing and renewals
- **Feature Gating**: Dynamic access control based on subscription status

## 📊 Data Management

### Legal Rights Database
Comprehensive state-specific legal information covering:
- Constitutional rights
- Traffic stop procedures
- Search and seizure laws
- Recording regulations
- Identification requirements

### Storage Solutions
- **Local Storage**: User preferences and offline data
- **IPFS (Pinata)**: Decentralized recording storage
- **Cloud Backup**: Automatic sync for premium users

## 🛠️ Development

### Prerequisites
```bash
Node.js 18+
npm or yarn
```

### Installation
```bash
# Clone repository
git clone https://github.com/vistara-apps/this-is-a-2140.git
cd this-is-a-2140

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
```

### Environment Variables
```env
REACT_APP_OPENAI_API_KEY=your_openai_key
REACT_APP_PINATA_API_KEY=your_pinata_key
REACT_APP_PINATA_SECRET_API_KEY=your_pinata_secret
REACT_APP_STRIPE_PUBLISHABLE_KEY=your_stripe_key
```

### Development Server
```bash
npm start
```

### Build for Production
```bash
npm run build
```

## 🧪 Testing

### Component Testing
```bash
npm test
```

### E2E Testing
```bash
npm run test:e2e
```

## 📦 Deployment

### Vercel (Recommended)
```bash
vercel --prod
```

### Docker
```bash
docker build -t pocket-protector .
docker run -p 3000:3000 pocket-protector
```

## 🔧 Configuration

### Tailwind CSS
Custom configuration with semantic design tokens:
```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        bg: 'hsl(220, 20%, 8%)',
        surface: 'hsl(220, 20%, 12%)',
        accent: 'hsl(170, 70%, 45%)',
        primary: 'hsl(230, 75%, 50%)'
      }
    }
  }
}
```

### API Integration
- **Rate Limiting**: Implemented for OpenAI API calls
- **Error Handling**: Comprehensive error boundaries
- **Fallback Systems**: Template-based content when AI unavailable

## 🚦 User Flows

### Onboarding
1. Welcome screen introduction
2. State selection for personalized content
3. Language preference (English/Spanish)
4. Feature overview and tutorial

### Rights Access
1. Dashboard quick action or navigation
2. State-specific rights display
3. Expandable sections for detailed information
4. Share functionality for important information

### Recording Flow
1. Emergency or planned recording initiation
2. Permission requests (microphone/camera)
3. Discreet recording interface
4. Local storage with cloud backup option

### Encounter Card Generation
1. Situation selection (traffic stop, street encounter, etc.)
2. AI-powered content generation
3. Customizable card layout
4. Share via link, download as image, or copy text

## 🔒 Security & Privacy

### Data Protection
- **Local-First**: Sensitive data stored locally when possible
- **Encryption**: IPFS uploads with optional encryption
- **No Tracking**: Privacy-focused analytics only

### Legal Compliance
- **GDPR Compliant**: User data control and deletion
- **CCPA Compliant**: California privacy rights
- **Legal Disclaimers**: Clear educational purpose statements

## 📈 Analytics & Monitoring

### User Metrics
- Feature usage tracking
- Subscription conversion rates
- Geographic usage patterns
- Error monitoring and reporting

### Performance Monitoring
- Core Web Vitals tracking
- API response time monitoring
- User experience metrics

## 🤝 Contributing

### Development Guidelines
1. Follow React best practices
2. Use TypeScript for new components
3. Maintain accessibility standards (WCAG 2.1)
4. Write comprehensive tests
5. Update documentation

### Code Style
```bash
# Linting
npm run lint

# Formatting
npm run format
```

## 📄 Legal

### Disclaimer
This application provides educational information about legal rights and does not constitute legal advice. Users should consult with qualified attorneys for specific legal guidance.

### License
MIT License - see LICENSE file for details

### Privacy Policy
Comprehensive privacy policy available at `/privacy`

### Terms of Service
Terms of service available at `/terms`

## 🆘 Support

### Documentation
- [User Guide](./docs/user-guide.md)
- [API Documentation](./docs/api.md)
- [Deployment Guide](./docs/deployment.md)

### Contact
- **Email**: support@pocketprotector.app
- **GitHub Issues**: For bug reports and feature requests
- **Discord**: Community support and discussions

## 🗺️ Roadmap

### Phase 1 (Current)
- ✅ Core functionality implementation
- ✅ Subscription system
- ✅ AI-powered features
- ✅ Cloud storage integration

### Phase 2 (Q2 2024)
- [ ] Mobile app (React Native)
- [ ] Offline mode enhancement
- [ ] Multi-language expansion
- [ ] Advanced analytics

### Phase 3 (Q3 2024)
- [ ] Legal professional network
- [ ] Real-time legal updates
- [ ] Community features
- [ ] API for third-party integrations

---

**Built with ❤️ for civil rights and digital privacy**

