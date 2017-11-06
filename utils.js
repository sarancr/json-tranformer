const path = require('path');
const fs = require('fs');

const getOutputFilePath = (outputdir, filename, extension) =>{
    const filepath = outputdir + "/" + filename + extension;
    console.log(filepath);
    ensureDirectoryExistence(filepath);
    return filepath;
}

//Utility to check whether an object is empty {}
const isEmpty = (obj) => {
    return Object.keys(obj).length === 0 ? true : false;
}

const writeOuput = (output, outputDir, documentRoot)=> {
    Object.keys(output).forEach(key => { 
        console.log(key + "\n-----------------------\n");
        console.log(output[key]);
        console.log("\n\n");
        fs.writeFile(getOutputFilePath(outputDir +"/"+documentRoot, key, ".json"),JSON.stringify(output[key], null, 2), (err)=> { if(err) throw err});
    });
}
const ensureDirectoryExistence = (filePath) => {
    var dirname = path.dirname(filePath);
    if (fs.existsSync(dirname)) {
      return true;
    }
    ensureDirectoryExistence(dirname);
    fs.mkdirSync(dirname);
  }

module.exports = {
    writeOuput,
    isEmpty
}