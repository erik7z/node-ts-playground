/**
 * [Node.js Readable Streams Explained](https://thenewstack.io/node-js-readable-streams-explained/)
 *
 * What’s a Stream Implementation?
 *
 * A readable implementation is a piece of code that extends `Readable`, which is the Node.js base class for read streams.
 * It can also be a simple call to the `new Readable()` constructor, if you want a custom stream without defining your own class.
 *
 * I’m sure plenty of you have used streams from the likes of HTTP `res` handlers to `fs.createReadStream` file streams.
 * An implementation, however, needs to respect the rules for streams,
 * namely that certain functions are overridden when the system calls them for stream flow situations.
 */

// const { Readable } = require('stream')
//
// // This data can also come from other streams :]
// let dataToStream = [
//   'This is line 1\n'
//   , 'This is line 2\n'
//   , 'This is line 3\n'
// ]
//
// class MyReadable extends Readable {
//   constructor(opts: any = {}) {
//     super(opts)
//   }
//
//   _read() {
//     // The consumer is ready for more data
//     this.push(dataToStream.shift())
//     if (!dataToStream.length) {
//       this.push(null) // End the stream
//     }
//   }
//
//   _destroy() {
//     // Not necessary, but illustrates things to do on end
//     dataToStream.length = 0
//   }
// }
//
// new MyReadable().pipe(process.stdout)

/**
 * The takeaways from this are:
 * - Of course, call `super(opts)` or nothing will work.
 * - `_read` is required and is called automatically when new data is wanted.
 * - Calling `push(<some data>)` will cause the data to go into an internal buffer,
 *    and it will be consumed when something, like a piped writable stream, wants it.
 * - `push(null)` is required to properly end the read stream.
 *   + An `end` event will be emitted after this.
 *   + A `close` event will also be emitted unless `emitClose: false` was set in the constructor.
 * - `_destroy` is optional for cleanup things.
 *    Never override `destroy`; always use the underscored method for this and for `_read`.
 */


/**
 * For such a simple implementation, there’s no need for the class.
 * A class is more appropriate for things that are more complicated in terms of their underlying data resources.
 *
 * Above particular example can also be accomplished by constructing a Readable inline:
 */

// const { Readable } = require('stream')
//
// // This data can also come from other streams :]
// let dataToStream = [
//   'This is line 1\n'
//   , 'This is line 2\n'
//   , 'This is line 3\n'
// ]
//
// const myReadable = new Readable({
//   read() {
//     this.push(dataToStream.shift())
//     if (!dataToStream.length) {
//       this.push(null) // End the stream
//     }
//   }
//   , destroy() {
//     dataToStream.length = 0
//   }
// })
//
// myReadable.pipe(process.stdout)

/**
 * However, there’s one major problem with this code.
 * If the data set were larger, from a file stream, for example,
 * then this code is repeating a very common mistake with node streams:
 * > This doesn’t respect backpressure.
 *
 * # What’s Backpressure?
 * Remember the internal buffer that I mentioned above?
 * This is an in-memory data structure that holds the streaming chunks of data — objects, strings or buffers.
 *
 * Its size is controlled by the `highWaterMark` property, and the default is 16KB of byte data,
 * or 16 objects if the stream is in object mode.
 *
 * When data is pushed through the readable stream, the `push` method may return `false`.
 *
 * If so, that means that the `highWaterMark` is close to, or has been, exceeded, and that is called `backpressure`.
 *
 * If that happens, it’s up to the implementation to stop pushing data and wait for the `_read` call to come,
 * signifying that the consumer is ready for more data, so push calls can resume.
 *
 * This is where a lot of folks fail to implement streams properly.
 * Here are a couple of tips about pushing data through read streams:
 *
 * - It’s not necessary to wait for `_read` to be called to push data as long as backpressure is respected.
 * Data can continually be pushed until backpressure is reached.
 * If the data size isn’t very large, it’s possible that backpressure will never be reached.
 *
 * - The data from the buffer will not be consumed until the stream is in a `reading mode`.
 * If `data` is being pushed, but there are no 'data' events and no `pipe`,
 * then backpressure will certainly be reached if the data size exceeds the default buffer size.
 *
 * [Read more](https://nodejs.org/en/docs/guides/backpressuring-in-streams)
 *
 */
