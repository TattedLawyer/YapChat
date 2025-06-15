# Deployment Guide

This guide covers deploying the AI Companion application to various platforms.

## 🚀 Quick Deploy Options

### Vercel (Recommended)
The easiest way to deploy this Next.js application.

1. **Connect to Vercel**
   ```bash
   npm install -g vercel
   vercel login
   vercel
   ```

2. **Configure Project**
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

3. **Environment Variables**
   ```
   NODE_ENV=production
   ```

4. **Deploy**
   ```bash
   vercel --prod
   ```

### Netlify
Alternative deployment platform with great Next.js support.

1. **Build Settings**
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Node version: 18+

2. **Deploy**
   - Connect GitHub repository
   - Auto-deploy on push to main branch

### Docker Deployment

1. **Create Dockerfile**
   ```dockerfile
   FROM node:18-alpine AS base
   
   # Install dependencies only when needed
   FROM base AS deps
   RUN apk add --no-cache libc6-compat
   WORKDIR /app
   
   COPY frontend/package.json frontend/package-lock.json* ./
   RUN npm ci
   
   # Rebuild the source code only when needed
   FROM base AS builder
   WORKDIR /app
   COPY --from=deps /app/node_modules ./node_modules
   COPY frontend/ .
   
   RUN npm run build
   
   # Production image, copy all the files and run next
   FROM base AS runner
   WORKDIR /app
   
   ENV NODE_ENV production
   
   RUN addgroup --system --gid 1001 nodejs
   RUN adduser --system --uid 1001 nextjs
   
   COPY --from=builder /app/public ./public
   COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
   COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
   
   USER nextjs
   
   EXPOSE 3000
   
   ENV PORT 3000
   ENV HOSTNAME "0.0.0.0"
   
   CMD ["node", "server.js"]
   ```

2. **Build and Run**
   ```bash
   docker build -t ai-companion .
   docker run -p 3000:3000 ai-companion
   ```

## 🔧 Production Configuration

### Next.js Configuration
Update `next.config.js` for production:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    appDir: true,
  },
  images: {
    domains: [],
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
}

module.exports = nextConfig
```

### Performance Optimizations

1. **Enable Compression**
   ```javascript
   // next.config.js
   const nextConfig = {
     compress: true,
     poweredByHeader: false,
   }
   ```

2. **Image Optimization**
   ```javascript
   // next.config.js
   const nextConfig = {
     images: {
       formats: ['image/webp'],
       deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
     },
   }
   ```

3. **Bundle Analysis**
   ```bash
   npm install --save-dev @next/bundle-analyzer
   ```

## 🌐 Domain Configuration

### Custom Domain Setup

1. **DNS Configuration**
   ```
   Type: CNAME
   Name: www
   Value: your-app.vercel.app
   
   Type: A
   Name: @
   Value: 76.76.19.61 (Vercel IP)
   ```

2. **SSL Certificate**
   - Automatic with Vercel/Netlify
   - Manual setup for custom servers

### CDN Configuration
For better global performance:

1. **Cloudflare Setup**
   - Add domain to Cloudflare
   - Enable caching rules
   - Configure security settings

2. **AWS CloudFront**
   - Create distribution
   - Configure origin settings
   - Set up custom error pages

## 📊 Monitoring & Analytics

### Performance Monitoring

1. **Vercel Analytics**
   ```bash
   npm install @vercel/analytics
   ```

2. **Google Analytics**
   ```javascript
   // Add to _app.tsx
   import { Analytics } from '@vercel/analytics/react'
   
   export default function App({ Component, pageProps }) {
     return (
       <>
         <Component {...pageProps} />
         <Analytics />
       </>
     )
   }
   ```

### Error Tracking

1. **Sentry Integration**
   ```bash
   npm install @sentry/nextjs
   ```

2. **Configuration**
   ```javascript
   // sentry.client.config.js
   import * as Sentry from '@sentry/nextjs'
   
   Sentry.init({
     dsn: process.env.SENTRY_DSN,
     tracesSampleRate: 1.0,
   })
   ```

## 🔒 Security Configuration

### Headers Configuration
```javascript
// next.config.js
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ]
  },
}
```

### Environment Variables
```bash
# Production environment variables
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

## 🚀 CI/CD Pipeline

### GitHub Actions
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json
      
      - name: Install dependencies
        run: |
          cd frontend
          npm ci
      
      - name: Build application
        run: |
          cd frontend
          npm run build
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
          working-directory: frontend
```

## 📱 Mobile Optimization

### PWA Configuration
```javascript
// next.config.js
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
})

module.exports = withPWA({
  // your next config
})
```

### Manifest File
```json
// public/manifest.json
{
  "name": "AI Companion",
  "short_name": "AI Companion",
  "description": "Your Personal AI Friend",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#000000",
  "icons": [
    {
      "src": "/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

## 🔍 Health Checks

### Basic Health Check
```javascript
// pages/api/health.js
export default function handler(req, res) {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version,
  })
}
```

### Advanced Monitoring
```javascript
// pages/api/status.js
export default function handler(req, res) {
  const status = {
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  }
  
  res.status(200).json(status)
}
```

## 🎯 Deployment Checklist

### Pre-Deployment
- [ ] All tests passing
- [ ] Build completes successfully
- [ ] Performance audit completed
- [ ] Security headers configured
- [ ] Environment variables set
- [ ] Error tracking configured
- [ ] Analytics implemented

### Post-Deployment
- [ ] Health checks passing
- [ ] All features functional
- [ ] Performance metrics acceptable
- [ ] Error rates within limits
- [ ] SSL certificate valid
- [ ] CDN configured
- [ ] Monitoring alerts set up

## 🆘 Troubleshooting

### Common Issues

**Build Failures**
```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

**Memory Issues**
```bash
# Increase Node.js memory limit
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

**Deployment Timeouts**
- Check build logs for errors
- Verify all dependencies are installed
- Ensure environment variables are set

### Support Resources
- [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)
- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com)

---

**Status**: Ready for production deployment ✅
**Last Updated**: December 2024 