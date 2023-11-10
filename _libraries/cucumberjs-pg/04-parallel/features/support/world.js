const {setWorldConstructor, BeforeAll, AfterAll} = require('@cucumber/cucumber');
const app = require('../../src/app');
const supertest = require('supertest');

class CustomWorld {
    constructor() {
        this.request = supertest(app);
    }
}

setWorldConstructor(CustomWorld);

let server;

BeforeAll(function (done) {
    if (!server) {
        server = app.listen(3000, done);
    } else {
        done();
    }
});

AfterAll(function (done) {
    if (server) {
        server.close(() => {
            server = null;
            done();
        });
    } else {
        done();
    }
});
