FROM node:lts-alpine as dev
WORKDIR /usr/src/app
ENV NODE_ENV="development"
COPY backend backend
COPY shared shared
WORKDIR /usr/src/app/backend
RUN npm install --unsafe-perm
CMD npm run development

FROM dev as prod
ENV NODE_ENV="production"
CMD npm run production
