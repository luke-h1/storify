# Stage 1 - build the code 
FROM node:14 as builder

WORKDIR /usr/src/app

COPY package*.json ./

RUN yarn

COPY . . 
RUN yarn build

# stage 2 - build for prod 
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

EXPOSE 8080

CMD ["node", "dist/index.js"]
USER node
