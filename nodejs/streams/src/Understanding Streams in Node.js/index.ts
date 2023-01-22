/**
 * # [Understanding Streams in Node.js](https://nodesource.com/blog/understanding-streams-in-nodejs/)
 *
 * Streams are one of the fundamental concepts that power Node.js applications. They are data-handling method and are used to read or write input into output sequentially.
 * What makes streams unique, is that instead of a program reading a file into memory all at once like in the traditional way, streams read chunks of data piece by piece, processing its content without keeping it all in memory.
 *
 * Streams basically provide two major advantages compared to other data handling methods:
 *
 * - **Memory efficiency**: you don’t need to load large amounts of data in memory before you are able to process it
 * - **Time efficiency**: it takes significantly less time to start processing data as soon as you have it, rather than having to wait with processing until the entire payload has been transmitted
 *
 * ### There are 4 types of streams in Node.js:
 *
 * 1. **Writable**: streams to which we can write data.
 * For example, `fs.createWriteStream()` lets us write data to a file using streams.
 *
 * 2. **Readable**: streams from which data can be read.
 * For example: `fs.createReadStream()` lets us read the contents of a file.
 *
 * 3. **Duplex**: streams that are both Readable and Writable. For example, net.Socket
 *
 * 4. **Transform**: streams that can modify or transform the data as it is written and read.
 * For example, in the instance of file-compression, you can write compressed data and read decompressed data to and from a file.
 */

/**
 * #1. How to create a readable stream
 */
// import Stream from 'stream'
// const readableStream = new Stream.Readable()
//
// // Now that the stream is initialized, we can send data to it:
// readableStream.push('ping!')
// readableStream.push('pong!')

/**
 * ### async iterator
 * > It’s highly recommended to use async iterator when working with streams
 * # 2. use async iterator when reading from readable streams:
 */

// import * as fs from 'fs';
//
// async function logChunks(readable: fs.ReadStream) {
//   for await (const chunk of readable) {
//     console.log(chunk);
//   }
// }
//
// const readable = fs.createReadStream('tmp/test.txt', {encoding: 'utf8'});
// logChunks(readable);


/**
 * #3. pushing data to stream and reading from it
 */
// import { Readable } from 'stream'
// const readableStream = Readable.from('Good morning', {encoding: 'utf8'})
//
// readableStream.push('ping!')
// readableStream.push('pong!')
//
// async function logChunks(readable: Readable) {
//   for await (const chunk of readable) {
//     console.log(chunk);
//   }
// }
//
// logChunks(readableStream);
// // >
// // ping!
// // pong!
// // Good morning


/**
 * #4. pushing objects data to stream and reading from it
 */

// import { Readable } from 'stream'
// const readableStream = Readable.from([], {encoding: 'utf8'})
//
// readableStream.push(JSON.stringify({a: 1, b: 2}))
// readableStream.push(JSON.stringify({a: 3, b: 5}))
//
// async function logChunks(readable: Readable) {
//   for await (const chunk of readable) {
//     console.log(JSON.parse(chunk));
//   }
// }
//
// logChunks(readableStream);
// // >
// // { a: 1, b: 2 }
// // { a: 3, b: 5 }

/**
 * #5 collect the contents of a readable stream in a string:
 */

// import { Readable } from 'stream';
// import assert from "assert";
//
// (async () => {
//   async function readableToString2(readable: Readable) {
//     let result = '';
//     for await (const chunk of readable) {
//       result += chunk;
//     }
//     return result;
//   }
//
//   const readable = Readable.from('Good morning!', { encoding: 'utf8' });
//   assert.equal(await readableToString2(readable), 'Good morning!');
// })()


/**
 * # Readable.from(): Creating readable streams from iterables
 * `stream.Readable.from(iterable, [options])`
 * it’s a utility method for creating Readable Streams out of iterators, which holds the data contained in iterable.
 * Iterable can be a synchronous iterable or an asynchronous iterable.
 *
 * The parameter options is optional and can, among other things, be used to specify a text encoding.
 */

// import { Readable } from "stream";
//
// async function * generate() {
//   yield 'hello';
//   yield 'streams';
// }
//
// const readable = Readable.from(generate());
//
// readable.on('data', (chunk: Readable) => {
//   console.log(chunk);
// });


