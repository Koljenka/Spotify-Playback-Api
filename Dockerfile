FROM node:14.5.0
WORKDIR /app
COPY ["package.json", "package-lock.json*", "./"]

RUN npm install

COPY main.js .

CMD ["node", "main.js"]