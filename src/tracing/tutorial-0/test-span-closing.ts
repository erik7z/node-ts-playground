import { initTracer } from "./lib/tracing";

const tracer = initTracer("hello-world");

const sleep = async (seconds: number) => new Promise((res) => setTimeout(() => res(true), seconds * 1000));

const sayHello = async () => {
  const span1 = tracer.startSpan("span1");
  span1.setTag("span1-tag", "span1-tag-value");
  span1.log({
    event: "span1 log#1",
    value: "span1 log#1 value"
  });

  console.log('span1 log#1 sent');

  span1.log({ event: "span1 log#2 event without value" });
  console.log('span1 log#2 sent');

  console.log('sleeping 10 seconds');
  await sleep(10);

  console.log('finishing span 1');
  span1.finish();

  console.log('sleeping 10 seconds');
  await sleep(10);

  const span2 = tracer.startSpan("span2");
  span2.setTag("span2-tag", "span2-tag-value");
  span2.log({
    event: "span2 log#1",
    value: "span2 log#1 value"
  });

  console.log('span2 log#1 sent');

  span2.log({ event: "span2 log#2 event without value" });
  console.log('span2 log#2 sent');

  console.log('sleeping 10 seconds');
  await sleep(10);

  console.log('finishing span 1');
  span2.finish();

};

async function testTracer() {

  await sayHello();

  tracer.close(() => process.exit());
}

testTracer();



