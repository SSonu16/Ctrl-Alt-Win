# GlobeTrotter  
### Intelligent Travel Planning Platform for the Odoo Hackathon

GlobeTrotter is a structured, data-driven travel planning platform that demonstrates how strong relational data modeling combined with an intuitive user experience can solve real-world travel planning complexity.

The application focuses on modular architecture, clean separation of concerns, and business-ready extensibility while delivering a seamless end-to-end experience for planning, visualizing, and organizing travel.

---

## Problem Context

Travel planning involves managing multiple interdependent elements:

- Multi-city routes  
- Flights and accommodations  
- Day-wise activities  
- Budget estimation  
- Plan sharing and collaboration  

Most existing solutions address these components in isolation, forcing users to rely on multiple platforms and manually synchronize information. This leads to fragmented planning, poor visibility, and inefficient decision-making.

The challenge is to design a **single unified system** that can handle complex relational travel data while remaining simple and intuitive for users.

---

## Solution Overview

GlobeTrotter centralizes the entire travel planning lifecycle into one cohesive platform:

- Create and manage multi-city itineraries  
- Visualize trips day-wise using structured timelines  
- Automatically calculate and track budgets  
- Explore flights and nearby accommodation options  
- Seamlessly redirect users to trusted booking platforms  
- Share and reuse itineraries for collaboration and inspiration  

The platform is intentionally focused on **planning intelligence rather than direct booking**, ensuring flexibility, scalability, and partner-friendly integration.

---

## Key Capabilities

- Secure user authentication and personalized dashboards  
- Multi-city itinerary creation and management  
- City-wise and day-wise trip planning  
- Activity discovery and assignment per destination  
- Automated trip budget calculation and cost aggregation  
- Calendar and timeline-based itinerary visualization  
- Flight discovery with external booking redirection  
- Nearby hotel listings for each destination  
- Public and private itinerary sharing  
- User profile and preference management  
- Optional admin analytics dashboard  

---

## Booking Integrations (Smart Redirection)

### Flight Booking
- Users can view flight details based on travel dates and routes  
- Selecting **“Book Now”** redirects users to the **MakeMyTrip website or app**  
- Ensures real-time pricing, availability, and a trusted booking experience  

### Hotel Discovery
- Displays curated lists of nearby hotels for each city stop  
- Enables accommodation comparison during the planning phase  
- Supports informed decision-making without locking users into a single provider  

This integration strategy keeps the platform lightweight, scalable, and partner-friendly.

---

## Functional Modules

- Login and Signup  
- Dashboard  
- Create Trip  
- My Trips (Trip List)  
- Itinerary Builder  
- Itinerary View  
- City Search  
- Activity Search  
- Flight Details and Booking Redirection  
- Nearby Hotel Listings  
- Budget and Cost Breakdown  
- Calendar / Timeline View  
- Public / Shared Itinerary View  
- User Profile and Settings  
- Admin Analytics Dashboard (Optional)

---

## Database-Driven Design

GlobeTrotter is built on a **relational database architecture**, where:

- A user can manage multiple trips  
- Each trip consists of ordered city stops  
- City stops are linked to activities, flights, and hotels  
- Expenses are aggregated at daily and trip levels  
- Booking links are stored as reference entities  

This design ensures data consistency, efficient querying, and seamless feature expansion — closely aligned with ERP-style system principles.

---

## Technology Stack

- **Frontend:** React with TypeScript, Vite, Tailwind CSS  
- **Backend:** Supabase (authentication, database, edge functions) 
- **Database:** Relational schema with versioned migrations  
- **Architecture Focus:** Scalability, maintainability, and clarity  

---

## Project Structure

**Folder–folder–file structure**
globetrotter-india-main/
│
├── .env
├── .gitignore
├── README.md
├── bun.lockb
├── components.json
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── postcss.config.js
├── tailwind.config.ts
├── vite.config.ts
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
│
├── public/
│   ├── favicon.ico
│   ├── placeholder.svg
│   └── robots.txt
│
├── src/
│   ├── App.css
│   ├── App.tsx
│   ├── main.tsx
│   ├── vite-env.d.ts
│   │
│   ├── assets/
│   │   ├── destination-agartala.jpg
│   │   ├── destination-agra.jpg
│   │   ├── destination-ahmedabad.jpg
│   │   ├── destination-aizawl.jpg
│   │   ├── destination-ajanta.jpg
│   │   ├── destination-alleppey.jpg
│   │   ├── destination-amritsar.jpg
│   │   ├── destination-auli.jpg
│   │   ├── destination-ayodhya.jpg
│   │   ├── destination-badami.jpg
│   │   ├── destination-bali.jpg
│   │   ├── destination-bandhavgarh.jpg
│   │   ├── destination-bengaluru.jpg
│   │   └── ... (many destination images)
│   │
│   └── pages/
│       ├── Auth.tsx
│       ├── CreateTrip.tsx
│       ├── Dashboard.tsx
│       ├── Explore.tsx
│       ├── Features.tsx
│       ├── Index.tsx
│       ├── NotFound.tsx
│       ├── PlaceDetail.tsx
│       ├── Pricing.tsx
│       ├── Profile.tsx
│       ├── TripDetail.tsx
│       └── TripList.tsx
│
├── supabase/
│   ├── config.toml
│   ├── functions/
│   │   └── generate-itinerary/
│   │       └── index.ts
│   └── migrations/
│       ├── 20260103074940_23db4c85-6d98-4f2d-8d5b-b4e57c6206d8.sql
│       └── 20260103081419_b1ac679a-c733-4203-95ba-3a2a19b3145c.sql

** 🔍 Quick understanding

* **Root** → Project configuration (Vite, Tailwind, ESLint, TS configs)
* **`public/`** → Static public assets
* **`src/`** → React + TypeScript app source

  * `assets/` → Destination images
  * `pages/` → Page-level React components
* **`supabase/`** → Backend config, edge functions & DB migrations
note: should transfer the images in assets2 folder into assets folder.
only the images in assets2 should be included in assets folder, not the folder entirely.