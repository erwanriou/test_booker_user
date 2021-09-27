FROM node:15.0.1-alpine

WORKDIR /app
COPY package.json .

RUN echo -e "@erwanriou:registry=https://npm.pkg.github.com/erwanriou \nregistry=https://registry.npmjs.org \ntimeout=60000" > .npmrc
RUN npm install --only=prod
COPY . .

CMD ["npm", "run", "start:server"]
