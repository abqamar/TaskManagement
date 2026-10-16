
# =====================================
# Stage 1: Build the application
# =====================================

FROM node:24-bookworm-slim AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY tsconfig.json ./
COPY prisma.config.ts ./
COPY prisma ./prisma
COPY src ./src

# Provide a build-time placeholder so Prisma
# configuration can load without real secrets.
RUN DATABASE_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder" \
    npm run build


# =====================================
# Stage 2: Production runtime
# =====================================

FROM node:24-bookworm-slim AS runtime

ENV NODE_ENV=production

WORKDIR /app

ARG REPOSITORY_URL

LABEL org.opencontainers.image.source="${REPOSITORY_URL}"

COPY package*.json ./

# Install production dependencies only
RUN npm ci --omit=dev && npm cache clean --force

# Copy compiled JavaScript
COPY --from=builder --chown=node:node /app/dist ./dist

# Migration files and Prisma configuration
COPY --chown=node:node prisma.config.ts ./
COPY --chown=node:node prisma ./prisma

USER node

EXPOSE 3000

CMD ["node", "dist/server.js"]
