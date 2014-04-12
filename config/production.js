#!/bin/env node
module.exports = {
    Server: {
        dbName: "vote",
        dbUrl: process.env.OPENSHIFT_MONGODB_DB_URL,
        port: process.env.OPENSHIFT_NODEJS_PORT,
        host: process.env.OPENSHIFT_NODEJS_IP
    },
    Folders: {
        views: "webapp/dist",
        app: "webapp/dist"
    },
    Redis: {
        port: process.env.OPENSHIFT_REDIS_PORT,
        host: process.env.OPENSHIFT_REDIS_HOST,
        password: process.env.REDIS_PASSWORD
    }
}