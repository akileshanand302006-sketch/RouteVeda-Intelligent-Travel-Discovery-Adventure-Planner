<div align="center">

# 🏕️ RouteVeda

### Intelligent Travel Discovery & Adventure Planner

**Discover India. Design Your Journey. Create Memories.**

<p>
  <a href="https://routeveda.netlify.app">
    <img src="https://img.shields.io/badge/%F0%9F%9A%80%20EXPLORE%20ROUTEVEDA-Live%20Web%20App-6C5CE7?style=for-the-badge&logo=netlify&logoColor=white" alt="Explore RouteVeda Live">
  </a>
</p>

<p>
  <a href="https://routeveda.netlify.app">
    <img src="https://img.shields.io/badge/%F0%9F%97%BA%EF%B8%8F%20LAUNCH%20LIVE%20APP-routeveda.netlify.app-00B894?style=for-the-badge&logo=googlechrome&logoColor=white" alt="RouteVeda Live Application">
  </a>
</p>

<br>

<img src="https://img.shields.io/badge/Angular-20%2B-DD0031.svg?logo=angular&logoColor=white">
<img src="https://img.shields.io/badge/TypeScript-5.x-3178C6.svg?logo=typescript&logoColor=white">
<img src="https://img.shields.io/badge/Node.js-20%2B-339933.svg?logo=node.js&logoColor=white">
<img src="https://img.shields.io/badge/Express.js-REST%20API-000000.svg?logo=express&logoColor=white">
<img src="https://img.shields.io/badge/PostgreSQL-16%2B-4169E1.svg?logo=postgresql&logoColor=white">
<img src="https://img.shields.io/badge/PostGIS-3.x-336791.svg">
<img src="https://img.shields.io/badge/Bootstrap-5.3-7952B3.svg?logo=bootstrap&logoColor=white">
<img src="https://img.shields.io/badge/License-MIT-green.svg">

<br><br>

> **A modern full-stack travel platform for discovering destinations, exploring attractions, creating personalized journeys and planning trips across India.**

</div>

---

# 🌏 About RouteVeda

**RouteVeda** is a premium full-stack travel discovery and journey planning platform designed to make exploring India more intelligent, visual and personalized.

Instead of simply displaying a list of tourist destinations, RouteVeda combines:

- 🗺️ Destination discovery
- 🔎 Intelligent search and filtering
- 📍 Geospatial discovery using PostGIS
- 🧭 Personalized trip planning
- 💰 Budget estimation
- ❤️ Wishlist management
- 🏛️ Tourist attraction discovery
- ⭐ Reviews and ratings
- 🧠 Personalized recommendations
- 🖼️ Authentic destination imagery
- 🔐 Secure authentication
- 🎨 Premium Liquid Glass UI
- ☀️🌙 Light and Dark themes
- 📱 Responsive cross-device experience

The platform is built using **Angular + Node.js + Express.js + PostgreSQL + PostGIS**, with integrations for **Google Places** and **Wikimedia Commons**.

---

# 🚀 Live Application

<div align="center">

### 🌐 Experience RouteVeda

<a href="https://routeveda.netlify.app">

<img src="https://img.shields.io/badge/%F0%9F%9A%80%20OPEN%20ROUTEVEDA-Live%20Application-6C5CE7?style=for-the-badge&logo=netlify&logoColor=white" alt="Open RouteVeda">

</a>

<br><br>

**Live URL:**  
https://routeveda.netlify.app

</div>

---

# ✨ Core Features

