# Use an official Node.js runtime as a parent image
FROM node:20.16.0

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json
COPY package*.json ./

# Install any necessary dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the React app for production
RUN npm run build

# Install a simple web server to serve the built files
RUN npm install -g serve

# Expose the port the app runs on
EXPOSE 5173

# Command to run the web server
CMD ["serve", "-s", "dist", "-l", "5173"]

LABEL name="sashajlohsky/micro_wallet_frontend"
