FROM node:14.5.0
WORKDIR /app
COPY ["src/", "./src"]

RUN cd src

RUN npm run start