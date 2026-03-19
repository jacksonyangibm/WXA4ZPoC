FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --production
COPY server.js login.html index.html private.pem ./
EXPOSE 3000
CMD ["node", "server.js"]
