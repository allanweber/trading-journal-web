FROM node:18

# A directory within the virtualized Docker environment
WORKDIR /usr/src/app

# Copies package.json and package-lock.json to Docker environment
COPY package*.json ./

# Installs all node packages
RUN npm install

# Copies everything over to Docker environment
# COPY . .

# Copy source
COPY ./src ./src

# copy configs to /app folder
COPY tsconfig.json ./
COPY tailwind.config.js ./
COPY /public ./public

# Uses port which is used by the actual application
EXPOSE 3000

# Finally runs the application
CMD [ "npm", "start" ]
