#--------------------------------------------------------------------------
# STAGE 1: DEPS
#--------------------------------------------------------------------------
FROM node:current-alpine AS base

FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install OpenSSL
RUN apk add --no-cache openssl
# Install glibc compatibility for alpine
RUN apk add --no-cache libc6-compat

# Enable corepack and verify pnpm installation
RUN corepack enable pnpm

# Copy package.json and pnpm-lock.yaml
COPY package.json pnpm-lock.yaml* ./
COPY prisma ./prisma

# Install dependencies
RUN pnpm i --frozen-lockfile

#--------------------------------------------------------------------------
# STAGE 2: BUILDER
#--------------------------------------------------------------------------
# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

# Enable corepack and pnpm first
RUN corepack enable pnpm

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Install sharp
RUN apk add --no-cache --virtual .sharp-deps ca-certificates python3 make g++ && \
    pnpm add sharp --save --production && \
    apk del .sharp-deps


# Dummy STRIPE_SECRET_KEY value for build
ENV STRIPE_SECRET_KEY="test_secret_key_for_build"

# Disable NextJS telemetry during build.
ENV NEXT_TELEMETRY_DISABLED 1

# Build the application with verbose output
RUN pnpm run build && \
    ls -la /app/.next && \
    echo "Build completed successfully"

# Add a check to ensure the directories exist
RUN test -d /app/.next/standalone && \
    test -d /app/.next/static || \
    (echo "Required .next directories are missing" && exit 1)

#--------------------------------------------------------------------------
# STAGE 3: RUNNER
#--------------------------------------------------------------------------
# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
# Disable NextJS telemetry during runtime.
ENV NEXT_TELEMETRY_DISABLED 1

# Copy the public directory
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files (only once)
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

USER nextjs

EXPOSE 3000

ENV PORT 3000

# Add a healthcheck
HEALTHCHECK --interval=30s --timeout=10s --retries=3 --start-period=30s \
    CMD curl -f http://localhost:3000 || exit 1

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
CMD ["node", "server.js"]