FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
COPY .env.example .env

EXPOSE 3001

CMD ["npm", "run", "start:prod"]
