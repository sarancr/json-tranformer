
//Imports
const fs = require('fs');
const utils = require('./utils.js');

//Input and Output directory locations
const INPUT_DIR = './input'
const OUTPUT_DIR = './output';

//Read command line argument for input filename
const filename = process.argv[2];

//Throw error if filename is not prpvided in the command line input
if(!filename){
    console.log("Error:Filename is not provided. Please provide the filename");
    return;
}

//Read input JSON file
const data = JSON.parse(fs.readFileSync(INPUT_DIR + "/" + filename, 'utf8'));

//Ouptut will be stored here
const output = {};

//Document root name
let docroot;

//Split function splits the JSON object
function split(doc, name) {
    const keys = Object.keys(doc);
    const extractedDoc = {};
    keys.forEach((key, index) => {
        if(!docroot)
          docroot = key;
        const val = doc[key];
        if (val instanceof Array) { // Array type
            val.forEach((arrDoc, index) => {
                arrDoc.__index = index;
                if (!arrDoc.id) arrDoc.id = doc.id;
                split(arrDoc, key);
            });
        } else if (val instanceof Object) { // Object type
            val.id = doc.id;
            split(val, key);
        } else {   //Literals
            extractedDoc[key] = val;
        }
    });

    // Push extracted document into output
    if (!utils.isEmpty(extractedDoc)){
        const docname = (docroot === name) ? name : docroot+"_"+name;
        addToOutput(docname, extractedDoc);
    }
}

// Adding document into output Object
function addToOutput(name, doc) {
    let arr = output[name];
    if (arr && arr != null) {
      if(!doc.__index) { doc.__index = arr.length; }
        arr.push(doc);
    }
    else {
        arr = [];
        if(!doc.__index) { doc.__index = 0; }
        arr.push(doc);
        output[name] = arr;
    }
}


function start() {
    split(data);
}

//Execution starts here
start();

//Write the output object into file
utils.writeOuput(output, OUTPUT_DIR, docroot);
