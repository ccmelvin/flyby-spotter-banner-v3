# Build stage
FROM node:20-slim AS builder

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install pnpm
RUN npm install -g pnpm

# Install dependencies
RUN pnpm install

# Copy source code
COPY . .

# Build the application
RUN pnpm build

# Production stage
FROM node:20-slim AS runner

WORKDIR /app

# Set to production environment
ENV NODE_ENV=production

# Create a non-root user to run the application
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy necessary files from build stage
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Set proper permissions
RUN chown -R nextjs:nodejs /app

# Use tmpfs for temporary files to reduce writes to SD card
# This will mount /tmp and /app/.next/cache in memory
VOLUME ["/tmp"]

# Configure logging to stdout/stderr only
ENV NODE_OPTIONS="--no-deprecation"

# Switch to non-root user
USER nextjs

# Expose the listening port
EXPOSE 3000

# Set the command to run the optimized Next.js application
# Using standalone output mode which is more efficient
CMD ["node", "server.js"]