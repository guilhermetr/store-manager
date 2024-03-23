# Stage 1: Build the Angular app
FROM node:21 AS build
WORKDIR /usr/src/app
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve the app with Nginx
FROM nginx:alpine
COPY --from=build /usr/src/app/dist/store-manager /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
