# Specify a base image
FROM node:12

WORKDIR /app

# Install dependencies
COPY package.json .
RUN npm install 
COPY . .

# Default command
CMD ["npm", "start"]