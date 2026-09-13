FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN cp -n config.json.example config.json

CMD ["npm", "start"]
