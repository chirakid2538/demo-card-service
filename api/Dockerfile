# Install dependencies only when needed
FROM node:alpine as deps

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

# Rebuild the source code only when needed
FROM node:alpine as builder

WORKDIR /app

COPY . .
COPY --from=deps /app/node_modules ./node_modules

RUN npm run build

# Production image, copy all the files and run next
FROM node:alpine

WORKDIR /app

# COPY --from=builder /app ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./

CMD [ "npm" , "run" , "start:prod" ]
