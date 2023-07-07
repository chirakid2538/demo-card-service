# Install dependencies only when needed
FROM node:alpine as deps

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

# Production image, copy all the files and run
FROM node:alpine

WORKDIR /app

COPY . .

COPY --from=deps /app/node_modules ./node_modules
