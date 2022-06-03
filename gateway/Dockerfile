FROM node:lts-alpine

WORKDIR /usr/app/gateway

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3333

CMD yarn start:dev