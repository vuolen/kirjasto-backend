# kirjasto-backend
![Build status](https://github.com/vuolen/kirjasto-backend/workflows/Build/badge.svg)

# Production build
1. Clone the repo and navigate to it on your shell of choice
2. Build a production image with `docker build --target prod -t <IMAGE_NAME_HERE> .` with the image name of your choosing.
3. Run the image with `docker run --network=host -e DATABASE_URL="postgres://<USERNAME>:<PASSWORD>@<HOST>:<PORT>/<DB>" <IMAGE_NAME_HERE>`

# Run locally
See the [main repo](https://github.com/vuolen/kirjasto) for a local development environment.
