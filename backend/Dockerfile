FROM node:20-bookworm-slim

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends openssl && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm install

COPY prisma ./prisma
COPY prisma.config.ts ./
COPY src ./src

ENV NODE_ENV=production

EXPOSE 3333

CMD ["sh", "-c", "npx prisma generate && npx prisma db push --accept-data-loss && npm start"]
