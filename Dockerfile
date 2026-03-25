# ─── Development Image ─────────────────────────────────────────────────────
FROM node:20

# Build arguments
ARG DATABASE_URL
ARG DIRECT_URL
ARG QDRANT_URL

# Install system dependencies required for ONNX runtime
RUN apt-get update && apt-get install -y \
    libglib2.0-0 \
    libnss3 \
    libatk-bridge2.0-0 \
    libdrm2 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    libgbm1 \
    libxss1 \
    libasound2 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY . .

# Install all dependencies (including devDependencies)
RUN npm install --legacy-peer-deps

# Generate Prisma client
RUN npm run prisma:g

# Expose the port
EXPOSE 5252

# Default command for development
CMD ["npm", "run", "dev"]
