const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
const packageDef = protoLoader.loadSync("helloworld.proto", {});
const grpcObject = grpc.loadPackageDefinition(packageDef);
const helloPackage = grpcObject.helloworld;

const server = new grpc.Server();
server.addService(helloPackage.Greeter.service, {
    "SayHello": sayHello
});
server.bind('0.0.0.0:40000', grpc.ServerCredentials.createInsecure());
console.log('Server running at http://127.0.0.1:40000');
server.start();

function sayHello(call, callback) {
    callback(null, {message: 'Hello ' + call.request.name});
}
