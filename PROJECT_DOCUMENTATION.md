# 🏕️ TripForge – Smart Adventure Trip Builder
## Comprehensive Project Documentation & Viva Guide

**Tagline**: *"Forge your journey. Explore more. Travel smarter."*

---

## 1. PROJECT OVERVIEW

TripForge is a modern, futuristic travel-planning platform built as a premium commercial SaaS-level web application using **Angular 22**, **TypeScript**, **Signals**, **Bootstrap 5**, and **Template-Driven Forms**.

The platform empowers users to explore curated destinations, discover adventure activities, build personalized trips, dynamically calculate travel budgets, generate day-by-day itineraries, manage wishlists, toggle light/dark modes, and receive real-time updates.

---

## 2. PROBLEM STATEMENT

Travel planning is often fragmented across multiple platforms:
1. Users search for destinations on one site.
2. They compare activity options elsewhere.
3. Budget calculations are done manually on spreadsheets.
4. Creating a day-by-day itinerary is time-consuming and error-prone.

**TripForge** solves this problem by integrating destination discovery, activity selection, live budget calculation, smart trip insights, and automated itinerary generation into a unified, responsive, glassmorphic single-page application (SPA).

---

## 3. PROJECT OBJECTIVES

* Build a high-performance single-page application using modern Angular features (Signals, standalone components, control flow).
* Implement clean service-oriented architecture separating data retrieval, business logic, and UI state.
* Provide template-driven forms with real-time validation feedback.
* Offer dynamic visual budget calculations and frontend smart trip insights.
* Persist user preferences, saved trips, wishlist items, and theme state using `LocalStorage`.
* Provide a foundation that easily transitions from local JSON mock data to a REST API.

---

## 4. MAIN FEATURES

1. **Explore Destinations**: Real-time search, multi-criteria filtering (category, state, difficulty, price range, rating), and sorting.
2. **Destination Details**: Image gallery selector, tags, highlights, available activities, and related destination suggestions.
3. **Activities Explorer**: Filter activities by category (Adventure, Nature, Trekking, Water, Food, Culture, Photography, Relaxation) and max price.
4. **Smart Trip Builder (7-Step Wizard)**:
   - Step 1: Traveler Details (Name, Email, Count)
   - Step 2: Destination Selection
   - Step 3: Travel Dates & Duration Calculation
   - Step 4: Travel Style Selection
   - Step 5: Activity Picker
   - Step 6: Budget Allocation
   - Step 7: Automated Itinerary & Trip Generation
5. **Live Budget Calculator**: Computed breakdown of accommodation, food, transportation, activities, and miscellaneous costs with interactive progress bar and over-budget warnings.
6. **Smart Trip Insights**: Client-side recommendation engine evaluating activity density, duration, nature ratings, and budget usage.
7. **My Trips Dashboard**: Track saved trips, filter by status (Planning, Confirmed, Completed), duplicate trips, view day-by-day timelines, and trigger export actions.
8. **Wishlist System**: Heart toggle animation, localStorage persistence, and quick add-to-trip buttons.
9. **User Profile & Settings**: Edit profile details, toggle notification alerts, set preferred travel styles and currency.
10. **Real-time Clock & Notifications**: Real-time updating clock header and interactive notification drawer with unread counters.
11. **Theme Switcher**: Animated dark/light glassmorphic mode persistence.
12. **Custom Directives**: `appGlowOnHover` directive for card elevation and glowing box-shadows.

---

## 5. TECHNOLOGY STACK

* **Framework**: Angular 22 (Standalone Components)
* **Language**: TypeScript 6
* **Styling**: CSS3, Bootstrap 5, Bootstrap Icons, Glassmorphism, CSS Custom Properties
* **State Management**: Angular Signals (`signal`, `computed`, `effect`)
* **HTTP & Data**: Angular `HttpClient`, JSON Mock Files
* **Form Handling**: Angular Template-Driven Forms (`ngForm`, `ngModel`)
* **Routing**: Angular Router with lazy loading and functional `authGuard`
* **Storage**: `LocalStorage` via custom generic `StorageService`

---

## 6. ARCHITECTURE PATTERN

```
[ JSON Mock Datasets ]
         │
         ▼
[ HttpClient Service ]
         │
         ▼
[ Angular Core Services (TripService, DestinationService, AuthService) ]
         │
         ▼
[ Signals & Computed State ]
         │
         ▼
[ Standalone Page & Shared Components ]
         │
         ▼
[ Glassmorphic HTML Template ]
```

---

## 7. ANGULAR CONCEPTS DEMONSTRATED

