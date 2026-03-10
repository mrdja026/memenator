FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ARG ASTRO_DB_REMOTE_URL=http://db:8080
ENV ASTRO_DB_REMOTE_URL=${ASTRO_DB_REMOTE_URL}

RUN npm run build

FROM node:22-alpine AS runtime

WORKDIR /app

# Install ffmpeg for GIF conversion and curl for Giphy uploads
RUN apk add --no-cache ffmpeg curl

COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./

ENV HOST=0.0.0.0
ENV PORT=4321

EXPOSE 4321

CMD ["node", "./dist/server/entry.mjs"]
