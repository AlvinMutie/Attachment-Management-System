# AMS Production Deployment Guide

This document outlines the professional protocol for deploying the Attachment Management System (AMS) to a production environment.

## 📦 Prerequisites
- **Node.js**: v18.x or higher
- **Process Manager**: PM2 (Recommended)
- **Web Server**: Nginx (Reverse Proxy)
- **DB**: MySQL 8.0 / PostgreSQL

---

## 🚀 1. Backend Deployment

### Initial Setup
1. Clone the repository to your production server.
2. Navigate to `/server` and run `npm install --production`.
3. Create a `.env` file based on the template below:

```env
PORT=5000
NODE_ENV=production
JWT_SECRET=[GENERATE_SECURE_KEY]
DB_HOST=[DATABASE_HOST]
DB_USER=[DATABASE_USER]
DB_PASS=[DATABASE_PASSWORD]
DB_NAME=ams_db
ALLOWED_ORIGINS=https://your-app-domain.com
```

### Process Management
Use PM2 to ensure high availability:
```bash
pm2 start index.js --name ams-backend
pm2 save
```

---

## 🌐 2. Frontend Deployment

### Production Build
1. Navigate to `/client`.
2. Create/Sync `.env`:
```env
VITE_API_URL=https://api.your-domain.com/api
```
3. Execute the production build:
```bash
npm run build
```

### Hosting
The `dist` folder is now ready for deployment:
- **Option A (Static Hosting)**: Upload `dist` to Vercel, Netlify, or AWS S3.
- **Option B (Nginx)**: Serve the `dist` folder directly via Nginx.

---

## 🛡️ 3. Security Hardening
The following measures are automatically enabled in `production` mode:
- **Helmet**: Secure HTTP headers protection.
- **CORS**: Restricted access to the frontend origin defined in `.env`.
- **Error Masking**: Internal details are hidden from the client.
- **Multi-Tenancy**: Scoped isolation enforced via `schoolId` context.

---

## 📈 4. Post-Deployment Audit
1. Verify institutional logos load correctly (Assets from `uploads/logos`).
2. Confirm CSV bulk onboarding works with production-size payloads.
3. Test PDF report generation (Ensures `pdfkit` dependency is active).
4. Monitor logs via `pm2 logs`.

---
> [!IMPORTANT]
> Ensure the `uploads/` directory has appropriate write permissions (`chmod -R 755`) for the Node.js process.
