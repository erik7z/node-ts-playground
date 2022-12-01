
// const buf1 = Buffer.alloc(10);
// const buf2 = Buffer.from("hello buffer");
//
// console.log(buf2)
//
// console.log(buf1.toJSON())
// console.log(buf2.toJSON())
//
// buf1.write("Buffer really rocks!")
// console.log(buf1.toString())

// const obj = {
//   aNum: 123,
//   aStr: 'text'
// }
//
//
// const buf = Buffer.from('abc');
// console.log(buf);
// console.log(buf.toString());
//
// const buf3 = Buffer.from(JSON.stringify(obj))
//
// console.log(buf3)
// console.log(JSON.parse(buf3.toString()))

// const bufferList = []
//


// bufferList.push(buf1);
// bufferList.push(buf2);
//
//
// const sumBuff = Buffer.concat([buf1, buf2])
// console.log(buf1.length)
// console.log(sumBuff)

// for (const b of sumBuff.values()) {
//   console.log(b)
//
// }


function joinBuffers(buffers: Buffer[], delimiter = ' ') {
  const delimiterBuffer = Buffer.from(delimiter);
  return buffers.reduce((prev, buffersSum) => Buffer.concat([prev, delimiterBuffer, buffersSum]));
}

// const buf1 = Buffer.from('banana', "binary")
// const buf2 = Buffer.from('cucumber', "binary")
//
// const joined = joinBuffers([buf1, buf2])
//
// console.log(joined.toString().split(' '))
//
// const obj = {
//   key1: 'val1',
//   key2: 'val2'
// }
//
// const objectEntriesBufArr = Object.entries(obj)
//   .map(([key, value]) => joinBuffers(
//     [
//       Buffer.from(key, 'binary'),
//       Buffer.from(value, 'binary')
//     ], ':'))
//
// const sumBuff = joinBuffers(objectEntriesBufArr, ',')
//
// console.log(sumBuff)
//
// const decodedEntries = sumBuff.toString().split(',')
//
// console.log(decodedEntries)
//
// const result: any = {}
//
// decodedEntries.forEach((entry) => {
//   const [key, value] = entry.split(':')
//   result[key] = value
// })
//
// console.log(result);

// console.log(typeof Number(0).toString())

console.log(Math.floor(new Date().getTime() / 1000))
