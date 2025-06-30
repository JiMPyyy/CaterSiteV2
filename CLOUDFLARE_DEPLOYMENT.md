# 🌐 Cloudflare Pages Deployment Guide

## Overview
Deploy CaterVegas frontend to Cloudflare Pages with MongoDB Atlas backend.

## 📋 Prerequisites
- [x] MongoDB Atlas cluster set up
- [x] Backend deployed (Railway/Vercel/Render)
- [ ] GitHub repository with your code
- [ ] Cloudflare account

## 🚀 Step 1: Prepare Frontend for Production

### Update API Configuration
```bash
# Update client/.env.local
NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app/api
```

### Build and Test Locally
```bash
cd client
npm run build
npm start  # Test production build
```

## 🌐 Step 2: Deploy to Cloudflare Pages

### Option A: Git Integration (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for Cloudflare deployment"
   git push origin main
   ```

2. **Connect to Cloudflare Pages**
   - Go to https://dash.cloudflare.com
   - Navigate to "Pages"
   - Click "Create a project"
   - Connect your GitHub repository

3. **Configure Build Settings**
   ```
   Framework preset: Next.js
   Build command: npm run build
   Build output directory: .next
   Root directory: client
   ```

4. **Set Environment Variables**
   ```
   NEXT_PUBLIC_API_URL = https://your-backend-url.railway.app/api
   ```

### Option B: Direct Upload

1. **Build the project**
   ```bash
   cd client
   npm run build
   ```

2. **Upload to Cloudflare Pages**
   - Go to Cloudflare Pages dashboard
   - Click "Upload assets"
   - Upload the `.next` folder contents

## 🔧 Step 3: Backend Deployment Options

### Option 1: Railway (Recommended)

1. **Create Railway Account**: https://railway.app
2. **Deploy from GitHub**:
   - Connect your repository
   - Select the `server` folder as root
   - Railway auto-detects Node.js

3. **Set Environment Variables**:
   ```
   MONGODB_URI=mongodb+srv://...your-atlas-connection...
   JWT_SECRET=your-super-secret-jwt-key-production
   CLIENT_URL=https://your-site.pages.dev
   NODE_ENV=production
   ```

### Option 2: Vercel

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Deploy**:
   ```bash
   cd server
   vercel
   ```

3. **Configure**:
   - Set environment variables in Vercel dashboard
   - Update CORS settings for your Cloudflare domain

### Option 3: Render

1. **Create Render Account**: https://render.com
2. **Create Web Service**:
   - Connect GitHub repository
   - Set root directory to `server`
   - Set build command: `npm install`
   - Set start command: `npm start`

## 🔒 Step 4: Security Configuration

### Update CORS Settings
```javascript
// server/index.js - Update CLIENT_URL
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://your-site.pages.dev',
    'https://catervegas.your-domain.com'  // If using custom domain
  ],
  credentials: true
}));
```

### Environment Variables Checklist

**Backend (.env)**:
```
PORT=3001
MONGODB_URI=mongodb+srv://...
JWT_SECRET=production-secret-key
CLIENT_URL=https://your-site.pages.dev
NODE_ENV=production
```

**Frontend (.env.local)**:
```
NEXT_PUBLIC_API_URL=https://your-backend.railway.app/api
```

## 🧪 Step 5: Testing Production Deployment

### Test Checklist
- [ ] Frontend loads on Cloudflare Pages URL
- [ ] User registration works
- [ ] User login works
- [ ] Order page functions correctly
- [ ] Schedule page works
- [ ] Profile page accessible
- [ ] Database operations work
- [ ] CORS configured correctly

### Common Issues & Solutions

**CORS Errors**:
```javascript
// Add your Cloudflare domain to CORS origins
origin: ['https://your-site.pages.dev']
```

**API Connection Issues**:
```javascript
// Verify API URL in frontend
NEXT_PUBLIC_API_URL=https://your-backend.railway.app/api
```

**Database Connection Issues**:
```javascript
// Check MongoDB Atlas network access
// Ensure 0.0.0.0/0 is allowed
```

## 🎯 Step 6: Custom Domain (Optional)

### Add Custom Domain to Cloudflare Pages
1. Go to your Pages project settings
2. Click "Custom domains"
3. Add your domain (e.g., catervegas.com)
4. Update DNS records as instructed

### Update Backend CORS
```javascript
// Add custom domain to CORS
origin: [
  'https://your-site.pages.dev',
  'https://catervegas.com'
]
```

## 📊 Performance Optimization

### Cloudflare Settings
- Enable "Auto Minify" for CSS, JS, HTML
- Enable "Brotli" compression
- Set up caching rules for static assets

### MongoDB Atlas Optimization
- Enable connection pooling
- Set up read replicas if needed
- Monitor performance in Atlas dashboard

## 🔍 Monitoring & Analytics

### Cloudflare Analytics
- Monitor page views and performance
- Set up alerts for downtime

### MongoDB Atlas Monitoring
- Monitor database performance
- Set up alerts for connection issues

## 🎉 Success Checklist

When deployment is complete, you should have:
- [ ] Frontend hosted on Cloudflare Pages
- [ ] Backend hosted on Railway/Vercel/Render
- [ ] Database on MongoDB Atlas
- [ ] Custom domain (optional)
- [ ] SSL certificates (automatic)
- [ ] Global CDN distribution
- [ ] Production monitoring

## 📞 Support Resources

- **Cloudflare Pages**: https://developers.cloudflare.com/pages/
- **MongoDB Atlas**: https://docs.atlas.mongodb.com/
- **Railway**: https://docs.railway.app/
- **Next.js Deployment**: https://nextjs.org/docs/deployment

Your CaterVegas application will be globally distributed and production-ready! 🚀
