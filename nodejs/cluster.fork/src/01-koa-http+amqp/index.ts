import cluster from 'cluster';
import os from 'os';
import Koa, { Context } from 'koa';
import Router from 'koa-router';
import amqp, { Channel } from 'amqplib';

const app = new Koa();
const router = new Router();

if (cluster.isMaster) {
    console.log(`Master process ${process.pid} is running`);

    router.get('/', async function metrics (ctx: any, next: any)  {
        ctx.body = 'Hello from master!';
    });

    router.get('/info', async (ctx: any) => {
        ctx.body = `Master process ${process.pid} is running`;
    });

    app.use(router.routes()).use(router.allowedMethods());

    app.listen(3000, () => {
        console.log(`Master process ${process.pid} is listening on port 3000`);
    });

    // Fork workers
    const numCPUs = os.cpus().length;
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

    const consumeMessages = async (): Promise<void> => {
        try {
            const connection = await amqp.connect('amqp://localhost:5673');
            const channel: Channel = await connection.createChannel();
            const queue = 'messages';

            await channel.assertQueue(queue);
            console.log(`Worker process ${process.pid} is waiting for messages`);

            channel.consume(queue, (msg) => {
                if (msg !== null) {
                    console.log(`Worker process ${process.pid} received message: ${msg.content.toString()}`);
                    channel.ack(msg);
                }
            });
        } catch (error) {
            console.error(`Worker process ${process.pid} encountered an error:`, error);
        }
    };

    consumeMessages();
}
