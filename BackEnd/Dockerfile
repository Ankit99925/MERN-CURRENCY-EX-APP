FROM node:20-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# The environment variables will come from docker-compose
EXPOSE ${PORT:-3005}
CMD ["node", "app.js"]
