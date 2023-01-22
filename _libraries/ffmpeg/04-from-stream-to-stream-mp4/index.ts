import { default as FFMpeg } from "fluent-ffmpeg";
import * as path from "path";
import { Readable, Writable } from "stream";
import fs from "fs";


async function compress(input: Readable, output: Writable) {
  // saving stream to temp file [issue](https://github.com/fluent-ffmpeg/node-fluent-ffmpeg/issues/932#issuecomment-913659969)
  const tempOutput = fs.createWriteStream(path.resolve(__dirname, "temp.mp4"));
  input.pipe(tempOutput)
  const tempInput = path.resolve(__dirname, "temp.mp4");

  await new Promise((res, rej) => {
    console.log('commenced convert')
    FFMpeg(tempInput)
      .size("1440x?")
      .addOptions(["-preset slow", "-crf 28", "-x264-params keyint=1"])
      // special option if output mp4 to stream [issue](https://github.com/fluent-ffmpeg/node-fluent-ffmpeg/issues/932)
      .addOutputOption("-movflags", "frag_keyframe+empty_moov")
      .format("mp4")
      .on("error", rej)
      .on("end", (r) => {
        console.log("completed", r);
        res(r);
      })
      .pipe(output);
  });

  fs.unlinkSync(tempInput)
}


const input = fs.createReadStream(path.resolve(__dirname, "../", "input.mp4"));
const output = fs.createWriteStream(path.resolve(__dirname, "output.mp4"));


compress(input, output);

























//
// // using pass through
// async function compress(input: Readable, finalOutput: string) {
//
//   // const pipeFF = new PassThrough()
//
//   // const tempOutput = path.resolve(__dirname, "output.mp4");
//   const tempOutput = fs.createWriteStream(path.resolve(__dirname, "output.mp4"));
//
//   await new Promise((res, rej) => {
//     console.log("commenced pipe");
//
//     FFMpeg(input)
//       // .size("1440x?") // cannot combine "-acodec copy", "-vcodec copy" and resize
//       .addOptions(["-preset slow", "-crf 28", "-x264-params keyint=1"])
//       .addOptions(["-movflags faststart", "-acodec copy", "-vcodec copy"]) // cannot read from mp4 stream, only copy
//       .addOutputOption("-movflags", "frag_keyframe+empty_moov")
//       .format("mp4")
//       .on("error", rej)
//       .on("end", (r) => {
//         console.log("completed pipe", r);
//         res(r);
//       })
//       .pipe(tempOutput);
//
//       // .pipe(pipeFF);
//   });
//
//
//   // await new Promise((res, rej) => {
//   //   console.log("commenced 2nd pipe");
//   //
//   //   FFMpeg(tempOutput)
//   //     .size("1440x?")
//   //     .addOptions(["-preset slow", "-crf 28", "-x264-params keyint=1"])
//   //     // .addOptions(["-movflags faststart", "-acodec copy", "-vcodec copy"])
//   //     .addOutputOption("-movflags", "frag_keyframe+empty_moov")
//   //     .format("mp4")
//   //     .on("error", rej)
//   //     .on("end", (r) => {
//   //       console.log("completed 2nd pipe", r);
//   //       res(r);
//   //     })
//   //     .save(finalOutput);
//   //
//   // });
//
//
// }
//
// const input = fs.createReadStream(path.resolve(__dirname, "../", "input.mp4"));
// const output = path.resolve(__dirname, "output.mp4");
//
// compress(input, output);

