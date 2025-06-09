# ========== Build Stage ==========
FROM node:18-alpine AS builder

ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# ========== Production Stage ==========
FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next

RUN if [ -d /app/public ]; then mkdir -p ./public && cp -r /app/public/* ./public/; fi

EXPOSE 3000

CMD ["npm", "start"]
