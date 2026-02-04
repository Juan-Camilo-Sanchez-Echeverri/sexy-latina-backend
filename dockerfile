# Stage 1: Install dependencies
FROM node:22-alpine AS deps

WORKDIR /app

COPY package*.json ./

RUN npm install

# Stage 2: Build the application
FROM node:22-alpine AS build

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules

COPY . .

RUN npm run build

RUN npm ci --omit=dev && npm cache clean --force

# Stage 3: Final production image
FROM node:22-alpine AS prod


WORKDIR /app

RUN addgroup -S sexy-group && adduser -S sexy-latina -G sexy-group

COPY --from=build --chown=sexy-latina:sexy-group /app/node_modules ./node_modules
COPY --from=build --chown=sexy-latina:sexy-group /app/dist ./dist

RUN mkdir -p /app/uploads /app/logs && chown -R sexy-latina:sexy-group /app

USER sexy-latina

CMD [ "node", "dist/main.js" ]