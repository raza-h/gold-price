FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN yarn install

COPY . .

RUN mkdir -p /data

CMD ["node", "index.js"]
