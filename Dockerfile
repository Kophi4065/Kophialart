FROM node:18

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .

# Expose port for web server
EXPOSE 8000

# Start the bot
CMD ["node", "index.js"]
