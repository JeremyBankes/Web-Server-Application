const express = require('express');
const addresses = require('./custom_modules/addresses');

const PORT = 80;

const app = express();

app.use(addresses.use(true));
app.use((req, res, next) => {
    console.log(req.location);
    res.set('X-Powered-By', 'Love');
    next();
});
app.use(express.static('websites/shared/'));

app.listen(PORT, () => {
    console.log(`Server now listening on port ${PORT}`);
});