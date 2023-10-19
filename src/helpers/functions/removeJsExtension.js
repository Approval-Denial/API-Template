function removeJsExtension(fileName) {
    if (fileName.endsWith(".js")) {
        return fileName.slice(0, -3);
    } else {
        return fileName;
    }
}
module.exports = { removeJsExtension }