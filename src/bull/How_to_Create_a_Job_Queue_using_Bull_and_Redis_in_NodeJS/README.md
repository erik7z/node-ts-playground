# [How to Create a Job Queue using Bull and Redis in NodeJS](https://dev.to/franciscomendes10866/how-to-create-a-job-queue-using-bull-and-redis-in-nodejs-20ck)

### Pre-requisites:

#### Run redis
> To start Redis Stack run the following command in your terminal:

```sh
docker run -d --name redis-stack -p 6379:6379 -p 8001:8001 redis/redis-stack:latest
# you can visit UI on localhost:8001
```

#### Install bull
```shell
# NPM
npm init -y
npm install bull
```
More see in index.ts


