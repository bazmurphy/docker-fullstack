FROM node:18-alpine

WORKDIR /app

# copy the package.json to the root of the working directory
COPY package.json .

# run npm install
RUN npm install

COPY . .

EXPOSE 3000

# CMD ["npm", "run"] <-- Create React App 
# (!) below is Vite, and in vite.config.js you need to add host: true to server { }
CMD ["npm", "run", "dev"]