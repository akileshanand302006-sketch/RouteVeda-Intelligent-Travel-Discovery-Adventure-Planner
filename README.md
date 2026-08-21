Here is the complete, properly formatted, and structured **`README.md`** content for **TripForge**:

```markdown
# 🏕️ TripForge — Smart Adventure Trip Builder

> *“Discover India. Design your journey. Create memories.”*

[![Angular](https://img.shields.io/badge/Angular-20%2B-DD0031.svg?logo=angular&logoColor=white)](https://angular.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6.svg?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20%2B-339933.svg?logo=node.js&logoColor=white)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16%2B-4169E1.svg?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![PostGIS](https://img.shields.io/badge/PostGIS-3.x-336791.svg)](https://postgis.net/)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-7952B3.svg?logo=bootstrap&logoColor=white)](https://getbootstrap.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

**TripForge** is a premium full-stack travel planning platform built with **Angular**, **Node.js / Express**, **PostgreSQL**, and **PostGIS**. It helps travelers discover hidden gems across India, explore tourist attractions, build personalized day-by-day itineraries, calculate live budgets, manage wishlists, export professional PDF dossiers, and receive intelligent recommendations through a modern **Liquid Glass** interface.

---

## 🌟 Key Features

- 🗺️ **Explore India**: Discover curated destinations across all 28 states and 8 Union Territories.
- 🔎 **Smart Search & Filtering**: Multi-dimensional filtering by destination, state, travel category, difficulty level, rating, and budget.
- 🏛️ **Tourist Attractions**: Explore forts, temples, beaches, waterfalls, lakes, wildlife sanctuaries, and UNESCO heritage sites.
- 🧭 **Smart Trip Builder**: 7-step interactive builder to pick destinations categorized by state, customize dates, add activities, and generate full day-by-day schedules.
- 💰 **Live Budget & Expense Matrix**: Automated cost breakdown for accommodations, dining, transit, activities, and contingency funds.
- 📄 **Detailed PDF Dossier Export**: Generate and download multi-page, formatted trip itineraries with packing checklists, budget tables, and emergency helplines.
- ❤️ **Interactive Wishlist**: Save destinations instantly with reactive state sync.
- 👤 **Personal Profiles & Travel Stats**: Track total trips created, destinations explored, bucket lists, and personal travel styles.
- 🧠 **Smart Recommendations & Finder Quiz**: Intelligent suggestions based on user travel preferences and personality matches.
- 📍 **PostGIS Geospatial Discovery**: Real-time radius queries to discover nearby attractions and destinations.
- 🏆 **Achievement Badges**: Earn adventure milestones and badges based on travel planning activity.
- ☀️🌙 **Liquid Glass Light / Dark Theme**: Premium glassmorphic design with persistent theme preferences and smooth micro-interactions.
- 🔐 **User Authentication & Data Isolation**: Secure registration, login, JWT authentication, and isolated user data storage.

---

## 🖼️ Authentic Imagery & Data Architecture

TripForge avoids generic stock photos by combining live APIs and curated datasets:

```
                  Destination Data
                         │
        ┌────────────────┴────────────────┐
        ▼                                 ▼
Wikimedia Commons API             Google Places API (New)
        │                                 │
Authentic Cultural Photos         Ratings, Coordinates & Place IDs
        └────────────────┬────────────────┘
                         ▼
               ImageLoaderComponent
                         ▼
                   TripForge UI
```

- **Wikimedia Commons API**: Authentic photography for regional delicacies, cultural festivals, and state monuments.
- **Google Places API (New)**: Verified ratings, review counts, coordinates, and location metadata.

---

## 🎨 Premium Liquid Glass UI/UX

- **Glassmorphism**: Backdrop blurs (`backdrop-filter: blur(16px)`), translucent surfaces, soft specular borders, and dynamic ambient glows.
- **Adaptive Themes**:
  - ☀️ **Light Theme**: Crisp frosted glass, luminous indigo accents, and soft atmospheric shadows.
  - 🌙 **Dark Theme**: Deep slate glass surfaces with neon purple/blue edge highlights and high contrast typography.

---

## 📍 PostGIS Geospatial Capabilities

```
User Coordinates (Lat, Lng) ──➔ PostGIS ST_DWithin ──➔ Radius Search (50km / 100km) ──➔ Nearby Destinations
```

- Real geographic distance calculations using spatial indexes on PostGIS geometry columns.
- Proximity-based exploration without client-side heavy distance calculations.

---

## 🧭 Trip Planning Workflow

```
1. Explore Destinations / India 36
        ↓
2. Add to Trip Queue or Instant Save
        ↓
3. Smart Trip Builder (7-Step Wizard)
   ├── Step 1: Trip Identity & Travelers
   ├── Step 2: Pick Destinations (Categorized by State)
   ├── Step 3: Select Start & End Dates (Auto-calculated Duration)
   ├── Step 4: Choose Travel Style (Adventure, Nature, Luxury, etc.)
   ├── Step 5: Select Curated Activities
   ├── Step 6: Set Target Budget & Review Live Breakdown
   └── Step 7: Finalize & Generate Itinerary
        ↓
4. Manage in "My Trips" Dashboard
        ↓
5. Download Detailed PDF Dossier
```

---

## 🏗️ System Architecture

```
                                  TripForge Client
                                 (Angular Frontend)
                                         │
                                   Angular Services
                              (Signals & HttpClient)
                                         │
                                         ▼
                                Node.js / Express API
                               (REST Controllers & Auth)
                                         │
                        ┌────────────────┴────────────────┐
                        ▼                                 ▼
                PostgreSQL Database                PostGIS Extension
             (Users, Trips, Wishlist)             (Spatial Geometries)
                        │                                 │
            ┌───────────┴───────────┐                     │
            ▼                       ▼                     │
    Google Places API       Wikimedia Commons             │
      (Place Details)          (Photography)              │
            └───────────────────────┬─────────────────────┘
                                    ▼
                         Rendered Travel Platform
