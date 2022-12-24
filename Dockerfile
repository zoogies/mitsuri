FROM node:lts-alpine

WORKDIR .

COPY ./src /mitsuri

RUN npm install

CMD ["node","index.js"]