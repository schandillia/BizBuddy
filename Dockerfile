# Base image
FROM node:20-alpine AS base

# Enable corepack and verify pnpm installation
RUN corepack enable
RUN pnpm --version

# Stage: Dependencies
FROM base AS dependencies
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Stage: Builder
FROM base AS builder
WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .

# Pass only build-time env vars that are public
ARG NEXT_PUBLIC_APP_URL
ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL
ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

RUN pnpm prisma generate
RUN pnpm build

# Stage: Runner
FROM base AS runner
WORKDIR /app

# Set runtime environment variables
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Secrets to be passed securely at runtime (not included in the image)
# These will be injected via `docker run --env-file` or a secrets manager
# Example usage with an .env file: `docker run --env-file .env ...`
# The following ENV declarations are placeholders to define the keys expected
ENV DATABASE_URL=
ENV CLERK_SECRET_KEY=
ENV DISCORD_BOT_TOKEN=
ENV STRIPE_SECRET_KEY=
ENV AUTH_GOOGLE_ID=
ENV AUTH_GOOGLE_SECRET=

# Create a non-root user for running the application
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 --gid 1001 nextjs
USER nextjs

# Copy necessary files from the builder stage
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Expose port for the application
EXPOSE 3000

# Add a healthcheck to ensure the container is running properly
HEALTHCHECK --interval=5s --timeout=5s --retries=3 --start-period=5s \
  CMD curl -f http://localhost:3000 || exit 1

# Define the default command to run the application
CMD ["node", "server.js"]
