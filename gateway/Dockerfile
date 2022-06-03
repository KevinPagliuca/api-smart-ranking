FROM node:lts-alpine

WORKDIR /usr/app/gateway

COPY package*.json ./

RUN yarn

COPY . .

EXPOSE 3333

CMD yarn start:dev