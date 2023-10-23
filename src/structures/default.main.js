const { FileLister } = require('../modules/listFilesRecursively');
const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const app = express();
const http = require("http").createServer(app);
const passport = require("passport");
const moment = require("moment");

require("moment-duration-format");
moment.locale("tr");

const { web: { secret, port } } = require("../conf/settings");
const { logger } = require("../helpers/functions/logger");
const { removeJsExtension } = require("../helpers/functions/removeJsExtension");

var pages = []

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ resave: false, saveUninitialized: false, secret: secret }));
app.use(passport.initialize());
app.use(passport.session());

try {
    const lister = new FileLister();
    lister.listFilesRecursively("./src/api");
    const files = lister.getResult().filter(file => file.endsWith('.js')).map(file => file.replace(/\\/g, '/'));
    files.forEach(function (file) {
        app.use(removeJsExtension(file.replace("src/", "/")), require(file.replace("src/", "../")))
        pages.push({ url: `${removeJsExtension(file.replace("src/", "/"))}`, name: removeJsExtension(file), path: file.replace("src/", "") })
        logger({ title: "Server", header: "Loaded", content: "Loaded Page", args: [{ color: "whiteBright", body: `${removeJsExtension(file.replace("src/", ""))}` }] });
    })
} catch (error) {
    logger({ title: "Server", header: "Loaded", content: "Loaded Page", args: [{ color: "whiteBright", body: `${error}` }] });
}

app.use((err, req, res, next) => res.status(500).json({ status: 500, message: "Server Error", error: err.stack }));
app.use((req, res, next) => { res.status(404).json({ status: 404, message: "You have probably been redirected to the wrong page,", pages: pages }); });


http.listen(port, function (err) {
    if (err) return logger({ title: "Server", header: "Listen", content: "Server Start Failed!", args: [{ color: "whiteBright", body: "PORT: " + port }, { color: "red", body: "\n" + err }] });
    logger({ title: "Server", header: "Listen", content: "Server Successfully Started.", args: [{ color: "whiteBright", body: "PORT: " + port }] });
});