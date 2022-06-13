# base node image
FROM node:lts as base

ENV NODE_ENV development
RUN npm install -g pnpm

WORKDIR /app

COPY pnpm-lock.yaml .
RUN pnpm fetch
COPY . .
RUN pnpm install -r --offline
RUN pnpm nx build renderer-app

# Finally, build the production image with minimal footprint
FROM node:lts
RUN npm install -g pnpm

ENV NODE_ENV=production

WORKDIR /app

COPY --from=base /app .
ADD . .

CMD ["npm", "run", "start"]
