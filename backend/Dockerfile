# Start from a node:18 image.
FROM node:18

# Create app directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json ./

# Install app dependencies
RUN npm install

# Copy app source
COPY . .

# Expose port and start server
EXPOSE 5000
CMD [ "node", "server.js" ]