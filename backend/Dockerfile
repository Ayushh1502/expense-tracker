# Use official lightweight Node.js image
FROM node:18-alpine

# Set working directory inside container
WORKDIR /app

# Copy only package files first (to leverage caching)
COPY package*.json ./

# Install only production dependencies
RUN npm install --production

# Copy the rest of the backend code
COPY . .

# Expose your backend port (8000)
EXPOSE 8000

# Run the app
CMD ["npm", "start"]