# Deployment & Configuration Guide

## Overview

This guide covers deploying the Multi-Store E-Commerce Backend to production environments. The application is designed to run with **PM2** process manager and can be deployed to various platforms.

## System Requirements

### Minimum Requirements

| Component | Requirement |
|-----------|-------------|
| **Node.js** | 18.20.4 or higher |
| **MongoDB** | 4.4 or higher |
| **RAM** | 2GB minimum, 4GB recommended |
| **Storage** | 10GB minimum |
| **CPU** | 2 cores minimum |

### Recommended Production Setup

- **Node.js**: 18.20.4 LTS
- **MongoDB**: 6.0+ (Atlas or self-hosted)
- **RAM**: 8GB+
- **Storage**: SSD with 50GB+
- **CPU**: 4+ cores
- **Load Balancer**: Nginx or similar
- **SSL**: Let's Encrypt or commercial certificate

## Environment Configuration

### Environment Variables

Create a `.env` file in the project root:

```env
# Environment
NODE_ENV=production

# Server
PORT=3000

# Database
MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/database-name

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_ACCESS_EXPIRATION_MINUTES=30
JWT_REFRESH_EXPIRATION_DAYS=30
JWT_RESET_PASSWORD_EXPIRATION_MINUTES=10
JWT_VERIFY_EMAIL_EXPIRATION_MINUTES=10

# Email Configuration (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
EMAIL_FROM=noreply@yourstore.com

# Paystack Configuration
PAYSTACK_SECRET_KEY=sk_live_xxxxxxxxxxxxxxxxxxxxx
PAYSTACK_PUBLIC_KEY=pk_live_xxxxxxxxxxxxxxxxxxxxx
PAYSTACK_CALLBACK_URL=https://api.yourstore.com/v1/paystack/verify

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Optional: Separate JWT secrets for access and refresh tokens
JWT_ACCESS_SECRET=your-access-token-secret
JWT_REFRESH_SECRET=your-refresh-token-secret
```

### Security Best Practices

1. **Generate Strong Secrets**
```bash
# Generate random secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

2. **Never Commit .env File**
```bash
# Add to .gitignore
echo ".env" >> .gitignore
```

3. **Use Environment-Specific Files**
- `.env.development`
- `.env.staging`
- `.env.production`

## MongoDB Setup

### MongoDB Atlas (Recommended)

1. **Create Cluster**
   - Sign up at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Create a new cluster
   - Choose your cloud provider and region

2. **Configure Network Access**
   - Add IP whitelist (0.0.0.0/0 for all IPs or specific IPs)
   - Create database user with strong password

3. **Get Connection String**
   ```
   mongodb+srv://<username>:<password>@cluster.mongodb.net/<database>?retryWrites=true&w=majority
   ```

### Self-Hosted MongoDB

```bash
# Install MongoDB
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Create database and user
mongo
> use multi-store
> db.createUser({
    user: "storeuser",
    pwd: "strong-password",
    roles: ["readWrite"]
  })
```

## PM2 Configuration

### PM2 Setup

```bash
# Install PM2 globally
npm install -g pm2

# Start application
pm2 start ecosystem.config.json

# View logs
pm2 logs

# Monitor
pm2 monit

# Restart
pm2 restart all

# Stop
pm2 stop all
```

### Ecosystem Configuration

**File:** `ecosystem.config.json`

```json
{
  "apps": [{
    "name": "multi-store-api",
    "script": "src/index.js",
    "instances": "max",
    "exec_mode": "cluster",
    "env": {
      "NODE_ENV": "production"
    },
    "error_file": "./logs/err.log",
    "out_file": "./logs/out.log",
    "log_date_format": "YYYY-MM-DD HH:mm:ss Z",
    "merge_logs": true,
    "max_memory_restart": "1G",
    "autorestart": true,
    "watch": false
  }]
}
```

### PM2 Cluster Mode

```javascript
// Benefits of cluster mode:
// - Automatic load balancing
// - Zero-downtime reload
// - Utilizes all CPU cores
// - Automatic restart on crash