```

---

## 🗄️ Database Schema Overview

The relational PostgreSQL schema includes:

| Category | Tables |
| :--- | :--- |
| **Users & Profiles** | `users`, `profiles`, `user_preferences` |
| **Geographic & Tourism** | `states`, `destinations`, `destination_images`, `attractions` |
| **Activities & Culture** | `activities`, `destination_activities`, `foods`, `festivals` |
| **Trips & Itineraries** | `trips`, `trip_destinations`, `trip_activities` |
| **Engagement** | `wishlists`, `reviews`, `achievements`, `user_achievements`, `notifications` |

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Angular (Standalone Components, Signals reactive model)
- **Language**: TypeScript 5.x
- **Routing**: Angular Router with lazy loading and scroll restoration
- **Styling**: Vanilla CSS (Liquid Glass Tokens) + Bootstrap 5.3 utilities
- **Document Generation**: `jspdf` for high-resolution PDF itinerary dossiers

### Backend
- **Runtime**: Node.js 20+
- **Framework**: Express.js with TypeScript (`tsx`)
- **Security**: JWT authentication, bcrypt password hashing, CORS, parameterized SQL
- **Database Driver**: `pg` (node-postgres) with connection pooling

### Database & Spatial
- **Database**: PostgreSQL 16+
- **Spatial Engine**: PostGIS 3.x

---

## 📁 Project Structure

```
tripforge/
├── src/                          # Angular Frontend Application
│   ├── app/
│   │   ├── core/                 # Singleton services, guards, interceptors
│   │   │   └── services/         # Trip, Auth, Destination, PDF, Food services
│   │   ├── layout/               # Navbar (Liquid Glass capsule), Footer
│   │   ├── models/               # Strongly typed TypeScript interfaces
│   │   ├── pages/                # Page routed components
│   │   │   ├── home/             # Main Dashboard & Interactive Overview
│   │   │   ├── explore/          # Search & Multi-Filter Catalog
│   │   │   ├── trip-builder/     # 7-Step Smart Trip Builder
│   │   │   ├── my-trips/         # Saved Trips, Itineraries & PDF Export
│   │   │   ├── destination-details/ # Deep Dive, Attractions & Maps
│   │   │   ├── food-explorer/    # Regional Culinary Specialties
│   │   │   └── festivals/        # Cultural Festival Calendar
│   │   └── shared/               # Reusable UI components & directives
│   ├── styles.css                # Global Design Tokens & Liquid Glass theme
│   └── index.html                # Entry HTML with Outfit & Inter typography
│
├── server/                       # Node.js Express REST API
│   ├── src/
│   │   ├── controllers/          # Request handlers & DB queries
│   │   ├── routes/               # API route definitions
│   │   ├── middleware/           # Auth validation & error handling
│   │   ├── config/               # DB connection & PostGIS initialization
│   │   └── seed/                 # Database seeding engine
│   └── migrations/               # SQL schema definitions
│
├── public/                       # Static Assets & JSON Datasets
│   └── data/                     # destinations.json, food.json, festivals.json
├── scripts/                      # Automated dataset generators
└── package.json                  # Scripts & dependencies
```

---

## 🔌 Core API Endpoints

### 🔐 Authentication
- `POST /api/auth/register` — Register a new traveler account
- `POST /api/auth/login` — Authenticate and receive session
- `POST /api/auth/logout` — End user session
- `GET  /api/auth/me` — Get authenticated traveler profile

### 🗺️ Destinations & Attractions
- `GET  /api/destinations` — Get all destinations (with state & category filters)
- `GET  /api/destinations/:id` — Get single destination details
- `GET  /api/destinations/nearby` — Radius-based geospatial search via PostGIS
- `GET  /api/attractions` — Get tourist landmarks and sites

### 🧭 Trips & Itineraries
- `GET    /api/trips` — Get current user's saved trips
- `GET    /api/trips/:id` — Get specific trip itinerary
- `POST   /api/trips` — Save newly built trip
- `PUT    /api/trips/:id` — Update trip details or status
- `DELETE /api/trips/:id` — Delete trip from database

### 🍲 Discoveries & Culture
- `GET  /api/foods` — Regional culinary specialties
- `GET  /api/festivals` — Cultural festival calendar
- `GET  /api/activities` — Adventure sports and curated experiences

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: `v20.x` or later
- **PostgreSQL**: `v16.x` or later with **PostGIS** extension installed

### 2. Clone Repository
```bash
git clone https://github.com/YOUR_USERNAME/tripforge.git
cd tripforge
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Database Setup & Environment Variables
Create `.env` in the root directory:
```env
PORT=3000
DATABASE_URL=postgresql://postgres:password@localhost:5432/tripforge_db
JWT_SECRET=your_jwt_super_secret_key
CLIENT_URL=http://localhost:4200
```

Initialize the database in PostgreSQL:
```sql
CREATE DATABASE tripforge_db;
\c tripforge_db
CREATE EXTENSION IF NOT EXISTS postgis;
```

### 5. Run Migrations & Seed Data
```bash
# Seed all destinations, attractions, food, festivals, and demo accounts
npm run db:seed
```

### 6. Start the Application
```bash
# Start Backend REST Server (Port 3000)
npm run server

# In another terminal, start Angular Development Server (Port 4200)
npm start
```

Visit **`http://localhost:4200`** in your browser.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**🏕️ TripForge**  
*Explore • Plan • Discover • Travel*

Built with Angular, Node.js, PostgreSQL & PostGIS

</div>
```
