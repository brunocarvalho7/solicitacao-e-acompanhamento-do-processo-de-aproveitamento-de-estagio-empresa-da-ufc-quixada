const env = process.env.NODE_ENV;

require('dotenv').config({
    path: env === "prod" ? ".env" : `.env.${env}`
});

module.exports = {
    isProductionMode: env === "prod",
    db: {
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        protocol: process.env.DB_PROTOCOL,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        name: process.env.DB_NAME
    },
    token: {
        privateKey: process.env.TOKEN_SECRET,
        validity: process.env.TOKEN_VALIDITY
    }
}
