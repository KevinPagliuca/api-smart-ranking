FROM node:lts-alpine

WORKDIR /usr/app/admin-service

COPY package*.json ./

RUN npm install

COPY . .

CMD yarn start:dev