import RSMQWorker from "rsmq-worker"

const worker = new RSMQWorker("worker_queue", { host: "localhost", port: 63790 })

worker.on("message", async (msg, next, id) => {
  // process your message
  console.log("Message id : " + id)
  console.log(msg)
  // await new Promise((res) => setTimeout(res, 5000))
  console.log("Processed!!!")
  worker.del(id, (e) => {
    console.log('deleted')
    console.log(e)
  })
  next()
})

// optional error listeners
worker.on("error", function(err, msg) {
  console.log("ERROR", err, msg.id)
})
worker.on("exceeded", function(msg) {
  console.log("EXCEEDED", msg.id)
})
worker.on("timeout", function(msg) {
  console.log("TIMEOUT", msg.id, msg.rc)
})

worker.start()
