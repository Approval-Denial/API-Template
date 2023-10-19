const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const fs = require("fs");
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

let dirs = fs.readdirSync("./src/api", { encoding: "utf8" });
dirs.forEach(dir => {
    let files = fs.readdirSync(`./src/api/${dir}`, { encoding: "utf8" }).filter(file => file.endsWith(".js"));
    files.forEach(function (file) {
        app.use(`/${dir}/${removeJsExtension(file)}`, require(`../api/${dir}/${file}`))
        pages.push({ url: `${`${`/${dir}/${removeJsExtension(file)}`}`}`, name: removeJsExtension(file), path: `/${dir}/${removeJsExtension(file)}` })
        logger({ title: "Server", header: "Loaded", content: "Loaded Page", args: [{ color: "whiteBright", body: `${`${`/${dir}/${removeJsExtension(file)}`}`}` }] });

    })
})

app.use((err, req, res, next) => res.status(500).json({ status: 500, message: "Server Error", error: err.stack }));
app.use((req, res, next) => { res.status(404).json({ status: 404, message: "You have probably been redirected to the wrong page, In 30 seconds you will be redirected to the homepage!", pages: pages }); });


http.listen(port, function (err) {
    if (err) return logger({ title: "Server", header: "Listen", content: "Server Start Failed!", args: [{ color: "whiteBright", body: "PORT: " + port }, { color: "red", body: "\n" + err }] });
    logger({ title: "Server", header: "Listen", content: "Server Successfully Started.", args: [{ color: "whiteBright", body: "PORT: " + port }] });
});