| Feature | Description |
|---|---|
| 🗺️ **Explore India** | Discover destinations across 28 states and 8 Union Territories |
| 🔎 **Smart Search** | Search destinations using multiple filters |
| 🏛️ **Attractions** | Explore temples, forts, beaches, waterfalls, wildlife, heritage sites and more |
| 🧭 **Trip Builder** | Create personalized trips with destinations, activities, dates and travelers |
| 💰 **Budget Planner** | Estimate trip expenses based on trip parameters |
| ❤️ **Wishlist** | Save destinations for future exploration |
| 👤 **Personal Profiles** | Manage profile and travel preferences |
| 🧠 **Recommendations** | Discover destinations based on preferences and interactions |
| 📍 **Nearby Search** | Find destinations within a selected geographic radius |
| ⭐ **Reviews & Ratings** | View and manage destination reviews |
| 🏆 **Achievements** | Earn travel badges based on exploration activity |
| 🕒 **Real-Time Information** | Dynamic date and application state |
| ☀️🌙 **Theme System** | Premium Light and Dark themes |
| 📱 **Responsive UI** | Optimized for desktop, tablet and mobile |

---

# 🎨 Premium Liquid Glass Experience

RouteVeda is designed to feel like a modern commercial travel product rather than a conventional academic application.

The interface uses a **Liquid Glass / Glassmorphism design language** throughout the application.

### ✨ Visual System

- 🪟 Translucent glass surfaces
- 🌫️ Backdrop blur
- 💎 Glassmorphism
- ✨ Glow effects
- 🌈 Gradient accents
- 🌑 Soft shadows
- 🌀 Smooth transitions
- 🎞️ Animated cards
- 🫧 Floating controls
- 🎯 Micro-interactions
- 🖼️ Cinematic backgrounds
- 📱 Responsive layouts

### ☀️ Light Mode

Bright translucent surfaces combined with soft shadows and atmospheric blue/purple accents.

### 🌙 Dark Mode

Deep glass surfaces, luminous borders, controlled glow and immersive travel-oriented backgrounds.

Both themes share the same component architecture, spacing system and responsive design principles.

---

# 🗺️ Explore India

RouteVeda provides a structured discovery experience covering:

### 🇮🇳 28 States

Explore destinations, attractions, activities and travel information across India's states.

### 🏝️ 8 Union Territories

Discover destinations ranging from metropolitan regions to islands, heritage locations and Himalayan landscapes.

The discovery experience supports filtering by:

- State
- Destination
- Category
- Activity
- Rating
- Budget
- Duration
- Location

---

# 📍 Intelligent Geospatial Discovery

One of RouteVeda's key technical capabilities is **PostGIS-powered geographic search**.

Instead of calculating geographic distances manually inside the frontend, RouteVeda uses PostgreSQL + PostGIS for spatial operations.

```text
                User Location
                      │
                      ▼
             Latitude + Longitude
                      │
                      ▼
                  PostGIS
                      │
                      ▼
              Spatial Query
                      │
                      ▼
              Radius Search
                      │
                      ▼
          Nearby Destinations
````

Users can discover destinations within a selected radius such as:

```text
10 km
25 km
50 km
100 km
250 km
```

### PostGIS Capabilities

* 🌐 Geographic coordinates
* 📐 Distance calculations
* 🔍 Radius-based searches
* ⚡ Spatial indexing
* 📍 Nearby destination discovery
* 🧠 Location-based recommendations

---

# 🧭 Smart Trip Builder

RouteVeda provides an end-to-end journey planning workflow.

```text
Register / Login
       │
       ▼
    Dashboard
       │
       ▼
   Explore India
       │
       ▼
 Select Destination
       │
       ▼
 View Attractions
       │
       ▼
 Add to Wishlist / Trip
       │
       ▼
 Select Activities
       │
       ▼
 Set Dates & Travelers
       │
       ▼
 Calculate Budget
       │
       ▼
 Build Itinerary
       │
       ▼
    Save Trip
       │
       ▼
     My Trips
