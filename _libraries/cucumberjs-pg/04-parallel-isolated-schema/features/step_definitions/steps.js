const { Given, When, Then } = require('@cucumber/cucumber');
const pool = require("../../src/db");

let response;

Given(/^database is empty$/, async function () {
    await pool.query('TRUNCATE TABLE your_table');
});

When('I make a GET request to {string}', async function (path) {
    response = await this.request.get(path);
});

Then('the response status code should be 200', function () {
    if (response.status !== 200) {
        throw new Error(`Expected status code 200 but got ${response.status}`);
    }
});

Then('the response should contain data', function () {
    if (response.body.length === 0) {
        throw new Error('Response does not contain data');
    }
});
Then(/^the response should not contain data$/, function () {
    if (response.body.length !== 0) {
        throw new Error('Response should not contain data');
    }
});

When('I send a POST request to {string} with the data: {string}', async function (path, data) {
    response = await this.request.post(path).send({ data });
});

Then('the response should contain {string}', function (expectedData) {
    if (!response.body.data.includes(expectedData)) {
        throw new Error(`Expected data to contain ${expectedData} but got ${response.body.data}`);
    }
});
