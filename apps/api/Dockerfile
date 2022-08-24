FROM node:16-bullseye-slim as base
RUN apt-get update || : && apt-get install -y \
    python \
    build-essential \
    node-gyp \
    git \
    openssl

RUN npm i --location=global pnpm

# ------------------------------------------------------------------
# Fetch node_modules so they can be cached by docker
FROM base as store
ENV NODE_ENV=development

WORKDIR /store

COPY pnpm-lock.yaml .npmrc ./
RUN pnpm fetch

# ------------------------------------------------------------------
# Install all node_modules, including dev dependencies
FROM positivly/prisma-binaries:latest as prisma
FROM store as build
ENV NODE_ENV=development

WORKDIR /app
RUN mkdir node_modules
RUN chmod a+rwx -R node_modules

COPY . .

RUN pnpm install --offline

RUN mkdir dist
RUN chmod a+rwx -R dist
RUN pnpm nx build api
ENV PRISMA_QUERY_ENGINE_BINARY=/prisma-engines/query-engine \
    PRISMA_MIGRATION_ENGINE_BINARY=/prisma-engines/migration-engine \
    PRISMA_INTROSPECTION_ENGINE_BINARY=/prisma-engines/introspection-engine \
    PRISMA_FMT_BINARY=/prisma-engines/prisma-fmt \
    PRISMA_CLI_QUERY_ENGINE_TYPE=binary \
    PRISMA_CLIENT_ENGINE_TYPE=binary
COPY --from=prisma /prisma-engines/query-engine /prisma-engines/migration-engine /prisma-engines/introspection-engine /prisma-engines/prisma-fmt /prisma-engines/

# ------------------------------------------------------------------
# Finally, build the production image with minimal footprint
FROM base as prod

EXPOSE 8080
ENV NODE_ENV=production

WORKDIR /app

# RUN mkdir dist
# RUN mkdir node_modules
# RUN chmod a+rwx -R dist
# RUN chmod a+rwx -R node_modules

COPY --from=build /app .

USER node

CMD ["node", "dist/apps/api/main.js"]
