# Multi-stage build
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci && npm cache clean --force

# Copy env for build
COPY .env.local .env.local

COPY . .
RUN npm run build

# Production image
FROM node:22-alpine

WORKDIR /app

# Copy node_modules from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/public ./public
COPY .env.local .env.local

EXPOSE 3000

ENV NODE_ENV=production

CMD ["npm", "run", "start"]
