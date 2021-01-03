FROM node:lts-alpine as dev
WORKDIR /usr/src/app
ENV NODE_ENV="development"
COPY ["package.json", "package-lock.json", "./"]
RUN npm install
COPY . .
CMD npm run development

FROM dev as prod
ENV NODE_ENV="production"
CMD npm run production
