FROM node:14.5.0
WORKDIR /app
COPY ["src/", "./"]

RUN npm install

CMD ["node", "index.js"]