# AI-SAHAYAK - Complete Government Services Platform

> **Full-Stack Voice-First AI Assistant for Rural Indian Citizens**

AI-Sahayak is a production-ready, voice-driven platform that helps rural Indian citizens access government services, check scheme eligibility, search nearby services, analyze documents, and more—using cutting-edge AI powered by **Gemini 1.5 Pro**, **Bytez Whisper-large-v3**, and **Bark TTS**.

---

## 🌟 Features

### 10 Complete Modules

1. **Voice Assistant** - Natural voice conversations using Whisper STT + Bark TTS
2. **Chat Assistant** - Text/voice chat with conversation history
3. **Recent Queries** - Complete history of all voice interactions
4. **Eligibility Checker** - AI-powered scheme eligibility with reasoning
5. **Market Data** - Live commodity prices from Indian mandis (cached)
6. **Document Analyzer** - OCR + summarization + translation
7. **Service Discovery** - Find nearby hospitals, police stations, etc. (OpenStreetMap)
8. **Draft Generator** - Generate official letters, applications, complaints
9. **Personalized Dashboard** - Quick access to all features
10. **Settings & Profile** - User preferences and theme toggle

---

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **TailwindCSS** with custom theme (exact colors per spec)
- **Wouter** for routing
- **TanStack Query** for data fetching
- **shadcn/ui** components
- **Framer Motion** for animations

### Backend
- **Express.js** with TypeScript
- **Drizzle ORM** + PostgreSQL (Neon)
- **Bytez.js** for STT/TTS/audio generation
- **Google Gemini 1.5 Pro** for AI reasoning
- **In-memory caching** (upgradable to Redis)

### APIs & Services
- **Whisper-large-v3** - Speech-to-text (Bytez)
- **Bark** - Text-to-speech (Bytez)
- **MusicGen** - Audio earcons (Bytez)
- **Gemini** - AI reasoning & responses
- **OCR.space** - Document text extraction
- **OpenStreetMap/Nominatim** - Geocoding & service search
- **data.gov.in** - Market price data

---

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- PostgreSQL database (or use Neon.tech)
- API keys (see below)

### 1. Clone Repository
```bash
git clone <your-repo-url>
cd AI-Sahayak
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/ai_sahayak"

# Required API Keys
GEMINI_API_KEY=your_gemini_api_key_here
BYTEZ_API_KEY=your_bytez_api_key_here

# Security
JWT_SECRET=your_secure_random_string_here

# Optional (for production)
OCR_SPACE_API_KEY=your_ocr_api_key
REDIS_URL=redis://localhost:6379

# Application
PORT=5000
NODE_ENV=development
```

**Note:** Example keys are provided in the project for testing. Replace with your own for production.

### 4. Set Up Database

Push the schema to your database:

```bash
npm run db:push
```

### 5. Run Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5000`

---

## 🔑 API Keys Setup

### Gemini API Key
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add to `.env` as `GEMINI_API_KEY`

