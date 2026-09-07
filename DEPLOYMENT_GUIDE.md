# Attachment Management System (AMS) — Production Deployment Guide

This document outlines the protocol for deploying the Attachment Management System (AMS) to an institutional production environment.

---

## 1. Prerequisites
- **Operating System**: Linux (Ubuntu 22.04 LTS / Debian 12 recommended)
- **Node.js**: v18.x or v20.x LTS
- **Web Server / Reverse Proxy**: Nginx with SSL/TLS (Certbot / Let's Encrypt)
- **Process Manager**: PM2 or systemd

---

## 2. Backend Deployment

### A. Environment Configuration
1. Clone the repository to `/var/www/ams`.
2. Navigate to `/var/www/ams/server` and install dependencies:
   ```bash
   npm ci --production
   ```
3. Create the production `.env` file based on `.env.example`:
   ```env
   NODE_ENV=production
   PORT=5000
   JWT_SECRET=use_a_cryptographically_secure_random_key_min_32_chars
   DATABASE_PATH=/var/www/ams/data/database.sqlite
   ALLOWED_ORIGINS=https://ams.university.ac.ke
   UPLOAD_DIR=/var/www/ams/uploads
   LOG_LEVEL=info
   ```

### B. Persistent Directory & Permissions
```bash
sudo mkdir -p /var/www/ams/data /var/www/ams/uploads /var/www/ams/backups
sudo chown -R www-data:www-data /var/www/ams/data /var/www/ams/uploads /var/www/ams/backups
sudo chmod -R 750 /var/www/ams/data /var/www/ams/uploads /var/www/ams/backups
```

### C. Process Management (PM2)
```bash
pm2 start index.js --name ams-backend -i 1 --max-memory-restart 500M
pm2 save
pm2 startup
```

---

## 3. Frontend Deployment

### A. Build Production Bundle
1. Navigate to `/var/www/ams/client`.
2. Set API base URL:
   ```env
   VITE_API_URL=https://ams.university.ac.ke/api
   ```
3. Run the production build:
   ```bash
   npm ci
   npm run build
   ```
4. Output directory `dist/` contains the optimized static assets ready for Nginx.

---

## 4. Reverse Proxy Configuration (Nginx)

```nginx
server {
    listen 80;
    server_name ams.university.ac.ke;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name ams.university.ac.ke;

    ssl_certificate /etc/letsencrypt/live/ams.university.ac.ke/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/ams.university.ac.ke/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Frontend Single Page Application
    root /var/www/ams/client/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Backend API Proxy
    location /api/ {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        client_max_body_size 15M;
    }

    # Health & Readiness Endpoints
    location ~ ^/(health|ready)$ {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host $host;
    }
}
```

---

## 5. Automated Backup & Disaster Recovery

### Daily Backup Cron Job
Add the following cron entry (`crontab -e`) to take non-blocking daily backups at 2:00 AM:
```bash
0 2 * * * cd /var/www/ams/server && /usr/bin/node scripts/backup.js >> /var/log/ams_backup.log 2>&1
```

### Emergency Database Recovery
```bash
# 1. Stop backend service
pm2 stop ams-backend

# 2. Restore database from latest verified snapshot
node /var/www/ams/server/scripts/restore.js

# 3. Verify health and restart
pm2 start ams-backend
curl https://ams.university.ac.ke/ready
```
