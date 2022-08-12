FROM node:lts-alpine

WORKDIR /usr/src/mommy

COPY package.json ./
RUN npm install

COPY . ./

CMD ["node","index.js"]