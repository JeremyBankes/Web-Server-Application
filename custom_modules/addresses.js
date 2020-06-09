const ipLocation = require('ipLocation');

module.exports = {
    use: (addLocationToRequest) => {
        return function (req, res, next) {
            let ip = req.headers['X-Forwarded-For'] || req.connection.remoteAddress;
            if (ip === '::1') ip = '127.0.0.1';
            if (ip.startsWith('::ffff:')) ip = ip.substr(7);
            console.log(`[${ip}] ${req.method} ${req.get('host')}${req.url}`);
            req.location = {};
            ipLocation(ip).then(data => {
                if (!data.reserved) {
                    console.log(`Received request from ${data.country.name}, ${data.region.name}, ${data.city}`);
                    if (addLocationToRequest) req.location = data;
                } else {
                    console.error(`Received reserved request`);
                }
            }).catch(error => {
                console.error(`Failed to look up ${ip}: ${error.message}`);
            }).finally(() => {
                if (addLocationToRequest) next();
            });
            if (!addLocationToRequest) next();
        };
    }
};