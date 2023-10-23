const fs = require("fs");
const path = require("path");

class FileLister {
    constructor() {
        this.result = [];
    }
    listFilesRecursively(directoryPath) {
        var result = this.result
        const files = fs.readdirSync(directoryPath)
        files.forEach(async file => {
            const filePath = path.join(directoryPath, file);
            if (fs.statSync(filePath).isDirectory()) {
                result.push(filePath);
                this.listFilesRecursively(filePath);
            } else {
                result.push(filePath)
            }
        })
    }

    getResult() { 
        return this.result
     }
}

module.exports = { FileLister }