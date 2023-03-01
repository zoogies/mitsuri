FROM node:lts-alpine

WORKDIR /mitsuri

COPY . .

RUN npm install
RUN npm run push

CMD ["node","index.js"]