```

The planner allows users to organize destinations, activities, dates, travelers, budgets and itinerary order into a structured trip.

---

# 💰 Budget Planning

RouteVeda provides trip-level budget estimation based on factors such as:

* Number of travelers
* Trip duration
* Selected destinations
* Selected activities
* Planned itinerary

This allows users to understand the estimated cost of a journey before finalizing the trip.

---

# ❤️ Wishlist & Personalization

Users can save destinations they want to explore later.

The platform maintains user-specific:

```text
Wishlist
Trips
Preferences
Profile
Reviews
Recently Viewed
Achievements
Notifications
```

Each user's data is isolated through authenticated backend operations.

---

# 🧠 Recommendation System

RouteVeda is designed around personalized discovery.

Recommendations can use information such as:

* Travel preferences
* Interests
* Previous interactions
* Selected destinations
* Activity preferences
* Location context

This creates a more personalized travel discovery experience instead of presenting the same destinations to every user.

---

# 🖼️ Authentic Destination Images

RouteVeda uses a dedicated image architecture instead of relying on random stock imagery.

### Wikimedia Commons Integration

Destination imagery is obtained through the **Wikimedia Commons API**.

```text
Destination
     │
     ▼
Wikimedia Commons API
     │
     ▼
Relevant Image Search
     │
     ▼
Destination Image
     │
     ▼
ImageLoaderComponent
     │
     ▼
RouteVeda UI
```

The application also includes image loading, caching and fallback handling to improve reliability.

---

# 📍 Google Places Integration

The **Google Places API (New)** is used for place-specific information where applicable.

The integration supports information such as:

* Google Place ID
* Geographic information
* Ratings
* Maps information
* Place details
* Photos where applicable

RouteVeda combines:

```text
PostgreSQL
      +
PostGIS
      +
Google Places
      +
Wikimedia Commons
      ↓
Complete Travel Discovery Experience
```

---

# 🏗️ System Architecture

```text
                         ┌──────────────────────┐
                         │      RouteVeda       │
                         │    Web Application   │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │ Angular Frontend     │
                         │ TypeScript            │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │ Angular Services     │
                         │ HTTP Client           │
                         └──────────┬───────────┘
                                    │
                                    │ REST API
                                    ▼
                         ┌──────────────────────┐
                         │ Node.js + Express.js │
                         │ Backend               │
                         └──────────┬───────────┘
                                    │
                     ┌──────────────┼──────────────┐
                     │              │              │
                     ▼              ▼              ▼
              PostgreSQL         PostGIS      External APIs
                     │              │          │
                     │              │          ├─ Google Places
                     │              │          └─ Wikimedia
                     │              │
                     ▼              ▼
              Application Data   Spatial Data
```

---

# 🗄️ Database Architecture

RouteVeda uses **PostgreSQL** as its primary relational database and **PostGIS** for geographic functionality.

### Core Entities

```text
users
profiles
user_preferences

states
destinations
destination_images
attractions

activities
destination_activities

trips
trip_destinations
trip_activities

wishlists
reviews
recently_viewed

achievements
user_achievements
notifications
```

### PostgreSQL Provides

* Relational data management
* Foreign keys
* Constraints
* Transactions
* Indexing
* Search
* Data integrity
* User data isolation

### PostGIS Provides

* Geographic data
* Spatial indexing
* Distance calculations
* Radius queries
* Nearby searches
* Location-based discovery

---

# 🔐 Authentication & Security

RouteVeda includes a protected authentication architecture.

### Authentication Features

* 🔐 User registration
* 🔑 Login
* 🚪 Logout
* 🔒 Password hashing
* 🛡️ Authentication middleware
* 🚧 Protected routes
* 👤 Profile management
* 🧳 User-specific trips
* ❤️ User-specific wishlists
* ⚙️ User preferences

### User Data Isolation

```text
User A
 ├── Trips
 ├── Wishlist
 ├── Preferences
 └── Reviews

User B
 ├── Trips
 ├── Wishlist
 ├── Preferences
 └── Reviews
