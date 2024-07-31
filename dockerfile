FROM node:20

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package*.json ./

RUN npm install

COPY . ./

RUN git config --global --add safe.directory /app

RUN chown -R 1001050000:1001050000 /app/node_modules/.cache/.eslintcache

EXPOSE 3000

CMD ["npm", "start"]
