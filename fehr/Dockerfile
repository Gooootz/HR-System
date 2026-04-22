# Stage 1: Build the application
FROM node:22-alpine AS build

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json files to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Build the application for production
RUN npm run build

# Stage 2: Serve the built application
FROM node:22-alpine

# Install a simple static file server
RUN npm install -g serve@latest

# Set the working directory
WORKDIR /app

# Copy the build output from the previous stage
COPY --from=build /app/dist /app/dist

# Expose ports 3000 and 3001 to the outside world
EXPOSE 3000
EXPOSE 3001

# Serve the built application on port 3000 and 3001
CMD ["sh", "-c", "serve -s dist -l 3000 & serve -s dist -l 3001"]