```

Users cannot access another user's private application data through normal authenticated operations.

---

# ⚡ Angular Architecture

RouteVeda demonstrates practical modern Angular development.

### Angular Concepts

* Angular Components
* TypeScript
* Angular Signals
* Angular Services
* Angular Router
* Route Guards
* HTTP Client
* Reactive state
* Data binding
* Built-in directives
* Forms and validation
* Responsive UI architecture

### Main Services

```text
AuthService
DestinationService
TripService
WishlistService
ProfileService
ActivityService
RecommendationService
GooglePlacesService
WikimediaImageService
```

---

# 🛠️ Technology Stack

## Frontend

```text
Angular 20+
TypeScript 5.x
Angular Signals
Angular Router
Bootstrap 5.3
HTML5
CSS3 / SCSS
```

## Backend

```text
Node.js 20+
Express.js
TypeScript
REST API
Authentication Middleware
```

## Database

```text
PostgreSQL 16+
PostGIS 3.x
```

## External APIs

```text
Google Places API (New)
Wikimedia Commons API
```

## UI / UX

```text
Liquid Glass
Glassmorphism
Responsive Design
CSS Animations
Micro-interactions
Light / Dark Themes
```

---

# 📁 Project Structure

```text
RouteVeda/
│
├── client/
│   └── src/
│       ├── app/
│       │   ├── components/
│       │   ├── pages/
│       │   ├── services/
│       │   ├── guards/
│       │   ├── directives/
│       │   └── models/
│       │
│       ├── assets/
│       └── styles/
│
├── server/
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── seed/
│   │   └── config/
│   │
│   ├── migrations/
│   └── package.json
│
├── database/
├── .env.example
├── package.json
└── README.md
```

---

# 🧭 Main Application Routes

```text
/                       → Dashboard
/explore                → Explore India
/destinations           → Destinations
/destinations/:id       → Destination Details
/attractions            → Tourist Attractions
/discover               → Discovery Tools
/planner                → Planner Tools
/trips                  → My Trips
/wishlist               → Wishlist
/profile                → Profile
/login                  → Login
/register               → Registration
/**                     → 404
```

---

# 🔌 Core REST API

## Authentication

```http
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me
```

## Destinations

```http
GET    /api/destinations
GET    /api/destinations/:id
GET    /api/destinations/search
GET    /api/destinations/nearby
```

## Trips

```http
GET    /api/trips
GET    /api/trips/:id
POST   /api/trips
PUT    /api/trips/:id
DELETE /api/trips/:id
```

## Wishlist

```http
GET    /api/wishlist
POST   /api/wishlist
DELETE /api/wishlist/:destinationId
```

## Profile

```http
GET    /api/profile
PUT    /api/profile
```

## Reviews

```http
GET    /api/destinations/:id/reviews
POST   /api/destinations/:id/reviews
```

---

# 🚀 Getting Started

## 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/RouteVeda.git
cd RouteVeda
```

---

## 2. Install Frontend Dependencies

```bash
cd client
npm install
```

---

## 3. Install Backend Dependencies

```bash
cd ../server
npm install
```

---

## 4. Create PostgreSQL Database

```sql
CREATE DATABASE routeveda_db;
```

Enable PostGIS:

```sql
CREATE EXTENSION IF NOT EXISTS postgis;
```

---

## 5. Configure Environment Variables

Create a `.env` file inside the backend.

```env
PORT=5000

DATABASE_URL=postgresql://username:password@localhost:5432/routeveda_db

JWT_SECRET=your_secret_key

GOOGLE_PLACES_API_KEY=your_api_key

CLIENT_URL=http://localhost:4200
```

> Never commit `.env` files or production secrets to GitHub.

---

## 6. Run Database Migrations

```bash
npm run migrate
```

---

## 7. Seed Database

```bash
npm run seed
```

---

## 8. Validate Database

```bash
npm run validate-db
```

---

## 9. Start Backend

```bash
npm run dev
```

---

## 10. Start Angular Frontend

Open another terminal:

```bash
cd client
npm start
```

Open:

```text
http://localhost:4200
```

---

# 🧪 Testing

Major application workflows include:

```text
✓ Registration
✓ Login
✓ Logout
✓ Profile management
✓ Destination search
✓ State filtering
✓ Category filtering
✓ Nearby PostGIS search
✓ Trip creation
✓ Trip editing
✓ Trip deletion
✓ Wishlist management
✓ Reviews
✓ Recommendations
✓ Form validation
✓ Pagination
✓ Google Places integration
✓ Wikimedia image loading
✓ Light / Dark themes
✓ Responsive layouts
✓ User data isolation
```

---

# 🎓 Academic & Resume Value

RouteVeda demonstrates practical full-stack development across multiple areas.

### Frontend Engineering

* Angular architecture
* TypeScript
* Components
* Signals
* Services
* Routing
* Route guards
* Forms
* Validation
* REST API integration
* Responsive UI

### Backend Engineering

* Node.js
* Express.js
* REST APIs
* Authentication
* Middleware
* Validation
* CRUD operations

### Database Engineering

* PostgreSQL
* Relational database design
* Normalization
* Foreign keys
* Constraints
* Transactions
* Indexing
* PostGIS
* Spatial queries

### API Integration

* Google Places API
* Wikimedia Commons API
* Geospatial services

### Product Engineering

* Authentication
* Personalization
* Recommendation architecture
* Trip planning
* Budget planning
* Responsive design
* Modern UI/UX

---

# 🔮 Future Enhancements

Planned expansion possibilities include:

```text
🤖 AI-powered itinerary generation
🧠 AI travel assistant
🌦️ Real-time weather integration
🏨 Hotel & accommodation discovery
🚆 Transportation recommendations
🗺️ Interactive travel maps
👥 Collaborative trip planning
🔔 Smart travel notifications
🌐 Multi-language support
📱 Dedicated mobile application
🛠️ Admin dashboard
☁️ Expanded cloud deployment
```

---

# 🌐 Deployment

RouteVeda is designed for modern cloud deployment.

### Frontend

```text
Angular
      ↓
Netlify
      ↓
https://routeveda.netlify.app
```

### Backend

```text
Node.js + Express
      ↓
Cloud Hosting
      ↓
REST API
```

### Database

```text
PostgreSQL
      +
PostGIS
```

### External Services

```text
Google Places API
Wikimedia Commons API
```

---

# 🧩 Engineering Highlights

RouteVeda focuses on more than simply creating pages.

The application demonstrates:

```text
Modern Frontend Architecture
          +
RESTful Backend
          +
Relational Database
          +
Geospatial Computing
          +
Authentication
          +
External API Integration
          +
Personalization
          +
Responsive UI
          +
Production-Oriented Architecture
```

This makes RouteVeda a complete **full-stack travel technology project** rather than a static travel website.

---

# 📊 High-Level Data Flow

```text
                     USER
                      │
                      ▼
              Angular Application
                      │
                      ▼
                Angular Services
                      │
                      ▼
                 REST API
                      │
                      ▼
              Express.js Server
                      │
          ┌───────────┼───────────┐
          │           │           │
          ▼           ▼           ▼
     PostgreSQL    PostGIS    External APIs
          │           │           │
          │           │       ┌───┴────────┐
          │           │       │            │
          │           │       ▼            ▼
          │           │   Google Places  Wikimedia
          │           │
          └───────────┴──────────────┐
                                     ▼
                              RouteVeda UI
```

---

# 🌟 Why RouteVeda?

RouteVeda brings multiple areas of software engineering together into one application:

**Travel Discovery**

*

**Trip Planning**

*

**Personalization**

*

**Geospatial Computing**

*

**REST APIs**

*

**Database Engineering**

*

**Modern UI/UX**

=

## 🏕️ RouteVeda

### A complete digital journey planning platform.

---

# 📜 License

This project is available under the **MIT License**.

---

<div align="center">

# 🏕️ RouteVeda

### Explore • Plan • Discover • Travel

Built with ❤️ using

**Angular • TypeScript • Node.js • Express • PostgreSQL • PostGIS**

<br>

<a href="https://routeveda.netlify.app">

<img src="https://img.shields.io/badge/%F0%9F%9A%80%20START%20YOUR%20JOURNEY-Visit%20RouteVeda-6C5CE7?style=for-the-badge&logo=netlify&logoColor=white" alt="Visit RouteVeda">

</a>

<br><br>


</div>
