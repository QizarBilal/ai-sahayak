# 🚀 AI-SAHAYAK Quick Start Guide

Get AI-Sahayak running in 5 minutes!

---

## ⚡ Ultra-Quick Start (Copy & Paste)

```bash
# 1. Clone and enter directory
git clone <your-repo-url>
cd AI-Sahayak

# 2. Install dependencies
npm install

# 3. Set up environment
cat > .env << EOF
DATABASE_URL="postgresql://neondb_owner:npg_yEMPGJeKzGYu@ep-cold-shadow-a5tz6fxp.us-east-2.aws.neon.tech/neondb?sslmode=require"
GEMINI_API_KEY=AIzaSyBRz26iZ-ycGOTWk2xq1jMYfcWliI5poFg
BYTEZ_API_KEY=6209d315f9cebbde00b814ef01448166
JWT_SECRET=ai-sahayak-secret-key
PORT=5000
NODE_ENV=development
EOF

# 4. Push database schema
npm run db:push

# 5. Start the app
npm run dev
```

**Open browser:** http://localhost:5000 🎉

---

## 📋 Prerequisites

- **Node.js 18+** ([Download](https://nodejs.org))
- **npm or pnpm** (comes with Node.js)
- **Web browser** (Chrome recommended for best voice support)

That's it! Database and API keys are pre-configured for demo.

---

## 🎯 First Steps After Launch

### 1. Test Voice Assistant
1. Click "Voice Assistant" in sidebar
2. Click the **big blue microphone button**
3. Say: *"What is the PM-KISAN scheme?"*
4. Listen to the AI response!

### 2. Try Chat
1. Click "Chat Assistant"
2. Type or speak a question
3. Get instant AI responses

### 3. Check Eligibility
1. Click "Eligibility Checker"
2. Fill in your details
3. See if you're eligible for schemes!

---

## 🔧 Customization

### Use Your Own API Keys

Edit `.env` file:

```env
# Get your own Gemini key: https://makersuite.google.com/app/apikey
GEMINI_API_KEY=your_key_here

# Get your own Bytez key: https://bytez.io
BYTEZ_API_KEY=your_key_here
```

### Use Your Own Database

Replace `DATABASE_URL` in `.env`:

```env
DATABASE_URL="postgresql://user:pass@localhost:5432/ai_sahayak"
```

Then run:
```bash
npm run db:push
```

---

## 🎨 Change Theme

Click the **sun/moon icon** in top-right corner to toggle dark mode!

---

## 📱 Test on Mobile

1. Find your local IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
2. Open on mobile: `http://your-ip:5000`
3. Make sure both devices are on same network

---

## 🐛 Troubleshooting

### "Cannot connect to database"
**Fix:** Use the pre-configured Neon database URL provided in the quick start

### "Microphone not working"
**Fix:** 
- Click the lock icon in browser address bar
- Allow microphone permissions
- Use HTTPS in production (localhost HTTP is fine for dev)

### "Module not found" errors
**Fix:** 
```bash
rm -rf node_modules package-lock.json
npm install
```

### Port 5000 already in use
**Fix:** Change PORT in `.env` to `3000` or any free port

---

## 📚 Next Steps

- Read [README.md](README.md) for full documentation
- Check [API.md](API.md) for API reference
- See [TESTING.md](TESTING.md) for testing guide
- Review [DEPLOYMENT.md](DEPLOYMENT.md) for production deployment

---

## 🎓 Learn the Tech Stack

- **Frontend:** React + TypeScript + TailwindCSS
- **Backend:** Express + TypeScript
- **Database:** PostgreSQL (Drizzle ORM)
- **AI:** Gemini 1.5 Pro
- **Voice:** Bytez (Whisper + Bark + MusicGen)

---

## 🤝 Need Help?

- Check existing issues on GitHub
- Review documentation files
- Test with provided demo credentials first

---

## ✅ Quick Checklist

- [ ] Node.js 18+ installed
- [ ] Dependencies installed (`npm install`)
- [ ] `.env` file created
- [ ] Database schema pushed (`npm run db:push`)
- [ ] Dev server running (`npm run dev`)
- [ ] Browser opened to localhost:5000
- [ ] Microphone permissions granted
- [ ] Voice test successful

---

**You're all set! Enjoy AI-Sahayak! 🎉**

---

## 🚀 Production Deployment

When ready to deploy:

```bash
# Build for production
npm run build

# Start production server
npm start
```

Or deploy to:
- **Replit** - Click "Run" (zero config!)
- **Railway** - One-click deploy
- **Vercel** - Frontend deployment
- **Render** - Full-stack deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

---

**Quick Start Version:** 1.0.0  
**Last Updated:** November 15, 2025
