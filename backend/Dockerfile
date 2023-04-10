# this specifies the parent base layer image
# FROM node:18-alpine

# this creates a subfolder in the image where everything will be run from
# every instruction uses this working directory
# when we run commands on the image to do it from this working directory
# WORKDIR /app

# this copies the files from the root directory to the working directory of the image
# COPY . .

# this is the command to run at build time to add all dependencies to the image
# RUN npm install

# we need to EXPOSE a PORT
# so we can send requests to the API running inside the Container
# docker desktop uses this information to setup port mapping
# EXPOSE 3000

# we want to RUN node server.js when we are INSIDE THE CONTAINER (not when we are bulding the Image)
# the format is an array of strings in double quotes
# CMD ["node", "server.js"]

# we then build the image with:
# (-t to give it a tag or a name)
# (and . a relative path to the dockerfile)
# docker build -t myapp .

# each line is a new layer in the image
# this is how images are built by layers being stacked one ontop of the other
# node:18-alpine
# workdir /app
# copy ..
# run npm install

# if we make a change to our server.js file
# since we have changed our code we need to make a new image
# each layer of the image is stored in a cache
# when we build an image again, before docker starts the whole build process again it looks in the cache
# and it tries to find an image in the cache that it can use for the new image that we are creating
# so that the workload is reduced

# we are making a change to the server.js which affects the COPY . . layer
# and therefore after the copy layer and everything built on top of it

# but it doesn't affect the layers before, the FROM initial image and the WORKDIR layer
# so docker will find in the cache the build up to and including the WORKDIR layer
# because up until this point the image is the same, so it grabs that cached image
# and runs through the subsequent layers and adds them on top to build our image
# which means the second time around it was quicker to build
# because the first two layers are pulled from the cache

# it shows this in the terminal by prefixing the specific layer it will start from with CACHED [2/4] WORKDIR /app

# but we would ideally keep the RUN npm install layer cached and use that as well
# by running it BEFORE we copy over all the files

# the RUN npm install would run before the source code is copied over COPY . .
# now the first three layers can be pulled from the cache

# FROM node:18-alpine

# WORKDIR /app

# RUN npm install

# COPY . .

# EXPOSE 3000

# CMD ["node", "server.js"]

# but there is a problem with this, it will try and do npm install before the package.json file gets copied over to it
# and it won't know what it needs to install

# the solution is to COPY the package.json file itself, before we RUN npm install

# FROM node:18-alpine

# WORKDIR /app

# COPY package.json .

# RUN npm install

# COPY . .

# EXPOSE 3000

# CMD ["node", "server.js"]

# now the first 4 layers can be grabbed from the CACHE
# this makes the build process much quicker


# VOLUMES

FROM node:18-alpine

# -g is for global
RUN npm install -g nodemon

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

EXPOSE 4000

CMD ["npm", "run", "dev"]