/**
 * # Two Reading Modes
 *
 * According to Streams API, readable streams effectively operate in one of two modes: flowing and paused.
 * A Readable stream can be in object mode or not, regardless of whether it is in flowing mode or paused mode.
 *
 * In **flowing** mode, data is read from the underlying system automatically and provided to an application as quickly as possible using events via the EventEmitter interface.
 * In **paused** mode, the `stream.read()` method must be called explicitly to read chunks of data from the stream.
 *
 * In a **flowing8** mode, to read data from a stream, it’s possible to listen to data event and attach a callback.
 * When a chunk of data is available, the readable stream emits a data event and your callback executes.
 */

// const fs = require("fs");
//
// (() => {
//   let data = '';
//
//   const readerStream = fs.createReadStream('tmp/test.txt'); //Create a readable stream
//
//   readerStream.setEncoding('UTF8'); // Set the encoding to be utf8.
//
// // Handle stream events --> data, end, and error
//   readerStream.on('data', function(chunk: string ) {
//     data += chunk;
//   });
//
//   readerStream.on('end',function() {
//     console.log(data);
//   });
//
//   readerStream.on('error', function(err: Error) {
//     console.log(err.stack);
//   });
// })()
//
// console.log("Program Ended");

/**
 * The function call `fs.createReadStream()` gives you a readable stream.
 * Initially, the stream is in a static state.
 * As soon as you listen to data event and attach a callback it starts flowing.
 * After that, chunks of data are read and passed to your callback.
 *
 * The stream implementor decides how often a data event is emitted.
 * For example, an HTTP request may emit a data event once every few KBs of data are read.
 * When you are reading data from a file you may decide you emit a data event once a line is read.
 *
 * When there is no more data to read (end is reached), the stream emits an end event.
 * In the above snippet, we listen to this event to get notified when the end is reached.
 *
 * Also, if there is an error, the stream will emit and notify the error.
 */


/**
 * In **paused** mode, you just need to call read() on the stream instance repeatedly until every chunk of data has been read,
 * like in the following example:
 */

// const fs = require('fs');
// const readableStream = fs.createReadStream('tmp/test.txt');
// let data = '';
// let chunk;
//
// readableStream.on('readable', function() {
//   while ((chunk = readableStream.read()) != null) {
//     data += chunk;
//   }
// });
//
// readableStream.on('end', function() {
//   console.log(data)
// });

/**
 * The `read()` function reads some data from the internal buffer and returns it.
 * When there is nothing to read, it returns null.
 * So, in the while loop, we check for null and terminate the loop.
 * Note that the readable event is emitted when a chunk of data can be read from the stream.
 *
 * > All `Readable` streams begin in **paused mode** but can be switched to **flowing mode** in one of the following ways:
 * - Adding a 'data' event handler.
 * - Calling the **stream.resume()** method.
 * - Calling the **stream.pipe()** method to send the data to a `Writable`.
 *
 * > The `Readable` can switch back to **paused** mode using one of the following:
 * - If there are no pipe destinations, by calling the stream.pause() method.
 * - If there are pipe destinations, by removing all pipe destinations.
 * Multiple pipe destinations may be removed by calling the `stream.unpipe()` method.
 *
 *
 * The important concept to remember is that a Readable will not generate data until a mechanism for either consuming or ignoring that data is provided.
 *
 * If the consuming mechanism is disabled or taken away, the Readable will attempt to stop generating the data.
 * Adding a readable event handler automatically make the stream to stop flowing, and the data to be consumed via `readable.read()`.
 * If the 'readable' event handler is removed, then the stream will start flowing again if there is a 'data' event handler.
 */


/**
 * # How to create a writable stream
 * To write data to a writable stream you need to call `write()` on the stream instance.
 */

// const fs = require('fs');
// const readableStream = fs.createReadStream('tmp/test.txt');
// const writableStream = fs.createWriteStream('tmp/test2.txt');
//
// readableStream.setEncoding('utf8');
//
// readableStream.on('data', function(chunk: string) {
//   writableStream.write(chunk);
// });


