const ipLocation = require('ipLocation');

let MAX_ADDRESS_CACHE = 10;
let ADDRESS_BANK = {};

function onRequest(req, ipData) {
    if (!ipData.reserved) {
        console.log(`Received request from ${ipData.country.name}, ${ipData.region.name}, ${ipData.city}`);
        req.location = ipData;
    } else {
        console.error(`Received reserved request`);
    }
}

module.exports = function (req, res, next) {
    let ip = req.headers['X-Forwarded-For'] || req.connection.remoteAddress;
    if (ip === '::1') ip = '127.0.0.1';
    if (ip.startsWith('::ffff:')) ip = ip.substr(7);
    console.log(`[${ip}] ${req.method} ${req.get('host')}${req.url}`);
    req.location = {};
    if (ADDRESS_BANK[ip]) {
        onRequest(req, ADDRESS_BANK[ip]);
        next();
    } else {
        ipLocation(ip).then(data => {
            onRequest(req, data);
            ADDRESS_BANK[ip] = data;
            if (Object.keys(ADDRESS_BANK).length > MAX_ADDRESS_CACHE) delete ADDRESS_BANK[Object.keys(ADDRESS_BANK)[0]];
        }).catch(error => {
            console.error(`Failed to look up ${ip}: ${error.message}`);
        }).finally(() => {
            next();
        });
    }
};