| Angular Concept | Location / Feature Where Used |
| --- | --- |
| **Standalone Components** | Every component in `src/app/pages/` and `src/app/shared/` |
| **TypeScript Interfaces** | `destination.model.ts`, `trip.model.ts`, `user.model.ts`, `activity.model.ts` |
| **Angular Signals (`signal()`)** | `AuthService.isLoggedIn`, `ThemeService._theme`, `DateTimeService` |
| **Computed Signals (`computed()`)** | `DestinationService.filteredDestinations`, `TripService.currentBudgetBreakdown` |
| **Signal Effects (`effect()`)** | `ThemeService` for DOM attribute manipulation |
| **Services & Dependency Injection** | 9 dedicated core services injected using `inject()` |
| **HttpClient** | Loading `destinations.json`, `activities.json`, `users.json`, `notifications.json` |
| **Control Flow (`@if`, `@for`, `@switch`)** | All HTML templates replacing legacy `*ngIf` & `*ngFor` |
| **Class Binding (`[class.active]`)** | Navbar route active states, step indicator, wishlist heart |
| **Style Binding (`[style.width.%]`)** | Live budget calculator progress bar |
| **Interpolation (`{{ }}`)** | Displaying prices, ratings, itinerary titles |
| **Property Binding (`[src]`, `[disabled]`)** | Card images, submit button disabled states |
| **Event Binding (`(click)`, `(input)`)** | Search handlers, filter selections, modals |
| **Two-way Binding (`[(ngModel)]`)** | Create trip wizard, login form, settings toggles |
| **Input & Output Signals** | `DestinationCardComponent`, `ActivityCardComponent` |
| **Angular Routing & Params** | `app.routes.ts`, `/destination/:id` route parameter |
| **Functional Route Guard** | `authGuard` protecting `/trip-builder`, `/my-trips`, `/profile` |
| **Template-Driven Forms** | `login.component.html`, `trip-builder.component.html` (`ngForm`, `required`, `email`, `minlength`) |
| **Custom Directive** | `GlowOnHoverDirective` (`appGlowOnHover`) |
| **Custom Pipe** | `TruncatePipe` (`truncate:80`) |

---

## 8. FUTURE API ARCHITECTURE UPGRADE PLAN

Currently:
`Component -> Service -> HttpClient -> assets/data/*.json`

Future Production Upgrade:
`Component -> Service -> HttpClient -> Node.js/Express REST API -> MongoDB/PostgreSQL`

Since all data calls are encapsulated within core Angular Services, switching to a live backend REST API requires **zero changes to component templates or business logic**.

---

## 9. VIVA VOCE / DEMONSTRATION QUESTIONS & ANSWERS

**Q1: Why did you choose Angular for TripForge?**
*Answer*: Angular provides a robust framework with built-in routing, HTTP client, dependency injection, and Signals for reactive state management out of the box, making it ideal for scalable SPAs.

**Q2: What are Angular Signals and why are they used here?**
*Answer*: Signals are fine-grained reactive primitives introduced in Angular. We use `signal()`, `computed()`, and `effect()` to manage application state (such as auth status, budget updates, theme toggle) without relying on unnecessary change detection overhead.

**Q3: How does the Live Budget Calculator work?**
*Answer*: As travelers adjust dates, traveler counts, or select activities, `TripService.currentBudgetBreakdown` (a computed signal) recalculates costs in real time, updating the UI progress bar and remaining budget instantly.

**Q4: Explain how route parameters work in the Destination Details page.**
*Answer*: The route `/destination/:id` captures the destination ID. `DestinationDetailsComponent` reads this parameter using `ActivatedRoute.paramMap`, queries `DestinationService.getById(id)`, and renders the destination.

**Q5: How does the auth guard protect private routes?**
*Answer*: `authGuard` is a functional `CanActivateFn` that checks `AuthService.isLoggedIn()`. If false, it cancels navigation and redirects the user to `/login`.

**Q6: Why did you use Template-Driven Forms for the Trip Builder?**
*Answer*: Template-driven forms using `ngForm` and `[(ngModel)]` provide clean, intuitive two-way data binding with built-in validators (`required`, `email`, `minlength`) suitable for multi-step form wizards.

**Q7: How is data persisted in the browser?**
*Answer*: A generic `StorageService` wraps `localStorage` using TypeScript generics `get<T>()` and `set<T>()` to store saved trips, wishlist item IDs, theme preferences, and user sessions.

**Q8: What is the purpose of the `appGlowOnHover` directive?**
*Answer*: It is a custom Angular attribute directive that listens to mouse enter and leave events (`@HostListener`) on card elements and dynamically applies glowing box-shadows and elevation.

**Q9: How are initial JSON data files loaded?**
*Answer*: Core services use Angular's `HttpClient.get<T>()` method to asynchronously fetch JSON datasets from the `public/data/` directory.

**Q10: Why is plain-text demo login acceptable for this project?**
*Answer*: This is a client-side frontend college mini-project. We explicitly document that real production applications must use HTTPS, backend authentication, password hashing (bcrypt), and secure tokens (JWT).

*(For 10 additional Q&As, see the interactive viva session guide inside the app repository).*

---

## 10. INSTALLATION & RUNNING INSTRUCTIONS

### Prerequisites
* **Node.js**: v18.0.0 or higher
* **npm**: v9.0.0 or higher

### Step-by-Step Terminal Commands (Windows / VS Code)

```powershell
# 1. Open Terminal in workspace folder
cd "c:\Users\HP\Documents\Full Stack Lab\2403717672621004\Angular\tripforge"

# 2. Install dependencies (if not already installed)
cmd /c "npm install"

# 3. Start the Angular local development server
cmd /c "npm start"
```

### Access Application
Open your browser and navigate to:
`http://localhost:4200`

### Demo Credentials
* **Email**: `demo@tripforge.com`
* **Password**: `TripForge@123`
