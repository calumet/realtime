# GITHUB_TOKEN=<token con acceso a calumet/realtime-data> \
#   docker build --secret id=GITHUB_TOKEN,env=GITHUB_TOKEN -t realtime:latest .

FROM node:24-alpine AS build
RUN apk add --no-cache git
WORKDIR /app
COPY package.json package-lock.json ./
RUN --mount=type=secret,id=GITHUB_TOKEN \
    git config --global url."https://x-access-token:$(cat /run/secrets/GITHUB_TOKEN)@github.com/".insteadOf "https://github.com/" && \
    npm ci --omit=dev --ignore-scripts && \
    rm -rf ~/.npm

FROM node:24-alpine
ENV NODE_ENV=production NODE_PATH=/app/app
WORKDIR /app
COPY --from=build /app/node_modules ./node_modules
COPY package.json ./
COPY app ./app
# El CMD solo ejecuta node: npm/corepack no se usan en runtime.
RUN rm -rf /usr/local/lib/node_modules/npm /usr/local/lib/node_modules/corepack \
      /usr/local/bin/npm /usr/local/bin/npx /usr/local/bin/corepack \
      /root/.cache
USER node
EXPOSE 9700
CMD ["node", "app/index.js"]
