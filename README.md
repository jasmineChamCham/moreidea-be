# MoreIdea (Empathy AI)

MoreIdea is a comprehensive knowledge management platform designed specially for continuous learners, researchers, and creators. It goes beyond simple note-taking by providing a structured environment to manage, store, and explore profound ideas, philosophies, and quotes from various sources and mentors.

## 🌟 Project Purpose

In an age of information overload, we consume countless books, podcasts, articles, and videos, yet often fail to retain or apply the core wisdom they hold. The purpose of **MoreIdea** is to bridge the gap between passive consumption and active application. It provides a centralized, structured repository where users can systematically capture ideas, break them down into their core meanings, and map out exactly how to apply them in real life. By connecting these ideas to specific sources and mentors, the platform ensures that valuable knowledge is never lost but easily accessible when needed.

## 🔭 Vision

Our vision is to build an intelligent "second brain" that acts as a personalized wisdom weaver. We want to empower users not just to store data, but to internalize philosophies through the unique lenses of different mentors and archetypes. By capturing the essence of an idea—along with the speaking style, mindset, and body language of the mentor who shared it—MoreIdea aims to foster deeper empathy and understanding, ultimately helping users transform external knowledge into personal growth and actionable insight.

## 💡 Application & Use Cases

MoreIdea is built for practical, everyday use by knowledge workers, coaches, and lifelong learners. Its core applications include:

- **Source & Idea Extraction**: Log the books you read, videos you watch, or podcasts you listen to, and extract specific ideas. For each idea, define its core essence, importance, practical application, and real-world examples.
- **Mentor Tracking**: Create profiles for different mentors, thought leaders, or historical figures. Track not just their quotes and topics, but their unique philosophy, mindset, teaching style, and archetype.
- **Thematic Categorization**: Organize ideas and mentors by topics, creating an interconnected web of knowledge that makes it easy to find cross-disciplinary insights.
- **Personalization**: Users can customize their profiles with personality frameworks (MBTI, Zodiac, Love Languages) to potentially tailor how information and mentorship resonate with them.

---

## 🛠 Tech Stack

- **Framework**: [NestJS](https://nestjs.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Architecture**: CQRS Pattern (Command Query Responsibility Segregation)
- **Database ORM**: [Prisma](https://www.prisma.io/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **Authentication**: Passport.js (JWT, Local, Google OAuth2)
- **Deployment**: Firebase Functions Ready

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18.x or higher
- **PostgreSQL**: v14.x or higher
- **npm** or **yarn**

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
   Create a `.env` file in the root directory and fill in your credentials:
   ```env
   # Database
   DATABASE_URL="postgresql://user:password@localhost:5432/moreidea?schema=public"

   # JWT & Auth Secrets
   JWT_SECRET="your_jwt_secret"
   ```

## 🗄 Database Setup

MoreIdea uses Prisma for robust schema management and type safety.

```bash
# Generate Prisma Client and NestJS DTOs
npm run prisma:g

# Apply migrations to the development database
npm run prisma:m

# Reset database (Deletes all data)
npm run prisma:reset
```

## ▶️ Running the Application

```bash
# Development mode (watch)
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
