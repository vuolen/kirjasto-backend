FROM node:lts
WORKDIR /usr/src/kirjasto-backend

COPY . .

RUN npm install

ENTRYPOINT ["npm"]
