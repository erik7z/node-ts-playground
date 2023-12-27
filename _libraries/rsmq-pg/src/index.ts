import RedisSMQ from "rsmq"
const rsmq = new RedisSMQ({ host: "127.0.0.1", port: 63790, ns: "rsmq", realtime: true })

rsmq.sendMessage({ qname: "worker_queue", message: "testMessge2" }, function(err, resp) {
  if (err) {
    console.error("Socket error", err)
    return
  }

  console.log(resp)
  return
})
