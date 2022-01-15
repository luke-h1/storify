FROM node:14 as builder

WORKDIR /usr/src/app

COPY package*.json ./

RUN yarn

COPY . . 
RUN yarn build


FROM node:14 

WORKDIR /usr/src/app

COPY package*.json ./
COPY .env.example . 
COPY .env.production .
COPY .env . 
COPY .env.production .env

RUN yarn --production

COPY --from=builder /usr/src/app/dist ./dist 

ENV NODE_ENV production

EXPOSE 8000

CMD ["node", "dist/index.js"]
USER node
