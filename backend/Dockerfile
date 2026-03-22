FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

FROM node:20-alpine
WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/src ./src
COPY --from=builder /app/migrations ./migrations

RUN npm ci --omit=dev

EXPOSE 8080

USER node

CMD ["node", "src/server.js"]