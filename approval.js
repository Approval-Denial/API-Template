const { logger } = require("./src/helpers/functions/logger");

try {
    require("./src/structures/default.main")
} catch (error) {
    console.log(error)
    if (error) return logger({ title: "Server", header: "Starter", content: "Server Start Failed!", args: [{ color: "red", body: "\n" + error }] });

} 