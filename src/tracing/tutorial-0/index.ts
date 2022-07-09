import {initTracer} from "./lib/tracing";
import assert from "assert";

const tracer = initTracer("hello-world");

const sayHello = (helloTo: string) => {
    const span = tracer.startSpan("say-hello");
    span.setTag("hello-to", helloTo);
    const helloStr = `Hello, ${helloTo}!`;
    span.log({
        event: "string-format",
        value: helloStr,
    });
    console.log(helloStr);
    span.log({ event: "print-string" });
    span.finish();
};

assert(process.argv.length == 3, "Expecting one argument");
const helloTo = process.argv[2];

sayHello(helloTo);

tracer.close(() => process.exit());
