# kirjasto-backend
![Build status](https://github.com/vuolen/kirjasto-backend/workflows/Build/badge.svg)

# Documentation

This project uses
- [Typescript](https://www.typescriptlang.org/) for type safety
- [fp-ts](https://github.com/gcanti/fp-ts) to achieve a mostly pure functional programming style
- [io-ts](https://github.com/gcanti/io-ts) to validate incoming and outgoing requests
- [express](https://expressjs.com/) for the actual server
- [jest](https://jestjs.io/) for unit tests
- [pgTyped](https://github.com/adelsz/pgtyped) for automatically typing the SQL queries

## Project structure
The project structure is mostly self-explanatory. However the broad picture is that there are three layers, endpoints, services and the database.
1. An endpoint receives the user's request and makes sure that the user is authenticated and has necessary permissions.
2. A service then takes the request, validates the actual content and returns a response to the endpoint.
3. The database layer is a thin abstraction and holds no real logic other than populating foreign keys on requests.

The services should be quite abstract, matching one-to-one with the endpoints. The endpoints and thus the API should be quite coarse, roughly translating to the users actions.

## Production build
1. Clone the repo and navigate to it on your shell of choice
2. Build a production image with `docker build --target prod -t <IMAGE_NAME_HERE> .` with the image name of your choosing.
3. Run the image with `docker run --network=host -e DATABASE_URL="postgres://<USERNAME>:<PASSWORD>@<HOST>:<PORT>/<DB>" <IMAGE_NAME_HERE>`

## Run locally
See the [main repo](https://github.com/vuolen/kirjasto) for a local development environment.
