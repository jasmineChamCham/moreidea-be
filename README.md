# MoreIdea Backend

MoreIdea is a platform designed to manage, store, and explore ideas from various sources such as books and videos. It also features a mentor tracking system and a repository for favourite quotes and ideas. This repository contains the NestJS-based backend API that powers the MoreIdea platform.

## 📋 Table of Contents

- [Overview](#-overview)
- [✨ Features](#-features)
- [🛠 Tech Stack](#-tech-stack)
- [🚀 Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [🔐 Environment Variables](#-environment-variables)
- [🗄 Database Setup](#-database-setup)
  - [Running Migrations](#running-migrations)
- [▶️ Running the Application](#️-running-the-application)
- [📝 Scripts](#-scripts)

## 🎯 Overview

MoreIdea Backend provides endpoints and services to manage knowledge, specifically focusing on capturing core ideas and their importance from books and videos, managing different mentors and their styles, and saving personal favourite ideas and quotes.

## ✨ Features

- **Source & Idea Management** - Track books and videos and capture core ideas associated with them.
- **Mentor System** - Store different mentors along with their specific styles, background vibes, and camera angles.
- **Favourite Ideas** - Keep a dedicated collection of favourite quotes, associated people, and locations.
- **Robust API** - Built efficiently with NestJS and CQRS patterns.
- **Database Architecture** - Strongly-typed database interactions using Prisma ORM with PostgreSQL.
- **File & Media Handling** - Configured for secure file operations.

## 🛠 Tech Stack

- **Framework**: [NestJS](https://nestjs.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **Authentication**: Passport.js (JWT, Local, Google OAuth2)
- **Deployment**: Firebase Functions Ready

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18.x or higher
- **PostgreSQL**: v14.x or higher

### Installation

1. **Clone the repository**:

   ```bash
   git clone <repository-url>
   cd moreidea-be
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Configure Environment**:
   Create a `.env` file and fill in your credentials.

## 🔐 Environment Variables

Key variables required in your `.env` file (adjust as needed based on your configuration):

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/moreidea?schema=public"

# Other integrations like JWT, Firebase, AWS, App Secrets, etc., if applicable
```

## 🗄 Database Setup

MoreIdea uses Prisma for schema management and type safety.

### Running Migrations

```bash
# Generate Prisma Client and NestJS DTOs
npm run prisma:g

# Apply migrations to development database
npm run prisma:m

# Reset database (Deletes all data)
npm run prisma:reset
```

## ▶️ Running the Application

```bash
# Development mode
npm run dev

# Starts the application
npm run start

# Production build
npm run build

# Start production server
npm run start:prod
```

## 📝 Scripts

- `npm run lint` - Lints the codebase using ESLint.
- `npm run format` - Formats the codebase using Prettier.
- `npm run test` - Runs unit tests.
- `npm run test:e2e` - Runs end-to-end tests.
- `npm run serve` - Builds and serves the application locally via Firebase emulators.
- `npm run deploy` - Deploys to Firebase Functions.
