# 🌐 Cloud Uptime Monitor & SaaS Infrastructure

[![Deployment Status](https://img.shields.io/badge/Deployment-Production-success?style=for-the-badge&logo=microsoftazure)](https://uptime-alfan.duckdns.org)
[![SSL Security](https://img.shields.io/badge/SSL-Let's%20Encrypt%20HTTPS-blue?style=for-the-badge&logo=letsencrypt)](https://uptime-alfan.duckdns.org)
[![Docker Support](https://img.shields.io/badge/Docker-Containers%20Active-2496ED?style=for-the-badge&logo=docker)](https://uptime-alfan.duckdns.org)

A production-ready, highly available **Uptime Monitoring System** deployed on Microsoft Azure Virtual Machines. The system utilizes Docker Compose for multi-container orchestration, Nginx as a reverse proxy with automated Let's Encrypt TLS/SSL encryption, PostgreSQL for persistent metrics storage, Redis for background job handling, and automated CI/CD via GitHub Actions.

---

## 🚀 Live Demo & Infrastructure Details

* **Production URL:** [https://uptime-alfan.duckdns.org](https://uptime-alfan.duckdns.org)
* **SSL Encryption:** Enabled (256-bit TLS via Let's Encrypt)
* **Server Location:** Microsoft Azure Virtual Machine (Ubuntu 22.04 LTS)
* **Server IP:** `70.153.80.248`

---

## 🛠️ System Architecture & Tech Stack

```
[ Clients / Browser ] 
       │ (Port 443 - HTTPS / Port 80 - HTTP)
       ▼
 [ Nginx Reverse Proxy ] (Host Machine)
       │
       ├────► [ Node.js Application ] (Container - Port 3000)
       │             │
       │             ├────► [ PostgreSQL ] (Container - Port 5432)
       │             └────► [ Redis Cache ] (Container - Port 6379)
       │
 [ Certbot SSL ] (Automated Renewal)
```

| Component | Technology | Description |
|---|---|---|
| **App Server** | Node.js, Express, Prisma ORM | Core REST API & Monitoring Engine |
| **Database** | PostgreSQL 15 (Alpine) | Persistent storage for health logs & user accounts |
| **Cache & Queue** | Redis 7 (Alpine) | In-memory queue & caching layer |
| **Reverse Proxy** | Nginx | Request forwarding, header proxying, SSL termination |
| **SSL/TLS Security** | Certbot / Let's Encrypt | Automated HTTPS certificate management |
| **Orchestration** | Docker & Docker Compose | Isolated container environment with auto-restart |
| **Cloud Hosting** | Microsoft Azure VPS | Public Infrastructure with custom Network Security Groups |
| **CI/CD Pipeline** | GitHub Actions | Automated build and release pipeline |
| **DNS Management** | DuckDNS | Dynamic DNS mapping to Azure VPS IP |

---

## 🛡️ Azure Network Security Group (NSG) Rules

| Priority | Rule Name | Port Range | Protocol | Action | Purpose |
|---|---|---|---|---|---|
| 300 | `HTTP` | `80` | TCP | Allow | Inbound HTTP web traffic |
| 320 | `SSH` | `22` | TCP | Allow | Secure Remote Server Administration |
| 330 | `HTTPS` | `443` | TCP | Allow | Encrypted Web Traffic (SSL/TLS) |

---

## ⚙️ Environment Configuration (`.env`)

Create a `.env` file in the root folder before launching:

```env
# Database Credentials
DATABASE_URL="postgresql://root:password123@postgres:5432/uptime_db?schema=public"

# Redis Cache Credentials
REDIS_HOST="redis"
REDIS_PORT=6379

# Application Settings
PORT=3000
NODE_ENV="production"
```

---

## 💻 Local Development Setup

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/Alfan2005/uptime-monitor-saas.git
   cd uptime-monitor-saas
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Start Local Docker Services:**
   ```bash
   docker-compose up --build -d
   ```

4. **Sync Prisma Database Schema:**
   ```bash
   npx prisma db push
   ```

5. **Access Application Locally:**
   Open `http://localhost:3000` in your browser.

---

## 📦 Production Deployment Configuration

### 1. Multi-Container Orchestration (`docker-compose.yml`)

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    restart: always
    environment:
      POSTGRES_USER: root
      POSTGRES_PASSWORD: password123
      POSTGRES_DB: uptime_db
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    restart: always
    ports:
      - "6379:6379"

  app:
    build: .
    restart: always
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://root:password123@postgres:5432/uptime_db?schema=public
      - REDIS_HOST=redis
      - REDIS_PORT=6379
      - PORT=3000
    depends_on:
      - postgres
      - redis

volumes:
  pgdata:
```

### 2. Nginx Site Configuration (`/etc/nginx/sites-available/uptime-monitor`)

```nginx
server {
    listen 80;
    server_name uptime-alfan.duckdns.org;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 3. SSL Generation Command

```bash
sudo certbot --nginx -d uptime-alfan.duckdns.org
```

---

## 🛠️ Operational & Maintenance Commands

* **Check Status of All Containers:**
  ```bash
  docker-compose ps
  ```

* **Inspect Application Logs:**
  ```bash
  docker-compose logs -f app
  ```

* **Restart Infrastructure Services:**
  ```bash
  docker-compose restart
  ```

* **Verify Nginx Status & Configuration:**
  ```bash
  sudo nginx -t
  sudo systemctl status nginx
  ```

---

## 👤 Author & Maintainer

* **Developer:** Alfan / Mahardhika
* **Repository:** [Alfan2005/uptime-monitor-saas](https://github.com/Alfan2005/uptime-monitor-saas)