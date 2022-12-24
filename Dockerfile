FROM node:lts-alpine

WORKDIR /src

COPY ./src /mitsuri

RUN npm install

CMD ["node","index.js"]