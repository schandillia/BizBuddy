# Base image
FROM node:20-alpine AS base

# Install OpenSSL
RUN apk add --no-cache openssl

# Enable corepack and verify pnpm installation
RUN corepack enable
RUN pnpm --version

# Stage: Dependencies
FROM base AS dependencies
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma
RUN pnpm install --frozen-lockfile --ignore-scripts

# Stage: Builder
FROM base AS builder
WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .

# Pass ONLY public build-time env vars
ARG NEXT_PUBLIC_APP_URL
ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL
ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

RUN pnpm prisma generate
RUN pnpm build

# Stage: Runner
FROM base AS runner
WORKDIR /app

# Set runtime environment variables (empty values for secrets)
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV DATABASE_URL=
ENV CLERK_SECRET_KEY=
ENV DISCORD_BOT_TOKEN=
ENV STRIPE_SECRET_KEY=
ENV AUTH_GOOGLE_ID=
ENV AUTH_GOOGLE_SECRET=

# Create a non-root user
RUN addgroup -g 1001 nodejs \
    && adduser -u 1001 -G nodejs -S nextjs
USER nextjs

# Copy necessary files from the builder stage
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Expose port for the application
EXPOSE 3000

# Add a healthcheck
HEALTHCHECK --interval=5s --timeout=5s --retries=3 --start-period=5s \
    CMD curl -f http://localhost:3000 || exit 1

# Define the default command to run the application
CMD ["node", "server.js"]