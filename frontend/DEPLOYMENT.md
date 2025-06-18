# 🚀 YapChat Production Deployment Guide

This guide covers deploying YapChat to production with optimal performance, security, and reliability.

## 📋 **Pre-Deployment Checklist**

### ✅ **System Requirements Met**
- [ ] Node.js 18+ installed
- [ ] Anthropic API key obtained and tested
- [ ] All tests passing (100% success rate)
- [ ] Memory system functional (100% recall accuracy)
- [ ] Performance metrics within targets (<5ms memory, <3s API)
- [ ] Security systems operational (age verification, content filtering)

### ✅ **Environment Configuration**
- [ ] Production environment variables configured
- [ ] API keys secured and rotated
- [ ] Domain and SSL certificate ready
- [ ] CDN configuration (if applicable)
- [ ] Monitoring and logging systems prepared

## 🌐 **Deployment Options**

### 🥇 **Option 1: Vercel (Recommended)**

**Why Vercel:**
- ✅ Seamless Next.js integration
- ✅ Automatic HTTPS and CDN
- ✅ Environment variable management
- ✅ Built-in performance monitoring
- ✅ Zero-downtime deployments

**Deployment Steps:**

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy from project directory**
   ```bash
   cd frontend
   vercel --prod
   ```

4. **Configure Environment Variables**
   ```bash
   # Via Vercel CLI
   vercel env add ANTHROPIC_API_KEY production
   
   # Or via Vercel Dashboard:
   # 1. Go to your project dashboard
   # 2. Settings → Environment Variables
   # 3. Add ANTHROPIC_API_KEY with your production key
   ```

5. **Configure Custom Domain (Optional)**
   ```bash
   vercel domains add yourdomain.com
   vercel alias set your-project-url.vercel.app yourdomain.com
   ```

### 🐳 **Option 2: Docker Deployment**

**Dockerfile:**
```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm ci --only=production

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the application
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

**Docker Compose (with monitoring):**
```yaml
version: '3.8'
services:
  yapchat:
    build: .
    ports:
      - "3000:3000"
    environment:
      - ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
      - NODE_ENV=production
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/memory?action=health"]
      interval: 30s
      timeout: 10s
      retries: 3
```

**Deploy with Docker:**
```bash
# Build and run
docker-compose up -d

# Check health
docker-compose logs yapchat
```

### ☁️ **Option 3: Cloud Platforms**

**AWS Amplify:**
```bash
# Install Amplify CLI
npm install -g @aws-amplify/cli

# Initialize project
amplify init

# Add hosting
amplify add hosting

# Deploy
amplify publish
```

**Railway:**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

**Netlify:**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build and deploy
npm run build
netlify deploy --prod --dir=.next
```

## 🔧 **Environment Configuration**

### 📝 **Required Environment Variables**

**Production `.env.local`:**
```bash
# Core Configuration
ANTHROPIC_API_KEY=sk-ant-api03-your-production-key
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://yourdomain.com

# Optional Performance Tuning
MEMORY_CACHE_SIZE=1000
MEMORY_CACHE_TTL=300000
API_TIMEOUT=30000

# Optional Monitoring
ENABLE_PERFORMANCE_MONITORING=true
LOG_LEVEL=info
```

### 🔐 **Security Best Practices**

1. **API Key Security**
   ```bash
   # Never commit API keys to version control
   # Use platform-specific secret management
   # Rotate keys regularly
   # Use different keys for staging/production
   ```

2. **Environment Isolation**
   ```bash
   # Development
   ANTHROPIC_API_KEY=sk-ant-api03-dev-key
   
   # Staging  
   ANTHROPIC_API_KEY=sk-ant-api03-staging-key
   
   # Production
   ANTHROPIC_API_KEY=sk-ant-api03-prod-key
   ```

3. **HTTPS Enforcement**
   ```javascript
   // next.config.js
   module.exports = {
     async headers() {
       return [
         {
           source: '/(.*)',
           headers: [
             {
               key: 'Strict-Transport-Security',
               value: 'max-age=31536000; includeSubDomains'
             }
           ]
         }
       ]
     }
   }
   ```

## 📊 **Performance Optimization**

### ⚡ **Next.js Optimization**

**next.config.js:**
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable compression
  compress: true,
  
  // Optimize images
  images: {
    domains: ['yourdomain.com'],
    formats: ['image/webp', 'image/avif'],
  },
  
  // Enable experimental features for performance
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['@anthropic-ai/sdk'],
  },
  
  // Bundle analyzer (development only)
  ...(process.env.ANALYZE === 'true' && {
    webpack: (config) => {
      config.plugins.push(new BundleAnalyzerPlugin())
      return config
    }
  })
}

module.exports = nextConfig
```

### 🚀 **Memory System Optimization**

**Production Memory Configuration:**
```javascript
// lib/memory/memoryService.js
const PRODUCTION_CONFIG = {
  cacheSize: 1000,           // Increased for production
  cacheTTL: 300000,          // 5 minutes
  maxMemoriesPerUser: 100,   // Limit memory storage
  compressionEnabled: true,   // Enable memory compression
  performanceMonitoring: true // Enable detailed metrics
}
```

### 📈 **Performance Monitoring**

**Built-in Health Checks:**
```bash
# Memory system health
curl https://yourdomain.com/api/memory?action=health

