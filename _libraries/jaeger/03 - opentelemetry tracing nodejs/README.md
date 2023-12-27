# [Tracing Node.js application with OpenTelemetry & Jaeger UI](https://selvaganesh93.medium.com/tracing-node-js-application-with-opentelemetry-jaeger-ui-9523c0ac8453)

### Plan:
- We will instrument application with OpenTelemetry’s Node.js client library to generate trace data and send it to an JaegerExporter Collector.
- The Collector will then export the trace data to Jaeger UI to visualize the time series chart.


## 1. Install JaegerUI

```shell
docker run -d --name jaeger \
  -e COLLECTOR_ZIPKIN_HOST_PORT=:9411 \
  -p 5775:5775/udp \
  -p 6831:6831/udp \
  -p 6832:6832/udp \
  -p 5778:5778 \
  -p 16686:16686 \
  -p 14250:14250 \
  -p 14268:14268 \
  -p 14269:14269 \
  -p 9411:9411 \
  jaegertracing/all-in-one:1.29
```

Go to http://localhost:16686/search to use Jaeger UI

## 2. Install OpenTelemetry Packages

Next step is to setup OpenTelemetry packages to our application.
```shell
npm install @opentelemetry/api  @opentelemetry/auto-instrumentations-node @opentelemetry/exporter-collector @opentelemetry/exporter-jaeger @opentelemetry/instrumentation @opentelemetry/plugin-express @opentelemetry/plugin-http @opentelemetry/propagator-ot-trace @opentelemetry/resources @opentelemetry/sdk-node @opentelemetry/sdk-trace-base @opentelemetry/sdk-trace-node @opentelemetry/semantic-conventions @opentelemetry/tracing --save-dev

```

## 3. Create tracer.js file
A tracer.js file takes care of tracing setup and allows to capture the requests and responses.

```javascript
// tracer.js
'use strict'

const {
  BasicTracerProvider,
  ConsoleSpanExporter,
  SimpleSpanProcessor,
  BatchSpanProcessor,
} = require('@opentelemetry/tracing')
const { CollectorTraceExporter } = require('@opentelemetry/exporter-collector')
const { Resource } = require('@opentelemetry/resources')
const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions')
const { ExpressInstrumentation } = require('@opentelemetry/instrumentation-express')
const { HttpInstrumentation } = require('@opentelemetry/instrumentation-http')
const { registerInstrumentations } = require('@opentelemetry/instrumentation')
const opentelemetry = require('@opentelemetry/sdk-node')
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node')
const { JaegerExporter } = require('@opentelemetry/exporter-jaeger')
const { NodeTracerProvider } = require('@opentelemetry/sdk-trace-node')
const { OTTracePropagator } = require('@opentelemetry/propagator-ot-trace')

const hostName = process.env.OTEL_TRACE_HOST || 'localhost'

const options = {
  tags: [],
  endpoint: `http://${hostName}:14268/api/traces`,
}

const init = (serviceName, environment) => {

  // User Collector Or Jaeger Exporter
  //const exporter = new CollectorTraceExporter(options)
  
  const exporter = new JaegerExporter(options)

  const provider = new NodeTracerProvider({
    resource: new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: serviceName, // Service name that showuld be listed in jaeger ui
      [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: environment,
    }),
  })

  //provider.addSpanProcessor(new SimpleSpanProcessor(exporter))

  // Use the BatchSpanProcessor to export spans in batches in order to more efficiently use resources.
  provider.addSpanProcessor(new BatchSpanProcessor(exporter))

  // Enable to see the spans printed in the console by the ConsoleSpanExporter
  // provider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter())) 

  provider.register({ propagator: new OTTracePropagator() })

  console.log('tracing initialized')

  registerInstrumentations({
    instrumentations: [new ExpressInstrumentation(), new HttpInstrumentation()],
  })
  
  const tracer = provider.getTracer(serviceName)
  return { tracer }
}

module.exports = {
  init: init,
}

```


3. Instrumentation setup
   There are two ways to setup instrumentation automatic and manual, to instrument express traces we will use new HttpInstrumentation(),
   new ExpressInstrumentation() and to instrument http traces we will use new HttpInstrumentation().
   [read more](https://www.npmjs.com/package/@opentelemetry/instrumentation-express)
