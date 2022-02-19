FROM node:alpine

USER root

RUN npm install -g pnpm

USER node

# pnpm fetch does require only lockfile
COPY pnpm-lock.yaml ./

RUN pnpm fetch --dev

ADD . ./

RUN pnpm install -r --offline --dev

EXPOSE 3000