# Performance metrics
curl https://yourdomain.com/api/memory?action=metrics
```

**Expected Production Metrics:**
- Memory retrieval: <5ms
- API response time: <3s
- Memory accuracy: 100%
- Error rate: <0.1%
- Uptime: >99.9%

## 🔍 **Monitoring & Logging**

### 📊 **Health Monitoring**

**Automated Health Checks:**
```bash
#!/bin/bash
# health-check.sh
HEALTH_URL="https://yourdomain.com/api/memory?action=health"
RESPONSE=$(curl -s $HEALTH_URL)
STATUS=$(echo $RESPONSE | jq -r '.success')

if [ "$STATUS" != "true" ]; then
  echo "Health check failed: $RESPONSE"
  # Send alert (email, Slack, etc.)
  exit 1
fi

echo "Health check passed"
```

**Cron Job Setup:**
```bash
# Add to crontab (check every 5 minutes)
*/5 * * * * /path/to/health-check.sh
```

### 📝 **Application Logging**

**Production Logging Configuration:**
```javascript
// lib/logger.js
const winston = require('winston')

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
    ...(process.env.NODE_ENV !== 'production' ? [
      new winston.transports.Console({
        format: winston.format.simple()
      })
    ] : [])
  ]
})

module.exports = logger
```

### 📈 **Performance Metrics**

**Custom Metrics Dashboard:**
```javascript
// lib/metrics.js
class MetricsCollector {
  static async collectSystemMetrics() {
    const memoryHealth = await fetch('/api/memory?action=health')
    const memoryMetrics = await fetch('/api/memory?action=metrics')
    
    return {
      timestamp: new Date().toISOString(),
      memory: {
        health: await memoryHealth.json(),
        metrics: await memoryMetrics.json()
      },
      system: {
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        cpu: process.cpuUsage()
      }
    }
  }
}
```

## 🛠️ **Maintenance & Updates**

### 🔄 **Zero-Downtime Deployments**

**Vercel (Automatic):**
- Vercel provides zero-downtime deployments automatically
- Previous version remains available during deployment
- Automatic rollback on deployment failure

**Docker Blue-Green Deployment:**
```bash
# Deploy new version to green environment
docker-compose -f docker-compose.green.yml up -d

# Health check green environment
./health-check.sh https://green.yourdomain.com

# Switch traffic to green (update load balancer)
# Stop blue environment after verification
docker-compose -f docker-compose.blue.yml down
```

### 📦 **Dependency Updates**

**Automated Dependency Checks:**
```bash
# Check for updates
npm audit
npm outdated

# Update dependencies safely
npm update
npm audit fix

# Test after updates
npm test
```

### 🔐 **Security Updates**

**Regular Security Maintenance:**
```bash
# Security audit
npm audit --audit-level high

# Update security patches
npm audit fix --force

# Rotate API keys quarterly
# Update SSL certificates annually
# Review access logs monthly
```

## 🚨 **Troubleshooting**

### ❌ **Common Issues**

**Memory System Not Working:**
```bash
# Check memory service health
curl https://yourdomain.com/api/memory?action=health

# Expected response:
{
  "success": true,
  "status": "healthy",
  "metrics": {
    "isInitialized": true,
    "errorCount": 0
  }
}
```

**API Key Issues:**
```bash
# Verify API key format
echo $ANTHROPIC_API_KEY | grep "sk-ant-api03-"

# Test API key
curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "content-type: application/json" \
  -d '{"model":"claude-3-haiku-20240307","max_tokens":10,"messages":[{"role":"user","content":"Hi"}]}'
```

**Performance Issues:**
```bash
# Check memory metrics
curl https://yourdomain.com/api/memory?action=metrics

# Monitor response times
time curl https://yourdomain.com/api/chat

# Check system resources
top
free -h
df -h
```

### 🔧 **Debug Mode**

**Enable Debug Logging:**
```bash
# Set environment variable
LOG_LEVEL=debug
DEBUG=yapchat:*

# Check logs
tail -f combined.log | grep ERROR
```

## 📚 **Additional Resources**

### 📖 **Documentation**
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
- [Anthropic API Documentation](https://docs.anthropic.com/)
- [Vercel Documentation](https://vercel.com/docs)

### 🛠️ **Tools**
- [Next.js Bundle Analyzer](https://www.npmjs.com/package/@next/bundle-analyzer)
- [Lighthouse Performance Testing](https://developers.google.com/web/tools/lighthouse)
- [Artillery Load Testing](https://artillery.io/)

### 🎯 **Best Practices**
- Monitor memory system performance continuously
- Implement proper error handling and logging
- Use CDN for static assets
- Enable compression and caching
- Regular security audits and updates
- Backup configuration and environment variables

---

**🎉 Congratulations! Your YapChat deployment is now production-ready with 100% functional memory system, excellent performance, and comprehensive monitoring.** 