# 🚀 RouteVeda – Complete Production Deployment Guide

A step-by-step production deployment guide for deploying **RouteVeda** (Intelligent Travel Discovery & Adventure Planner) to **Netlify** (Frontend), **Render** (Backend), and **Neon PostgreSQL** (Database).

---

## 1. Prerequisites

Before starting deployment, ensure you have:
- **Node.js**: v20.x, v22.x LTS, or v24.x installed
- **Git**: Installed and configured
- **GitHub Account**: Repository pushed with the full RouteVeda codebase
- **Neon Account**: [https://neon.tech](https://neon.tech) (Free tier PostgreSQL with PostGIS support)
- **Render Account**: [https://render.com](https://render.com) (Free web service tier for Node.js)
- **Netlify Account**: [https://netlify.com](https://netlify.com) (Free tier for Angular SPA hosting)

---

## 2. PostgreSQL Provider Setup (Neon DB)

1. Sign in to [Neon Console](https://console.neon.tech).
2. Create a new project:
   - **Project Name**: `routeveda-db`
   - **Postgres Version**: `16` or `17` or `18` (Serverless)
   - **Region**: Select closest to your users (e.g. `US East (Ohio)` or `Asia Pacific (Singapore)`)
3. Neon automatically generates a default database named `neondb` and user `neondb_owner`.

---

## 3. Database Creation & Extensions

RouteVeda uses **PostGIS** spatial coordinates for distance calculations and radius searches, plus **uuid-ossp** for unique entity IDs.

The migrations automatically enable:
```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";
```

Neon natively supports both extensions out of the box.

---

## 4. Database Connection String

In the Neon Console:
1. Click **Connection Details**.
2. Select **Connection string** with **Pooled connection** enabled.
3. Ensure SSL mode is set to `require` (`sslmode=require`).
4. Example connection string:
   ```text
   postgresql://neondb_owner:YOUR_PASSWORD@ep-wandering-fog-b4yqc5yk-pooler.c-6.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```

---

## 5. JSON Migration & Seeding System

RouteVeda automatically migrates all application datasets from JSON into relational PostgreSQL tables with PostGIS geography points.

### Migrations executed:
- `001_enable_postgis.sql`: Enables `uuid-ossp`, `postgis`, and creates `schema_migrations`
- `002_create_users_and_profiles.sql`: Creates `users`, `profiles`, and `user_preferences`
- `003_create_states.sql`: Creates `states` table (28 States + 8 Union Territories)
- `004_create_destinations.sql`: Creates `destinations` with PostGIS `geography(Point, 4326)`
- `005_create_activities_and_attractions.sql`: Creates `activities`, `destination_activities`, `attractions`, `foods`, `festivals`
- `006_create_trips_and_wishlists.sql`: Creates `trips`, `trip_destinations`, `trip_activities`, `wishlists`, `reviews`, `recently_viewed`
- `007_create_indexes_and_spatial.sql`: Creates GIST spatial indexes and foreign key indexes
- `008_create_experiences_and_itineraries.sql`: Creates `experiences`, `itineraries`, and `notifications`

### Run Migration Command:
```bash
npm run db:migrate
```

### Run Seeding Command:
```bash
npm run db:seed
```

### Run Validation Check:
```bash
npm run validate-db
```

---

## 6. Local Development

To run RouteVeda full-stack locally:

1. **Clone repository**:
   ```bash
   git clone https://github.com/YOUR_USER/RouteVeda.git
   cd RouteVeda
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure `.env`**:
   Copy `.env.example` to `.env` and add your Neon connection string:
   ```env
   PORT=3000
   NODE_ENV=development
   DATABASE_URL=postgresql://neondb_owner:YOUR_PASSWORD@ep-wandering-fog-b4yqc5yk-pooler.c-6.us-east-2.aws.neon.tech/neondb?sslmode=require
   JWT_SECRET=routeveda_super_secure_jwt_secret_key_2026_dev
   JWT_EXPIRES_IN=7d
   FRONTEND_URL=http://localhost:4200
   ```

4. **Run Backend Server** (Terminal 1):
   ```bash
   npm run server
   ```
   Backend listens at `http://localhost:3000/api`.

5. **Run Angular Frontend** (Terminal 2):
   ```bash
   npm start
   ```
   Angular opens at `http://localhost:4200`.

---

## 7. Backend Deployment to Render

1. Sign in to [Render Dashboard](https://dashboard.render.com).
2. Click **New +** → **Web Service**.
3. Connect your RouteVeda GitHub repository.
4. Configure the Web Service settings:
   - **Name**: `routeveda-backend`
   - **Region**: `Ohio (US East)` (matches Neon DB region)
   - **Branch**: `main`
   - **Root Directory**: Leave blank (monorepo root)
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run server:build`
   - **Start Command**: `npm run server:start`
   - **Instance Type**: `Free`
5. Under **Advanced** → **Health Check Path**, enter:
   ```text
   /api/health
   ```
6. Click **Create Web Service**.

---

## 8. Render Environment Variables

Add the following environment variables in Render under **Environment**:

| Key | Value | Description |
|---|---|---|
| `NODE_ENV` | `production` | Production environment flag |
| `PORT` | `10000` | Render listening port |
| `DATABASE_URL` | `postgresql://neondb_owner:***@ep-wandering-fog-b4yqc5yk-pooler.c-6.us-east-2.aws.neon.tech/neondb?sslmode=require` | Pooled Neon PostgreSQL connection string |
| `JWT_SECRET` | `generate-random-64-character-string` | Secret key for signing JWT tokens |
| `JWT_EXPIRES_IN` | `7d` | Token validity duration |
| `FRONTEND_URL` | `https://routeveda.netlify.app` | Netlify frontend URL for CORS |

---

## 9. Frontend Deployment to Netlify

1. Sign in to [Netlify Dashboard](https://app.netlify.com).
2. Click **Add new site** → **Import an existing project**.
3. Authorize GitHub and select the `RouteVeda` repository.
4. Configure Build settings:
   - **Base directory**: Leave blank (root)
   - **Build command**: `node ./node_modules/@angular/cli/bin/ng.js build --configuration production` (or `npm run build:prod`)
   - **Publish directory**: `dist/routeveda/browser`
5. Click **Deploy RouteVeda**.

---

## 10. Netlify Configuration (`netlify.toml` & `_redirects`)

Netlify automatically recognizes `netlify.toml` in the root:
```toml
[build]
  command = "node ./node_modules/@angular/cli/bin/ng.js build --configuration production"
  publish = "dist/routeveda/browser"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

`public/_redirects` guarantees that refreshing deep routes like `/india`, `/explore`, `/my-trips`, `/destination/:id` redirects to `/index.html` with status `200` (SPA routing).

---

## 11. CORS Configuration

RouteVeda uses dynamic CORS validation in `server/src/app.ts`:
- In **development**: Allows `http://localhost:4200` and `http://localhost:3000`.
- In **production**: Allows `FRONTEND_URL` and any Netlify preview deploy (`*.netlify.app`).

Once your Netlify site is live:
1. Copy the Netlify URL (e.g. `https://routeveda.netlify.app`).
2. Go to **Render Dashboard** → `routeveda-backend` → **Environment**.
3. Set `FRONTEND_URL` to `https://routeveda.netlify.app`.
4. Click **Save Changes**. Render will automatically redeploy with the updated CORS policy.

---

## 12. API URL Configuration (Angular Environments)

Angular routes all REST API requests through `src/app/core/config/api.config.ts`, which reads from:

- **Development** (`src/environments/environment.ts`):
  ```typescript
  export const environment = {
    production: false,
    apiUrl: 'http://localhost:3000/api'
  };
  ```

- **Production** (`src/environments/environment.prod.ts`):
  ```typescript
  export const environment = {
    production: true,
    apiUrl: 'https://routeveda-backend.onrender.com/api'
  };
  ```

> [!TIP]
> Update `apiUrl` in `src/environments/environment.prod.ts` with your actual Render service URL once generated.

---

## 13. Health-Check Testing

Verify backend deployment on Render:

```bash
curl https://routeveda-backend.onrender.com/api/health
```

Expected JSON response:
```json
{
  "status": "ok",
  "service": "RouteVeda REST API",
  "timestamp": "2026-09-22T01:30:00.000Z",
  "database": {
    "connected": true,
    "postgis": true,
    "version": "PostgreSQL 18.6 on aarch64-unknown-linux-gnu..."
  }
}
```

---

## 14. Production Testing Procedure

Test the live application end-to-end:

1. **Authentication**:
   - Register a new account (`/login` → Sign Up tab).
   - Sign in with credentials.
   - Verify JWT token stored in `localStorage` under `tf_auth_token`.
2. **Destinations Explorer**:
   - Navigate to `/explore`.
   - Search by keyword ("Temple", "Goa", "Himalayas").
   - Filter by Region ("North", "South"), Category, Difficulty, and Price.
   - View destination details at `/destination/:id`.
3. **Trip Planning & PostgreSQL Persistence**:
   - Open `/trip-builder`.
   - Complete the 7-step wizard and click **Save Trip**.
   - Navigate to `/my-trips` and verify the trip appears with all days, itinerary items, and budget breakdown.
   - Refresh browser page (`F5`) — trip remains intact from PostgreSQL.
4. **Wishlist**:
   - Click the Heart icon on any destination card.
   - Navigate to `/wishlist`.
   - Verify destination is saved in database.
   - Toggle heart off — destination is removed from database.
5. **Interactive Dashboard**:
   - Navigate to `/` (Home).
   - Verify live statistics (Total Destinations, Total Trips, Saved Budget).

---

## 15. Troubleshooting

| Issue | Cause | Solution |
|---|---|---|
| **Render Web Service Fails to Start** | Missing `DATABASE_URL` or SSL error | Ensure `DATABASE_URL` is set in Render environment and includes `sslmode=require`. |
| **Angular 404 on Refresh (Netlify)** | Missing SPA redirect rule | Ensure `public/_redirects` with `/* /index.html 200` exists. Verify publish directory is `dist/routeveda/browser`. |
| **CORS Policy Error in Browser Console** | Backend does not allow Netlify origin | Update `FRONTEND_URL` in Render environment to match your exact Netlify domain (including `https://`). |
| **Database Migration Timeout** | Neon cold start latency | `database.ts` is pre-configured with 10-second connection timeout (`connectionTimeoutMillis: 10000`). |
| **Login Error 401** | Invalid credentials or unseeded database | Ensure demo accounts are seeded via `npm run db:seed`. Default demo account: `demo1@routeveda.com` / `password123`. |

---

## 16. Redeployment Procedure

When making future updates to RouteVeda:

1. **Commit & Push to GitHub**:
   ```bash
   git add .
   git commit -m "feat: Add new travel destination features"
   git push origin main
   ```
2. **Automatic CI/CD**:
   - **Netlify**: Automatically detects commit on `main`, runs production build, and publishes updated SPA.
   - **Render**: Automatically detects commit on `main`, builds TypeScript backend (`npm run server:build`), and restarts service gracefully (`npm run server:start`).
