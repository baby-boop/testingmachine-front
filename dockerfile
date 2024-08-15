FROM node:20.12.2

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . ./

RUN npm run build

RUN git config --global --add safe.directory /app

EXPOSE 3000

CMD ["npm", "start"]