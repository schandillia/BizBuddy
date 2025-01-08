# Use a multi-stage build to reduce final image size
FROM node:23-alpine AS builder

WORKDIR /app

COPY package*.json pnpm-lock.yaml ./

RUN npm install pnpm -g
RUN corepack enable pnpm

# Install OpenSSL and glibc compatibility (only if needed by your app)
RUN apk add --no-cache openssl libc6-compat

COPY prisma ./prisma

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm prisma generate
RUN pnpm build

# Stage 2: Production image (smaller size)
FROM node:23-alpine

WORKDIR /app

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.env ./.env

# Install OpenSSL and glibc compatibility if needed in the final image as well
RUN apk add --no-cache openssl libc6-compat

# Set the correct command for standalone output
CMD ["node", ".next/standalone/server.js"]