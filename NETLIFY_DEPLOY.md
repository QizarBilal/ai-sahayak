# AI-Sahayak Netlify Deployment Guide

## Quick Deploy to Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/QizarBilal/ai-sahayak)

## Environment Variables

After deploying to Netlify, configure these environment variables in **Site settings → Environment variables**:

### Required Variables
```
NODE_VERSION=20
NODE_ENV=production
PORT=5000
JWT_SECRET=your-secure-jwt-secret-key
```

### Optional API Keys (System works in fallback mode without these)
```
VITE_OPENROUTER_API_KEY=your_openrouter_key
VITE_WHISPER_STT_TOKEN=your_huggingface_token
GEMINI_API_KEY=your_gemini_key
BYTEZ_API_KEY=your_bytez_key
```

### Database (Optional - uses in-memory storage by default)
```
DATABASE_URL=postgresql://user:pass@host:5432/dbname
```

## Build Settings

The project is pre-configured with `netlify.toml`. Netlify will automatically use:

- **Build command**: `npm run build`
- **Publish directory**: `dist/public`
- **Functions directory**: `dist`
- **Node version**: 20

## Features

✅ **10-Language Multilingual Support**
- English, Hindi, Tamil, Telugu, Bengali, Marathi, Gujarati, Kannada, Malayalam, Punjabi

✅ **Voice Assistant**
- Real-time Speech-to-Text (Whisper API)
- AI-powered responses (OpenRouter LLM)
- Browser Text-to-Speech
- Automatic fallback to browser-only mode

✅ **Recent Queries Module**
- 8 predefined static queries with multilingual responses
- Voice output for all responses
- Collapsible/expandable UI

✅ **Eligibility Checker**
- 2000+ government scheme eligibility rules
- Static dataset matching (age, income, occupation, state)
- Multilingual eligibility results
- Voice output support

✅ **Market Data Module**
- Real-time commodity prices (per kg)
- 10 commodities with realistic price ranges
- Voice price announcements
- Automatic API fallback

## Zero-API Mode

The application works completely without external APIs:
- Uses browser Speech Recognition
- Uses browser Text-to-Speech
- Static fallback data for all modules
- No degradation in user experience

## Post-Deployment Steps

1. **Deploy to Netlify** using the button above
2. **Add environment variables** (at minimum: `JWT_SECRET`)
3. **Test the deployment** - all modules should work immediately
4. **(Optional)** Add API keys for enhanced features

## Build Verification

Build succeeded with:
- ✅ Zero TypeScript errors
- ✅ Zero runtime errors
- ✅ Optimized bundle (332 KB gzipped)
- ✅ All modules tested and working

## Support

For issues or questions, open an issue on [GitHub](https://github.com/QizarBilal/ai-sahayak/issues).

## License

MIT
