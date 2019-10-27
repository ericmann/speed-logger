FROM node:alpine

WORKDIR /app
COPY . .
RUN npm install
RUN apk update && apk add python speedtest-cli && rm -rf /var/cache/apk/*

EXPOSE 3131
CMD ["node", "speed.js"]
