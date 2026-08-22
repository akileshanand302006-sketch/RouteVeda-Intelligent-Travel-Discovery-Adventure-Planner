🏕️ RouteVeda — Smart Travel Discovery & Journey Planner

“Discover India. Design your journey. Create memories.”

[![Angular](https://img.shields.io/badge/Angular-20%2B-DD0031.svg?logo=angular&logoColor=white)](https://angular.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6.svg?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20%2B-339933.svg?logo=node.js&logoColor=white)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16%2B-4169E1.svg?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![PostGIS](https://img.shields.io/badge/PostGIS-3.x-336791.svg)](https://postgis.net/)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-7952B3.svg?logo=bootstrap&logoColor=white)](https://getbootstrap.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

RouteVeda is a premium full-stack travel planning application built with Angular, Node.js, Express.js, PostgreSQL and PostGIS. It helps users discover destinations across India, explore attractions, build personalized itineraries, manage wishlists and receive travel recommendations through a modern Liquid Glass interface.

🌟 Features

🗺️ Explore India — Discover destinations across 28 states and 8 Union Territories.

🔎 Smart Search & Filtering — Search and filter by destination, state, category, activity, rating, budget and duration.

🏛️ Tourist Attractions — Explore forts, temples, beaches, waterfalls, lakes, wildlife, heritage sites and more.

🧭 Smart Trip Builder — Create trips with destinations, activities, dates, travelers, budget and itinerary order.

💰 Budget Planning — Estimate trip expenses based on travelers, duration and selected destinations.

❤️ Wishlist — Save destinations for future trips.

👤 Personal Profiles — Manage profile, travel preferences, trips and personalized information.

🧠 Recommendations — Suggest destinations based on preferences, interests and previous interactions.

📍 Nearby Destinations — Find destinations within a selected radius using PostGIS.

⭐ Reviews & Ratings — View and manage destination reviews.

🏆 Achievements — Earn travel badges based on exploration activity.

🕒 Real-Time Information — Live date and time with dynamic application state.

☀️🌙 Light/Dark Theme — Premium theme switching with persistent preferences.

📱 Responsive Design — Optimized for desktop, tablet and mobile.

🔐 Authentication — Registration, login, logout, protected routes and user-specific data.

🖼️ Authentic Destination Images

RouteVeda uses a dedicated image architecture instead of random stock images.

Wikimedia Commons

Real destination photography is obtained through the Wikimedia Commons API.

Destination
     ↓
Wikimedia Commons API
     ↓
Relevant Image Search
     ↓
Original Destination Image
     ↓
ImageLoaderComponent
     ↓
RouteVeda UI

The application includes image loading, caching and fallback handling to improve reliability.

Google Places API

The Google Places API (New) is used for place-specific information such as:

Google Place ID

Geographic information

Ratings

Maps information

Place details

Photos where applicable

The architecture combines PostgreSQL application data + Google Places information + Wikimedia imagery.

🎨 Premium UI/UX

RouteVeda is designed to look like a modern commercial travel platform rather than a traditional college project.

Liquid Glass Design

Glassmorphism

Backdrop blur

Transparency

Glow effects

Soft shadows

Gradient accents

Animated cards

Micro-interactions

Floating controls

Cinematic backgrounds

Smooth transitions

Themes

☀️ Light Theme

Bright glass surfaces, soft shadows and subtle blue/purple atmospheric effects.

🌙 Dark Theme

Deep translucent surfaces, luminous borders and controlled purple/blue glow.

Both themes share the same component structure, spacing and design system.

📍 PostGIS Geospatial Search

PostGIS provides real geographic functionality instead of calculating distances manually in JavaScript.

User Location
     ↓
Latitude + Longitude
     ↓
PostGIS
     ↓
Radius Search
     ↓
Nearby Destinations

Users can search for destinations within a selected radius, such as 50 km or 100 km.

PostGIS features include:

Geographic coordinates

Spatial indexes

Distance calculations

Radius searches

Nearby destinations

Location-based recommendations

🧭 Trip Planning Workflow

Login / Register
       ↓
Dashboard
       ↓
Explore India
       ↓
Select Destination
       ↓
View Details & Attractions
       ↓
Add to Wishlist / Trip
       ↓
Select Activities
       ↓
Set Dates & Travelers
       ↓
Calculate Budget
       ↓
Build Itinerary
       ↓
Save Trip
       ↓
My Trips

⚛️ Angular Concepts Demonstrated

RouteVeda demonstrates practical modern Angular concepts:

Angular Components — Reusable UI components and pages.

TypeScript — Strongly typed application development.

Angular Signals — Reactive state management.

Angular Services — API communication and business logic.

Angular Router — SPA navigation and route parameters.

Data Binding — Interpolation, property binding, event binding and two-way binding.

Built-in Directives — Conditional rendering, iteration, dynamic classes and styles.

Forms & Validation — Required, email, length, numeric and date validations.

HTTP Client — Communication with the backend REST API.

Route Guards — Protection of authenticated pages.

Main Services

AuthService
DestinationService
TripService
WishlistService
ProfileService
ActivityService
RecommendationService
GooglePlacesService
WikimediaImageService

🏗️ System Architecture

                    RouteVeda
                        │
                  Angular Frontend
                        │
                Angular Services
                        │
                     HttpClient
                        │
                 Node.js + Express
                        │
              ┌─────────┴─────────┐
              │                   │
        PostgreSQL             PostGIS
              │                   │
      Application Data      Spatial Queries
              │
        ┌─────┴─────┐
        │           │
 Google Places   Wikimedia Commons
        │           │
   Place Data      Images

🗄️ Database

RouteVeda uses PostgreSQL as the primary application database and PostGIS for geographic operations.

Core Data

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

PostgreSQL provides:

Relational data management

Foreign keys

Constraints

Transactions

Indexing

Search

User data isolation

PostGIS provides the geographic capabilities.

🔐 Authentication & User Isolation

RouteVeda provides:

Registration

Login

Logout

Password hashing

Authentication middleware

Protected routes

Profile management

User-specific trips

User-specific wishlists

User preferences

Each user's private data is isolated from other users.

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

🛠️ Tech Stack

Frontend

Angular

TypeScript

Angular Signals

Angular Router

Bootstrap

HTML5

CSS3 / SCSS

Backend

Node.js

Express.js

TypeScript

REST API

Database

PostgreSQL

PostGIS

External APIs

Google Places API (New)

Wikimedia Commons API

UI

Liquid Glass

Glassmorphism

Responsive Design

CSS Animations

Micro-interactions

📁 Project Structure

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
│   ├── migrations/
│   └── package.json
│
├── database/
├── .env.example
├── package.json
└── README.md

🗺️ Main Routes

/                    → Dashboard
/explore             → Explore India
/destinations        → Destinations
/destinations/:id    → Destination Details
/attractions         → Tourist Attractions
/discover            → Discovery Tools
/planner             → Planner Tools
/trips               → My Trips
/wishlist            → Wishlist
/profile             → Profile
/login               → Login
/register            → Registration
/**                  → 404

🚀 Installation

1. Clone the repository

git clone https://github.com/YOUR_USERNAME/RouteVeda.git
cd RouteVeda

2. Install dependencies

cd client
npm install

cd ../server
npm install

3. Create PostgreSQL database

CREATE DATABASE routeveda_db;

Enable PostGIS:

CREATE EXTENSION IF NOT EXISTS postgis;

4. Configure .env

PORT=5000
DATABASE_URL=postgresql://username:password@localhost:5432/tripforge_db
JWT_SECRET=your_secret_key
GOOGLE_PLACES_API_KEY=your_api_key
CLIENT_URL=http://localhost:4200

5. Run migrations

npm run migrate

6. Seed data

npm run seed

7. Validate database

npm run validate-db

8. Start backend

npm run dev

9. Start Angular

Open another terminal:

cd client
npm start

Open http://localhost:4200

🔌 Core API Endpoints

Authentication

POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me

Destinations

GET    /api/destinations
GET    /api/destinations/:id
GET    /api/destinations/search
GET    /api/destinations/nearby

Trips

GET    /api/trips
GET    /api/trips/:id
POST   /api/trips
PUT    /api/trips/:id
DELETE /api/trips/:id

Wishlist

GET    /api/wishlist
POST   /api/wishlist
DELETE /api/wishlist/:destinationId

Profile

GET    /api/profile
PUT    /api/profile

Reviews

GET    /api/destinations/:id/reviews
POST   /api/destinations/:id/reviews

🔒 Security

TripForge implements:

Secure password hashing

Authentication and authorization

Protected API routes

User data isolation

Input validation

Parameterized SQL queries

CORS configuration

Environment variables

No database credentials in Angular

No plaintext passwords

🧪 Testing

Major workflows include:

✓ Registration / Login / Logout
✓ Profile management
✓ Destination search
✓ State & category filtering
✓ Nearby PostGIS search
✓ Trip creation / editing / deletion
✓ Wishlist
✓ Reviews
✓ Recommendations
✓ Form validation
✓ Pagination
✓ Google Places integration
✓ Wikimedia image loading
✓ Light/Dark themes
✓ Responsive design
✓ User data isolation

🎓 Academic & Resume Value

RouteVeda demonstrates practical knowledge of:

Frontend

Angular architecture

Components

Signals

Services

Routing

Forms

Validation

REST API integration

Responsive UI

Backend

Node.js

Express.js

REST APIs

Authentication

Middleware

Validation

CRUD operations

Database

PostgreSQL

Relational database design

Normalization

Foreign keys

Constraints

Transactions

Indexing

PostGIS

Spatial queries

Integration

Google Places API

Wikimedia Commons API

Geospatial services

🔮 Future Enhancements

🤖 AI-powered itinerary generation

🧠 AI travel assistant

🌦️ Real-time weather integration

🏨 Hotel & accommodation discovery

🚆 Transportation recommendations

🗺️ Interactive travel maps

👥 Collaborative trip planning

🔔 Smart travel notifications

🌐 Multi-language support

📱 Mobile application

🛠️ Admin dashboard

☁️ Cloud deployment

📄 License

This project is available under the MIT License.

<div align="center">

🏕️ RouteVeda

Explore • Plan • Discover • Travel

Built with Angular, Node.js, PostgreSQL & PostGIS

</div>
