const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
const packageDef = protoLoader.loadSync("helloworld.proto", {});
const grpcObject = grpc.loadPackageDefinition(packageDef);
const helloPackage = grpcObject.helloworld;

const client = new helloPackage.Greeter('localhost:40000', grpc.credentials.createInsecure());

client.sayHello({name: "Vasya"}, (err, response) => {
    console.log("Greeting:", response.message);
});
