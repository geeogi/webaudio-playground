FROM node:8.16

RUN mkdir app
ADD package.json /app/package.json
ADD yarn.lock /app/yarn.lock 

WORKDIR /app
RUN yarn

CMD ["yarn", "start"]