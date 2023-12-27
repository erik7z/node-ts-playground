import csv from 'csv'
import * as fs from 'fs';

// // -- streaming to csv
// (async () => {
//   const stringifier = csv.stringify({
//     delimiter: ':'
//   });
//
//   stringifier.write([ 'root','x','0','0','root','/root','/bin/bash' ]);
//
//   stringifier.end();
//   const dest = fs.createWriteStream('files/csv-test.csv', {encoding: "utf-8"})
//
//   stringifier.pipe(dest)
// })()


// // -- Reading by batch and streaming to csv
// (async () => {
//   const data = Array(100).fill({ header1: "data1", header2: "data2" })
//
//   const stringifier = csv.stringify({
//     columns: ['header1', 'header2'],
//     header: true
//   });
//
//   data.map((row) => {
//     stringifier.write([row.header1, row.header2]);
//   })
//
//
//   stringifier.end();
//   const dest = fs.createWriteStream('files/csv-test.csv', { encoding: "utf-8" })
//
//   stringifier.pipe(dest)
// })()


// -- custom headers
(async () => {
  const data = Array(10).fill({ header1: "data1", header2: "data2" })

  const stringifier = csv.stringify({
    columns: {header1: "Заголовок 1", header2: "Заголовок 2"},
    header: true
  });

  data.map((row) => {
    stringifier.write(row);
  })


  stringifier.end();

  const dest = fs.createWriteStream('files/csv-test.csv', { encoding: "utf-8" })

  stringifier.pipe(dest)
})()
