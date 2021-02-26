FROM node:lts-alpine as dev
WORKDIR /usr/src/app/backend
ENV NODE_ENV="development"
RUN apk update && apk upgrade && \
    apk add --no-cache git
COPY package.json package.json
COPY package-lock.json package-lock.json
RUN npm install
COPY . .
CMD npm run development

FROM dev as prod
ENV NODE_ENV="production"
CMD npm run production
