/**
 * # [How to use Streams in Node.js](https://masteringbackend.com/posts/how-to-use-streams-in-node-js)
 *
 * Streams are methods used in handling writing/reading files, network communications, or any kind of end-to-end information exchange in an efficient way.
 */
// // basic code example of a stream.
// // The fs Node.js module gives us the ability to read files, and whenever a new connection is established to our HTTP server we can serve the file with HTTP.
// const http = require('http')
// const fs = require('fs')
// const server = http.createServer(function(req: any, res: any) {
//   fs.readFile('tmp/log.txt', (err: Error, data: Buffer) => { // reads the entire contents of the file, and when it’s done reading invokes a callback function.
//     res.end(data) // inside the callback will return the contents of the file to the HTTP client.
//   })
// })
// server.listen(3000)

/**
 * Using the above method will cause our operation to take time if the files are large.
 *
 * So to mitigate the problem, let’s write the same code using a stream method.
 */

// const http = require('http')
// const fs = require('fs')
// const server = http.createServer((req: any, res: any) => {
//   const stream = fs.createReadStream('tmp/log.txt')
//   stream.pipe(res)
// })
// server.listen(3000)

/**
 * Now you can see that we have more control, we start “streaming” the files to the HTTP client as soon as we have chunks of data ready to be sent.
 * This is better especially if we have a large file we don’t have to wait until the file is completely read.
 */


/**
 * # How to create a readable stream
 * To create a readable stream we start by creating a stream object.
 * after creating a stream object we can go ahead and implement the _read method.
 * Now that the stream is initialized, we can send data to it:
 */

// import Stream from 'stream'
// const readableStream = new Stream.Readable()
// readableStream._read = () => { }
//
// readableStream.push('hi!')
// readableStream.push('Success!')
//

/**
 * # Types of Readable streams:
 * There are two types of readable streams which include:
 * - **Flowing** readable stream(Flowing mood).
 * - **Paused** readable stream(Paused mood).
 *
 * ### Flowing readable stream:
 * A flowing readable stream uses events from the event emitter to provide data for the application and allows this application to flow continuously.
 * The different types of events used in the flowing mode include:
 * - **Data** event - are called whenever data is available to be read by a stream.
 * - **End** event is called whenever the stream reaches the end of the file, and no more data is available to read.
 * - **Error** event is called whenever there is an error during the read stream process. This event can also be called when using writable streams.
 * - **Finish** event is called when all data has been flushed to the underlying system.
 *
 * ### Paused readable stream:
 * pause mode uses the `read()`method to receive the next chunk of data from the stream,
 * and this read() method has to be called explicitly since the stream is not read continuously in a pause mood.
 *
 * It is also important to note that streams that start in the pause mood can be switched to the flowing mood using the following steps:
 * - By adding a ‘data’ event handler to the stream.
 * - By calling the `stream.resume()` method.
 * - By calling the `stream.pipe()` method, which sends data to writable streams.
 */

/**
 * # How to create a writable stream:
 * To create a writable stream, we have to extend the base object Writable and implement its _write() method.
 */

// import Stream from 'stream'
// import * as fs from "fs";
// const writableStream = new Stream.Writable()
//
// writableStream._write = (chunk: Stream.Writable, encoding: BufferEncoding, next) => {
//   console.log(chunk.toString())
//   next()
// }
//
// const readStr = fs.createReadStream('tmp/test.txt', { encoding: "utf-8" })
// readStr.pipe(writableStream)

/**
 * # How to retrieve data from a read stream:
 * Using the Writable stream, we can retrieve data from the readable stream using the code example:
 */

// import Stream from 'stream'
// const readableStream = new Stream.Readable({
//   read() {}
// })
//
// const writableStream = new Stream.Writable()
//
// writableStream._write = (chunk: Stream.Writable, encoding, next) => {
//   console.log(chunk.toString())
//   next()
// }
//
// readableStream.pipe(writableStream)
// readableStream.push('Hello!')
// readableStream.push('Success!')


/**
 * # Use the method end():
 *
 * With the `end()` method we are to send a signal to the write stream letting it know we have finished writing.
 * The code for it is as follows:
 */

// import Stream from 'stream'
// const readableStream = new Stream.Readable({
//   read() { }
// })
//
// const writableStream = new Stream.Writable()
// writableStream._write = (chunk, encoding, next) => {
//   console.log(chunk.toString())
//   next()
// }
// readableStream.pipe(writableStream)
// readableStream.push('Hi!')
// readableStream.push('Success!')
// writableStream.end()
// // !ERROR
// readableStream.push('Success1')






