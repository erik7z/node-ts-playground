import { default as FFMpeg } from "fluent-ffmpeg";
import * as path from "path";
import { Readable } from "stream";


async function compress(input: string | Readable, output: string) {

  await new Promise((res, rej) => {
    console.log("started");
    FFMpeg(input)
      .size("1440x?")
      .addOptions(["-preset slow", "-crf 28", "-x264-params keyint=1"])
      .format("mp4")
      .on("error", rej)
      .on("end", (r) => {
        console.log("completed", r);
        res(r);
      })
      .save(output);
  });

}

const input = path.resolve(__dirname, "../", "input.mp4");
const output = path.resolve(__dirname, "output.mp4");


compress(input, output);