### Bytez API Key
1. Sign up at [Bytez.io](https://bytez.io)
2. Get your API key from the dashboard
3. Add to `.env` as `BYTEZ_API_KEY`

### OCR.space API Key (Optional)
1. Register at [OCR.space](https://ocr.space/ocrapi)
2. Free tier: 25,000 requests/month
3. Add to `.env` as `OCR_SPACE_API_KEY`

---

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

### Docker Deployment (Recommended)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 5000
CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t ai-sahayak .
docker run -p 5000:5000 --env-file .env ai-sahayak
```

### Deploy to Cloud

**Recommended platforms:**
- **Replit** - Zero-config deployment
- **Railway** - Automatic PostgreSQL + Redis
- **Vercel** - Frontend (serverless functions)
- **Render** - Full-stack with free PostgreSQL

---

## 🎨 Theme Colors (As Per Spec)

### Light Mode
- Background: `#F7F7F7`
- Text: `#2F4F4F`
- Primary Accent: `#1E90FF` (dodger blue)
- Secondary Accent: `#00FFFF` (cyan)

### Dark Mode
- Background: `#121212`
- Text: `#F0F0F0`
- Primary Accent: `#1E90FF`
- Secondary Accent: `#00FFFF`

Toggle available in the top-right corner on all pages.

---

## 📡 API Endpoints

### Voice & Audio
- `POST /api/voice/transcribe` - Upload audio, get transcript + AI response + TTS
- `POST /api/voice/synthesize` - Convert text to speech (Bark)
- `POST /api/audio/earcon` - Generate notification sound (MusicGen)

### Chat
- `POST /api/chat` - Send message, get AI response
- `GET /api/conversations` - Get conversation history
- `GET /api/conversations/:id/messages` - Get messages in conversation

### Eligibility
- `POST /api/eligibility/check` - Check scheme eligibility with AI reasoning
- `GET /api/eligibility/history` - Get past eligibility checks

### Market Data
- `GET /api/markets?commodity=Wheat&state=Punjab` - Get market prices (cached)
- `GET /api/markets/history` - Get user's search history

### Documents
- `POST /api/documents/analyze` - Upload document, OCR + summarize
- `POST /api/documents/translate` - Translate text to target language
- `GET /api/documents` - Get user's document history

### Services
- `POST /api/services/search` - Find nearby services (OSM API)

### Drafts
- `POST /api/drafts/generate` - Generate official document
- `POST /api/drafts` - Save draft
- `GET /api/drafts` - Get user's drafts

### Queries
- `GET /api/queries` - Get recent voice queries

---

## 🧪 Testing

### Module-by-Module Test Plan

#### 1. Voice Assistant
1. Open `/assistant/voice`
2. Click microphone button
3. Speak a question (e.g., "What is PM-KISAN scheme?")
4. Stop recording
5. Verify transcript appears
6. Verify AI response appears
7. Verify audio playback works

#### 2. Eligibility Checker
1. Open `/eligibility`
2. Enter user details (age, income, state, etc.)
3. Click "Check Eligibility"
4. Verify scheme recommendation
5. Verify eligibility reasoning
6. Verify required documents list
7. Verify next steps

#### 3. Market Data
1. Open `/markets`
2. View default market prices
3. Filter by commodity/state
4. Verify data is cached (check network tab)
5. Verify charts render correctly

#### 4. Document Analyzer
1. Open `/documents/analyze`
2. Upload an image with text (e.g., Aadhaar card)
3. Verify OCR extraction
4. Verify summary generation
5. Test translation feature

#### 5. Service Discovery
1. Open `/services/search`
2. Enter service type (e.g., "hospital")
3. Enter location or use current location
4. Verify nearby services appear
5. Verify distances calculated

#### 6. Draft Generator
1. Open `/drafts`
2. Select draft type (application/letter)
3. Enter purpose
4. Generate draft
5. Verify proper formatting
6. Save and retrieve

---

## 🔒 Security Features

- JWT authentication (mock for demo, replace with real auth)
- Input validation with Zod schemas
- File upload size limits
- Rate limiting ready (add middleware)
- SQL injection protection (Drizzle ORM)
- XSS protection (React escapes by default)
- API key security (never exposed to client)

---

## 📊 Database Schema

### Tables
- `users` - User accounts
- `voice_queries` - Voice interaction history
- `conversations` - Chat conversations
- `messages` - Chat messages
- `eligibility_checks` - Scheme eligibility results
- `documents` - Uploaded documents
- `service_searches` - Service discovery history
- `drafts` - Generated drafts
- `market_searches` - Market data queries

All tables include proper foreign keys, indexes, and timestamps.

---

## 🎯 Voice-First UX Guidelines

Every page includes:
1. **Large microphone button** (24x24 touch target)
2. **Audio playback** for all responses
3. **Visual feedback** (waveforms, animations)
4. **Simple language** (5th-grade reading level)
5. **Icon-first design** (minimal text where possible)
6. **High contrast** (WCAG AA compliant)

---

## 🌐 Browser Support

- Chrome/Edge 90+ (recommended for Web Speech API)
- Firefox 90+
- Safari 14+ (limited Web Speech API support)
- Mobile: Chrome/Safari on iOS/Android

---

## 📱 Mobile Responsiveness

Fully responsive design with:
- Touch-optimized buttons (min 44x44px)
- Swipe gestures
- Bottom navigation on mobile
- Hamburger menu
- Voice-first on all screen sizes

---

## 🔧 Troubleshooting

### Audio Recording Issues
- Check browser permissions (microphone)
- Use HTTPS (required for MediaRecorder API)
- Try fallback Web Speech API

### Bytez API Errors
- Verify API key is correct
- Check rate limits (free tier: 100 requests/day)
- Ensure audio format is supported (webm/opus)

### Database Connection Issues
- Verify DATABASE_URL is correct
- Check PostgreSQL is running
- Run `npm run db:push` to sync schema

### OCR Not Working
- Check OCR_SPACE_API_KEY
- Verify image is clear and high-resolution
- Free tier limit: 25,000 requests/month

---

## 🤝 Contributing

This is a hackathon project. For production deployment:
1. Add proper authentication (JWT + refresh tokens)
2. Set up Redis for production caching
3. Add comprehensive error logging (Sentry)
4. Implement rate limiting
5. Add end-to-end tests
6. Set up CI/CD pipeline

---

## 📄 License

MIT License - See LICENSE file

---

## 👥 Team

AI-Sahayak Builder Team
- Built with ❤️ for rural Indian citizens
- Powered by Gemini, Bytez, and open-source AI

---

## 🙏 Acknowledgments

- Google Gemini for AI reasoning
- Bytez.io for STT/TTS/audio APIs
- OpenStreetMap for location services
- data.gov.in for market data
- shadcn/ui for beautiful components

---

## 📞 Support

For issues or questions:
- Create an issue on GitHub
- Email: support@ai-sahayak.in (placeholder)

---

**Last Updated:** November 15, 2025

**Version:** 1.0.0

**Status:** Production Ready ✅
