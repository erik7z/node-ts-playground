const app = require('./app');

app.listen(0, () => {
    console.log(`App running on dynamically assigned port.`);
});