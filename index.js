const fs = require('fs');
const express = require('express');
const addresses = require('./custom_modules/addresses');

const PORT = 80;

const app = express();

let websites = fs.readdirSync('sites/').filter(site => site !== 'shared');

function matchWebsite(origin) {
    for (let website of websites) {
        if (origin.toLowerCase().includes(website.toLowerCase())) return website;
    }
    return 'default';
}

app.use(addresses);
app.use((req, res, next) => {
    res.set('X-Powered-By', 'Love');
    next();
});
app.use(express.static('public'));

app.get('*', (req, res) => {
    const origin = req.get('host') | req.get('origin');
    if (origin) {
        const website = matchWebsite(origin);
        let path = `${__dirname}/sites/${website}/public${req.originalUrl}`;
        fs.exists(path, exists => {
            if (exists) {
                res.sendFile(path);
            } else {
                res.end();
            }
        });
    } else {
        res.end();
    }
});

app.listen(PORT, () => {
    console.log(`Server now listening on port ${PORT}`);
});