// Start in cluster mode
pm2 start ecosystem.config.json

// Reload without downtime
pm2 reload ecosystem.config.json
```

### PM2 Startup Script

```bash
# Generate startup script
pm2 startup

# Save current process list
pm2 save

# Resurrect saved processes on reboot
pm2 resurrect
```

## Nginx Configuration

### Install Nginx

```bash
sudo apt-get update
sudo apt-get install nginx
```

### Nginx Reverse Proxy

**File:** `/etc/nginx/sites-available/multi-store-api`

```nginx
upstream api_backend {
    least_conn;
    server 127.0.0.1:3000;
    server 127.0.0.1:3001;
    server 127.0.0.1:3002;
    server 127.0.0.1:3003;
}

server {
    listen 80;
    server_name api.yourstore.com;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.yourstore.com;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/api.yourstore.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.yourstore.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # Logging
    access_log /var/log/nginx/api.yourstore.com.access.log;
    error_log /var/log/nginx/api.yourstore.com.error.log;

    # Client upload size
    client_max_body_size 10M;

    location / {
        proxy_pass http://api_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;
    limit_req zone=api_limit burst=20 nodelay;
}
```

### Enable Site

```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/multi-store-api /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

## SSL Certificate (Let's Encrypt)

```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d api.yourstore.com

# Auto-renewal (already set up by certbot)
sudo certbot renew --dry-run
```

## Deployment Platforms

### DigitalOcean Droplet

```bash
# 1. Create Droplet (Ubuntu 22.04)
# 2. SSH into droplet
ssh root@your-droplet-ip

# 3. Update system
apt-get update && apt-get upgrade -y

# 4. Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt-get install -y nodejs

# 5. Install Git
apt-get install git

# 6. Clone repository
git clone https://github.com/yourusername/multi-store-backend.git
cd multi-store-backend

# 7. Install dependencies
npm install --production

# 8. Set up environment variables
nano .env

# 9. Install PM2
npm install -g pm2

# 10. Start application
pm2 start ecosystem.config.json
pm2 startup
pm2 save
```

### AWS EC2

Similar to DigitalOcean, but:
1. Launch EC2 instance (Ubuntu)
2. Configure Security Groups (ports 80, 443, 22)
3. Attach Elastic IP
4. Follow same deployment steps

### Heroku

```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create your-app-name

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URL=your-mongodb-url
# ... set all other env vars

# Deploy
git push heroku main

# Scale
heroku ps:scale web=2
```

### Docker Deployment

**Dockerfile:**

```dockerfile
FROM node:18.20.4-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

**docker-compose.yml:**

```yaml
version: '3.8'

services:
  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    env_file:
      - .env
    depends_on:
      - mongodb
    restart: unless-stopped

  mongodb:
    image: mongo:6.0
    ports:
      - "27017:27017"
    environment:
      - MONGO_INITDB_ROOT_USERNAME=admin
      - MONGO_INITDB_ROOT_PASSWORD=password
    volumes:
      - mongodb_data:/data/db
    restart: unless-stopped

volumes:
  mongodb_data:
```

## Monitoring & Logging

### PM2 Monitoring

```bash
# Real-time monitoring
pm2 monit

# View logs
pm2 logs

# Flush logs
pm2 flush

# Install PM2 Plus (advanced monitoring)
pm2 plus
```

### Application Logging

The application uses Winston for logging:

```javascript
// Development: Console output with colors
// Production: File-based logging

// Log files location
./logs/error.log    // Error logs
./logs/combined.log // All logs
```

### Log Rotation

```bash
# Install logrotate
sudo apt-get install logrotate

# Configure log rotation
sudo nano /etc/logrotate.d/multi-store-api
```

```
/path/to/app/logs/*.log {
    daily
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 www-data www-data
    sharedscripts
    postrotate
        pm2 reloadLogs
    endscript
}
```

## Database Backup

### MongoDB Backup Script

```bash
#!/bin/bash
# backup-mongodb.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/mongodb"
DB_NAME="multi-store"

mkdir -p $BACKUP_DIR

mongodump --uri="$MONGODB_URL" --out="$BACKUP_DIR/$DATE"

# Compress backup
tar -czf "$BACKUP_DIR/$DATE.tar.gz" "$BACKUP_DIR/$DATE"
rm -rf "$BACKUP_DIR/$DATE"

# Delete backups older than 30 days
find $BACKUP_DIR -name "*.tar.gz" -mtime +30 -delete

echo "Backup completed: $DATE.tar.gz"
```

### Automated Backups (Cron)

```bash
# Edit crontab
crontab -e

# Add daily backup at 2 AM
0 2 * * * /path/to/backup-mongodb.sh
```

## Performance Optimization

### Node.js Optimization

```javascript
// Use production mode
NODE_ENV=production

// Enable compression
app.use(compression());

// Set appropriate timeouts
server.timeout = 30000;
```

### MongoDB Optimization

```javascript
// Create indexes
db.products.createIndex({ name: "text", description: "text" });
db.products.createIndex({ category: 1, price: 1 });
db.users.createIndex({ email: 1 }, { unique: true });

// Use lean queries
Product.find().lean();

// Limit fields
Product.find().select('name price');

// Use pagination
Product.paginate(filter, { page, limit });
```

## Health Checks

### Health Check Endpoint

```javascript
// Add to routes
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV
  });
});
```

### Monitoring Tools

- **PM2 Plus**: Process monitoring
- **New Relic**: Application performance monitoring
- **Datadog**: Infrastructure monitoring
- **Sentry**: Error tracking
- **UptimeRobot**: Uptime monitoring

## Production Checklist

### Pre-Deployment

- [ ] Set `NODE_ENV=production`
- [ ] Use production database
- [ ] Configure production secrets
- [ ] Enable HTTPS/SSL
- [ ] Set up domain and DNS
- [ ] Configure CORS for production domains
- [ ] Enable rate limiting
- [ ] Set up error logging
- [ ] Configure email service
- [ ] Test payment integration with live keys

### Security

- [ ] Use strong JWT secrets
- [ ] Enable Helmet security headers
- [ ] Configure CORS properly
- [ ] Use HTTPS only
- [ ] Implement rate limiting
- [ ] Sanitize user inputs
- [ ] Keep dependencies updated
- [ ] Use environment variables for secrets
- [ ] Implement request validation
- [ ] Set up firewall rules

### Performance

- [ ] Enable compression
- [ ] Use PM2 cluster mode
- [ ] Configure database indexes
- [ ] Implement caching (Redis)
- [ ] Optimize database queries
- [ ] Use CDN for static assets
- [ ] Enable gzip compression
- [ ] Set appropriate timeouts

### Monitoring

- [ ] Set up application monitoring
- [ ] Configure error tracking
- [ ] Enable access logs
- [ ] Set up uptime monitoring
- [ ] Configure alerts
- [ ] Implement health checks
- [ ] Set up database monitoring
- [ ] Monitor API response times

### Backup & Recovery

- [ ] Automated database backups
- [ ] Test backup restoration
- [ ] Document recovery procedures
- [ ] Set up backup retention policy
- [ ] Store backups securely
- [ ] Test disaster recovery plan

## Troubleshooting

### Common Issues

**Application won't start:**
```bash
# Check logs
pm2 logs

# Check environment variables
pm2 env 0

# Restart application
pm2 restart all
```

**Database connection failed:**
```bash
# Test MongoDB connection
mongo "mongodb+srv://cluster.mongodb.net/test" --username user

# Check network access in MongoDB Atlas
```

**High memory usage:**
```bash
# Monitor memory
pm2 monit

# Restart with memory limit
pm2 restart app --max-memory-restart 1G
```

## Next Steps

- [Overview](./01-overview.md) - Project overview
- [Architecture](./02-architecture.md) - System architecture
- [API Endpoints](./05-api-endpoints.md) - API reference
