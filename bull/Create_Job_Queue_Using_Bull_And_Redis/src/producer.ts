import { connectQueue } from "./config";

const init = async (data: any) => {
  return await connectQueue("request-json-file").add(data, {
    // jobId, uncoment this line if your want unique jobid
    removeOnComplete: true, // remove job if complete
    delay: 10000, // ms
    attempts: 3 // attempt if job is error retry 3 times
  });
};

const countryCode = ["ID", "RU", "TR", "IT"];

for (let i = 0; i < countryCode.length; i++) {
  init({
    message: `[PRODUCER] request to consumer with code '${countryCode[i]}'`,
    param: countryCode[i]
  }).then(res => {
    console.info(res.data.message);
  });
}
