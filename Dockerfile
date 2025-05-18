FROM node:22-alpine

# Create app directory
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

# Build TypeScript code
RUN npm run build

# Remove development dependencies to reduce image size
RUN npm prune --production

# Set environment variables
ENV NODE_ENV=production

# Run the bot
CMD ["node", "dist/index.js"]