# Stage 1: build Angular app
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --silent
COPY . .
RUN npm run build -- --configuration production

# Stage 2: serve with nginx
FROM nginx:alpine
COPY --from=build /app/dist/workspace /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
