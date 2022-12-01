import { default as FFMpeg } from "fluent-ffmpeg";
import * as path from "path";
import { Readable, Writable } from "stream";
import fs from "fs"

async function compress(input: string | Readable, output: Writable) {
  await new Promise((res, rej) => {
    console.log('commenced convert')
    FFMpeg(input)
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

}

const input = path.resolve(__dirname, "../", "input.mp4");
const output = fs.createWriteStream(path.resolve(__dirname, "output.mp4"));


compress(input, output);

