# Deployment Guide

## Overview

This guide covers the deployment process for the IDARAH WALI UL ASER Islamic Library Management System. The application is designed to be deployed on modern hosting platforms with support for static sites and serverless functions.

## Prerequisites

Before deploying, ensure you have:

1. **Supabase Project**: Set up and configured with the database schema
2. **Environment Variables**: All required environment variables configured
3. **Domain Name**: (Optional) Custom domain for production
4. **SSL Certificate**: HTTPS is required for production
5. **Build Process**: Successful local build completion

## Environment Configuration

### Required Environment Variables

Create environment files for different deployment stages:

#### Production (`.env.production`)
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_APP_ENV=production
VITE_APP_URL=https://your-domain.com
VITE_ENABLE_ANALYTICS=true
VITE_SENTRY_DSN=your-sentry-dsn
```

#### Staging (`.env.staging`)
```env
VITE_SUPABASE_URL=https://your-staging-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-staging-anon-key
VITE_APP_ENV=staging
VITE_APP_URL=https://staging.your-domain.com
VITE_ENABLE_ANALYTICS=false
```

#### Development (`.env.local`)
```env
VITE_SUPABASE_URL=https://your-dev-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-dev-anon-key
VITE_APP_ENV=development
VITE_APP_URL=http://localhost:5173
VITE_ENABLE_ANALYTICS=false
```

## Netlify Deployment (Recommended)

### Automatic Deployment

1. **Connect Repository**
   - Log in to Netlify
   - Click "New site from Git"
   - Connect your GitHub repository
   - Select the `islamic-website` repository

2. **Build Settings**
   ```
   Build command: npm run build
   Publish directory: dist
   Node version: 18
   ```

3. **Environment Variables**
   - Go to Site settings > Environment variables
   - Add all production environment variables
   - Ensure `VITE_` prefix for client-side variables

4. **Deploy Settings**
   ```
   Branch to deploy: main
   Auto-deploy: Enabled
   Build hooks: Optional
   ```

### Manual Deployment

```bash
# Build the project
npm run build

# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy to production
netlify deploy --prod --dir=dist
```

### Netlify Configuration

Create `netlify.toml` in the project root:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[functions]
  directory = "netlify/functions"
  node_bundler = "esbuild"
```

## Vercel Deployment

### Automatic Deployment

1. **Import Project**
   - Go to Vercel dashboard
   - Click "New Project"
   - Import from GitHub
   - Select the repository

2. **Build Configuration**
   ```
   Framework Preset: Vite
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

3. **Environment Variables**
   - Add all production environment variables
   - Use the Environment Variables section

### Manual Deployment

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

### Vercel Configuration

Create `vercel.json`:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

## GitHub Pages Deployment

### GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout
      uses: actions/checkout@v3
      
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Build
      run: npm run build
      env:
        VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
        VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
        
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      if: github.ref == 'refs/heads/main'
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

## Docker Deployment

### Dockerfile

```dockerfile
# Build stage
FROM node:18-alpine as build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built assets
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
```

### Nginx Configuration

Create `nginx.conf`:

```nginx
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;

        # Handle client-side routing
        location / {
            try_files $uri $uri/ /index.html;
        }

        # Cache static assets
        location /assets/ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }

        # Security headers
        add_header X-Frame-Options "DENY" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header X-Content-Type-Options "nosniff" always;
    }
}
```

### Docker Commands

```bash
# Build image
docker build -t islamic-library .

# Run container
docker run -p 80:80 islamic-library

# Docker Compose
docker-compose up -d
```

## Database Migration

### Supabase Setup

1. **Create Project**
   ```bash
   # Install Supabase CLI
   npm install -g supabase

   # Login
   supabase login

   # Link project
   supabase link --project-ref your-project-ref
   ```

2. **Run Migrations**
   ```bash
   # Apply database schema
   supabase db push

   # Run seed data (if available)
   supabase db seed
   ```

3. **Set up RLS Policies**
   ```sql
   -- Enable RLS on all tables
   ALTER TABLE books ENABLE ROW LEVEL SECURITY;
   ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
   ALTER TABLE borrowing_records ENABLE ROW LEVEL SECURITY;

   -- Apply security policies
   \i fix-rls-policies.sql
   ```

## Performance Optimization

### Build Optimization

```bash
# Analyze bundle size
npm run build -- --analyze

# Enable compression
npm install -g gzip-size-cli
gzip-size dist/assets/*.js
```

### CDN Configuration

Configure CDN for static assets:

```javascript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name].[hash][extname]',
        chunkFileNames: 'assets/[name].[hash].js',
        entryFileNames: 'assets/[name].[hash].js'
      }
    }
  }
});
```

## Monitoring and Analytics

### Error Tracking

```bash
# Install Sentry
npm install @sentry/react @sentry/tracing

# Configure in main.tsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.VITE_APP_ENV
});
```

### Performance Monitoring

```javascript
// Add to index.html
<script>
  // Web Vitals tracking
  import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

  getCLS(console.log);
  getFID(console.log);
  getFCP(console.log);
  getLCP(console.log);
  getTTFB(console.log);
</script>
```

## Security Considerations

### Environment Security
- Never commit `.env` files to version control
- Use different Supabase projects for different environments
- Rotate API keys regularly
- Enable RLS policies on all tables

### Content Security Policy

```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline' https://your-supabase-url.supabase.co;
               style-src 'self' 'unsafe-inline';
               img-src 'self' data: https:;
               connect-src 'self' https://your-supabase-url.supabase.co wss://your-supabase-url.supabase.co;">
```

## Backup and Recovery

### Database Backup

```bash
# Automated backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
supabase db dump --file backup_$DATE.sql
```

### Asset Backup

```bash
# Backup static assets
aws s3 sync ./dist s3://your-backup-bucket/assets/$DATE/
```

## Troubleshooting

### Common Issues

1. **Build Failures**
   ```bash
   # Clear cache and reinstall
   rm -rf node_modules package-lock.json
   npm install
   npm run build
   ```

2. **Environment Variable Issues**
   ```bash
   # Check environment variables
   echo $VITE_SUPABASE_URL
   
   # Verify in build
   npm run build -- --mode production
   ```

3. **Routing Issues**
   - Ensure proper redirect rules are configured
   - Check that all routes return `index.html`

4. **Database Connection Issues**
   - Verify Supabase URL and keys
   - Check RLS policies
   - Ensure proper CORS configuration

### Health Checks

```javascript
// Add health check endpoint
export const healthCheck = async () => {
  try {
    const { data, error } = await supabase
      .from('books')
      .select('count')
      .limit(1);
    
    return { status: 'healthy', database: !error };
  } catch (error) {
    return { status: 'unhealthy', error: error.message };
  }
};
```

## Post-Deployment Checklist

- [ ] Verify all environment variables are set
- [ ] Test user authentication flow
- [ ] Verify database connections
- [ ] Test real-time features
- [ ] Check responsive design on mobile
- [ ] Verify SSL certificate
- [ ] Test all major user workflows
- [ ] Monitor error rates
- [ ] Set up monitoring alerts
- [ ] Document any deployment-specific configurations
