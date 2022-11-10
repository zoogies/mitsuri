FROM node:lts-alpine

WORKDIR .

COPY ./src ./

RUN npm install

CMD ["node","index.js"]