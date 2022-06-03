FROM node:lts-alpine

WORKDIR /usr/app/admin-service

COPY package*.json ./

RUN yarn

COPY . .

CMD yarn start:dev