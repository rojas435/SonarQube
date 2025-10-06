# syntax=docker/dockerfile:1

FROM node:20-bookworm-slim AS base
WORKDIR /app

FROM base AS deps
COPY package*.json ./
# Install dependencies including dev deps for build (allow legacy peer deps to avoid conflicts)
RUN npm install --legacy-peer-deps

FROM deps AS build
COPY . .
RUN npm run build

FROM node:20-bookworm-slim AS runner
ENV NODE_ENV=production
WORKDIR /app
COPY package*.json ./
# Install only production deps
RUN npm install --omit=dev --legacy-peer-deps
# Copy built artifacts
COPY --from=build /app/dist ./dist
# Copy any runtime files if needed (e.g., schema.graphql)
COPY --from=build /app/schema.graphql ./schema.graphql

EXPOSE 3000
CMD ["node", "dist/main.js"]
