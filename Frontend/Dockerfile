# Build Stage
FROM node:20-alpine AS build
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy code and build production bundle
COPY . .
RUN npm run build

# Production Stage
FROM nginx:alpine
# Copy built files
COPY --from=build /app/dist /usr/share/nginx/html
# Copy custom nginx configuration to support SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
