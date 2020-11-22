FROM node:lts-alpine
WORKDIR /usr/src/kirjasto-backend

RUN apk update && apk add postgresql-client

COPY . .

RUN npm install

ENTRYPOINT ["./wait-for-postgres.sh", "npm"]
