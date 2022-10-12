import { default as FFMpeg } from "fluent-ffmpeg";
import * as path from "path";
import { Readable, Writable } from "stream";
import fs from "fs";


// !!!! cannot read mp4 from stream properly, output gets broken!
async function compress(input: Readable, output: Writable) {
  // saving stream to temp file [issue](https://github.com/fluent-ffmpeg/node-fluent-ffmpeg/issues/932#issuecomment-913659969)
  const tempOutput = fs.createWriteStream(path.resolve(__dirname, "temp.mp4"));
  input.pipe(tempOutput)
  const tempInput = path.resolve(__dirname, "temp.mp4");

  await new Promise((res, rej) => {
    console.log("commenced pipe");

    FFMpeg(tempInput)
      // .size("1440x?") // cannot combine "-acodec copy", "-vcodec copy" and resize
      .addOptions(["-preset slow", "-crf 28", "-x264-params keyint=1"])
      .addOptions(["-movflags faststart", "-acodec copy", "-vcodec copy"]) // cannot read from mp4 stream, only copy
      .addOutputOption("-movflags", "frag_keyframe+empty_moov")
      .format("mp4")
      .on("error", rej)
      .on("end", (r) => {
        console.log("completed pipe", r);
        res(r);
      })
      .pipe(output);
  });
  fs.unlinkSync(tempInput)
}

const input = fs.createReadStream(path.resolve(__dirname, "../", "input.mp4"));
const output = fs.createWriteStream(path.resolve(__dirname, "output.mp4"));

compress(input, output);

