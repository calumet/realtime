# Use the official Node.js image as the base image
FROM node:20

# Set the working directory
WORKDIR /usr/src

# Copy package.json and package-lock.json
COPY package*.json .

# Copy pm2.json
COPY pm2.json .

# Install dependencies
RUN npm install -g pm2

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 41236

# Start the app using pm2
CMD ["pm2-runtime", "start", "pm2.json"]