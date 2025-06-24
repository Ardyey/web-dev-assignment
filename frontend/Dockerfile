# Stage 1: Build the React app
FROM node:18 AS build

# Set the working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json ./
RUN npm install

# Copy the rest of the application source code
COPY . .

# Build the app
RUN npm run build

# Stage 2: Serve the static files with Nginx
FROM nginx:alpine

# Copy the build output from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy the Nginx configuration file
# Copy the Nginx configuration file as a template
COPY nginx.conf /etc/nginx/conf.d/default.conf.template

# Install gettext for envsubst
RUN apk add --no-cache gettext

# Copy the entrypoint script
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Expose port 80 and set the entrypoint
EXPOSE 80
ENTRYPOINT ["/entrypoint.sh"]