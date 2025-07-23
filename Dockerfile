# Dockerfile for NestJS
FROM node:20 AS builder

# Cài postgresql-client
USER root
RUN apt-get update && apt-get install -y postgresql-client

WORKDIR /app
COPY package*.json ./
COPY .env ./
RUN npm install
COPY . .
RUN npm run build
# Sau khi build xong mới chuyển sang user node nếu muốn
# USER node

FROM node:20 as production

USER root
RUN apt-get update && apt-get install -y postgresql-client

WORKDIR /app
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/.env ./
RUN npm install --only=production
EXPOSE 3001
# USER node 