# marketplace/Frontend/Dockerfile
FROM node:20-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Set production environment variables during build time
ARG VITE_API_URL

ENV VITE_API_URL=${VITE_API_URL}

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]