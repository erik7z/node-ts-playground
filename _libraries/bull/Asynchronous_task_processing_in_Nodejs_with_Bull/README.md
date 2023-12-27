# [Asynchronous task processing in Node.js with Bull](https://blog.logrocket.com/asynchronous-task-processing-in-node-js-with-bull/)

Queues are helpful for solving common application scaling and performance challenges in an elegant way.

- Smoothing out processing peaks
- Breaking up monolithic tasks that may otherwise block the Node.js event loop
- Providing a reliable communication channel across various services

Bull is a Node library that implements a fast and robust queue system based on Redis. Although it is possible to
implement queues directly using Redis commands, Bull is an abstraction/wrapper on top of Redis. It provides an API that
takes care of all the low-level details and enriches Redis’ basic functionality so that more complex use cases can be
handled easily.

## Installation

Before we begin using Bull, we need to have Redis installed.
[Follow the guide on Redis Labs guide to install Redis](https://redislabs.com/get-started-with-redis/)
then install Bull using npm or yarn:
`npm install bull --save`

## Creating a queue

### Syntax

```ts
type Queue = (queueName: string, url?: string, opts?: QueueOptions) => Queue;

// The optional url parameter is used to specify the Redis connection string. 
// If no url is specified, bull will try to connect to default Redis server running on localhost:6379
```

- QueueOptions interface

```ts
interface QueueOptions {
  limiter?: RateLimiter;
  redis?: RedisOpts;
  prefix?: string | 'bull'; // prefix for all queue keys.
  defaultJobOptions?: JobOpts;
  settings?: AdvancedSettings;
}
```

- [RateLimiter](https://github.com/OptimalBits/bull/blob/master/REFERENCE.md#queue)
  limiter:RateLimiter is an optional field in QueueOptions used to configure maximum number and duration of jobs that
  can be processed at a time.
- [RedisOption](https://github.com/OptimalBits/bull/blob/master/REFERENCE.md#queue)
  redis: RedisOpts is also an optional field in QueueOptions. It’s an alternative to Redis url string
- [AdvancedSettings](https://github.com/OptimalBits/bull/blob/master/REFERENCE.md#queue)
  settings: AdvancedSettings is an advanced queue configuration settings. It is optional, and Bull warns that shouldn’t
  override the default advanced settings unless you have a good understanding of the internals of the queue.

A basic queue would look like this:

```ts
const Queue = require(bull);

const videoQueue = new Queue('video');
```

Creating a queue with QueueOptions

```ts
// limit the queue to a maximum of 100 jobs per 10 seconds
const Queue = require(bull);

const videoQueue = new Queue('video', {
  limiter: {
    max: 100,
    duration: 10000
  }
});
```

> Each queue instance can perform three different roles: job producer, job consumer, and/or events listener.
> Each queue can have one or many producers, consumers, and listeners.

### Producers

A job producer creates and adds a task to a queue instance. Redis stores only serialized data, so the task should be
added to the queue as a JavaScript object, which is a serializable data format.

```ts
type f = {
  add(name: string, data: object, opts?: JobOpts): Promise<Job>
}

/**
 * A task would be executed immediately if the queue is empty.
 * Otherwise, the task would be added to the queue and executed once the processor
 * idles out or based on task priority.
 */
```

You can add the optional name argument to ensure that only a processor defined with a specific name will execute a task.
A named job must have a corresponding named consumer. Otherwise, the queue will complain that you’re missing a processor
for the given job.

### Job options

Jobs can have additional options associated with them. Pass an options object after the data argument in the add()
method.

```ts
interface RepeatOpts {
  cron?: string; // Cron string
  tz?: string; // Timezone
  startDate?: Date | string | number; // Start date when the repeat job should start repeating (only with cron).
  endDate?: Date | string | number; // End date when the repeat job should stop repeating.
  limit?: number; // Number of times the job should repeat at max.
  every?: number; // Repeat every millis (cron setting cannot be used together with this setting.)
  count?: number; // The start value for the repeat iteration count.
}


interface BackoffOpts {
  type: string; // Backoff type, which can be either `fixed` or `exponential`. A custom backoff strategy can also be specified in `backoffStrategies` on the queue settings.
  delay: number; // Backoff delay, in milliseconds.
}
```

A basic producer would look like this:

```ts
const videoQueue = new Queue('video')
videoQueue.add({ video: 'video.mp4' })

// A named job can be defined like so:
videoQueue.add('video', { input: 'video.mp4' });

// Below is an example of customizing a job with job options.
videoQueue.add('video', { input: 'video.mp4' }, { delay: 3000, attempts: 5, lifo: true, timeout: 10000 })
```

### Consumers

A job consumer, also called a worker, defines a process function (processor). The process function is responsible for
handling each job in the queue.

```ts
type f = {
  process(processor: ((job, done?) => Promise<any>) | string)
}
```

If the queue is empty, the process function will be called once a job is added to the queue. Otherwise, it will be
called every time the worker is idling and there are jobs in the queue to be processed.

The process function is passed an instance of the job as the first argument. A job includes all relevant data the
process function needs to handle a task.

The data is contained in the data property of the job object. A job also contains methods such as:

- **progress(progress?: number)** for reporting the job’s progress,
- **log(row: string)** for adding a log row to this job-specific job,
- **moveToCompleted**, **moveToFailed**, etc.

> Bull processes jobs in the order in which they were added to the queue. If you want jobs to be processed in parallel, specify a concurrency argument. Bull will then call the workers in parallel, respecting the maximum value of the RateLimiter.

A job can be named. A named job can only be processed by a named processor. 
Define a named processor by specifying a name argument in the process function.
```ts
type f = {
  process(name: string, concurrency: number, processor: ((job, done?) => Promise<any>) | string)
}
```

### Event listeners

Throughout the lifecycle of a queue and/or job, Bull emits useful events that you can listen to using event listeners. 

An event can be local to a given queue instance (worker). 
Listeners to a local event will only receive notifications produced in the given queue instance.

```ts
//  local progress event.
queue.on('progress', function(job, progress){
  console.log(`${jod.id} is in progress`)
})
```
Other possible events types include:
- error 
- waiting 
- active 
- stalled 
- completed 
- failed 
- paused 
- resumed 
- cleaned 
- drained
- removed

> By prefixing **global:** to the local event name, 
> you can listen to all events produced by all the workers on a given queue.

```ts
// global progress event
queue.on('global:progress', function(jobId){
  console.log(`${jobId} is in progress`)
});
// Notice that for a global event, the jobId is passed instead of a the job object.
```

### A practical example
Let’s say an e-commerce company wants to encourage customers to buy new products in its marketplace. 
The company decided to add an option for users to opt into emails about new products.

Because outgoing email is one of those internet services that can have very high latencies and fail, we need to 
keep the act of sending emails for new marketplace arrivals out of the typical code flow for those operations. 
To do this, we’ll use a task queue to keep a record of who needs to be emailed.

```ts
const Queue = require('bull');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export class EmailQueue{
  constructor(){
    // initialize queue
    this.queue = new Queue('marketplaceArrival');
    // add a worker
    this.queue.process('email', job => {
      this.sendEmail(job)
    })
  }
  
  addEmailToQueue(data){
    this.queue.add('email', data)
  }
  
  async sendEmail(job){
    const { to, from, subject, text, html} = job.data;
    const msg = { to, from, subject, text, html };
    
    try {
      await sgMail.send(msg)
      job.moveToCompleted('done', true)
    } catch (error) {
      if (error.response) {
        job.moveToFailed({message: 'job failed'})
      }
    }
  }
}
```
