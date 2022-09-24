/* eslint-disable no-console */
import { handlerFailure, handlerCompleted, handlerStalled } from "./handler";
import { connectQueue } from "./config";
import * as fs from "fs";
import path from "path";

const queue = connectQueue("request-json-file");

/*
  @description jobs processing function
*/
const processJob = (job: any, done: any) => {
  try {
    console.info(`running job! with id ${job.id}`);
    const obj = JSON.parse(fs.readFileSync(path.join("countries.json"), "utf8"));
    const data = obj.find((item: any) => {
      return item.code == job.data.param;
    });

    fs.writeFile(`output/${job.data.param}.json`, JSON.stringify(data), function(err) {
        if (err) throw err;
      }
    );

    done(null, "succes");
  } catch (error) {
    done(null, error);
  }
};

const initJob = () => {
  console.info("job is working!");

  queue.process(processJob);

  queue.on("failed", handlerFailure);
  queue.on("completed", handlerCompleted);
  queue.on("stalled", handlerStalled);
};

initJob();
