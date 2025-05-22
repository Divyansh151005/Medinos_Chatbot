# Use a base image with Node
FROM node:20

# Set the working directory inside container
WORKDIR /app

# Copy only dependency files
COPY package*.json ./

# Install dependencies inside Docker (for Linux)
RUN npm install

# Copy the rest of the project
COPY . .

# Set default command (overridable by docker-compose)
CMD ["npm", "run", "dev"]


