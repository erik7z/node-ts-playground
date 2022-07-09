import {opentracing, initTracer as initJaegerTracer} from 'jaeger-client'

export function initTracer(serviceName: string) {
    return initJaegerTracer({
        serviceName: serviceName,
        sampler: {
            type: "const",
            param: 1,
        },
        reporter: {
            logSpans: true,
            collectorEndpoint: 'http://localhost:24268/api/traces'
        },
    }, {
        logger: {
            info(msg: string) {
                console.log("INFO ", msg);
            },
            error(msg: string) {
                console.log("ERROR", msg);
            },
        },
    });
}

// export const tracing = initTracer('my-service-api') as opentracing.Tracer;
//
// export function createControllerSpan(controller: string, operation: string, headers: any) {
//     let traceSpan: opentracing.Span;
//     const parentSpanContext = tracing.extract(opentracing.FORMAT_HTTP_HEADERS, headers);
//     if (parentSpanContext) {
//         traceSpan = tracing.startSpan(operation, {
//             childOf: parentSpanContext,
//             tags: {
//                 [opentracing.Tags.SPAN_KIND]: opentracing.Tags.SPAN_KIND_RPC_SERVER,
//                 [opentracing.Tags.COMPONENT]: controller
//             }
//         });
//     } else {
//         traceSpan = tracing.startSpan(operation, {
//             tags: {
//                 [opentracing.Tags.SPAN_KIND]: opentracing.Tags.SPAN_KIND_RPC_SERVER,
//                 [opentracing.Tags.COMPONENT]: controller
//             }
//         });
//     }
//     return traceSpan;
// }
//
// export function finishSpanWithResult(span: opentracing.Span, status: number, errorTag?: boolean) {
//     span.setTag(opentracing.Tags.HTTP_STATUS_CODE, status);
//     if (errorTag) {
//         span.setTag(opentracing.Tags.ERROR, true);
//     }
//     span.finish();
// }
