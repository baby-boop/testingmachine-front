FROM node:20.12.2 AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . ./

RUN npm run build

FROM node:20.12.2-slim

WORKDIR /app

COPY --from=build /app /app

RUN useradd -u 1001050000 -m -d /home/appuser appuser

RUN chown -R appuser:appuser /app/node_modules/.cache/.eslintcache

USER appuser

EXPOSE 3000

CMD ["npm", "start"]