/**
 * The above code is straightforward. It simply reads chunks of data from an input stream and writes to the destination using `write()`
 * This function returns a boolean value indicating if the operation was successful.
 * If true, then the write was successful and you can keep writing more data.
 * If false is returned, it means something went wrong and you can’t write anything at the moment.
 * The writable stream will let you know when you can start writing more data by emitting a drain event.
 *
 * Calling the `writable.end()` method signals that no more data will be written to the Writable.
 * If provided, the optional callback function is attached as a listener for the 'finish' event.
 */

// // Write 'hello, ' and then end with 'world!'.
// const fs = require('fs');
// const file = fs.createWriteStream('tmp/example.txt');
// file.write('hello, ');
// file.end('world!');
//
// // ERROR! Writing more now is not allowed!
// file.write('hello, ');


/**
 * # You can also use async iterators to write to a writable stream, which is recommended
 */

// import * as util from 'util';
// import * as stream from 'stream';
// import * as fs from 'fs';
// import {once} from 'events';
// import assert from "assert";
//
// const finished = util.promisify(stream.finished); // (A)
//
// (async () => {
//   async function writeIterableToFile(iterable: string[], filePath: string) {
//     const writable = fs.createWriteStream(filePath, {encoding: 'utf8'});
//     for await (const chunk of iterable) {
//       if (!writable.write(chunk)) { // (B)
//         // Handle backpressure
//         await once(writable, 'drain');
//       }
//     }
//     writable.end(); // (C)
//     // Wait until done. Throws if there are errors.
//     await finished(writable);
//   }
//
//   await writeIterableToFile(['One', ' line of text.\n'], 'tmp/log.txt');
//
//   assert.equal(fs.readFileSync('tmp/log.txt', {encoding: 'utf8'}), 'One line of text.\n');
// })()

/**
 * The default version of `stream.finished()` is callback-based but can be turned into a Promise-based version via `util.promisify()` **(line A)**.
 * In this example, it is used the following two patterns:
 * - Writing to a writable stream while handling backpressure **(line B)**
 * - Closing a writable stream and waiting until writing is done **(line C)**
 */


/**
 * # pipeline()
 *
 * Piping is a mechanism where we provide the output of one stream as the input to another stream.
 * It is normally used to get data from one stream and to pass the output of that stream to another stream.
 * There is no limit on piping operations.
 * In other words, piping is used to process streamed data in multiple steps.
 */

// const { pipeline } = require('stream');
// const fs = require('fs');
// const zlib = require('zlib');
//
// // Use the pipeline API to easily pipe a series of streams
// // together and get notified when the pipeline is fully done.
// // A pipeline to gzip a potentially huge video file efficiently:
//
// pipeline(
//   fs.createReadStream('tmp/log.txt'),
//   zlib.createGzip(),
//   fs.createWriteStream('tmp/log.txt.gz'),
//   (err: Error) => {
//     if (err) {
//       console.error('Pipeline failed', err);
//     } else {
//       console.log('Pipeline succeeded');
//     }
//   }
// );
//
// // pipeline should be used instead of pipe, as pipe is unsafe.


/**
 * # The Stream Module
 *
 * The Node.js stream module provides the foundation upon which all streaming APIs are build.
 *
 * The Stream module is a native module that shipped by default in Node.js.
 * The Stream is an instance of the EventEmitter class which handles events asynchronously in Node.
 * Because of this, streams are inherently event-based.
 *
 * The `stream` module is useful for creating new types of stream instances. It is usually not necessary to use the stream module to consume streams.
 *
 * # Streams-powered Node APIs
 *
 * Due to their advantages, many Node.js core modules provide native stream handling capabilities, most notably:
 *
 * - `net.Socket `is the main node api that is stream are based on, which underlies most of the following APIs
 * - `process.stdin `returns a stream connected to stdin
 * - `process.stdout `returns a stream connected to stdout
 * - `process.stderr `returns a stream connected to stderr
 * - `fs.createReadStream()` creates a readable stream to a file
 * - `fs.createWriteStream()` creates a writable stream to a file
 * - `net.connect()` initiates a stream-based connection
 * - `http.request()` returns an instance of the http.ClientRequest class, which is a writable stream
 * - `zlib.createGzip()` compress data using gzip (a compression algorithm) into a stream
 * - `zlib.createGunzip()` decompress a gzip stream.
 * - `zlib.createDeflate()` compress data using deflate (a compression algorithm) into a stream
 * - `zlib.createInflate()` decompress a deflate stream
 */
