<p align="center">
  <img src="./assets/moreidea_banner.png" alt="MoreIdea Banner" width="100%">
</p>

<h1 align="center">✨ MoreIdea (Empathy AI) ✨</h1>

<p align="center">
  <strong>The intelligent "Second Brain" for Wisdom Weavers and Lifelong Learners.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" alt="NestJS">
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma">
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL">
</p>

---

## 🌟 The Pulse of MoreIdea

In a world drowning in data but starving for wisdom, **MoreIdea** isn't just another note-taking app—it's a **wisdom refinery**. We consume books, podcasts, and videos at lightning speed, but how much actually sticks? How much changes who we are?

> [!IMPORTANT]
> **The Mission**: To bridge the gap between passive consumption and active transformation. MoreIdea helps you distill raw information into applied brilliance.

### 🔭 Our Vision: The Wisdom Weaver
We are building a personalized **Empathy AI**—a "second brain" that doesn't just store facts, but understands the *soul* of an idea. By weaving together the mindset, philosophy, and archetype of the mentors you admire, MoreIdea empowers you to see the world through their eyes, helping you transform external knowledge into deep personal growth.

---

## 💡 Where Wisdom Meets Action

MoreIdea is designed for the modern creator, researcher, and coach. It turns "I read that somewhere" into "Here is how I apply this today."

- **💎 Idea Alchemy**: Don't just save quotes. Extract the core essence, define its weight, and map out concrete, real-world examples for application.
- **🎭 Mentor Archetypes**: Go beyond the bio. Track the unique philosophy, mindset, and teaching style of your mentors. Whether it's a historical giant or a modern thought leader, capture their "vibe."
- **🕸️ Interconnected Wisdom**: Create a living web of knowledge. See how a Stoic philosophy from 2000 years ago connects to a modern UX design principle. 
- **🎨 Personalization Stack**: Integrate your own personality frameworks (MBTI, Zodiac, Love Languages) to see how wisdom resonates uniquely with *you*.

---

## 🛠 Project Blueprint

Built with a high-performance, scalable back-end architecture to ensure your wisdom is always protected and accessible.

- **Framework**: [NestJS](https://nestjs.com/) (The scalability champion)
- **Engine**: [TypeScript](https://www.typescriptlang.org/) (Static typing for zero-loss data)
- **Design Strategy**: **CQRS Pattern** (Clean separation of concerns)
- **Data Layer**: [Prisma](https://www.prisma.io/) & [PostgreSQL](https://www.postgresql.org/)
- **Gatekeeper**: Passport.js (JWT, Google OAuth2)

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.x or higher
- **PostgreSQL**: v14.x or higher

### Installation

1. **Clone the repository**:
   ```bash
   git clone [<repository-url>](https://github.com/jasmineChamCham/moreidea-be)
   cd moreidea-be
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment**:
   Create a `.env` file and define your `DATABASE_URL` and `JWT_SECRET`.

### 🗄 Database Lifecycle

```bash
# Generate Client & DTOs
npm run prisma:g

# Apply Migrations
npm run prisma:m

# Reset (Careful!)
npm run prisma:reset
```

### ▶️ Orchestration

```bash
npm run dev        # Watch mode for developers
npm run build      # Prepare for production
npm run start:prod # Launch the engine
```

---

## 📝 Vital Scripts

- `npm run lint` - Maintain code elegance.
- `npm run format` - Keep the structure pristine.
- `npm run test` - Ensure core logic remains unbreakable.
- `npm run deploy` - Scale to the sky via Firebase.

---

<p align="center">
  Made with ❤️ for the seekers of wisdom.
</p>
