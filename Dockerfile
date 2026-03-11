# ─── Stage 1: Builder ────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./

# Install dependencies (--legacy-peer-deps to bypass cloudinary v1/v2 peer conflict)
RUN npm install --legacy-peer-deps

# Copy the rest of the source
COPY . .

# Declare build args so Railway injects service variables during build
ARG DATABASE_URL
ARG DIRECT_URL

RUN npm run prisma:g

# Build TypeScript → dist/
RUN npm run build

# ─── Stage 2: Production ─────────────────────────────────────────────────────
FROM node:20-alpine AS production

WORKDIR /app

# Copy dependency
COPY package.json package-lock.json ./

# Install production-only dependencies (--legacy-peer-deps to bypass cloudinary v1/v2 peer conflict)
RUN npm install --legacy-peer-deps

# Copy built output
COPY --from=builder /app/dist ./dist

# Copy prisma schema
COPY --from=builder /app/prisma ./prisma

# Copy generated Prisma client
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Copy Prisma v7 config (required for migrate deploy to find the connection URL)
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts

# Expose the port
EXPOSE 5252

# Run migrations then start the server
CMD npx prisma migrate deploy && node dist/src/main
