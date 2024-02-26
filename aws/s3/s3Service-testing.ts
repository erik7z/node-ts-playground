// process.env.S3_ACCESS_KEY_ID='AKIAWQJN53TKVG52G5PA';
// process.env.S3_SECRET_KEY='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';
// process.env.S3_BUCKET_NAME='dev-crm-rabbitmq-s3-s3-eu-central-1';
// process.env.S3_REGION='eu-central-1';
import { S3Service } from "./src/infrastructure/s3Service";
import crypto from "crypto";

(async () => {
    try {
        console.log('Started');
        const data = {
            joke: 'ha-ha',
            createdAt: new Date().toISOString(),
        }
        console.log(`Total Count ${await S3Service.GetTotalCount()}`);
        // await S3Service.Save(`messages/${Date.now()}-${crypto.randomUUID()}.json`, JSON.stringify(data));
        // let messages = await S3Service.GetByCount(100);
        // console.log('messages', messages.map((x => ({key: x.key, data: JSON.stringify(data)}))));
        // console.log('deleting');
        // await S3Service.DeleteByKeys(messages.map(x=> x.key));
        // console.log('deleted');
        // messages = await S3Service.GetByCount(100);
        // console.log('messamessages after deleteges', messages.map((x => ({key: x.key, data: JSON.stringify(data)}))));
        // console.log('Finished');
    } catch (err) {
        console.log(`Error in main handler ${JSON.stringify(err)}`, err);
    }
})()
