FROM node:lts
RUN npm install -g pnpm

ENV NODE_ENV=production

WORKDIR /app
COPY pnpm-lock.yaml .
RUN pnpm fetch --prod
COPY . .
RUN pnpm install -r --offline
EXPOSE 8080

CMD pnpm nx start renderer-app
