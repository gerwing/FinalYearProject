module.exports = {
    Server: {
        dbName: "vote",
        dbUrl: "mongodb://localhost:27017/",
        port: 3000,
        host: "127.0.0.1"
    },
    Email: {
        user: "studentvoteapp@gmail.com",
        password: "christmashats34"
    },
    Folders: {
        views: "webapp/app",
        app: "webapp/app"
    },
    Redis: {
        port: 6379,
        host: "127.0.0.1",
        password: ""
    },
    Session: {
        secret: "christmas hat"
    }
}