# [Node.js: Create Job Queue Using Bull And Redis](https://javascript.plainenglish.io/node-js-create-job-queue-using-bull-and-redis-20fabcee60c5)

### Introduction
Queues can solve a lot of different problems in an interesting way, 
to reduce the load on processes on one server by breaking up separating heavy processes into other servers.

Here we will create two applications that have separate roles as follows :

- **Producer**: Node program to add jobs to the queue
- **Consumer**: Node program that defines the function of the process, and the work to be done

### Creating the Application
First, create a folder and initialize our application using the following command in the 
terminal by pointing to the folder that was created earlier:

```shell
$ npm init
$ npm install bull dotenv
```

Then create a file with the name config.js and enter the code as shown below, 
for the REDIS_HOST and REDIS_PORT variables, fill in the Redis host and port they have.

```ts
// config.ts
import Bull from "bull";

export const connectQueue = (name: string) => new Bull(name, {
  redis: {
    port: 6379,
    host: "127.0.0.1"
  }
});

```
After that create a files as per src folder.

You can start everything with the following commands:

```shell
ts-node consumer.ts
ts-node producer.ts
```

