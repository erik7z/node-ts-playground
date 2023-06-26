const Koa = require('koa');
const app = new Koa();


const prometheus = require("@echo-health/koa-prometheus-exporter")


app.use(prometheus.httpMetricMiddleware())
app.use(prometheus.middleware())

app.use(async (ctx, next) => {
    console.log(`${ctx.method} ${ctx.url}`);
    await next();
});

app.use(async (ctx) => {
    ctx.body = 'Hello, world!';
});

// Start the server
const port = 8080;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
