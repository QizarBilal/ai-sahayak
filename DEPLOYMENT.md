# AI-SAHAYAK Deployment Guide

Complete guide to deploy AI-Sahayak to various platforms.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Local Development](#local-development)
3. [Production Build](#production-build)
4. [Deploy to Replit](#deploy-to-replit)
5. [Deploy to Railway](#deploy-to-railway)
6. [Deploy to Vercel](#deploy-to-vercel)
7. [Deploy to Render](#deploy-to-render)
8. [Docker Deployment](#docker-deployment)
9. [Environment Variables](#environment-variables)
10. [Post-Deployment](#post-deployment)

---

## Prerequisites

- Node.js 18+
- PostgreSQL database (or managed service)
- API keys:
  - Gemini API key
  - Bytez API key
  - (Optional) OCR.space API key

---

## Local Development

1. **Clone repository:**
   ```bash
   git clone <your-repo>
   cd AI-Sahayak
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file:**
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/ai_sahayak"
   GEMINI_API_KEY=your_key_here
   BYTEZ_API_KEY=your_key_here
   JWT_SECRET=your_secret_here
   PORT=5000
   NODE_ENV=development
   ```

4. **Push database schema:**
   ```bash
   npm run db:push
   ```

5. **Start dev server:**
   ```bash
   npm run dev
   ```

6. **Open browser:**
   ```
   http://localhost:5000
   ```

---

## Production Build

Build the application for production:

```bash
npm run build
```

This creates:
- `dist/` - Compiled server code
- `dist/public/` - Static client files

Start production server:

```bash
npm start
```

---

## Deploy to Replit

### Option 1: Import from GitHub

1. Go to [Replit](https://replit.com)
2. Click "Create Repl"
3. Select "Import from GitHub"
4. Paste your repository URL
5. Replit will auto-detect the stack

### Option 2: Manual Setup

1. Create new Node.js Repl
2. Upload project files
3. Replit will detect `package.json` and install dependencies

### Configure Environment

1. Click "Secrets" (🔒 icon in sidebar)
2. Add environment variables:
   - `GEMINI_API_KEY`
   - `BYTEZ_API_KEY`
   - `DATABASE_URL`
   - `JWT_SECRET`

### Configure Database

Replit provides PostgreSQL addon:
1. Click "Add-ons" → PostgreSQL
2. Copy connection string to `DATABASE_URL`

### Run

Click "Run" button. Replit automatically:
- Installs dependencies
- Runs `npm run db:push`
- Starts the server

---

## Deploy to Railway

Railway provides one-click deployment with PostgreSQL included.

### Steps

1. **Sign up at [Railway](https://railway.app)**

2. **Create New Project:**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your AI-Sahayak repository

3. **Add PostgreSQL:**
   - Click "New" → "Database" → "PostgreSQL"
   - Railway auto-generates `DATABASE_URL`

4. **Set Environment Variables:**
   - Go to project settings → Variables
   - Add:
     ```
     GEMINI_API_KEY=your_key
     BYTEZ_API_KEY=your_key
     JWT_SECRET=your_secret
     NODE_ENV=production
     ```

5. **Configure Build:**
   Railway auto-detects build command from `package.json`:
   ```json
   "scripts": {
     "build": "vite build && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist"
   }
   ```

6. **Deploy:**
   - Railway automatically builds and deploys
   - Get your deployment URL

7. **Run Migrations:**
   - In Railway dashboard, open "Service" → "Deploy"
   - Check logs for any errors
   - Run `npm run db:push` from Railway CLI if needed

---

## Deploy to Vercel

Vercel is ideal for the frontend, but requires serverless functions for API.

### Steps

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login:**
   ```bash
   vercel login
   ```

3. **Create `vercel.json`:**
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "client/**",
         "use": "@vercel/static-build"
       }
     ],
     "routes": [
       {
         "src": "/api/(.*)",
         "dest": "/api/index.js"
       },
       {
         "src": "/(.*)",
         "dest": "/client/dist/$1"
       }
     ],
     "env": {
       "NODE_ENV": "production"
     }
   }
   ```

4. **Deploy:**
   ```bash
   vercel
   ```

5. **Set Environment Variables:**
   ```bash
   vercel env add GEMINI_API_KEY
   vercel env add BYTEZ_API_KEY
   vercel env add DATABASE_URL
   vercel env add JWT_SECRET
   ```

6. **Redeploy:**
   ```bash
   vercel --prod
   ```

**Note:** Vercel has serverless function size limits. Consider Railway/Render for full backend.

---

## Deploy to Render

Render provides free PostgreSQL and easy deployment.

### Steps

1. **Sign up at [Render](https://render.com)**

2. **Create PostgreSQL Database:**
   - Dashboard → New → PostgreSQL
   - Copy "Internal Database URL"

3. **Create Web Service:**
   - Dashboard → New → Web Service
   - Connect GitHub repository
   - Configure:
     ```
     Name: ai-sahayak
     Environment: Node
     Build Command: npm install && npm run build
     Start Command: npm start
     ```

4. **Set Environment Variables:**
   ```
   DATABASE_URL=<from step 2>
   GEMINI_API_KEY=your_key
   BYTEZ_API_KEY=your_key
   JWT_SECRET=your_secret
   NODE_ENV=production
   ```

5. **Deploy:**
   - Click "Create Web Service"
   - Render builds and deploys automatically

6. **Run Migrations:**
   - In Render dashboard, open "Shell"
   - Run: `npm run db:push`

---

## Docker Deployment

### Dockerfile

```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./
COPY vite.config.ts ./

# Install dependencies
RUN npm ci

# Copy source code
COPY client/ ./client/
COPY server/ ./server/
COPY shared/ ./shared/

# Build application
RUN npm run build

# Production image
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy built files
COPY --from=builder /app/dist ./dist

# Expose port
EXPOSE 5000

# Set environment to production
ENV NODE_ENV=production

# Start application
CMD ["node", "dist/index.js"]
```

### Build & Run

```bash
# Build image
docker build -t ai-sahayak .

# Run container
docker run -p 5000:5000 \
  -e DATABASE_URL="postgresql://..." \
  -e GEMINI_API_KEY="..." \
  -e BYTEZ_API_KEY="..." \
  -e JWT_SECRET="..." \
  ai-sahayak
```

### Docker Compose

```yaml
version: '3.8'

services:
  db:
    image: postgres:15
    environment:
      POSTGRES_DB: ai_sahayak
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  app:
    build: .
    ports:
      - "5000:5000"
    environment:
      DATABASE_URL: postgresql://user:password@db:5432/ai_sahayak
      GEMINI_API_KEY: ${GEMINI_API_KEY}
      BYTEZ_API_KEY: ${BYTEZ_API_KEY}
      JWT_SECRET: ${JWT_SECRET}
      NODE_ENV: production
    depends_on:
      - db

volumes:
  postgres_data:
```

Run:
```bash
docker-compose up -d
```

---

## Environment Variables

### Required

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `GEMINI_API_KEY` | Google Gemini API key | `AIzaSy...` |
| `BYTEZ_API_KEY` | Bytez API key | `6209d3...` |
| `JWT_SECRET` | Secret for JWT signing | Random 32+ char string |

### Optional

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment | `development` |
| `OCR_SPACE_API_KEY` | OCR.space API key | Uses default |
| `REDIS_URL` | Redis connection string | In-memory cache |

---

## Post-Deployment

### 1. Verify Deployment

- Visit your deployment URL
- Test voice recording
- Test all 10 modules
- Check browser console for errors

### 2. Run Database Migrations

```bash
npm run db:push
```

### 3. Health Check Endpoints

Add these to `server/routes.ts`:

```typescript
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.get("/api/health", async (req, res) => {
  try {
    await db.select().from(users).limit(1);
    res.json({ status: "ok", database: "connected" });
  } catch (error) {
    res.status(500).json({ status: "error", database: "disconnected" });
  }
});
```

### 4. Monitor Logs

- Check application logs for errors
- Monitor API response times
- Track Bytez/Gemini API usage

### 5. Set Up Monitoring (Optional)

- **Sentry** for error tracking
- **LogRocket** for session replay
- **Uptime Robot** for uptime monitoring

---

## Common Issues

### Issue: "Cannot connect to database"
**Solution:** Verify DATABASE_URL is correct and database is accessible

### Issue: "Bytez API errors"
**Solution:** Check API key, rate limits, and audio format

### Issue: "Microphone not working"
**Solution:** Ensure HTTPS deployment (required for MediaRecorder API)

### Issue: "Build fails on Vercel"
**Solution:** Use Railway/Render for full backend support

---

## Performance Optimization

1. **Enable caching:**
   - Use Redis for production
   - Cache market data (5-minute TTL)
   - Cache scheme eligibility rules

2. **Optimize assets:**
   - Enable gzip/brotli compression
   - Use CDN for static files
   - Lazy load components

3. **Database optimization:**
   - Add indexes on frequently queried fields
   - Use connection pooling
   - Regular VACUUM and ANALYZE

4. **API optimization:**
   - Batch API requests where possible
   - Implement rate limiting
   - Use API response caching

---

## Security Checklist

- [ ] Environment variables not in version control
- [ ] HTTPS enabled
- [ ] CORS configured properly
- [ ] Rate limiting enabled
- [ ] Input validation on all endpoints
- [ ] SQL injection protection (✅ Drizzle ORM)
- [ ] XSS protection (✅ React)
- [ ] File upload size limits
- [ ] API keys rotated regularly
- [ ] Database backups enabled

---

## Scaling Considerations

For high traffic:

1. **Load balancing:**
   - Use multiple app instances
   - Session store in Redis

2. **Database:**
   - Read replicas for queries
   - Connection pooling (pgBouncer)

3. **Caching:**
   - Redis for session and API cache
   - CDN for static assets

4. **Async processing:**
   - Queue system for heavy tasks (Bull/BullMQ)
   - Background workers for TTS generation

---

## Support

For deployment issues:
- Check platform-specific documentation
- Review error logs
- Test locally first
- Open GitHub issue

---

**Deployment Guide Version:** 1.0.0

**Last Updated:** November 15, 2025
