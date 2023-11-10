const { Given, When, Then } = require('@cucumber/cucumber');

let response;

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
