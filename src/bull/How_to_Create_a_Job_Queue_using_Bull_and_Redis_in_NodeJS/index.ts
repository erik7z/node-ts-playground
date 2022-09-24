/**
 * How to Create a Job Queue using Bull and Redis in NodeJS
 * @see {@link https://dev.to/franciscomendes10866/how-to-create-a-job-queue-using-bull-and-redis-in-nodejs-20ck|source}
 */


/**
 * *1> BASICS
 * A basic example would be the following:
 */

// import Queue from "bull";
//
// const queue = new Queue('my-first-queue', {
//   redis: { host: "localhost", port: 6379 }
// });
//
// const main = async () => {
//   await queue.add({ name: "John", age: 30 });
// };
//
// queue.process((job, done) => {
//   console.log(job.data);
//   done();
// });
//
// main().catch(console.error);

/*
* As you may have noticed in the example above, in the main() function a new job is inserted
* in the queue with the payload of { name: "John", age: 30 }.
* In turn, in the processor we will receive this same job and we will log it.
* */


/**
 * *2> REPEATEABLE JOBS
 * But there are not only jobs that are immediately inserted into the queue,
 * we have many others and perhaps the second most popular are repeatable jobs.
 * Which would be the following:
 */

// import Queue from "bull";
// import milliseconds from "milliseconds";
//
// const scheduler = new Queue("schedulerQueue", {
//   defaultJobOptions: { repeat: { every: milliseconds.seconds(10) } },
// });
//
// const main = async () => {
//   await scheduler.add({});
// };
//
// scheduler.process((_, done) => {
//   console.log("Scheduled job");
//   done();
// });
//
// main().catch(console.error);

/**
 * In the example above we created a queue called scheduler to which we passed some settings,
 * which we stipulated that the scheduler will run every 5 minutes.
 * Then you notice that in our main() function we pass an empty object to the queue,
 * because in this case I didn't want to add something to the queue,
 * what I want is for the processor to be executed to apply my logic, which in this case is just a log.
 */


/**
 * *3> TYPE INFERENCE
 * Another amazing thing is that if you are a TypeScript programmer,
 * you can infer the data types very easily in this library, like this:
 *
 */

// import Queue from "bull";
//
// interface IJobData {
//   name: string;
//   age: number;
// }
//
// const queue = new Queue<IJobData>("myQueue");
//
// const main = async () => {
//   await queue.add({ name: "John", age: 30 });
// };
//
// queue.process((job, done) => {
//   console.log(job.data.name);
//   done();
// });
//
// void main();


/**
 * *4> DELETING FROM QUEUE
 * Another super interesting point is the ease with which we can fetch the jobs that are in the queue,
 * but first I recommend that you fully understand the library's lifecyle.
 * The library has several methods and several ways to perform operations such as removing a job from the queue.
 */

// import Queue from "bull";
//
// interface IJobData {
//   name: string;
//   age: number;
// }
//
// const queue = new Queue<IJobData>("myQueue");
//
// const controller = async () => {
//   const queuedJobs = await queue.getJobs(["waiting", "delayed"]);
//
//   const jobsToRemove = queuedJobs.filter(
//     (queuedJob) => queuedJob.data.age >= 31
//   );
//
//   await Promise.all(jobsToRemove.map((job) => job.remove()));
// };
//
// void controller();

/**
 * Let's suppose that from a controller/service/handler that you have in your application, you want to remove a job regardless of the reason.
 * As you may have noticed, we first went to the queue to find all the jobs that have the status of waiting and delayed,
 * then we filter the jobs by age (in this case I wanted all jobs whose age property value was greater than or equal to 32).
 * Finally, we map some promises and then invoke them.
 */

/**
 * *5> Adding to QUEUE
 * The same concept can be applied when inserting jobs into the queue,
 * if you have a list of data that need to be inserted into the queue, you can do it like this:
 */

// import Queue from "bull";
//
// interface IJobData {
//   name: string;
//   age: number;
// }
//
// const users = [
//   { name: "John", age: 31 },
//   { name: "Jane", age: 25 },
//   { name: "Jim", age: 19 },
//   { name: "Jill", age: 17 },
//   { name: "Jack", age: 32 }
// ];
//
// const queue = new Queue<IJobData>("myQueue");
//
// const controller = async () => {
//   const promises = users.map((user) => queue.add(user));
//
//   await Promise.all(promises);
// };
//
// void controller();

/**
 * In the example above, we have an array called users that we are going to use to map
 * the promises that correspond to the addition of each of the jobs in the queue,
 * finally we invoke each of the promises to insert them into the queue.
 */


/**
 * *6> DELAYS
 *
 * Imagine that a user has just registered in your application and you would like to s
 * end them an email asking how their experience has been so far.
 * The implementation could look like the following:
 */


// import Queue from "bull";
// import milliseconds from "milliseconds";
//
// interface IJobData {
//   email: string;
//   subject: string;
//   body: string;
// }
//
// const queue = new Queue<IJobData>("myQueue");
//
// const controller = async () => {
//   // 7 days delay
//   await queue.add(
//     {
//       email: "7days@dev.to",
//       subject: "What's your feedback so far?",
//       body: "I hope that your experience with our service has been great.",
//     },
//     { delay: milliseconds.days(7) }
//   );
// };
//
// void controller();

/**
 * Another reason why you can choose to use a delayed job is if you want to add a delay according to the timestamp. Something like this:
 */

// import Queue from "bull";
// import milliseconds from "milliseconds";
//
// interface IJobData {
//   email: string;
//   subject: string;
//   body: string;
// }
//
// const queue = new Queue<IJobData>("myQueue");
//
// const controller = async () => {
//   // Process At: 2021-01-22T10:04:00.000Z
//   const currentTime = new Date().getTime();
//   const processAt = new Date("2021-01-22T10:04:00.000Z").getTime();
//   const delay = processAt - currentTime;
//   await queue.add(
//     {
//       email: "processAt@dev.to",
//       subject: "Event Reminder",
//       body: "You have an event coming up!",
//     },
//     { delay }
//   );
// };
//
// void controller();
