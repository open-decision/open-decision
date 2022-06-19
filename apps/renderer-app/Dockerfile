# base node image
FROM node:16-bullseye-slim as base

# Install openssl for Prisma
RUN apt-get update || : && apt-get install -y \
    python \
    build-essential \
    node-gyp \
    git
RUN npm i --location=global pnpm


FROM base as store
ENV NODE_ENV=development

WORKDIR /store

COPY pnpm-lock.yaml .npmrc ./
RUN pnpm fetch

# ------------------------------------------------------------------
# Install all node_modules, including dev dependencies
FROM store as deps
ENV NODE_ENV=development

WORKDIR /app

COPY . .

RUN pnpm install --offline

# Setup production node_modules
FROM store as production-deps

WORKDIR /app

COPY . .
RUN pnpm install --prod --offline

# ------------------------------------------------------------------
# Build the app
FROM base as build

ENV NODE_ENV=production

WORKDIR /app

COPY --from=deps /app/node_modules /app/node_modules

COPY . .
RUN mkdir dist
RUN chmod a+rwx -R dist
RUN pnpm nx build renderer-app

# ------------------------------------------------------------------
# Finally, build the production image with minimal footprint
FROM base

ENV NODE_ENV=production

WORKDIR /app

COPY --from=production-deps /app/node_modules /app/node_modules

COPY --from=build /app/apps/renderer-app/build /app/apps/renderer-app/build
COPY --from=build /app/apps/renderer-app/public /app/apps/renderer-app/public
ADD . .

USER node
WORKDIR apps/renderer-app
CMD ["npm", "run", "start"]