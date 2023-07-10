import cluster from 'cluster';
import os from 'os';
import Koa, { Context } from 'koa';

const app = new Koa();
const numCPUs = os.cpus().length;

if (cluster.isMaster) {
    console.log(`Master process ${process.pid} is running`);

    // Fork workers
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker process ${worker.process.pid} died`);
        // Fork a new worker if one dies
        cluster.fork();
    });
} else {
    // Worker process
    console.log(`Worker process ${process.pid} started`);

    // Koa application logic
    app.use(async (ctx) => {
        ctx.body = 'Hello from worker!';
    });

    app.listen(3000, () => {
        console.log(`Worker process ${process.pid} is listening on port 3000`);
    });
}
