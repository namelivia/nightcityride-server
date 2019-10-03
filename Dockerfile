FROM node:12.7.0-alpine
WORKDIR /app
COPY . /app
EXPOSE 60001
CMD ["node", "index.js"]
