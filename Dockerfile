# this specifies the parent base layer image
FROM node:18-alpine

# this creates a subfolder in the image where everything will be run from
# every instruction uses this working directory
# when we run commands on the image to do it from this working directory
WORKDIR /app

# this copies the files from the root directory to the working directory of the image
COPY . .

# this is the command to run at build time to add all dependencies to the image
RUN npm install

# we need to EXPOSE a PORT
# so we can send requests to the API running inside the Container
# docker desktop uses this information to setup port mapping
EXPOSE 3000

# we want to RUN node server.js when we are INSIDE THE CONTAINER (not when we are bulding the Image)
# the format is an array of strings in double quotes
CMD ["node", "server.js"]

# we then build the image with:
# docker build -t myapp .