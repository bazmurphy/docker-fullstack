# baz learning docker

# docker cli commands

build the image with:
`docker build -t myapp .`
`-t` to give it a tag or a name
and `.` a relative path to the dockerfile


`docker images`

|REPOSITORY                    |TAG      |IMAGE ID      |CREATED       |SIZE  |
|------------------------------|---------|--------------|--------------|------|
|myapp                         |latest   |16911dfd0942  |23 hours ago  |184MB |

`docker run myapp`

we add the flags after run before the image name

`docker run --flagsHere imageName`

we give our container a name `--name`

`docker run --name myapp_container myapp`

show a list of currently running containers (`ps` stands for processes):

`docker ps`

|CONTAINER ID |IMAGE    |COMMAND                 |CREATED         |STATUS         |PORTS     |NAMES
|-------------|---------|------------------------|----------------|---------------|----------|-----------------|
|d3554049a752 |myapp    |"docker-entrypoint.s…"  |14 seconds ago  |Up 13 seconds  |3000/tcp  |myapp_container2 |


to stop a container:

`docker stop containerName`

`docker stop myapp_container`

we need to map the containers port to a port on our (host) computer (`-p` or `--publish` stands for publish)
number on the left is the port on the host computer, the number on the right is the port on the container

`docker run --name myapp_container -p 3000:3000`

so the docker process doesnt block our terminal, we can run the container in detached mode, so our terminal is detached from the process (`-d` or `--detach` stands for detached)

`docker run --name myapp_container -p 3000:3000 -d myapp`

to add env variables we can use (`-e` or `--env` or `--env-file env.list`)

`--env VAR1=value1`

`docker run --name myapp_container -e PORT=3000 -p 3000:3000 -d myapp`


to show a list of all containers

`docker ps -a`
`docker container ls -a`

to startup an existing container (we don't need to reconfigure anything like port mapping, env, etc. because that information was stored in the container)

`docker start myapp_container`

to delete(remove) an image

`docker image rm myapp`

to delete an image being used by a container, `-f` is for force

`docker image rm myapp -f`

to delete a container

`docker container rm myapp_container`

to delete multiple containers

`docker container rm myapp_container myapp2_container`

We can remove all containers and all images (and all volumes) with
`docker system prune -a`

We can VERSION our Images, much like the parent image at the top of our Dockerfile.
example: 16-alpine, 17-apline, 18-alpine
Which meas use node version 16/17/18 on top of an alpine linux distribution (or another linux distribution)

They are different versions/variations of what is fundamentally the same node image

The way those versions are created is using "tags"
We create a tag by adding a `:` after the image name
example: `node:latest` `node:18-alpine`

We do this with:
`docker build -t myapp:version1 .`

If we want to run a specific image version, we can specify that tag when we run it:
`docker run --name myapp_container -e PORT=3000 -p 3000:3000 -d myapp:version1`

CONTAINER ID   IMAGE            COMMAND                  CREATED         STATUS        PORTS                    NAMES
8262374dd08b   myapp:version1   "docker-entrypoint.s…"   2 seconds ago   Up 1 second   0.0.0.0:3000->3000/tcp   myapp_container

## Volumes

`docker run` makes a brand new container and runs the image
`docker start` runs an existing container

docker images are read only, so if we change our source code,
we have to build a new image and then run that image in a new container to see the changes,
it is a long winded way of working

there is a way around this by using "Volumes"

Volumes are a feature of docker that allow us to specify folders that can be made available to running containers
We can map those folders on our host computer to specific folders inside the container
So that if something changed in those folders on our computer that change would also be reflected in the folders we map to in the container
We could map our entire project folder to the /app folder in our container, which is where all the source code is in our container
That means if a file is created, deleted or updated in the project folder that change would be automatically reflected in the /app folder in the container
So if we have a container running this image and we have a volume to map the project folder to the /app folder in the container, everything will be mirrored automatically in the container.

This is the way we can make changes to the project and view those changes without having to rebuild a new images all of the time

The important thing to note about this however is: THE IMAGE DOES NOT CHANGE AT ALL

So if we wanted to update the image to share with others, then we have to still rebuild the image etc.

But just while you are testing Volumes can be usedful for the directory mapping between the project folder and the container.

-----------------

We add:
`RUN npm install -g nodemon`
-g is for global

directly below the FROM (1st layer)

Then in package.json
We add to scripts:
`"dev" : "nodemon server.js"`
(For Windows Docker you need to add a -L flag `nodemon -L server.js`)

To Delete the Container automatically AFTER you STOP THE IMAGE you can add `--rm`
`docker run --name myapp_container_nodemon -e PORT=3000 -p 3000:3000 --rm myapp:nodemon`


We need to MAP the project folder to the /app folder in the container using `-v`
`-v (project folder path):(container path)`
`docker run --name myapp_container_nodemon -e PORT=3000 -p 3000:3000 -v /home/baz/docker-test:/app --rm myapp:nodemon`

You are not allowed to mount to the ROOT of the container `:/`
It must be a subdirectory(!)

----------------

There is a small problem with this, if we were to delete the node_modules folder locally
This mapping would mean that the node_modules folder in the container would be removed
Remember everything in the /app container folder will be kept in sync with the (local) project folder
That would cause a problem because the container needs those dependencies for the app to work

So we need a way to still map our project folder but in a way that doesn't affect the node_modules folder in the container

We can achieve this with an `Anonymous Volume`
Anonymous Volume would map the Containers node_modules folder to somewhere ELSE on our computer.

We can achive that with this flag:
`-v /app/node_modules`
It doesn't map it to a specific folder on our computer, instead it is a folder managed by docker on our computer, and the contents of that folder will persist even when the container stops, and then next time

this volume inside the container itself `/app/node_modules` is mapped to a local directory on our computer
and when the container runs it OVERRIDES the PREVIOUS `/app` because its path is MORE SPECIFIC `/app/node_modules` than the PREVIOUS ONE

so we have another volume with a MORE SPECIFIC PATH for managing that folder

`docker run --name myapp_container_nodemon -e PORT=3000 -p 3000:3000 -v /home/baz/docker-test:/app -v /app/node_modules --rm myapp:nodemon`


------------------
# docker Compose

- Note: there is a switch from `docker-compose` (V1) to `docker compose` (V2)

Give us a way to make a single Docker container configuration of our projects
It can create and run multiple images and containers etc.
The container names, port mappings, environment variables, volumes, etc etc.

Make a new file in the root of the project folder called `docker-compose.yaml`

to start the docker compose using the `docker-compose.yaml`
`docker compose up`

to stop everything, the container is deleted, but the images and volumes still remain
`docker compose down`

you can add on the flags 
`docker compose down --rmi all -v` remove all the images and volumes created by docker compose

# backend AND frontend

- for this section a /backend folder was  created and everything thus far moved into it
- and a /frontend folder was created and a vite react app was created
- the /backend port was changed to 4000
- the /frontend port was set to 3000 (and for Vite `vite.config.js` `server: { host: true }`)

Each folder must have it's own `Dockerfile` and its own specific instructions
In the root of the directory we create the `docker-compose.yaml`
And there we can specify the process for building the images and running the containers on both backend and frontend.