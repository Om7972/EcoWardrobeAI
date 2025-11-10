# EcoWardrobeAI - Sustainable Fashion Platform

A full-featured sustainable fashion platform with AI-powered tools, community features, and eco-conscious functionalities.

## Table of Contents

1. [Features Overview](#features-overview)
2. [Authentication System](#authentication-system)
3. [Core Features](#core-features)
   - [Care & Repair Hub](#care--repair-hub)
   - [Circular Marketplace](#circular-marketplace)
   - [AI-Powered Outfit Moodboard Generator](#ai-powered-outfit-moodboard-generator)
   - [Closet Capsule Builder](#closet-capsule-builder)
   - [Fabric Intelligence Scanner](#fabric-intelligence-scanner)
   - [Style Circles (Community Feature)](#style-circles-community-feature)
4. [Technology Stack](#technology-stack)
5. [Installation](#installation)
6. [Usage](#usage)
7. [API Documentation](#api-documentation)

## Features Overview

EcoWardrobeAI is a comprehensive sustainable fashion platform that helps users extend the life of their clothing, make eco-conscious choices, and connect with like-minded individuals. The platform includes:

- Secure user authentication with JWT tokens
- Virtual closet management
- Care & repair tracking
- Circular marketplace for buying, selling, and swapping
- AI-powered outfit generation
- Community features with style circles
- Fabric analysis tools
- Sustainability impact tracking

## Authentication System

The platform implements a full authentication system with:

- **User Registration**: Secure signup with email and password
- **User Login**: JWT-based authentication
- **Password Security**: bcrypt hashing for password protection
- **Protected Routes**: Middleware to protect authenticated routes
- **Profile Management**: User profile updates and password changes

### Authentication Endpoints

- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login
- `GET /api/protected/profile` - Get user profile (protected)
- `PUT /api/protected/profile` - Update user profile (protected)
- `PUT /api/protected/change-password` - Change password (protected)

## Core Features

### Care & Repair Hub

Extend the life of clothing through proper care and repair.

**Features:**
- Smart Care Labels: Digital, searchable care instructions for each item
- Repair & Alteration Log: Track when an item was repaired, tailored, or upcycled
- Local Tailor & Cobbler Finder: Integrated map to find local services

**Endpoints:**
- `GET /api/care/instructions/:itemId` - Get care instructions for an item
- `PUT /api/care/instructions/:itemId` - Create/update care instructions
- `GET /api/care/repair-history/:userId/:itemId` - Get repair history
- `POST /api/care/repair-log/:userId` - Add repair log entry
- `PUT /api/care/repair-log/:logId` - Update repair log entry
- `DELETE /api/care/repair-log/:logId` - Delete repair log entry
- `GET /api/care/nearby-services` - Find nearby service providers
- `GET /api/care/all-services` - Get all service providers
- `POST /api/care/service-provider` - Add new service provider

### Circular Marketplace

Facilitate the buying and selling of pre-loved items within the community.

**Features:**
- Seamless Integration: List an item from your virtual closet to the marketplace in 2 clicks
- "Eco-Cred" Profile: Build trust with a profile that shows a user's sustainability score and community ratings
- Swapping & Gifting: Options to swap with other users or gift items to friends

**Endpoints:**
- `POST /api/marketplace/listings` - Create a new listing
- `GET /api/marketplace/listings` - Get all listings
- `GET /api/marketplace/listings/:listingId` - Get a specific listing
- `GET /api/marketplace/user/:userId/listings` - Get user's listings
- `PUT /api/marketplace/listings/:listingId` - Update a listing
- `DELETE /api/marketplace/listings/:listingId` - Delete a listing
- `POST /api/marketplace/requests` - Create a swap request
- `GET /api/marketplace/user/:userId/requests` - Get user's swap requests
- `PUT /api/marketplace/requests/:requestId/accept` - Accept a swap request
- `PUT /api/marketplace/requests/:requestId/reject` - Reject a swap request
- `PUT /api/marketplace/requests/:requestId/complete` - Mark swap as completed
- `PUT /api/marketplace/listings/:listingId/like` - Like a listing

### AI-Powered Outfit Moodboard Generator

Users input a mood (e.g., "confident", "cozy", "bold") and get a visual outfit board from their closet.

**Features:**
- Drag-and-drop canvas with outfit pieces
- Mood tags with emoji icons
- Visual outfit planning tool

**Endpoints:**
- `POST /api/moodboards` - Create a new moodboard
- `GET /api/moodboards/user/:userId` - Get user's moodboards
- `GET /api/moodboards/:moodboardId` - Get a specific moodboard
- `PUT /api/moodboards/:moodboardId` - Update a moodboard
- `DELETE /api/moodboards/:moodboardId` - Delete a moodboard
- `GET /api/moodboards` - Get public moodboards
- `PUT /api/moodboards/:moodboardId/like` - Like a moodboard
- `POST /api/moodboards/generate` - Generate AI-powered moodboard suggestions

### Closet Capsule Builder

AI suggests a 10-15 piece capsule wardrobe from the user's closet for travel, seasons, or minimalism.

**Features:**
- Step-by-step wizard with progress bar
- Visual checklist with swap suggestions
- Capsule wardrobe planning tool

**Endpoints:**
- `POST /api/capsules` - Create a new capsule
- `GET /api/capsules/user/:userId` - Get user's capsules
- `GET /api/capsules/:capsuleId` - Get a specific capsule
- `PUT /api/capsules/:capsuleId` - Update a capsule
- `DELETE /api/capsules/:capsuleId` - Delete a capsule
- `GET /api/capsules` - Get public capsules
- `PUT /api/capsules/:capsuleId/like` - Like a capsule
- `POST /api/capsules/generate` - Generate AI-powered capsule suggestions

### Fabric Intelligence Scanner

Upload a clothing tag or receipt to detect fabric type and rate sustainability.

**Features:**
- Upload zone with drag-and-drop
- Result card with icons (e.g., 🌿 Organic Cotton, ⚠️ Polyester)
- Fabric composition analysis

**Endpoints:**
- `POST /api/fabric-analyses` - Create a new fabric analysis
- `GET /api/fabric-analyses/user/:userId` - Get user's fabric analyses
- `GET /api/fabric-analyses/:analysisId` - Get a specific fabric analysis
- `PUT /api/fabric-analyses/:analysisId` - Update a fabric analysis
- `DELETE /api/fabric-analyses/:analysisId` - Delete a fabric analysis
- `POST /api/fabric-analyses/analyze` - Analyze fabric composition

### Style Circles (Community Feature)

Join or create style circles (e.g., "Minimalist Moms", "Streetwear Swappers") to share outfits and swaps.

**Features:**
- Group feed with posts, polls, and challenges
- Badge system for eco-leaders
- Community building tools

**Endpoints:**
- `POST /api/style-circles` - Create a new style circle
- `GET /api/style-circles` - Get all style circles
- `GET /api/style-circles/:circleId` - Get a specific style circle
- `PUT /api/style-circles/:circleId` - Update a style circle
- `DELETE /api/style-circles/:circleId` - Delete a style circle
- `POST /api/style-circles/:circleId/join` - Join a style circle
- `POST /api/style-circles/:circleId/leave` - Leave a style circle
- `POST /api/style-circles/:circleId/posts` - Create a post in a style circle
- `GET /api/style-circles/:circleId/posts` - Get posts for a style circle
- `PUT /api/style-circles/:circleId/posts/:postId/like` - Like a post in a style circle

## Technology Stack

- **Frontend**: React 18 + TypeScript, Vite, Tailwind CSS, Radix UI
- **Backend**: Express.js (Node.js), MongoDB with Mongoose
- **Authentication**: JWT, bcrypt
- **State Management**: React Query, React Hook Form
- **UI Components**: Radix UI, Lucide Icons
- **Build Tools**: Vite, TypeScript, Prettier
- **Deployment**: Netlify (frontend), Custom server (backend)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/ecowardrobe-ai.git
   cd ecowardrobe-ai
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```

4. Run the development server:
   ```bash
   pnpm dev
   ```

## Usage

1. Start the application:
   ```bash
   pnpm dev
   ```

2. Open your browser and navigate to `http://localhost:5173`

3. Sign up for a new account or sign in with existing credentials

4. Explore the various features:
   - Add items to your virtual closet
   - Create care instructions and repair logs
   - List items in the marketplace
   - Generate AI-powered moodboards
   - Build capsule wardrobes
   - Analyze fabric compositions
   - Join or create style circles

## API Documentation

All API endpoints are RESTful and follow standard conventions. Detailed API documentation can be found in the source code comments and route files.

For protected endpoints, include the JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

---

*EcoWardrobeAI - Extending the life of fashion, one closet at a time.*