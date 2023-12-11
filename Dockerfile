# syntax = docker/dockerfile:1

# Adjust NODE_VERSION as desired
ARG NODE_VERSION=18.18.2
FROM node:${NODE_VERSION}-slim as base

LABEL fly_launch_runtime="Node.js"

# Node.js app lives here
WORKDIR /app

# Set production environment
ENV NODE_ENV="production"

# Install pnpm
ARG PNPM_VERSION=8.10.2
RUN npm install -g pnpm@$PNPM_VERSION


# Throw-away build stage to reduce size of final image
FROM base as build

# Install packages needed to build node modules
RUN apt-get update -qq && \
    apt-get install -y build-essential pkg-config python-is-python3

# Install node modules
COPY --link .npmrc package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod=false

# Copy application code
COPY --link . .

# Mount secrets and build application
RUN --mount=type=secret,id=TURSO_DB_AUTH_TOKEN \
    --mount=type=secret,id=TURSO_DB_URL \
    --mount=type=secret,id=IPINFO_TOKEN \
    TURSO_DB_AUTH_TOKEN="$(cat /run/secrets/TURSO_DB_AUTH_TOKEN)" \
    TURSO_DB_URL="$(cat /run/secrets/TURSO_DB_URL)" \
    IPINFO_TOKEN="$(cat /run/secrets/IPINFO_TOKEN)" \
    && pnpm run build

# Remove development dependencies
RUN pnpm prune --prod


# Final stage for app image
FROM base

# Copy built application
COPY --from=build /app /app

# Start the server by default, this can be overwritten at runtime
EXPOSE 3000
CMD [ "pnpm", "run", "start" ]
