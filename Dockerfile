# ─── Development Image ─────────────────────────────────────────────────────
FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./

# Install all dependencies (including devDependencies)
RUN npm install --legacy-peer-deps

# Copy the rest of the source
COPY . .

# Expose the port
EXPOSE 5252

# Default command for development
CMD ["npm", "run", "dev"]
