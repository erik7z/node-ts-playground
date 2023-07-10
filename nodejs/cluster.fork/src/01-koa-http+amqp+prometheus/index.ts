import cluster from 'cluster';
import os from 'os';
import Koa from 'koa';
import Router from 'koa-router';
import amqp, {Channel} from 'amqplib';
import {koaMiddleware} from 'prometheus-api-metrics'
import Prometheus from 'prom-client';

Prometheus.register.setDefaultLabels({
  process: process.pid.toString(),
    role: cluster.isMaster ? 'master' : 'worker'
})

async function startServer(role: string, router: Router) {
    const app = new Koa();

    app.use(koaMiddleware({
        metricsPath: '/metrics',
    }));

    app.use(router.routes()).use(router.allowedMethods());

    app.listen(3000, () => {
        console.log(`${role} process ${process.pid} is listening on port 3000`);
    });
}

const router = new Router();

if (cluster.isMaster) {
    // Object to store worker metrics
    const workerMetrics = new Map<number, any>();

    console.log(`Master process ${process.pid} is running`);

    router.get('/', async function metrics (ctx: any, next: any)  {
        ctx.body = 'Hello from master!';
    });

    router.get('/info', async (ctx: any) => {
        ctx.body = `Master process ${process.pid} is running`;
    });

    router.get('/metrics', async (ctx: any) => {
        const mainMetrics = await Prometheus.register.getMetricsAsJSON()
        const newMetrics = Prometheus.AggregatorRegistry.aggregate([mainMetrics, ...workerMetrics.values()])

        ctx.body = await newMetrics.metrics()
    });

    startServer('Master', router);

    // Fork workers
    const numCPUs = os.cpus().length;
    for (let i = 0; i < numCPUs; i++) {
        const worker = cluster.fork();

        worker.on('message', async (msg) => {
            if(msg.metrics && msg.metrics.length) {
                console.log('Master process received metrics from worker', msg.metrics.length)
                workerMetrics.set(worker.id, msg.metrics)
            }
        })
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker process ${worker.process.pid} died`);
        // Fork a new worker if one dies
        cluster.fork();
    });
} else {
    console.log(`Worker process ${process.pid} started`);

    Prometheus.collectDefaultMetrics({register: Prometheus.register})

    const amqpMsgCount = new Prometheus.Counter({
        labelNames: ['type', 'endpoint'],
        name: 'amqp_incoming_messages_total',
        help: 'The total number of incoming AMQP messages',
        registers: [Prometheus.register]
    });

    setInterval(async () => {
        const metrics = await Prometheus.register.getMetricsAsJSON()
        if(process.send) {
            process.send({metrics});
        }
    }, 5000)

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
                    amqpMsgCount.labels('amqp', 'someAmqpEnpoint').inc();
                }
            });
        } catch (error) {
            console.error(`Worker process ${process.pid} encountered an error:`, error);
        }
    };

    consumeMessages();
}
